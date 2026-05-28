import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, X, Car, Building2, ClipboardList, Truck, Package, Shield, HardHat, Umbrella, type LucideIcon } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import resourcesHero from "@/assets/resources-hero.jpg";

const HERO_IMG = resourcesHero;

const barlow = { fontFamily: "'Barlow', sans-serif" };

const guides = [
  {
    icon: "🚛",
    title: "Trucking Insurance Guide",
    text: "Everything you need to know about commercial trucking insurance — from auto liability to cargo coverage and beyond.",
  },
  {
    icon: "🏢",
    title: "Business Insurance Basics",
    text: "A complete overview of business insurance types, what they cover, and how to choose the right policy for your company.",
  },
  {
    icon: "📋",
    title: "Understanding Your Policy",
    text: "Learn how to read and understand your insurance policy, including key terms, exclusions, and coverage limits.",
  },
  {
    icon: "⚖️",
    title: "DOT Compliance Guide",
    text: "Stay compliant with FMCSA regulations. Our guide covers CSA scores, safety ratings, and how to maintain good standing.",
  },
  {
    icon: "💡",
    title: "Risk Management Tips",
    text: "Practical tips for reducing risk in your transportation operation and keeping your insurance premiums as low as possible.",
  },
  {
    icon: "📊",
    title: "Insurance Cost Factors",
    text: "Learn what factors affect your insurance premiums and what you can do to get the best rate for your coverage needs.",
  },
];

const faqs = [
  {
    q: "How much does trucking insurance cost?",
    a: "The cost of trucking insurance varies depending on several factors including the type of cargo you haul, your driving record, years of experience, the value of your equipment, and the coverage limits you choose. Contact us for a free personalized quote.",
  },
  {
    q: "What is the difference between auto liability and physical damage coverage?",
    a: "Auto liability covers damage or injury you cause to others in an accident. Physical damage coverage covers damage to your own vehicle from collisions, theft, fire, or other covered events.",
  },
  {
    q: "Do I need cargo insurance?",
    a: "If you haul freight for others, cargo insurance is typically required by shippers and brokers. It protects the value of the goods you are transporting in case of damage, theft, or loss.",
  },
  {
    q: "What is non-trucking liability (bobtail insurance)?",
    a: "Non-trucking liability, also known as bobtail insurance, covers your truck when it is being driven for personal use — not under dispatch. It fills the gap when your primary trucking policy does not apply.",
  },
  {
    q: "How do I lower my insurance premiums?",
    a: "You can lower your premiums by maintaining a clean driving record, investing in safety technology, completing safety training programs, maintaining good CSA scores, and working with an independent agent like Custom Insurance Agency who can shop multiple carriers for the best rate.",
  },
  {
    q: "What documents do I need to get a quote?",
    a: "To get an accurate quote you will typically need your DOT number, MC number, driver information (license, date of birth, years of experience), vehicle information (year, make, model, VIN), and your current insurance policy if you have one.",
  },
  {
    q: "How long does it take to get coverage?",
    a: "In most cases we can get you covered within 24-48 hours. For standard commercial auto policies, same-day coverage is often possible. Contact us and we will work to get you covered as quickly as possible.",
  },
  {
    q: "What states do you cover?",
    a: "Custom Insurance Agency is licensed to write insurance in Illinois and Indiana, and we work with carriers that provide coverage across the United States and into Canada and Mexico for qualifying trucking operations.",
  },
];

const glossary = [
  ["Auto Liability", "Covers bodily injury and property damage you cause to others in an accident."],
  ["Physical Damage", "Covers damage to your own vehicle from collision, theft, fire, or other covered events."],
  ["Motor Truck Cargo", "Covers the freight or commodity being transported in case of damage or loss."],
  ["General Liability", "Covers bodily injury and property damage claims that occur at your business premises."],
  ["Bobtail / Non-Trucking Liability", "Covers your truck during personal use when not under dispatch."],
  ["Deductible", "The amount you pay out of pocket before your insurance coverage kicks in."],
  ["Premium", "The amount you pay for your insurance policy, typically monthly or annually."],
  ["CSA Score", "Compliance, Safety, Accountability score used by FMCSA to measure carrier safety performance."],
  ["DOT Number", "A unique identifier issued by the FMCSA to commercial vehicles operating in interstate commerce."],
  ["MC Number", "Motor Carrier number required for carriers transporting regulated commodities for hire."],
];

