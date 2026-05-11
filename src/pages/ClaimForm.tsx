import { useState, type ChangeEvent, type FormEvent } from "react";
import { Loader2, Upload, X, Phone, Mail, Clock } from "lucide-react";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import { sendQuoteEmail, SUCCESS_MSG, ERROR_MSG } from "@/lib/sendQuoteEmail";

type ClaimForm = {
  // policy holder
  policyHolderName: string;
  policyNumber: string;
  insuredPhone: string;
  insuredEmail: string;
  // who is filing
  sameAsHolder: boolean;
  claimantName: string;
  claimantAddress: string;
  claimantPhone: string;
  claimantEmail: string;
  // location of loss
  dateOfLoss: string;
  timeOfLoss: string;
  lossAddress: string;
  lossCity: string;
  lossState: string;
  lossZip: string;
  policeReportFiled: string;
  // accident description
  accidentDescription: string;
  thirdPartyDamage: string;
  injuries: string;
  // driver info
  driverName: string;
  driverPhone: string;
  driverDob: string;
  driverLicense: string;
  driverLicenseState: string;
  // tractor
  tractorYear: string;
  tractorMake: string;
  tractorVin: string;
  tractorDamage: string;
  // trailer
  trailerDamage: string;
  trailerDescription: string;
  // towing
  vehicleTowed: string;
  towingCompany: string;
  towingCost: string;
  // cargo
  cargoDamage: string;
  cargoDescription: string;
  cargoValue: string;
  // additional
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
  timeOfLoss: "",
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
const DARK = "#0d2b2b";

const inputBase: React.CSSProperties = {
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: 8,
  padding: "12px 14px",
  color: DARK,
  width: "100%",
  fontSize: 14,
  outline: "none",
};

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label
      className="mb-1.5 block font-semibold"
      style={{ color: TEAL, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}
    >
      {children}
    </label>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="mb-5 mt-10 pb-2 font-display font-bold uppercase first:mt-0"
      style={{ color: DARK, fontSize: 13, letterSpacing: "0.1em", borderBottom: "1px solid #e5e7eb" }}
    >
      {children}
    </h3>
  );
}

