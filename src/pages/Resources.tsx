import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, X } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import resourcesHero from "@/assets/resources-hero.jpg";

const HERO_IMG = resourcesHero;
const barlow = { fontFamily: "'Barlow', sans-serif" };

const guides = [
  { icon: "🚛", title: "Trucking Insurance Guide", text: "Everything you need to know about commercial trucking insurance — from auto liability to cargo coverage and beyond." },
  { icon: "🏢", title: "Business Insurance Basics", text: "A complete overview of business insurance types, what they cover, and how to choose the right policy for your company." },
  { icon: "📋", title: "Understanding Your Policy", text: "Learn how to read and understand your insurance policy, including key terms, exclusions, and coverage limits." },
  { icon: "⚖️", title: "DOT Compliance Guide", text: "Stay compliant with FMCSA regulations. Our guide covers CSA scores, safety ratings, and how to maintain good standing." },
  { icon: "💡", title: "Risk Management Tips", text: "Practical tips for reducing risk in your transportation operation and keeping your insurance premiums as low as possible." },
  { icon: "📊", title: "Insurance Cost Factors", text: "Learn what factors affect your insurance premiums and what you can do to get the best rate for your coverage needs." },
];

const faqs = [
  { q: "How much does trucking insurance cost?", a: "The cost of trucking insurance varies depending on several factors including the type of cargo you haul, your driving record, years of experience, the value of your equipment, and the coverage limits you choose. Contact us for a free personalized quote." },
  { q: "What is the difference between auto liability and physical damage coverage?", a: "Auto liability covers damage or injury you cause to others in an accident. Physical damage coverage covers damage to your own vehicle from collisions, theft, fire, or other covered events." },
  { q: "Do I need cargo insurance?", a: "If you haul freight for others, cargo insurance is typically required by shippers and brokers. It protects the value of the goods you are transporting in case of damage, theft, or loss." },
  { q: "What is non-trucking liability (bobtail insurance)?", a: "Non-trucking liability, also known as bobtail insurance, covers your truck when it is being driven for personal use — not under dispatch. It fills the gap when your primary trucking policy does not apply." },
  { q: "How do I lower my insurance premiums?", a: "You can lower your premiums by maintaining a clean driving record, investing in safety technology, completing safety training programs, maintaining good CSA scores, and working with an independent agent like Custom Insurance Agency who can shop multiple carriers for the best rate." },
  { q: "What documents do I need to get a quote?", a: "To get an accurate quote you will typically need your DOT number, MC number, driver information (license, date of birth, years of experience), vehicle information (year, make, model, VIN), and your current insurance policy if you have one." },
  { q: "How long does it take to get coverage?", a: "In most cases we can get you covered within 24-48 hours. For standard commercial auto policies, same-day coverage is often possible. Contact us and we will work to get you covered as quickly as possible." },
  { q: "What states do you cover?", a: "Custom Insurance Agency is licensed to write insurance in Illinois and Indiana, and we work with carriers that provide coverage across the United States and into Canada and Mexico for qualifying trucking operations." },
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
    <main className="min-h-screen bg-white font-['Inter',sans-serif]">
      <SEO title="Insurance Resources & Guides | Custom Insurance Agency" description="Free insurance guides, FAQ, and glossary from Custom Insurance Agency. Learn about trucking insurance, DOT compliance, CSA scores, and more." />
      <Navbar />

      {/* HERO */}
      <section
        className="relative flex w-full flex-col items-center justify-center pt-16 [background-attachment:scroll] md:[background-attachment:fixed]"
        style={{
          minHeight: "300px",
          backgroundImage: `url(${HERO_IMG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.6)" }} />
        <div className="relative z-10 px-6 text-center text-white">
          <h1 style={{ ...barlow, fontWeight: 700, fontSize: "52px", lineHeight: 1.1 }}>Resources</h1>
          <p className="mt-2 text-[18px] text-white/85" style={{ ...barlow, fontWeight: 500 }}>
            Tools and information to help you make better insurance decisions
          </p>
        </div>
      </section>

      {/* GUIDES */}
      <section className="bg-white px-6 pb-16" style={{ paddingTop: 40 }}>
        <div className="mx-auto w-full max-w-[1200px]">
          <p className="text-[11px] font-semibold uppercase text-[#2abfbf]" style={{ letterSpacing: "0.12em" }}>
            Lines of Coverage
          </p>
          <h2 className="mt-2 text-[32px] font-bold text-[#0d2b2b] leading-tight" style={{ ...barlow, marginBottom: 40 }}>
            Get Coverage Today
          </h2>

          <div className="grid gap-6 grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3">
            {[
              { title: "Auto Liability", to: "/get-a-quote" },
              { title: "Motor Truck Cargo", to: "/get-a-quote" },
              { title: "Physical Damage & Non-Trucking Liability", to: "/pd-ntl-application" },
              { title: "Occupational Accident Coverage (OCC/ACC)", to: "/occ-accident-enrollment" },
              { title: "General Liability Insurance", to: "/get-a-quote" },
              { title: "Excess or Umbrella Insurance", to: "/get-a-quote" },
            ].map((c) => (
              <Link
                key={c.title}
                to={c.to}
                className="flex flex-col justify-between no-underline"
                style={{
                  borderLeft: "4px solid #1f4d7a",
                  border: "1px solid #e5e7eb",
                  borderLeftWidth: 4,
                  borderLeftColor: "#1f4d7a",
                  borderRadius: 10,
                  padding: "28px 24px",
                  background: "#ffffff",
                  minHeight: 140,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  textDecoration: "none",
                }}
              >
                <h3 className="text-[18px] font-bold text-[#0d2b2b]" style={barlow}>{c.title}</h3>
                <span
                  className="mt-4"
                  style={{
                    alignSelf: "flex-start",
                    background: "linear-gradient(135deg, #f5821f 0%, #f5c518 100%)",
                    color: "#1a1a1a",
                    fontFamily: "'Barlow', sans-serif",
                    fontWeight: 700,
                    fontSize: 14,
                    borderRadius: 50,
                    padding: "10px 28px",
                  }}
                >
                  Quote Now →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* GUIDES */}
      <div className="mx-auto w-full max-w-[900px] px-6 py-[60px] md:px-12">
        <p className="text-[11px] font-semibold uppercase tracking-[2px] text-[#2abfbf]" style={barlow}>Helpful Guides</p>
        <h2 className="mt-2 text-[32px] font-bold text-[#0d2b2b] leading-tight" style={barlow}>Insurance Resources & Guides</h2>
        <p className="mt-4 text-[16px] leading-[1.75] text-[#4a5568]">
          Whether you are a first-time insurance buyer or an experienced fleet owner, our resource library has everything you need to make informed decisions about your coverage.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {guides.map((g) => (
            <div
              key={g.title}
              className="group rounded-2xl border border-[#e2e8f0] bg-white p-7 transition hover:-translate-y-0.5 hover:shadow-lg"
              style={{ borderTop: "3px solid transparent" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderTop = "3px solid #3eaa6d")}
              onMouseLeave={(e) => (e.currentTarget.style.borderTop = "3px solid transparent")}
            >
              <div className="text-[32px]">{g.icon}</div>
              <h3 className="mt-3 text-[18px] font-bold text-[#0d2b2b]" style={barlow}>{g.title}</h3>
              <p className="mt-3 text-[14px] leading-[1.7] text-[#4a5568]">{g.text}</p>
              <a href="#" className="mt-4 inline-block text-[14px] font-semibold text-[#3eaa6d] hover:underline">Read Guide →</a>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <section className="bg-[#f5f7fa] px-6 py-[60px] md:px-12">
        <div className="mx-auto max-w-[900px]">
          <p className="text-[11px] font-semibold uppercase tracking-[2px] text-[#2abfbf]" style={barlow}>FAQ</p>
          <h2 className="mt-2 text-[32px] font-bold text-[#0d2b2b] leading-tight" style={barlow}>Frequently Asked Questions</h2>

          <div className="mt-8 space-y-3">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={i} className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-[16px] font-semibold text-[#0d2b2b]" style={barlow}>{f.q}</span>
                    <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-[#3eaa6d] text-white">
                      {isOpen ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="border-t border-[#e2e8f0] px-5 py-4 text-[14px] leading-[1.7] text-[#4a5568]">
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
      <section className="bg-white px-6 py-[60px] md:px-12">
        <div className="mx-auto max-w-[900px]">
          <p className="text-[11px] font-semibold uppercase tracking-[2px] text-[#2abfbf]" style={barlow}>Glossary</p>
          <h2 className="mt-2 text-[32px] font-bold text-[#0d2b2b] leading-tight" style={barlow}>Insurance Terms Glossary</h2>
          <p className="mt-4 text-[16px] leading-[1.75] text-[#4a5568]">
            Not sure what a term means? Here is a quick reference guide to common insurance terminology.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {glossary.map(([term, def]) => (
              <div key={term} className="rounded-xl bg-[#f5f7fa] p-5">
                <h4 className="text-[15px] font-bold text-[#0d2b2b]" style={barlow}>{term}</h4>
                <p className="mt-2 text-[13px] leading-[1.6] text-[#4a5568]">{def}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-dark-gradient px-6 py-[60px] text-center md:px-12">
        <h2 className="text-[32px] font-bold text-white" style={barlow}>Still Have Questions?</h2>
        <p className="mx-auto mt-4 max-w-[640px] text-[16px] text-white/60">
          Our agents are ready to help you find the right coverage.
        </p>
        <Link to="/get-a-quote" className="btn-quote mt-8 inline-block px-10 py-4 text-[14px] uppercase tracking-wider">
          Get a Quote
        </Link>
      </section>

      <Footer />
    </main>
  );
};

export default Resources;
