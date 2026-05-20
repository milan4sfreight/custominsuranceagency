import { useRef, useState } from "react";

import SignatureCanvas from "react-signature-canvas";

import { jsPDF } from "jspdf";

import html2canvas from "html2canvas";

import { Loader2 } from "lucide-react";

import { Navbar } from "@/components/site/Navbar";

import { Footer } from "@/components/site/Footer";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { toast } from "@/hooks/use-toast";

import { supabase } from "@/integrations/supabase/client";

import logo from "@/assets/logo.png";

import { SEO } from "@/components/SEO";

const HERO_IMG = "https://images.unsplash.com/photo-1450101499163-c8848c66ca85";

const TEAL = "#2abfbf";

const NAVY = "#173b5d";

const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",

  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",

  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",

  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
  "DC",
];

type DriverType = "Owner Operator (1099)" | "Contract Driver (1099)";

interface FormState {
  enrollmentDate: string;

  motorCarrier: string;

  policyNumber: string;

  driverName: string;

  dob: string;

  address: string;

  cdlNumber: string;

  cdlState: string;

  email: string;

  beneficiaryName: string;

  beneficiaryRelationship: string;

  beneficiaryContact: string;

  driverType: DriverType | "";

  signatureDate: string;
}

const initialState: FormState = {
  enrollmentDate: "",

  motorCarrier: "",

  policyNumber: "",

  driverName: "",

  dob: "",

  address: "",

  cdlNumber: "",

  cdlState: "",

  email: "",

  beneficiaryName: "",

  beneficiaryRelationship: "",

  beneficiaryContact: "",

  driverType: "",

  signatureDate: new Date().toISOString().slice(0, 10),
};

const inputBase: React.CSSProperties = {
  background: "#ffffff",

  border: "1px solid #d1d5db",

  borderRadius: 6,

  padding: "10px 14px",

  color: "#0d2b2b",

  width: "100%",

  fontSize: 16,

  outline: "none",

  fontFamily: "Inter, sans-serif",

  transition: "border-color .15s ease",
};

const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = TEAL;
};

const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = "#d1d5db";
};

const fieldProps = { style: inputBase, onFocus: handleFocus, onBlur: handleBlur };

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label
      className="mb-2 block"
      style={{ color: NAVY, fontSize: 13, fontWeight: 500, fontFamily: "Inter, sans-serif" }}
    >
      {children}

      {required && <span style={{ color: "#dc2626", marginLeft: 4 }}>*</span>}
    </label>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h3
        className="mb-6 pb-3 uppercase"
        style={{
          color: NAVY,

          fontSize: 13,

          letterSpacing: "0.08em",

          borderBottom: "1px solid #e5e7eb",

          fontWeight: 700,

          fontFamily: "Inter, sans-serif",
        }}
      >
        {title}
      </h3>

      <div className="flex flex-col gap-6">{children}</div>
    </div>
  );
}

const addBtnStyle: React.CSSProperties = {
  border: `1px dashed ${TEAL}`,

  color: TEAL,

  background: "transparent",

  fontFamily: "'Barlow', sans-serif",

  fontWeight: 600,

  fontSize: 14,

  borderRadius: 8,

  padding: "10px 20px",

  cursor: "pointer",
};

