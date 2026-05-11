import { useState, type ChangeEvent, type FormEvent } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import { sendQuoteEmail, SUCCESS_MSG, ERROR_MSG } from "@/lib/sendQuoteEmail";

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
const DARK = "#0d2b2b";
const LABEL_COLOR = "#374151";

const inputBase: React.CSSProperties = {
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: 8,
  padding: "12px 14px",
  color: DARK,
  width: "100%",
  fontSize: 14,
  outline: "none",
  fontFamily: "Inter, sans-serif",
};

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label
      className="mb-1.5 block"
      style={{
        color: LABEL_COLOR,
        fontSize: 14,
        fontWeight: 500,
        fontFamily: "Inter, sans-serif",
      }}
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
    <div className="flex flex-col gap-2 mt-2">
      {["Yes", "No"].map((opt) => (
        <label
          key={opt}
          className="flex items-center gap-2.5 cursor-pointer"
          style={{ color: LABEL_COLOR, fontSize: 14, fontFamily: "Inter, sans-serif" }}
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

      const timeOfLoss =
        form.timeHour || form.timeMinute
          ? `${form.timeHour || "--"}:${(form.timeMinute || "--").toString().padStart(2, "0")} ${form.timeAmpm}`
          : "";

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

  const stack = "flex flex-col gap-6";

  return (
    <div className="min-h-screen w-full bg-white">
      <SEO
        title="File a Claim | Custom Insurance Agency"
        description="Submit a commercial trucking insurance claim online. Our claims team will review your report and contact you to begin the process."
      />
      <Navbar />
      <main style={{ padding: "64px 24px" }}>
        <div className="mx-auto" style={{ maxWidth: 860 }}>
          <p
            className="font-semibold uppercase"
            style={{ color: TEAL, fontSize: 11, letterSpacing: "0.15em" }}
          >
            CLAIM REPORT
          </p>
          <h1
            className="mt-3 font-display font-bold leading-tight"
            style={{ fontSize: 38, color: DARK }}
          >
            Tell us what happened
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
            Fill out the form with as much detail as possible. You can upload photos, police reports, and any supporting documents to help us start your claim quickly.
          </p>

          <form onSubmit={onSubmit} className="mt-10">
            {/* Policy Holder */}
            <SectionTitle>Policy Holder Information</SectionTitle>
            <div className={stack}>
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
              <span style={{ color: LABEL_COLOR, fontSize: 14, fontFamily: "Inter, sans-serif" }}>
                Same as Policy Holder
              </span>
            </label>
            {!form.sameAsHolder && (
              <div className={stack}>
                <div>
                  <Label>Name of Claimant</Label>
                  <input required name="claimantName" value={form.claimantName} onChange={onChange} style={inputBase} />
                </div>
                <div>
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
            <div className={stack}>
              <div>
                <Label>Date of Loss</Label>
                <input required type="date" name="dateOfLoss" value={form.dateOfLoss} onChange={onChange} style={inputBase} />
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
                    style={{ ...inputBase, width: 80 }}
                  />
                  <span style={{ color: LABEL_COLOR, fontSize: 16 }}>:</span>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    name="timeMinute"
                    placeholder="MM"
                    value={form.timeMinute}
                    onChange={onChange}
                    style={{ ...inputBase, width: 80 }}
                  />
                  <select
                    name="timeAmpm"
                    value={form.timeAmpm}
                    onChange={onChange}
                    style={{ ...inputBase, width: 90 }}
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
              <div>
                <Label>Address</Label>
                <input required name="lossAddress" value={form.lossAddress} onChange={onChange} style={inputBase} />
              </div>
              <div>
                <Label>City</Label>
                <input required name="lossCity" value={form.lossCity} onChange={onChange} style={inputBase} />
              </div>
              <div>
                <Label>State</Label>
                <input required name="lossState" value={form.lossState} onChange={onChange} style={inputBase} />
              </div>
              <div>
                <Label>ZIP</Label>
                <input required name="lossZip" value={form.lossZip} onChange={onChange} style={inputBase} />
              </div>
              <div>
                <Label>Police Report Filed?</Label>
                <YesNoRadio name="policeReportFiled" value={form.policeReportFiled} onChange={setField} />
              </div>
            </div>

            {/* Accident Description (no section heading) */}
            <div className={`${stack} mt-10`}>
              <div>
                <Label>Briefly Describe the Accident</Label>
                <textarea
                  required
                  name="accidentDescription"
                  value={form.accidentDescription}
                  onChange={onChange}
                  style={{ ...inputBase, resize: "vertical", minHeight: 200 }}
                />
              </div>
              <div>
                <Label>Was there damage to third party property or state property?*</Label>
                <YesNoRadio name="thirdPartyDamage" value={form.thirdPartyDamage} onChange={setField} />
              </div>
              <div>
                <Label>Were there injuries?*</Label>
                <YesNoRadio name="injuries" value={form.injuries} onChange={setField} />
              </div>
            </div>

            {/* Driver */}
            <SectionTitle>Driver Information</SectionTitle>
            <div className={stack}>
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
            <div className={stack}>
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
              <div>
                <Label>Tractor Damage?</Label>
                <YesNoRadio name="tractorDamage" value={form.tractorDamage} onChange={setField} />
              </div>
            </div>

            {/* Trailer */}
            <SectionTitle>Trailer Information</SectionTitle>
            <div className={stack}>
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
                    style={{ ...inputBase, resize: "vertical" }}
                  />
                </div>
              )}
            </div>

            {/* Towing */}
            <SectionTitle>Towing Information</SectionTitle>
            <div className={stack}>
              <div>
                <Label>Vehicle Towed?</Label>
                <YesNoRadio name="vehicleTowed" value={form.vehicleTowed} onChange={setField} />
              </div>
              {form.vehicleTowed === "Yes" && (
                <>
                  <div>
                    <Label>Towing Company</Label>
                    <input name="towingCompany" value={form.towingCompany} onChange={onChange} style={inputBase} />
                  </div>
                  <div>
                    <Label>Towing Cost</Label>
                    <input name="towingCost" value={form.towingCost} onChange={onChange} style={inputBase} />
                  </div>
                </>
              )}
            </div>

            {/* Cargo */}
            <SectionTitle>Cargo Information</SectionTitle>
            <div className={stack}>
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
                      style={{ ...inputBase, resize: "vertical" }}
                    />
                  </div>
                  <div>
                    <Label>Cargo Value</Label>
                    <input name="cargoValue" value={form.cargoValue} onChange={onChange} style={inputBase} />
                  </div>
                </>
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
        </div>
      </main>
      <Footer />
    </div>
  );
}
