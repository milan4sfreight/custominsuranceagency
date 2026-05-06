import { Link } from "react-router-dom";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";

const solutions = [
  {
    icon: "🛡️",
    title: "Safety Consulting",
    desc: "Our safety consultants work directly with your team to identify risks, implement best practices, and develop comprehensive safety programs tailored to your operation.",
  },
  {
    icon: "📊",
    title: "CSA Score Improvement",
    desc: "We help you understand your CSA SMS scores and develop actionable strategies to improve them, keeping your fleet compliant and your insurance costs down.",
  },
  {
    icon: "📋",
    title: "DOT Compliance",
    desc: "Stay ahead of FMCSA regulations with our dedicated DOT compliance expertise. We provide resources, audits, and ongoing support to keep your operation compliant.",
  },
  {
    icon: "🚛",
    title: "Driver Safety Programs",
    desc: "Comprehensive driver training and monitoring programs designed to reduce accidents, violations, and claims across your fleet.",
  },
  {
    icon: "🔍",
    title: "Fleet Risk Assessment",
    desc: "Thorough assessment of your fleet operations to identify vulnerabilities and implement risk mitigation strategies before incidents occur.",
  },
  {
    icon: "📁",
    title: "Claims Management",
    desc: "Expert guidance through the claims process to ensure fair settlements and minimize the impact of incidents on your business and insurance premiums.",
  },
];

const stats = [
  { num: "40%", text: "Average reduction in claims with proper risk management programs" },
  { num: "CSA", text: "Scores directly impact your insurance rates and operating authority" },
  { num: "24/7", text: "Ongoing compliance monitoring to keep your fleet protected" },
];

const HERO_IMG =
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=2000&q=80";

const H2 = "text-[24px] md:text-[26px] font-bold text-[#0b1530] leading-tight mb-4";
const P = "text-[16px] leading-[1.75] text-[#4a5568]";

const RiskManagement = () => {
  return (
    <main className="min-h-screen bg-white font-['DM_Sans',sans-serif]">
      <Navbar />

      {/* HERO */}
      <section
        className="relative flex h-[350px] w-full items-center justify-center pt-16"
        style={{
          backgroundImage: `url(${HERO_IMG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.55)" }} />
        <h1 className="relative z-10 text-center text-white font-bold text-[36px] md:text-[52px]">
          Risk Management
        </h1>
      </section>

      <div className="mx-auto w-full max-w-[900px] px-6 py-[60px] md:px-12">
        {/* Section 1 */}
        <section>
          <h2 className={H2}>Transportation Risk Management</h2>
          <p className={P}>
            Custom Insurance Agency offers a full suite of risk management solutions aimed at helping our clients continually improve their safety and compliance programs. FMCSA has rolled out new changes to their CSA SMS methodology recently and it is imperative that fleets and owner-operators alike understand these changes.
          </p>
          <p className={`${P} mt-4`}>
            In addition, many trucking companies are unfamiliar with how SMS actually works and their ability to impact their scores through implementation of best practices. Custom Insurance Agency has dedicated DOT compliance expertise on staff and can help not only educate motor carriers, but assist in providing resources and feedback that can positively impact your safety scores and more importantly make your operations safer.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mt-[60px]">
          <p className="text-[13px] font-semibold uppercase tracking-[2px] text-[#1a6dd4]">
            What We Offer
          </p>
          <h2 className={`${H2} mt-2`}>Our Risk Management Solutions</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {solutions.map((s) => (
              <div
                key={s.title}
                className="rounded-2xl border border-[#e2e8f0] border-t-[3px] border-t-[#1a6dd4] bg-white p-8 transition hover:shadow-md"
              >
                <div className="text-[32px]">{s.icon}</div>
                <h3 className="mt-3 text-[20px] font-bold text-[#0b1530]">{s.title}</h3>
                <p className="mt-3 text-[15px] leading-[1.75] text-[#4a5568]">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3 */}
        <section className="mt-[60px]">
          <h2 className={H2}>Why Risk Management Matters</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {stats.map((s) => (
              <div
                key={s.num}
                className="rounded-2xl bg-[#1a6dd4] p-8 text-center text-white"
              >
                <div className="text-[44px] font-bold leading-none">{s.num}</div>
                <p className="mt-4 text-[15px] leading-[1.6] text-white/90">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4 */}
        <section className="mt-[60px]">
          <h2 className={H2}>Our Approach</h2>
          <p className={P}>
            At Custom Insurance Agency, we believe that the best insurance policy is one you never have to use. That's why we take a proactive approach to risk management, working alongside our clients to build safer operations from the ground up. Our team combines deep industry knowledge with practical experience to deliver solutions that make a real difference.
          </p>
        </section>
      </div>

      {/* CTA */}
      <section className="bg-[#0b1530] px-6 py-20 text-center md:px-12">
        <h2 className="text-[28px] md:text-[36px] font-bold text-white">
          Ready to Improve Your Risk Profile?
        </h2>
        <p className="mx-auto mt-4 max-w-[640px] text-[18px] text-white/60">
          Contact us today to learn how our risk management solutions can protect your business and reduce your insurance costs.
        </p>
        <Link
          to="/get-a-quote"
          className="mt-8 inline-block rounded-full bg-[#1a6dd4] px-10 py-4 text-[14px] font-bold uppercase tracking-wider text-white transition hover:bg-[#1a6dd4]/90"
        >
          Get a Quote
        </Link>
      </section>

      <Footer />
    </main>
  );
};

export default RiskManagement;