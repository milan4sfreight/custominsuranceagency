import { useState, type ChangeEvent, type FormEvent } from "react";

import claimsHero from "@/assets/claims-hero.jpg";

import { Loader2, Upload, X } from "lucide-react";

import { toast } from "sonner";

import jsPDF from "jspdf";

import SEO from "@/components/SEO";

import Navbar from "@/components/site/Navbar";

import Footer from "@/components/site/Footer";

import { sendQuoteEmail, SUCCESS_MSG, ERROR_MSG } from "@/lib/sendQuoteEmail";

const HERO_IMG = claimsHero;

type ClaimForm = {
  policyHolderName: string;

  policyNumber: string;

  insuredPhone: string;

  insuredEmail: string;

  sameAsHolder: boolean;

  claimantName: string;

  claimantAddress: string;

  claimantPhone: string;

  claimantEmail: string;

  dateOfLoss: string;

  timeHour: string;

  timeMinute: string;

  timeAmpm: string;

  lossAddress: string;

  lossCity: string;

  lossState: string;

  lossZip: string;

  policeReportFiled: string;

  accidentDescription: string;

  thirdPartyDamage: string;

  injuries: string;

  driverName: string;

  driverPhone: string;

  driverDob: string;

  driverLicense: string;

  driverLicenseState: string;

  tractorYear: string;

  tractorMake: string;

  tractorVin: string;

  tractorDamage: string;

  trailerDamage: string;

  trailerDescription: string;

  vehicleTowed: string;

  towingCompany: string;

  towingCost: string;

  cargoDamage: string;

  cargoDescription: string;

  cargoValue: string;

  additionalInformation: string;
};

const initialForm: ClaimForm = {
  policyHolderName: "",
  policyNumber: "",
  insuredPhone: "",
  insuredEmail: "",

  sameAsHolder: false,

  claimantName: "",
  claimantAddress: "",
  claimantPhone: "",
  claimantEmail: "",

  dateOfLoss: "",
  timeHour: "",
  timeMinute: "",
  timeAmpm: "AM",

  lossAddress: "",
  lossCity: "",
  lossState: "",
  lossZip: "",

  policeReportFiled: "No",

  accidentDescription: "",
  thirdPartyDamage: "No",
  injuries: "No",

  driverName: "",
  driverPhone: "",
  driverDob: "",
  driverLicense: "",
  driverLicenseState: "",

  tractorYear: "",
  tractorMake: "",
  tractorVin: "",
  tractorDamage: "No",

  trailerDamage: "No",
  trailerDescription: "",

  vehicleTowed: "No",
  towingCompany: "",
  towingCost: "",

  cargoDamage: "No",
  cargoDescription: "",
  cargoValue: "",

  additionalInformation: "",
};

const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result).split(",").pop() || "");

    reader.onerror = reject;

    reader.readAsDataURL(file);
  });

const formatFileSize = (size: number) => {
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;

  return `${(size / 1024 / 1024).toFixed(1)} MB`;
};

const TEAL = "#2abfbf";

const ORANGE = "#f5821f";

const NAVY = "#173b5d";

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

  boxSizing: "border-box",

  maxWidth: "100%",

  minWidth: 0,
};

const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = TEAL;
};

const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = "#d1d5db";
};

const fieldProps = {
  style: inputBase,

  onFocus: handleFocus,

  onBlur: handleBlur,
};

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label
      className="mb-2 block"
      style={{
        color: NAVY,

        fontSize: 13,

        fontWeight: 500,

        fontFamily: "Inter, sans-serif",
      }}
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

