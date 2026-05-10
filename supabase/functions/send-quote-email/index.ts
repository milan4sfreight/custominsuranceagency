const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface Section { title: string; rows: Array<[string, unknown]>; }

interface Payload {
  subject: string;
  source: string;
  formKind?: string;
  primaryName?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  sections?: Section[];
  fields?: Record<string, unknown>;
  attachment?: { filename: string; contentBase64: string };
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderValue(v: unknown): string {
  if (v === null || v === undefined || v === "") return "<em style='color:#999'>—</em>";
  if (Array.isArray(v)) {
    if (v.length === 0) return "<em style='color:#999'>—</em>";
    if (typeof v[0] === "object") {
      return v
        .map(
          (item, i) =>
            `<div style="margin:6px 0;padding:8px 12px;background:#f5f7fa;border-radius:6px;"><strong>#${
              i + 1
            }</strong><br/>${renderObject(item as Record<string, unknown>)}</div>`,
        )
        .join("");
    }
    return escapeHtml(v.join(", "));
  }
  if (typeof v === "object") return renderObject(v as Record<string, unknown>);
  return escapeHtml(String(v));
}

function renderObject(obj: Record<string, unknown>): string {
  return Object.entries(obj)
    .map(
      ([k, v]) =>
        `<div style="margin:2px 0;font-size:13px;"><span style="color:#475569;">${escapeHtml(
          k,
        )}:</span> ${renderValue(v)}</div>`,
    )
    .join("");
}

function buildHtml(p: Payload): string {
  const ts = new Date().toLocaleString("en-US", {
    timeZone: "America/Chicago",
    dateStyle: "full",
    timeStyle: "short",
  });

  // Prefer structured sections; fall back to flat fields
  let body = "";
  if (p.sections && p.sections.length) {
    body = p.sections
      .map((section) => {
        const rows = section.rows
          .map(
            ([k, v]) => `
              <tr>
                <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;font-weight:600;color:#0d2b2b;width:40%;vertical-align:top;">${escapeHtml(k)}</td>
                <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;color:#334155;">${renderValue(v)}</td>
              </tr>`,
          )
          .join("");
        return `
          <h3 style="margin:24px 0 8px;font-size:14px;color:#0d2b2b;text-transform:uppercase;letter-spacing:1px;border-left:3px solid #2abfbf;padding-left:10px;">${escapeHtml(section.title)}</h3>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">${rows}</table>`;
      })
      .join("");
  } else if (p.fields) {
    const rows = Object.entries(p.fields)
      .map(
        ([k, v]) => `
          <tr>
            <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;font-weight:600;color:#0d2b2b;width:40%;vertical-align:top;">${escapeHtml(k)}</td>
            <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#334155;">${renderValue(v)}</td>
          </tr>`,
      )
      .join("");
    body = `<table style="width:100%;border-collapse:collapse;font-size:14px;">${rows}</table>`;
  }

  const headline = p.primaryName || p.customerName || "New submission";

  return `<!doctype html><html><body style="margin:0;padding:0;background:#f5f7fa;font-family:Arial,sans-serif;">
    <div style="max-width:680px;margin:0 auto;padding:24px;background:#ffffff;">
      <div style="background:linear-gradient(135deg,#0f2a42 0%,#173b5d 100%);padding:24px;border-radius:8px 8px 0 0;color:#fff;">
        <h1 style="margin:0;font-size:22px;">${escapeHtml(p.subject)}</h1>
        <p style="margin:6px 0 0;font-size:13px;color:#cbd5e1;">Submitted from: <strong>${escapeHtml(p.source)}</strong></p>
      </div>
      <div style="padding:24px;border:1px solid #e2e8f0;border-top:0;border-radius:0 0 8px 8px;">
        <p style="font-size:20px;margin:0 0 10px;"><strong>${escapeHtml(headline)}</strong></p>
        ${p.customerPhone ? `<p style="font-size:16px;margin:4px 0;color:#0d2b2b;">📞 <strong>${escapeHtml(p.customerPhone)}</strong></p>` : ""}
        ${p.customerEmail ? `<p style="font-size:16px;margin:4px 0;color:#0d2b2b;">✉️ <strong>${escapeHtml(p.customerEmail)}</strong></p>` : ""}
        <hr style="border:0;border-top:1px solid #e2e8f0;margin:16px 0;"/>
        ${body}
        <hr style="border:0;border-top:1px solid #e2e8f0;margin:24px 0 12px;"/>
        <p style="font-size:12px;color:#64748b;margin:4px 0;">This submission was made via <strong>custominsurance.agency</strong> on ${escapeHtml(ts)}.</p>
        <p style="font-size:12px;color:#64748b;margin:4px 0;">📎 PDF with complete details is attached.</p>
      </div>
    </div>
  </body></html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) return json({ error: "Email service not configured" }, 500);

    const body = (await req.json()) as Payload;
    console.log("[send-quote-email] received submission", {
      subject: body?.subject,
      source: body?.source,
      formKind: body?.formKind,
      primaryName: body?.primaryName,
      customerEmail: body?.customerEmail,
      hasAttachment: !!body?.attachment?.contentBase64,
      sectionsCount: body?.sections?.length ?? 0,
    });
    if (!body?.subject) return json({ error: "Missing subject" }, 400);

    const html = buildHtml(body);

    const attachments = body.attachment?.contentBase64
      ? [{ filename: body.attachment.filename, content: body.attachment.contentBase64 }]
      : undefined;

    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "Custom Insurance Agency <Quotes@custominsure.com>",
        to: ["Quotes@custominsure.com"],
        reply_to: body.customerEmail ? [body.customerEmail] : undefined,
        subject: body.subject,
        html,
        attachments,
      }),
    });

    const data = await r.json();
    if (!r.ok) {
      console.error("[send-quote-email] Resend error", { status: r.status, data });
      return json({ error: data?.message || "Email send failed" }, 502);
    }

    console.log("[send-quote-email] sent successfully", { id: data?.id });
    return json({ success: true, id: data?.id });
  } catch (e) {
    console.error(e);
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
