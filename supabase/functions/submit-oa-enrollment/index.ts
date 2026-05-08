import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface Payload {
  driverName: string;
  driverEmail?: string;
  fileName: string;
  pdfBase64: string; // raw base64, no data: prefix
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = (await req.json()) as Payload;
    if (!body?.pdfBase64 || !body?.fileName || !body?.driverName) {
      return json({ error: "Missing required fields" }, 400);
    }
    if (body.pdfBase64.length > 8_000_000) {
      return json({ error: "PDF too large" }, 413);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey);

    // Decode base64 → bytes
    const bin = atob(body.pdfBase64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);

    const safeName = body.fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}_${safeName}`;

    const { error: upErr } = await admin.storage
      .from("enrollment-pdfs")
      .upload(path, bytes, { contentType: "application/pdf", upsert: false });
    if (upErr) return json({ error: `Upload failed: ${upErr.message}` }, 500);

    // 30-day signed URL
    const { data: signed, error: sErr } = await admin.storage
      .from("enrollment-pdfs")
      .createSignedUrl(path, 60 * 60 * 24 * 30);
    if (sErr || !signed) return json({ error: `Sign failed: ${sErr?.message}` }, 500);

    const downloadUrl = signed.signedUrl;

    // Try sending notification email via Lovable Email transactional sender.
    // If the email infra isn't set up yet, we don't fail the submission.
    let emailSent = false;
    let emailError: string | null = null;
    try {
      const { error: invokeErr } = await admin.functions.invoke("send-transactional-email", {
        body: {
          templateName: "oa-enrollment-submission",
          recipientEmail: "info@custominsure.com",
          idempotencyKey: `oa-enroll-${path}`,
          templateData: {
            driverName: body.driverName,
            driverEmail: body.driverEmail ?? "",
            downloadUrl,
            fileName: safeName,
          },
        },
      });
      if (invokeErr) emailError = invokeErr.message;
      else emailSent = true;
    } catch (e) {
      emailError = e instanceof Error ? e.message : String(e);
    }

    return json({ success: true, downloadUrl, emailSent, emailError });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}