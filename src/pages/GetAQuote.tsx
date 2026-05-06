import { useState, useRef, useMemo, type ChangeEvent, type DragEvent } from "react";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronRight, Plus, X, Upload, CheckCircle2, Loader2 } from "lucide-react";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import heroBg from "@/assets/hero-bg.webp";

/* ───────────── constants / data ───────────── */

const NAVY = "#0b1530";
const BLUE = "#1a6dd4";

const LANGUAGES = ["English", "Spanish", "Russian"];
const FMCSA_TYPES = ["MC", "DOT", "FF"];

const STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
  "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
  "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio",
  "Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota",
  "Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia",
  "Wisconsin","Wyoming","District of Columbia",
];

const COVERAGES = [
  "Auto Liability","Physical Damage","Motor Truck Cargo","Reefer Breakdown",
  "General Liability","Garage Keepers Liability","On-Hook","Trailer Interchange",
  "Non Owned Physical Damage","Excess/Umbrella","UM/UIM","Hired/Non-owned",
  "Non-Trucking Liability/Bobtail","Workers Compensation","Occupational Accident",
];

const COMMODITIES = [
  "General Freight","Household Goods","Metal: Sheets/Coils/Rolls","Motor Vehicles",
  "Drive Away/Towaway","Logs/Polls/Beams/Lumber","Building Materials","Mobile Homes",
  "Machinery/Large Objects","Fresh Produce","Liquids/Gases","Intermodal Container",
  "Passengers","Oil Field Equipment","Livestock","Grain/Feed/Hay","Coal/Coke","Meat",
  "Garbage/Refuse/Trash","U.S. Mail","Chemicals","Commodities Dry Bulk",
  "Refrigerated Food","Beverages","Paper Products","Utilities",
  "Agricultural/Farm Supplies","Construction","Water Well","Other",
];

const DOC_TYPES = [
  "Loss Run Report","IFTA Report","Bank Statements","Insurance Certificate",
  "Driver's License","Vehicle Registration","DOT Authority Letter","W-9 Form",
  "Lease Agreement","Other",
];

const MAX_DOCS = 10;
const ACCEPT =
  ".pdf,.jpg,.jpeg,.png,.doc,.docx,application/pdf,image/jpeg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const STEPS = [
  { full: "Basic Info", short: "Info" },
  { full: "Coverage", short: "Coverage" },
  { full: "Equipment", short: "Equipment" },
];

/* ───────────── types ───────────── */

type CoverageRow = { id: string; coverage: string; limit: string; deductible: string };
type CommodityRow = {
  id: string; commodity: string; hauled: string; aveLoad: string; maxLoad: string; shipper: string;
};
type DriverRow = {
  id: string; name: string; license: string; state: string; dob: string; experience: string;
};
type EquipmentRow = {
  id: string; equipment: string; year: string; make: string; vin: string; value: string; lienholder: string;
};
type DocRow = { id: string; docType: string; customName: string; file: File | null };

const uid = () => crypto.randomUUID();
const newCoverage = (): CoverageRow => ({ id: uid(), coverage: "", limit: "", deductible: "" });
const newCommodity = (): CommodityRow => ({ id: uid(), commodity: "", hauled: "", aveLoad: "", maxLoad: "", shipper: "" });
const newDriver = (): DriverRow => ({ id: uid(), name: "", license: "", state: "", dob: "", experience: "" });
const newEquipment = (): EquipmentRow => ({ id: uid(), equipment: "", year: "", make: "", vin: "", value: "", lienholder: "" });
const newDoc = (): DocRow => ({ id: uid(), docType: "", customName: "", file: null });

/* ───────────── shared classes ───────────── */

const fieldCls =
  "h-[52px] w-full rounded-lg border-[1.5px] border-[#e2e8f0] bg-[#f5f7fa] px-3.5 py-3.5 text-[15px] text-[#0b1530] shadow-none transition-all placeholder:text-[#94a3b8] focus-visible:border-[#1a6dd4] focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-[#1a6dd4]/15 focus-visible:ring-offset-0";

const labelCls = "mb-1.5 block text-[11px] font-semibold uppercase tracking-[1px] text-[#0b1530]";

/* ───────────── small UI helpers ───────────── */

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2
    className="border-l-[3px] pl-3 text-[13px] font-bold uppercase tracking-[2px]"
    style={{ color: BLUE, borderColor: BLUE }}
  >
    {children}
  </h2>
);

