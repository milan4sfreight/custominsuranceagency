import { useState, useRef, useEffect, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
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

const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = TEAL;
};
const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = "#d1d5db";
};
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

function DollarInput(props: { value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ position: "relative" }}>
      <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#6b7280", fontSize: 14 }}>$</span>
      <input
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        {...fieldProps}
        style={{ ...inputBase, paddingLeft: 24 }}
      />
    </div>
  );
}

function RadioGroup({ name, value, onChange, options }: { name: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="flex flex-wrap gap-3" style={{ paddingTop: 4 }}>
      {options.map((opt) => (
        <label key={opt} className="inline-flex items-center gap-2" style={{ color: NAVY, fontSize: 13, fontFamily: "Inter, sans-serif", cursor: "pointer" }}>
          <input
            type="radio"
            name={name}
            value={opt}
            checked={value === opt}
            onChange={(e) => onChange(e.target.value)}
            style={{ accentColor: TEAL }}
          />
          {opt}
        </label>
      ))}
    </div>
  );
}

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function CommercialPropertyQuote() {
  // Business
  const [bizName, setBizName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("IL");
  const [zip, setZip] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [ssn4, setSsn4] = useState("");
  const [dob, setDob] = useState("");
  const [operations, setOperations] = useState("");
  const [currentIns, setCurrentIns] = useState("");
  const [expDate, setExpDate] = useState("");
  const [bizIncome, setBizIncome] = useState("");

  // Property
  const [buildingValue, setBuildingValue] = useState("");
  const [contentsValue, setContentsValue] = useState("");
  const [buildingArea, setBuildingArea] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [construction, setConstruction] = useState("");
  const [heating, setHeating] = useState("");
  const [roofType, setRoofType] = useState("");
  const [roofAge, setRoofAge] = useState("");
  const [centralAlarm, setCentralAlarm] = useState("");
  const [burglarAlarm, setBurglarAlarm] = useState("");
  const [sprinkler, setSprinkler] = useState("");
  const [pool, setPool] = useState("");
  const [divingBoard, setDivingBoard] = useState("");
  const [fence, setFence] = useState("");
  const [trampoline, setTrampoline] = useState("");
  const [club, setClub] = useState("");
  const [ftEmps, setFtEmps] = useState("");
  const [ptEmps, setPtEmps] = useState("");

  // Loss history
  const [losses, setLosses] = useState("");
  const [lossDetails, setLossDetails] = useState("");

  // Sig
  const [certified, setCertified] = useState(false);
  const [printName, setPrintName] = useState("");
  const [signDate, setSignDate] = useState(todayISO());

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
  const startDraw = (e: React.MouseEvent | React.TouchEvent) => { e.preventDefault(); drawingRef.current = true; lastRef.current = getPoint(e); };
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
  const endDraw = () => { drawingRef.current = false; lastRef.current = null; };
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
    if (!bizName.trim()) return toast.error("Business Name is required.");
    if (!email.trim()) return toast.error("Email is required.");
    if (!phone.trim()) return toast.error("Phone is required.");
    if (!certified) return toast.error("Please certify the information.");
    if (!hasSig.current) return toast.error("Please provide your signature.");

    setStatus("sending");
    try {
      const attachments = [] as Array<{ filename: string; contentBase64: string; contentType?: string }>;
      if (hasSig.current && canvasRef.current) {
        const dataUrl = canvasRef.current.toDataURL("image/png");
        attachments.push({ filename: "signature.png", contentBase64: dataUrl.split(",").pop() || "", contentType: "image/png" });
      }

      await sendQuoteEmail({
        formKind: "Commercial Property Insurance Quote",
        source: "/commercial-property-quote",
        primaryName: bizName,
        customerName: contactName || bizName,
        customerEmail: email,
        customerPhone: phone,
        sections: [
          {
            title: "Business Information",
            rows: [
              ["Business Name", bizName],
              ["Address", `${address}, ${city}, ${state} ${zip}`],
              ["Contact Name", contactName],
              ["Email", email],
              ["Phone", phone],
              ["SSN (Last 4)", ssn4],
              ["Date of Birth", dob],
              ["Description of Operations / SIC Code", operations],
              ["Current Insurance Company", currentIns],
              ["Expiration Date", expDate],
              ["Business Income", bizIncome ? `$${bizIncome}` : "—"],
            ],
          },
          {
            title: "Property Information",
            rows: [
              ["Building Value", buildingValue ? `$${buildingValue}` : "—"],
              ["Contents Value", contentsValue ? `$${contentsValue}` : "—"],
              ["Total Building Area", buildingArea],
              ["Year Built", yearBuilt],
              ["Construction Type", construction],
              ["Heating Type", heating],
              ["Roof Type", roofType],
              ["Roof Age (years)", roofAge],
              ["Central Alarm", centralAlarm],
              ["Burglar Alarm", burglarAlarm],
              ["Sprinkler", sprinkler],
              ["Pool", pool],
              ["Diving Board", pool === "Yes" ? divingBoard : "N/A"],
              ["Approved Fence", fence],
              ["Trampoline", trampoline],
              ["Club", club],
              ["Full-Time Employees", ftEmps],
              ["Part-Time Employees", ptEmps],
            ],
          },
          {
            title: "Loss History",
            rows: [
              ["Losses in last 3 years", losses],
              ["Details", losses === "Yes" ? lossDetails : "N/A"],
            ],
          },
          {
            title: "Signature & Authorization",
            rows: [
              ["Certification", certified ? "I certify all information is accurate and complete." : "—"],
              ["Print Name", printName],
              ["Date", signDate],
            ],
          },
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
        <SEO title="Commercial Property Quote Submitted | Custom Insurance Agency" description="Your commercial property insurance quote request has been submitted." />
        <Navbar />
        <section className="px-6 pt-40 pb-24 text-center">
          <div className="mx-auto max-w-xl rounded-2xl border border-[#e5e7eb] p-10" style={{ borderTop: `3px solid ${TEAL}` }}>
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
        title="Commercial Property Insurance Quote | Custom Insurance Agency"
        description="Request a free commercial property insurance quote from Custom Insurance Agency."
      />
      <Navbar />

      <section
        className="relative flex items-center justify-center pt-28 pb-10 md:pt-32 md:pb-14"
        style={{ background: "linear-gradient(to bottom, #1f4d7a 0%, #173b5d 60%, #0f2a42 100%)" }}
      >
        <div className="px-6 text-center text-white">
          <h1 style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700, fontSize: "clamp(32px, 5vw, 46px)", lineHeight: 1.1 }}>
            Commercial Property Insurance Quote
          </h1>
          <p className="mt-3 text-[14px] md:text-[16px]" style={{ color: "rgba(255,255,255,0.8)" }}>
            Request a Free Quote — We'll get back to you within 1 business day
          </p>
        </div>
      </section>

      <section className="px-4 py-10 md:px-12">
        <form
          onSubmit={onSubmit}
          className="mx-auto max-w-[900px] rounded-2xl bg-white p-6"
          style={{ border: "1px solid #e5e7eb", borderTop: `3px solid ${TEAL}`, boxShadow: "0 8px 30px rgba(0,0,0,0.04)" }}
        >
          <Section title="1. Business Information">
            <div>
              <Label required>Business Name</Label>
              <input value={bizName} onChange={(e) => setBizName(e.target.value)} {...fieldProps} />
            </div>
            <div>
              <Label required>Address</Label>
              <input value={address} onChange={(e) => setAddress(e.target.value)} {...fieldProps} />
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div>
                <Label required>City</Label>
                <input value={city} onChange={(e) => setCity(e.target.value)} {...fieldProps} />
              </div>
              <div>
                <Label required>State</Label>
                <select value={state} onChange={(e) => setState(e.target.value)} {...fieldProps}>
                  {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <Label required>Zip</Label>
                <input value={zip} onChange={(e) => setZip(e.target.value)} {...fieldProps} />
              </div>
            </div>
            <div>
              <Label>Contact Name</Label>
              <input value={contactName} onChange={(e) => setContactName(e.target.value)} {...fieldProps} />
            </div>
            <div>
              <Label required>Email Address</Label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} {...fieldProps} />
            </div>
            <div>
              <Label required>Phone</Label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} {...fieldProps} />
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <Label>SSN Last 4 digits</Label>
                <input maxLength={4} value={ssn4} onChange={(e) => setSsn4(e.target.value)} {...fieldProps} />
              </div>
              <div>
                <Label>Date of Birth</Label>
                <input type="date" placeholder="MM/DD/YYYY" value={dob} onChange={(e) => setDob(e.target.value)} {...fieldProps} />
              </div>
            </div>
            <div>
              <Label>Description of Operations or SIC Code</Label>
              <textarea rows={3} value={operations} onChange={(e) => setOperations(e.target.value)}
                style={{ ...inputBase, height: "auto", resize: "vertical" }} onFocus={handleFocus} onBlur={handleBlur} />
            </div>
            <div>
              <Label>Current Insurance Company</Label>
              <input value={currentIns} onChange={(e) => setCurrentIns(e.target.value)} {...fieldProps} />
            </div>
            <div>
              <Label>Expiration Date</Label>
              <input type="date" placeholder="MM/DD/YYYY" value={expDate} onChange={(e) => setExpDate(e.target.value)} {...fieldProps} />
            </div>
            <div>
              <Label>Business Income</Label>
              <DollarInput value={bizIncome} onChange={setBizIncome} />
            </div>
          </Section>

          <Section title="2. Property Information">
            <p style={{ color: NAVY, fontSize: 13, fontFamily: "Inter, sans-serif" }}>Tell us about your commercial property</p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <Label>Building Value</Label>
                <DollarInput value={buildingValue} onChange={setBuildingValue} />
              </div>
              <div>
                <Label>Contents Value</Label>
                <DollarInput value={contentsValue} onChange={setContentsValue} />
              </div>
              <div>
                <Label>Total Building Area</Label>
                <input placeholder="e.g. 5,000 sq ft" value={buildingArea} onChange={(e) => setBuildingArea(e.target.value)} {...fieldProps} />
              </div>
              <div>
                <Label>Year Built</Label>
                <input type="number" maxLength={4} value={yearBuilt} onChange={(e) => setYearBuilt(e.target.value)} {...fieldProps} />
              </div>
              <div>
                <Label>Construction Type</Label>
                <input placeholder="e.g. Brick, Frame" value={construction} onChange={(e) => setConstruction(e.target.value)} {...fieldProps} />
              </div>
              <div>
                <Label>Heating Type</Label>
                <RadioGroup name="heating" value={heating} onChange={setHeating} options={["Central", "Floor Furnace", "Wood Stove"]} />
              </div>
              <div>
                <Label>Roof Type</Label>
                <RadioGroup name="roofType" value={roofType} onChange={setRoofType} options={["Asphalt Shingles", "Wood", "Metal"]} />
              </div>
              <div>
                <Label>Roof Age (years)</Label>
                <input type="number" value={roofAge} onChange={(e) => setRoofAge(e.target.value)} {...fieldProps} />
              </div>
              <div>
                <Label>Central Alarm</Label>
                <RadioGroup name="centralAlarm" value={centralAlarm} onChange={setCentralAlarm} options={["Yes", "No"]} />
              </div>
              <div>
                <Label>Burglar Alarm</Label>
                <RadioGroup name="burglarAlarm" value={burglarAlarm} onChange={setBurglarAlarm} options={["Yes", "No"]} />
              </div>
              <div>
                <Label>Sprinkler</Label>
                <RadioGroup name="sprinkler" value={sprinkler} onChange={setSprinkler} options={["Yes", "No"]} />
              </div>
              <div>
                <Label>Pool</Label>
                <RadioGroup name="pool" value={pool} onChange={setPool} options={["Yes", "No"]} />
              </div>
              {pool === "Yes" && (
                <div>
                  <Label>Diving Board</Label>
                  <RadioGroup name="divingBoard" value={divingBoard} onChange={setDivingBoard} options={["Yes", "No"]} />
                </div>
              )}
              <div>
                <Label>Approved Fence</Label>
                <RadioGroup name="fence" value={fence} onChange={setFence} options={["Yes", "No"]} />
              </div>
              <div>
                <Label>Trampoline</Label>
                <RadioGroup name="trampoline" value={trampoline} onChange={setTrampoline} options={["Yes", "No"]} />
              </div>
              <div>
                <Label>Club</Label>
                <RadioGroup name="club" value={club} onChange={setClub} options={["Yes", "No"]} />
              </div>
              <div>
                <Label>Number of Full-Time Employees</Label>
                <input type="number" value={ftEmps} onChange={(e) => setFtEmps(e.target.value)} {...fieldProps} />
              </div>
              <div>
                <Label>Number of Part-Time Employees</Label>
                <input type="number" value={ptEmps} onChange={(e) => setPtEmps(e.target.value)} {...fieldProps} />
              </div>
            </div>
          </Section>

          <Section title="3. Loss History">
            <div>
              <Label>Did you have any losses, whether or not paid by insurance, during the last 3 years?</Label>
              <RadioGroup name="losses" value={losses} onChange={setLosses} options={["Yes", "No"]} />
            </div>
            {losses === "Yes" && (
              <div>
                <Label>Please provide details (date, type of loss, amount)</Label>
                <textarea rows={3} value={lossDetails} onChange={(e) => setLossDetails(e.target.value)}
                  style={{ ...inputBase, height: "auto", resize: "vertical" }} onFocus={handleFocus} onBlur={handleBlur} />
              </div>
            )}
          </Section>

          <Section title="4. Signature & Authorization">
            <label className="flex items-start gap-3 text-[14px]" style={{ color: NAVY, fontFamily: "Inter, sans-serif" }}>
              <input
                type="checkbox"
                checked={certified}
                onChange={(e) => setCertified(e.target.checked)}
                style={{ width: 18, height: 18, marginTop: 2, accentColor: TEAL }}
              />
              <span>I certify that all information provided is accurate and complete to the best of my knowledge</span>
            </label>
            <div>
              <Label required>Print Name</Label>
              <input value={printName} onChange={(e) => setPrintName(e.target.value)} {...fieldProps} />
            </div>
            <div>
              <Label required>Date</Label>
              <input type="date" value={signDate} onChange={(e) => setSignDate(e.target.value)} {...fieldProps} />
            </div>
            <div>
              <Label required>E-Signature</Label>
              <div style={{ border: "1px solid #d1d5db", borderRadius: 6, background: "#ffffff", overflow: "hidden" }}>
                <canvas
                  ref={canvasRef}
                  style={{ width: "100%", height: 80, touchAction: "none", display: "block" }}
                  onMouseDown={startDraw} onMouseMove={moveDraw} onMouseUp={endDraw} onMouseLeave={endDraw}
                  onTouchStart={startDraw} onTouchMove={moveDraw} onTouchEnd={endDraw}
                />
              </div>
              <button
                type="button"
                onClick={clearSignature}
                style={{ marginTop: 8, background: "transparent", border: "none", color: TEAL, fontSize: 13, cursor: "pointer", fontFamily: "Inter, sans-serif" }}
              >
                Clear Signature
              </button>
            </div>
          </Section>

          <button
            type="submit"
            disabled={status === "sending"}
            style={{
              width: "100%",
              padding: "16px 24px",
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 700,
              fontSize: 15,
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              borderRadius: 999,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              color: "#fff",
              background: "linear-gradient(135deg, #f5821f, #f5c518)",
              border: "none",
              cursor: status === "sending" ? "not-allowed" : "pointer",
              opacity: status === "sending" ? 0.7 : 1,
            }}
          >
            {status === "sending" && <Loader2 className="h-4 w-4 animate-spin" />}
            {status === "sending" ? "Submitting..." : "Submit Quote Request"}
          </button>
        </form>
      </section>

      <Footer />
    </main>
  );
}