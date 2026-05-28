import { useState, useRef, useEffect, type FormEvent } from "react";
import { Loader2, Plus, X, ChevronDown, Check } from "lucide-react";
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

const ENDORSEMENT_TYPES = [
  { key: "add_vehicle", label: "Add Vehicle / Trailer" },
  { key: "delete_vehicle", label: "Delete Vehicle / Trailer" },
  { key: "add_driver", label: "Add Driver" },
  { key: "delete_driver", label: "Delete Driver" },
  { key: "modify_mtc", label: "Modify Motor Truck Cargo Coverage" },
];

const inputBase: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #d1d5db",
  borderRadius: 8,
  padding: "8px 12px",
  height: 40,
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
    <label
      className="mb-2 block"
      style={{ color: NAVY, fontSize: 13, fontWeight: 500, fontFamily: "Inter, sans-serif" }}
    >
      {children}
      {required && <span style={{ color: "#dc2626", marginLeft: 4 }}>*</span>}
    </label>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h3
        className="mb-6 pb-3 uppercase"
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
      <div className="flex flex-col gap-5">{children}</div>
    </div>
  );
}

const addBtnStyle: React.CSSProperties = {
  border: `1px dashed ${TEAL}`,
  color: TEAL,
  background: "transparent",
  fontFamily: "'Barlow', sans-serif",
  fontWeight: 600,
  fontSize: 13,
  borderRadius: 8,
  padding: "10px 20px",
  width: "100%",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  cursor: "pointer",
};
const cardStyle: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 8,
  padding: 16,
  background: "#f8fafc",
  position: "relative",
};
const removeBtn: React.CSSProperties = {
  position: "absolute",
  top: 8,
  right: 8,
  background: "transparent",
  border: "none",
  color: "#dc2626",
  cursor: "pointer",
  padding: 4,
  display: "inline-flex",
};

const accInput: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #d1d5db",
  borderRadius: 8,
  padding: "8px 12px",
  height: 40,
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

type PolicyDetail = { company: string; number: string; effective: string; expiration: string };
const blankPolicy = (): PolicyDetail => ({ company: "", number: "", effective: "", expiration: "" });

type AddVehicle = { unitType: string; year: string; make: string; model: string; vin: string; gvw: string; lpName: string; lpAddress: string };
const blankAddVehicle = (): AddVehicle => ({ unitType: "Truck", year: "", make: "", model: "", vin: "", gvw: "", lpName: "", lpAddress: "" });

type DelVehicle = { unitType: string; year: string; make: string; vin: string };
const blankDelVehicle = (): DelVehicle => ({ unitType: "Truck", year: "", make: "", vin: "" });

type AddDriver = {
  firstName: string; lastName: string; dob: string; license: string; state: string; cdlClass: string; experience: string;
  mvr: File | null; proof: File | null;
};
const blankAddDriver = (): AddDriver => ({
  firstName: "", lastName: "", dob: "", license: "", state: "IL", cdlClass: "Class A", experience: "", mvr: null, proof: null,
});

type DelDriver = { firstName: string; lastName: string; dob: string; license: string };
const blankDelDriver = (): DelDriver => ({ firstName: "", lastName: "", dob: "", license: "" });

const todayISO = () => new Date().toISOString().slice(0, 10);

