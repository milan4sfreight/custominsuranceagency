import { Link } from "react-router-dom";
import { Car, Heart, Home, Bike, Anchor, Truck, Droplets, KeyRound, Snowflake, type LucideIcon } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";

const barlow = { fontFamily: "'Barlow', sans-serif" };

type Quote = { Icon: LucideIcon; title: string; desc: string; to: string };

const quotes: Quote[] = [
  { Icon: Car, title: "Auto Insurance Quote", desc: "Get a free auto insurance quote tailored to your needs. Quick, easy, and no obligation.", to: "/auto-insurance-quote" },
  { Icon: Heart, title: "Health Insurance Quote", desc: "Compare health insurance plans for you and your family. We'll find the right coverage at the right price.", to: "/health-insurance-quote" },
  { Icon: Home, title: "Home Insurance Quote", desc: "Protect your home and belongings with the right homeowners insurance coverage.", to: "/home-insurance-quote" },
  { Icon: Bike, title: "Motorcycle Insurance Quote", desc: "Coverage for your motorcycle tailored to your riding needs, year-round or seasonal.", to: "/motorcycle-insurance-quote" },
  { Icon: Anchor, title: "Boat Insurance Quote", desc: "Protect your boat, watercraft, and passengers on the water.", to: "/boat-insurance-quote" },
  { Icon: Truck, title: "RV Insurance Quote", desc: "Motor home or travel trailer — comprehensive RV coverage for the open road.", to: "/rv-insurance-quote" },
  { Icon: Droplets, title: "Flood Insurance Quote", desc: "Protect your property from flood damage with the right flood insurance coverage.", to: "/flood-insurance-quote" },
  { Icon: KeyRound, title: "Renters Insurance Quote", desc: "Affordable coverage for renters and their personal belongings.", to: "/renters-insurance-quote" },
  { Icon: Snowflake, title: "Snowmobile Insurance Quote", desc: "Stay covered on the trails this winter with snowmobile insurance.", to: "/snowmobile-insurance-quote" },
];

const PersonalLines = () => {
  return (
    <main className="min-h-screen bg-white font-['Inter',sans-serif]">
      <SEO
        title="Personal Lines Insurance Quotes | Custom Insurance Agency"
        description="Free quotes on auto, home, health, motorcycle, boat, RV, flood, renters, and snowmobile insurance from Custom Insurance Agency."
      />
      <Navbar />

      {/* HERO */}
      <section
        className="relative flex h-[220px] md:h-[300px] w-full items-center justify-center pt-16"
        style={{ background: "linear-gradient(135deg, #0f2a42 0%, #0d2b2b 100%)" }}
      >
        <div className="relative z-10 px-6 text-center text-white">
          <h1 style={{ ...barlow, fontWeight: 700, fontSize: "clamp(36px, 6vw, 52px)", lineHeight: 1.1 }}>
            Personal Lines
          </h1>
          <p className="mt-2 text-[15px] md:text-[18px] text-white/85" style={{ ...barlow, fontWeight: 500 }}>
            Get a free quote on any personal insurance product
          </p>
        </div>
      </section>

      {/* QUOTES */}
      <section className="relative px-6 py-10 md:px-12" style={{ zIndex: 1 }}>
        <div className="mx-auto max-w-[1100px]">
          <p className="text-[11px] font-semibold uppercase tracking-[2px] text-[#2abfbf]" style={barlow}>
            Personal Lines
          </p>
          <h2 className="mt-2 text-[22px] md:text-[28px] font-bold text-[#0d2b2b] leading-tight" style={barlow}>
            Personal Insurance Quotes
          </h2>
          <p className="mt-2 text-[14px] leading-[1.6] text-[#4a5568] max-w-[700px]">
            Get a free quote for any personal insurance product. Fill out the form and our team will get back to you within 1 business day.
          </p>

          <div
            className="mt-6"
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}
          >
            {quotes.map(({ Icon, title, desc, to }) => (
              <div
                key={title}
                className="flex flex-col"
                style={{
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderTop: "3px solid #2abfbf",
                  borderRadius: 12,
                  padding: "20px 18px",
                  position: "relative",
                  zIndex: 10,
                }}
              >
                <Icon size={24} color="#2abfbf" />
                <h3 className="mt-3 text-[15px] font-bold text-[#0d2b2b]" style={{ ...barlow, fontWeight: 700 }}>
                  {title}
                </h3>
                <p className="mt-2 text-[13px] leading-[1.55] text-[#4a5568] flex-1">{desc}</p>
                <Link
                  to={to}
                  className="mt-4 no-underline"
                  style={{
                    alignSelf: "flex-start",
                    background: "linear-gradient(135deg, #f5821f, #f5c518)",
                    color: "#ffffff",
                    borderRadius: 999,
                    padding: "9px 16px",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                  }}
                >
                  GET A QUOTE →
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

export default PersonalLines;