const OccAccidentEnrollment = () => {
  const [form, setForm] = useState<FormState>(initialState);

  const [submitting, setSubmitting] = useState(false);

  const [result, setResult] = useState<{ url: string; fileName: string } | null>(null);

  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  const sigRef = useRef<SignatureCanvas>(null);

  const printRef = useRef<HTMLDivElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((s) => ({ ...s, [key]: value }));

  const clearSignature = () => sigRef.current?.clear();

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    setAttachedFiles((prev) => [...prev, ...files]);

    e.target.value = "";
  };

  const removeFile = (i: number) => setAttachedFiles((prev) => prev.filter((_, idx) => idx !== i));

  const validate = (): string | null => {
    const required: [keyof FormState, string][] = [
      ["enrollmentDate", "Driver Enrollment Date"],

      ["motorCarrier", "Motor Carrier"],

      ["policyNumber", "Policy Number"],

      ["driverName", "Covered Driver Name"],

      ["dob", "Date of Birth"],

      ["address", "Address"],

      ["cdlNumber", "CDL #"],

      ["cdlState", "CDL State"],

      ["email", "Email Address"],

      ["beneficiaryName", "Beneficiary Name"],

      ["beneficiaryRelationship", "Beneficiary Relationship"],

      ["beneficiaryContact", "Beneficiary Contact Info"],

      ["driverType", "Driver Type"],

      ["signatureDate", "Signature Date"],
    ];

    for (const [k, label] of required) if (!String(form[k]).trim()) return `${label} is required`;

    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Please enter a valid email address";

    if (sigRef.current?.isEmpty()) return "Please sign the form before submitting";

    return null;
  };

  const generatePdf = async (): Promise<{ base64: string; fileName: string }> => {
    if (!printRef.current) throw new Error("Print area missing");

    const canvas = await html2canvas(printRef.current, {
      scale: 2,

      backgroundColor: "#ffffff",

      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "letter" });

    const pageW = pdf.internal.pageSize.getWidth();

    const pageH = pdf.internal.pageSize.getHeight();

    const margin = 24;

    const imgW = pageW - margin * 2;

    const imgH = (canvas.height * imgW) / canvas.width;

    if (imgH <= pageH - margin * 2) {
      pdf.addImage(imgData, "PNG", margin, margin, imgW, imgH);
    } else {
      const pageHeightPx = ((pageH - margin * 2) * canvas.width) / imgW;

      let rendered = 0;

      while (rendered < canvas.height) {
        const sliceCanvas = document.createElement("canvas");

        sliceCanvas.width = canvas.width;

        sliceCanvas.height = Math.min(pageHeightPx, canvas.height - rendered);

        const ctx = sliceCanvas.getContext("2d")!;

        ctx.drawImage(canvas, 0, rendered, canvas.width, sliceCanvas.height, 0, 0, canvas.width, sliceCanvas.height);

        const sliceData = sliceCanvas.toDataURL("image/png");

        const sliceH = (sliceCanvas.height * imgW) / canvas.width;

        if (rendered > 0) pdf.addPage();

        pdf.addImage(sliceData, "PNG", margin, margin, imgW, sliceH);

        rendered += sliceCanvas.height;
      }
    }

    const safeName = form.driverName.replace(/[^a-zA-Z0-9]+/g, "_");

    const fileName = `OA_Enrollment_${safeName}_${form.signatureDate}.pdf`;

    const dataUri = pdf.output("datauristring");

    const base64 = dataUri.split(",")[1] ?? "";

    return { base64, fileName };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const err = validate();

    if (err) {
      toast({ title: "Please complete the form", description: err, variant: "destructive" });

      return;
    }

    setSubmitting(true);

    try {
      const { base64, fileName } = await generatePdf();

      const { data, error } = await supabase.functions.invoke("submit-oa-enrollment", {
        body: {
          driverName: form.driverName,

          driverEmail: form.email,

          fileName,

          pdfBase64: base64,
        },
      });

      if (error) throw error;

      const url: string | undefined = (data as any)?.downloadUrl;

      if (!url) throw new Error("No download URL returned");

      setResult({ url, fileName });

      toast({
        title: "Enrollment submitted",

        description: (data as any)?.emailSent
          ? "Your form was sent to our team. You can also download a copy."
          : "Your form was saved. Download your copy below.",
      });
    } catch (e) {
      toast({
        title: "Submission failed",

        description: e instanceof Error ? e.message : "Please try again.",

        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full" style={{ background: "#ffffff" }}>
      <SEO
        title="OCC/ACC Enrollment | Custom Insurance Agency"
        description="Digital Wesco Occupational Accident enrollment form. Complete, sign, and submit online."
      />

      <Navbar />

      {/* HERO */}

      <section
        className="relative flex h-[220px] md:h-[300px] w-full items-center justify-center pt-16"
        style={{ backgroundImage: `url(${HERO_IMG})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.55)" }} />

        <div className="relative z-10 px-6 text-center">
          <h1
            style={{
              color: "#ffffff",

              fontFamily: "'Barlow', sans-serif",

              fontWeight: 700,

              fontSize: "clamp(36px, 5vw, 52px)",

              lineHeight: 1.1,
            }}
          >
            Occupational Accident Enrollment
          </h1>

          <p style={{ color: "rgba(255,255,255,0.75)", marginTop: 10, fontFamily: "Inter, sans-serif", fontSize: 16 }}>
            Wesco Insurance — OA Enrollment Form
          </p>
        </div>
      </section>

      <main style={{ padding: "64px 24px", background: "#ffffff" }}>
        <div className="mx-auto" style={{ maxWidth: 760 }}>
          {result ? (
            <div style={{ textAlign: "center", padding: "48px 24px" }}>
              <h2 style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700, fontSize: 28, color: NAVY }}>
                Thank you, {form.driverName.split(" ")[0]}!
              </h2>

              <p style={{ fontFamily: "Inter, sans-serif", color: "#6b7280", marginTop: 8 }}>
                Your enrollment form has been submitted. You can download a copy below.
              </p>

              <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24 }}>
                <a
                  href={result.url}
                  download={result.fileName}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: TEAL,

                    color: "#fff",

                    borderRadius: 8,

                    padding: "12px 28px",

                    fontFamily: "'Barlow', sans-serif",

                    fontWeight: 700,

                    textDecoration: "none",
                  }}
                >
                  Download PDF
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setResult(null);
                    setForm(initialState);
                    setAttachedFiles([]);
                  }}
                  style={{
                    border: "1.5px solid #d1d5db",

                    background: "transparent",

                    color: NAVY,

                    borderRadius: 8,

                    padding: "12px 28px",

                    fontFamily: "'Barlow', sans-serif",

                    fontWeight: 700,

                    cursor: "pointer",
                  }}
                >
                  Submit another
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* SECTION 1 — ENROLLMENT INFO */}

              <Section title="Enrollment Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FieldLabel required>Driver Enrollment Date</FieldLabel>

                    <input
                      type="date"
                      value={form.enrollmentDate}
                      onChange={(e) => update("enrollmentDate", e.target.value)}
                      {...fieldProps}
                    />
                  </div>

                  <div>
                    <FieldLabel required>Motor Carrier</FieldLabel>

                    <input
                      value={form.motorCarrier}
                      onChange={(e) => update("motorCarrier", e.target.value)}
                      {...fieldProps}
                    />
                  </div>

                  <div>
                    <FieldLabel required>Policy Number</FieldLabel>

                    <input
                      value={form.policyNumber}
                      onChange={(e) => update("policyNumber", e.target.value)}
                      {...fieldProps}
                    />
                  </div>

                  <div>
                    <FieldLabel required>Covered Driver Name</FieldLabel>

                    <input
                      value={form.driverName}
                      onChange={(e) => update("driverName", e.target.value)}
                      {...fieldProps}
                    />
                  </div>

                  <div>
                    <FieldLabel required>Date of Birth</FieldLabel>

                    <input
                      type="date"
                      value={form.dob}
                      onChange={(e) => update("dob", e.target.value)}
                      {...fieldProps}
                    />
                  </div>

                  <div>
                    <FieldLabel required>Address</FieldLabel>

                    <input value={form.address} onChange={(e) => update("address", e.target.value)} {...fieldProps} />
                  </div>

                  <div>
                    <FieldLabel required>CDL #</FieldLabel>

                    <input
                      value={form.cdlNumber}
                      onChange={(e) => update("cdlNumber", e.target.value)}
                      {...fieldProps}
                    />
                  </div>

                  <div>
                    <FieldLabel required>CDL State</FieldLabel>

                    <select value={form.cdlState} onChange={(e) => update("cdlState", e.target.value)} {...fieldProps}>
                      <option value="">Select state</option>

                      {US_STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <FieldLabel required>Email Address</FieldLabel>

                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      {...fieldProps}
                    />
                  </div>
                </div>
              </Section>

              {/* SECTION 2 — BENEFICIARY */}

              <Section title="Beneficiary Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FieldLabel required>Beneficiary Name</FieldLabel>

                    <input
                      value={form.beneficiaryName}
                      onChange={(e) => update("beneficiaryName", e.target.value)}
                      {...fieldProps}
                    />
                  </div>

                  <div>
                    <FieldLabel required>Beneficiary Relationship</FieldLabel>

                    <input
                      value={form.beneficiaryRelationship}
                      onChange={(e) => update("beneficiaryRelationship", e.target.value)}
                      {...fieldProps}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <FieldLabel required>Beneficiary Contact Info</FieldLabel>

                    <input
                      value={form.beneficiaryContact}
                      onChange={(e) => update("beneficiaryContact", e.target.value)}
                      {...fieldProps}
                    />
                  </div>
                </div>
              </Section>

              {/* SECTION 3 — DRIVER TYPE */}

              <Section title="Driver Type">
                <div>
                  <RadioGroup
                    className="flex flex-col gap-3 sm:flex-row sm:gap-8"
                    value={form.driverType}
                    onValueChange={(v) => update("driverType", v as DriverType)}
                  >
                    {(["Owner Operator (1099)", "Contract Driver (1099)"] as DriverType[]).map((opt) => (
                      <label
                        key={opt}
                        className="flex cursor-pointer items-center gap-3"
                        style={{ fontFamily: "Inter, sans-serif", fontSize: 15, color: "#0d2b2b" }}
                      >
                        <RadioGroupItem value={opt} style={{ accentColor: TEAL }} />

                        <span>{opt}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>
              </Section>

              {/* SECTION 4 — SUPPORTING DOCUMENTS */}

              <Section title="Supporting Documents">
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#6b7280" }}>
                  Attach any supporting documents (MVR, lease agreements, etc.).
                </p>

                {attachedFiles.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {attachedFiles.map((file, i) => (
                      <div
                        key={i}
                        style={{
                          border: "1px solid #e5e7eb",

                          borderRadius: 8,

                          padding: "10px 16px",

                          background: "#f8fafc",

                          display: "flex",

                          alignItems: "center",

                          justifyContent: "space-between",

                          fontFamily: "Inter, sans-serif",

                          fontSize: 13,

                          color: NAVY,
                        }}
                      >
                        <span>📎 {file.name}</span>

                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          style={{
                            color: "#dc2626",
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            fontSize: 13,
                          }}
                        >
                          × Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,image/*"
                  style={{ display: "none" }}
                  onChange={handleFileAttach}
                />

                <button type="button" style={addBtnStyle} onClick={() => fileInputRef.current?.click()}>
                  + Attach File
                </button>
              </Section>

              {/* SECTION 5 — SIGNATURE */}

              <Section title="Driver Signature">
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#6b7280" }}>
                  By signing below, you confirm that all information provided is accurate and complete.
                </p>

                <div
                  style={{
                    border: "2px solid #e5e7eb",

                    borderRadius: 8,

                    overflow: "hidden",

                    background: "#ffffff",

                    cursor: "crosshair",
                  }}
                >
                  <SignatureCanvas
                    ref={sigRef}
                    penColor="#0d2b2b"
                    canvasProps={{ style: { width: "100%", height: 180, display: "block" } }}
                  />
                </div>

                <div className="flex items-center justify-between mt-3">
                  <button
                    type="button"
                    onClick={clearSignature}
                    style={{
                      background: "transparent",

                      color: TEAL,

                      border: "none",

                      fontFamily: "Inter, sans-serif",

                      fontSize: 13,

                      cursor: "pointer",

                      padding: 0,
                    }}
                  >
                    Clear Signature
                  </button>

                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: NAVY, fontWeight: 500 }}>
                      Date
                    </span>

                    <input
                      type="date"
                      value={form.signatureDate}
                      onChange={(e) => update("signatureDate", e.target.value)}
                      style={{ ...inputBase, width: "auto" }}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </div>
                </div>
              </Section>

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 flex w-full items-center justify-center gap-2 uppercase"
                style={{
                  background: "linear-gradient(135deg, #f5821f 0%, #f5c518 100%)",

                  color: "#ffffff",

                  padding: "16px",

                  borderRadius: 8,

                  border: "none",

                  fontWeight: 700,

                  letterSpacing: "0.08em",

                  fontSize: 15,

                  opacity: submitting ? 0.7 : 1,

                  cursor: submitting ? "not-allowed" : "pointer",

                  fontFamily: "'Barlow', sans-serif",
                }}
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Submitting…
                  </>
                ) : (
                  "Submit & Generate PDF"
                )}
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Off-screen print area for PDF generation */}

      <div style={{ position: "fixed", left: -10000, top: 0, width: 760 }} aria-hidden="true">
        <div ref={printRef} style={pdfStyles.page}>
          <div style={pdfStyles.headerRow}>
            <img src={logo} alt="" style={{ height: 38 }} />

            <div style={pdfStyles.headerText}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#0c2238" }}>Custom Insurance Agency</div>

              <div style={{ fontSize: 11, color: "#444" }}>Wesco Insurance — Occupational Accident Enrollment</div>
            </div>
          </div>

          <div style={pdfStyles.divider} />

          <h2 style={pdfStyles.title}>OA Enrollment Form</h2>

          <PdfRow label="Driver Enrollment Date" value={form.enrollmentDate} />

          <PdfRow label="Motor Carrier" value={form.motorCarrier} />

          <PdfRow label="Policy Number" value={form.policyNumber} />

          <PdfRow label="Covered Driver Name" value={form.driverName} />

          <PdfRow label="Date of Birth" value={form.dob} />

          <PdfRow label="Address" value={form.address} />

          <PdfRow label="CDL #" value={form.cdlNumber} />

          <PdfRow label="CDL State" value={form.cdlState} />

          <PdfRow label="Email Address" value={form.email} />

          <PdfRow label="Beneficiary Name" value={form.beneficiaryName} />

          <PdfRow label="Beneficiary Relationship" value={form.beneficiaryRelationship} />

          <PdfRow label="Beneficiary Contact Info" value={form.beneficiaryContact} />

          <PdfRow label="Driver Type" value={form.driverType} />

          <div style={{ marginTop: 18 }}>
            <div style={pdfStyles.label}>Driver Signature</div>

            <SignatureImage sigRef={sigRef} />

            <div style={{ marginTop: 6, fontSize: 11, color: "#333" }}>
              Date: <strong>{form.signatureDate}</strong>
            </div>
          </div>

          <p style={pdfStyles.disclaimer}>
            By signing above, the covered driver acknowledges enrollment in the Occupational Accident program and
            certifies that the information provided is true and accurate to the best of their knowledge.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

const PdfRow = ({ label, value }: { label: string; value: string }) => (
  <div style={pdfStyles.row}>
    <div style={pdfStyles.label}>{label}</div>

    <div style={pdfStyles.value}>{value || "\u00A0"}</div>
  </div>
);

const SignatureImage = ({ sigRef }: { sigRef: React.RefObject<SignatureCanvas> }) => {
  let dataUrl = "";

  try {
    if (sigRef.current && !sigRef.current.isEmpty()) {
      dataUrl = sigRef.current.getTrimmedCanvas().toDataURL("image/png");
    }
  } catch {
    /* ignore */
  }

  return (
    <div style={pdfStyles.signatureBox}>
      {dataUrl ? <img src={dataUrl} alt="signature" style={{ maxHeight: 70, maxWidth: "100%" }} /> : null}
    </div>
  );
};

const pdfStyles: Record<string, React.CSSProperties> = {
  page: {
    background: "#ffffff",
    color: "#0c2238",
    padding: 28,
    fontFamily: "Inter, Arial, sans-serif",
    fontSize: 12,
    width: 760,
  },

  headerRow: { display: "flex", alignItems: "center", gap: 12 },

  headerText: { display: "flex", flexDirection: "column" },

  divider: { height: 2, background: "#2abfbf", marginTop: 10, marginBottom: 16 },

  title: { fontSize: 18, fontWeight: 700, margin: "0 0 14px", color: "#0c2238" },

  row: { display: "grid", gridTemplateColumns: "230px 1fr", padding: "8px 0", borderBottom: "1px solid #e5e7eb" },

  label: { fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", color: "#2abfbf" },

  value: { fontSize: 12, color: "#0c2238" },

  signatureBox: {
    marginTop: 6,
    height: 84,
    border: "1px solid #cbd5e1",
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#ffffff",
  },

  disclaimer: { marginTop: 16, fontSize: 10, color: "#555", lineHeight: 1.5 },
};

export default OccAccidentEnrollment;
