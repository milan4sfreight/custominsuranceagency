import { useState, useRef, type ChangeEvent, type DragEvent } from "react";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, Plus, X, Upload, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import heroBg from "@/assets/hero-bg.webp";

const TRUCKING_TYPES = [
  "Auto Liability",
  "Physical Damage",
  "Cargo",
  "Occupational Accident",
  "Workers Compensation",
];

const OTHER_TYPES = [
  "Auto",
  "Homeowners",
  "Renters",
  "Business & Commercial",
  "Life Insurance",
  "Health Insurance",
  "Flood Insurance",
  "Motorcycle",
  "Watercraft & Boat",
  "Limousine",
  "Recreational Vehicle",
  "General Liability",
  "Workers Comp (General)",
  "Builders Risk",
];

const DOC_TYPES = [
  "Loss Run Report",
  "IFTA Report",
  "Bank Statements",
  "Insurance Certificate",
  "Driver's License",
  "Vehicle Registration",
  "DOT Authority Letter",
  "W-9 Form",
  "Lease Agreement",
  "Other",
];

const MAX_DOCS = 10;
const ACCEPT = ".pdf,.jpg,.jpeg,.png,.doc,.docx,application/pdf,image/jpeg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

type DocEntry = {
  id: string;
  docType: string;
  customName: string;
  file: File | null;
};

const newDoc = (): DocEntry => ({
  id: crypto.randomUUID(),
  docType: "",
  customName: "",
  file: null,
});

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="border-l-[3px] border-brand pl-3 text-[18px] font-semibold text-ink">
    {children}
  </h2>
);

const FieldLabel = ({
  htmlFor,
  children,
  required,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  required?: boolean;
}) => (
  <Label
    htmlFor={htmlFor}
    className="mb-1.5 block text-sm font-medium text-ink"
  >
    {children} {required && <span className="text-destructive">*</span>}
  </Label>
);

const inputCls =
  "h-11 rounded-lg border-[1.5px] border-[#e2e8f0] bg-white text-ink shadow-none transition-all focus-visible:border-brand focus-visible:ring-4 focus-visible:ring-brand/15 focus-visible:ring-offset-0";

