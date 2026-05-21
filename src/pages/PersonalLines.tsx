import { useState } from "react";
import { Link } from "react-router-dom";
import { Car, Home, HeartPulse, Shield } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import resourcesHero from "@/assets/resources-hero.jpg";

const HERO_IMG = resourcesHero;
const barlow = { fontFamily: "'Barlow', sans-serif" };

const tabs = [
  {
    key: "auto",
    label: "Auto Insurance",
    icon: Car,
    title: "Auto Insurance",
    intro:
      "Protect yourself and your vehicle with comprehensive personal auto coverage tailored to your driving needs and budget.",
    bullets: [
      "Liability coverage for bodily injury and property damage",
      "Collision and comprehensive protection",
      "Uninsured / underinsured motorist coverage",
      "Medical payments and personal injury protection",
      "Roadside assistance and rental reimbursement",
    ],
  },
  {
    key: "home",
    label: "Home Insurance",
    icon: Home,
    title: "Home Insurance",
    intro:
      "Safeguard your home, belongings, and family with homeowners insurance that fits your property and lifestyle.",
    bullets: [
      "Dwelling and other structures coverage",
      "Personal property protection",
      "Personal liability and medical payments",
      "Loss of use / additional living expenses",
      "Optional flood, earthquake, and umbrella endorsements",
    ],
  },
  {
    key: "health",
    label: "Health Insurance",
    icon: HeartPulse,
    title: "Health Insurance",
    intro:
      "Find the right health plan for you and your family from leading carriers — individual, family, and short-term options.",
    bullets: [
      "Individual and family medical plans",
      "Short-term and supplemental coverage",
      "Dental and vision options",
      "ACA-compliant marketplace plans",
      "Guidance choosing networks, deductibles, and premiums",
    ],
  },
  {
    key: "life",
    label: "Life Insurance",
    icon: Shield,
    title: "Life Insurance",
    intro:
      "Provide lasting financial security for your loved ones with term, whole, or universal life insurance options.",
    bullets: [
      "Term life insurance",
      "Whole and universal life policies",
      "Final expense and burial coverage",
      "Disability income protection",
      "Estate planning and beneficiary guidance",
    ],
  },
];

const PersonalLines = () => {
  const [active, setActive] = useState(tabs[0].key);
  const current = tabs.find((t) => t.key === active) ?? tabs[0];

  return (
    <main className="min-h-screen bg-white font-['Inter',sans-serif]">
      <SEO
        title="Personal Lines Insurance | Custom Insurance Agency"
        description="Personal insurance from Custom Insurance Agency — auto, home, health, and life insurance for individuals and families in Illinois, Indiana, and beyond."
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
            Personal Lines
          </h1>
          <p className="mt-2 text-[15px] md:text-[18px] text-white/85" style={{ ...barlow, fontWeight: 500 }}>
            Coverage for the people, places, and things that matter most
          </p>
        </div>
      </section>

      {/* TABS */}
      <section className="relative px-6 py-10 md:px-12" style={{ zIndex: 1 }}>
        <div className="mx-auto max-w-[1000px]">
          <p className="text-[11px] font-semibold uppercase tracking-[2px] text-[#2abfbf]" style={barlow}>
            Personal Insurance
          </p>
          <h2 className="mt-2 text-[22px] md:text-[28px] font-bold text-[#0d2b2b] leading-tight" style={barlow}>
            Explore Our Personal Lines Coverage
          </h2>
          <p className="mt-2 text-[14px] leading-[1.6] text-[#4a5568]">
            Choose a category below to learn more about what we offer.
          </p>

          {/* Tab buttons */}
          <div className="mt-6 flex flex-wrap gap-2 border-b border-[#e5e7eb]">
            {tabs.map((t) => {
              const Icon = t.icon;
              const isActive = t.key === active;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setActive(t.key)}
                  className="inline-flex items-center gap-2 px-4 py-3 text-[14px] font-semibold transition-colors"
                  style={{
                    ...barlow,
                    color: isActive ? "#0d2b2b" : "#4a5568",
                    borderBottom: isActive ? "3px solid #2abfbf" : "3px solid transparent",
                    marginBottom: -1,
                  }}
                >
                  <Icon className="h-4 w-4" />
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div
            className="mt-6 rounded-2xl p-7 md:p-9"
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderTop: "3px solid #2abfbf",
              position: "relative",
              zIndex: 10,
            }}
          >
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
              to="/get-a-quote"
              className="btn-quote mt-7 inline-block px-8 py-3 text-[13px] uppercase tracking-wider"
            >
              Get a Quote →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-6 py-10 text-center md:px-12" style={{ zIndex: 1 }}>
        <h2 className="text-[24px] md:text-[28px] font-bold text-[#0d2b2b]" style={barlow}>
          Not Sure Which Coverage You Need?
        </h2>
        <p className="mx-auto mt-2 max-w-[640px] text-[14px] text-[#4a5568]">
          Our agents will help you find the right personal insurance for your life.
        </p>
        <Link to="/contact" className="btn-quote mt-5 inline-block px-10 py-3 text-[14px] uppercase tracking-wider">
          Contact Us
        </Link>
      </section>

      <Footer />
    </main>
  );
};

export default PersonalLines;