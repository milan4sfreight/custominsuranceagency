import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { AlertCircle, ArrowRight, Check, CheckCircle2, FileText, Loader2, Upload, X } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import { sendQuoteEmail, SUCCESS_MSG, ERROR_MSG } from "@/lib/sendQuoteEmail";

const HERO_IMG = "https://images.unsplash.com/photo-1450101499163-c8848c66ca85";

type ClaimForm = {
  insuredName: string;
  policyNumber: string;
  contactName: string;
  phone: string;
  email: string;
  claimType: string;
  dateOfLoss: string;
  timeOfLoss: string;
  lossAddress: string;
  lossCity: string;
  lossState: string;
  lossZip: string;
  policeDepartment: string;
  policeReportNumber: string;
  accidentDescription: string;
  injuries: string;
  propertyDamage: string;
  policeReportFiled: string;
  driverName: string;
  driverPhone: string;
  driverLicense: string;
  driverDob: string;
  tractorYearMakeModel: string;
  tractorUnitNumber: string;
  tractorVin: string;
  tractorPlate: string;
  trailerYearMakeModel: string;
  trailerUnitNumber: string;
  trailerVin: string;
  trailerPlate: string;
  cargoInvolved: string;
  cargoDescription: string;
  cargoValue: string;
  shipperBroker: string;
  vehicleTowed: string;
  towingCompany: string;
  storageLocation: string;
  witnesses: string;
  additionalInformation: string;
};

const initialForm: ClaimForm = {
  insuredName: "",
  policyNumber: "",
  contactName: "",
  phone: "",
  email: "",
  claimType: "Auto / Trucking",
  dateOfLoss: "",
  timeOfLoss: "",
  lossAddress: "",
  lossCity: "",
  lossState: "",
  lossZip: "",
  policeDepartment: "",
  policeReportNumber: "",
  accidentDescription: "",
  injuries: "No",
  propertyDamage: "No",
  policeReportFiled: "No",
  driverName: "",
  driverPhone: "",
  driverLicense: "",
  driverDob: "",
  tractorYearMakeModel: "",
  tractorUnitNumber: "",
  tractorVin: "",
  tractorPlate: "",
  trailerYearMakeModel: "",
  trailerUnitNumber: "",
  trailerVin: "",
  trailerPlate: "",
  cargoInvolved: "Not applicable",
  cargoDescription: "",
  cargoValue: "",
  shipperBroker: "",
  vehicleTowed: "No",
  towingCompany: "",
  storageLocation: "",
  witnesses: "",
  additionalInformation: "",
};

const steps = [
  {
    n: "01",
    title: "Contact Us Immediately",
    text: "As soon as an incident occurs, contact Custom Insurance Agency by phone or email. The sooner you report a claim, the faster we can begin the process. Have your policy number ready when you call.",
    contact: "📞 708-810-1955  |  ✉ info@custominsure.com",
  },
  {
    n: "02",
    title: "Document Everything",
    text: "Gather all relevant information including photos of damage, police reports if applicable, contact information of any other parties involved, and witness statements. The more documentation you have, the smoother the process.",
  },
  {
    n: "03",
    title: "Work With Your Adjuster",
    text: "Once your claim is filed, an adjuster will be assigned to your case. They will review your documentation, assess the damage, and work with you to reach a fair settlement as quickly as possible.",
  },
];

const checklist = [
  "Your policy number",
  "Date and time of the incident",
  "Location where the incident occurred",
  "Description of what happened",
  "Photos or videos of the damage",
  "Police report number, if applicable",
  "Contact info of other parties involved",
  "Names and contact info of any witnesses",
  "Driver's license information",
  "Vehicle VIN numbers for trucking claims",
];

const claimTypeOptions = ["Auto / Trucking", "Property", "General Liability", "Cargo", "Occupational Accident", "Other"];
const yesNoOptions = ["Yes", "No"];
const yesNoNaOptions = ["Yes", "No", "Not applicable"];

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

