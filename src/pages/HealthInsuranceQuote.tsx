import { useState, useRef, useEffect, type FormEvent } from "react";
import { Loader2, X, Plus } from "lucide-react";
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

const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = TEAL;
};
const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
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

function Section({ title, children, hint }: { title: string; children: React.ReactNode; hint?: string }) {
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
      {hint && (
        <p style={{ fontSize: 12, color: "#4a5568", marginTop: -4, marginBottom: 8 }}>{hint}</p>
      )}
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

function Radio({
  name,
  value,
  current,
  onChange,
  label,
}: {
  name: string;
  value: string;
  current: string;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2" style={{ fontSize: 13, color: NAVY }}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={current === value}
        onChange={() => onChange(value)}
        style={{ accentColor: TEAL }}
      />
      {label}
    </label>
  );
}

const todayUS = () => {
  const d = new Date();
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${d.getFullYear()}`;
};

type Child = { name: string; dob: string; gender: string };
const blankChild = (): Child => ({ name: "", dob: "", gender: "" });

export default function HealthInsuranceQuote() {
  // Section 1
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("IL");
  const [zip, setZip] = useState("");
  const [email, setEmail] = useState("");
  const [homePhone, setHomePhone] = useState("");
  const [cellPhone, setCellPhone] = useState("");
  const [workPhone, setWorkPhone] = useState("");
  const [workExt, setWorkExt] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [smokes, setSmokes] = useState("");
  const [hasInsurance, setHasInsurance] = useState("");
  const [currentPremium, setCurrentPremium] = useState("");

  // Section 2 — Spouse
  const [spouseName, setSpouseName] = useState("");
  const [spouseDob, setSpouseDob] = useState("");
  const [spouseGender, setSpouseGender] = useState("");
  const [spouseSmokes, setSpouseSmokes] = useState("");

  // Section 3 — Children
  const [children, setChildren] = useState<Child[]>([]);
  const updateChild = (i: number, k: keyof Child, v: string) =>
    setChildren((arr) => arr.map((c, idx) => (idx === i ? { ...c, [k]: v } : c)));
  const removeChild = (i: number) => setChildren((arr) => arr.filter((_, idx) => idx !== i));

  // Section 4
  const [certified, setCertified] = useState(false);
  const [printName, setPrintName] = useState("");
  const [signDate, setSignDate] = useState(todayUS());

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

    if (!fullName.trim()) return toast.error("Please enter your full name.");
    if (!email.trim()) return toast.error("Please enter your email.");
    if (!homePhone.trim() && !cellPhone.trim() && !workPhone.trim())
      return toast.error("Please provide at least one phone number.");
    if (!dob) return toast.error("Please enter your date of birth.");
    if (!certified) return toast.error("Please certify the information is accurate.");
    if (!hasSig.current) return toast.error("Please provide your signature.");

    setStatus("sending");
    try {
      const attachments: Array<{ filename: string; contentBase64: string; contentType?: string }> = [];
      if (canvasRef.current) {
        const dataUrl = canvasRef.current.toDataURL("image/png");
        attachments.push({
          filename: "signature.png",
          contentBase64: dataUrl.split(",").pop() || "",
          contentType: "image/png",
        });
      }

      const primaryPhone = cellPhone || homePhone || workPhone;

      const sections = [
        {
          title: "Applicant Information",
          rows: [
            ["Full Name", fullName],
            ["Address", `${address}, ${city}, ${state} ${zip}`],
            ["Email", email],
            ["Home Phone", homePhone],
            ["Cell Phone", cellPhone],
            ["Work Phone", workPhone ? `${workPhone}${workExt ? ` ext. ${workExt}` : ""}` : ""],
            ["Date of Birth", dob],
            ["Gender", gender],
            ["Smoker", smokes],
            ["Currently Has Health Insurance", hasInsurance],
            ...(hasInsurance === "Yes"
              ? ([["Current Premium", currentPremium ? `$${currentPremium}` : ""]] as Array<[string, string]>)
              : []),
          ] as Array<[string, unknown]>,
        },
      ];

      if (spouseName.trim()) {
        sections.push({
          title: "Spouse Information",
          rows: [
            ["Spouse Full Name", spouseName],
            ["Date of Birth", spouseDob],
            ["Gender", spouseGender],
            ["Smoker", spouseSmokes],
          ],
        });
      }

      const validChildren = children.filter((c) => c.name.trim());
      if (validChildren.length) {
        sections.push({
          title: "Children Information",
          rows: validChildren.map(
            (c, i) =>
              [
                `Child ${i + 1}`,
                `Name: ${c.name} | DOB: ${c.dob || "—"} | Gender: ${c.gender || "—"}`,
              ] as [string, string],
          ),
        });
      }

      sections.push({
        title: "Signature & Authorization",
        rows: [
          ["Print Name", printName],
          ["Date", signDate],
          ["Certification", "I certify that all information provided is accurate and complete."],
        ],
      });

      await sendQuoteEmail({
        formKind: "Health Insurance Quote",
        source: "/health-insurance-quote",
        primaryName: fullName,
        customerName: fullName,
        customerEmail: email,
        customerPhone: primaryPhone,
        sections,
        attachments,
      });

      setStatus("done");
      toast.success("Quote request submitted.");
    } catch (err) {
      console.error(err);
      setStatus("idle");
      toast.error("Submission failed. Please call (630) 576-0630.");
    }
  };

  if (status === "done") {
    return (
      <main className="min-h-screen bg-white font-['Inter',sans-serif]">
        <SEO title="Quote Submitted | Custom Insurance Agency" description="Your health insurance quote request has been submitted." />
        <Navbar />
        <section className="px-6 pt-40 pb-24 text-center">
          <div
            className="mx-auto max-w-xl rounded-2xl border border-[#e5e7eb] p-10"
            style={{ borderTop: `3px solid ${TEAL}` }}
          >
            <h1 className="text-3xl font-bold" style={{ fontFamily: "'Barlow', sans-serif", color: NAVY }}>
              Request Submitted
            </h1>
            <p className="mt-4 text-[15px] text-[#4a5568]">
              Your quote request has been submitted! Our team will contact you within 1 business day.
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
        title="Health Insurance Quote | Custom Insurance Agency"
        description="Request a free health insurance quote online. We'll get back to you within 1 business day."
      />
      <Navbar />

      {/* HERO */}
      <section
        className="relative flex items-center justify-center pt-28 pb-10 md:pt-32 md:pb-14"
        style={{ background: "linear-gradient(to bottom, #1f4d7a 0%, #173b5d 60%, #0f2a42 100%)" }}
      >
        <div className="px-6 text-center text-white">
          <h1
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(32px, 5vw, 46px)",
              lineHeight: 1.1,
            }}
          >
            Health Insurance Quote
          </h1>
          <p className="mt-3 text-[14px] md:text-[16px]" style={{ color: "rgba(255,255,255,0.8)" }}>
            Request a Free Quote — We'll get back to you within 1 business day
          </p>
        </div>
      </section>

      {/* FORM */}
      <section className="px-4 py-10 md:px-12">
        <form
          onSubmit={onSubmit}
          className="mx-auto max-w-[900px] rounded-2xl bg-white p-6"
          style={{
            border: "1px solid #e5e7eb",
            borderTop: `3px solid ${TEAL}`,
            boxShadow: "0 8px 30px rgba(0,0,0,0.04)",
          }}
        >
          {/* Section 1 */}
          <Section title="1. Applicant Information">
            <div>
              <Label required>Full Name</Label>
              <input {...fieldProps} value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div>
              <Label>Address</Label>
              <input {...fieldProps} value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-12 sm:col-span-6">
                <Label>City</Label>
                <input {...fieldProps} value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <Label>State</Label>
                <select {...fieldProps} value={state} onChange={(e) => setState(e.target.value)}>
                  {US_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-6 sm:col-span-3">
                <Label>Zip Code</Label>
                <input {...fieldProps} value={zip} onChange={(e) => setZip(e.target.value)} />
              </div>
            </div>
            <div>
              <Label required>Email Address</Label>
              <input type="email" {...fieldProps} value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-12 sm:col-span-4">
                <Label>Home Phone</Label>
                <input type="tel" {...fieldProps} value={homePhone} onChange={(e) => setHomePhone(e.target.value)} />
              </div>
              <div className="col-span-12 sm:col-span-4">
                <Label>Cell Phone</Label>
                <input type="tel" {...fieldProps} value={cellPhone} onChange={(e) => setCellPhone(e.target.value)} />
              </div>
              <div className="col-span-8 sm:col-span-3">
                <Label>Work Phone</Label>
                <input type="tel" {...fieldProps} value={workPhone} onChange={(e) => setWorkPhone(e.target.value)} />
              </div>
              <div className="col-span-4 sm:col-span-1">
                <Label>Ext</Label>
                <input {...fieldProps} value={workExt} onChange={(e) => setWorkExt(e.target.value)} />
              </div>
            </div>
            <div>
              <Label required>Date of Birth</Label>
              <input type="date" {...fieldProps} value={dob} onChange={(e) => setDob(e.target.value)} />
            </div>
            <div>
              <Label>Gender</Label>
              <div className="flex items-center gap-5 pt-1">
                <Radio name="gender" value="Male" current={gender} onChange={setGender} label="Male" />
                <Radio name="gender" value="Female" current={gender} onChange={setGender} label="Female" />
              </div>
            </div>
            <div>
              <Label>Do You Smoke?</Label>
              <div className="flex items-center gap-5 pt-1">
                <Radio name="smokes" value="Yes" current={smokes} onChange={setSmokes} label="Yes" />
                <Radio name="smokes" value="No" current={smokes} onChange={setSmokes} label="No" />
              </div>
            </div>
            <div>
              <Label>Do you currently have health insurance?</Label>
              <div className="flex items-center gap-5 pt-1">
                <Radio name="hasins" value="Yes" current={hasInsurance} onChange={setHasInsurance} label="Yes" />
                <Radio name="hasins" value="No" current={hasInsurance} onChange={setHasInsurance} label="No" />
              </div>
            </div>
            {hasInsurance === "Yes" && (
              <div>
                <Label>Current Premium</Label>
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#6b7280",
                      fontSize: 14,
                    }}
                  >
                    $
                  </span>
                  <input
                    {...fieldProps}
                    style={{ ...inputBase, paddingLeft: 24 }}
                    value={currentPremium}
                    onChange={(e) => setCurrentPremium(e.target.value)}
                  />
                </div>
              </div>
            )}
          </Section>

          {/* Section 2 */}
          <Section title="2. Spouse Information" hint="Complete this section if adding a spouse to the policy.">
            <div>
              <Label>Spouse Full Name</Label>
              <input {...fieldProps} value={spouseName} onChange={(e) => setSpouseName(e.target.value)} />
            </div>
            <div>
              <Label>Date of Birth</Label>
              <input type="date" {...fieldProps} value={spouseDob} onChange={(e) => setSpouseDob(e.target.value)} />
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <Label>Gender</Label>
                <div className="flex items-center gap-5 pt-1">
                  <Radio name="spgender" value="Male" current={spouseGender} onChange={setSpouseGender} label="Male" />
                  <Radio name="spgender" value="Female" current={spouseGender} onChange={setSpouseGender} label="Female" />
                </div>
              </div>
              <div>
                <Label>Do You Smoke?</Label>
                <div className="flex items-center gap-5 pt-1">
                  <Radio name="spsmokes" value="Yes" current={spouseSmokes} onChange={setSpouseSmokes} label="Yes" />
                  <Radio name="spsmokes" value="No" current={spouseSmokes} onChange={setSpouseSmokes} label="No" />
                </div>
              </div>
            </div>
          </Section>

          {/* Section 3 */}
          <Section title="3. Children Information" hint="Complete this section if adding children to the policy.">
            {children.map((c, i) => (
              <div
                key={i}
                className="relative rounded-lg p-4"
                style={{ border: "1px solid #e5e7eb", background: "#fafbfc" }}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span style={{ fontSize: 12, fontWeight: 700, color: NAVY, letterSpacing: "0.05em" }}>
                    CHILD {i + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeChild(i)}
                    className="flex h-6 w-6 items-center justify-center rounded-full"
                    style={{ background: "#fee2e2", color: "#dc2626" }}
                    aria-label="Remove child"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label>Child Full Name</Label>
                    <input {...fieldProps} value={c.name} onChange={(e) => updateChild(i, "name", e.target.value)} />
                  </div>
                  <div>
                    <Label>Date of Birth</Label>
                    <input type="date" {...fieldProps} value={c.dob} onChange={(e) => updateChild(i, "dob", e.target.value)} />
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <div className="flex items-center gap-5 pt-1">
                      <Radio
                        name={`cgender-${i}`}
                        value="Male"
                        current={c.gender}
                        onChange={(v) => updateChild(i, "gender", v)}
                        label="Male"
                      />
                      <Radio
                        name={`cgender-${i}`}
                        value="Female"
                        current={c.gender}
                        onChange={(v) => updateChild(i, "gender", v)}
                        label="Female"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setChildren((arr) => [...arr, blankChild()])}
              className="inline-flex items-center gap-2 self-start rounded-md px-4 py-2"
              style={{ border: `1px solid ${TEAL}`, color: TEAL, fontSize: 13, fontWeight: 600 }}
            >
              <Plus size={14} /> Add Child
            </button>
          </Section>

          {/* Section 4 */}
          <Section title="4. Signature & Authorization">
            <label className="flex items-start gap-2" style={{ fontSize: 13, color: NAVY }}>
              <input
                type="checkbox"
                checked={certified}
                onChange={(e) => setCertified(e.target.checked)}
                style={{ accentColor: TEAL, marginTop: 3 }}
              />
              <span>
                I certify that all information provided is accurate and complete to the best of my knowledge.
              </span>
            </label>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <Label>Print Name</Label>
                <input {...fieldProps} value={printName} onChange={(e) => setPrintName(e.target.value)} />
              </div>
              <div>
                <Label>Date</Label>
                <input {...fieldProps} value={signDate} onChange={(e) => setSignDate(e.target.value)} />
              </div>
            </div>
            <div>
              <Label>E-Signature</Label>
              <canvas
                ref={canvasRef}
                onMouseDown={startDraw}
                onMouseMove={moveDraw}
                onMouseUp={endDraw}
                onMouseLeave={endDraw}
                onTouchStart={startDraw}
                onTouchMove={moveDraw}
                onTouchEnd={endDraw}
                style={{
                  width: "100%",
                  height: 110,
                  border: "1px solid #d1d5db",
                  borderRadius: 6,
                  background: "#fff",
                  touchAction: "none",
                  display: "block",
                }}
              />
              <button
                type="button"
                onClick={clearSignature}
                className="mt-1 text-[12px]"
                style={{ color: TEAL, fontWeight: 500 }}
              >
                Clear Signature
              </button>
            </div>
          </Section>

          <button
            type="submit"
            disabled={status === "sending"}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 px-6 py-3 text-white"
            style={{
              background: "linear-gradient(135deg, #f5821f, #f5c518)",
              borderRadius: 999,
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              opacity: status === "sending" ? 0.7 : 1,
            }}
          >
            {status === "sending" && <Loader2 size={16} className="animate-spin" />}
            {status === "sending" ? "Submitting..." : "Submit Quote Request"}
          </button>
        </form>
      </section>

      <Footer />
    </main>
  );
}