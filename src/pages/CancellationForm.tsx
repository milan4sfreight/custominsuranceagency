import { useState, useRef, useEffect, type FormEvent } from "react";
import { Loader2, ChevronDown, Check } from "lucide-react";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import { sendQuoteEmail } from "@/lib/sendQuoteEmail";

const TEAL = "#2abfbf";
const NAVY = "#173b5d";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
];

const POLICY_TYPES = [
  { key: "AL", label: "Auto Liability (AL)" },
  { key: "MTC", label: "Motor Truck Cargo (MTC)" },
  { key: "GL", label: "General Liability (GL)" },
  { key: "PD", label: "Physical Damage (PD)" },
  { key: "NTL", label: "Non-Trucking Liability (NTL)" },
  { key: "OCC", label: "Occupational Accident (OCC)" },
];

const inputBase: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #d1d5db",
  borderRadius: 6,
  padding: "6px 12px",
  height: 36,
  color: "#0d2b2b",
  width: "100%",
  boxSizing: "border-box",
  display: "block",
  fontSize: 14,
  outline: "none",
  fontFamily: "Inter, sans-serif",
  WebkitAppearance: "none",
  appearance: "none",
  transition: "border-color .15s ease",
};
const lockedInput: React.CSSProperties = { ...inputBase, background: "#f3f4f6", color: "#4b5563" };

const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = TEAL;
};
const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = "#d1d5db";
};
const fieldProps = { style: inputBase, onFocus: handleFocus, onBlur: handleBlur };

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label
      className="mb-1 block"
      style={{ color: NAVY, fontSize: 13, fontWeight: 500, fontFamily: "Inter, sans-serif" }}
    >
      {children}
      {required && <span style={{ color: "#dc2626", marginLeft: 4 }}>*</span>}
    </label>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h3
        className="mb-3 pb-2 uppercase"
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
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

type PolicyDetail = { company: string; number: string; effective: string; expiration: string };
const blankPolicy = (): PolicyDetail => ({ company: "", number: "", effective: "", expiration: "" });

const todayISO = () => new Date().toISOString().slice(0, 10);

const accInput: React.CSSProperties = {
  background: "#ffffff",
  border: "0.5px solid #9FE1CB",
  borderRadius: 5,
  padding: "8px 10px",
  height: 44,
  fontSize: 14,
  color: "#0d2b2b",
  width: "100%",
  boxSizing: "border-box",
  outline: "none",
  fontFamily: "Inter, sans-serif",
};
const slimLabel: React.CSSProperties = {
  fontSize: 10,
  color: "#0f6e56",
  fontFamily: "Inter, sans-serif",
  marginBottom: 2,
  display: "block",
  fontWeight: 500,
};