const Claims = () => {
  const [form, setForm] = useState<ClaimForm>(initialForm);
  const [files, setFiles] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const setRadio = (name: keyof ClaimForm, value: string) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const onFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextFiles = Array.from(e.target.files ?? []);
    setFiles((current) => [...current, ...nextFiles].slice(0, 8));
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((current) => current.filter((_, i) => i !== index));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    setSubmitted(false);

    try {
      const uploadedAttachments = await Promise.all(
        files.map(async (file) => ({
          filename: file.name,
          contentBase64: await fileToBase64(file),
          contentType: file.type || "application/octet-stream",
        })),
      );

      await sendQuoteEmail({
        formKind: "Claim Submission",
        source: "Claims Page — Claim Report",
        primaryName: form.insuredName || form.contactName || "Claim Report",
        customerName: form.contactName || form.insuredName,
        customerEmail: form.email,
        customerPhone: form.phone,
        attachments: uploadedAttachments,
        sections: [
          {
            title: "General Information",
            rows: [
              ["Insured Name", form.insuredName],
              ["Policy Number", form.policyNumber],
              ["Contact Name", form.contactName],
              ["Phone", form.phone],
              ["Email", form.email],
              ["Claim Type", form.claimType],
              ["Date of Loss", form.dateOfLoss],
              ["Time of Loss", form.timeOfLoss],
            ],
          },
          {
            title: "Location of Loss",
            rows: [
              ["Address / Location", form.lossAddress],
              ["City", form.lossCity],
              ["State", form.lossState],
              ["ZIP", form.lossZip],
              ["Police Department", form.policeDepartment],
              ["Police Report Number", form.policeReportNumber],
            ],
          },
          {
            title: "Accident Description",
            rows: [
              ["Description", form.accidentDescription],
              ["Any Injuries?", form.injuries],
              ["Property Damage?", form.propertyDamage],
              ["Police Report Filed?", form.policeReportFiled],
            ],
          },
          {
            title: "Driver Information",
            rows: [
              ["Driver Name", form.driverName],
              ["Driver Phone", form.driverPhone],
              ["Driver License", form.driverLicense],
              ["Driver Date of Birth", form.driverDob],
            ],
          },
          {
            title: "Tractor Information",
            rows: [
              ["Year / Make / Model", form.tractorYearMakeModel],
              ["Unit Number", form.tractorUnitNumber],
              ["VIN", form.tractorVin],
              ["Plate", form.tractorPlate],
            ],
          },
          {
            title: "Trailer Information",
            rows: [
              ["Year / Make / Model", form.trailerYearMakeModel],
              ["Trailer Number", form.trailerUnitNumber],
              ["VIN", form.trailerVin],
              ["Plate", form.trailerPlate],
            ],
          },
          {
            title: "Cargo Information",
            rows: [
              ["Cargo Involved?", form.cargoInvolved],
              ["Cargo Description", form.cargoDescription],
              ["Cargo Value", form.cargoValue],
              ["Shipper / Broker", form.shipperBroker],
            ],
          },
          {
            title: "Towing Information",
            rows: [
              ["Vehicle Towed?", form.vehicleTowed],
              ["Towing Company", form.towingCompany],
              ["Storage Location", form.storageLocation],
            ],
          },
          {
            title: "Additional Information",
            rows: [
              ["Witnesses", form.witnesses],
              ["Additional Information", form.additionalInformation],
              ["Uploaded Files", files.map((file) => `${file.name} (${formatFileSize(file.size)})`)],
            ],
          },
        ],
      });

      setSubmitted(true);
      setStatus("idle");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-background font-sans text-foreground">
      <SEO
        title="File a Claim | Custom Insurance Agency"
        description="Need to file an insurance claim? Custom Insurance Agency claims team is here to help. Call 708-810-1955 or email info@custominsure.com for immediate assistance."
      />
      <Navbar />

      <section
        className="relative flex h-[300px] w-full flex-col items-center justify-center bg-foreground pt-16"
        style={{ backgroundImage: `url(${HERO_IMG})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-foreground/65" />
        <div className="relative z-10 px-6 text-center text-primary-foreground">
          <h1 className="font-display text-[44px] leading-none sm:text-[52px]">Claims</h1>
          <p className="mt-3 text-[18px] font-medium text-primary-foreground/85">We're here to help you through the process</p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[960px] px-6 py-[60px] md:px-12">
        <p className="eyebrow text-[11px] uppercase text-brand">File A Claim</p>
        <h2 className="mt-2 text-[32px] font-bold leading-tight text-foreground">How to File a Claim</h2>
        <p className="mt-4 text-[16px] leading-[1.75] text-muted-foreground">
          At Custom Insurance Agency, we understand that filing a claim can be stressful. Our dedicated claims team is here to guide you through every step of the process and ensure you receive the coverage you are entitled to under your policy.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <article key={step.n} className="rounded-[8px] bg-muted p-8 shadow-soft">
              <div className="text-[36px] font-bold text-brand">{step.n}</div>
              <h3 className="mt-2 text-[18px] font-bold text-foreground">{step.title}</h3>
              <p className="mt-3 text-[14px] leading-[1.7] text-muted-foreground">{step.text}</p>
              {step.contact && <p className="mt-4 text-[13px] font-semibold text-brand-deep">{step.contact}</p>}
            </article>
          ))}
        </div>
      </section>

      <section className="bg-dark-gradient px-6 py-[60px] md:px-12">
        <div className="mx-auto max-w-[960px]">
          <p className="eyebrow text-[11px] uppercase text-brand">Be Prepared</p>
          <h2 className="mt-2 text-[28px] font-bold text-primary-foreground">What to Have Ready When You File</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {checklist.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[15px] text-primary-foreground/90">
                <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-brand">
                  <Check className="h-4 w-4 text-brand-foreground" />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-dark-gradient px-6 py-[80px] md:px-12">
        <div className="mx-auto max-w-[840px] text-center">
          <p className="eyebrow text-[11px] uppercase text-brand">Ready To File?</p>
          <h2 className="mt-3 text-[34px] font-bold leading-tight text-primary-foreground md:text-[42px]">Start Your Claim Online</h2>
          <p className="mx-auto mt-4 max-w-[620px] text-[16px] leading-[1.7] text-primary-foreground/70">
            Submit a detailed claim report with vehicle, cargo, towing, police report, and upload information. Our claims team will review it and contact you within 24 hours.
          </p>
          <a
            href="#claim-form"
            className="mt-8 inline-flex items-center justify-center gap-2 shadow-brand-glow transition hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            style={{
              background: "linear-gradient(135deg, #f5821f 0%, #f5c518 100%)",
              color: "#1a1a1a",
              fontFamily: "Barlow, system-ui, sans-serif",
              fontWeight: 700,
              padding: "16px 48px",
              borderRadius: "8px",
            }}
          >
            Start Your Claim <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </section>

      <section id="claim-form" className="bg-dark-gradient px-6 py-[64px] md:px-12">
        <div className="mx-auto max-w-[1080px]">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <aside className="lg:sticky lg:top-28">
              <p className="eyebrow text-[11px] uppercase text-brand">Claim Report</p>
              <h2 className="mt-2 text-[32px] font-bold leading-tight text-primary-foreground">Tell us what happened</h2>
              <p className="mt-4 text-[15px] leading-[1.75] text-primary-foreground/70">
                Include as much detail as possible. Photos, police reports, bills of lading, and towing documents can be uploaded before submission.
              </p>
              <div className="mt-8 rounded-[8px] border border-white/15 bg-white/5 p-6 shadow-soft backdrop-blur">
                <h3 className="text-[18px] font-bold text-primary-foreground">Need immediate help?</h3>
                <ul className="mt-4 space-y-3 text-[15px] text-primary-foreground/70">
                  <li><span className="font-semibold text-primary-foreground">Phone:</span> 708-810-1955</li>
                  <li><span className="font-semibold text-primary-foreground">Email:</span> info@custominsure.com</li>
                  <li><span className="font-semibold text-primary-foreground">Hours:</span> Monday – Friday, 9:00 AM – 5:00 PM</li>
                </ul>
              </div>
            </aside>

            <form onSubmit={onSubmit} className="space-y-6">
              {submitted && (
                <StatusMessage tone="success" icon={<CheckCircle2 className="h-5 w-5" />}>
                  {SUCCESS_MSG}
                </StatusMessage>
              )}

              {status === "error" && (
                <StatusMessage tone="error" icon={<AlertCircle className="h-5 w-5" />}>
                  {ERROR_MSG}
                </StatusMessage>
              )}

              <FormPanel title="GENERAL INFORMATION" columns>
                <Field name="insuredName" label="Insured Name" value={form.insuredName} onChange={onChange} required />
                <Field name="policyNumber" label="Policy Number" value={form.policyNumber} onChange={onChange} required />
                <Field name="contactName" label="Contact Name" value={form.contactName} onChange={onChange} required />
                <Field name="phone" label="Phone Number" type="tel" value={form.phone} onChange={onChange} required />
                <Field name="email" label="Email Address" type="email" value={form.email} onChange={onChange} required />
                <SelectField name="claimType" label="Type of Claim" value={form.claimType} options={claimTypeOptions} onChange={onChange} />
                <Field name="dateOfLoss" label="Date of Loss" type="date" value={form.dateOfLoss} onChange={onChange} required />
                <Field name="timeOfLoss" label="Time of Loss" type="time" value={form.timeOfLoss} onChange={onChange} />
              </FormPanel>

              <FormPanel title="LOCATION OF LOSS" columns>
                <Field name="lossAddress" label="Address / Location" value={form.lossAddress} onChange={onChange} required className="md:col-span-2" />
                <Field name="lossCity" label="City" value={form.lossCity} onChange={onChange} />
                <Field name="lossState" label="State" value={form.lossState} onChange={onChange} />
                <Field name="lossZip" label="ZIP Code" value={form.lossZip} onChange={onChange} />
                <Field name="policeDepartment" label="Police Department" value={form.policeDepartment} onChange={onChange} />
                <Field name="policeReportNumber" label="Police Report Number" value={form.policeReportNumber} onChange={onChange} className="md:col-span-2" />
              </FormPanel>

              <FormPanel title="ACCIDENT DESCRIPTION">
                <TextareaField name="accidentDescription" label="Describe the accident" value={form.accidentDescription} onChange={onChange} required rows={6} />
                <div className="grid gap-5 md:grid-cols-3">
                  <RadioGroup label="Any injuries?" name="injuries" value={form.injuries} options={yesNoOptions} onChange={setRadio} />
                  <RadioGroup label="Property damage?" name="propertyDamage" value={form.propertyDamage} options={yesNoOptions} onChange={setRadio} />
                  <RadioGroup label="Police report filed?" name="policeReportFiled" value={form.policeReportFiled} options={yesNoOptions} onChange={setRadio} />
                </div>
              </FormPanel>

              <FormPanel title="DRIVER INFORMATION" columns>
                <Field name="driverName" label="Driver Name" value={form.driverName} onChange={onChange} />
                <Field name="driverPhone" label="Driver Phone" type="tel" value={form.driverPhone} onChange={onChange} />
                <Field name="driverLicense" label="Driver License Number" value={form.driverLicense} onChange={onChange} />
                <Field name="driverDob" label="Driver Date of Birth" type="date" value={form.driverDob} onChange={onChange} />
              </FormPanel>

              <FormPanel title="TRACTOR INFORMATION" columns>
                <Field name="tractorYearMakeModel" label="Year / Make / Model" value={form.tractorYearMakeModel} onChange={onChange} />
                <Field name="tractorUnitNumber" label="Unit Number" value={form.tractorUnitNumber} onChange={onChange} />
                <Field name="tractorVin" label="VIN" value={form.tractorVin} onChange={onChange} />
                <Field name="tractorPlate" label="Plate Number" value={form.tractorPlate} onChange={onChange} />
              </FormPanel>

              <FormPanel title="TRAILER INFORMATION" columns>
                <Field name="trailerYearMakeModel" label="Year / Make / Model" value={form.trailerYearMakeModel} onChange={onChange} />
                <Field name="trailerUnitNumber" label="Trailer Number" value={form.trailerUnitNumber} onChange={onChange} />
                <Field name="trailerVin" label="VIN" value={form.trailerVin} onChange={onChange} />
                <Field name="trailerPlate" label="Plate Number" value={form.trailerPlate} onChange={onChange} />
              </FormPanel>

              <FormPanel title="CARGO INFORMATION" columns>
                <RadioGroup label="Was cargo involved?" name="cargoInvolved" value={form.cargoInvolved} options={yesNoNaOptions} onChange={setRadio} className="md:col-span-2" />
                <Field name="cargoDescription" label="Cargo Description" value={form.cargoDescription} onChange={onChange} />
                <Field name="cargoValue" label="Estimated Cargo Value" value={form.cargoValue} onChange={onChange} />
                <Field name="shipperBroker" label="Shipper / Broker" value={form.shipperBroker} onChange={onChange} className="md:col-span-2" />
              </FormPanel>

              <FormPanel title="TOWING INFORMATION" columns>
                <RadioGroup label="Was the vehicle towed?" name="vehicleTowed" value={form.vehicleTowed} options={yesNoOptions} onChange={setRadio} className="md:col-span-2" />
                <Field name="towingCompany" label="Towing Company" value={form.towingCompany} onChange={onChange} />
                <Field name="storageLocation" label="Storage Location" value={form.storageLocation} onChange={onChange} />
              </FormPanel>

              <FormPanel title="ADDITIONAL INFORMATION">
                <TextareaField name="witnesses" label="Witness Information" value={form.witnesses} onChange={onChange} rows={4} />
                <TextareaField name="additionalInformation" label="Additional Information" value={form.additionalInformation} onChange={onChange} rows={5} />
              </FormPanel>

              <FormPanel title="UPLOAD FILES">
                <label className="flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-[8px] border border-dashed border-border bg-muted/50 px-5 py-8 text-center transition hover:border-brand hover:bg-brand-soft">
                  <Upload className="h-8 w-8 text-brand" />
                  <span className="mt-3 text-[15px] font-semibold text-foreground">Upload claim documents</span>
                  <span className="mt-1 text-[13px] leading-6 text-muted-foreground">Photos, police reports, towing invoices, bills of lading, or repair estimates. Up to 8 files.</span>
                  <input type="file" multiple className="sr-only" onChange={onFilesChange} />
                </label>

                {files.length > 0 && (
                  <ul className="space-y-3">
                    {files.map((file, index) => (
                      <li key={`${file.name}-${index}`} className="flex items-center justify-between gap-4 rounded-[8px] border border-border bg-card px-4 py-3">
                        <span className="flex min-w-0 items-center gap-3">
                          <FileText className="h-5 w-5 flex-none text-brand" />
                          <span className="min-w-0">
                            <span className="block truncate text-[14px] font-semibold text-foreground">{file.name}</span>
                            <span className="text-[12px] text-muted-foreground">{formatFileSize(file.size)}</span>
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="flex h-8 w-8 flex-none items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
                          aria-label={`Remove ${file.name}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </FormPanel>

              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-cta-gradient px-12 py-4 text-[15px] font-bold text-cta-foreground shadow-brand-glow transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
              >
                {status === "sending" ? <Loader2 className="h-5 w-5 animate-spin" /> : <FileText className="h-5 w-5" />}
                {status === "sending" ? "Generating PDF and Sending…" : "Submit Claim Report"}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

const FormPanel = ({
  title,
  children,
  columns = false,
}: {
  title: string;
  children: ReactNode;
  columns?: boolean;
}) => (
  <section className="rounded-[8px] border border-white/15 bg-white/5 p-5 shadow-soft backdrop-blur md:p-6">
    <h3 className="text-[18px] font-bold text-primary-foreground">{title}</h3>
    <div className={columns ? "mt-5 grid gap-4 md:grid-cols-2" : "mt-5 space-y-5"}>{children}</div>
  </section>
);

const labelClass = "block text-[13px] font-semibold text-primary-foreground";
const inputClass = "mt-1 w-full rounded-[6px] border border-white/20 bg-white/10 px-3 py-3 text-[14px] text-primary-foreground outline-none transition placeholder:text-primary-foreground/50 focus:border-brand focus:ring-2 focus:ring-ring/20";

type BaseFieldProps = {
  name: keyof ClaimForm;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  required?: boolean;
  className?: string;
};

const Field = ({ name, label, value, onChange, required, type = "text", className = "" }: BaseFieldProps & { type?: string }) => (
  <div className={className}>
    <label className={labelClass} htmlFor={name}>{label}{required ? " *" : ""}</label>
    <input id={name} name={name} value={value} onChange={onChange} required={required} type={type} className={inputClass} />
  </div>
);

const SelectField = ({ name, label, value, options, onChange }: BaseFieldProps & { options: string[] }) => (
  <div>
    <label className={labelClass} htmlFor={name}>{label}</label>
    <select id={name} name={name} value={value} onChange={onChange} className={inputClass}>
      {options.map((option) => <option key={option}>{option}</option>)}
    </select>
  </div>
);

const TextareaField = ({ name, label, value, onChange, required, rows = 4 }: BaseFieldProps & { rows?: number }) => (
  <div>
    <label className={labelClass} htmlFor={name}>{label}{required ? " *" : ""}</label>
    <textarea id={name} name={name} value={value} onChange={onChange} required={required} rows={rows} className={inputClass} />
  </div>
);

const RadioGroup = ({
  label,
  name,
  value,
  options,
  onChange,
  className = "",
}: {
  label: string;
  name: keyof ClaimForm;
  value: string;
  options: string[];
  onChange: (name: keyof ClaimForm, value: string) => void;
  className?: string;
}) => (
  <fieldset className={className}>
    <legend className={labelClass}>{label}</legend>
    <div className="mt-2 flex flex-wrap gap-2">
      {options.map((option) => (
        <label key={option} className="flex cursor-pointer items-center gap-2 rounded-[8px] border border-border bg-background px-3 py-2 text-[14px] font-medium text-foreground transition has-[:checked]:border-brand has-[:checked]:bg-brand-soft">
          <input
            type="radio"
            name={name}
            value={option}
            checked={value === option}
            onChange={() => onChange(name, option)}
            className="h-4 w-4 accent-brand"
          />
          {option}
        </label>
      ))}
    </div>
  </fieldset>
);

const StatusMessage = ({
  tone,
  icon,
  children,
}: {
  tone: "success" | "error";
  icon: ReactNode;
  children: ReactNode;
}) => (
  <div className={`flex items-start gap-3 rounded-[8px] border p-4 text-[14px] font-semibold ${tone === "success" ? "border-brand/30 bg-brand-soft text-brand-deep" : "border-destructive/30 bg-destructive/10 text-destructive"}`}>
    <span className="mt-0.5 flex-none">{icon}</span>
    <span>{children}</span>
  </div>
);

export default Claims;
