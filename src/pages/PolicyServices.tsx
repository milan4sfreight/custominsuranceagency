import { useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, XCircle } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import resourcesHero from "@/assets/resources-hero.jpg";

const HERO_IMG = resourcesHero;
const barlow = { fontFamily: "'Barlow', sans-serif" };

const tabs = [
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
    cta: "Start Endorsement Request →",
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
    cta: "Start Cancellation Request →",
    to: "/policy-services/cancel",
  },
];

const PolicyServices = () => {
  const [active, setActive] = useState(tabs[0].key);
  const current = tabs.find((t) => t.key === active) ?? tabs[0];

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

      {/* TABS */}
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
            className="mt-6 overflow-hidden bg-white"
            style={{ border: "2px solid #2abfbf", borderRadius: 16 }}
          >
            <div
              className="grid"
              style={{ gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid #e5e7eb" }}
            >
              {tabs.map((t, idx) => {
                const Icon = t.icon;
                const isActive = t.key === active;
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setActive(t.key)}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.background = "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.background = "#f3f4f6";
                    }}
                    className="flex items-center justify-center gap-2 transition-colors"
                    style={{
                      ...barlow,
                      padding: "18px 20px",
                      fontSize: 15,
                      fontWeight: 500,
                      background: isActive ? "#ffffff" : "#f3f4f6",
                      color: isActive ? "#0f6e56" : "#6b7280",
                      borderRight: idx === 0 ? "1px solid #e5e7eb" : "none",
                      borderBottom: isActive ? "3px solid #2abfbf" : "3px solid transparent",
                    }}
                  >
                    <Icon size={18} style={{ color: isActive ? "#2abfbf" : "#9ca3af" }} />
                    {t.label}
                  </button>
                );
              })}
            </div>

            <div style={{ padding: 28 }} className="transition-opacity duration-200">
              <h3 className="text-[20px] md:text-[24px] font-bold text-[#0d2b2b]" style={barlow}>
                {current.title}
              </h3>
              <p className="mt-3 text-[15px] leading-[1.7] text-[#4a5568]">{current.intro}</p>
              <ul className="mt-5 space-y-2">
                {current.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-[14px] leading-[1.6] text-[#4a5568]">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-[#2abfbf]" />
                    {b}
                  </li>
                ))}
              </ul>
              <Link
                to={current.to}
                className="btn-quote mt-7 inline-block px-8 py-3 text-[13px] uppercase tracking-wider"
              >
                {current.cta}
              </Link>
            </div>
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