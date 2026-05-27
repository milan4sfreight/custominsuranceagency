import { useState, useRef, useEffect, type FormEvent } from "react";
import { Loader2, X, Plus } from "lucide-react";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import { sendQuoteEmail } from "@/lib/sendQuoteEmail";

const TEAL = "#2abfbf";
const NAVY = "#173b5d";

const US_STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

const inputBase: React.CSSProperties = {
  background: "#ffffff", border: "1px solid #d1d5db", borderRadius: 6,
  padding: "6px 12px", height: 36, color: "#0d2b2b", width: "100%",
  boxSizing: "border-box", display: "block", fontSize: 14, outline: "none",
  fontFamily: "Inter, sans-serif", WebkitAppearance: "none", appearance: "none",
  transition: "border-color .15s ease",
};
const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => { e.currentTarget.style.borderColor = TEAL; };
const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => { e.currentTarget.style.borderColor = "#d1d5db"; };
const fieldProps = { style: inputBase, onFocus: handleFocus, onBlur: handleBlur };

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-1 block" style={{ color: NAVY, fontSize: 13, fontWeight: 500, fontFamily: "Inter, sans-serif" }}>
      {children}
      {required && <span style={{ color: "#dc2626", marginLeft: 4 }}>*</span>}
    </label>
  );
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h3 className="mb-3 pb-2 uppercase" style={{ color: NAVY, fontSize: 13, letterSpacing: "0.08em", borderBottom: "1px solid #e5e7eb", fontWeight: 700, fontFamily: "Inter, sans-serif" }}>{title}</h3>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}
function Radio({ name, value, current, onChange, label }: { name: string; value: string; current: string; onChange: (v: string) => void; label: string; }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2" style={{ fontSize: 13, color: NAVY }}>
      <input type="radio" name={name} value={value} checked={current === value} onChange={() => onChange(value)} style={{ accentColor: TEAL }} />
      {label}
    </label>
  );
}
const todayUS = () => { const d = new Date(); return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${d.getFullYear()}`; };

type Boat = { builder: string; model: string; year: string; vesselType: string; length: string };
const blankBoat = (): Boat => ({ builder: "", model: "", year: "", vesselType: "", length: "" });
type Engine = { engineType: string; manufacturer: string; numEngines: string };
const blankEngine = (): Engine => ({ engineType: "", manufacturer: "", numEngines: "1" });

export default function BoatInsuranceQuote() {
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("IL");
  const [zip, setZip] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [currentInsurer, setCurrentInsurer] = useState("");
  const [expiration, setExpiration] = useState("");
  const [gender, setGender] = useState("");
  const [marital, setMarital] = useState("");

  const [boats, setBoats] = useState<Boat[]>([blankBoat()]);
  const updateBoat = (i: number, k: keyof Boat, v: string) => setBoats((arr) => arr.map((d, idx) => (idx === i ? { ...d, [k]: v } : d)));
  const removeBoat = (i: number) => setBoats((arr) => arr.filter((_, idx) => idx !== i));

  const [engines, setEngines] = useState<Engine[]>([blankEngine()]);
  const updateEngine = (i: number, k: keyof Engine, v: string) => setEngines((arr) => arr.map((d, idx) => (idx === i ? { ...d, [k]: v } : d)));
  const removeEngine = (i: number) => setEngines((arr) => arr.filter((_, idx) => idx !== i));

  const [certified, setCertified] = useState(false);
  const [printName, setPrintName] = useState("");
  const [signDate, setSignDate] = useState(todayUS());

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const hasSig = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.strokeStyle = "#0d2b2b"; ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.lineJoin = "round";
  }, []);

  const getPoint = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) { const t = e.touches[0] || e.changedTouches[0]; return { x: t.clientX - rect.left, y: t.clientY - rect.top }; }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };
  const startDraw = (e: React.MouseEvent | React.TouchEvent) => { e.preventDefault(); drawingRef.current = true; lastRef.current = getPoint(e); };
  const moveDraw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawingRef.current) return;
    e.preventDefault();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !lastRef.current) return;
    const p = getPoint(e);
    ctx.beginPath(); ctx.moveTo(lastRef.current.x, lastRef.current.y); ctx.lineTo(p.x, p.y); ctx.stroke();
    lastRef.current = p; hasSig.current = true;
  };
  const endDraw = () => { drawingRef.current = false; lastRef.current = null; };
  const clearSignature = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, rect.width, rect.height);
    hasSig.current = false;
  };

  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    if (!fullName.trim()) return toast.error("Please enter your full name.");
    if (!email.trim()) return toast.error("Please enter your email.");
    if (!phone.trim()) return toast.error("Please enter your phone number.");
    const validBoats = boats.filter((v) => v.builder.trim() || v.model.trim());
    if (!validBoats.length) return toast.error("Please add at least one boat.");
    if (!certified) return toast.error("Please certify the information is accurate.");
    if (!hasSig.current) return toast.error("Please provide your signature.");

    setStatus("sending");
    try {
      const attachments: Array<{ filename: string; contentBase64: string; contentType?: string }> = [];
      if (canvasRef.current) {
        const dataUrl = canvasRef.current.toDataURL("image/png");
        attachments.push({ filename: "signature.png", contentBase64: dataUrl.split(",").pop() || "", contentType: "image/png" });
      }
      const boatRows = validBoats.map((v, i) => [`Boat ${i + 1}`, `${v.year || "—"} ${v.builder} ${v.model} | Type: ${v.vesselType || "—"} | Length: ${v.length || "—"}`] as [string, string]);
      const engineRows = engines.map((e, i) => [`Boat ${i + 1} Engine`, `Type: ${e.engineType || "—"} | Manufacturer: ${e.manufacturer || "—"} | # of Engines: ${e.numEngines || "—"}`] as [string, string]);

      await sendQuoteEmail({
        formKind: "Boat Insurance Quote",
        source: "/boat-insurance-quote",
        primaryName: fullName, customerName: fullName, customerEmail: email, customerPhone: phone,
        sections: [
          { title: "Applicant Information", rows: [["Full Name", fullName], ["Address", `${address}, ${city}, ${state} ${zip}`], ["Email", email], ["Phone", phone], ["Current Insurance Company", currentInsurer], ["Expiration Date", expiration], ["Gender", gender], ["Marital Status", marital]] },
          { title: "Boat Information", rows: boatRows },
          { title: "Engine Information", rows: engineRows },
          { title: "Signature & Authorization", rows: [["Print Name", printName], ["Date", signDate], ["Certification", "I certify that all information provided is accurate and complete."]] },
        ],
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
        <SEO title="Quote Submitted | Custom Insurance Agency" description="Your boat insurance quote request has been submitted." />
        <Navbar />
        <section className="px-6 pt-40 pb-24 text-center">
          <div className="mx-auto max-w-xl rounded-2xl border border-[#e5e7eb] p-10" style={{ borderTop: `3px solid ${TEAL}` }}>
            <h1 className="text-3xl font-bold" style={{ fontFamily: "'Barlow', sans-serif", color: NAVY }}>Request Submitted</h1>
            <p className="mt-4 text-[15px] text-[#4a5568]">Your quote request has been submitted! Our team will contact you within 1 business day.</p>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white font-['Inter',sans-serif]">
      <SEO title="Boat Insurance Quote | Custom Insurance Agency" description="Request a free boat insurance quote online. We'll get back to you within 1 business day." />
      <Navbar />
      <section className="relative flex items-center justify-center pt-28 pb-10 md:pt-32 md:pb-14" style={{ background: "linear-gradient(to bottom, #1f4d7a 0%, #173b5d 60%, #0f2a42 100%)" }}>
        <div className="px-6 text-center text-white">
          <h1 style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700, fontSize: "clamp(32px, 5vw, 46px)", lineHeight: 1.1 }}>Boat Insurance Quote</h1>
          <p className="mt-3 text-[14px] md:text-[16px]" style={{ color: "rgba(255,255,255,0.8)" }}>Request a Free Quote — We'll get back to you within 1 business day</p>
        </div>
      </section>

      <section className="px-4 py-10 md:px-12">
        <form onSubmit={onSubmit} className="mx-auto max-w-[900px] rounded-2xl bg-white p-6" style={{ border: "1px solid #e5e7eb", borderTop: `3px solid ${TEAL}`, boxShadow: "0 8px 30px rgba(0,0,0,0.04)" }}>
          <Section title="1. Applicant Information">
            <div><Label required>Full Name</Label><input {...fieldProps} value={fullName} onChange={(e) => setFullName(e.target.value)} /></div>
            <div><Label>Address</Label><input {...fieldProps} value={address} onChange={(e) => setAddress(e.target.value)} /></div>
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-12 sm:col-span-6"><Label>City</Label><input {...fieldProps} value={city} onChange={(e) => setCity(e.target.value)} /></div>
              <div className="col-span-6 sm:col-span-3"><Label>State</Label>
                <select {...fieldProps} value={state} onChange={(e) => setState(e.target.value)}>
                  {US_STATES.map((s) => (<option key={s} value={s}>{s}</option>))}
                </select>
              </div>
              <div className="col-span-6 sm:col-span-3"><Label>Zip Code</Label><input {...fieldProps} value={zip} onChange={(e) => setZip(e.target.value)} /></div>
            </div>
            <div><Label required>Email Address</Label><input type="email" {...fieldProps} value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div><Label required>Phone Number</Label><input type="tel" {...fieldProps} value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
            <div><Label>Current Insurance Company</Label><input {...fieldProps} value={currentInsurer} onChange={(e) => setCurrentInsurer(e.target.value)} /></div>
            <div><Label>Expiration Date</Label><input type="date" {...fieldProps} value={expiration} onChange={(e) => setExpiration(e.target.value)} /></div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div><Label>Gender</Label><div className="flex items-center gap-5 pt-1">
                <Radio name="gender" value="Male" current={gender} onChange={setGender} label="Male" />
                <Radio name="gender" value="Female" current={gender} onChange={setGender} label="Female" />
              </div></div>
              <div><Label>Marital Status</Label><div className="flex items-center gap-5 pt-1">
                <Radio name="marital" value="Married" current={marital} onChange={setMarital} label="Married" />
                <Radio name="marital" value="Unmarried" current={marital} onChange={setMarital} label="Unmarried" />
              </div></div>
            </div>
          </Section>

          <Section title="2. Boat Information">
            <p style={{ fontSize: 12, color: "#4a5568", marginTop: -4 }}>List all boats/watercraft to be insured.</p>
            {boats.map((v, i) => (
              <div key={i} className="relative rounded-lg p-4" style={{ border: "1px solid #e5e7eb", background: "#fafbfc" }}>
                <div className="mb-2 flex items-center justify-between">
                  <span style={{ fontSize: 12, fontWeight: 700, color: NAVY, letterSpacing: "0.05em" }}>BOAT {i + 1}</span>
                  {boats.length > 1 && (
                    <button type="button" onClick={() => removeBoat(i)} className="flex h-6 w-6 items-center justify-center rounded-full" style={{ background: "#fee2e2", color: "#dc2626" }} aria-label="Remove boat"><X size={14} /></button>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div><Label>Builder</Label><input {...fieldProps} value={v.builder} onChange={(e) => updateBoat(i, "builder", e.target.value)} /></div>
                  <div><Label>Model</Label><input {...fieldProps} value={v.model} onChange={(e) => updateBoat(i, "model", e.target.value)} /></div>
                  <div><Label>Year</Label><input type="number" {...fieldProps} value={v.year} onChange={(e) => updateBoat(i, "year", e.target.value.slice(0, 4))} /></div>
                  <div><Label>Vessel Type</Label><input {...fieldProps} value={v.vesselType} onChange={(e) => updateBoat(i, "vesselType", e.target.value)} /></div>
                  <div className="sm:col-span-2"><Label>Length</Label><input {...fieldProps} placeholder="22 ft" value={v.length} onChange={(e) => updateBoat(i, "length", e.target.value)} /></div>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => setBoats((arr) => [...arr, blankBoat()])} className="inline-flex items-center gap-2 self-start rounded-md px-4 py-2" style={{ border: `1px solid ${TEAL}`, color: TEAL, fontSize: 13, fontWeight: 600 }}>
              <Plus size={14} /> Add Boat
            </button>
          </Section>

          <Section title="3. Engine Information">
            <p style={{ fontSize: 12, color: "#4a5568", marginTop: -4 }}>Provide engine details for each boat listed above.</p>
            {engines.map((v, i) => (
              <div key={i} className="relative rounded-lg p-4" style={{ border: "1px solid #e5e7eb", background: "#fafbfc" }}>
                <div className="mb-2 flex items-center justify-between">
                  <span style={{ fontSize: 12, fontWeight: 700, color: NAVY, letterSpacing: "0.05em" }}>BOAT {i + 1}</span>
                  {engines.length > 1 && (
                    <button type="button" onClick={() => removeEngine(i)} className="flex h-6 w-6 items-center justify-center rounded-full" style={{ background: "#fee2e2", color: "#dc2626" }} aria-label="Remove engine"><X size={14} /></button>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div><Label>Engine Type</Label><input {...fieldProps} value={v.engineType} onChange={(e) => updateEngine(i, "engineType", e.target.value)} /></div>
                  <div><Label>Manufacturer</Label><input {...fieldProps} value={v.manufacturer} onChange={(e) => updateEngine(i, "manufacturer", e.target.value)} /></div>
                  <div className="sm:col-span-2"><Label>Number of Engines</Label><input type="number" min={1} {...fieldProps} value={v.numEngines} onChange={(e) => updateEngine(i, "numEngines", e.target.value)} /></div>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => setEngines((arr) => [...arr, blankEngine()])} className="inline-flex items-center gap-2 self-start rounded-md px-4 py-2" style={{ border: `1px solid ${TEAL}`, color: TEAL, fontSize: 13, fontWeight: 600 }}>
              <Plus size={14} /> Add Engine Info
            </button>
          </Section>

          <Section title="4. Signature & Authorization">
            <label className="flex items-start gap-2" style={{ fontSize: 13, color: NAVY }}>
              <input type="checkbox" checked={certified} onChange={(e) => setCertified(e.target.checked)} style={{ accentColor: TEAL, marginTop: 3 }} />
              <span>I certify that all information provided is accurate and complete to the best of my knowledge.</span>
            </label>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div><Label>Print Name</Label><input {...fieldProps} value={printName} onChange={(e) => setPrintName(e.target.value)} /></div>
              <div><Label>Date</Label><input {...fieldProps} value={signDate} onChange={(e) => setSignDate(e.target.value)} /></div>
            </div>
            <div>
              <Label>E-Signature</Label>
              <canvas ref={canvasRef} onMouseDown={startDraw} onMouseMove={moveDraw} onMouseUp={endDraw} onMouseLeave={endDraw} onTouchStart={startDraw} onTouchMove={moveDraw} onTouchEnd={endDraw} style={{ width: "100%", height: 110, border: "1px solid #d1d5db", borderRadius: 6, background: "#fff", touchAction: "none", display: "block" }} />
              <button type="button" onClick={clearSignature} className="mt-1 text-[12px]" style={{ color: TEAL, fontWeight: 500 }}>Clear Signature</button>
            </div>
          </Section>

          <button type="submit" disabled={status === "sending"} className="mt-2 inline-flex w-full items-center justify-center gap-2 px-6 py-3 text-white" style={{ background: "linear-gradient(135deg, #f5821f, #f5c518)", borderRadius: 999, fontFamily: "'Barlow', sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: "0.08em", textTransform: "uppercase", opacity: status === "sending" ? 0.7 : 1 }}>
            {status === "sending" && <Loader2 size={16} className="animate-spin" />}
            {status === "sending" ? "Submitting..." : "Submit Quote Request"}
          </button>
        </form>
      </section>
      <Footer />
    </main>
  );
}