const FieldLabel = ({
  htmlFor, required, children,
}: { htmlFor?: string; required?: boolean; children: React.ReactNode }) => (
  <Label htmlFor={htmlFor} className={labelCls}>
    {children}
    {required && <span className="ml-0.5 text-destructive">*</span>}
  </Label>
);

const ErrorText = ({ msg }: { msg?: string }) =>
  msg ? <p className="mt-1 text-xs font-medium text-destructive">{msg}</p> : null;

const RemoveBtn = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="Remove"
    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-destructive transition hover:bg-destructive/10"
  >
    <X className="h-4 w-4" />
  </button>
);

const AddBtn = ({
  onClick, disabled, children,
}: { onClick: () => void; disabled?: boolean; children: React.ReactNode }) => (
  <Button
    type="button"
    variant="outline"
    onClick={onClick}
    disabled={disabled}
    className="h-11 rounded-full border-[1.5px] border-[#1a6dd4] bg-white px-5 text-sm font-semibold text-[#1a6dd4] hover:bg-[#1a6dd4]/5"
  >
    <Plus className="mr-1 h-4 w-4" /> {children}
  </Button>
);

/* ───────────── progress bar ───────────── */

const ProgressBar = ({ step }: { step: number }) => (
  <div className="mx-auto flex w-full max-w-[900px] items-stretch gap-2 sm:gap-3">
    {STEPS.map((s, i) => {
      const isActive = step === i;
      const isDone = step > i;
      return (
        <div key={s.full} className="flex flex-1 items-center">
          <div
            className={cn(
              "relative flex h-12 flex-1 items-center justify-center gap-2 px-3 text-[11px] font-bold uppercase tracking-[1.5px] transition-all sm:h-14 sm:text-[13px]",
              "clip-chevron",
            )}
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%, 14px 50%)",
              background: isActive ? BLUE : isDone ? NAVY : "#e2e8f0",
              color: isActive || isDone ? "#fff" : "#64748b",
            }}
          >
            {isDone && <Check className="h-4 w-4" strokeWidth={3} />}
            <span className="hidden sm:inline">{s.full}</span>
            <span className="sm:hidden">{s.short}</span>
          </div>
        </div>
      );
    })}
  </div>
);

/* ───────────── main page ───────────── */

