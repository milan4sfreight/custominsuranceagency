import { FileText, Shield, XCircle, UserCheck, type LucideIcon } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";

const barlow = { fontFamily: "'Barlow', sans-serif" };

type Card = { Icon: LucideIcon; title: string; subtitle: string; desc: string; href: string };

const cards: Card[] = [
  {
    Icon: FileText,
    title: "Commercial Insurance Application",
    subtitle: "ACORD 125",
    desc: "Standard commercial insurance application form. Complete and submit to your agent for a commercial insurance quote.",
    href: "/forms/Commercial_Insurance_125.pdf",
  },
  {
    Icon: Shield,
    title: "Commercial General Liability",
    subtitle: "ACORD 126",
    desc: "Commercial general liability section form. Required supplement to the ACORD 125 for liability coverage.",
    href: "/forms/Commercial_General_Liability_126.pdf",
  },
  {
    Icon: XCircle,
    title: "Cancellation Request / Policy Release",
    subtitle: "ACORD 35",
    desc: "Standard policy cancellation request form. Use to cancel an existing policy or submit a policy release statement.",
    href: "/forms/Cancellation_Request_35.pdf",
  },
  {
    Icon: UserCheck,
    title: "Agent / Broker of Record Change",
    subtitle: "ACORD 36",
    desc: "Use this form to designate Custom Insurance Agency as your exclusive insurance representative for your policies.",
    href: "/forms/Agent_of_Record_Change_36.pdf",
  },
];

const OtherForms = () => {
  return (
    <main className="min-h-screen bg-white font-['Inter',sans-serif]">
      <SEO
        title="Other Forms | Custom Insurance Agency"
        description="Download standard ACORD insurance forms and applications including commercial insurance, general liability, cancellation, and broker of record change."
      />
      <Navbar />

      <section
        className="relative flex h-[220px] md:h-[300px] w-full items-center justify-center overflow-hidden pt-16"
        style={{ background: "linear-gradient(135deg, #0f2a42 0%, #0d2b2b 100%)" }}
      >
        <img
          src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85"
          alt="Insurance forms background"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 px-6 text-center text-white">
          <h1 style={{ ...barlow, fontWeight: 700, fontSize: "clamp(36px, 6vw, 52px)", lineHeight: 1.1 }}>
            Other Forms
          </h1>
          <p className="mt-2 text-[15px] md:text-[18px] text-white/85" style={{ ...barlow, fontWeight: 500 }}>
            Download standard insurance forms and applications
          </p>
        </div>
      </section>

      <section className="relative px-6 py-10 md:px-12" style={{ zIndex: 1 }}>
        <div className="mx-auto max-w-[1100px]">
          <p className="text-[11px] font-semibold uppercase tracking-[2px] text-[#2abfbf]" style={barlow}>
            Other Forms
          </p>
          <h2 className="mt-2 text-[22px] md:text-[28px] font-bold text-[#0d2b2b] leading-tight" style={barlow}>
            Insurance Forms & Applications
          </h2>
          <p className="mt-2 text-[14px] leading-[1.6] text-[#4a5568] max-w-[700px]">
            Download the standard ACORD forms below. Fill them out and email to Quotes@custominsure.com or bring them to our office.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" style={{ alignItems: "stretch" }}>
            {cards.map(({ Icon, title, subtitle, desc, href }) => (
              <div
                key={title}
                style={{
                  border: "1px solid #e2e8f0",
                  borderTop: "3px solid #2abfbf",
                  borderRadius: "12px",
                  padding: "20px 18px",
                  background: "white",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <Icon className="w-6 h-6 text-[#2abfbf]" />
                <div style={{ fontSize: 11, color: "#2abfbf", fontWeight: 600 }}>
                  {subtitle}
                </div>
                <h3 className="text-[18px] font-bold text-[#0d2b2b]" style={barlow}>
                  {title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed flex-1">{desc}</p>
                <a
                  href={href}
                  download
                  className="self-start text-sm font-semibold text-white px-5 py-2.5 rounded-full whitespace-nowrap mt-auto no-underline"
                  style={{ background: "linear-gradient(135deg, #f5821f, #f5c518)" }}
                >
                  DOWNLOAD FORM →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default OtherForms;