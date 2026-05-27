import { supabase } from "@/integrations/supabase/client";
import jsPDF from "jspdf";

export type FormKind =
  | "Homepage Quote"
  | "Trucking Quote"
  | "Auto Insurance Quote"
  | "Health Insurance Quote"
  | "Home Insurance Quote"
  | "Motorcycle Insurance Quote"
  | "Boat Insurance Quote"
  | "RV Insurance Quote"
  | "Contact Request"
  | "Claim Submission"
  | "Policy Cancellation"
  | "Policy Endorsement";

export interface FormSection {
  title: string;
  rows: Array<[string, unknown]>;
}

export interface EmailAttachment {
  filename: string;
  contentBase64: string;
  contentType?: string;
}

export interface SendQuoteEmailInput {
  formKind: FormKind;
  source: string;
  primaryName: string; // company or customer name used in subject + filename
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  sections: FormSection[];
  attachments?: EmailAttachment[];
}

const SITE_URL = "custominsurance.agency";

const subjectPrefix: Record<FormKind, string> = {
  "Homepage Quote": "New Homepage Quote",
  "Trucking Quote": "New Trucking Quote",
  "Auto Insurance Quote": "Auto Insurance Quote",
  "Health Insurance Quote": "Health Insurance Quote",
  "Home Insurance Quote": "Home Insurance Quote",
  "Motorcycle Insurance Quote": "Motorcycle Insurance Quote",
  "Boat Insurance Quote": "Boat Insurance Quote",
  "RV Insurance Quote": "RV Insurance Quote",
  "Contact Request": "New Contact Request",
  "Claim Submission": "New Claim Submission",
  "Policy Cancellation": "Policy Cancellation Request",
  "Policy Endorsement": "Policy Endorsement Request",
};

const filenamePrefix: Record<FormKind, string> = {
  "Homepage Quote": "Quote",
  "Trucking Quote": "Quote",
  "Auto Insurance Quote": "AutoQuote",
  "Health Insurance Quote": "HealthQuote",
  "Home Insurance Quote": "HomeQuote",
  "Motorcycle Insurance Quote": "MotorcycleQuote",
  "Boat Insurance Quote": "BoatQuote",
  "RV Insurance Quote": "RVQuote",
  "Contact Request": "Contact",
  "Claim Submission": "Claim",
  "Policy Cancellation": "Cancellation",
  "Policy Endorsement": "Endorsement",
};

const today = () => {
  const d = new Date();
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
};

const todayShort = () => {
  const d = new Date();
  return d.toISOString().slice(0, 10);
};

const sanitize = (s: string) => s.replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "") || "Submission";

const renderVal = (v: unknown): string => {
  if (v === null || v === undefined || v === "") return "—";
  if (Array.isArray(v)) {
    if (!v.length) return "—";
    if (typeof v[0] === "object") {
      return v
        .map(
          (item, i) =>
            `#${i + 1}: ` +
            Object.entries(item as Record<string, unknown>)
              .map(([k, val]) => `${k}: ${val ?? "—"}`)
              .join(", "),
        )
        .join(" | ");
    }
    return v.join(", ");
  }
  if (typeof v === "object") {
    return Object.entries(v as Record<string, unknown>)
      .map(([k, val]) => `${k}: ${val ?? "—"}`)
      .join(", ");
  }
  return String(v);
};

function buildPdfBase64(input: SendQuoteEmailInput): string {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  let y = margin;

  const ensure = (h: number) => {
    if (y + h > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  // Header
  doc.setFillColor(15, 42, 66);
  doc.rect(0, 0, pageW, 80, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Custom Insurance Agency", margin, 38);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(203, 213, 225);
  doc.text(`${input.formKind} • ${today()}`, margin, 58);
  y = 110;

  doc.setTextColor(13, 43, 43);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  ensure(20);
  doc.text(input.primaryName || input.customerName || "Submission", margin, y);
  y += 18;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  if (input.customerPhone) { ensure(14); doc.text(`Phone: ${input.customerPhone}`, margin, y); y += 14; }
  if (input.customerEmail) { ensure(14); doc.text(`Email: ${input.customerEmail}`, margin, y); y += 14; }
  y += 6;

  for (const section of input.sections) {
    ensure(28);
    doc.setDrawColor(42, 191, 191);
    doc.setLineWidth(2);
    doc.line(margin, y, margin + 30, y);
    y += 12;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(13, 43, 43);
    doc.text(section.title, margin, y);
    y += 14;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);

    for (const [label, value] of section.rows) {
      const valStr = renderVal(value);
      const labelW = 160;
      const wrapped = doc.splitTextToSize(valStr, pageW - margin * 2 - labelW);
      const blockH = Math.max(14, wrapped.length * 12 + 4);
      ensure(blockH);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(13, 43, 43);
      doc.text(`${label}:`, margin, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      doc.text(wrapped, margin + labelW, y);
      y += blockH;
    }
    y += 8;
  }

  // Footer on last page
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  const footer = `Submitted via ${SITE_URL} on ${new Date().toLocaleString("en-US", { timeZone: "America/Chicago" })}`;
  doc.text(footer, margin, pageH - 24);

  const dataUri = doc.output("datauristring"); // data:application/pdf;filename=...;base64,XXXX
  const base64 = dataUri.split(",").pop() || "";
  return base64;
}

function buildSubject(input: SendQuoteEmailInput) {
  return `${subjectPrefix[input.formKind]} — ${input.primaryName || input.customerName || "New"} — ${today()}`;
}

function buildFilename(input: SendQuoteEmailInput) {
  return `${filenamePrefix[input.formKind]}-${sanitize(input.primaryName || input.customerName || "Submission")}-${todayShort()}.pdf`;
}

export async function sendQuoteEmail(input: SendQuoteEmailInput) {
  console.log("[sendQuoteEmail] invoking edge function", {
    formKind: input.formKind,
    source: input.source,
    primaryName: input.primaryName,
    customerEmail: input.customerEmail,
    sections: input.sections.map((s) => s.title),
  });
  const pdfBase64 = buildPdfBase64(input);
  const filename = buildFilename(input);
  const subject = buildSubject(input);
  const attachments = [
    { filename, contentBase64: pdfBase64, contentType: "application/pdf" },
    ...(input.attachments ?? []),
  ];

  // Flatten sections to fields object for HTML email rendering
  const fields: Record<string, unknown> = {};
  for (const section of input.sections) {
    for (const [k, v] of section.rows) {
      fields[`[${section.title}] ${k}`] = v;
    }
  }

  const { data, error } = await supabase.functions.invoke("send-quote-email", {
    body: {
      subject,
      source: input.source,
      formKind: input.formKind,
      primaryName: input.primaryName,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone,
      sections: input.sections,
      fields,
      attachment: { filename, contentBase64: pdfBase64 },
      attachments,
    },
  });
  if (error) {
    console.error("[sendQuoteEmail] invoke error", error);
    throw error;
  }
  if (data && (data as { error?: string }).error) {
    console.error("[sendQuoteEmail] function returned error", data);
    throw new Error((data as { error: string }).error);
  }
  console.log("[sendQuoteEmail] success", data);
  return data;
}

export const SUCCESS_MSG = "Thank you! We will contact you within 24 hours.";
export const ERROR_MSG = "Something went wrong. Please call us at 708-810-1955.";