function YesNo({
  name,
  value,
  onChange,
}: {
  name: keyof ClaimForm;
  value: string;
  onChange: (name: keyof ClaimForm, v: string) => void;
}) {
  return (
    <div className="flex gap-2">
      {["Yes", "No"].map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(name, opt)}
            className="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors"
            style={{
              background: active ? TEAL : "#f8fafc",
              border: `1px solid ${active ? TEAL : "#e2e8f0"}`,
              color: active ? "#fff" : DARK,
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export default function ClaimForm() {
  const [form, setForm] = useState<ClaimForm>(initialForm);
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "sending">("idle");

  const onChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setForm((c) => ({
      ...c,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const setField = (name: keyof ClaimForm, value: string) =>
    setForm((c) => ({ ...c, [name]: value }));

  const onFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = Array.from(e.target.files ?? []);
    setFiles((c) => [...c, ...next].slice(0, 8));
    e.target.value = "";
  };

  const removeFile = (i: number) =>
    setFiles((c) => c.filter((_, idx) => idx !== i));

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

      await sendQuoteEmail({
        formKind: "Claim Submission",
        source: "Claim Form Page",
        primaryName: form.policyHolderName || claimantNameVal || "Claim Report",
        customerName: claimantNameVal,
        customerEmail: claimantEmailVal,
        customerPhone: claimantPhoneVal,
        attachments: uploadedAttachments,
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
              ["Time of Loss", form.timeOfLoss],
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
              ["Uploaded Files", files.map((f) => `${f.name} (${formatFileSize(f.size)})`)],
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
    <div className="min-h-screen w-full">
      <SEO
        title="File a Claim | Custom Insurance Agency"
        description="Submit a commercial trucking insurance claim online. Our claims team will review your report and contact you to begin the process."
      />
      <div className="flex w-full flex-col md:flex-row" style={{ minHeight: "100vh" }}>
        {/* LEFT COLUMN */}
        <aside
          className="md:sticky md:top-0 md:h-screen md:w-[40%] md:flex-shrink-0 md:overflow-y-auto"
          style={{
            background: "linear-gradient(135deg,#0f2a42,#173b5d 60%,#0d2b2b)",
            padding: "64px 48px",
          }}
        >
          <p
            className="font-semibold uppercase"
            style={{ color: TEAL, fontSize: 11, letterSpacing: "0.15em" }}
          >
            CLAIM REPORT
          </p>
          <h1
            className="mt-3 font-display font-bold leading-tight text-white"
            style={{ fontSize: 38 }}
          >
            Tell us what happened
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-white/50">
            Fill out the form with as much detail as possible. You can upload photos, police reports, and any supporting documents to help us start your claim quickly.
          </p>

          <div
            className="mt-10 rounded-[10px]"
            style={{ border: "1px solid rgba(255,255,255,0.1)", padding: 24 }}
          >
            <p className="text-[13px] font-semibold uppercase tracking-wide text-white/80">
              Need immediate help?
            </p>
            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-3">
                <Phone size={18} style={{ color: TEAL }} className="mt-0.5" />
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-white/50">Phone</div>
                  <div className="text-[14px] font-medium" style={{ color: TEAL }}>
                    708-810-1955
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={18} style={{ color: TEAL }} className="mt-0.5" />
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-white/50">Email</div>
                  <div className="text-[14px] font-medium break-all" style={{ color: TEAL }}>
                    claims@custominsure.com
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={18} style={{ color: TEAL }} className="mt-0.5" />
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-white/50">Hours</div>
                  <div className="text-[14px] font-medium" style={{ color: TEAL }}>
                    Mon–Fri, 9:00 AM – 5:00 PM
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN */}
        <main
          className="flex-1 bg-white md:overflow-y-auto"
          style={{ padding: "64px 48px" }}
        >
          <form onSubmit={onSubmit} className="mx-auto max-w-[640px]">
            {/* Policy Holder */}
            <SectionTitle>Policy Holder Information</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Policy Holder Name</Label>
                <input required name="policyHolderName" value={form.policyHolderName} onChange={onChange} style={inputBase} />
              </div>
              <div>
                <Label>Policy Number</Label>
                <input name="policyNumber" value={form.policyNumber} onChange={onChange} style={inputBase} />
              </div>
              <div>
                <Label>Phone</Label>
                <input required type="tel" name="insuredPhone" value={form.insuredPhone} onChange={onChange} style={inputBase} />
              </div>
              <div>
                <Label>Email</Label>
                <input required type="email" name="insuredEmail" value={form.insuredEmail} onChange={onChange} style={inputBase} />
              </div>
            </div>

            {/* Who is Filing */}
            <SectionTitle>Who Is Filing</SectionTitle>
            <label className="mb-4 flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                name="sameAsHolder"
                checked={form.sameAsHolder}
                onChange={onChange}
                style={{ accentColor: TEAL, width: 16, height: 16 }}
              />
              <span style={{ color: DARK, fontSize: 14 }} className="font-medium">
                Same as Policy Holder
              </span>
            </label>
            {!form.sameAsHolder && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Name of Claimant</Label>
                  <input required name="claimantName" value={form.claimantName} onChange={onChange} style={inputBase} />
                </div>
                <div className="sm:col-span-2">
                  <Label>Address</Label>
                  <input required name="claimantAddress" value={form.claimantAddress} onChange={onChange} style={inputBase} />
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <input required type="tel" name="claimantPhone" value={form.claimantPhone} onChange={onChange} style={inputBase} />
                </div>
                <div>
                  <Label>Email Address</Label>
                  <input required type="email" name="claimantEmail" value={form.claimantEmail} onChange={onChange} style={inputBase} />
                </div>
              </div>
            )}

            {/* Location of Loss */}
            <SectionTitle>Location of Loss</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Date of Loss</Label>
                <input required type="date" name="dateOfLoss" value={form.dateOfLoss} onChange={onChange} style={inputBase} />
              </div>
              <div>
                <Label>Time of Loss</Label>
                <input type="time" name="timeOfLoss" value={form.timeOfLoss} onChange={onChange} style={inputBase} />
              </div>
              <div className="sm:col-span-2">
                <Label>Address</Label>
                <input required name="lossAddress" value={form.lossAddress} onChange={onChange} style={inputBase} />
              </div>
              <div>
                <Label>City</Label>
                <input required name="lossCity" value={form.lossCity} onChange={onChange} style={inputBase} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>State</Label>
                  <input required name="lossState" value={form.lossState} onChange={onChange} style={inputBase} />
                </div>
                <div>
                  <Label>ZIP</Label>
                  <input required name="lossZip" value={form.lossZip} onChange={onChange} style={inputBase} />
                </div>
              </div>
              <div className="sm:col-span-2">
                <Label>Police Report Filed?</Label>
                <YesNo name="policeReportFiled" value={form.policeReportFiled} onChange={setField} />
              </div>
            </div>

            {/* Accident Description */}
            <SectionTitle>Accident Description</SectionTitle>
            <div className="grid gap-4">
              <div>
                <Label>What happened?</Label>
                <textarea
                  required
                  name="accidentDescription"
                  value={form.accidentDescription}
                  onChange={onChange}
                  rows={5}
                  style={{ ...inputBase, resize: "vertical" }}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Third Party Damage?</Label>
                  <YesNo name="thirdPartyDamage" value={form.thirdPartyDamage} onChange={setField} />
                </div>
                <div>
                  <Label>Any Injuries?</Label>
                  <YesNo name="injuries" value={form.injuries} onChange={setField} />
                </div>
              </div>
            </div>

            {/* Driver */}
            <SectionTitle>Driver Information</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Driver Name</Label>
                <input name="driverName" value={form.driverName} onChange={onChange} style={inputBase} />
              </div>
              <div>
                <Label>Phone</Label>
                <input type="tel" name="driverPhone" value={form.driverPhone} onChange={onChange} style={inputBase} />
              </div>
              <div>
                <Label>Date of Birth</Label>
                <input type="date" name="driverDob" value={form.driverDob} onChange={onChange} style={inputBase} />
              </div>
              <div>
                <Label>License #</Label>
                <input name="driverLicense" value={form.driverLicense} onChange={onChange} style={inputBase} />
              </div>
              <div>
                <Label>License State</Label>
                <input name="driverLicenseState" value={form.driverLicenseState} onChange={onChange} style={inputBase} />
              </div>
            </div>

            {/* Tractor */}
            <SectionTitle>Tractor Information</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label>Year</Label>
                <input name="tractorYear" value={form.tractorYear} onChange={onChange} style={inputBase} />
              </div>
              <div>
                <Label>Make</Label>
                <input name="tractorMake" value={form.tractorMake} onChange={onChange} style={inputBase} />
              </div>
              <div>
                <Label>VIN</Label>
                <input name="tractorVin" value={form.tractorVin} onChange={onChange} style={inputBase} />
              </div>
            </div>
            <div className="mt-4">
              <Label>Tractor Damage?</Label>
              <YesNo name="tractorDamage" value={form.tractorDamage} onChange={setField} />
            </div>

            {/* Trailer */}
            <SectionTitle>Trailer Information</SectionTitle>
            <div className="grid gap-4">
              <div>
                <Label>Trailer Damage?</Label>
                <YesNo name="trailerDamage" value={form.trailerDamage} onChange={setField} />
              </div>
              {form.trailerDamage === "Yes" && (
                <div>
                  <Label>Damage Description</Label>
                  <textarea
                    name="trailerDescription"
                    value={form.trailerDescription}
                    onChange={onChange}
                    rows={3}
                    style={{ ...inputBase, resize: "vertical" }}
                  />
                </div>
              )}
            </div>

            {/* Towing */}
            <SectionTitle>Towing Information</SectionTitle>
            <div className="grid gap-4">
              <div>
                <Label>Vehicle Towed?</Label>
                <YesNo name="vehicleTowed" value={form.vehicleTowed} onChange={setField} />
              </div>
              {form.vehicleTowed === "Yes" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Towing Company</Label>
                    <input name="towingCompany" value={form.towingCompany} onChange={onChange} style={inputBase} />
                  </div>
                  <div>
                    <Label>Towing Cost</Label>
                    <input name="towingCost" value={form.towingCost} onChange={onChange} style={inputBase} />
                  </div>
                </div>
              )}
            </div>

            {/* Cargo */}
            <SectionTitle>Cargo Information</SectionTitle>
            <div className="grid gap-4">
              <div>
                <Label>Cargo Damage?</Label>
                <YesNo name="cargoDamage" value={form.cargoDamage} onChange={setField} />
              </div>
              {form.cargoDamage === "Yes" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label>Cargo Description</Label>
                    <textarea
                      name="cargoDescription"
                      value={form.cargoDescription}
                      onChange={onChange}
                      rows={3}
                      style={{ ...inputBase, resize: "vertical" }}
                    />
                  </div>
                  <div>
                    <Label>Cargo Value</Label>
                    <input name="cargoValue" value={form.cargoValue} onChange={onChange} style={inputBase} />
                  </div>
                </div>
              )}
            </div>

            {/* Additional */}
            <SectionTitle>Additional Information</SectionTitle>
            <div>
              <Label>Notes</Label>
              <textarea
                name="additionalInformation"
                value={form.additionalInformation}
                onChange={onChange}
                rows={4}
                style={{ ...inputBase, resize: "vertical" }}
              />
            </div>

            {/* Upload */}
            <SectionTitle>Upload Files</SectionTitle>
            <label
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[8px] border-2 border-dashed py-8 text-center"
              style={{ borderColor: "#e2e8f0", background: "#f8fafc" }}
            >
              <Upload size={22} style={{ color: TEAL }} />
              <div className="text-[14px] font-medium" style={{ color: DARK }}>
                Click to upload photos, police report, or documents
              </div>
              <div className="text-[12px] text-slate-500">Up to 8 files</div>
              <input type="file" multiple onChange={onFilesChange} className="hidden" />
            </label>
            {files.length > 0 && (
              <ul className="mt-3 space-y-2">
                {files.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between rounded-[8px] px-3 py-2 text-[13px]"
                    style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: DARK }}
                  >
                    <span className="truncate pr-3">
                      {f.name} <span className="text-slate-500">({formatFileSize(f.size)})</span>
                    </span>
                    <button type="button" onClick={() => removeFile(i)} className="text-slate-400 hover:text-slate-700">
                      <X size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-10 flex w-full items-center justify-center gap-2 font-display font-bold uppercase"
              style={{
                background: "linear-gradient(135deg,#f5821f,#f5c518)",
                color: "#1a1a1a",
                padding: "16px",
                borderRadius: 8,
                border: "none",
                letterSpacing: "0.08em",
                fontSize: 15,
                opacity: status === "sending" ? 0.7 : 1,
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
        </main>
      </div>
    </div>
  );
}
