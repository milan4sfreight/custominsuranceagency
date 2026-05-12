import { useState } from "react";
import SEO from "@/components/SEO";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";

const HERO_IMG = "https://images.unsplash.com/photo-1450101499163-c8848c66ca85";
const TEAL = "#2abfbf";
const NAVY = "#173b5d";

const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia",
  "Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland",
  "Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey",
  "New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina",
  "South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming",
];

const inputBase: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #d1d5db",
  borderRadius: 6,
  padding: "10px 14px",
  color: "#0d2b2b",
  width: "100%",
  fontSize: 16,
  outline: "none",
  fontFamily: "Inter, sans-serif",
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
      <div className="flex flex-col gap-6">{children}</div>
    </div>
  );
}

const addBtnStyle: React.CSSProperties = {
  border: `1px dashed ${TEAL}`,
  color: TEAL,
  background: "transparent",
  fontFamily: "'Barlow', sans-serif",
  fontWeight: 600,
  fontSize: 14,
  borderRadius: 8,
  padding: "10px 20px",
  width: "100%",
  cursor: "pointer",
};

const cardStyle: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 8,
  padding: 16,
  background: "#f8fafc",
  marginBottom: 12,
};

const cardHeaderTitle: React.CSSProperties = {
  fontFamily: "'Barlow', sans-serif",
  fontWeight: 700,
  fontSize: 13,
  color: "#1f4d7a",
};

const removeBtn: React.CSSProperties = {
  color: "#dc2626",
  background: "transparent",
  border: "none",
  fontFamily: "Inter, sans-serif",
  fontSize: 13,
  cursor: "pointer",
};

type Vehicle = { vin: string; make: string; year: string; unit: string; value: string };
type Driver = {
  name: string; experience: string; licenseExp: string; dob: string; dl: string; state: string;
};

const blankVehicle = (): Vehicle => ({ vin: "", make: "", year: "", unit: "", value: "" });
const blankDriver = (): Driver => ({ name: "", experience: "", licenseExp: "", dob: "", dl: "", state: "Alabama" });

