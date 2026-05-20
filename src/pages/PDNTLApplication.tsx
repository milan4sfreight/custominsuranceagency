import { useState, useRef, useEffect, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import SEO from "@/components/SEO";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import { sendQuoteEmail } from "@/lib/sendQuoteEmail";

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

  // Section 5 — Lienholder
  const [lienName, setLienName] = useState("");
  const [lienTel, setLienTel] = useState("");
  const [lienAddress, setLienAddress] = useState("");
  const [lienCity, setLienCity] = useState("");
  const [lienState, setLienState] = useState("Alabama");
  const [lienZip, setLienZip] = useState("");

  // Lease Information
  const [leaseMotorCarrier, setLeaseMotorCarrier] = useState("");
  const [leaseDot, setLeaseDot] = useState("");
  const [leaseMc, setLeaseMc] = useState("");
  const [leaseEffectiveDate, setLeaseEffectiveDate] = useState("");

  // Section 6 — Supporting Documents
  type DocEntry = { type: string; file: File | null };
  const [documents, setDocuments] = useState<DocEntry[]>([]);
  const updateDoc = (i: number, patch: Partial<DocEntry>) =>
    setDocuments((c) => c.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));

  // Section 7 — Signature
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const hasSignatureRef = useRef(false);
  const [signedAt] = useState<string>(() =>
    new Date().toLocaleString("en-US", {
      month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
    })
  );

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
    lastPointRef.current = getPoint(e);
  };
  const moveDraw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawingRef.current) return;
    e.preventDefault();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !lastPointRef.current) return;
    const p = getPoint(e);
    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    lastPointRef.current = p;
    hasSignatureRef.current = true;
  };
  const endDraw = () => {
    drawingRef.current = false;
    lastPointRef.current = null;
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, rect.height);
    hasSignatureRef.current = false;
  };

  const [status, setStatus] = useState<"idle" | "sending">("idle");

  const fileToBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(",").pop() || "");
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      const attachments = await Promise.all(
        documents
          .filter((d) => d.file)
          .map(async (d) => ({
            filename: d.file!.name,
            contentBase64: await fileToBase64(d.file!),
            contentType: d.file!.type || "application/octet-stream",
          })),
      );

      if (hasSignatureRef.current && canvasRef.current) {
        const dataUrl = canvasRef.current.toDataURL("image/png");
        attachments.push({
          filename: "signature.png",
          contentBase64: dataUrl.split(",").pop() || "",
          contentType: "image/png",
        });
      }

      // ===== Build professional AIG-style PD/NTL Application PDF =====
      const pdfBase64 = (() => {
        const doc = new jsPDF({ unit: "pt", format: "letter" });
        const PAGE_W = 612;
        const PAGE_H = 792;
        const MARGIN = 40;
        const CONTENT_W = PAGE_W - MARGIN * 2;
        const NAVY_RGB: [number, number, number] = [23, 59, 93];
        const TEAL_RGB: [number, number, number] = [42, 191, 191];
        const INK: [number, number, number] = [13, 43, 43];
        const MUTED: [number, number, number] = [107, 114, 128];
        const HAIR: [number, number, number] = [229, 231, 235];
        const SOFT: [number, number, number] = [248, 250, 252];

        let y = 0;
        let pageNum = 1;

        const drawHeader = () => {
          // Row 1: navy bar
          doc.setFillColor(31, 77, 122);
          doc.rect(0, 0, 612, 28, "F");
          doc.setTextColor(255, 255, 255);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.text("Non-Trucking Automobile Liability", 45, 18);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          doc.text("Vehicle Physical Damage Individual Application", 612 - 45, 18, { align: "right" });
          // Row 2: light band
          doc.setFillColor(232, 240, 248);
          doc.rect(0, 28, 612, 20, "F");
          doc.setFont("helvetica", "bold");
          doc.setFontSize(7);
          doc.setTextColor(31, 77, 122);
          doc.text("Application must be fully completed or coverage cannot be bound.", 45, 42);
          doc.text(
            "Producing agent is responsible for obtaining and keeping on file a copy of the permanent lease.",
            612 - 45,
            42,
            { align: "right" },
          );
          // Divider
          doc.setDrawColor(31, 77, 122);
          doc.setLineWidth(0.5);
          doc.line(0, 48, 612, 48);
          y = 55;
        };

        const drawFooter = () => {
          // Left callout box
          doc.setFillColor(255, 248, 240);
          doc.rect(40, 740, 390, 45, "F");
          doc.setDrawColor(245, 130, 31);
          doc.setLineWidth(3);
          doc.line(40, 740, 40, 785);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.setTextColor(245, 130, 31);
          doc.text("IMPORTANT - PLEASE NOTE for Non-Trucking Automobile Liability:", 48, 752);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(7);
          doc.setTextColor(85, 85, 85);
          const noteText =
            "This coverage is issued based on a warranty by the vehicle owner (lessor) that the insured tractor is permanently leased to the governmentally regulated motor carrier named on this application. All coverage expires when the permanent lease has been broken, cancelled, or terminated by either the contractor or motor carrier.";
          const wrapped = doc.splitTextToSize(noteText, 375);
          doc.text(wrapped, 48, 762);
          // Right contact box
          doc.setFillColor(245, 245, 245);
          doc.rect(442, 740, 170, 45, "F");
          doc.setDrawColor(204, 204, 204);
          doc.setLineWidth(0.5);
          doc.rect(442, 740, 170, 45, "S");
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.setTextColor(31, 77, 122);
          doc.text("Custom Insurance Agency", 442 + 85, 754, { align: "center" });
          doc.setFont("helvetica", "normal");
          doc.setFontSize(7);
          doc.setTextColor(102, 102, 102);
          doc.text("708-810-1955", 442 + 85, 764, { align: "center" });
          doc.text("quotes@custominsure.com", 442 + 85, 774, { align: "center" });
          // Page number (X of Y via placeholder)
          doc.setFont("helvetica", "normal");
          doc.setFontSize(7);
          doc.setTextColor(153, 153, 153);
          doc.text(`Page ${pageNum} of {nb}`, 612 / 2, 790, { align: "center" });
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
            ensureSpace(rowH + 4);
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
          // header
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
          // body
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

        // Headline summary band
        doc.setFillColor(...SOFT);
        doc.setDrawColor(...HAIR);
        doc.setLineWidth(0.5);
        doc.roundedRect(MARGIN, y, CONTENT_W, 56, 6, 6, "FD");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(...NAVY_RGB);
        doc.text(ownerName || completedBy || "PD/NTL Application", MARGIN + 14, y + 22);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...MUTED);
        const meta = [
          ownerTel ? `Tel: ${ownerTel}` : "",
          effectiveDate ? `Effective: ${effectiveDate}` : "",
          liabilityLimit ? `Limit: ${liabilityLimit}` : "",
        ].filter(Boolean).join("    •    ");
        doc.text(meta || "Submitted via custominsurance.agency", MARGIN + 14, y + 40);
        y += 70;

        sectionTitle("Application Details");
        kvGrid([
          ["Quoted Date", quotedDate],
          ["Effective Date", effectiveDate],
          ["Liability Limit", liabilityLimit],
          ["Producer App Completed By", completedBy],
        ]);

        sectionTitle(`Vehicles  (${vehicles.length})`);
        dataTable(
          ["#", "VIN", "Make", "Year", "Unit #", "Value"],
          vehicles.map((v, i) => [String(i + 1), v.vin, v.make, v.year, v.unit, v.value]),
          [0.5, 3, 1.5, 1, 1.2, 1.5],
        );

        sectionTitle(`Drivers  (${drivers.length})`);
        dataTable(
          ["#", "Name", "Exp (yrs)", "Lic Exp", "DOB", "DL #", "State"],
          drivers.map((d, i) => [String(i + 1), d.name, d.experience, d.licenseExp, d.dob, d.dl, d.state]),
          [0.5, 2.5, 1, 1.2, 1.2, 1.5, 1.4],
        );

        sectionTitle("Vehicle Owner (Lessor)");
        kvGrid([
          ["Name", ownerName],
          ["Telephone", ownerTel],
          ["Address", ownerAddress],
          ["City", ownerCity],
          ["State", ownerState],
          ["ZIP", ownerZip],
        ]);

        sectionTitle("Lienholder Information");
        kvGrid([
          ["Lienholder Name", lienName],
          ["Telephone", lienTel],
          ["Address", lienAddress],
          ["City", lienCity],
          ["State", lienState],
          ["ZIP", lienZip],
        ]);

        sectionTitle("Lease Information");
        kvGrid([
          ["Permanently Leased To (Motor Carrier)", leaseMotorCarrier],
          ["US DOT #", leaseDot],
          ["MC #", leaseMc],
          ["Effective Lease Date", leaseEffectiveDate],
        ]);

        sectionTitle(`Supporting Documents  (${documents.length})`);
        if (documents.length === 0) {
          doc.setFont("helvetica", "italic");
          doc.setFontSize(9);
          doc.setTextColor(...MUTED);
          ensureSpace(20);
          doc.text("No documents attached.", MARGIN, y + 4);
          y += 18;
        } else {
          dataTable(
            ["#", "Document Type", "Filename"],
            documents.map((d, i) => [String(i + 1), d.type, d.file ? d.file.name : ""]),
            [0.5, 2, 3.5],
          );
        }

        // PLEASE NOTE block
        ensureSpace(110);
        doc.setFillColor(...SOFT);
        doc.setDrawColor(...HAIR);
        doc.setLineWidth(0.5);
        const noteText =
          "This coverage is issued based on a warranty by the vehicle owner (lessor) that the insured tractor is permanently leased to the governmentally regulated motor carrier named on this application. All coverage expires when the permanent lease has been broken, cancelled, or terminated by either the contractor or motor carrier.";
        const noteLines = doc.splitTextToSize(noteText, CONTENT_W - 28);
        const noteH = 44 + noteLines.length * 11;
        doc.roundedRect(MARGIN, y, CONTENT_W, noteH, 6, 6, "FD");
        doc.setFillColor(...TEAL_RGB);
        doc.rect(MARGIN, y, 4, noteH, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(...NAVY_RGB);
        doc.text("PLEASE NOTE", MARGIN + 14, y + 16);
        doc.setFontSize(9);
        doc.setTextColor(...INK);
        doc.text("For Non-Trucking Automobile Liability:", MARGIN + 14, y + 30);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...MUTED);
        doc.text(noteLines, MARGIN + 14, y + 44);
        y += noteH + 14;

        // Signature
        sectionTitle("Authorized Signature");
        ensureSpace(110);
        const sigW = 280;
        const sigH = 80;
        doc.setDrawColor(...HAIR);
        doc.setLineWidth(0.5);
        doc.rect(MARGIN, y, sigW, sigH);
        if (hasSignatureRef.current && canvasRef.current) {
          try {
            const sigData = canvasRef.current.toDataURL("image/png");
            doc.addImage(sigData, "PNG", MARGIN + 4, y + 4, sigW - 8, sigH - 8);
          } catch {
            /* ignore */
          }
        }
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(...MUTED);
        doc.text("SIGNATURE", MARGIN, y + sigH + 12);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(...INK);
        doc.text(hasSignatureRef.current ? "Signed electronically" : "Not signed", MARGIN, y + sigH + 26);

        const dateX = MARGIN + sigW + 30;
        doc.setDrawColor(...HAIR);
        doc.line(dateX, y + sigH, PAGE_W - MARGIN, y + sigH);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(...MUTED);
        doc.text("DATE SIGNED", dateX, y + sigH + 12);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(...INK);
        doc.text(signedAt, dateX, y + sigH + 26);
        y += sigH + 36;

        drawFooter();

        // Replace {nb} placeholder with total page count across all pages
        const totalPages = doc.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i);
          // jsPDF's putTotalPages requires the placeholder to have been printed
        }
        if (typeof (doc as unknown as { putTotalPages?: (s: string, n: number) => void }).putTotalPages === "function") {
          (doc as unknown as { putTotalPages: (s: string, n: number) => void }).putTotalPages("{nb}", totalPages);
        }
        const dataUri = doc.output("datauristring");
        return dataUri.split(",").pop() || "";
      })();

      attachments.unshift({
        filename: `PD-NTL-Application-${(ownerName || "applicant").replace(/[^a-z0-9]+/gi, "-")}.pdf`,
        contentBase64: pdfBase64,
        contentType: "application/pdf",
      });

      await sendQuoteEmail({
        formKind: "Trucking Quote",
        source: "PD/NTL Application Page",
        primaryName: ownerName || completedBy || "PD/NTL Application",
        customerName: ownerName,
        customerPhone: ownerTel,
        attachments,
        sections: [
          { title: "Application Details", rows: [
            ["Quoted Date", quotedDate],
            ["Effective Date", effectiveDate],
            ["Liability Limit", liabilityLimit],
            ["Producer App Completed By", completedBy],
          ]},
          { title: "Vehicles", rows: vehicles.map((v, i) => [
            `Vehicle ${i + 1}`,
            `VIN: ${v.vin || "—"} | Make: ${v.make || "—"} | Year: ${v.year || "—"} | Unit #: ${v.unit || "—"} | Value: ${v.value || "—"}`,
          ])},
          { title: "Drivers", rows: drivers.map((d, i) => [
            `Driver ${i + 1}`,
            `Name: ${d.name || "—"} | Experience: ${d.experience || "—"} yrs | License Exp: ${d.licenseExp || "—"} | DOB: ${d.dob || "—"} | DL #: ${d.dl || "—"} | State: ${d.state || "—"}`,
          ])},
          { title: "Vehicle Owner (Lessor)", rows: [
            ["Name", ownerName],
            ["Tel #", ownerTel],
            ["Address", ownerAddress],
            ["City", ownerCity],
            ["State", ownerState],
            ["ZIP", ownerZip],
          ]},
          { title: "Lienholder Information", rows: [
            ["Lienholder Name", lienName],
            ["Tel #", lienTel],
            ["Address", lienAddress],
            ["City", lienCity],
            ["State", lienState],
            ["ZIP", lienZip],
          ]},
          { title: "Lease Information", rows: [
            ["Permanently Leased to Motor Carrier (Lessee)", leaseMotorCarrier],
            ["US DOT #", leaseDot],
            ["MC #", leaseMc],
            ["Effective Lease Date", leaseEffectiveDate],
          ]},
          { title: "Supporting Documents", rows: documents.length
            ? documents.map((d, i) => [`Document ${i + 1}`, `${d.type || "—"}${d.file ? ` — ${d.file.name}` : ""}`])
            : [["Documents", "None attached"]],
          },
          { title: "Signature", rows: [
            ["Signed", hasSignatureRef.current ? "Yes" : "No"],
            ["Signed on", signedAt],
          ]},
        ],
      });
      toast.success("Your PD/NTL application has been sent. Our team will review and contact you shortly.");
      setStatus("idle");
    } catch (err) {
      console.error(err);
      toast.error("Submission failed. Please try again or call 708-810-1955.");
      setStatus("idle");
    }
  };

  return (
    <div className="min-h-screen w-full" style={{ background: "#ffffff" }}>
      <SEO
        title="PD / NTL Application | Custom Insurance Agency"
        description="Apply for Physical Damage and Non-Trucking Liability coverage. Submit vehicle, driver, and lessor details to get a quote."
      />
      <Navbar />

      {/* HERO */}
      <section
        className="relative flex h-[220px] md:h-[300px] w-full items-center justify-center pt-16"
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
          <form onSubmit={onSubmit}>
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

            {/* SECTION 5 — LIENHOLDER */}
            <Section title="Lienholder Information">
              <div><Label>Lienholder Name</Label>
                <input value={lienName} onChange={(e) => setLienName(e.target.value)} {...fieldProps} /></div>
              <div><Label>Tel #</Label>
                <input type="tel" value={lienTel} onChange={(e) => setLienTel(e.target.value)} {...fieldProps} /></div>
              <div><Label>Address</Label>
                <input value={lienAddress} onChange={(e) => setLienAddress(e.target.value)} {...fieldProps} /></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><Label>City</Label>
                  <input value={lienCity} onChange={(e) => setLienCity(e.target.value)} {...fieldProps} /></div>
                <div><Label>State</Label>
                  <select value={lienState} onChange={(e) => setLienState(e.target.value)} {...fieldProps}>
                    {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div><Label>ZIP</Label>
                  <input value={lienZip} onChange={(e) => setLienZip(e.target.value)} {...fieldProps} /></div>
              </div>
            </Section>

            {/* LEASE INFORMATION */}
            <Section title="Lease Information">
              <div>
                <Label required>Permanently Leased to Motor Carrier (Lessee)</Label>
                <input value={leaseMotorCarrier} onChange={(e) => setLeaseMotorCarrier(e.target.value)} {...fieldProps} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label required>US DOT #</Label>
                  <input value={leaseDot} onChange={(e) => setLeaseDot(e.target.value)} {...fieldProps} />
                </div>
                <div>
                  <Label>MC #</Label>
                  <input value={leaseMc} onChange={(e) => setLeaseMc(e.target.value)} {...fieldProps} />
                </div>
              </div>
              <div>
                <Label required>Effective Lease Date</Label>
                <input type="date" value={leaseEffectiveDate} onChange={(e) => setLeaseEffectiveDate(e.target.value)} {...fieldProps} />
              </div>
            </Section>

            {/* SECTION 6 — SUPPORTING DOCUMENTS */}
            <Section title="Supporting Documents">
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#6b7280" }}>
                Attach any supporting documents (MVR, lease agreements, etc.).
              </p>

              {documents.map((d, i) => (
                <div key={i} style={cardStyle}>
                  <div className="flex items-center justify-between mb-3">
                    <span style={cardHeaderTitle}>Document {i + 1}</span>
                    <button
                      type="button"
                      style={removeBtn}
                      onClick={() => setDocuments((c) => c.filter((_, idx) => idx !== i))}
                    >
                      × Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Document Type</Label>
                      <select value={d.type} onChange={(e) => updateDoc(i, { type: e.target.value })} {...fieldProps}>
                        <option value="">Select…</option>
                        <option value="MVR (Motor Vehicle Record)">MVR (Motor Vehicle Record)</option>
                        <option value="Permanent Lease Agreement">Permanent Lease Agreement</option>
                        <option value="Title / Registration">Title / Registration</option>
                        <option value="Custom Document">Custom Document</option>
                      </select>
                    </div>
                    <div>
                      <Label>File</Label>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,image/*"
                        onChange={(e) => updateDoc(i, { file: e.target.files?.[0] ?? null })}
                        style={{
                          background: "#f3f4f6",
                          border: "1px solid #e5e7eb",
                          borderRadius: 8,
                          padding: "10px 14px",
                          width: "100%",
                          fontFamily: "Inter, sans-serif",
                          fontSize: 14,
                          color: NAVY,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                style={addBtnStyle}
                onClick={() => setDocuments((c) => [...c, { type: "", file: null }])}
              >
                + Attach Document
              </button>
            </Section>

            {/* SECTION 7 — SIGNATURE */}
            <Section title="Signature">
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#6b7280", marginBottom: 16 }}>
                By signing below, you confirm that all information provided is accurate and complete.
              </p>
              <canvas
                ref={canvasRef}
                style={{
                  width: "100%",
                  height: 180,
                  background: "#ffffff",
                  border: "2px solid #e5e7eb",
                  borderRadius: 8,
                  cursor: "crosshair",
                  touchAction: "none",
                  display: "block",
                }}
                onMouseDown={startDraw}
                onMouseMove={moveDraw}
                onMouseUp={endDraw}
                onMouseLeave={endDraw}
                onTouchStart={startDraw}
                onTouchMove={moveDraw}
                onTouchEnd={endDraw}
              />
              <div className="flex items-center justify-between mt-3">
                <button
                  type="button"
                  onClick={clearSignature}
                  style={{
                    background: "transparent",
                    color: TEAL,
                    border: "none",
                    fontFamily: "Inter, sans-serif",
                    fontSize: 13,
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  Clear Signature
                </button>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#6b7280" }}>
                  Signed on: {signedAt}
                </span>
              </div>
            </Section>

            {/* PLEASE NOTE */}
            <div
              className="mb-8"
              style={{
                border: "1px solid #e5e7eb",
                background: "#f8fafc",
                borderLeft: `4px solid ${TEAL}`,
                borderRadius: 8,
                padding: "16px 20px",
              }}
            >
              <div
                className="uppercase mb-2"
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontWeight: 700,
                  fontSize: 13,
                  color: NAVY,
                  letterSpacing: "0.08em",
                }}
              >
                Please Note
              </div>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700, fontSize: 13, color: "#0d2b2b" }}>
                For Non-Trucking Automobile Liability:
              </div>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#6b7280", marginTop: 8, lineHeight: 1.55 }}>
                This coverage is issued based on a warranty by the vehicle owner (lessor) that the insured tractor is
                permanently leased to the governmentally regulated motor carrier named on this application. All coverage
                expires when the permanent lease has been broken, cancelled, or terminated by either the contractor or
                motor carrier.
              </p>
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-2 flex w-full items-center justify-center gap-2 uppercase"
              style={{
                background: "linear-gradient(135deg, #f5821f 0%, #f5c518 100%)",
                color: "#ffffff",
                fontFamily: "'Barlow', sans-serif",
                padding: "16px",
                borderRadius: 8,
                border: "none",
                fontWeight: 700,
                letterSpacing: "0.08em",
                fontSize: 15,
                opacity: status === "sending" ? 0.7 : 1,
                cursor: status === "sending" ? "not-allowed" : "pointer",
              }}
            >
              {status === "sending" ? (<><Loader2 size={18} className="animate-spin" />Submitting…</>) : "SUBMIT APPLICATION"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}