export default function GetAQuote() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    zip: "",
    details: "",
  });
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [docs, setDocs] = useState<DocEntry[]>([newDoc()]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = (k: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const toggleType = (t: string) =>
    setSelectedTypes((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]));

  const updateDoc = (id: string, patch: Partial<DocEntry>) =>
    setDocs((d) => d.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const removeDoc = (id: string) =>
    setDocs((d) => (d.length === 1 ? [newDoc()] : d.filter((x) => x.id !== id)));

  const addDoc = () =>
    setDocs((d) => (d.length >= MAX_DOCS ? d : [...d, newDoc()]));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.zip.trim()
    ) {
      toast({ title: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      // Upload files to storage
      const uploaded: { path: string; name: string; docType: string }[] = [];
      for (const d of docs) {
        if (!d.file) continue;
        const ext = d.file.name.split(".").pop() ?? "bin";
        const path = `${crypto.randomUUID()}.${ext}`;
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

      const { error: fnErr } = await supabase.functions.invoke("send-quote-request", {
        body: {
          ...form,
          insuranceTypes: selectedTypes,
          documents: uploaded,
        },
      });
      if (fnErr) throw fnErr;

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
    <main className="min-h-screen bg-[#f6f8fb]">
      <Navbar />

      {/* Hero */}
      <section
        className="relative overflow-hidden pb-16 pt-32 sm:pt-36 lg:pb-24 lg:pt-44"
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
              "linear-gradient(180deg, rgba(5,25,55,0.85) 0%, rgba(5,25,55,0.7) 100%), rgba(0,0,0,0.2)",
            backdropFilter: "blur(2px)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h1
            className="font-display font-semibold tracking-tight text-white"
            style={{ fontSize: "clamp(34px, 4.5vw, 56px)", lineHeight: 1.1 }}
          >
            Get Your Free Quote
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-white/85 sm:text-lg">
            Fill out the form below and we&apos;ll get back to you within 24 hours.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="relative -mt-10 px-4 pb-24 sm:px-6 lg:-mt-16">
        <div
          className="mx-auto w-full max-w-[860px] rounded-[24px] bg-white p-6 sm:p-10 lg:p-12"
          style={{ boxShadow: "0 30px 60px -20px rgba(15,30,75,0.18)" }}
        >
          {submitted ? (
            <div className="flex flex-col items-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="h-9 w-9 text-emerald-600" />
              </div>
              <h2 className="mt-6 font-display text-3xl font-semibold text-ink">
                Thank you!
              </h2>
              <p className="mt-3 max-w-md text-muted-ink">
                We&apos;ll be in touch within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Section 1 */}
              <div className="space-y-5">
                <SectionTitle>Personal Information</SectionTitle>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <FieldLabel htmlFor="firstName" required>First Name</FieldLabel>
                    <Input id="firstName" className={inputCls} value={form.firstName} onChange={update("firstName")} required />
                  </div>
                  <div>
                    <FieldLabel htmlFor="lastName" required>Last Name</FieldLabel>
                    <Input id="lastName" className={inputCls} value={form.lastName} onChange={update("lastName")} required />
                  </div>
                  <div>
                    <FieldLabel htmlFor="email" required>Email Address</FieldLabel>
                    <Input id="email" type="email" className={inputCls} value={form.email} onChange={update("email")} required />
                  </div>
                  <div>
                    <FieldLabel htmlFor="phone" required>Phone Number</FieldLabel>
                    <Input id="phone" type="tel" className={inputCls} value={form.phone} onChange={update("phone")} required />
                  </div>
                  <div>
                    <FieldLabel htmlFor="company">Company Name</FieldLabel>
                    <Input id="company" className={inputCls} value={form.company} onChange={update("company")} placeholder="Optional" />
                  </div>
                  <div>
                    <FieldLabel htmlFor="zip" required>ZIP Code</FieldLabel>
                    <Input id="zip" className={inputCls} value={form.zip} onChange={update("zip")} required />
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div className="space-y-5">
                <SectionTitle>What type of insurance are you looking for?</SectionTitle>

                <TypeGroup
                  label="Trucking Insurance"
                  types={TRUCKING_TYPES}
                  selected={selectedTypes}
                  onToggle={toggleType}
                />
                <TypeGroup
                  label="Other Insurance Types"
                  types={OTHER_TYPES}
                  selected={selectedTypes}
                  onToggle={toggleType}
                />
              </div>

              {/* Section 3 */}
              <div className="space-y-3">
                <SectionTitle>Tell us more about your needs</SectionTitle>
                <Textarea
                  value={form.details}
                  onChange={update("details")}
                  rows={5}
                  placeholder="Years in business, number of trucks, current insurance provider, any specific coverage needs..."
                  className="rounded-lg border-[1.5px] border-[#e2e8f0] bg-white text-ink transition-all focus-visible:border-brand focus-visible:ring-4 focus-visible:ring-brand/15 focus-visible:ring-offset-0"
                />
              </div>

              {/* Section 4 */}
              <div className="space-y-4">
                <div>
                  <SectionTitle>Attach Documents (Optional)</SectionTitle>
                  <p className="mt-2 text-sm text-muted-ink">
                    You can upload multiple documents. Accepted formats: PDF, JPG, PNG, DOC, DOCX
                  </p>
                </div>

                <div className="space-y-4">
                  {docs.map((d, i) => (
                    <DocRow
                      key={d.id}
                      doc={d}
                      index={i}
                      canRemove={docs.length > 1 || !!d.file || !!d.docType}
                      onUpdate={(patch) => updateDoc(d.id, patch)}
                      onRemove={() => removeDoc(d.id)}
                    />
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={addDoc}
                  disabled={docs.length >= MAX_DOCS}
                  className="h-11 rounded-full border-[1.5px] border-brand bg-white px-5 text-sm font-semibold text-brand hover:bg-brand-soft"
                >
                  <Plus className="mr-1 h-4 w-4" /> Add Another Document
                </Button>
                {docs.length >= MAX_DOCS && (
                  <p className="text-xs text-muted-ink">Maximum of {MAX_DOCS} documents.</p>
                )}
              </div>

              {/* Section 5 */}
              <div className="space-y-4 border-t border-[#e2e8f0] pt-8">
                <p className="text-xs leading-relaxed text-muted-ink">
                  Any submissions made via this website do not constitute a binding agreement. We will not resell your information to any third party.
                </p>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="h-14 w-full rounded-full bg-brand-gradient text-base font-semibold text-brand-foreground shadow-brand-glow transition-all hover:-translate-y-0.5 hover:opacity-95 sm:w-auto sm:px-10"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>Submit Quote Request →</>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

/* ───────────── Sub-components ───────────── */

const TypeGroup = ({
  label,
  types,
  selected,
  onToggle,
}: {
  label: string;
  types: string[];
  selected: string[];
  onToggle: (t: string) => void;
}) => (
  <div className="space-y-3">
    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-ink">
      {label}
    </p>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {types.map((t) => {
        const active = selected.includes(t);
        return (
          <button
            type="button"
            key={t}
            onClick={() => onToggle(t)}
            className={cn(
              "group relative flex items-center justify-between rounded-xl border-[1.5px] px-4 py-3 text-left text-sm font-medium transition-all duration-200",
              active
                ? "border-brand bg-brand text-brand-foreground shadow-brand-glow"
                : "border-[#e2e8f0] bg-white text-ink hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-soft",
            )}
          >
            <span>{t}</span>
            <span
              className={cn(
                "ml-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all",
                active
                  ? "border-white bg-white text-brand"
                  : "border-[#cbd5e1] bg-white text-transparent",
              )}
            >
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
          </button>
        );
      })}
    </div>
  </div>
);

const DocRow = ({
  doc,
  index,
  canRemove,
  onUpdate,
  onRemove,
}: {
  doc: DocEntry;
  index: number;
  canRemove: boolean;
  onUpdate: (patch: Partial<DocEntry>) => void;
  onRemove: () => void;
}) => {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onUpdate({ file: f });
  };

  return (
    <div className="relative rounded-xl border border-[#e2e8f0] bg-[#f9fbff] p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-ink">
          Document {index + 1}
        </p>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove document"
          className="flex h-7 w-7 items-center justify-center rounded-full text-muted-ink transition hover:bg-destructive/10 hover:text-destructive"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel>Document Type</FieldLabel>
          <Select
            value={doc.docType}
            onValueChange={(v) => onUpdate({ docType: v })}
          >
            <SelectTrigger className={cn(inputCls, "w-full")}>
              <SelectValue placeholder="Select type..." />
            </SelectTrigger>
            <SelectContent>
              {DOC_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {doc.docType === "Other" && (
            <Input
              className={cn(inputCls, "mt-2")}
              placeholder="Document Name"
              value={doc.customName}
              onChange={(e) => onUpdate({ customName: e.target.value })}
            />
          )}
        </div>

        <div>
          <FieldLabel>File</FieldLabel>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={onDrop}
            className={cn(
              "flex min-h-[44px] cursor-pointer items-center justify-between gap-3 rounded-lg border-[1.5px] border-dashed px-3 py-2 text-sm transition-all",
              drag
                ? "border-brand bg-brand-soft"
                : "border-[#cbd5e1] bg-white hover:border-brand/60",
            )}
            onClick={() => inputRef.current?.click()}
          >
            <span className={cn("truncate", doc.file ? "text-ink" : "text-muted-ink")}>
              {doc.file ? doc.file.name : "Drag file here or click to choose"}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-brand-foreground">
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
};