export default function PDNTLApplication() {
  // Section 1
  const [quotedDate, setQuotedDate] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [liabilityLimit, setLiabilityLimit] = useState("");
  const [completedBy, setCompletedBy] = useState("");

  // Section 2 — Vehicles
  const [vehicles, setVehicles] = useState<Vehicle[]>([blankVehicle()]);
  const updateVehicle = (i: number, k: keyof Vehicle, v: string) =>
    setVehicles((c) => c.map((row, idx) => (idx === i ? { ...row, [k]: v } : row)));

  // Section 3 — Drivers
  const [drivers, setDrivers] = useState<Driver[]>([blankDriver()]);
  const updateDriver = (i: number, k: keyof Driver, v: string) =>
    setDrivers((c) => c.map((row, idx) => (idx === i ? { ...row, [k]: v } : row)));

  // Section 4 — Vehicle Owner / Lessor
  const [ownerName, setOwnerName] = useState("");
  const [ownerTel, setOwnerTel] = useState("");
  const [ownerAddress, setOwnerAddress] = useState("");
  const [ownerCity, setOwnerCity] = useState("");
  const [ownerState, setOwnerState] = useState("Alabama");
  const [ownerZip, setOwnerZip] = useState("");

  return (
    <div className="min-h-screen w-full" style={{ background: "#ffffff" }}>
      <SEO
        title="PD / NTL Application | Custom Insurance Agency"
        description="Apply for Physical Damage and Non-Trucking Liability coverage. Submit vehicle, driver, and lessor details to get a quote."
      />
      <Navbar />

      {/* HERO */}
      <section
        className="relative flex h-[300px] w-full items-center justify-center pt-16"
        style={{ backgroundImage: `url(${HERO_IMG})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.55)" }} />
        <div className="relative z-10 px-6 text-center">
          <h1
            className="font-display"
            style={{
              color: "#ffffff",
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(36px, 5vw, 52px)",
              lineHeight: 1.1,
            }}
          >
            PD / NTL Application
          </h1>
        </div>
      </section>

      <main style={{ padding: "64px 24px", background: "#ffffff" }}>
        <div className="mx-auto" style={{ maxWidth: 760 }}>
          <form onSubmit={(e) => e.preventDefault()}>
            {/* SECTION 1 */}
            <Section title="Application Details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label required>Quoted Date</Label>
                  <input type="date" value={quotedDate} onChange={(e) => setQuotedDate(e.target.value)} {...fieldProps} />
                </div>
                <div>
                  <Label required>Effective Date</Label>
                  <input type="date" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} {...fieldProps} />
                </div>
                <div>
                  <Label required>Liability Limit</Label>
                  <input
                    type="text"
                    placeholder="e.g. $1,000,000"
                    value={liabilityLimit}
                    onChange={(e) => setLiabilityLimit(e.target.value)}
                    {...fieldProps}
                  />
                </div>
                <div>
                  <Label required>Producer App Completed By</Label>
                  <input type="text" value={completedBy} onChange={(e) => setCompletedBy(e.target.value)} {...fieldProps} />
                </div>
              </div>
            </Section>

            {/* SECTION 2 — VEHICLES */}
            <Section title="Vehicles">
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#6b7280" }}>
                List all vehicles. Click "+ Add Vehicle" to add more.
              </p>

              {vehicles.map((v, i) => (
                <div key={i} style={cardStyle}>
                  <div className="flex items-center justify-between mb-3">
                    <span style={cardHeaderTitle}>Vehicle {i + 1}</span>
                    {i > 0 && (
                      <button type="button" style={removeBtn} onClick={() => setVehicles((c) => c.filter((_, idx) => idx !== i))}>
                        × Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div><Label>VIN</Label><input value={v.vin} onChange={(e) => updateVehicle(i, "vin", e.target.value)} {...fieldProps} /></div>
                    <div><Label>Make</Label><input value={v.make} onChange={(e) => updateVehicle(i, "make", e.target.value)} {...fieldProps} /></div>
                    <div><Label>Year</Label><input value={v.year} onChange={(e) => updateVehicle(i, "year", e.target.value)} {...fieldProps} /></div>
                    <div><Label>Unit #</Label><input value={v.unit} onChange={(e) => updateVehicle(i, "unit", e.target.value)} {...fieldProps} /></div>
                    <div><Label>Amount Stated / Value</Label><input placeholder="$0.00" value={v.value} onChange={(e) => updateVehicle(i, "value", e.target.value)} {...fieldProps} /></div>
                  </div>
                </div>
              ))}

              <button type="button" style={addBtnStyle} onClick={() => setVehicles((c) => [...c, blankVehicle()])}>
                + Add Vehicle
              </button>
            </Section>

            {/* SECTION 3 — DRIVERS */}
            <Section title="Drivers">
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#6b7280" }}>
                List all drivers. Click "+ Add Driver" to add more.
              </p>

              {drivers.map((d, i) => (
                <div key={i} style={cardStyle}>
                  <div className="flex items-center justify-between mb-3">
                    <span style={cardHeaderTitle}>Driver {i + 1}</span>
                    {i > 0 && (
                      <button type="button" style={removeBtn} onClick={() => setDrivers((c) => c.filter((_, idx) => idx !== i))}>
                        × Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div><Label required>Name (Owner / Operator / Lessor)</Label>
                      <input value={d.name} onChange={(e) => updateDriver(i, "name", e.target.value)} {...fieldProps} /></div>
                    <div><Label>Years Experience</Label>
                      <input type="number" min={0} value={d.experience} onChange={(e) => updateDriver(i, "experience", e.target.value)} {...fieldProps} /></div>
                    <div><Label>License Expiration</Label>
                      <input placeholder="MM/YYYY" value={d.licenseExp} onChange={(e) => updateDriver(i, "licenseExp", e.target.value)} {...fieldProps} /></div>
                    <div><Label>Date of Birth</Label>
                      <input type="date" value={d.dob} onChange={(e) => updateDriver(i, "dob", e.target.value)} {...fieldProps} /></div>
                    <div><Label>DL #</Label>
                      <input value={d.dl} onChange={(e) => updateDriver(i, "dl", e.target.value)} {...fieldProps} /></div>
                    <div><Label>State</Label>
                      <select value={d.state} onChange={(e) => updateDriver(i, "state", e.target.value)} {...fieldProps}>
                        {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              ))}

              <button type="button" style={addBtnStyle} onClick={() => setDrivers((c) => [...c, blankDriver()])}>
                + Add Driver
              </button>
            </Section>

            {/* SECTION 4 — VEHICLE OWNER / LESSOR */}
            <Section title="Vehicle Owner (Lessor)">
              <div><Label required>Name of Vehicle Owner (Lessor)</Label>
                <input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} {...fieldProps} /></div>
              <div><Label>Tel #</Label>
                <input type="tel" value={ownerTel} onChange={(e) => setOwnerTel(e.target.value)} {...fieldProps} /></div>
              <div><Label required>Address</Label>
                <input value={ownerAddress} onChange={(e) => setOwnerAddress(e.target.value)} {...fieldProps} /></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><Label required>City</Label>
                  <input value={ownerCity} onChange={(e) => setOwnerCity(e.target.value)} {...fieldProps} /></div>
                <div><Label required>State</Label>
                  <select value={ownerState} onChange={(e) => setOwnerState(e.target.value)} {...fieldProps}>
                    {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div><Label required>ZIP</Label>
                  <input value={ownerZip} onChange={(e) => setOwnerZip(e.target.value)} {...fieldProps} /></div>
              </div>
            </Section>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}