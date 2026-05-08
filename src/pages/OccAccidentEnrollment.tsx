import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";
import { SEO } from "@/components/SEO";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
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

const OccAccidentEnrollment = () => {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ url: string; fileName: string } | null>(null);
  const sigRef = useRef<SignatureCanvas>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((s) => ({ ...s, [key]: value }));

  const clearSignature = () => sigRef.current?.clear();

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
      // multi-page slicing
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

  const Field = ({
    label,
    children,
  }: {
    label: string;
    children: React.ReactNode;
  }) => (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-semibold uppercase tracking-wide text-[#2abfbf]">
        {label}
      </Label>
      {children}
    </div>
  );

  const inputCls =
    "h-10 rounded-md border border-white/15 bg-white/5 px-3 text-white placeholder:text-white/40 focus-visible:ring-[#2abfbf]";

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="OCC/ACC Enrollment | Custom Insurance Agency"
        description="Digital Wesco Occupational Accident enrollment form. Complete, sign, and submit online."
      />
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 py-12 lg:px-10">
        <div className="rounded-2xl bg-[linear-gradient(135deg,#0f2a42_0%,#173b5d_50%,#0d2b2b_100%)] p-1 shadow-2xl">
          <div className="rounded-[14px] bg-[#0c2238] p-8 sm:p-12">
            <header className="mb-8 flex flex-col items-center text-center">
              <img src={logo} alt="Custom Insurance Agency" className="h-10 w-auto" />
              <h1 className="mt-6 text-3xl font-bold text-white sm:text-4xl">
                Occupational Accident Enrollment
              </h1>
              <p className="mt-2 text-sm text-white/70">
                Wesco Insurance — OA Enrollment Form
              </p>
              <div className="mt-4 h-1 w-16 rounded-full bg-[#2abfbf]" />
            </header>

            {result ? (
              <section className="rounded-xl border border-[#2abfbf]/40 bg-[#0d2b2b] p-8 text-center">
                <h2 className="text-2xl font-semibold text-white">
                  Thank you, {form.driverName.split(" ")[0]}!
                </h2>
                <p className="mt-2 text-white/75">
                  Your enrollment form has been submitted. You can download a copy below.
                </p>
                <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <a
                    href={result.url}
                    download={result.fileName}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-11 items-center justify-center rounded-md bg-[#2abfbf] px-6 font-semibold text-[#0c2238] transition hover:brightness-110"
                  >
                    Download PDF
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setResult(null);
                      setForm(initialState);
                    }}
                    className="inline-flex h-11 items-center justify-center rounded-md border border-white/20 px-6 font-semibold text-white transition hover:bg-white/10"
                  >
                    Submit another
                  </button>
                </div>
              </section>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Driver Enrollment Date">
                    <Input type="date" className={inputCls} value={form.enrollmentDate} onChange={(e) => update("enrollmentDate", e.target.value)} />
                  </Field>
                  <Field label="Motor Carrier">
                    <Input className={inputCls} value={form.motorCarrier} onChange={(e) => update("motorCarrier", e.target.value)} />
                  </Field>
                  <Field label="Policy Number">
                    <Input className={inputCls} value={form.policyNumber} onChange={(e) => update("policyNumber", e.target.value)} />
                  </Field>
                  <Field label="Covered Driver Name">
                    <Input className={inputCls} value={form.driverName} onChange={(e) => update("driverName", e.target.value)} />
                  </Field>
                  <Field label="Date of Birth">
                    <Input type="date" className={inputCls} value={form.dob} onChange={(e) => update("dob", e.target.value)} />
                  </Field>
                  <Field label="Address">
                    <Input className={inputCls} value={form.address} onChange={(e) => update("address", e.target.value)} />
                  </Field>
                  <Field label="CDL #">
                    <Input className={inputCls} value={form.cdlNumber} onChange={(e) => update("cdlNumber", e.target.value)} />
                  </Field>
                  <Field label="CDL State">
                    <Select value={form.cdlState} onValueChange={(v) => update("cdlState", v)}>
                      <SelectTrigger className={inputCls}>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent className="max-h-72">
                        {US_STATES.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Email Address">
                    <Input type="email" className={inputCls} value={form.email} onChange={(e) => update("email", e.target.value)} />
                  </Field>
                  <Field label="Beneficiary Name">
                    <Input className={inputCls} value={form.beneficiaryName} onChange={(e) => update("beneficiaryName", e.target.value)} />
                  </Field>
                  <Field label="Beneficiary Relationship">
                    <Input className={inputCls} value={form.beneficiaryRelationship} onChange={(e) => update("beneficiaryRelationship", e.target.value)} />
                  </Field>
                  <Field label="Beneficiary Contact Info">
                    <Input className={inputCls} value={form.beneficiaryContact} onChange={(e) => update("beneficiaryContact", e.target.value)} />
                  </Field>
                </div>

                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wide text-[#2abfbf]">
                    Driver Type
                  </Label>
                  <RadioGroup
                    className="mt-2 flex flex-col gap-2 sm:flex-row sm:gap-6"
                    value={form.driverType}
                    onValueChange={(v) => update("driverType", v as DriverType)}
                  >
                    {(["Owner Operator (1099)", "Contract Driver (1099)"] as DriverType[]).map((opt) => (
                      <label key={opt} className="flex cursor-pointer items-center gap-2 text-white">
                        <RadioGroupItem value={opt} className="border-white/40 text-[#2abfbf]" />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-[#2abfbf]">
                    Driver Signature
                  </Label>
                  <div className="mt-2 overflow-hidden rounded-md border border-white/20 bg-white">
                    <SignatureCanvas
                      ref={sigRef}
                      penColor="#0c2238"
                      canvasProps={{ className: "w-full h-44" }}
                    />
                  </div>
                  <div className="mt-3 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      onClick={clearSignature}
                      className="text-sm font-medium text-white/70 underline-offset-4 hover:text-white hover:underline"
                    >
                      Clear Signature
                    </button>
                    <div className="flex items-center gap-3">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-[#2abfbf]">
                        Date
                      </Label>
                      <Input
                        type="date"
                        className={`${inputCls} w-44`}
                        value={form.signatureDate}
                        onChange={(e) => update("signatureDate", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="h-12 w-full rounded-md bg-[#2abfbf] text-base font-semibold text-[#0c2238] hover:brightness-110"
                >
                  {submitting ? "Submitting…" : "Submit & Generate PDF"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Off-screen, print-styled rendition used by html2canvas to build the PDF.
          It mirrors the original Wesco OA Enrollment layout in clean B/W. */}
      <div style={{ position: "fixed", left: -10000, top: 0, width: 760 }} aria-hidden="true">
        <div ref={printRef} style={pdfStyles.page}>
          <div style={pdfStyles.headerRow}>
            <img src={logo} alt="" style={{ height: 38 }} />
            <div style={pdfStyles.headerText}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#0c2238" }}>
                Custom Insurance Agency
              </div>
              <div style={{ fontSize: 11, color: "#444" }}>
                Wesco Insurance — Occupational Accident Enrollment
              </div>
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
            By signing above, the covered driver acknowledges enrollment in the
            Occupational Accident program and certifies that the information
            provided is true and accurate to the best of their knowledge.
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
  // Pulls the latest signature image at render time (called when html2canvas snapshots).
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
      {dataUrl ? (
        <img src={dataUrl} alt="signature" style={{ maxHeight: 70, maxWidth: "100%" }} />
      ) : null}
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
  row: {
    display: "grid",
    gridTemplateColumns: "230px 1fr",
    padding: "8px 0",
    borderBottom: "1px solid #e5e7eb",
  },
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