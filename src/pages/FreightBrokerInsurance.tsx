import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";

const otherCoverages = [
  "Auto Liability Coverages",
  "Shipper's Interest",
  "Cyber Liability for Freight Brokers",
  "Motor Truck Cargo Insurance",
  "Errors & Omissions (E&O) Insurance",
  "Workers' Compensation",
  "General Liability",
  "Freight Broker Surety Bonds – BMC-84",
];

const forwardingCards = [
  {
    title: "Cargo Legal",
    desc: "Insurance designed to cover legal fees and/or judgments against a freight forwarder.",
  },
  {
    title: "Contingent Auto Liability",
    desc: "Insurance coverage for freight forwarders designed to protect against liabilities from damages and/or defense cost in the event that a third-party (generally a trucking company) causes bodily injury or property damage.",
  },
  {
    title: "Errors & Omissions (E&O)",
    desc: "This insurance will help protect a freight forwarder from financial losses due to damages caused by errors and omissions.",
  },
  {
    title: "Excess & Umbrella",
    desc: "Excess insurance coverage is a policy that helps protect a freight forwarder when an underlying policy has been exhausted. Umbrella insurance coverage is a different type of excess policy and can be applied to multiple policies.",
  },
  {
    title: "Freight Forwarder's Shipper's Interest Cargo Insurance",
    desc: "This insurance allows freight forwarders to offer cargo insurance to their customers, designed to apply to freight that will move via international transit such as ocean or air.",
  },
  {
    title: "General Liability",
    desc: "Designed to protect against freight forwarding liability due to bodily injury or property damage for losses incurred.",
  },
];

const HERO_IMG =
  "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=2000&q=80";

const H2 = "text-[24px] md:text-[26px] font-bold text-[#0d2b2b] leading-tight mb-4";
const P = "text-[16px] leading-[1.75] text-[#4a5568]";

const FreightBrokerInsurance = () => {
  return (
    <main className="min-h-screen bg-white font-['Inter',sans-serif]">
      <SEO title="Freight Broker Insurance | Custom Insurance Agency" description="Specialized insurance for freight brokers and 3PLs. Contingent cargo, E&O, general liability, surety bonds & more. Independent agency with 50+ carriers." />
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
          Freight Broker Insurance
        </h1>
      </section>

      <div className="mx-auto w-full max-w-[900px] px-6 py-[60px] md:px-12">
        {/* Section 1 */}
        <section>
          <h2 className={H2}>
            Custom Insurance Agency is a leader in the freight broker and 3PL marketplace.
          </h2>
          <p className={P}>
            We understand the risk management challenges of operating a freight brokerage in today's marketplace. We have customized products to suit the needs of each individual 3PL.
          </p>
          <p className={`${P} mt-4`}>
            In addition, two of our executive team members can empathize with risk management challenges having previously served in leadership roles for two of America's largest freight brokers over the past decade.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mt-[60px]">
          <h2 className={H2}>Auto Liability Coverages</h2>
          <p className={P}>
            It is very important that you understand the differences between the types of coverages that are available for freight brokerages. There are several different types of liability coverage that can be purchased with respect to Auto Liability including Primary Auto Liability, Freight Broker Liability, and Contingent Auto Liability. It is important freight brokerages understand their exposure and additional risk that might have been accepted contractually.
          </p>
        </section>

        {/* Section 3 */}
        <section className="mt-[60px]">
          <h2 className={H2}>Motor Truck Cargo Options</h2>
          <p className={P}>
            Cargo claims can be very challenging for freight brokers. It is extremely important that 3PL's understand this risk. Contingent Motor Truck Cargo is typically the most basic of coverages and is often written as 'follow-form'. In this scenario, the exclusion in a motor carrier's can also mean there is an exclusion present in your own policy. It is important that freight brokers understand their risk and expectations from a customer's perspective. This often leads 3PL's to purchase broader forms that can provide coverage on a first dollar basis under legal liability or broad cargo forms.
          </p>
        </section>

        {/* Section 4 */}
        <section className="mt-[60px]">
          <h2 className={H2}>Other Lines & Coverages</h2>
          <p className={P}>
            Outside of the two coverages above, 3PL's should strongly consider purchasing several other lines of insurance to properly cover their operation:
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {otherCoverages.map((c) => (
              <div
                key={c}
                className="rounded-xl border-l-4 border-[#3eaa6d] bg-[#f5f7fa] px-5 py-4 text-[15px] font-semibold text-[#0d2b2b] shadow-sm transition hover:shadow-md"
              >
                {c}
              </div>
            ))}
          </div>
        </section>

        {/* Section 5 */}
        <section className="mt-[60px]">
          <h2 className={H2}>Freight Forwarding Insurance</h2>
          <div className="mt-2 flex flex-col gap-4">
            {forwardingCards.map((c) => (
              <div
                key={c.title}
                className="rounded-xl border border-[#e2e8f0] bg-white p-6"
              >
                <h3 className="text-[18px] font-bold text-[#0d2b2b]">{c.title}</h3>
                <p className="mt-2 text-[15px] leading-[1.75] text-[#4a5568]">
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* CTA */}
      <section className="bg-dark-gradient px-6 py-20 text-center md:px-12">
        <h2 className="text-[28px] md:text-[36px] font-bold text-white">
          Get Your Freight Broker Insurance Quote Now
        </h2>
        <Link
          to="/get-a-quote"
          className="btn-quote mt-8 inline-block px-10 py-4 text-[14px] uppercase tracking-wider"
        >
          Get a Quote
        </Link>
      </section>

      <Footer />
    </main>
  );
};

export default FreightBrokerInsurance;