const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",").pop() || "");
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function EndorsementForm() {
  // Section 1
  const [effDate, setEffDate] = useState("");
  const [selectedPolicies, setSelectedPolicies] = useState<Record<string, boolean>>({});
  const [policyDetails, setPolicyDetails] = useState<Record<string, PolicyDetail>>({});
  const togglePolicy = (key: string) => {
    setSelectedPolicies((s) => ({ ...s, [key]: !s[key] }));
    setPolicyDetails((d) => (d[key] ? d : { ...d, [key]: blankPolicy() }));
  };
  const updatePolicy = (key: string, k: keyof PolicyDetail, v: string) =>
    setPolicyDetails((d) => ({ ...d, [key]: { ...(d[key] ?? blankPolicy()), [k]: v } }));

  // Section 2
  const [insured, setInsured] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("IL");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Section 3 — endorsement types
  const [endorsements, setEndorsements] = useState<Record<string, boolean>>({});
  const toggleEndorsement = (key: string) => {
    setEndorsements((s) => {
      const next = { ...s, [key]: !s[key] };
      if (next[key]) {
        if (key === "add_vehicle" && addVehicles.length === 0) setAddVehicles([blankAddVehicle()]);
        if (key === "delete_vehicle" && delVehicles.length === 0) setDelVehicles([blankDelVehicle()]);
        if (key === "add_driver" && addDrivers.length === 0) setAddDrivers([blankAddDriver()]);
        if (key === "delete_driver" && delDrivers.length === 0) setDelDrivers([blankDelDriver()]);
      }
      return next;
    });
  };

  const [addVehicles, setAddVehicles] = useState<AddVehicle[]>([]);
  const updateAddVehicle = (i: number, k: keyof AddVehicle, v: string | File | null) =>
    setAddVehicles((c) => c.map((row, idx) => (idx === i ? { ...row, [k]: v } : row)));

  const [delVehicles, setDelVehicles] = useState<DelVehicle[]>([]);
  const updateDelVehicle = (i: number, k: keyof DelVehicle, v: string) =>
    setDelVehicles((c) => c.map((row, idx) => (idx === i ? { ...row, [k]: v } : row)));

  const [addDrivers, setAddDrivers] = useState<AddDriver[]>([]);
  const updateAddDriver = (i: number, k: keyof AddDriver, v: string | File | null) =>
    setAddDrivers((c) => c.map((row, idx) => (idx === i ? { ...row, [k]: v } : row)));

  const [delDrivers, setDelDrivers] = useState<DelDriver[]>([]);
  const updateDelDriver = (i: number, k: keyof DelDriver, v: string) =>
    setDelDrivers((c) => c.map((row, idx) => (idx === i ? { ...row, [k]: v } : row)));

  const [mtcLimit, setMtcLimit] = useState("");
  const [mtcCommodities, setMtcCommodities] = useState("");

  // Section 4 — signature
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const hasSig = useRef(false);
  const [signDate, setSignDate] = useState(todayISO());
  const [certified, setCertified] = useState(false);

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

    if (!effDate) return toast.error("Please enter the endorsement effective date.");
    const policyKeys = POLICY_TYPES.filter((p) => selectedPolicies[p.key]);
    if (!policyKeys.length) return toast.error("Select at least one policy type.");
    if (!insured || !street || !city || !zip || !phone || !email)
      return toast.error("Please complete Named Insured information.");
    const endorsementKeys = ENDORSEMENT_TYPES.filter((p) => endorsements[p.key]);
    if (!endorsementKeys.length) return toast.error("Select at least one endorsement type.");
    if (!hasSig.current) return toast.error("Please provide your signature.");
    if (!certified) return toast.error("Please certify the endorsement request.");

    setStatus("sending");
    try {
      const attachments: Array<{ filename: string; contentBase64: string; contentType?: string }> = [];

      if (endorsements.add_driver) {
        for (let i = 0; i < addDrivers.length; i++) {
          const dr = addDrivers[i];
          if (dr.mvr) {
            attachments.push({
              filename: `MVR-${dr.lastName || `driver${i + 1}`}-${dr.mvr.name}`,
              contentBase64: await fileToBase64(dr.mvr),
              contentType: dr.mvr.type || "application/octet-stream",
            });
          }
          if (dr.proof) {
            attachments.push({
              filename: `Experience-${dr.lastName || `driver${i + 1}`}-${dr.proof.name}`,
              contentBase64: await fileToBase64(dr.proof),
              contentType: dr.proof.type || "application/octet-stream",
            });
          }
        }
      }

      if (hasSig.current && canvasRef.current) {
        const dataUrl = canvasRef.current.toDataURL("image/png");
        attachments.push({
          filename: "signature.png",
          contentBase64: dataUrl.split(",").pop() || "",
          contentType: "image/png",
        });
      }

      const sections = [
        {
          title: "Endorsement Details",
          rows: [
            ["Effective Date", effDate],
            ["Policy Types", policyKeys.map((p) => p.label).join(", ")],
          ] as [string, string][],
        },
        {
          title: "Policy Information",
          rows: policyKeys.map((p) => {
              const d = policyDetails[p.key] ?? blankPolicy();
              return [
                p.label,
                `Company: ${d.company || "—"} | Policy #: ${d.number || "—"} | Eff: ${d.effective || "—"} | Exp: ${d.expiration || "—"}`,
              ] as [string, string];
            }),
        },
        {
          title: "Named Insured",
          rows: [
            ["Named Insured", insured],
            ["Mailing Address", `${street}, ${city}, ${state} ${zip}`],
            ["Phone", phone],
            ["Email", email],
          ] as [string, string][],
        },
        {
          title: "Endorsement Types",
          rows: [["Selected", endorsementKeys.map((e) => e.label).join(", ")]] as [string, string][],
        },
      ];

      if (endorsements.add_vehicle && addVehicles.length) {
        sections.push({
          title: "Add Vehicles / Trailers",
          rows: addVehicles.map((v, i) => [
            `#${i + 1}`,
            `${v.unitType} | ${v.year} ${v.make} ${v.model} | VIN: ${v.vin || "—"} | GVW: ${v.gvw || "—"} | Loss Payee: ${v.lpName || "—"} ${v.lpAddress ? `(${v.lpAddress})` : ""}`,
          ]) as [string, string][],
        });
      }
      if (endorsements.delete_vehicle && delVehicles.length) {
        sections.push({
          title: "Delete Vehicles / Trailers",
          rows: delVehicles.map((v, i) => [
            `#${i + 1}`,
            `${v.unitType} | ${v.year} ${v.make} | VIN: ${v.vin || "—"}`,
          ]) as [string, string][],
        });
      }
      if (endorsements.add_driver && addDrivers.length) {
        sections.push({
          title: "Add Drivers",
          rows: addDrivers.map((d, i) => [
            `#${i + 1}`,
            `${d.firstName} ${d.lastName} | DOB: ${d.dob || "—"} | DL: ${d.license || "—"} (${d.state}) | ${d.cdlClass} | Exp: ${d.experience || "—"} yrs | MVR: ${d.mvr ? d.mvr.name : "—"} | Proof: ${d.proof ? d.proof.name : "—"}`,
          ]) as [string, string][],
        });
      }
      if (endorsements.delete_driver && delDrivers.length) {
        sections.push({
          title: "Delete Drivers",
          rows: delDrivers.map((d, i) => [
            `#${i + 1}`,
            `${d.firstName} ${d.lastName} | DOB: ${d.dob || "—"} | DL: ${d.license || "—"}`,
          ]) as [string, string][],
        });
      }
      if (endorsements.modify_mtc) {
        sections.push({
          title: "Modify Motor Truck Cargo",
          rows: [
            ["New MTC Limit", mtcLimit || "—"],
            ["Commodities to Add", mtcCommodities || "—"],
          ] as [string, string][],
        });
      }
      sections.push({
        title: "Signature",
        rows: [
          ["Signed Date", signDate],
          ["Certification", certified ? "I certify the information is accurate and authorize this endorsement." : "—"],
        ] as [string, string][],
      });

      await sendQuoteEmail({
        formKind: "Policy Endorsement",
        source: "/policy-services/endorse",
        primaryName: insured,
        customerName: insured,
        customerEmail: email,
        customerPhone: phone,
        sections,
        attachments,
      });

      setStatus("done");
      toast.success("Endorsement request submitted.");
    } catch (err) {
      console.error(err);
      setStatus("idle");
      toast.error("Submission failed. Please call (630) 576-0630.");
    }
  };

  if (status === "done") {
    return (
      <main className="min-h-screen bg-white font-['Inter',sans-serif]">
        <SEO title="Endorsement Submitted | Custom Insurance Agency" description="Your endorsement request has been submitted." />
        <Navbar />
        <section className="px-6 pt-40 pb-24 text-center">
          <div className="mx-auto max-w-xl rounded-2xl border border-[#e5e7eb] p-10" style={{ borderTop: `3px solid ${TEAL}` }}>
            <h1 className="text-3xl font-bold" style={{ fontFamily: "'Barlow', sans-serif", color: NAVY }}>
              Request Submitted
            </h1>
            <p className="mt-4 text-[15px] text-[#4a5568]">
              Your endorsement request has been submitted. Our team will process it within 1 business day.
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
        title="Endorse Your Policy | Custom Insurance Agency"
        description="Submit an online insurance policy endorsement request to Custom Insurance Agency."
      />
      <Navbar />

      <section
        className="relative flex items-center justify-center pt-28 pb-10 md:pt-32 md:pb-14"
        style={{ background: "linear-gradient(to bottom, #1f4d7a 0%, #173b5d 60%, #0f2a42 100%)" }}
      >
        <div className="px-6 text-center text-white">
          <h1 style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700, fontSize: "clamp(32px, 5vw, 46px)", lineHeight: 1.1 }}>
            Endorse Your Policy Online
          </h1>
          <p className="mt-3 text-[14px] md:text-[16px]" style={{ color: "rgba(255,255,255,0.8)" }}>
            Insurance Policy Endorsement Request
          </p>
        </div>
      </section>

      <section className="px-4 py-10 md:px-12">
        <form
          onSubmit={onSubmit}
          className="mx-auto max-w-[900px] rounded-2xl bg-white p-6 md:p-10"
          style={{ border: "1px solid #e5e7eb", borderTop: `3px solid ${TEAL}`, boxShadow: "0 8px 30px rgba(0,0,0,0.04)" }}
        >
          {/* Section 1 */}
          <Section title="1. Basic Information">
            <div>
              <Label required>Endorsement Effective Date</Label>
              <input type="date" value={effDate} onChange={(e) => setEffDate(e.target.value)} {...fieldProps} />
            </div>
            <div>
              <Label required>Policy Type — Check all that apply</Label>
              <div className="flex flex-col gap-2">
                {POLICY_TYPES.map((p) => {
                  const isSel = !!selectedPolicies[p.key];
                  const d = policyDetails[p.key] ?? blankPolicy();
                  return (
                    <div
                      key={p.key}
                      style={{
                        background: "#ffffff",
                        border: isSel ? `1.5px solid ${TEAL}` : "1px solid #e5e7eb",
                        borderRadius: 10,
                        overflow: "hidden",
                        transition: "border-color .2s ease",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => togglePolicy(p.key)}
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
                      <div
                        style={{
                          maxHeight: isSel ? 240 : 0,
                          overflow: "hidden",
                          transition: "max-height .25s ease",
                          background: "#e8fafa",
                        }}
                      >
                        <div style={{ borderTop: "1px solid #9FE1CB", padding: "0 16px 14px 44px", paddingTop: 10 }}>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label style={slimLabel}>Insurance Company Name</label>
                              <input style={accInput} value={d.company} onChange={(e) => updatePolicy(p.key, "company", e.target.value)} />
                            </div>
                            <div>
                              <label style={slimLabel}>Policy Number</label>
                              <input style={accInput} value={d.number} onChange={(e) => updatePolicy(p.key, "number", e.target.value)} />
                            </div>
                            <div>
                              <label style={slimLabel}>Effective Date</label>
                              <input type="date" style={accInput} value={d.effective} onChange={(e) => updatePolicy(p.key, "effective", e.target.value)} />
                            </div>
                            <div>
                              <label style={slimLabel}>Expiration Date</label>
                              <input type="date" style={accInput} value={d.expiration} onChange={(e) => updatePolicy(p.key, "expiration", e.target.value)} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Section>

          {/* Section 2 */}
          <Section title="2. Named Insured Information">
            <div>
              <Label required>Named Insured</Label>
              <input value={insured} onChange={(e) => setInsured(e.target.value)} {...fieldProps} />
            </div>
            <div>
              <Label required>Street Address</Label>
              <input value={street} onChange={(e) => setStreet(e.target.value)} {...fieldProps} />
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div>
                <Label required>City</Label>
                <input value={city} onChange={(e) => setCity(e.target.value)} {...fieldProps} />
              </div>
              <div>
                <Label required>State</Label>
                <select value={state} onChange={(e) => setState(e.target.value)} {...fieldProps}>
                  {US_STATES.map((s) => (<option key={s} value={s}>{s}</option>))}
                </select>
              </div>
              <div>
                <Label required>ZIP</Label>
                <input value={zip} onChange={(e) => setZip(e.target.value)} {...fieldProps} />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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

          {/* Section 3 */}
          <Section title="3. Endorsement Type — Select all that apply">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {ENDORSEMENT_TYPES.map((e) => {
                const active = !!endorsements[e.key];
                return (
                  <button
                    key={e.key}
                    type="button"
                    onClick={() => toggleEndorsement(e.key)}
                    className="text-left transition-all"
                    style={{
                      padding: "14px 16px",
                      borderRadius: 10,
                      border: `2px solid ${active ? TEAL : "#e5e7eb"}`,
                      background: active ? "#f0fbfb" : "#ffffff",
                      color: NAVY,
                      fontFamily: "'Barlow', sans-serif",
                      fontWeight: 700,
                      fontSize: 14,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      cursor: "pointer",
                    }}
                  >
                    {e.label}
                  </button>
                );
              })}
            </div>

            {/* Add Vehicle */}
            {endorsements.add_vehicle && (
              <div className="mt-2 flex flex-col gap-3">
                <h4 style={{ color: NAVY, fontWeight: 700, fontSize: 14, fontFamily: "'Barlow', sans-serif" }}>
                  Vehicles / Trailers to Add
                </h4>
                {addVehicles.map((v, i) => (
                  <div key={i} style={cardStyle}>
                    {addVehicles.length > 1 && (
                      <button type="button" style={removeBtn} onClick={() => setAddVehicles((c) => c.filter((_, idx) => idx !== i))}>
                        <X className="h-4 w-4" />
                      </button>
                    )}
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div>
                        <Label>Unit Type</Label>
                        <select value={v.unitType} onChange={(ev) => updateAddVehicle(i, "unitType", ev.target.value)} {...fieldProps}>
                          <option>Truck</option><option>Trailer</option><option>Other</option>
                        </select>
                      </div>
                      <div>
                        <Label>Year</Label>
                        <input type="number" min={1900} max={2100} value={v.year} onChange={(ev) => updateAddVehicle(i, "year", ev.target.value)} {...fieldProps} />
                      </div>
                      <div>
                        <Label>Make</Label>
                        <input value={v.make} onChange={(ev) => updateAddVehicle(i, "make", ev.target.value)} {...fieldProps} />
                      </div>
                      <div>
                        <Label>Model</Label>
                        <input value={v.model} onChange={(ev) => updateAddVehicle(i, "model", ev.target.value)} {...fieldProps} />
                      </div>
                      <div>
                        <Label>VIN</Label>
                        <input value={v.vin} onChange={(ev) => updateAddVehicle(i, "vin", ev.target.value)} {...fieldProps} />
                      </div>
                      <div>
                        <Label>GVW</Label>
                        <input value={v.gvw} onChange={(ev) => updateAddVehicle(i, "gvw", ev.target.value)} {...fieldProps} />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Loss Payee Info (if COI needed for Physical Damage or AL)</Label>
                        <input placeholder="Loss Payee / Lienholder Name" value={v.lpName} onChange={(ev) => updateAddVehicle(i, "lpName", ev.target.value)} {...fieldProps} />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Loss Payee Address</Label>
                        <input value={v.lpAddress} onChange={(ev) => updateAddVehicle(i, "lpAddress", ev.target.value)} {...fieldProps} />
                      </div>
                    </div>
                  </div>
                ))}
                <button type="button" style={addBtnStyle} onClick={() => setAddVehicles((c) => [...c, blankAddVehicle()])}>
                  <Plus className="h-4 w-4" /> Add Another Vehicle/Trailer
                </button>
              </div>
            )}

            {/* Delete Vehicle */}
            {endorsements.delete_vehicle && (
              <div className="mt-2 flex flex-col gap-3">
                <h4 style={{ color: NAVY, fontWeight: 700, fontSize: 14, fontFamily: "'Barlow', sans-serif" }}>
                  Vehicles / Trailers to Remove
                </h4>
                {delVehicles.map((v, i) => (
                  <div key={i} style={cardStyle}>
                    {delVehicles.length > 1 && (
                      <button type="button" style={removeBtn} onClick={() => setDelVehicles((c) => c.filter((_, idx) => idx !== i))}>
                        <X className="h-4 w-4" />
                      </button>
                    )}
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div>
                        <Label>Unit Type</Label>
                        <select value={v.unitType} onChange={(ev) => updateDelVehicle(i, "unitType", ev.target.value)} {...fieldProps}>
                          <option>Truck</option><option>Trailer</option><option>Other</option>
                        </select>
                      </div>
                      <div>
                        <Label>Year</Label>
                        <input type="number" value={v.year} onChange={(ev) => updateDelVehicle(i, "year", ev.target.value)} {...fieldProps} />
                      </div>
                      <div>
                        <Label>Make</Label>
                        <input value={v.make} onChange={(ev) => updateDelVehicle(i, "make", ev.target.value)} {...fieldProps} />
                      </div>
                      <div>
                        <Label>VIN</Label>
                        <input value={v.vin} onChange={(ev) => updateDelVehicle(i, "vin", ev.target.value)} {...fieldProps} />
                      </div>
                    </div>
                  </div>
                ))}
                <button type="button" style={addBtnStyle} onClick={() => setDelVehicles((c) => [...c, blankDelVehicle()])}>
                  <Plus className="h-4 w-4" /> Add Another Vehicle/Trailer to Remove
                </button>
              </div>
            )}

            {/* Add Driver */}
            {endorsements.add_driver && (
              <div className="mt-2 flex flex-col gap-3">
                <h4 style={{ color: NAVY, fontWeight: 700, fontSize: 14, fontFamily: "'Barlow', sans-serif" }}>
                  Drivers to Add
                </h4>
                {addDrivers.map((d, i) => (
                  <div key={i} style={cardStyle}>
                    {addDrivers.length > 1 && (
                      <button type="button" style={removeBtn} onClick={() => setAddDrivers((c) => c.filter((_, idx) => idx !== i))}>
                        <X className="h-4 w-4" />
                      </button>
                    )}
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div><Label>First Name</Label><input value={d.firstName} onChange={(ev) => updateAddDriver(i, "firstName", ev.target.value)} {...fieldProps} /></div>
                      <div><Label>Last Name</Label><input value={d.lastName} onChange={(ev) => updateAddDriver(i, "lastName", ev.target.value)} {...fieldProps} /></div>
                      <div><Label>Date of Birth</Label><input type="date" value={d.dob} onChange={(ev) => updateAddDriver(i, "dob", ev.target.value)} {...fieldProps} /></div>
                      <div><Label>License Number</Label><input value={d.license} onChange={(ev) => updateAddDriver(i, "license", ev.target.value)} {...fieldProps} /></div>
                      <div>
                        <Label>License State</Label>
                        <select value={d.state} onChange={(ev) => updateAddDriver(i, "state", ev.target.value)} {...fieldProps}>
                          {US_STATES.map((s) => (<option key={s} value={s}>{s}</option>))}
                        </select>
                      </div>
                      <div>
                        <Label>CDL Class</Label>
                        <select value={d.cdlClass} onChange={(ev) => updateAddDriver(i, "cdlClass", ev.target.value)} {...fieldProps}>
                          <option>Class A</option><option>Class B</option><option>Class C</option><option>Non-CDL</option>
                        </select>
                      </div>
                      <div className="md:col-span-2"><Label>Years of Experience</Label><input type="number" min={0} value={d.experience} onChange={(ev) => updateAddDriver(i, "experience", ev.target.value)} {...fieldProps} /></div>
                      <div className="md:col-span-2">
                        <Label>Attach MVR (Motor Vehicle Record)</Label>
                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(ev) => updateAddDriver(i, "mvr", ev.target.files?.[0] ?? null)} style={inputBase} />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Proof of 2 Years Prior Experience</Label>
                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(ev) => updateAddDriver(i, "proof", ev.target.files?.[0] ?? null)} style={inputBase} />
                      </div>
                    </div>
                  </div>
                ))}
                <button type="button" style={addBtnStyle} onClick={() => setAddDrivers((c) => [...c, blankAddDriver()])}>
                  <Plus className="h-4 w-4" /> Add Another Driver
                </button>
              </div>
            )}

            {/* Delete Driver */}
            {endorsements.delete_driver && (
              <div className="mt-2 flex flex-col gap-3">
                <h4 style={{ color: NAVY, fontWeight: 700, fontSize: 14, fontFamily: "'Barlow', sans-serif" }}>
                  Drivers to Remove
                </h4>
                {delDrivers.map((d, i) => (
                  <div key={i} style={cardStyle}>
                    {delDrivers.length > 1 && (
                      <button type="button" style={removeBtn} onClick={() => setDelDrivers((c) => c.filter((_, idx) => idx !== i))}>
                        <X className="h-4 w-4" />
                      </button>
                    )}
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div><Label>First Name</Label><input value={d.firstName} onChange={(ev) => updateDelDriver(i, "firstName", ev.target.value)} {...fieldProps} /></div>
                      <div><Label>Last Name</Label><input value={d.lastName} onChange={(ev) => updateDelDriver(i, "lastName", ev.target.value)} {...fieldProps} /></div>
                      <div><Label>Date of Birth</Label><input type="date" value={d.dob} onChange={(ev) => updateDelDriver(i, "dob", ev.target.value)} {...fieldProps} /></div>
                      <div><Label>License Number</Label><input value={d.license} onChange={(ev) => updateDelDriver(i, "license", ev.target.value)} {...fieldProps} /></div>
                    </div>
                  </div>
                ))}
                <button type="button" style={addBtnStyle} onClick={() => setDelDrivers((c) => [...c, blankDelDriver()])}>
                  <Plus className="h-4 w-4" /> Remove Another Driver
                </button>
              </div>
            )}

            {/* Modify MTC */}
            {endorsements.modify_mtc && (
              <div className="mt-2 flex flex-col gap-4" style={cardStyle}>
                <div>
                  <Label>Increase Motor Truck Cargo limit to:</Label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#6b7280" }}>$</span>
                    <input
                      placeholder="e.g. $100,000"
                      value={mtcLimit}
                      onChange={(ev) => setMtcLimit(ev.target.value)}
                      style={{ ...inputBase, paddingLeft: 26 }}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </div>
                </div>
                <div>
                  <Label>Add Motor Truck Cargo commodities:</Label>
                  <textarea
                    rows={4}
                    placeholder="List commodities to add..."
                    value={mtcCommodities}
                    onChange={(ev) => setMtcCommodities(ev.target.value)}
                    style={{ ...inputBase, resize: "vertical" }}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>
              </div>
            )}
          </Section>

          {/* Section 4 */}
          <Section title="4. Signature">
            <div>
              <Label required>E-Signature</Label>
              <div style={{ border: "1px solid #d1d5db", borderRadius: 6, background: "#ffffff", overflow: "hidden" }}>
                <canvas
                  ref={canvasRef}
                  style={{ width: "100%", height: 160, touchAction: "none", display: "block" }}
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
                style={{ marginTop: 8, background: "transparent", border: "none", color: TEAL, fontSize: 13, cursor: "pointer", fontFamily: "Inter, sans-serif" }}
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
                I certify that all information provided is accurate and I authorize this endorsement request.
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
            {status === "sending" ? "Submitting..." : "Submit Endorsement Request"}
          </button>
        </form>
      </section>

      <Footer />
    </main>
  );
}