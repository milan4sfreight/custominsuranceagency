import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
const volvoTruck = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64";

/* ───────── constants ───────── */

const NAVY = "#173b5d";
const NAVY_DARK = "#0f2a42";
const ORANGE = "#f5821f";
const TEAL = "#2abfbf";
const RED = "#dc2626";

const STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
  "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada",
  "New Hampshire","New Jersey","New Mexico","New York","North Carolina",
  "North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island",
  "South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont",
  "Virginia","Washington","West Virginia","Wisconsin","Wyoming",
  "District of Columbia","Virgin Islands","Guam","Northern Mariana Islands",
  "American Samoa","Puerto Rico",
];

const ENTITY_TYPES = ["Corporation","LLC","Partnership","Sole Proprietor","Individual","Other"];
const RADIUS = ["50","100","150","200","300","500","Unlimited"];
const VEHICLE_TYPES = ["Tractor","Trailer","Truck","Box Truck","Dump Truck","Cargo Van","Pickup","Dry Van","Reefer","Bulk","Flatbed","Tank","Auto Hauler","Low Boy","Customized","Dump-End","Dump-Side","Dump-Bottom","Gooseneck","Hazmat","Other"];
const COMMODITIES = ["Agriculture/Farm Supplies","Amazon Type Merchandise","Auto Parts/Tires","Beverages","Boats","Building Materials","Campers/RVs","Canned Goods","Chemicals","Coal/Coke","Construction","Dairy Products","Department Store Merchandise","Dry Bulk","Electronics","Fresh Meat (Boxed)","Fresh Produce","Fresh Seafood","Frozen Meat/Poultry","Frozen Seafood","Garbage/Refuse/Trash","General Freight","Grain/Feed/Hay","Household Goods","Intermodal Containers","Liquids/Gas","Livestock","Logs/Poles/Beams/Lumber","Lumber","Machinery/Large Objects","Meat","Metal: Sheets/Coils/Rolls","Mobile Homes","Motor Vehicles","Oilfield Equipment","Other","Paper Products","Passengers","Plastic Products","Produce","Refrigerated Food","Sand/Gravel","Scrap/Recyclables","Steel (Non-Coiled)","Tow Away","US Mail","Utility","Water Well"];
const AL_LIMITS = ["$300,000","$500,000","$750,000","$1,000,000","$1,500,000","Other"];
const AL_DEDS = ["$1,000","$2,500","$5,000"];
const MTC_LIMITS = ["$100,000","$250,000","Other"];
const MTC_DEDS = ["$1,000","$2,500","Other"];

/* ───────── shared field styles ───────── */

const labelSty: React.CSSProperties = {
  fontFamily: "Inter, sans-serif",
  fontSize: 13,
  color: NAVY,
  fontWeight: 500,
  display: "block",
  marginBottom: 6,
};
const inputSty = (err = false): React.CSSProperties => ({
  width: "100%",
  border: `1.5px solid ${err ? RED : "#c5d5e8"}`,
  borderRadius: 6,
  padding: "12px 14px",
  fontFamily: "Inter, sans-serif",
  fontSize: 14,
  outline: "none",
  background: "#fff",
  color: "#0d2b2b",
});
const subHeading: React.CSSProperties = {
  fontFamily: "Barlow, sans-serif",
  fontWeight: 700,
  textTransform: "uppercase",
  color: NAVY,
  fontSize: 14,
  letterSpacing: 1,
  marginBottom: 20,
};
const dividerSty: React.CSSProperties = {
  border: 0,
  borderTop: "1px solid #e2e8f0",
  margin: "28px 0",
};
const addBtnSty: React.CSSProperties = {
  background: NAVY,
  color: "#fff",
  fontFamily: "Barlow, sans-serif",
  fontWeight: 600,
  textTransform: "uppercase",
  padding: "10px 24px",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
  fontSize: 13,
  letterSpacing: 0.5,
};
const removeBtnSty: React.CSSProperties = {
  color: RED,
  background: "transparent",
  border: `1px solid ${RED}`,
  borderRadius: 4,
  padding: "6px 14px",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "Inter, sans-serif",
};

/* ───────── small primitives ───────── */

const Req = () => <span style={{ color: RED }}> *</span>;

