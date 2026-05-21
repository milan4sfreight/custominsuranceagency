import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import jsPDF from "jspdf";
import SEO from "@/components/SEO";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import volvoTruck from "@/assets/getquote-hero.jpg";
import { sendQuoteEmail, SUCCESS_MSG, ERROR_MSG } from "@/lib/sendQuoteEmail";

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
  inlineSize: "100%",
  WebkitBoxSizing: "border-box",
  border: `1.5px solid ${err ? RED : "#c5d5e8"}`,
  borderRadius: 6,
  padding: "12px 14px",
  fontFamily: "Inter, sans-serif",
  fontSize: 16,
  outline: "none",
  background: "#fff",
  color: "#0d2b2b",
  boxSizing: "border-box",
  maxWidth: "100%",
  maxInlineSize: "100%",
  minWidth: 0,
  minInlineSize: 0,
  display: "block",
  overflow: "hidden",
});

const dateInputSty = (err = false): React.CSSProperties => ({
  ...inputSty(err),
  minWidth: "100%",
  maxWidth: "100%",
  inlineSize: "100%",
  maxInlineSize: "100%",
  paddingRight: 10,
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
  boxSizing: "border-box",
  maxWidth: "100%",
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
    <div style={{ minWidth: 0, maxWidth: "100%" }}>
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
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "error">("idle");

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

  const onSubmit = async (e: FormEvent) => {
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
    if (submitStatus === "sending") return;
    setSubmitStatus("sending");
    try {
      // ===== Build PDF (same style as PDNTLApplication) =====
      const pdfBase64 = (() => {
        const doc = new jsPDF({ unit: "pt", format: "letter" });
        const PAGE_W = 612;
        const MARGIN = 40;
        const CONTENT_W = 532;
        const NAVY_RGB: [number, number, number] = [31, 77, 122];
        const TEAL_RGB: [number, number, number] = [42, 191, 191];
        const INK: [number, number, number] = [13, 43, 43];
        const MUTED: [number, number, number] = [107, 114, 128];
        const HAIR: [number, number, number] = [229, 231, 235];
        const SOFT: [number, number, number] = [248, 250, 252];

        let y = 0;
        let pageNum = 1;

        const drawHeader = () => {
          doc.setFillColor(31, 77, 122);
          doc.rect(0, 0, 612, 28, "F");
          doc.setTextColor(255, 255, 255);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.text("Custom Insurance Agency", 45, 18);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          doc.text("Commercial Trucking Quote", 567, 18, { align: "right" });
          doc.setFillColor(232, 240, 248);
          doc.rect(0, 28, 612, 20, "F");
          doc.setFont("helvetica", "bold");
          doc.setFontSize(7);
          doc.setTextColor(31, 77, 122);
          doc.text("This quote request was submitted electronically.", 45, 42);
          doc.text("For questions call 708-810-1955", 567, 42, { align: "right" });
          doc.setDrawColor(31, 77, 122);
          doc.setLineWidth(0.5);
          doc.line(0, 48, 612, 48);
          y = 55;
        };

        const drawFooter = () => {
          doc.setFillColor(255, 248, 240);
          doc.rect(40, 740, 390, 45, "F");
          doc.setDrawColor(245, 130, 31);
          doc.setLineWidth(3);
          doc.line(40, 740, 40, 785);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.setTextColor(245, 130, 31);
          doc.text("This quote request has been received by Custom Insurance Agency.", 48, 752);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(7);
          doc.setTextColor(85, 85, 85);
          const wrapped = doc.splitTextToSize(
            "A licensed agent will contact you within 24 hours at 708-810-1955 or Quotes@custominsure.com",
            375,
          );
          doc.text(wrapped, 48, 762);
          doc.setFillColor(245, 245, 245);
          doc.rect(442, 740, 170, 45, "F");
          doc.setDrawColor(204, 204, 204);
          doc.setLineWidth(0.5);
          doc.rect(442, 740, 170, 45, "S");
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.setTextColor(31, 77, 122);
          doc.text("Custom Insurance Agency", 527, 754, { align: "center" });
          doc.setFont("helvetica", "normal");
          doc.setFontSize(7);
          doc.setTextColor(102, 102, 102);
          doc.text("708-810-1955", 527, 764, { align: "center" });
          doc.text("Quotes@custominsure.com", 527, 774, { align: "center" });
          doc.setFont("helvetica", "normal");
          doc.setFontSize(7);
          doc.setTextColor(153, 153, 153);
          doc.text(`Page ${pageNum} of {nb}`, 306, 790, { align: "center" });
        };

        const ensureSpace = (needed: number) => {
          if (y + needed > 735) {
            drawFooter();
            doc.addPage();
            pageNum++;
            drawHeader();
          }
        };

        const sectionTitle = (label: string) => {
          ensureSpace(34);
          doc.setFillColor(...TEAL_RGB);
          doc.rect(MARGIN, y, 3, 14, "F");
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.setTextColor(...NAVY_RGB);
          doc.text(label.toUpperCase(), MARGIN + 10, y + 11);
          y += 18;
          doc.setDrawColor(...HAIR);
          doc.setLineWidth(0.5);
          doc.line(MARGIN, y, PAGE_W - MARGIN, y);
          y += 10;
        };

        const kvGrid = (rows: Array<[string, string]>, cols = 2) => {
          const colW = CONTENT_W / cols;
          const rowH = 30;
          for (let i = 0; i < rows.length; i += cols) {
            ensureSpace(34);
            for (let c = 0; c < cols; c++) {
              const r = rows[i + c];
              if (!r) continue;
              const x = MARGIN + c * colW;
              doc.setFont("helvetica", "normal");
              doc.setFontSize(7.5);
              doc.setTextColor(...MUTED);
              doc.text(r[0].toUpperCase(), x + 4, y + 8);
              doc.setFont("helvetica", "bold");
              doc.setFontSize(10);
              doc.setTextColor(...INK);
              const val = r[1] && r[1].trim() ? r[1] : "—";
              const lines = doc.splitTextToSize(val, colW - 8);
              doc.text(lines.slice(0, 1), x + 4, y + 22);
            }
            doc.setDrawColor(...HAIR);
            doc.setLineWidth(0.3);
            doc.line(MARGIN, y + rowH, PAGE_W - MARGIN, y + rowH);
            y += rowH;
          }
          y += 8;
        };

        const dataTable = (headers: string[], rows: string[][], widths: number[]) => {
          const totalRel = widths.reduce((a, b) => a + b, 0);
          const colWs = widths.map((w) => (w / totalRel) * CONTENT_W);
          const rowH = 22;
          ensureSpace(rowH * 2);
          doc.setFillColor(...NAVY_RGB);
          doc.rect(MARGIN, y, CONTENT_W, rowH, "F");
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.setTextColor(255, 255, 255);
          let xh = MARGIN;
          headers.forEach((h, i) => {
            doc.text(h.toUpperCase(), xh + 6, y + 14);
            xh += colWs[i];
          });
          y += rowH;
          rows.forEach((r, ri) => {
            ensureSpace(rowH);
            if (ri % 2 === 0) {
              doc.setFillColor(...SOFT);
              doc.rect(MARGIN, y, CONTENT_W, rowH, "F");
            }
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(...INK);
            let xc = MARGIN;
            r.forEach((cell, i) => {
              const txt = cell && cell.trim() ? cell : "—";
              const lines = doc.splitTextToSize(txt, colWs[i] - 12);
              doc.text(lines.slice(0, 1), xc + 6, y + 14);
              xc += colWs[i];
            });
            doc.setDrawColor(...HAIR);
            doc.setLineWidth(0.3);
            doc.line(MARGIN, y + rowH, PAGE_W - MARGIN, y + rowH);
            y += rowH;
          });
          y += 10;
        };

        drawHeader();

        // Summary band
        doc.setFillColor(...SOFT);
        doc.setDrawColor(...HAIR);
        doc.setLineWidth(0.5);
        doc.roundedRect(MARGIN, y, CONTENT_W, 56, 6, 6, "FD");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(...NAVY_RGB);
        doc.text(companyName || dba || "Trucking Quote", MARGIN + 14, y + 22);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...MUTED);
        const metaLine =
          ((usDot ? "USDOT: " + usDot : "") + " " + (effectiveDate ? "Eff: " + effectiveDate : "")).trim() ||
          "Submitted via custominsure.com";
        doc.text(metaLine, MARGIN + 14, y + 40);
        y += 70;

        sectionTitle("COMPANY INFORMATION");
        kvGrid([
          ["Company Name", companyName],
          ["DBA", dba],
          ["Phone", phone],
          ["Email", email],
          ["Entity Type", entity],
          ["Years in Business", yearsInBiz],
          ["US DOT #", usDot],
          ["MC #", mc],
          ["Tax ID", taxId],
          ["Federal Filings", fedFilings],
          ["Physical Address", `${pAddr1} ${pAddr2}, ${pCity}, ${pState} ${pZip}`],
          ["Mailing Address", mAddr1 ? ` ${mAddr1} ${mAddr2}, ${mCity}, ${mState} ${mZip}` : ""],
        ]);

        sectionTitle("OPERATIONS");
        kvGrid([
          ["Operating Area", area],
          ["Operating Radius", radius],
          ["Bad Weather Days", badDays],
          ["Owners", owners.map((o) => o.name).join(", ")],
        ]);

        sectionTitle("VEHICLES (" + vehicles.length + ")");
        dataTable(
          ["#", "YEAR", "MAKE", "MODEL", "TYPE", "VALUE"],
          vehicles.map((v, i) => [
            String(i + 1),
            v.year,
            v.make,
            v.model,
            v.type === "Other" ? v.otherType : v.type,
            v.value,
          ]),
          [0.4, 0.8, 1.2, 1.2, 1.4, 1],
        );

        sectionTitle("DRIVERS (" + drivers.length + ")");
        dataTable(
          ["#", "NAME", "DOB", "LICENSE #", "STATE", "YEARS EXP"],
          drivers.map((d, i) => [
            String(i + 1),
            d.name,
            d.dob,
            d.license,
            d.licenseState,
            d.experience,
          ]),
          [0.4, 2, 1, 1.5, 0.8, 0.8],
        );

        sectionTitle("COMMODITIES");
        kvGrid(
          commodities.map(
            (c, i) =>
              [
                "Commodity " + (i + 1),
                (c.name === "Other" ? c.otherName : c.name) + " " + c.percent + "%",
              ] as [string, string],
          ),
        );

        sectionTitle("COVERAGE REQUESTED");
        kvGrid([
          ["Auto Liability Limit", alLimit === "Other" ? alLimitOther : alLimit],
          ["Auto Liability Deductible", alDed],
          ["Motor Truck Cargo Limit", mtcLimit === "Other" ? mtcLimitOther : mtcLimit],
          ["Motor Truck Cargo Deductible", mtcDed === "Other" ? mtcDedOther : mtcDed],
          ["Coverage Notes", coverageNotes],
          ["Desired Effective Date", effectiveDate],
        ]);

        sectionTitle("LOSS HISTORY");
        kvGrid([
          ["Losses in Past 5 Years", losses],
          ["When", lossesWhen],
          ["Comments", lossesComments],
        ]);

        sectionTitle("CURRENT POLICY");
        kvGrid([
          ["Current Carrier", currentCarrier],
          ["Renewal Date", renewalDate],
          ["Current Premiums", currentPremiums],
        ]);

        drawFooter();

        const totalPages = doc.getNumberOfPages();
        if (typeof (doc as unknown as { putTotalPages?: (s: string, n: number) => void }).putTotalPages === "function") {
          (doc as unknown as { putTotalPages: (s: string, n: number) => void }).putTotalPages("{nb}", totalPages);
        }
        return doc.output("datauristring").split(",")[1];
      })();

      await sendQuoteEmail({
        formKind: "Trucking Quote",
        source: "Get A Quote — Trucking (7-step form)",
        primaryName: companyName || dba || "Trucking Quote",
        customerName: companyName,
        customerEmail: email,
        customerPhone: phone,
        attachments: [
          {
            filename:
              "TruckingQuote_" +
              (companyName || dba || "Quote").replace(/\s+/g, "_") +
              "_" +
              new Date().toISOString().split("T")[0] +
              ".pdf",
            contentBase64: pdfBase64,
            contentType: "application/pdf",
          },
        ],
        sections: [
          {
            title: "Filings & Tax",
            rows: [
              ["USDOT #", usDot],
              ["MC #", mc],
              ["Other Filing #", other],
              ["Tax ID", taxId],
              ["Federal Filings", fedFilings],
            ],
          },
          {
            title: "Company",
            rows: [
              ["Company Name", companyName],
              ["DBA", dba],
              ["Phone", phone],
              ["Email", email],
              ["Entity Type", entity],
              ["Years in Business", yearsInBiz],
              ["Physical Address", `${pAddr1} ${pAddr2}, ${pCity}, ${pState} ${pZip}`.trim()],
              ["Mailing Address", `${mAddr1} ${mAddr2}, ${mCity}, ${mState} ${mZip}`.trim()],
            ],
          },
          {
            title: "Operations",
            rows: [
              ["Bad Weather Days", badDays],
              ["Owners", owners],
              ["Operating Area", area],
              ["Operating Radius", radius],
            ],
          },
          { title: "Vehicles", rows: [["Vehicles", vehicles]] },
          { title: "Drivers", rows: [["Drivers", drivers]] },
          { title: "Commodities", rows: [["Commodities", commodities]] },
          {
            title: "Coverage",
            rows: [
              ["Auto Liability Limit", alLimit === "Other" ? alLimitOther : alLimit],
              ["Auto Liability Deductible", alDed],
              ["Motor Truck Cargo Limit", mtcLimit === "Other" ? mtcLimitOther : mtcLimit],
              ["Motor Truck Cargo Deductible", mtcDed === "Other" ? mtcDedOther : mtcDed],
              ["Coverage Notes", coverageNotes],
            ],
          },
          {
            title: "Loss History",
            rows: [
              ["Losses (last 5 yrs)", losses],
              ["Losses When", lossesWhen],
              ["Losses Comments", lossesComments],
            ],
          },
          {
            title: "Current Policy",
            rows: [
              ["Current Carrier", currentCarrier],
              ["Renewal Date", renewalDate],
              ["Current Premiums", currentPremiums],
              ["Effective Date", effectiveDate],
            ],
          },
        ],
      });
      setSubmitted(true);
      setSubmitStatus("idle");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      setSubmitStatus("error");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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
        className="bd-hero"
        style={{
          width: "100%",
          height: "300px",
          backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${volvoTruck})`,
          backgroundSize: "cover",
          backgroundPosition: "center 75%",
          backgroundRepeat: "no-repeat",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 0,
          paddingTop: 64,
        }}
      >
        <h1
          className="bd-hero-h1"
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
            <p style={{ color: "rgba(255,255,255,0.95)", fontFamily: "Inter, sans-serif", fontSize: 16, marginBottom: 32, fontWeight: 600 }}>
              {SUCCESS_MSG}
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
          <section className="bd-intro" style={{ background: "#fff", padding: "40px 20px 48px" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
              <h2
                className="bd-intro-h2"
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
          <form className="bd-form" onSubmit={onSubmit} style={{ background: "#fff", padding: "0 20px 80px" }}>
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
                        <input type="date" style={dateInputSty(err(`owner-${i}-dob`))} value={o.dob} onChange={(e) => updateList(owners, setOwners, i, { dob: e.target.value })} />
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
                      <div className="bd-remove-wrap" style={{ marginTop: 12, textAlign: "right" }}>
                        <button type="button" className="bd-remove-btn" style={removeBtnSty} onClick={() => removeRow(owners, setOwners, i)}>Remove</button>
                      </div>
                    )}
                  </div>
                ))}
                <div style={{ marginTop: 20 }}>
                  <button type="button" className="bd-add-btn" style={addBtnSty} onClick={() => setOwners([...owners, blankOwner()])}>Add an Owner</button>
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
                      <div className="bd-remove-wrap" style={{ marginTop: 12, textAlign: "right" }}>
                        <button type="button" className="bd-remove-btn" style={removeBtnSty} onClick={() => removeRow(vehicles, setVehicles, i)}>Remove</button>
                      </div>
                    )}
                  </div>
                ))}
                <div style={{ marginTop: 20 }}>
                  <button type="button" className="bd-add-btn" style={addBtnSty} onClick={() => setVehicles([...vehicles, blankVehicle()])}>Add Vehicle/Trailer</button>
                </div>
              </Step>

              {/* STEP 4 */}
              <Step label="Drivers Information" stepText="Step 4 of 7">
                <div style={{ marginBottom: 24 }}>
                  <button
                    type="button"
                    className="bd-add-btn"
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
                        <input type="date" style={dateInputSty(err(`drv-${i}-dob`))} value={d.dob} onChange={(e) => updateList(drivers, setDrivers, i, { dob: e.target.value })} />
                      </Field>
                      <Field label="Hire Date">
                        <input type="date" style={dateInputSty()} value={d.hireDate} onChange={(e) => updateList(drivers, setDrivers, i, { hireDate: e.target.value })} />
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
                      <div className="bd-remove-wrap" style={{ marginTop: 12, textAlign: "right" }}>
                        <button type="button" className="bd-remove-btn" style={removeBtnSty} onClick={() => removeRow(drivers, setDrivers, i)}>Remove</button>
                      </div>
                    )}
                  </div>
                ))}
                <div style={{ marginTop: 20 }}>
                  <button type="button" className="bd-add-btn" style={addBtnSty} onClick={() => setDrivers([...drivers, blankDriver()])}>Add Driver</button>
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
                      <div className="bd-remove-wrap" style={{ marginTop: 8, textAlign: "right" }}>
                        <button type="button" className="bd-remove-btn" style={removeBtnSty} onClick={() => removeRow(commodities, setCommodities, i)}>Remove</button>
                      </div>
                    )}
                  </div>
                ))}
                <div style={{ marginTop: 20 }}>
                  <button type="button" className="bd-add-btn" style={addBtnSty} onClick={() => setCommodities([...commodities, blankCommodity()])}>Add Cargo</button>
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
                    <input type="date" style={dateInputSty()} value={renewalDate} onChange={(e) => setRenewalDate(e.target.value)} />
                  </Field>
                  <Field label="Current Premiums">
                    <input style={inputSty()} value={currentPremiums} onChange={(e) => setCurrentPremiums(e.target.value)} />
                  </Field>
                  <Field label="Effective Date">
                    <input type="date" style={dateInputSty()} value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} />
                  </Field>
                </Grid2>
              </Step>

              {/* SUBMIT */}
              <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "200px 1fr", gap: 40 }} className="bd-step">
                <div />
                <button
                  type="submit"
                  disabled={submitStatus === "sending"}
                  className="bd-submit"
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
                    opacity: submitStatus === "sending" ? 0.7 : 1,
                  }}
                >
                  {submitStatus === "sending" ? "Sending…" : "Submit Quote Request"}
                </button>
              </div>

              {Object.keys(errors).length > 0 && (
                <p style={{ color: RED, marginTop: 16, fontFamily: "Inter, sans-serif", fontSize: 14, textAlign: "right" }}>
                  Please fill in all required fields highlighted in red.
                </p>
              )}
              {submitStatus === "error" && (
                <p style={{ color: "#b91c1c", marginTop: 16, fontFamily: "Inter, sans-serif", fontSize: 14, textAlign: "center", fontWeight: 600, background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 6, padding: 12 }}>
                  {ERROR_MSG}
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
        .bd-grid-2 { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 20px; }
        .bd-grid-3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }
        .bd-step-mobile-indicator { display: none; }
        .bd-form, .bd-form * { box-sizing: border-box; }
        .bd-form input, .bd-form select, .bd-form textarea, .bd-form button { display: block; width: 100%; inline-size: 100%; max-width: 100%; min-width: 0; max-inline-size: 100%; min-inline-size: 0; box-sizing: border-box; }
        .bd-form input[type="date"] { display: block; width: 100%; inline-size: 100%; max-width: 100%; max-inline-size: 100%; min-width: 0; min-inline-size: 0; box-sizing: border-box; -webkit-box-sizing: border-box; -webkit-appearance: none; appearance: none; }
        .bd-form input[type="date"]::-webkit-date-and-time-value { text-align: left; min-height: 20px; }
        .bd-form input[type="date"]::-webkit-calendar-picker-indicator { margin-left: 0; padding-left: 4px; }
        @media (max-width: 768px) {
          .bd-step { grid-template-columns: minmax(0, 1fr) !important; gap: 16px !important; }
          .bd-step-aside { position: static; }
          .bd-grid-2, .bd-grid-3 { grid-template-columns: minmax(0, 1fr) !important; }
          .bd-half { max-width: 100% !important; }
          .bd-hero { height: 220px !important; min-height: 220px; padding: 64px 20px 0 !important; }
          .bd-hero-h1 { font-size: clamp(24px, 5vw, 48px) !important; }
          .bd-intro { padding: 32px 20px !important; }
          .bd-intro-h2 { font-size: clamp(22px, 5vw, 32px) !important; }
          .bd-form { padding: 0 16px 48px !important; width: 100% !important; max-width: 100vw !important; }
          .bd-step { scroll-margin-top: 130px; }
          .bd-step-aside { display: none !important; }
          .bd-step-mobile-indicator { display: block; font-family: 'Barlow', sans-serif; font-weight: 600; color: ${ORANGE}; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
          .bd-submit { min-height: 56px; font-size: 16px !important; padding: 16px 24px !important; width: 100% !important; }
          .bd-add-btn { width: 100% !important; min-height: 48px !important; padding: 14px 24px !important; }
          .bd-remove-wrap { text-align: left !important; }
          .bd-remove-btn { width: 100% !important; min-height: 44px !important; padding: 10px 14px !important; font-size: 14px !important; }
          .bd-form input:not([type="radio"]):not([type="checkbox"]), .bd-form select, .bd-form textarea { font-size: 16px !important; width: 100% !important; inline-size: 100% !important; max-width: 100% !important; max-inline-size: 100% !important; min-width: 0 !important; min-inline-size: 0 !important; }
          .bd-form input[type="date"] { width: 100% !important; inline-size: 100% !important; max-width: 100% !important; max-inline-size: 100% !important; min-width: 0 !important; min-inline-size: 0 !important; }
          label[type="radio"], input[type="radio"] { min-width: 24px; min-height: 24px; }
          html, body { overflow-x: hidden; }
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
      <div>
        <div className="bd-step-mobile-indicator">{stepText} — {label}</div>
        {children}
      </div>
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