function PolicyAccordion({
  selected,
  details,
  onToggle,
  onUpdate,
}: {
  selected: Record<string, boolean>;
  details: Record<string, PolicyDetail>;
  onToggle: (key: string) => void;
  onUpdate: (key: string, k: keyof PolicyDetail, v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {POLICY_TYPES.map((p) => {
        const isSel = !!selected[p.key];
        const d = details[p.key] ?? blankPolicy();
        return (
          <div
            key={p.key}
            style={{
              background: "#ffffff",
              border: isSel ? `1.5px solid ${TEAL}` : "1px solid #e5e7eb",
              borderRadius: 8,
              overflow: "hidden",
              transition: "border-color .2s ease",
            }}
          >
            <button
              type="button"
              onClick={() => onToggle(p.key)}
              className="flex w-full items-center gap-3 px-3 py-2 text-left"
              style={{ background: "transparent", fontFamily: "Inter, sans-serif" }}
              aria-expanded={isSel}
            >
              <span
                className="flex items-center justify-center"
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 3,
                  border: isSel ? `1.5px solid ${TEAL}` : "1.5px solid #cbd5e1",
                  background: isSel ? TEAL : "#ffffff",
                  flexShrink: 0,
                  transition: "all .15s ease",
                }}
              >
                {isSel && <Check size={11} color="#ffffff" strokeWidth={3} />}
              </span>
              <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: NAVY }}>{p.label}</span>
              <ChevronDown
                size={16}
                color={isSel ? TEAL : "#94a3b8"}
                style={{ transition: "transform .2s ease", transform: isSel ? "rotate(180deg)" : "none" }}
              />
            </button>

            {isSel && (
              <div
                style={{
                  height: "auto",
                  overflow: "visible",
                  background: "#e8fafa",
                }}
              >
                <div style={{ borderTop: "1px solid #9FE1CB", padding: "12px 14px 16px 40px" }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="min-w-0">
                    <label style={slimLabel}>Insurance Company Name</label>
                    <input
                      style={{ ...accInput, minWidth: 0 }}
                      value={d.company}
                      onChange={(e) => onUpdate(p.key, "company", e.target.value)}
                    />
                  </div>
                  <div className="min-w-0">
                    <label style={slimLabel}>Policy Number</label>
                    <input
                      style={{ ...accInput, minWidth: 0 }}
                      value={d.number}
                      onChange={(e) => onUpdate(p.key, "number", e.target.value)}
                    />
                  </div>
                  <div className="min-w-0">
                    <label style={slimLabel}>Effective Date</label>
                    <input
                      type="date"
                      style={{ ...accInput, minWidth: 0 }}
                      value={d.effective}
                      onChange={(e) => onUpdate(p.key, "effective", e.target.value)}
                    />
                  </div>
                  <div className="min-w-0">
                    <label style={slimLabel}>Expiration Date</label>
                    <input
                      type="date"
                      style={{ ...accInput, minWidth: 0 }}
                      value={d.expiration}
                      onChange={(e) => onUpdate(p.key, "expiration", e.target.value)}
                    />
                  </div>
                </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function CancellationForm() {
  // Section 2
  const [effDate, setEffDate] = useState("");
  const [effTime, setEffTime] = useState("");

  // Section 3 — policies
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [details, setDetails] = useState<Record<string, PolicyDetail>>({});
  const togglePolicy = (key: string) => {
    setSelected((s) => ({ ...s, [key]: !s[key] }));
    setDetails((d) => (d[key] ? d : { ...d, [key]: blankPolicy() }));
  };
  const updateDetail = (key: string, k: keyof PolicyDetail, v: string) =>
    setDetails((d) => ({ ...d, [key]: { ...(d[key] ?? blankPolicy()), [k]: v } }));

  // Section 4
  const [insured, setInsured] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("IL");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Section 5
  const [reason, setReason] = useState("");

  // Section 6
  const [printName, setPrintName] = useState("");
  const [signDate, setSignDate] = useState(todayISO());
  const [certified, setCertified] = useState(false);

  // Signature canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const hasSig = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.strokeStyle = "#0d2b2b";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const getPoint = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      const t = e.touches[0] || e.changedTouches[0];
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };
  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    drawingRef.current = true;
    lastRef.current = getPoint(e);
  };
  const moveDraw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawingRef.current) return;
    e.preventDefault();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !lastRef.current) return;
    const p = getPoint(e);
    ctx.beginPath();
    ctx.moveTo(lastRef.current.x, lastRef.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    lastRef.current = p;
    hasSig.current = true;
  };
  const endDraw = () => {
    drawingRef.current = false;
    lastRef.current = null;
  };
  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, rect.height);
    hasSig.current = false;
  };

  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;

    if (!effDate || !effTime) return toast.error("Please enter cancellation date and time.");
    const selectedKeys = POLICY_TYPES.filter((p) => selected[p.key]);
    if (!selectedKeys.length) return toast.error("Select at least one policy type to cancel.");
    if (!insured || !street || !city || !zip || !phone || !email)
      return toast.error("Please complete Named Insured information.");
    if (!reason.trim()) return toast.error("Please provide a reason for cancellation.");
    if (!printName.trim()) return toast.error("Please print your name.");
    if (!hasSig.current) return toast.error("Please provide your signature.");
    if (!certified) return toast.error("Please certify the cancellation request.");

    setStatus("sending");
    try {
      const attachments = [] as Array<{ filename: string; contentBase64: string; contentType?: string }>;
      if (hasSig.current && canvasRef.current) {
        const dataUrl = canvasRef.current.toDataURL("image/png");
        attachments.push({
          filename: "signature.png",
          contentBase64: dataUrl.split(",").pop() || "",
          contentType: "image/png",
        });
      }

      const policySection = selectedKeys.map((p) => {
        const d = details[p.key] ?? blankPolicy();
        return [
          p.label,
          `Company: ${d.company || "—"} | Policy #: ${d.number || "—"} | Eff: ${d.effective || "—"} | Exp: ${d.expiration || "—"}`,
        ] as [string, string];
      });

      await sendQuoteEmail({
        formKind: "Policy Cancellation",
        source: "/policy-services/cancel",
        primaryName: insured,
        customerName: insured,
        customerEmail: email,
        customerPhone: phone,
        sections: [
          {
            title: "Agent / Producer",
            rows: [
              ["Agency", "Custom Insurance Agency"],
              ["Mailing Address", "1333 Burr Ridge Pkwy STE 200, Burr Ridge, IL 60527"],
              ["Phone", "(630) 576-0630"],
              ["Email", "Quotes@custominsure.com"],
            ],
          },
          {
            title: "Cancellation Details",
            rows: [
              ["Effective Date", effDate],
              ["Effective Time", effTime],
            ],
          },
          { title: "Policies to Cancel", rows: policySection },
          {
            title: "Named Insured",
            rows: [
              ["Named Insured", insured],
              ["Mailing Address", `${street}, ${city}, ${state} ${zip}`],
              ["Phone", phone],
              ["Email", email],
            ],
          },
          { title: "Reason for Cancellation", rows: [["Reason", reason]] },
          {
            title: "Signature",
            rows: [
              ["Print Name", printName],
              ["Signed Date", signDate],
              ["Certification", certified ? "I certify the information is accurate and authorize this cancellation." : "—"],
            ],
          },
        ],
        attachments,
      });

      setStatus("done");
      toast.success("Cancellation request submitted.");
    } catch (err) {
      console.error(err);
      setStatus("idle");
      toast.error("Submission failed. Please call (630) 576-0630.");
    }
  };

  if (status === "done") {
    return (
      <main className="min-h-screen bg-white font-['Inter',sans-serif]">
        <SEO title="Cancellation Submitted | Custom Insurance Agency" description="Your cancellation request has been submitted." />
        <Navbar />
        <section className="px-6 pt-40 pb-24 text-center">
          <div className="mx-auto max-w-xl rounded-2xl border border-[#e5e7eb] p-10" style={{ borderTop: `3px solid ${TEAL}` }}>
            <h1 className="text-3xl font-bold" style={{ fontFamily: "'Barlow', sans-serif", color: NAVY }}>
              Request Submitted
            </h1>
            <p className="mt-4 text-[15px] text-[#4a5568]">
              Your cancellation request has been submitted. Our team will contact you within 1 business day.
            </p>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white font-['Inter',sans-serif]">
      <SEO
        title="Cancel Your Policy | Custom Insurance Agency"
        description="Submit a secure online insurance policy cancellation request to Custom Insurance Agency."
      />
      <Navbar />

      {/* HERO */}
      <section
        className="relative flex items-center justify-center pt-28 pb-10 md:pt-32 md:pb-14"
        style={{ background: "linear-gradient(to bottom, #1f4d7a 0%, #173b5d 60%, #0f2a42 100%)" }}
      >
        <div className="px-6 text-center text-white">
          <h1 style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700, fontSize: "clamp(32px, 5vw, 46px)", lineHeight: 1.1 }}>
            Cancel Your Policy Online
          </h1>
          <p className="mt-3 text-[14px] md:text-[16px]" style={{ color: "rgba(255,255,255,0.8)" }}>
            Insurance Policy Cancellation Request
          </p>
        </div>
      </section>

      {/* FORM */}
      <section className="px-4 py-10 md:px-12">
        <form
          onSubmit={onSubmit}
          className="mx-auto max-w-[900px] rounded-2xl bg-white p-6"
          style={{ border: "1px solid #e5e7eb", borderTop: `3px solid ${TEAL}`, boxShadow: "0 8px 30px rgba(0,0,0,0.04)" }}
        >
          {/* Section 1 */}
          <Section title="1. Insurance Agent / Producer">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <Label>Insurance Agent / Producer</Label>
                <input style={lockedInput} value="Custom Insurance Agency" readOnly />
              </div>
              <div>
                <Label>Mailing Address</Label>
                <input style={lockedInput} value="1333 Burr Ridge Pkwy STE 200, Burr Ridge, IL 60527" readOnly />
              </div>
              <div>
                <Label>Phone</Label>
                <input style={lockedInput} value="(630) 576-0630" readOnly />
              </div>
              <div>
                <Label>Email</Label>
                <input style={lockedInput} value="Quotes@custominsure.com" readOnly />
              </div>
            </div>
          </Section>

          {/* Section 2 */}
          <Section title="2. Cancellation Details">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <Label required>Cancellation Effective Date</Label>
                <input type="date" placeholder="MM/DD/YYYY" value={effDate} onChange={(e) => setEffDate(e.target.value)} {...fieldProps} />
              </div>
              <div>
                <Label required>Cancellation Effective Time</Label>
                <input type="time" placeholder="HH:MM" value={effTime} onChange={(e) => setEffTime(e.target.value)} {...fieldProps} />
              </div>
            </div>
          </Section>

          {/* Section 3 */}
          <Section title="3. Policy Type — Check all that apply">
            <PolicyAccordion
              selected={selected}
              details={details}
              onToggle={togglePolicy}
              onUpdate={updateDetail}
            />
          </Section>

          {/* Section 4 */}
          <Section title="4. Named Insured Information">
            <div>
              <Label required>Named Insured</Label>
              <input value={insured} onChange={(e) => setInsured(e.target.value)} {...fieldProps} />
            </div>
            <div>
              <Label required>Street Address</Label>
              <input value={street} onChange={(e) => setStreet(e.target.value)} {...fieldProps} />
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div>
                <Label required>City</Label>
                <input value={city} onChange={(e) => setCity(e.target.value)} {...fieldProps} />
              </div>
              <div>
                <Label required>State</Label>
                <select value={state} onChange={(e) => setState(e.target.value)} {...fieldProps}>
                  {US_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label required>ZIP</Label>
                <input value={zip} onChange={(e) => setZip(e.target.value)} {...fieldProps} />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <Label required>Phone</Label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} {...fieldProps} />
              </div>
              <div>
                <Label required>Email</Label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} {...fieldProps} />
              </div>
            </div>
          </Section>

          {/* Section 5 */}
          <Section title="5. Reason for Cancellation">
            <div>
              <Label required>Reason for Cancellation</Label>
              <textarea
                rows={5}
                placeholder="Please explain the reason for cancellation..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                style={{ ...inputBase, resize: "vertical" }}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
          </Section>

          {/* Section 6 */}
          <Section title="6. Signature">
            <div>
              <Label required>Print Name</Label>
              <input value={printName} onChange={(e) => setPrintName(e.target.value)} {...fieldProps} />
            </div>
            <div>
              <Label required>E-Signature</Label>
              <div
                style={{
                  border: "1px solid #d1d5db",
                  borderRadius: 6,
                  background: "#ffffff",
                  overflow: "hidden",
                }}
              >
                <canvas
                  ref={canvasRef}
                  style={{ width: "100%", height: 80, touchAction: "none", display: "block" }}
                  onMouseDown={startDraw}
                  onMouseMove={moveDraw}
                  onMouseUp={endDraw}
                  onMouseLeave={endDraw}
                  onTouchStart={startDraw}
                  onTouchMove={moveDraw}
                  onTouchEnd={endDraw}
                />
              </div>
              <button
                type="button"
                onClick={clearSignature}
                style={{
                  marginTop: 8,
                  background: "transparent",
                  border: "none",
                  color: TEAL,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Clear signature
              </button>
            </div>
            <div>
              <Label required>Date</Label>
              <input type="date" value={signDate} onChange={(e) => setSignDate(e.target.value)} {...fieldProps} />
            </div>
            <label className="flex items-start gap-3 text-[14px]" style={{ color: NAVY, fontFamily: "Inter, sans-serif" }}>
              <input
                type="checkbox"
                checked={certified}
                onChange={(e) => setCertified(e.target.checked)}
                style={{ width: 18, height: 18, marginTop: 2, accentColor: TEAL }}
              />
              <span>
                I certify that the information provided is accurate and I authorize this cancellation request.
              </span>
            </label>
          </Section>

          <button
            type="submit"
            disabled={status === "sending"}
            className="btn-quote"
            style={{
              width: "100%",
              padding: "16px 24px",
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 700,
              fontSize: 15,
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              borderRadius: 50,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              opacity: status === "sending" ? 0.7 : 1,
              cursor: status === "sending" ? "not-allowed" : "pointer",
            }}
          >
            {status === "sending" && <Loader2 className="h-4 w-4 animate-spin" />}
            {status === "sending" ? "Submitting..." : "Submit Cancellation Request"}
          </button>
        </form>
      </section>

      <Footer />
    </main>
  );
}