function Field({
  label, required, children,
}: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label style={labelSty}>
        {label}{required && <Req />}
      </label>
      {children}
    </div>
  );
}

/* ───────── types ───────── */

type Owner = { name: string; dob: string; license: string; licenseState: string; prev: string };
type Vehicle = { vin: string; year: string; make: string; model: string; type: string; otherType: string; value: string };
type Driver = { name: string; dob: string; hireDate: string; experience: string; license: string; licenseState: string; cdl: string };
type Commodity = { name: string; otherName: string; percent: string };

const blankOwner = (): Owner => ({ name: "", dob: "", license: "", licenseState: "", prev: "" });
const blankVehicle = (): Vehicle => ({ vin: "", year: "", make: "", model: "", type: "", otherType: "", value: "" });
const blankDriver = (): Driver => ({ name: "", dob: "", hireDate: "", experience: "", license: "", licenseState: "", cdl: "No" });
const blankCommodity = (): Commodity => ({ name: "", otherName: "", percent: "" });

/* ───────── page ───────── */

export default function GetAQuote() {
  const [submitted, setSubmitted] = useState(false);

  // Step 1
  const [usDot, setUsDot] = useState("");
  const [mc, setMc] = useState("");
  const [other, setOther] = useState("");
  const [taxId, setTaxId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [dba, setDba] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [entity, setEntity] = useState("");
  const [yearsInBiz, setYearsInBiz] = useState("");
  const [fedFilings, setFedFilings] = useState("");
  const [pAddr1, setPAddr1] = useState("");
  const [pAddr2, setPAddr2] = useState("");
  const [pCity, setPCity] = useState("");
  const [pState, setPState] = useState("");
  const [pZip, setPZip] = useState("");
  const [mAddr1, setMAddr1] = useState("");
  const [mAddr2, setMAddr2] = useState("");
  const [mCity, setMCity] = useState("");
  const [mState, setMState] = useState("");
  const [mZip, setMZip] = useState("");
  const [badDays, setBadDays] = useState("");

  // Step 2
  const [owners, setOwners] = useState<Owner[]>([blankOwner()]);
  const [area, setArea] = useState("");
  const [radius, setRadius] = useState("");

  // Step 3
  const [vehicles, setVehicles] = useState<Vehicle[]>([blankVehicle()]);

  // Step 4
  const [drivers, setDrivers] = useState<Driver[]>([blankDriver()]);

  // Step 5
  const [commodities, setCommodities] = useState<Commodity[]>([blankCommodity()]);

  // Step 6
  const [alLimit, setAlLimit] = useState("");
  const [alLimitOther, setAlLimitOther] = useState("");
  const [alDed, setAlDed] = useState("");
  const [mtcLimit, setMtcLimit] = useState("");
  const [mtcLimitOther, setMtcLimitOther] = useState("");
  const [mtcDed, setMtcDed] = useState("");
  const [mtcDedOther, setMtcDedOther] = useState("");
  const [coverageNotes, setCoverageNotes] = useState("");

  // Step 7
  const [losses, setLosses] = useState("");
  const [lossesWhen, setLossesWhen] = useState("");
  const [lossesComments, setLossesComments] = useState("");
  const [currentCarrier, setCurrentCarrier] = useState("");
  const [renewalDate, setRenewalDate] = useState("");
  const [currentPremiums, setCurrentPremiums] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  /* helpers */
  const updateList = <T,>(list: T[], setList: (v: T[]) => void, i: number, patch: Partial<T>) =>
    setList(list.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  const removeRow = <T,>(list: T[], setList: (v: T[]) => void, i: number) => {
    if (list.length <= 1) return;
    setList(list.filter((_, idx) => idx !== i));
  };

  const addOwnersAsDrivers = () => {
    const newOnes: Driver[] = owners
      .filter((o) => o.name || o.license)
      .map((o) => ({
        name: o.name, dob: o.dob, hireDate: "", experience: "",
        license: o.license, licenseState: o.licenseState, cdl: "No",
      }));
    if (newOnes.length === 0) return;
    setDrivers((d) => {
      const onlyEmpty = d.length === 1 && !d[0].name && !d[0].license;
      return onlyEmpty ? newOnes : [...d, ...newOnes];
    });
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, boolean> = {};
    const req = (k: string, v: string) => { if (!v.trim()) errs[k] = true; };

    req("usDot", usDot);
    req("companyName", companyName);
    req("phone", phone);
    req("email", email);
    req("entity", entity);
    req("pAddr1", pAddr1);
    req("pCity", pCity);
    req("pState", pState);
    req("pZip", pZip);

    owners.forEach((o, i) => {
      if (!o.name) errs[`owner-${i}-name`] = true;
      if (!o.dob) errs[`owner-${i}-dob`] = true;
      if (!o.license) errs[`owner-${i}-license`] = true;
    });
    vehicles.forEach((v, i) => {
      if (!v.vin) errs[`veh-${i}-vin`] = true;
      if (!v.year) errs[`veh-${i}-year`] = true;
      if (!v.make) errs[`veh-${i}-make`] = true;
      if (!v.model) errs[`veh-${i}-model`] = true;
      if (!v.type) errs[`veh-${i}-type`] = true;
      if (!v.value) errs[`veh-${i}-value`] = true;
    });
    drivers.forEach((d, i) => {
      if (!d.name) errs[`drv-${i}-name`] = true;
      if (!d.dob) errs[`drv-${i}-dob`] = true;
      if (!d.license) errs[`drv-${i}-license`] = true;
      if (!d.licenseState) errs[`drv-${i}-licenseState`] = true;
    });
    commodities.forEach((c, i) => {
      if (!c.name) errs[`com-${i}-name`] = true;
      if (!c.percent) errs[`com-${i}-percent`] = true;
    });

    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const err = (k: string) => errors[k];

  /* ───────── render ───────── */

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <SEO
        title="Get Your Free Commercial Trucking Insurance Quote"
        description="Get covered in 24 hours. 50+ insurance carriers. No pressure, no jargon. Custom Insurance Agency — serving Illinois & Indiana."
        image="https://custominsurance.agency/og-get-a-quote.jpg"
        url="https://custominsurance.agency/get-a-quote"
        imageWidth={1200}
        imageHeight={630}
      />
      <Navbar />

      {/* HERO */}
      <section
        style={{
          width: "100%",
          height: 280,
          backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url(${volvoTruck})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 110,
        }}
      >
        <h1
          style={{
            color: "#fff",
            fontFamily: "Barlow, sans-serif",
            fontWeight: 800,
            textTransform: "uppercase",
            fontSize: "clamp(28px, 5vw, 48px)",
            textAlign: "center",
            padding: "0 20px",
            lineHeight: 1.1,
          }}
        >
          Commercial Trucking Insurance Quote
        </h1>
      </section>

      {submitted ? (
        <section
          style={{
            background: `linear-gradient(135deg, ${NAVY_DARK} 0%, ${NAVY} 100%)`,
            padding: "80px 20px",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <CheckCircle2 size={88} color={TEAL} style={{ margin: "0 auto 24px" }} />
            <h2 style={{ color: "#fff", fontFamily: "Barlow, sans-serif", fontWeight: 700, fontSize: 32, marginBottom: 16 }}>
              Thank You!
            </h2>
            <p style={{ color: "rgba(255,255,255,0.8)", fontFamily: "Inter, sans-serif", fontSize: 16, marginBottom: 32 }}>
              Your quote request has been submitted. A Custom Insurance Agency representative will contact you within 24 hours.
            </p>
            <Link
              to="/"
              style={{
                display: "inline-block",
                background: "linear-gradient(135deg, #f5821f 0%, #f5c518 100%)",
                color: "#fff",
                fontFamily: "Barlow, sans-serif",
                fontWeight: 700,
                textTransform: "uppercase",
                padding: "14px 36px",
                borderRadius: 6,
                letterSpacing: 1,
                fontSize: 14,
                textDecoration: "none",
              }}
            >
              Return to Home
            </Link>
          </div>
        </section>
      ) : (
        <>
          {/* INTRO */}
          <section style={{ background: "#fff", padding: "48px 20px" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
              <h2
                style={{
                  color: ORANGE,
                  fontFamily: "Barlow, sans-serif",
                  fontWeight: 700,
                  fontSize: 32,
                  textTransform: "uppercase",
                  marginBottom: 20,
                }}
              >
                Ready to get started?
              </h2>
              <p style={{ fontFamily: "Inter, sans-serif", color: "#334155", fontSize: 16, lineHeight: 1.7, marginBottom: 16 }}>
                You are one step closer to securing the best insurance coverage for your trucking business. Our team of dedicated transportation insurance experts are standing by ready to assist you.
              </p>
              <p style={{ fontFamily: "Inter, sans-serif", color: "#334155", fontSize: 16, lineHeight: 1.7 }}>
                Fill out the short form below, and we'll handle the rest. Your peace of mind is just a conversation away.
              </p>
            </div>
          </section>

          {/* FORM */}
          <form onSubmit={onSubmit} style={{ background: "#fff", padding: "0 20px 80px" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
              {/* STEP 1 */}
              <Step label="Company Information" stepText="Step 1 of 7">
                <div style={subHeading}>Licensing Information</div>
                <Grid2>
                  <Field label="US DOT# (if available)" required>
                    <input style={inputSty(err("usDot"))} value={usDot} onChange={(e) => setUsDot(e.target.value)} />
                  </Field>
                  <Field label="MC#"><input style={inputSty()} value={mc} onChange={(e) => setMc(e.target.value)} /></Field>
                  <Field label="Other"><input style={inputSty()} value={other} onChange={(e) => setOther(e.target.value)} /></Field>
                  <Field label="Tax ID Number"><input style={inputSty()} value={taxId} onChange={(e) => setTaxId(e.target.value)} /></Field>
                </Grid2>

                <hr style={dividerSty} />
                <div style={subHeading}>Company Information</div>
                <Grid2>
                  <Field label="Company Name" required>
                    <input style={inputSty(err("companyName"))} value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                  </Field>
                  <Field label="DBA"><input style={inputSty()} value={dba} onChange={(e) => setDba(e.target.value)} /></Field>
                  <Field label="Phone Number" required>
                    <input style={inputSty(err("phone"))} value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </Field>
                  <Field label="Email" required>
                    <input type="email" style={inputSty(err("email"))} value={email} onChange={(e) => setEmail(e.target.value)} />
                  </Field>
                  <Field label="Business Entity Type" required>
                    <select style={inputSty(err("entity"))} value={entity} onChange={(e) => setEntity(e.target.value)}>
                      <option value="">Select…</option>
                      {ENTITY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </Field>
                  <Field label="Continuous Years in Business">
                    <input style={inputSty()} value={yearsInBiz} onChange={(e) => setYearsInBiz(e.target.value)} />
                  </Field>
                </Grid2>
                <div style={{ marginTop: 16 }}>
                  <label style={labelSty}>FED Fillings Required?</label>
                  <RadioYN name="fedFilings" value={fedFilings} onChange={setFedFilings} />
                </div>

                <hr style={dividerSty} />
                <div style={subHeading}>Physical Address</div>
                <Grid2>
                  <Field label="Address Line 1" required>
                    <input style={inputSty(err("pAddr1"))} value={pAddr1} onChange={(e) => setPAddr1(e.target.value)} />
                  </Field>
                  <Field label="Address Line 2"><input style={inputSty()} value={pAddr2} onChange={(e) => setPAddr2(e.target.value)} /></Field>
                </Grid2>
                <Grid3 style={{ marginTop: 16 }}>
                  <Field label="City" required>
                    <input style={inputSty(err("pCity"))} value={pCity} onChange={(e) => setPCity(e.target.value)} />
                  </Field>
                  <Field label="State" required>
                    <select style={inputSty(err("pState"))} value={pState} onChange={(e) => setPState(e.target.value)}>
                      <option value="">Select state</option>
                      {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </Field>
                  <Field label="Zip Code" required>
                    <input style={inputSty(err("pZip"))} value={pZip} onChange={(e) => setPZip(e.target.value)} />
                  </Field>
                </Grid3>

                <hr style={dividerSty} />
                <div style={subHeading}>Mailing Address (if different)</div>
                <Grid2>
                  <Field label="Address Line 1"><input style={inputSty()} value={mAddr1} onChange={(e) => setMAddr1(e.target.value)} /></Field>
                  <Field label="Address Line 2"><input style={inputSty()} value={mAddr2} onChange={(e) => setMAddr2(e.target.value)} /></Field>
                </Grid2>
                <Grid3 style={{ marginTop: 16 }}>
                  <Field label="City"><input style={inputSty()} value={mCity} onChange={(e) => setMCity(e.target.value)} /></Field>
                  <Field label="State">
                    <select style={inputSty()} value={mState} onChange={(e) => setMState(e.target.value)}>
                      <option value="">Select state</option>
                      {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </Field>
                  <Field label="Zip Code"><input style={inputSty()} value={mZip} onChange={(e) => setMZip(e.target.value)} /></Field>
                </Grid3>

                <div style={{ marginTop: 24, maxWidth: "50%" }} className="bd-half">
                  <Field label="Number of Bad Days">
                    <input style={inputSty()} value={badDays} onChange={(e) => setBadDays(e.target.value)} />
                  </Field>
                </div>
              </Step>

              {/* STEP 2 */}
              <Step label="Operations" stepText="Step 2 of 7">
                {owners.map((o, i) => (
                  <div key={i}>
                    {i > 0 && <hr style={dividerSty} />}
                    <Grid2>
                      <Field label="Owner's Name" required>
                        <input style={inputSty(err(`owner-${i}-name`))} value={o.name} onChange={(e) => updateList(owners, setOwners, i, { name: e.target.value })} />
                      </Field>
                      <Field label="Date of Birth" required>
                        <input type="date" style={inputSty(err(`owner-${i}-dob`))} value={o.dob} onChange={(e) => updateList(owners, setOwners, i, { dob: e.target.value })} />
                      </Field>
                      <Field label="Drivers License #" required>
                        <input style={inputSty(err(`owner-${i}-license`))} value={o.license} onChange={(e) => updateList(owners, setOwners, i, { license: e.target.value })} />
                      </Field>
                      <Field label="License State">
                        <select style={inputSty()} value={o.licenseState} onChange={(e) => updateList(owners, setOwners, i, { licenseState: e.target.value })}>
                          <option value="">Select state</option>
                          {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </Field>
                    </Grid2>
                    <div style={{ marginTop: 16 }}>
                      <Field label="Previous Company">
                        <input style={inputSty()} value={o.prev} onChange={(e) => updateList(owners, setOwners, i, { prev: e.target.value })} />
                      </Field>
                    </div>
                    {owners.length > 1 && (
                      <div style={{ marginTop: 12, textAlign: "right" }}>
                        <button type="button" style={removeBtnSty} onClick={() => removeRow(owners, setOwners, i)}>Remove</button>
                      </div>
                    )}
                  </div>
                ))}
                <div style={{ marginTop: 20 }}>
                  <button type="button" style={addBtnSty} onClick={() => setOwners([...owners, blankOwner()])}>Add an Owner</button>
                </div>

                <hr style={dividerSty} />
                <Grid2>
                  <Field label="Area">
                    <select style={inputSty()} value={area} onChange={(e) => setArea(e.target.value)}>
                      <option value="">Select…</option>
                      <option value="Local">Local</option>
                      <option value="Interstate">Interstate</option>
                    </select>
                  </Field>
                  <Field label="Radius of Operations">
                    <select style={inputSty()} value={radius} onChange={(e) => setRadius(e.target.value)}>
                      <option value="">Select…</option>
                      {RADIUS.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </Field>
                </Grid2>
              </Step>

              {/* STEP 3 */}
              <Step label="Vehicles" stepText="Step 3 of 7">
                {vehicles.map((v, i) => (
                  <div key={i}>
                    {i > 0 && <hr style={dividerSty} />}
                    <Grid2>
                      <Field label="VIN #" required>
                        <input style={inputSty(err(`veh-${i}-vin`))} value={v.vin} onChange={(e) => updateList(vehicles, setVehicles, i, { vin: e.target.value })} />
                      </Field>
                      <Field label="Year" required>
                        <input style={inputSty(err(`veh-${i}-year`))} value={v.year} onChange={(e) => updateList(vehicles, setVehicles, i, { year: e.target.value })} />
                      </Field>
                      <Field label="Make" required>
                        <input style={inputSty(err(`veh-${i}-make`))} value={v.make} onChange={(e) => updateList(vehicles, setVehicles, i, { make: e.target.value })} />
                      </Field>
                      <Field label="Model" required>
                        <input style={inputSty(err(`veh-${i}-model`))} value={v.model} onChange={(e) => updateList(vehicles, setVehicles, i, { model: e.target.value })} />
                      </Field>
                      <Field label="Type" required>
                        <select style={inputSty(err(`veh-${i}-type`))} value={v.type} onChange={(e) => updateList(vehicles, setVehicles, i, { type: e.target.value })}>
                          <option value="">Select…</option>
                          {VEHICLE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </Field>
                      <Field label="Value (for physical damage)" required>
                        <input style={inputSty(err(`veh-${i}-value`))} value={v.value} onChange={(e) => updateList(vehicles, setVehicles, i, { value: e.target.value })} />
                      </Field>
                    </Grid2>
                    {v.type === "Other" && (
                      <div style={{ marginTop: 12 }}>
                        <input
                          style={inputSty()}
                          placeholder="Enter vehicle type"
                          value={v.otherType}
                          onChange={(e) => updateList(vehicles, setVehicles, i, { otherType: e.target.value })}
                        />
                      </div>
                    )}
                    {vehicles.length > 1 && (
                      <div style={{ marginTop: 12, textAlign: "right" }}>
                        <button type="button" style={removeBtnSty} onClick={() => removeRow(vehicles, setVehicles, i)}>Remove</button>
                      </div>
                    )}
                  </div>
                ))}
                <div style={{ marginTop: 20 }}>
                  <button type="button" style={addBtnSty} onClick={() => setVehicles([...vehicles, blankVehicle()])}>Add Vehicle/Trailer</button>
                </div>
              </Step>

              {/* STEP 4 */}
              <Step label="Drivers Information" stepText="Step 4 of 7">
                <div style={{ marginBottom: 24 }}>
                  <button
                    type="button"
                    style={{ ...addBtnSty, background: TEAL }}
                    onClick={addOwnersAsDrivers}
                  >
                    Add Owners as Drivers
                  </button>
                </div>

                {drivers.map((d, i) => (
                  <div key={i}>
                    {i > 0 && <hr style={dividerSty} />}
                    <Grid2>
                      <Field label="Full Name" required>
                        <input style={inputSty(err(`drv-${i}-name`))} value={d.name} onChange={(e) => updateList(drivers, setDrivers, i, { name: e.target.value })} />
                      </Field>
                      <Field label="Date of Birth" required>
                        <input type="date" style={inputSty(err(`drv-${i}-dob`))} value={d.dob} onChange={(e) => updateList(drivers, setDrivers, i, { dob: e.target.value })} />
                      </Field>
                      <Field label="Hire Date">
                        <input type="date" style={inputSty()} value={d.hireDate} onChange={(e) => updateList(drivers, setDrivers, i, { hireDate: e.target.value })} />
                      </Field>
                      <Field label="Years of Experience">
                        <input style={inputSty()} value={d.experience} onChange={(e) => updateList(drivers, setDrivers, i, { experience: e.target.value })} />
                      </Field>
                      <Field label="Drivers License #" required>
                        <input style={inputSty(err(`drv-${i}-license`))} value={d.license} onChange={(e) => updateList(drivers, setDrivers, i, { license: e.target.value })} />
                      </Field>
                      <Field label="License State" required>
                        <select style={inputSty(err(`drv-${i}-licenseState`))} value={d.licenseState} onChange={(e) => updateList(drivers, setDrivers, i, { licenseState: e.target.value })}>
                          <option value="">Select state</option>
                          {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </Field>
                    </Grid2>
                    <div style={{ marginTop: 16, maxWidth: "50%" }} className="bd-half">
                      <Field label="Driver Has a CDL?">
                        <select style={inputSty()} value={d.cdl} onChange={(e) => updateList(drivers, setDrivers, i, { cdl: e.target.value })}>
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                        </select>
                      </Field>
                    </div>
                    {drivers.length > 1 && (
                      <div style={{ marginTop: 12, textAlign: "right" }}>
                        <button type="button" style={removeBtnSty} onClick={() => removeRow(drivers, setDrivers, i)}>Remove</button>
                      </div>
                    )}
                  </div>
                ))}
                <div style={{ marginTop: 20 }}>
                  <button type="button" style={addBtnSty} onClick={() => setDrivers([...drivers, blankDriver()])}>Add Driver</button>
                </div>
              </Step>

              {/* STEP 5 */}
              <Step label="Commodities" stepText="Step 5 of 7">
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr",
                    gap: 20,
                    marginBottom: 12,
                    fontFamily: "Barlow, sans-serif",
                    fontWeight: 700,
                    color: NAVY,
                    textTransform: "uppercase",
                    fontSize: 13,
                    letterSpacing: 1,
                  }}
                  className="bd-grid-2"
                >
                  <div>Commodity</div>
                  <div>Percent</div>
                </div>
                {commodities.map((c, i) => (
                  <div key={i} style={{ marginBottom: 16 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }} className="bd-grid-2">
                      <div>
                        <select style={inputSty(err(`com-${i}-name`))} value={c.name} onChange={(e) => updateList(commodities, setCommodities, i, { name: e.target.value })}>
                          <option value="">Select commodity</option>
                          {COMMODITIES.map((co) => <option key={co} value={co}>{co}</option>)}
                        </select>
                        {c.name === "Other" && (
                          <input
                            style={{ ...inputSty(), marginTop: 8 }}
                            placeholder="Enter commodity"
                            value={c.otherName}
                            onChange={(e) => updateList(commodities, setCommodities, i, { otherName: e.target.value })}
                          />
                        )}
                      </div>
                      <div>
                        <input
                          type="number"
                          style={inputSty(err(`com-${i}-percent`))}
                          value={c.percent}
                          onChange={(e) => updateList(commodities, setCommodities, i, { percent: e.target.value })}
                        />
                      </div>
                    </div>
                    {commodities.length > 1 && (
                      <div style={{ marginTop: 8, textAlign: "right" }}>
                        <button type="button" style={removeBtnSty} onClick={() => removeRow(commodities, setCommodities, i)}>Remove</button>
                      </div>
                    )}
                  </div>
                ))}
                <div style={{ marginTop: 20 }}>
                  <button type="button" style={addBtnSty} onClick={() => setCommodities([...commodities, blankCommodity()])}>Add Cargo</button>
                </div>
              </Step>

              {/* STEP 6 */}
              <Step label="Coverage" stepText="Step 6 of 7">
                <div style={subHeading}>Auto Liability</div>
                <Grid2>
                  <Field label="Limit">
                    <select style={inputSty()} value={alLimit} onChange={(e) => setAlLimit(e.target.value)}>
                      <option value="">Select limit</option>
                      {AL_LIMITS.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                    {alLimit === "Other" && (
                      <input style={{ ...inputSty(), marginTop: 8 }} placeholder="Enter limit" value={alLimitOther} onChange={(e) => setAlLimitOther(e.target.value)} />
                    )}
                  </Field>
                  <Field label="Deductible">
                    <select style={inputSty()} value={alDed} onChange={(e) => setAlDed(e.target.value)}>
                      <option value="">Select deductible</option>
                      {AL_DEDS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </Field>
                </Grid2>

                <hr style={dividerSty} />
                <div style={subHeading}>Motor Truck Cargo</div>
                <Grid2>
                  <Field label="Limit">
                    <select style={inputSty()} value={mtcLimit} onChange={(e) => setMtcLimit(e.target.value)}>
                      <option value="">Select limit</option>
                      {MTC_LIMITS.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                    {mtcLimit === "Other" && (
                      <input style={{ ...inputSty(), marginTop: 8 }} placeholder="Enter limit" value={mtcLimitOther} onChange={(e) => setMtcLimitOther(e.target.value)} />
                    )}
                  </Field>
                  <Field label="Deductible">
                    <select style={inputSty()} value={mtcDed} onChange={(e) => setMtcDed(e.target.value)}>
                      <option value="">Select deductible</option>
                      {MTC_DEDS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                    {mtcDed === "Other" && (
                      <input style={{ ...inputSty(), marginTop: 8 }} placeholder="Enter deductible" value={mtcDedOther} onChange={(e) => setMtcDedOther(e.target.value)} />
                    )}
                  </Field>
                </Grid2>

                <div style={{ marginTop: 20 }}>
                  <Field label="Notes">
                    <textarea
                      rows={3}
                      style={{ ...inputSty(), resize: "vertical", fontFamily: "Inter, sans-serif" }}
                      placeholder="Additional coverage notes..."
                      value={coverageNotes}
                      onChange={(e) => setCoverageNotes(e.target.value)}
                    />
                  </Field>
                </div>
              </Step>

              {/* STEP 7 */}
              <Step label="Current Insurance Information" stepText="Step 7 of 7">
                <div>
                  <label style={labelSty}>Any Losses within the last 5 years?</label>
                  <RadioYN name="losses" value={losses} onChange={setLosses} />
                </div>
                {losses === "Yes" && (
                  <div style={{ marginTop: 20 }}>
                    <Grid2>
                      <Field label="If Yes, When?">
                        <input style={inputSty()} value={lossesWhen} onChange={(e) => setLossesWhen(e.target.value)} />
                      </Field>
                      <Field label="Comments">
                        <textarea rows={3} style={{ ...inputSty(), resize: "vertical", fontFamily: "Inter, sans-serif" }} value={lossesComments} onChange={(e) => setLossesComments(e.target.value)} />
                      </Field>
                    </Grid2>
                  </div>
                )}

                <hr style={dividerSty} />
                <Grid2>
                  <Field label="Current Insurance Carrier">
                    <input style={inputSty()} value={currentCarrier} onChange={(e) => setCurrentCarrier(e.target.value)} />
                  </Field>
                  <Field label="Renewal Date">
                    <input type="date" style={inputSty()} value={renewalDate} onChange={(e) => setRenewalDate(e.target.value)} />
                  </Field>
                  <Field label="Current Premiums">
                    <input style={inputSty()} value={currentPremiums} onChange={(e) => setCurrentPremiums(e.target.value)} />
                  </Field>
                  <Field label="Effective Date">
                    <input type="date" style={inputSty()} value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} />
                  </Field>
                </Grid2>
              </Step>

              {/* SUBMIT */}
              <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "200px 1fr", gap: 40 }} className="bd-step">
                <div />
                <button
                  type="submit"
                  style={{
                    width: "100%",
                    background: "linear-gradient(135deg, #f5821f 0%, #f5c518 100%)",
                    color: "#fff",
                    fontFamily: "Barlow, sans-serif",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    padding: "16px 48px",
                    borderRadius: 6,
                    fontSize: 16,
                    letterSpacing: 1,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Submit Quote Request
                </button>
              </div>

              {Object.keys(errors).length > 0 && (
                <p style={{ color: RED, marginTop: 16, fontFamily: "Inter, sans-serif", fontSize: 14, textAlign: "right" }}>
                  Please fill in all required fields highlighted in red.
                </p>
              )}
            </div>
          </form>
        </>
      )}

      <Footer />

      <style>{`
        .bd-step { display: grid; grid-template-columns: 200px 1fr; gap: 40px; margin-top: 48px; }
        .bd-step-aside { position: sticky; top: 130px; align-self: start; }
        .bd-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .bd-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }
        @media (max-width: 768px) {
          .bd-step { grid-template-columns: 1fr; gap: 16px; }
          .bd-step-aside { position: static; }
          .bd-grid-2, .bd-grid-3 { grid-template-columns: 1fr !important; }
          .bd-half { max-width: 100% !important; }
        }
      `}</style>
    </div>
  );
}

/* ───────── helpers ───────── */

function Step({ label, stepText, children }: { label: string; stepText: string; children: React.ReactNode }) {
  return (
    <div className="bd-step">
      <aside className="bd-step-aside">
        <div style={{ fontFamily: "Barlow, sans-serif", fontWeight: 700, color: NAVY, fontSize: 18, textTransform: "uppercase", lineHeight: 1.2 }}>
          {label}
        </div>
        <div style={{ fontFamily: "Barlow, sans-serif", fontWeight: 600, color: ORANGE, fontSize: 13, marginTop: 6, textTransform: "uppercase", letterSpacing: 1 }}>
          {stepText}
        </div>
      </aside>
      <div>{children}</div>
    </div>
  );
}

function Grid2({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div className="bd-grid-2" style={style}>{children}</div>;
}
function Grid3({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div className="bd-grid-3" style={style}>{children}</div>;
}

function RadioYN({ name, value, onChange }: { name: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: "flex", gap: 24, fontFamily: "Inter, sans-serif", fontSize: 14, color: "#0d2b2b" }}>
      {["Yes", "No"].map((opt) => (
        <label key={opt} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <input type="radio" name={name} value={opt} checked={value === opt} onChange={() => onChange(opt)} />
          {opt}
        </label>
      ))}
    </div>
  );
}