function YesNoRadio({
  name,
  value,
  onChange,
}: {
  name: keyof ClaimForm;

  value: string;

  onChange: (name: keyof ClaimForm, v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2 mt-1">
      {["Yes", "No"].map((opt) => (
        <label
          key={opt}
          className="flex items-center gap-2.5 cursor-pointer"
          style={{ color: NAVY, fontSize: 13, fontFamily: "Inter, sans-serif" }}
        >
          <input
            type="radio"
            name={String(name)}
            value={opt}
            checked={value === opt}
            onChange={() => onChange(name, opt)}
            style={{ accentColor: TEAL, width: 16, height: 16 }}
          />

          <span>{opt}</span>
        </label>
      ))}
    </div>
  );
}

export default function ClaimForm() {
  const [form, setForm] = useState<ClaimForm>(initialForm);

  const [files, setFiles] = useState<File[]>([]);

  const [status, setStatus] = useState<"idle" | "sending">("idle");

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;

    setForm((c) => ({
      ...c,

      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const setField = (name: keyof ClaimForm, value: string) => setForm((c) => ({ ...c, [name]: value }));

  const onFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = Array.from(e.target.files ?? []);

    setFiles((c) => [...c, ...next].slice(0, 8));

    e.target.value = "";
  };

  const removeFile = (i: number) => setFiles((c) => c.filter((_, idx) => idx !== i));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (status === "sending") return;

    setStatus("sending");

    try {
      const uploadedAttachments = await Promise.all(
        files.map(async (file) => ({
          filename: file.name,

          contentBase64: await fileToBase64(file),

          contentType: file.type || "application/octet-stream",
        })),
      );

      const claimantNameVal = form.sameAsHolder ? form.policyHolderName : form.claimantName;

      const claimantPhoneVal = form.sameAsHolder ? form.insuredPhone : form.claimantPhone;

      const claimantEmailVal = form.sameAsHolder ? form.insuredEmail : form.claimantEmail;

      const timeOfLoss =
        form.timeHour || form.timeMinute
          ? `${form.timeHour || "--"}:${(form.timeMinute || "--").toString().padStart(2, "0")} ${form.timeAmpm}`
          : "";

      const pdfBase64 = (() => {
        const doc = new jsPDF({ unit: "pt", format: "letter" });

        const PAGE_W = 612;

        const MARGIN = 40;

        const CONTENT_W = PAGE_W - MARGIN * 2;

        const NAVY_RGB: [number, number, number] = [23, 59, 93];

        const TEAL_RGB: [number, number, number] = [42, 191, 191];

        const INK: [number, number, number] = [13, 43, 43];

        const MUTED: [number, number, number] = [107, 114, 128];

        const HAIR: [number, number, number] = [229, 231, 235];

        const SOFT: [number, number, number] = [248, 250, 252];

        let y = 0;

        let pageNum = 1;

        const drawHeader = () => {
          doc.setFillColor(31, 77, 122);

          doc.rect(0, 0, 612, 28, "F");

          doc.setTextColor(255, 255, 255);

          doc.setFont("helvetica", "bold");

          doc.setFontSize(10);

          doc.text("Custom Insurance Agency", 45, 18);

          doc.setFont("helvetica", "normal");

          doc.setFontSize(9);

          doc.text("Claim Report", 612 - 45, 18, { align: "right" });

          doc.setFillColor(232, 240, 248);

          doc.rect(0, 28, 612, 20, "F");

          doc.setFont("helvetica", "bold");

          doc.setFontSize(7);

          doc.setTextColor(31, 77, 122);

          doc.text("This claim report was submitted electronically.", 45, 42);

          doc.text("For questions call 708-810-1955", 612 - 45, 42, { align: "right" });

          doc.setDrawColor(31, 77, 122);

          doc.setLineWidth(0.5);

          doc.line(0, 48, 612, 48);

          y = 55;
        };

        const drawFooter = () => {
          doc.setFillColor(255, 248, 240);

          doc.rect(40, 740, 390, 45, "F");

          doc.setDrawColor(245, 130, 31);

          doc.setLineWidth(3);

          doc.line(40, 740, 40, 785);

          doc.setFont("helvetica", "bold");

          doc.setFontSize(8);

          doc.setTextColor(245, 130, 31);

          doc.text("This claim report has been submitted to Custom Insurance Agency for review.", 48, 752);

          doc.setFont("helvetica", "normal");

          doc.setFontSize(7);

          doc.setTextColor(85, 85, 85);

          const noteText =
            "Our claims team will contact you within 24 hours at claims@custominsure.com or 708-810-1955.";

          const wrapped = doc.splitTextToSize(noteText, 375);

          doc.text(wrapped, 48, 762);

          doc.setFillColor(245, 245, 245);

          doc.rect(442, 740, 170, 45, "F");

          doc.setDrawColor(204, 204, 204);

          doc.setLineWidth(0.5);

          doc.rect(442, 740, 170, 45, "S");

          doc.setFont("helvetica", "bold");

          doc.setFontSize(8);

          doc.setTextColor(31, 77, 122);

          doc.text("Custom Insurance Agency", 442 + 85, 754, { align: "center" });

          doc.setFont("helvetica", "normal");

          doc.setFontSize(7);

          doc.setTextColor(102, 102, 102);

          doc.text("708-810-1955", 442 + 85, 764, { align: "center" });

          doc.text("claims@custominsure.com", 442 + 85, 774, { align: "center" });

          doc.setFont("helvetica", "normal");

          doc.setFontSize(7);

          doc.setTextColor(153, 153, 153);

          doc.text(`Page ${pageNum} of {nb}`, 612 / 2, 790, { align: "center" });
        };

        const ensureSpace = (needed: number) => {
          if (y + needed > 735) {
            drawFooter();

            doc.addPage();

            pageNum++;

            drawHeader();
          }
        };

        const sectionTitle = (label: string) => {
          ensureSpace(34);

          doc.setFillColor(...TEAL_RGB);

          doc.rect(MARGIN, y, 3, 14, "F");

          doc.setFont("helvetica", "bold");

          doc.setFontSize(10);

          doc.setTextColor(...NAVY_RGB);

          doc.text(label.toUpperCase(), MARGIN + 10, y + 11);

          y += 18;

          doc.setDrawColor(...HAIR);

          doc.setLineWidth(0.5);

          doc.line(MARGIN, y, PAGE_W - MARGIN, y);

          y += 10;
        };

        const kvGrid = (rows: Array<[string, string]>, cols = 2) => {
          const colW = CONTENT_W / cols;

          const rowH = 30;

          for (let i = 0; i < rows.length; i += cols) {
            ensureSpace(rowH + 4);

            for (let c = 0; c < cols; c++) {
              const r = rows[i + c];

              if (!r) continue;

              const x = MARGIN + c * colW;

              doc.setFont("helvetica", "normal");

              doc.setFontSize(7.5);

              doc.setTextColor(...MUTED);

              doc.text(r[0].toUpperCase(), x + 4, y + 8);

              doc.setFont("helvetica", "bold");

              doc.setFontSize(10);

              doc.setTextColor(...INK);

              const val = r[1] && r[1].trim() ? r[1] : "—";

              const lines = doc.splitTextToSize(val, colW - 8);

              doc.text(lines.slice(0, 1), x + 4, y + 22);
            }

            doc.setDrawColor(...HAIR);

            doc.setLineWidth(0.3);

            doc.line(MARGIN, y + rowH, PAGE_W - MARGIN, y + rowH);

            y += rowH;
          }

          y += 8;
        };

        const dataTable = (headers: string[], rows: string[][], widths: number[]) => {
          const totalRel = widths.reduce((a, b) => a + b, 0);

          const colWs = widths.map((w) => (w / totalRel) * CONTENT_W);

          const rowH = 22;

          ensureSpace(rowH * 2);

          doc.setFillColor(...NAVY_RGB);

          doc.rect(MARGIN, y, CONTENT_W, rowH, "F");

          doc.setFont("helvetica", "bold");

          doc.setFontSize(8);

          doc.setTextColor(255, 255, 255);

          let xh = MARGIN;

          headers.forEach((h, i) => {
            doc.text(h.toUpperCase(), xh + 6, y + 14);

            xh += colWs[i];
          });

          y += rowH;

          rows.forEach((r, ri) => {
            ensureSpace(rowH);

            if (ri % 2 === 0) {
              doc.setFillColor(...SOFT);

              doc.rect(MARGIN, y, CONTENT_W, rowH, "F");
            }

            doc.setFont("helvetica", "normal");

            doc.setFontSize(9);

            doc.setTextColor(...INK);

            let xc = MARGIN;

            r.forEach((cell, i) => {
              const txt = cell && cell.trim() ? cell : "—";

              const lines = doc.splitTextToSize(txt, colWs[i] - 12);

              doc.text(lines.slice(0, 1), xc + 6, y + 14);

              xc += colWs[i];
            });

            doc.setDrawColor(...HAIR);

            doc.setLineWidth(0.3);

            doc.line(MARGIN, y + rowH, PAGE_W - MARGIN, y + rowH);

            y += rowH;
          });

          y += 10;
        };

        drawHeader();

        sectionTitle("POLICY HOLDER INFORMATION");

        kvGrid([
          ["Policy Holder Name", form.policyHolderName],
          ["Policy Number", form.policyNumber],
          ["Phone", form.insuredPhone],
          ["Email", form.insuredEmail],
        ]);

        sectionTitle("WHO IS FILING THIS CLAIM");

        kvGrid([
          ["Filing As", form.sameAsHolder ? "Policy Holder" : "Claimant"],
          ["Claimant Name", claimantNameVal],
          ["Claimant Address", form.sameAsHolder ? "" : form.claimantAddress],
          ["Claimant Phone", claimantPhoneVal],
          ["Claimant Email", claimantEmailVal],
        ]);

        sectionTitle("GENERAL INFORMATION");

        kvGrid([
          ["Date of Loss", form.dateOfLoss],
          ["Time of Accident", timeOfLoss],
        ]);

        sectionTitle("LOCATION OF LOSS");

        kvGrid([
          ["Street Address", form.lossAddress],
          ["City", form.lossCity],
          ["State", form.lossState],
          ["ZIP", form.lossZip],
          ["Police Contacted", form.policeReportFiled],
        ]);

        sectionTitle("ACCIDENT DESCRIPTION");

        kvGrid(
          [
            ["Description", form.accidentDescription],
            ["Third Party Property Damage", form.thirdPartyDamage],
            ["Injuries", form.injuries],
          ],
          1,
        );

        sectionTitle("DRIVER INFORMATION");

        kvGrid([
          ["Driver Name", form.driverName],
          ["Driver Phone", form.driverPhone],
          ["Date of Birth", form.driverDob],
          ["License Number", form.driverLicense],
          ["State", form.driverLicenseState],
        ]);

        sectionTitle("TRACTOR INFORMATION");

        kvGrid([
          ["Year", form.tractorYear],
          ["Make", form.tractorMake],
          ["VIN", form.tractorVin],
          ["Damage", form.tractorDamage],
        ]);

        sectionTitle("TRAILER & TOWING & CARGO");

        kvGrid([
          ["Trailer Damage", form.trailerDamage],
          ["Trailer Description", form.trailerDescription],
          ["Vehicle Towed", form.vehicleTowed],
          ["Towing Company", form.towingCompany],
          ["Towing Cost", form.towingCost],
          ["Cargo Damage", form.cargoDamage],
          ["Cargo Description", form.cargoDescription],
          ["Cargo Value", form.cargoValue],
        ]);

        sectionTitle("ADDITIONAL INFORMATION");

        kvGrid([["Additional Details", form.additionalInformation]], 1);

        sectionTitle("UPLOADED DOCUMENTS");

        dataTable(
          ["#", "FILENAME", "TYPE"],
          uploadedAttachments.map((a, i) => [String(i + 1), a.filename, a.contentType || ""]),
          [0.5, 3, 2],
        );

        sectionTitle("AUTHORIZED SIGNATURE");

        kvGrid([
          ["SUBMITTED BY", claimantNameVal || form.policyHolderName],
          [
            "DATE SUBMITTED",
            new Date().toLocaleString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
          ],
        ]);

        drawFooter();

        const totalPages = doc.getNumberOfPages();

        if (
          typeof (doc as unknown as { putTotalPages?: (s: string, n: number) => void }).putTotalPages === "function"
        ) {
          (doc as unknown as { putTotalPages: (s: string, n: number) => void }).putTotalPages("{nb}", totalPages);
        }

        return doc.output("datauristring").split(",")[1];
      })();

      const claimPdfAttachment = {
        filename:
          "ClaimReport_" +
          (form.policyHolderName || "Claim").replace(/\s+/g, "_") +
          "_" +
          new Date().toISOString().split("T")[0] +
          ".pdf",

        contentBase64: pdfBase64,

        contentType: "application/pdf",
      };

      await sendQuoteEmail({
        formKind: "Claim Submission",

        source: "Claim Form Page",

        primaryName: form.policyHolderName || claimantNameVal || "Claim Report",

        customerName: claimantNameVal,

        customerEmail: claimantEmailVal,

        customerPhone: claimantPhoneVal,

        attachments: [claimPdfAttachment, ...uploadedAttachments],

        sections: [
          {
            title: "Policy Holder Information",
            rows: [
              ["Policy Holder Name", form.policyHolderName],
              ["Policy Number", form.policyNumber],
              ["Phone", form.insuredPhone],
              ["Email", form.insuredEmail],
            ],
          },

          {
            title: "Who Is Filing",
            rows: [
              ["Same as Policy Holder", form.sameAsHolder ? "Yes" : "No"],
              ...(!form.sameAsHolder
                ? ([
                    ["Claimant Name", form.claimantName],
                    ["Claimant Address", form.claimantAddress],
                    ["Claimant Phone", form.claimantPhone],
                    ["Claimant Email", form.claimantEmail],
                  ] as Array<[string, unknown]>)
                : []),
            ],
          },

          {
            title: "Location of Loss",
            rows: [
              ["Date of Loss", form.dateOfLoss],
              ["Time of Loss", timeOfLoss],
              ["Address", form.lossAddress],
              ["City", form.lossCity],
              ["State", form.lossState],
              ["ZIP", form.lossZip],
              ["Police Report Filed?", form.policeReportFiled],
            ],
          },

          {
            title: "Accident Description",
            rows: [
              ["Description", form.accidentDescription],
              ["Third Party Damage?", form.thirdPartyDamage],
              ["Injuries?", form.injuries],
            ],
          },

          {
            title: "Driver Information",
            rows: [
              ["Driver Name", form.driverName],
              ["Driver Phone", form.driverPhone],
              ["Date of Birth", form.driverDob],
              ["License #", form.driverLicense],
              ["License State", form.driverLicenseState],
            ],
          },

          {
            title: "Tractor Information",
            rows: [
              ["Year", form.tractorYear],
              ["Make", form.tractorMake],
              ["VIN", form.tractorVin],
              ["Tractor Damage?", form.tractorDamage],
            ],
          },

          {
            title: "Trailer Information",
            rows: [
              ["Trailer Damage?", form.trailerDamage],
              ...(form.trailerDamage === "Yes"
                ? ([["Damage Description", form.trailerDescription]] as Array<[string, unknown]>)
                : []),
            ],
          },

          {
            title: "Towing Information",
            rows: [
              ["Vehicle Towed?", form.vehicleTowed],
              ...(form.vehicleTowed === "Yes"
                ? ([
                    ["Towing Company", form.towingCompany],
                    ["Towing Cost", form.towingCost],
                  ] as Array<[string, unknown]>)
                : []),
            ],
          },

          {
            title: "Cargo Information",
            rows: [
              ["Cargo Damage?", form.cargoDamage],
              ...(form.cargoDamage === "Yes"
                ? ([
                    ["Cargo Description", form.cargoDescription],
                    ["Cargo Value", form.cargoValue],
                  ] as Array<[string, unknown]>)
                : []),
            ],
          },

          {
            title: "Additional Information",
            rows: [
              ["Notes", form.additionalInformation],
              ["Uploaded Files", files.map((f) => `${f.name} (${formatFileSize(f.size)})`).join(", ")],
            ],
          },
        ],
      });

      toast.success(SUCCESS_MSG);

      setForm(initialForm);

      setFiles([]);

      setStatus("idle");
    } catch (err) {
      console.error(err);

      toast.error(ERROR_MSG);

      setStatus("idle");
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden" style={{ background: "#ffffff" }}>
      <SEO
        title="File a Claim | Custom Insurance Agency"
        description="Submit a commercial trucking insurance claim online. Our claims team will review your report and contact you to begin the process."
      />

      <Navbar />

      <section
        className="relative flex h-[300px] w-full items-center justify-center pt-16 [background-attachment:scroll] md:[background-attachment:fixed]"
        style={{ backgroundImage: `url(${HERO_IMG})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.55)" }} />

        <div className="relative z-10 px-6 text-center">
          <h1
            className="font-display"
            style={{
              color: "#ffffff",
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(36px, 5vw, 52px)",
              lineHeight: 1.1,
            }}
          >
            File a Claim
          </h1>
        </div>
      </section>

      <main className="px-4 py-8 sm:px-6 sm:py-12 md:px-6 md:py-16" style={{ background: "#ffffff" }}>
        <div className="mx-auto" style={{ maxWidth: 760 }}>
          <form onSubmit={onSubmit} className="claim-form">
            <Section title="Policy Holder Information">
              <div>
                <Label required>Policy Holder Name</Label>
                <input
                  required
                  name="policyHolderName"
                  value={form.policyHolderName}
                  onChange={onChange}
                  {...fieldProps}
                />
              </div>

              <div>
                <Label>Policy Number</Label>
                <input name="policyNumber" value={form.policyNumber} onChange={onChange} {...fieldProps} />
              </div>

              <div>
                <Label required>Phone</Label>
                <input
                  required
                  type="tel"
                  name="insuredPhone"
                  value={form.insuredPhone}
                  onChange={onChange}
                  {...fieldProps}
                />
              </div>

              <div>
                <Label required>Email</Label>
                <input
                  required
                  type="email"
                  name="insuredEmail"
                  value={form.insuredEmail}
                  onChange={onChange}
                  {...fieldProps}
                />
              </div>
            </Section>

            <Section title="Who Is Filing">
              <label className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="checkbox"
                  name="sameAsHolder"
                  checked={form.sameAsHolder}
                  onChange={onChange}
                  style={{ accentColor: TEAL, width: 16, height: 16 }}
                />

                <span style={{ color: NAVY, fontSize: 13, fontFamily: "Inter, sans-serif" }}>
                  Same as Policy Holder
                </span>
              </label>

              {!form.sameAsHolder && (
                <>
                  <div>
                    <Label required>Name of Claimant</Label>
                    <input required name="claimantName" value={form.claimantName} onChange={onChange} {...fieldProps} />
                  </div>

                  <div>
                    <Label required>Address</Label>
                    <input
                      required
                      name="claimantAddress"
                      value={form.claimantAddress}
                      onChange={onChange}
                      {...fieldProps}
                    />
                  </div>

                  <div>
                    <Label required>Phone Number</Label>
                    <input
                      required
                      type="tel"
                      name="claimantPhone"
                      value={form.claimantPhone}
                      onChange={onChange}
                      {...fieldProps}
                    />
                  </div>

                  <div>
                    <Label required>Email Address</Label>
                    <input
                      required
                      type="email"
                      name="claimantEmail"
                      value={form.claimantEmail}
                      onChange={onChange}
                      {...fieldProps}
                    />
                  </div>
                </>
              )}
            </Section>

            <Section title="Location of Loss">
              <div>
                <Label required>Date of Loss</Label>
                <input
                  required
                  type="date"
                  name="dateOfLoss"
                  value={form.dateOfLoss}
                  onChange={onChange}
                  {...fieldProps}
                />
              </div>

              <div>
                <Label>Time of Accident</Label>

                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    min={1}
                    max={12}
                    name="timeHour"
                    placeholder="HH"
                    value={form.timeHour}
                    onChange={onChange}
                    {...fieldProps}
                    style={{ ...inputBase, width: 90 }}
                  />

                  <span style={{ color: NAVY, fontSize: 16 }}>:</span>

                  <input
                    type="number"
                    min={0}
                    max={59}
                    name="timeMinute"
                    placeholder="MM"
                    value={form.timeMinute}
                    onChange={onChange}
                    {...fieldProps}
                    style={{ ...inputBase, width: 90 }}
                  />

                  <select
                    name="timeAmpm"
                    value={form.timeAmpm}
                    onChange={onChange}
                    {...fieldProps}
                    style={{ ...inputBase, width: 100 }}
                  >
                    <option value="AM">AM</option>

                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>

              <div>
                <Label required>Address</Label>
                <input required name="lossAddress" value={form.lossAddress} onChange={onChange} {...fieldProps} />
              </div>

              <div>
                <Label required>City</Label>
                <input required name="lossCity" value={form.lossCity} onChange={onChange} {...fieldProps} />
              </div>

              <div>
                <Label required>State</Label>
                <input required name="lossState" value={form.lossState} onChange={onChange} {...fieldProps} />
              </div>

              <div>
                <Label required>ZIP</Label>
                <input required name="lossZip" value={form.lossZip} onChange={onChange} {...fieldProps} />
              </div>

              <div>
                <Label>Police Report Filed?</Label>
                <YesNoRadio name="policeReportFiled" value={form.policeReportFiled} onChange={setField} />
              </div>
            </Section>

            <Section title="Accident Description">
              <div>
                <Label required>Briefly Describe the Accident</Label>
                <textarea
                  required
                  name="accidentDescription"
                  value={form.accidentDescription}
                  onChange={onChange}
                  {...fieldProps}
                  style={{ ...inputBase, resize: "vertical", minHeight: 200 }}
                />
              </div>

              <div>
                <Label required>Was there damage to third party property or state property?</Label>
                <YesNoRadio name="thirdPartyDamage" value={form.thirdPartyDamage} onChange={setField} />
              </div>

              <div>
                <Label required>Were there injuries?</Label>
                <YesNoRadio name="injuries" value={form.injuries} onChange={setField} />
              </div>
            </Section>

            <Section title="Driver Information">
              <div>
                <Label>Driver Name</Label>
                <input name="driverName" value={form.driverName} onChange={onChange} {...fieldProps} />
              </div>

              <div>
                <Label>Phone</Label>
                <input type="tel" name="driverPhone" value={form.driverPhone} onChange={onChange} {...fieldProps} />
              </div>

              <div>
                <Label>Date of Birth</Label>
                <input type="date" name="driverDob" value={form.driverDob} onChange={onChange} {...fieldProps} />
              </div>

              <div>
                <Label>License #</Label>
                <input name="driverLicense" value={form.driverLicense} onChange={onChange} {...fieldProps} />
              </div>

              <div>
                <Label>License State</Label>
                <input name="driverLicenseState" value={form.driverLicenseState} onChange={onChange} {...fieldProps} />
              </div>
            </Section>

            <Section title="Tractor Information">
              <div>
                <Label>Year</Label>
                <input name="tractorYear" value={form.tractorYear} onChange={onChange} {...fieldProps} />
              </div>

              <div>
                <Label>Make</Label>
                <input name="tractorMake" value={form.tractorMake} onChange={onChange} {...fieldProps} />
              </div>

              <div>
                <Label>VIN</Label>
                <input name="tractorVin" value={form.tractorVin} onChange={onChange} {...fieldProps} />
              </div>

              <div>
                <Label>Tractor Damage?</Label>
                <YesNoRadio name="tractorDamage" value={form.tractorDamage} onChange={setField} />
              </div>
            </Section>

            <Section title="Trailer Information">
              <div>
                <Label>Trailer Damage?</Label>
                <YesNoRadio name="trailerDamage" value={form.trailerDamage} onChange={setField} />
              </div>

              {form.trailerDamage === "Yes" && (
                <div>
                  <Label>Damage Description</Label>
                  <textarea
                    name="trailerDescription"
                    value={form.trailerDescription}
                    onChange={onChange}
                    rows={3}
                    {...fieldProps}
                    style={{ ...inputBase, resize: "vertical" }}
                  />
                </div>
              )}
            </Section>

            <Section title="Towing Information">
              <div>
                <Label>Vehicle Towed?</Label>
                <YesNoRadio name="vehicleTowed" value={form.vehicleTowed} onChange={setField} />
              </div>

              {form.vehicleTowed === "Yes" && (
                <>
                  <div>
                    <Label>Towing Company</Label>
                    <input name="towingCompany" value={form.towingCompany} onChange={onChange} {...fieldProps} />
                  </div>
                  <div>
                    <Label>Towing Cost</Label>
                    <input name="towingCost" value={form.towingCost} onChange={onChange} {...fieldProps} />
                  </div>
                </>
              )}
            </Section>

            <Section title="Cargo Information">
              <div>
                <Label>Cargo Damage?</Label>
                <YesNoRadio name="cargoDamage" value={form.cargoDamage} onChange={setField} />
              </div>

              {form.cargoDamage === "Yes" && (
                <>
                  <div>
                    <Label>Cargo Description</Label>
                    <textarea
                      name="cargoDescription"
                      value={form.cargoDescription}
                      onChange={onChange}
                      rows={3}
                      {...fieldProps}
                      style={{ ...inputBase, resize: "vertical" }}
                    />
                  </div>
                  <div>
                    <Label>Cargo Value</Label>
                    <input name="cargoValue" value={form.cargoValue} onChange={onChange} {...fieldProps} />
                  </div>
                </>
              )}
            </Section>

            <Section title="Additional Information">
              <div>
                <Label>Notes</Label>
                <textarea
                  name="additionalInformation"
                  value={form.additionalInformation}
                  onChange={onChange}
                  rows={4}
                  {...fieldProps}
                  style={{ ...inputBase, resize: "vertical" }}
                />
              </div>
            </Section>

            <Section title="Upload Files">
              <div
                className="flex flex-col items-center justify-center gap-3 rounded-[8px] py-10 text-center"
                style={{ border: "2px dashed #d1d5db", background: "#fafafa" }}
              >
                <Upload size={26} style={{ color: TEAL }} />

                <div style={{ color: NAVY, fontSize: 13, fontFamily: "Inter, sans-serif" }}>
                  Drop photos, police report, or documents here
                </div>

                <label
                  className="cursor-pointer uppercase"
                  style={{
                    background: "linear-gradient(135deg, #f5821f 0%, #f5c518 100%)",
                    color: "#ffffff",
                    fontWeight: 700,
                    padding: "10px 22px",
                    borderRadius: 8,
                    fontSize: 13,
                    letterSpacing: "0.08em",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Select Files
                  <input type="file" multiple onChange={onFilesChange} className="hidden" />
                </label>

                <div style={{ color: "#6b7280", fontSize: 12 }}>Up to 8 files</div>
              </div>

              {files.length > 0 && (
                <ul className="space-y-2">
                  {files.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between rounded-[8px] px-3 py-2 text-[13px]"
                      style={{ background: "#f9fafb", border: "1px solid #e5e7eb", color: NAVY }}
                    >
                      <span className="truncate pr-3">
                        {f.name} <span style={{ color: "#6b7280" }}>({formatFileSize(f.size)})</span>
                      </span>

                      <button type="button" onClick={() => removeFile(i)} style={{ color: "#6b7280" }}>
                        <X size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Section>

            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-2 flex w-full items-center justify-center gap-2 uppercase"
              style={{
                background: "linear-gradient(135deg, #f5821f 0%, #f5c518 100%)",
                color: "#ffffff",
                fontFamily: "'Barlow', sans-serif",
                padding: "16px",
                borderRadius: 8,
                border: "none",
                fontWeight: 700,
                letterSpacing: "0.08em",
                fontSize: 15,
                opacity: status === "sending" ? 0.7 : 1,
                cursor: status === "sending" ? "not-allowed" : "pointer",
              }}
            >
              {status === "sending" ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Submitting…
                </>
              ) : (
                "SUBMIT CLAIM"
              )}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