const Resources = () => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <main
      className="min-h-screen bg-white font-['Inter',sans-serif]"
    >
      <SEO
        title="Insurance Resources & Guides | Custom Insurance Agency"
        description="Free insurance guides, FAQ, and glossary from Custom Insurance Agency. Learn about trucking insurance, DOT compliance, CSA scores, and more."
      />
      <Navbar />

      {/* HERO */}
      <section
        className="relative flex h-[220px] md:h-[300px] w-full items-center justify-center pt-16"
        style={{ backgroundImage: `url(${HERO_IMG})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.55)" }} />
        <div className="relative z-10 px-6 text-center text-white">
          <h1 style={{ ...barlow, fontWeight: 700, fontSize: "clamp(36px, 6vw, 52px)", lineHeight: 1.1 }}>Resources</h1>
          <p className="mt-2 text-[15px] md:text-[18px] text-white/85" style={{ ...barlow, fontWeight: 500 }}>
            Tools and information to help you make better insurance decisions
          </p>
        </div>
      </section>

      {/* GUIDES — Lines of Coverage */}
      <section className="relative px-6 pb-4 pt-1 md:pb-6 md:pt-2" style={{ zIndex: 1 }}>
        <div className="mx-auto w-full max-w-[1200px]">
          <p className="text-[11px] font-semibold uppercase tracking-[2px] text-[#2abfbf]" style={{ ...barlow, marginTop: 0 }}>
            Lines of Coverage
          </p>
          <h2 className="mt-1 text-[22px] md:text-[32px] font-bold text-white leading-tight" style={{ ...barlow, marginBottom: 16 }}>
            Get Coverage Today
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" style={{ alignItems: "stretch", marginBottom: 48 }}>
            {([
              { Icon: Truck, title: "Auto Liability", desc: "Commercial auto liability coverage for your trucking operation. Protect your business from claims arising from accidents.", to: "/get-a-quote" },
              { Icon: Package, title: "Motor Truck Cargo", desc: "Coverage for freight and cargo you haul. Protect your loads against damage, theft, and loss in transit.", to: "/get-a-quote" },
              { Icon: Shield, title: "Physical Damage & Non-Trucking Liability", desc: "Protect your trucks and trailers from physical damage, and cover non-trucking use liability gaps.", to: "/pd-ntl-application" },
              { Icon: HardHat, title: "Occupational Accident Coverage (OCC/ACC)", desc: "Occupational accident and accidental coverage for owner-operators and independent contractors.", to: "/occ-accident-enrollment" },
              { Icon: Building2, title: "General Liability Insurance", desc: "Protect your business from third-party claims of bodily injury, property damage, and personal injury.", to: "/get-a-quote" },
              { Icon: Umbrella, title: "Excess or Umbrella Insurance", desc: "Extra liability protection above your existing coverage limits for added peace of mind.", to: "/get-a-quote" },
            ] as { Icon: LucideIcon; title: string; desc: string; to: string }[]).map((c) => (
              <Link
                key={c.title}
                to={c.to}
                className="flex flex-col no-underline"
                style={{
                  border: "1px solid #e2e8f0",
                  borderTop: "3px solid #2abfbf",
                  borderRadius: 12,
                  padding: "18px 20px",
                  background: "#ffffff",
                  minHeight: 110,
                  textDecoration: "none",
                  position: "relative",
                  zIndex: 10,
                }}
              >
                <c.Icon className="w-6 h-6 text-[#2abfbf]" />
                <h3 className="mt-2 text-[18px] font-bold text-[#0d2b2b]" style={barlow}>
                  {c.title}
                </h3>
                <p className="mt-2 text-xs text-gray-500 leading-relaxed flex-1">{c.desc}</p>
                <span
                  className="mt-3 self-start whitespace-nowrap"
                  style={{
                    textAlign: "center",
                    background: "linear-gradient(135deg, #f5821f 0%, #f5c518 100%)",
                    color: "#ffffff",
                    fontFamily: "'Barlow', sans-serif",
                    fontWeight: 700,
                    fontSize: 14,
                    borderRadius: 50,
                    padding: "8px 24px",
                  }}
                >
                  Quote Now →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* NAV CARDS */}
      <section className="relative px-6 md:px-12" style={{ zIndex: 1 }}>
        <div className="mx-auto w-full max-w-[1200px]">
          <hr style={{ border: 0, borderTop: "1px solid #e2e8f0", margin: 0 }} />
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            style={{ alignItems: "stretch", marginTop: 40, marginBottom: 32 }}
          >
            {[
              { Icon: Car, title: "Personal Lines", desc: "Auto, Home, Health, Motorcycle, Boat, RV, Flood, Renters, and Snowmobile insurance quotes", to: "/personal-lines" },
              { Icon: Building2, title: "Commercial Lines", desc: "Business insurance quotes and commercial coverage options for your company", to: "/commercial-lines" },
              { Icon: ClipboardList, title: "Other Forms", desc: "Additional insurance forms, applications, and documentation", to: "/other-forms" },
            ].map(({ Icon, title, desc, to }) => (
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
                <Icon size={24} color="#2abfbf" />
                <h3 className="text-sm font-bold text-[#0d2b2b]" style={{ ...barlow, fontWeight: 700 }}>
                  {title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed flex-1">{desc}</p>
                <Link
                  to={to}
                  className="self-start no-underline"
                  style={{
                    width: "50%",
                    textAlign: "center",
                    background: "linear-gradient(135deg, #f5821f 0%, #f5c518 100%)",
                    color: "#ffffff",
                    fontFamily: "'Barlow', sans-serif",
                    fontWeight: 700,
                    fontSize: 14,
                    borderRadius: 50,
                    padding: "8px 24px",
                  }}
                >
                  {title === "Other Forms" ? "Explore →" : "GET A QUOTE →"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HELPFUL GUIDES */}
      <div className="relative mx-auto w-full max-w-[900px] px-6 pt-4 pb-8 md:px-12" style={{ zIndex: 1 }}>
        <hr style={{ border: 0, borderTop: "1px solid #e5e7eb", margin: "0 0 40px 0" }} />

        <p className="text-[11px] font-semibold uppercase tracking-[2px] text-[#2abfbf]" style={barlow}>
          Helpful Guides
        </p>
        <h2 className="mt-2 text-[22px] md:text-[28px] font-bold text-[#0d2b2b] leading-tight" style={barlow}>
          Insurance Resources & Guides
        </h2>
        <p className="mt-2 text-[14px] leading-[1.6] text-[#4a5568]">
          Whether you are a first-time insurance buyer or an experienced fleet owner, our resource library has
          everything you need to make informed decisions about your coverage.
        </p>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {guides.map((g) => (
            <div
              key={g.title}
              className="rounded-2xl p-7 transition hover:-translate-y-0.5"
              style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderTop: "3px solid #2abfbf",
                position: "relative",
                zIndex: 10,
              }}
            >
              <div className="text-[28px]">{g.icon}</div>
              <h3 className="mt-2 text-[16px] font-bold text-[#0d2b2b]" style={barlow}>
                {g.title}
              </h3>
              <p className="mt-2 text-[13px] leading-[1.55] text-[#4a5568]">{g.text}</p>
              <a href="#" className="mt-3 inline-block text-[13px] font-semibold text-[#2abfbf] hover:underline">
                Read Guide →
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <section className="relative px-6 py-8 md:px-12" style={{ zIndex: 1 }}>
        <div className="mx-auto max-w-[900px]">
          <p className="text-[11px] font-semibold uppercase tracking-[2px] text-[#2abfbf]" style={barlow}>
            FAQ
          </p>
          <h2 className="mt-2 text-[22px] md:text-[28px] font-bold text-[#0d2b2b] leading-tight" style={barlow}>
            Frequently Asked Questions
          </h2>
          <div className="mt-5 space-y-3">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={i}
                  className="overflow-hidden rounded-xl"
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    position: "relative",
                    zIndex: 10,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-[16px] font-semibold text-[#0d2b2b]" style={barlow}>
                      {f.q}
                    </span>
                    <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-[#2abfbf] text-white">
                      {isOpen ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="border-t border-[#e5e7eb] px-5 py-4 text-[14px] leading-[1.7] text-[#4a5568]">
                      {f.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* GLOSSARY */}
      <section className="relative px-6 py-8 md:px-12" style={{ zIndex: 1 }}>
        <div className="mx-auto max-w-[900px]">
          <p className="text-[11px] font-semibold uppercase tracking-[2px] text-[#2abfbf]" style={barlow}>
            Glossary
          </p>
          <h2 className="mt-2 text-[22px] md:text-[28px] font-bold text-[#0d2b2b] leading-tight" style={barlow}>
            Insurance Terms Glossary
          </h2>
          <p className="mt-2 text-[14px] leading-[1.6] text-[#4a5568]">
            Not sure what a term means? Here is a quick reference guide to common insurance terminology.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {glossary.map(([term, def]) => (
              <div
                key={term}
                className="rounded-xl p-5"
                style={{
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  position: "relative",
                  zIndex: 10,
                }}
              >
                <h4 className="text-[15px] font-bold text-[#0d2b2b]" style={barlow}>
                  {term}
                </h4>
                <p className="mt-2 text-[13px] leading-[1.6] text-[#4a5568]">{def}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-6 py-10 text-center md:px-12" style={{ zIndex: 1 }}>
        <h2 className="text-[24px] md:text-[28px] font-bold text-[#0d2b2b]" style={barlow}>
          Still Have Questions?
        </h2>
        <p className="mx-auto mt-2 max-w-[640px] text-[14px] text-[#4a5568]">
          Our agents are ready to help you find the right coverage.
        </p>
        <Link to="/get-a-quote" className="btn-quote mt-5 inline-block px-10 py-3 text-[14px] uppercase tracking-wider">
          Get a Quote
        </Link>
      </section>

      <Footer />
    </main>
  );
};

export default Resources;
