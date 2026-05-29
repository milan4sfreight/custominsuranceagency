import { Link } from "react-router-dom";
import { Truck, Package, Shield, HardHat, Building2, Umbrella, type LucideIcon } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";

const barlow = { fontFamily: "'Barlow', sans-serif" };

type Card = { Icon: LucideIcon; title: string; desc: string; to: string };

const cards: Card[] = [
  {
    Icon: Truck,
    title: "Auto Liability",
    desc: "Commercial auto liability coverage for your trucking operation. Protect your business from claims arising from accidents.",
    to: "/get-a-quote",
  },
  {
    Icon: Package,
    title: "Motor Truck Cargo",
    desc: "Coverage for freight and cargo you haul. Protect your loads against damage, theft, and loss in transit.",
    to: "/get-a-quote",
  },
  {
    Icon: Shield,
    title: "Physical Damage & Non-Trucking Liability",
    desc: "Protect your trucks and trailers from physical damage, and cover non-trucking use liability gaps.",
    to: "/get-a-quote",
  },
  {
    Icon: HardHat,
    title: "Occupational Accident Coverage (OCC/ACC)",
    desc: "Occupational accident and accidental coverage for owner-operators and independent contractors.",
    to: "/occ-accident-enrollment",
  },
  {
    Icon: Building2,
    title: "General Liability Insurance",
    desc: "Protect your business from third-party claims of bodily injury, property damage, and personal injury.",
    to: "/get-a-quote",
  },
  {
    Icon: Umbrella,
    title: "Excess or Umbrella Insurance",
    desc: "Extra liability protection above your existing coverage limits for added peace of mind and security.",
    to: "/get-a-quote",
  },
  {
    Icon: HardHat,
    title: "Workers Compensation",
    desc: "Protect your employees and your business with workers compensation coverage required by law.",
    to: "/workers-comp-quote",
  },
  {
    Icon: Building2,
    title: "Commercial Property Insurance",
    desc: "Coverage for your business property, building, contents, and equipment against damage and loss.",
    to: "/commercial-property-quote",
  },
];

const CommercialLines = () => {
  // trigger rebuild
  return (
    <main className="min-h-screen bg-white font-['Inter',sans-serif]">
      <SEO
        title="Commercial Lines Insurance | Custom Insurance Agency"
        description="Business insurance quotes including auto liability, motor truck cargo, physical damage, occupational accident, general liability, and umbrella coverage."
      />
      <Navbar />

      {/* HERO */}
      <section
        className="relative flex h-[220px] md:h-[300px] w-full items-center justify-center pt-16"
        style={{ background: "linear-gradient(135deg, #0f2a42 0%, #0d2b2b 100%)" }}
      >
        <div className="relative z-10 px-6 text-center text-white">
          <h1 style={{ ...barlow, fontWeight: 700, fontSize: "clamp(36px, 6vw, 52px)", lineHeight: 1.1 }}>
            Commercial Lines
          </h1>
          <p className="mt-2 text-[15px] md:text-[18px] text-white/85" style={{ ...barlow, fontWeight: 500 }}>
            Business insurance quotes and commercial coverage
          </p>
        </div>
      </section>

      {/* CARDS */}
      <section className="relative px-6 py-10 md:px-12" style={{ zIndex: 1 }}>
        <div className="mx-auto max-w-[1100px]">
          <p className="text-[11px] font-semibold uppercase tracking-[2px] text-[#2abfbf]" style={barlow}>
            Commercial Lines
          </p>
          <h2 className="mt-2 text-[22px] md:text-[28px] font-bold text-[#0d2b2b] leading-tight" style={barlow}>
            Commercial Insurance Quotes
          </h2>
          <p className="mt-2 text-[14px] leading-[1.6] text-[#4a5568] max-w-[700px]">
            Get a free quote for any commercial insurance product. Fill out the form and our team will get back to you within 1 business day.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map(({ Icon, title, desc, to }) => (
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
                <h3 className="text-sm font-bold text-[#1f4d7a]" style={barlow}>
                  {title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed flex-1">{desc}</p>
                <Link
                  to={to}
                  className="self-start text-sm font-semibold text-white px-5 py-2.5 rounded-full whitespace-nowrap no-underline"
                  style={{ background: "linear-gradient(135deg, #f5821f, #f5c518)" }}
                >
                  QUOTE NOW →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default CommercialLines;