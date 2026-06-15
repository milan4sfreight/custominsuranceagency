import { Link } from "react-router-dom";
import { Pencil, XCircle } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import resourcesHero from "@/assets/resources-hero.jpg";

const HERO_IMG = resourcesHero;
const barlow = { fontFamily: "'Barlow', sans-serif" };

const cards = [
  {
    key: "endorse",
    label: "Endorse Your Policy",
    icon: Pencil,
    title: "Endorse Your Policy",
    intro:
      "Need to add a vehicle, add or remove a driver, or modify your coverage? Submit an endorsement request online and our team will process it promptly.",
    bullets: [
      "Add or remove vehicles and trailers",
      "Add or remove drivers",
      "Modify Motor Truck Cargo coverage",
      "Update Loss Payee information",
      "Fast processing by our licensed team",
    ],
    cta: "START ENDORSEMENT REQUEST →",
    to: "/policy-services/endorse",
  },
  {
    key: "cancel",
    label: "Cancel Your Policy",
    icon: XCircle,
    title: "Cancel Your Policy",
    intro:
      "If you need to cancel one or more of your insurance policies, you can submit your cancellation request securely online.",
    bullets: [
      "Cancel Auto Liability, MTC, GL, Physical Damage, NTL or OCC policies",
      "Specify exact cancellation date and time",
      "Secure e-signature required",
      "Processed by Custom Insurance Agency",
    ],
    cta: "START CANCELLATION REQUEST →",
    to: "/policy-services/cancel",
  },
];

const PolicyServices = () => {
  return (
    <main className="min-h-screen bg-white font-['Inter',sans-serif]">
      <SEO
        title="Policy Services | Custom Insurance Agency"
        description="Manage your existing policies — submit endorsement or cancellation requests securely online with Custom Insurance Agency."
      />
      <Navbar />

      {/* HERO */}
      <section
        className="relative flex h-[220px] md:h-[300px] w-full items-center justify-center pt-16"
        style={{ backgroundImage: `url(${HERO_IMG})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.55)" }} />
        <div className="relative z-10 px-6 text-center text-white">
          <h1 style={{ ...barlow, fontWeight: 700, fontSize: "clamp(36px, 6vw, 52px)", lineHeight: 1.1 }}>
            Policy Services
          </h1>
          <p className="mt-2 text-[15px] md:text-[18px] text-white/85" style={{ ...barlow, fontWeight: 500 }}>
            Manage your existing policies quickly and securely online
          </p>
        </div>
      </section>

      {/* CARDS */}
      <section className="relative px-6 py-10 md:px-12" style={{ zIndex: 1 }}>
        <div className="mx-auto max-w-[1000px]">
          <p className="text-[11px] font-semibold uppercase tracking-[2px] text-[#2abfbf]" style={barlow}>
            Policy Services
          </p>
          <h2 className="mt-2 text-[22px] md:text-[28px] font-bold text-[#0d2b2b] leading-tight" style={barlow}>
            Manage Your Existing Policies
          </h2>
          <p className="mt-2 text-[14px] leading-[1.6] text-[#4a5568]">
            Choose an option below to get started.
          </p>

          <div
            className="mt-6 grid grid-cols-1 md:grid-cols-2"
            style={{ gap: 20, alignItems: "stretch" }}
          >
            {cards.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.key}
                  style={{
                    background: "white",
                    border: "1px solid #e5e7eb",
                    borderTop: "3px solid #2abfbf",
                    borderRadius: 12,
                    padding: "28px 24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                  }}
                >
                  <Icon size={28} style={{ color: "#2abfbf" }} />
                  <h3 style={{ ...barlow, fontSize: 18, fontWeight: 700, color: "#0d2b2b" }}>
                    {c.title}
                  </h3>
                  <p className="text-[14px] leading-[1.6] text-[#4a5568]">{c.intro}</p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                    {c.bullets.map((b) => (
                      <li key={b} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "#4a5568", lineHeight: 1.5 }}>
                        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#2abfbf", flex: "none", marginTop: 7 }} />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <div style={{ flex: 1 }} />
                  <Link
                    to={c.to}
                    style={{
                      alignSelf: "flex-start",
                      background: "linear-gradient(135deg, #f5821f, #f5c518)",
                      color: "white",
                      borderRadius: 999,
                      padding: "12px 22px",
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.07em",
                      textDecoration: "none",
                    }}
                  >
                    {c.cta}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-6 py-10 text-center md:px-12" style={{ zIndex: 1 }}>
        <h2 className="text-[24px] md:text-[28px] font-bold text-[#0d2b2b]" style={barlow}>
          Need Help With Your Policy?
        </h2>
        <p className="mx-auto mt-2 max-w-[640px] text-[14px] text-[#4a5568]">
          Our team is here to assist with any policy changes or questions.
        </p>
        <Link to="/contact" className="btn-quote mt-5 inline-block px-10 py-3 text-[14px] uppercase tracking-wider">
          Contact Us
        </Link>
      </section>

      <Footer />
    </main>
  );
};

export default PolicyServices;