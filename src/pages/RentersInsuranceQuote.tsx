import { useState, useRef, useEffect, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
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
};
const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { e.currentTarget.style.borderColor = TEAL; };
const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { e.currentTarget.style.borderColor = "#d1d5db"; };
const fieldProps = { style: inputBase, onFocus: handleFocus, onBlur: handleBlur };

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-1 block" style={{ color: NAVY, fontSize: 13, fontWeight: 500 }}>
      {children}{required && <span style={{ color: "#dc2626", marginLeft: 4 }}>*</span>}
    </label>
  );
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h3 className="mb-3 pb-2 uppercase" style={{ color: NAVY, fontSize: 13, letterSpacing: "0.08em", borderBottom: "1px solid #e5e7eb", fontWeight: 700 }}>{title}</h3>
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
const todayUS = () => { const d = new Date(); return `${String(d.getMonth()+1).padStart(2,"0")}/${String(d.getDate()).padStart(2,"0")}/${d.getFullYear()}`; };

export default function RentersInsuranceQuote() {
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState(""); const [state, setState] = useState("IL"); const [zip, setZip] = useState("");
  const [email, setEmail] = useState(""); const [phone, setPhone] = useState("");
  const [dob, setDob] = useState(""); const [ssn4, setSsn4] = useState("");
  const [currentInsurer, setCurrentInsurer] = useState(""); const [expiration, setExpiration] = useState("");

  const [coverageFor, setCoverageFor] = useState(""); const [yearsLived, setYearsLived] = useState("");
  const [dwellingValue, setDwellingValue] = useState(""); const [contentsValue, setContentsValue] = useState("");

  const [structure, setStructure] = useState(""); const [yearBuilt, setYearBuilt] = useState("");
  const [sqft, setSqft] = useState("");
  const [fullBaths, setFullBaths] = useState(""); const [halfBaths, setHalfBaths] = useState("");
  const [bedrooms, setBedrooms] = useState(""); const [garage, setGarage] = useState("");

  const [hasLosses, setHasLosses] = useState(""); const [lossDetails, setLossDetails] = useState("");

  const [certified, setCertified] = useState(false);
  const [printName, setPrintName] = useState(""); const [signDate, setSignDate] = useState(todayUS());

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false); const lastRef = useRef<{ x: number; y: number } | null>(null); const hasSig = useRef(false);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const dpr = window.devicePixelRatio || 1; const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    ctx.scale(dpr, dpr); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.strokeStyle = "#0d2b2b"; ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.lineJoin = "round";
  }, []);
  const getPoint = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!; const rect = canvas.getBoundingClientRect();
    if ("touches" in e) { const t = e.touches[0] || e.changedTouches[0]; return { x: t.clientX - rect.left, y: t.clientY - rect.top }; }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };
  const startDraw = (e: React.MouseEvent | React.TouchEvent) => { e.preventDefault(); drawingRef.current = true; lastRef.current = getPoint(e); };
  const moveDraw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawingRef.current) return; e.preventDefault();
    const ctx = canvasRef.current?.getContext("2d"); if (!ctx || !lastRef.current) return;
    const p = getPoint(e); ctx.beginPath(); ctx.moveTo(lastRef.current.x, lastRef.current.y); ctx.lineTo(p.x, p.y); ctx.stroke();
    lastRef.current = p; hasSig.current = true;
  };
  const endDraw = () => { drawingRef.current = false; lastRef.current = null; };
  const clearSignature = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, rect.width, rect.height); hasSig.current = false;
  };

  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    if (!fullName.trim()) return toast.error("Please enter your full name.");
    if (!email.trim()) return toast.error("Please enter your email.");
    if (!phone.trim()) return toast.error("Please enter your phone number.");
    if (!dob) return toast.error("Please enter your date of birth.");
    if (!coverageFor) return toast.error("Please select coverage type.");
    if (!certified) return toast.error("Please certify the information is accurate.");
    if (!hasSig.current) return toast.error("Please provide your signature.");

    setStatus("sending");
    try {
      const attachments: Array<{ filename: string; contentBase64: string; contentType?: string }> = [];
      if (canvasRef.current) {
        const dataUrl = canvasRef.current.toDataURL("image/png");
        attachments.push({ filename: "signature.png", contentBase64: dataUrl.split(",").pop() || "", contentType: "image/png" });
      }
      await sendQuoteEmail({
        formKind: "Renters Insurance Quote",
        source: "/renters-insurance-quote",
        primaryName: fullName, customerName: fullName, customerEmail: email, customerPhone: phone,
        sections: [
          { title: "Applicant Information", rows: [["Full Name", fullName], ["Address", `${address}, ${city}, ${state} ${zip}`], ["Email", email], ["Phone", phone], ["Date of Birth", dob], ["SSN (Last 4)", ssn4], ["Current Insurance Company", currentInsurer], ["Expiration Date", expiration]] },
          { title: "Coverage Information", rows: [["Coverage requested for", coverageFor], ["Years Lived at Address", yearsLived], ["Dwelling Value", dwellingValue ? `$${dwellingValue}` : ""], ["Contents Value", contentsValue ? `$${contentsValue}` : ""]] },
          { title: "Dwelling Information", rows: [["Building Structure", structure], ["Year Built", yearBuilt], ["Square Feet", sqft], ["Full Baths", fullBaths], ["Half Baths", halfBaths], ["Bedrooms", bedrooms], ["Garage", garage]] },
          { title: "Loss History", rows: [["Losses in last 3 years", hasLosses], ["Loss Details", lossDetails]] },
          { title: "Signature & Authorization", rows: [["Print Name", printName], ["Date", signDate], ["Certification", "I certify that all information provided is accurate and complete."]] },
        ],
        attachments,
      });
      setStatus("done"); toast.success("Quote request submitted.");
    } catch (err) { console.error(err); setStatus("idle"); toast.error("Submission failed. Please call (630) 576-0630."); }
  };

  if (status === "done") {
    return (
      <main className="min-h-screen bg-white font-['Inter',sans-serif]">
        <SEO title="Quote Submitted | Custom Insurance Agency" description="Your renters insurance quote has been submitted." />
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
      <SEO title="Renters Insurance Quote | Custom Insurance Agency" description="Request a free renters insurance quote online. We'll get back to you within 1 business day." />
      <Navbar />
      <section className="relative flex items-center justify-center pt-28 pb-10 md:pt-32 md:pb-14" style={{ background: "linear-gradient(to bottom, #1f4d7a 0%, #173b5d 60%, #0f2a42 100%)" }}>
        <div className="px-6 text-center text-white">
          <h1 style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700, fontSize: "clamp(32px, 5vw, 46px)", lineHeight: 1.1 }}>Renters Insurance Quote</h1>
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
                <select {...fieldProps} value={state} onChange={(e) => setState(e.target.value)}>{US_STATES.map((s) => (<option key={s} value={s}>{s}</option>))}</select>
              </div>
              <div className="col-span-6 sm:col-span-3"><Label>Zip</Label><input {...fieldProps} value={zip} onChange={(e) => setZip(e.target.value)} /></div>
            </div>
            <div><Label required>Email Address</Label><input type="email" {...fieldProps} value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div><Label required>Phone Number</Label><input type="tel" {...fieldProps} value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div><Label required>Date of Birth</Label><input type="date" {...fieldProps} value={dob} onChange={(e) => setDob(e.target.value)} /></div>
              <div><Label>SSN (Last 4)</Label><input {...fieldProps} maxLength={4} value={ssn4} onChange={(e) => setSsn4(e.target.value.replace(/\D/g, ""))} /></div>
            </div>
            <div><Label>Current Insurance Company</Label><input {...fieldProps} value={currentInsurer} onChange={(e) => setCurrentInsurer(e.target.value)} /></div>
            <div><Label>Expiration Date</Label><input type="date" {...fieldProps} value={expiration} onChange={(e) => setExpiration(e.target.value)} /></div>
          </Section>

          <Section title="2. Coverage Information">
            <div><Label required>Coverage requested for</Label><div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1">
              {["Home","Condominium","Townhouse","Apartment","Other"].map((o) => (
                <Radio key={o} name="coverageFor" value={o} current={coverageFor} onChange={setCoverageFor} label={o} />
              ))}
            </div></div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div><Label>Years Lived at Address</Label><input type="number" min={0} {...fieldProps} value={yearsLived} onChange={(e) => setYearsLived(e.target.value)} /></div>
              <div><Label>Dwelling Value</Label>
                <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#6b7280", fontSize: 14 }}>$</span>
                  <input {...fieldProps} style={{ ...inputBase, paddingLeft: 24 }} value={dwellingValue} onChange={(e) => setDwellingValue(e.target.value.replace(/[^\d,.]/g, ""))} />
                </div>
              </div>
              <div><Label>Contents Value</Label>
                <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#6b7280", fontSize: 14 }}>$</span>
                  <input {...fieldProps} style={{ ...inputBase, paddingLeft: 24 }} value={contentsValue} onChange={(e) => setContentsValue(e.target.value.replace(/[^\d,.]/g, ""))} />
                </div>
              </div>
            </div>
          </Section>

          <Section title="3. Dwelling Information">
            <p style={{ fontSize: 12, color: "#4a5568", marginTop: -4 }}>Tell us about the property.</p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="md:col-span-2"><Label>Building Structure</Label><div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
                {["Frame","Masonry","Masonry Veneer","Block","Mobile Home"].map((o) => <Radio key={o} name="structure" value={o} current={structure} onChange={setStructure} label={o} />)}
              </div></div>
              <div><Label>Year Built</Label><input type="number" {...fieldProps} value={yearBuilt} onChange={(e) => setYearBuilt(e.target.value.slice(0, 4))} /></div>
              <div><Label>Square Feet</Label><input type="number" {...fieldProps} value={sqft} onChange={(e) => setSqft(e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Full Baths</Label><input type="number" {...fieldProps} value={fullBaths} onChange={(e) => setFullBaths(e.target.value)} /></div>
                <div><Label>Half Baths</Label><input type="number" {...fieldProps} value={halfBaths} onChange={(e) => setHalfBaths(e.target.value)} /></div>
              </div>
              <div><Label>Bedrooms</Label><input type="number" {...fieldProps} value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} /></div>
              <div className="md:col-span-2"><Label>Garage</Label><div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
                {["Attached","Unattached","Carport","Parking Lot","Street Parking"].map((o) => <Radio key={o} name="garage" value={o} current={garage} onChange={setGarage} label={o} />)}
              </div></div>
            </div>
          </Section>

          <Section title="4. Loss History">
            <div><Label>Did you have any losses, whether or not paid by insurance, during the last 3 years?</Label>
              <div className="flex items-center gap-5 pt-1">
                <Radio name="hasLosses" value="Yes" current={hasLosses} onChange={setHasLosses} label="Yes" />
                <Radio name="hasLosses" value="No" current={hasLosses} onChange={setHasLosses} label="No" />
              </div>
            </div>
            {hasLosses === "Yes" && (
              <div><Label>Please provide details (date, type of loss, amount)</Label>
                <textarea {...fieldProps} style={{ ...inputBase, height: 90, padding: 10 }} value={lossDetails} onChange={(e) => setLossDetails(e.target.value)} />
              </div>
            )}
          </Section>

          <Section title="5. Signature & Authorization">
            <label className="flex items-start gap-2" style={{ fontSize: 13, color: NAVY }}>
              <input type="checkbox" checked={certified} onChange={(e) => setCertified(e.target.checked)} style={{ accentColor: TEAL, marginTop: 3 }} />
              <span>I certify that all information provided is accurate and complete.</span>
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