export default function GetAQuote() {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Step 1
  const [s1, setS1] = useState({
    businessName: "",
    language: "",
    fmcsaType: "",
    fmcsaId: "",
    ein: "",
    yearsInBusiness: "",
    trucks: "",
    trailers: "",
    targetDate: undefined as Date | undefined,
    address: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    contactName: "",
    email: "",
    phone: "",
    fax: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 2
  const [coverages, setCoverages] = useState<CoverageRow[]>([newCoverage()]);
  const [radius, setRadius] = useState({
    r0_50: "", r51_200: "", r201_500: "", r500p: "", avg: "", max: "",
  });
  const [projections, setProjections] = useState({ mileage: "", revenue: "" });
  const [commodities, setCommodities] = useState<CommodityRow[]>([newCommodity()]);

  // Step 3
  const [drivers, setDrivers] = useState<DriverRow[]>([newDriver()]);
  const [tractors, setTractors] = useState<EquipmentRow[]>([newEquipment()]);
  const [trailers, setTrailers] = useState<EquipmentRow[]>([newEquipment()]);
  const [docs, setDocs] = useState<DocRow[]>([newDoc()]);

  const setField = <K extends keyof typeof s1>(k: K) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setS1((p) => ({ ...p, [k]: v }));
      if (errors[k as string]) setErrors((er) => ({ ...er, [k as string]: "" }));
    };

  const setPhone = (e: ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    let formatted = digits;
    if (digits.length > 6) formatted = `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
    else if (digits.length > 3) formatted = `(${digits.slice(0,3)}) ${digits.slice(3)}`;
    else if (digits.length > 0) formatted = `(${digits}`;
    setS1((p) => ({ ...p, phone: formatted }));
    if (errors.phone) setErrors((er) => ({ ...er, phone: "" }));
  };

  const validateStep1 = () => {
    const required: Array<[keyof typeof s1, string]> = [
      ["businessName", "Business name is required"],
      ["fmcsaId", "FMCSA ID is required"],
      ["ein", "EIN is required"],
      ["trucks", "Required"],
      ["trailers", "Required"],
      ["address", "Address is required"],
      ["city", "City is required"],
      ["state", "State is required"],
      ["zip", "ZIP is required"],
      ["contactName", "Contact name is required"],
      ["email", "Email is required"],
      ["phone", "Phone is required"],
    ];
    const er: Record<string, string> = {};
    for (const [k, m] of required) {
      if (!String(s1[k] ?? "").trim()) er[k as string] = m;
    }
    if (s1.email && !/^\S+@\S+\.\S+$/.test(s1.email)) er.email = "Invalid email";
    if (!s1.targetDate) er.targetDate = "Date is required";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const goNext = () => {
    if (step === 0 && !validateStep1()) {
      window.scrollTo({ top: 250, behavior: "smooth" });
      return;
    }
    setStep((s) => Math.min(2, s + 1));
    window.scrollTo({ top: 250, behavior: "smooth" });
  };
  const goPrev = () => {
    setStep((s) => Math.max(0, s - 1));
    window.scrollTo({ top: 250, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const uploaded: { path: string; name: string; docType: string }[] = [];
      for (const d of docs) {
        if (!d.file) continue;
        const ext = d.file.name.split(".").pop() ?? "bin";
        const path = `${uid()}.${ext}`;
        const { error } = await supabase.storage
          .from("quote-uploads")
          .upload(path, d.file, { contentType: d.file.type });
        if (error) throw error;
        uploaded.push({
          path,
          name: d.file.name,
          docType: d.docType === "Other" ? d.customName || "Other" : d.docType,
        });
      }

      const payload = {
        basicInfo: {
          ...s1,
          targetDate: s1.targetDate ? format(s1.targetDate, "yyyy-MM-dd") : null,
        },
        coverage: {
          coverages,
          radius,
          projections,
          commodities,
        },
        equipment: { drivers, tractors, trailers },
        documents: uploaded,
      };

      const { error: insErr } = await supabase.from("quote_requests").insert({
        first_name: s1.contactName.split(" ")[0] || s1.contactName,
        last_name: s1.contactName.split(" ").slice(1).join(" ") || "-",
        email: s1.email,
        phone: s1.phone,
        company: s1.businessName,
        zip: s1.zip,
        details: null,
        insurance_types: coverages.map((c) => c.coverage).filter(Boolean),
        documents: uploaded,
        payload,
      });
      if (insErr) throw insErr;

      try {
        await supabase.functions.invoke("notify-quote-request", { body: payload });
      } catch { /* optional */ }

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      toast({
        title: "Something went wrong. Please try again.",
        description: err instanceof Error ? err.message : undefined,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen" style={{ background: "#f6f8fb", fontFamily: "'DM Sans', Inter, system-ui, sans-serif" }}>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <Navbar />

      {/* Hero */}
      <section
        className="relative overflow-hidden pb-24 pt-32 sm:pt-36 lg:pb-32 lg:pt-44"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(11,21,48,0.88) 0%, rgba(11,21,48,0.78) 100%)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h1
            className="font-semibold tracking-tight text-white"
            style={{ fontSize: "clamp(34px, 4.6vw, 56px)", lineHeight: 1.1, fontFamily: "'DM Sans', sans-serif" }}
          >
            Get a Quote
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-white/85 sm:text-lg">
            Complete the form below and a Custom Insurance Agency representative will contact you within 24 hours.
          </p>
        </div>
      </section>

      {/* Progress */}
      <section className="relative -mt-12 px-4 sm:px-6">
        <ProgressBar step={step} />
      </section>

      {/* Form card */}
      <section className="px-4 pb-24 pt-8 sm:px-6">
        <div
          className="mx-auto w-full max-w-[900px] rounded-2xl bg-white p-6 sm:p-10 lg:p-12"
          style={{ boxShadow: "0 30px 60px -20px rgba(15,30,75,0.18)" }}
        >
          {submitted ? (
            <div className="flex flex-col items-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="h-9 w-9 text-emerald-600" />
              </div>
              <h2 className="mt-6 text-3xl font-semibold" style={{ color: NAVY }}>
                Thank you for contacting Custom Insurance Agency!
              </h2>
              <p className="mt-3 max-w-md text-[#475569]">
                A representative will be in touch with you within 24 hours.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                if (step < 2) { e.preventDefault(); goNext(); } else { handleSubmit(e); }
              }}
              className="space-y-10"
            >
              {step === 0 && (
                <Step1
                  s1={s1} setS1={setS1} errors={errors}
                  setField={setField} setPhone={setPhone}
                />
              )}
              {step === 1 && (
                <Step2
                  coverages={coverages} setCoverages={setCoverages}
                  radius={radius} setRadius={setRadius}
                  projections={projections} setProjections={setProjections}
                  commodities={commodities} setCommodities={setCommodities}
                />
              )}
              {step === 2 && (
                <Step3
                  drivers={drivers} setDrivers={setDrivers}
                  tractors={tractors} setTractors={setTractors}
                  trailers={trailers} setTrailers={setTrailers}
                  docs={docs} setDocs={setDocs}
                />
              )}

              {/* Nav buttons */}
              <div className={cn("flex flex-col-reverse items-stretch gap-3 border-t border-[#e2e8f0] pt-8 sm:flex-row sm:items-center", step === 0 ? "sm:justify-end" : "sm:justify-between")}>
                {step > 0 && (
                  <Button
                    type="button"
                    onClick={goPrev}
                    variant="outline"
                    className="h-12 w-full rounded-full border-[1.5px] px-10 text-sm font-bold uppercase tracking-wider sm:w-auto"
                    style={{ borderColor: BLUE, color: BLUE }}
                  >
                    « Previous
                  </Button>
                )}
                {step < 2 ? (
                  <Button
                    type="submit"
                    className="h-12 w-full rounded-full px-10 text-sm font-bold uppercase tracking-wider text-white sm:w-auto"
                    style={{ background: BLUE }}
                  >
                    Continue »
                  </Button>
                ) : (
                  <div className="flex w-full flex-col items-center gap-4 sm:w-auto sm:items-end">
                    <p className="max-w-xl text-center text-[11px] leading-relaxed text-[#64748b]">
                      By submitting this form, you agree to receive communications from Custom Insurance Agency related to your insurance quote, policy updates, and other relevant information. We will not resell your information to any third party. Any submissions made via this website do not constitute a binding agreement to your policy or coverages.
                    </p>
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="h-12 w-full rounded-full px-10 text-sm font-bold uppercase tracking-wider text-white sm:w-auto"
                      style={{ background: BLUE }}
                    >
                      {submitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting…</>) : "Submit"}
                    </Button>
                  </div>
                )}
              </div>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

/* ─────────────────────── STEP 1 ─────────────────────── */

function Step1({
  s1, setS1, errors, setField, setPhone,
}: {
  s1: any;
  setS1: React.Dispatch<React.SetStateAction<any>>;
  errors: Record<string, string>;
  setField: (k: any) => (e: ChangeEvent<HTMLInputElement>) => void;
  setPhone: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-10">
      {/* Company */}
      <div className="space-y-5">
        <SectionHeading>Company Information</SectionHeading>

        <div>
          <FieldLabel htmlFor="businessName" required>Business Name</FieldLabel>
          <Input id="businessName" className={fieldCls} value={s1.businessName} onChange={setField("businessName")} />
          <ErrorText msg={errors.businessName} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <FieldLabel>Preferred Language</FieldLabel>
            <SelectField value={s1.language} onChange={(v) => setS1((p: any) => ({ ...p, language: v }))} options={LANGUAGES} placeholder="Select language" />
          </div>
          <div>
            <FieldLabel>FMCSA Type</FieldLabel>
            <SelectField value={s1.fmcsaType} onChange={(v) => setS1((p: any) => ({ ...p, fmcsaType: v }))} options={FMCSA_TYPES} placeholder="Select type" />
          </div>

          <div>
            <FieldLabel htmlFor="fmcsaId" required>FMCSA ID</FieldLabel>
            <Input id="fmcsaId" className={fieldCls} value={s1.fmcsaId} onChange={setField("fmcsaId")} />
            <ErrorText msg={errors.fmcsaId} />
          </div>
          <div>
            <FieldLabel htmlFor="ein" required>EIN</FieldLabel>
            <Input id="ein" className={fieldCls} value={s1.ein} onChange={setField("ein")} />
            <ErrorText msg={errors.ein} />
          </div>

          <div>
            <FieldLabel htmlFor="yearsInBusiness">Years in Business</FieldLabel>
            <Input id="yearsInBusiness" className={fieldCls} value={s1.yearsInBusiness} onChange={setField("yearsInBusiness")} />
          </div>
          <div>
            <FieldLabel htmlFor="trucks" required>How Many Trucks Do You Have?</FieldLabel>
            <Input id="trucks" type="number" min="0" className={fieldCls} value={s1.trucks} onChange={setField("trucks")} />
            <ErrorText msg={errors.trucks} />
          </div>

          <div>
            <FieldLabel htmlFor="trailers" required>How Many Trailers Do You Have?</FieldLabel>
            <Input id="trailers" type="number" min="0" className={fieldCls} value={s1.trailers} onChange={setField("trailers")} />
            <ErrorText msg={errors.trailers} />
          </div>
          <div>
            <FieldLabel required>Target Effective Date</FieldLabel>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    fieldCls,
                    "flex items-center justify-between text-left",
                    !s1.targetDate && "text-[#94a3b8]",
                  )}
                >
                  <span>{s1.targetDate ? format(s1.targetDate, "MM/dd/yyyy") : "MM/DD/YYYY"}</span>
                  <CalendarIcon className="h-4 w-4 opacity-60" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={s1.targetDate}
                  onSelect={(d) => setS1((p: any) => ({ ...p, targetDate: d }))}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            <ErrorText msg={errors.targetDate} />
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="space-y-5">
        <SectionHeading>Physical Address</SectionHeading>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="address" required>Address</FieldLabel>
            <Input id="address" className={fieldCls} value={s1.address} onChange={setField("address")} />
            <ErrorText msg={errors.address} />
          </div>
          <div>
            <FieldLabel htmlFor="address2">Address 2</FieldLabel>
            <Input id="address2" className={fieldCls} value={s1.address2} onChange={setField("address2")} />
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <FieldLabel htmlFor="city" required>City</FieldLabel>
            <Input id="city" className={fieldCls} value={s1.city} onChange={setField("city")} />
            <ErrorText msg={errors.city} />
          </div>
          <div>
            <FieldLabel required>State</FieldLabel>
            <SelectField value={s1.state} onChange={(v) => setS1((p: any) => ({ ...p, state: v }))} options={STATES} placeholder="Select state" />
            <ErrorText msg={errors.state} />
          </div>
          <div>
            <FieldLabel htmlFor="zip" required>ZIP</FieldLabel>
            <Input id="zip" className={fieldCls} value={s1.zip} onChange={setField("zip")} />
            <ErrorText msg={errors.zip} />
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="space-y-5">
        <SectionHeading>Contact Information</SectionHeading>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="contactName" required>Contact Name</FieldLabel>
            <Input id="contactName" className={fieldCls} value={s1.contactName} onChange={setField("contactName")} />
            <ErrorText msg={errors.contactName} />
          </div>
          <div>
            <FieldLabel htmlFor="email" required>Email</FieldLabel>
            <Input id="email" type="email" className={fieldCls} value={s1.email} onChange={setField("email")} />
            <ErrorText msg={errors.email} />
          </div>
          <div>
            <FieldLabel htmlFor="phone" required>Phone</FieldLabel>
            <Input id="phone" inputMode="tel" placeholder="(XXX) XXX-XXXX" className={fieldCls} value={s1.phone} onChange={setPhone} />
            <ErrorText msg={errors.phone} />
          </div>
          <div>
            <FieldLabel htmlFor="fax">Fax</FieldLabel>
            <Input id="fax" className={fieldCls} value={s1.fax} onChange={setField("fax")} placeholder="Optional" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── STEP 2 ─────────────────────── */

function Step2({
  coverages, setCoverages, radius, setRadius, projections, setProjections, commodities, setCommodities,
}: any) {
  const updateCoverage = (id: string, patch: Partial<CoverageRow>) =>
    setCoverages((rows: CoverageRow[]) => rows.map((r) => r.id === id ? { ...r, ...patch } : r));
  const removeCoverage = (id: string) =>
    setCoverages((rows: CoverageRow[]) => rows.length === 1 ? [newCoverage()] : rows.filter((r) => r.id !== id));

  const updateCommodity = (id: string, patch: Partial<CommodityRow>) =>
    setCommodities((rows: CommodityRow[]) => rows.map((r) => r.id === id ? { ...r, ...patch } : r));
  const removeCommodity = (id: string) =>
    setCommodities((rows: CommodityRow[]) => rows.length === 1 ? [newCommodity()] : rows.filter((r) => r.id !== id));

  return (
    <div className="space-y-10">
      {/* Coverages */}
      <div className="space-y-4">
        <SectionHeading>Coverage Information</SectionHeading>
        <p className="text-sm text-[#475569]">Add one or more coverage types needed</p>

        <div className="space-y-4">
          {coverages.map((row: CoverageRow, i: number) => (
            <div key={row.id} className="rounded-xl border border-[#e2e8f0] bg-[#f9fbff] p-4 sm:p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#64748b]">Coverage {i + 1}</p>
                <RemoveBtn onClick={() => removeCoverage(row.id)} />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <FieldLabel>Coverage</FieldLabel>
                  <SelectField value={row.coverage} onChange={(v) => updateCoverage(row.id, { coverage: v })} options={COVERAGES} placeholder="Select coverage" />
                </div>
                <div>
                  <FieldLabel>Insurance Limit</FieldLabel>
                  <PrefixInput prefix="$" type="number" value={row.limit} onChange={(v) => updateCoverage(row.id, { limit: v })} />
                </div>
                <div>
                  <FieldLabel>Deductible</FieldLabel>
                  <PrefixInput prefix="$" type="number" value={row.deductible} onChange={(v) => updateCoverage(row.id, { deductible: v })} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <AddBtn onClick={() => setCoverages((r: CoverageRow[]) => [...r, newCoverage()])}>Add Coverage</AddBtn>
      </div>

      {/* Radius */}
      <div className="space-y-4">
        <SectionHeading>Operation Radius</SectionHeading>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
          {[
            ["r0_50", "0-50 Miles"],
            ["r51_200", "51-200 Miles"],
            ["r201_500", "201-500 Miles"],
            ["r500p", "500+ Miles"],
            ["avg", "Average Radius"],
            ["max", "Maximum Radius"],
          ].map(([k, label]) => (
            <div key={k}>
              <FieldLabel>{label}</FieldLabel>
              <Input
                type="number"
                className={fieldCls}
                value={(radius as any)[k]}
                onChange={(e) => setRadius((p: any) => ({ ...p, [k]: e.target.value }))}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Projections */}
      <div className="space-y-4">
        <SectionHeading>Upcoming Projections</SectionHeading>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <FieldLabel>Estimated Annual Mileage</FieldLabel>
            <Input type="number" className={fieldCls} value={projections.mileage}
              onChange={(e) => setProjections((p: any) => ({ ...p, mileage: e.target.value }))} />
          </div>
          <div>
            <FieldLabel>Estimated Annual Revenue</FieldLabel>
            <PrefixInput prefix="$" type="number" value={projections.revenue}
              onChange={(v) => setProjections((p: any) => ({ ...p, revenue: v }))} />
          </div>
        </div>
      </div>

      {/* Commodities */}
      <div className="space-y-4">
        <SectionHeading>Commodities Hauled</SectionHeading>
        <p className="text-sm text-[#475569]">Add all commodities your fleet hauls</p>

        <div className="space-y-4">
          {commodities.map((row: CommodityRow, i: number) => (
            <div key={row.id} className="rounded-xl border border-[#e2e8f0] bg-[#f9fbff] p-4 sm:p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#64748b]">Commodity {i + 1}</p>
                <RemoveBtn onClick={() => removeCommodity(row.id)} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <FieldLabel>Commodity</FieldLabel>
                  <SelectField value={row.commodity} onChange={(v) => updateCommodity(row.id, { commodity: v })} options={COMMODITIES} placeholder="Select commodity" />
                </div>
                <div>
                  <FieldLabel>Hauled</FieldLabel>
                  <SuffixInput suffix="%" type="number" value={row.hauled} onChange={(v) => updateCommodity(row.id, { hauled: v })} />
                </div>
                <div>
                  <FieldLabel>Ave Load Value</FieldLabel>
                  <PrefixInput prefix="$" type="number" value={row.aveLoad} onChange={(v) => updateCommodity(row.id, { aveLoad: v })} />
                </div>
                <div>
                  <FieldLabel>Max Load Value</FieldLabel>
                  <PrefixInput prefix="$" type="number" value={row.maxLoad} onChange={(v) => updateCommodity(row.id, { maxLoad: v })} />
                </div>
                <div className="lg:col-span-2">
                  <FieldLabel>Shipper</FieldLabel>
                  <Input className={fieldCls} value={row.shipper} onChange={(e) => updateCommodity(row.id, { shipper: e.target.value })} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <AddBtn onClick={() => setCommodities((r: CommodityRow[]) => [...r, newCommodity()])}>Add Commodity</AddBtn>
      </div>
    </div>
  );
}

/* ─────────────────────── STEP 3 ─────────────────────── */

function Step3({
  drivers, setDrivers, tractors, setTractors, trailers, setTrailers, docs, setDocs,
}: any) {
  const updRow = <T extends { id: string }>(setter: any) => (id: string, patch: Partial<T>) =>
    setter((rows: T[]) => rows.map((r) => r.id === id ? { ...r, ...patch } : r));
  const rmRow = <T extends { id: string }>(setter: any, factory: () => T) => (id: string) =>
    setter((rows: T[]) => rows.length === 1 ? [factory()] : rows.filter((r) => r.id !== id));

  const updDriver = updRow<DriverRow>(setDrivers);
  const rmDriver = rmRow<DriverRow>(setDrivers, newDriver);
  const updTractor = updRow<EquipmentRow>(setTractors);
  const rmTractor = rmRow<EquipmentRow>(setTractors, newEquipment);
  const updTrailer = updRow<EquipmentRow>(setTrailers);
  const rmTrailer = rmRow<EquipmentRow>(setTrailers, newEquipment);

  const updDoc = (id: string, patch: Partial<DocRow>) =>
    setDocs((rows: DocRow[]) => rows.map((r) => r.id === id ? { ...r, ...patch } : r));
  const rmDoc = (id: string) =>
    setDocs((rows: DocRow[]) => rows.length === 1 ? [newDoc()] : rows.filter((r) => r.id !== id));

  return (
    <div className="space-y-10">
      {/* Drivers */}
      <div className="space-y-4">
        <SectionHeading>Drivers</SectionHeading>
        <div className="space-y-4">
          {drivers.map((row: DriverRow, i: number) => (
            <div key={row.id} className="rounded-xl border border-[#e2e8f0] bg-[#f9fbff] p-4 sm:p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#64748b]">Driver {i + 1}</p>
                <RemoveBtn onClick={() => rmDriver(row.id)} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <FieldLabel>Driver Name</FieldLabel>
                  <Input className={fieldCls} value={row.name} onChange={(e) => updDriver(row.id, { name: e.target.value })} />
                </div>
                <div>
                  <FieldLabel>License Number</FieldLabel>
                  <Input className={fieldCls} value={row.license} onChange={(e) => updDriver(row.id, { license: e.target.value })} />
                </div>
                <div>
                  <FieldLabel>State</FieldLabel>
                  <SelectField value={row.state} onChange={(v) => updDriver(row.id, { state: v })} options={STATES} placeholder="Select state" />
                </div>
                <div>
                  <FieldLabel>Date of Birth</FieldLabel>
                  <Input placeholder="MM/DD/YY" className={fieldCls} value={row.dob} onChange={(e) => updDriver(row.id, { dob: e.target.value })} />
                </div>
                <div>
                  <FieldLabel>Years of Experience</FieldLabel>
                  <Input type="number" className={fieldCls} value={row.experience} onChange={(e) => updDriver(row.id, { experience: e.target.value })} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <AddBtn onClick={() => setDrivers((r: DriverRow[]) => [...r, newDriver()])}>Add Driver</AddBtn>
      </div>

      {/* Tractors */}
      <EquipmentBlock
        title="Tractors" rows={tractors} update={updTractor} remove={rmTractor}
        onAdd={() => setTractors((r: EquipmentRow[]) => [...r, newEquipment()])} addLabel="Add Tractor"
      />

      {/* Trailers */}
      <EquipmentBlock
        title="Trailers" rows={trailers} update={updTrailer} remove={rmTrailer}
        onAdd={() => setTrailers((r: EquipmentRow[]) => [...r, newEquipment()])} addLabel="Add Trailer"
      />

      {/* Documents */}
      <div className="space-y-4">
        <div>
          <SectionHeading>Document Upload</SectionHeading>
          <p className="mt-2 text-sm font-medium text-[#0b1530]">Attach Documents (Optional)</p>
          <p className="text-sm text-[#475569]">
            Accepted formats: PDF, JPG, PNG, DOC, DOCX — max {MAX_DOCS} documents
          </p>
        </div>

        <div className="space-y-4">
          {docs.map((d: DocRow, i: number) => (
            <DocRowComp key={d.id} doc={d} index={i} onUpdate={(p) => updDoc(d.id, p)} onRemove={() => rmDoc(d.id)} />
          ))}
        </div>
        <AddBtn onClick={() => setDocs((r: DocRow[]) => r.length >= MAX_DOCS ? r : [...r, newDoc()])} disabled={docs.length >= MAX_DOCS}>
          Add Another Document
        </AddBtn>
      </div>

      {/* Loss runs */}
      <div className="space-y-3">
        <SectionHeading>Loss Runs</SectionHeading>
        <p className="rounded-lg bg-[#f5f7fa] p-4 text-sm text-[#475569]">
          A Custom Insurance Agency representative will be in contact with you to gather Loss Run documents.
        </p>
      </div>

      {/* IFTA */}
      <div className="space-y-3">
        <SectionHeading>IFTA Documents</SectionHeading>
        <p className="rounded-lg bg-[#f5f7fa] p-4 text-sm text-[#475569]">
          A Custom Insurance Agency representative will be in contact with you to gather IFTA documents.
        </p>
      </div>
    </div>
  );
}

function EquipmentBlock({
  title, rows, update, remove, onAdd, addLabel,
}: {
  title: string;
  rows: EquipmentRow[];
  update: (id: string, patch: Partial<EquipmentRow>) => void;
  remove: (id: string) => void;
  onAdd: () => void;
  addLabel: string;
}) {
  return (
    <div className="space-y-4">
      <SectionHeading>{title}</SectionHeading>
      <div className="space-y-4">
        {rows.map((row, i) => (
          <div key={row.id} className="rounded-xl border border-[#e2e8f0] bg-[#f9fbff] p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#64748b]">{title.slice(0, -1)} {i + 1}</p>
              <RemoveBtn onClick={() => remove(row.id)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div><FieldLabel>Equipment</FieldLabel>
                <Input className={fieldCls} value={row.equipment} onChange={(e) => update(row.id, { equipment: e.target.value })} /></div>
              <div><FieldLabel>Year</FieldLabel>
                <Input type="number" className={fieldCls} value={row.year} onChange={(e) => update(row.id, { year: e.target.value })} /></div>
              <div><FieldLabel>Make</FieldLabel>
                <Input className={fieldCls} value={row.make} onChange={(e) => update(row.id, { make: e.target.value })} /></div>
              <div><FieldLabel>VIN</FieldLabel>
                <Input className={fieldCls} value={row.vin} onChange={(e) => update(row.id, { vin: e.target.value })} /></div>
              <div><FieldLabel>Value</FieldLabel>
                <PrefixInput prefix="$" type="number" value={row.value} onChange={(v) => update(row.id, { value: v })} /></div>
              <div><FieldLabel>Lienholder</FieldLabel>
                <Input className={fieldCls} value={row.lienholder} onChange={(e) => update(row.id, { lienholder: e.target.value })} /></div>
            </div>
          </div>
        ))}
      </div>
      <AddBtn onClick={onAdd}>{addLabel}</AddBtn>
    </div>
  );
}

/* ───────────── reusable inputs ───────────── */

function SelectField({
  value, onChange, options, placeholder,
}: { value: string; onChange: (v: string) => void; options: string[]; placeholder?: string }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={cn(fieldCls, "data-[placeholder]:text-[#94a3b8]")}>
        <SelectValue placeholder={placeholder ?? "Select..."} />
      </SelectTrigger>
      <SelectContent className="max-h-72">
        {options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}

function PrefixInput({
  prefix, value, onChange, type = "text",
}: { prefix: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div className={cn(fieldCls, "flex items-center gap-2 px-3 py-0")}>
      <span className="text-sm font-semibold text-[#64748b]">{prefix}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-full w-full bg-transparent text-[15px] text-[#0b1530] outline-none placeholder:text-[#94a3b8]"
      />
    </div>
  );
}

function SuffixInput({
  suffix, value, onChange, type = "text",
}: { suffix: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div className={cn(fieldCls, "flex items-center gap-2 px-3 py-0")}>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-full w-full bg-transparent text-[15px] text-[#0b1530] outline-none placeholder:text-[#94a3b8]"
      />
      <span className="text-sm font-semibold text-[#64748b]">{suffix}</span>
    </div>
  );
}

function DocRowComp({
  doc, index, onUpdate, onRemove,
}: {
  doc: DocRow; index: number; onUpdate: (p: Partial<DocRow>) => void; onRemove: () => void;
}) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onUpdate({ file: f });
  };

  return (
    <div className="rounded-xl border border-[#e2e8f0] bg-[#f9fbff] p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#64748b]">Document {index + 1}</p>
        <RemoveBtn onClick={onRemove} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel>Document Type</FieldLabel>
          <SelectField value={doc.docType} onChange={(v) => onUpdate({ docType: v })} options={DOC_TYPES} placeholder="Select type..." />
          {doc.docType === "Other" && (
            <Input
              className={cn(fieldCls, "mt-2")}
              placeholder="Document Name"
              value={doc.customName}
              onChange={(e) => onUpdate({ customName: e.target.value })}
            />
          )}
        </div>
        <div>
          <FieldLabel>File</FieldLabel>
          <div
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "flex min-h-[52px] cursor-pointer items-center justify-between gap-3 rounded-lg border-[1.5px] border-dashed px-3 py-2 text-sm transition-all",
              drag ? "border-[#1a6dd4] bg-[#1a6dd4]/5" : "border-[#cbd5e1] bg-white hover:border-[#1a6dd4]/60",
            )}
          >
            <span className={cn("truncate", doc.file ? "text-[#0b1530]" : "text-[#94a3b8]")}>
              {doc.file ? doc.file.name : "Drag file here or click to choose"}
            </span>
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-white"
              style={{ background: BLUE }}
            >
              <Upload className="h-3 w-3" /> Choose File
            </span>
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPT}
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onUpdate({ file: f });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}