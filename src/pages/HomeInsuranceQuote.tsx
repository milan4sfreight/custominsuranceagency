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

const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  e.currentTarget.style.borderColor = TEAL;
};
const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
      {hint && <p style={{ fontSize: 12, color: "#4a5568", marginTop: -4, marginBottom: 8 }}>{hint}</p>}
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

function RadioGroup({
  name,
  options,
  current,
  onChange,
}: {
  name: string;
  options: string[];
  current: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1">
      {options.map((o) => (
        <label key={o} className="inline-flex cursor-pointer items-center gap-2" style={{ fontSize: 13, color: NAVY }}>
          <input
            type="radio"
            name={name}
            value={o}
            checked={current === o}
            onChange={() => onChange(o)}
            style={{ accentColor: TEAL }}
          />
          {o}
        </label>
      ))}
    </div>
  );
}

const todayUS = () => {
  const d = new Date();
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${d.getFullYear()}`;
};

const ADDITIONAL_FEATURES = ["Deck", "Patio", "Porch"];

export default function HomeInsuranceQuote() {
  // Section 1
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("IL");
  const [zip, setZip] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [ssn4, setSsn4] = useState("");
  const [currentInsurer, setCurrentInsurer] = useState("");
  const [expiration, setExpiration] = useState("");

  // Section 2
  const [coverageType, setCoverageType] = useState("");
  const [yearsLived, setYearsLived] = useState("");
  const [dwellingValue, setDwellingValue] = useState("");
  const [occupiedBy, setOccupiedBy] = useState("");

  // Section 3
  const [structure, setStructure] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [sqft, setSqft] = useState("");
  const [stories, setStories] = useState("");
  const [fireplace, setFireplace] = useState("");
  const [fullBaths, setFullBaths] = useState("");
  const [halfBaths, setHalfBaths] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const toggleFeature = (f: string) =>
    setFeatures((arr) => (arr.includes(f) ? arr.filter((x) => x !== f) : [...arr, f]));
  const [garage, setGarage] = useState("");
  const [garageSize, setGarageSize] = useState("");
  const [foundation, setFoundation] = useState("");
  const [basementType, setBasementType] = useState("");
  const [roofType, setRoofType] = useState("");
  const [roofAge, setRoofAge] = useState("");
  const [pool, setPool] = useState("");
  const [divingBoard, setDivingBoard] = useState("");
  const [fence, setFence] = useState("");
  const [trampoline, setTrampoline] = useState("");

  // Section 4
  const [hasLosses, setHasLosses] = useState("");
  const [lossDetails, setLossDetails] = useState("");

  // Section 5
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
    if (!address.trim()) return toast.error("Please enter your address.");
    if (!email.trim()) return toast.error("Please enter your email.");
    if (!phone.trim()) return toast.error("Please enter your phone number.");
    if (!dob) return toast.error("Please enter your date of birth.");
    if (!coverageType) return toast.error("Please select a coverage type.");
    if (!dwellingValue.trim()) return toast.error("Please enter the dwelling value.");
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

      const dwellingRows: Array<[string, string]> = [];
      const push = (k: string, v: string) => {
        if (v && v.trim()) dwellingRows.push([k, v]);
      };
      push("Building Structure", structure);
      push("Year Built", yearBuilt);
      push("Square Feet", sqft);
      push("Stories", stories);
      push("Fireplace", fireplace);
      push("Full Baths", fullBaths);
      push("Half Baths", halfBaths);
      push("Bedrooms", bedrooms);
      if (features.length) push("Additional Features", features.join(", "));
      push("Garage", garage);
      if (garage && garage !== "None") push("Garage Size", garageSize);
      push("Foundation", foundation);
      if (foundation === "Basement") push("Basement", basementType);
      push("Roof Type", roofType);
      push("Roof Age (yrs)", roofAge);
      push("Swimming Pool", pool);
      if (pool && pool !== "None") push("Diving Board", divingBoard);
      push("Approved Fence", fence);
      push("Trampoline", trampoline);

      const sections: Array<{ title: string; rows: Array<[string, unknown]> }> = [
        {
          title: "Applicant Information",
          rows: [
            ["Full Name", fullName],
            ["Property Address", `${address}, ${city}, ${state} ${zip}`],
            ["Email", email],
            ["Phone", phone],
            ["Date of Birth", dob],
            ["SSN (last 4)", ssn4],
            ["Current Insurance Company", currentInsurer],
            ["Expiration Date", expiration],
          ],
        },
        {
          title: "Coverage Information",
          rows: [
            ["Coverage Type", coverageType],
            ["Years at Address", yearsLived],
            ["Dwelling Value", dwellingValue ? `$${dwellingValue}` : ""],
            ["Occupied By", occupiedBy],
          ],
        },
        { title: "Dwelling Information", rows: dwellingRows },
        {
          title: "Loss History",
          rows: [
            ["Losses in last 3 years", hasLosses || "—"],
            ...(hasLosses === "Yes" ? ([["Details", lossDetails]] as Array<[string, string]>) : []),
          ],
        },
        {
          title: "Signature & Authorization",
          rows: [
            ["Print Name", printName],
            ["Date", signDate],
            ["Certification", "I certify that all information provided is accurate and complete."],
          ],
        },
      ];

      await sendQuoteEmail({
        formKind: "Home Insurance Quote",
        source: "/home-insurance-quote",
        primaryName: fullName,
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
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
        <SEO title="Quote Submitted | Custom Insurance Agency" description="Your home insurance quote request has been submitted." />
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
        title="Home Insurance Quote | Custom Insurance Agency"
        description="Request a free home insurance quote online. We'll get back to you within 1 business day."
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
            Home Insurance Quote
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
              <Label required>Address</Label>
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
            <div>
              <Label required>Phone Number</Label>
              <input type="tel" {...fieldProps} value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <Label required>Date of Birth</Label>
                <input type="date" {...fieldProps} value={dob} onChange={(e) => setDob(e.target.value)} />
              </div>
              <div>
                <Label>SSN (last 4 digits)</Label>
                <input
                  {...fieldProps}
                  maxLength={4}
                  value={ssn4}
                  onChange={(e) => setSsn4(e.target.value.replace(/\D/g, ""))}
                />
              </div>
            </div>
            <div>
              <Label>Current Insurance Company</Label>
              <input {...fieldProps} value={currentInsurer} onChange={(e) => setCurrentInsurer(e.target.value)} />
            </div>
            <div>
              <Label>Expiration Date</Label>
              <input type="date" {...fieldProps} value={expiration} onChange={(e) => setExpiration(e.target.value)} />
            </div>
          </Section>

          {/* Section 2 */}
          <Section title="2. Coverage Information">
            <div>
              <Label required>Coverage requested for</Label>
              <RadioGroup
                name="coverage"
                options={["Home", "Condominium", "Townhouse", "Apartment", "Other"]}
                current={coverageType}
                onChange={setCoverageType}
              />
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <Label>Years Lived at Address to be Insured</Label>
                <input
                  type="number"
                  min={0}
                  {...fieldProps}
                  value={yearsLived}
                  onChange={(e) => setYearsLived(e.target.value)}
                />
              </div>
              <div>
                <Label required>Dwelling Value</Label>
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
                    value={dwellingValue}
                    onChange={(e) => setDwellingValue(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div>
              <Label>Dwelling Occupied By</Label>
              <RadioGroup name="occupied" options={["Owner", "Tenant"]} current={occupiedBy} onChange={setOccupiedBy} />
            </div>
          </Section>

          {/* Section 3 */}
          <Section title="3. Dwelling Information" hint="Tell us about the property.">
            <div>
              <Label>Building Structure</Label>
              <RadioGroup
                name="structure"
                options={["Frame", "Masonry", "Masonry Veneer"]}
                current={structure}
                onChange={setStructure}
              />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <Label>Year Dwelling Built</Label>
                <input
                  type="number"
                  {...fieldProps}
                  value={yearBuilt}
                  onChange={(e) => setYearBuilt(e.target.value.slice(0, 4))}
                />
              </div>
              <div>
                <Label>Dwelling Square Feet</Label>
                <input type="number" {...fieldProps} value={sqft} onChange={(e) => setSqft(e.target.value)} />
              </div>
              <div>
                <Label>Number of Stories</Label>
                <input type="number" {...fieldProps} value={stories} onChange={(e) => setStories(e.target.value)} />
              </div>
              <div>
                <Label>Fireplace</Label>
                <RadioGroup name="fireplace" options={["Yes", "No"]} current={fireplace} onChange={setFireplace} />
              </div>
              <div>
                <Label>Full Baths</Label>
                <input type="number" {...fieldProps} value={fullBaths} onChange={(e) => setFullBaths(e.target.value)} />
              </div>
              <div>
                <Label>Half Baths</Label>
                <input type="number" {...fieldProps} value={halfBaths} onChange={(e) => setHalfBaths(e.target.value)} />
              </div>
              <div>
                <Label>Bedrooms</Label>
                <input type="number" {...fieldProps} value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} />
              </div>
              <div>
                <Label>Additional Features</Label>
                <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1">
                  {ADDITIONAL_FEATURES.map((f) => (
                    <label key={f} className="inline-flex cursor-pointer items-center gap-2" style={{ fontSize: 13, color: NAVY }}>
                      <input
                        type="checkbox"
                        checked={features.includes(f)}
                        onChange={() => toggleFeature(f)}
                        style={{ accentColor: TEAL }}
                      />
                      {f}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <Label>Garage</Label>
              <RadioGroup
                name="garage"
                options={["Attached", "Detached", "Built In", "Carport", "None"]}
                current={garage}
                onChange={setGarage}
              />
            </div>
            {garage && garage !== "None" && (
              <div>
                <Label>Garage Size</Label>
                <input {...fieldProps} value={garageSize} onChange={(e) => setGarageSize(e.target.value)} />
              </div>
            )}
            <div>
              <Label>Type of Foundation</Label>
              <RadioGroup
                name="foundation"
                options={["Crawl Space", "Slab on Grade", "Piers/Pilings/Stilts", "Basement"]}
                current={foundation}
                onChange={setFoundation}
              />
            </div>
            {foundation === "Basement" && (
              <div>
                <Label>If Basement</Label>
                <RadioGroup
                  name="basement"
                  options={["Finished", "Unfinished"]}
                  current={basementType}
                  onChange={setBasementType}
                />
              </div>
            )}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <Label>Roof Type</Label>
                <RadioGroup
                  name="roof"
                  options={["Asphalt Shingles", "Wood", "Metal"]}
                  current={roofType}
                  onChange={setRoofType}
                />
              </div>
              <div>
                <Label>Roof Age (years)</Label>
                <input type="number" {...fieldProps} value={roofAge} onChange={(e) => setRoofAge(e.target.value)} />
              </div>
            </div>
            <div>
              <Label>Swimming Pool</Label>
              <RadioGroup
                name="pool"
                options={["Above Ground", "In-Ground", "None"]}
                current={pool}
                onChange={setPool}
              />
            </div>
            {pool && pool !== "None" && (
              <div>
                <Label>Diving Board</Label>
                <RadioGroup name="diving" options={["Yes", "No"]} current={divingBoard} onChange={setDivingBoard} />
              </div>
            )}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <Label>Approved Fence</Label>
                <RadioGroup name="fence" options={["Yes", "No"]} current={fence} onChange={setFence} />
              </div>
              <div>
                <Label>Trampoline</Label>
                <RadioGroup name="tramp" options={["Yes", "No"]} current={trampoline} onChange={setTrampoline} />
              </div>
            </div>
          </Section>

          {/* Section 4 */}
          <Section title="4. Loss History">
            <div>
              <Label>
                Did you have any losses, whether or not paid by insurance, during the last 3 years, at this dwelling
                location or any other location?
              </Label>
              <RadioGroup name="losses" options={["Yes", "No"]} current={hasLosses} onChange={setHasLosses} />
            </div>
            {hasLosses === "Yes" && (
              <div>
                <Label>Please provide details (date, type of loss, amount)</Label>
                <textarea
                  value={lossDetails}
                  onChange={(e) => setLossDetails(e.target.value)}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  style={{ ...inputBase, height: 100, padding: "8px 12px", resize: "vertical" }}
                />
              </div>
            )}
          </Section>

          {/* Section 5 */}
          <Section title="5. Signature & Authorization">
            <label className="flex items-start gap-2" style={{ fontSize: 13, color: NAVY }}>
              <input
                type="checkbox"
                checked={certified}
                onChange={(e) => setCertified(e.target.checked)}
                style={{ accentColor: TEAL, marginTop: 3 }}
              />
              <span>I certify that all information provided is accurate and complete to the best of my knowledge.</span>
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