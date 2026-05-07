import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";

const coverages = [
  "General Liability",
  "Workers' Compensation",
  "Business Auto",
  "Cyber Liability",
  "Liquor Liability",
  "Human Resource Technology",
  "Commercial Property Insurance",
  "Employment Practices Liability",
  "Errors & Omissions (E&O) Insurance",
  "Fiduciary Liability",
  "Coastal Property Insurance",
  "Business Owner's Policy (BOP)",
  "Excess Liability / Umbrella",
  "Directors & Officers (D&O) Insurance",
  "Garagekeepers Liability",
  "Group Health",
];

const markets = [
  "Agriculture", "Distribution", "Hospitality", "Manufacturing", "Retail",
  "Automotive", "Food & Beverage", "Industrial", "Oil & Gas",
  "Telecommunications", "Construction", "Healthcare", "Logistics",
  "Professional", "Transportation",
];

const HERO_IMG =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80";

const H2 = "text-[24px] md:text-[26px] font-bold text-[#0d2b2b] leading-tight mb-4";
const P = "text-[16px] leading-[1.75] text-[#4a5568]";

const CommercialInsurance = () => {
  return (
    <main className="min-h-screen bg-white font-['Inter',sans-serif]">
      <SEO title="Commercial Business Insurance Illinois | Custom Insurance Agency" description="Comprehensive commercial insurance for businesses in Illinois & Indiana. General liability, workers comp, business auto, cyber liability & more. Call 708-810-1955." />
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
          Commercial Insurance
        </h1>
      </section>

      <div className="mx-auto w-full max-w-[900px] px-6 py-[60px] md:px-12">
        {/* Section 1 */}
        <section>
          <h2 className={H2}>
            Allow Custom Insurance Agency to Help Keep Your Business up and Running.
          </h2>
          <p className={P}>
            Custom Insurance Agency is proud to support our local business community. We've served as a true partner in meeting the goals of businesses that contribute to the economy right here at home, providing our neighbors with not only outstanding services but also job opportunities.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mt-[60px]">
          <h2 className={H2}>It's Our Business to Protect Your Business</h2>
          <p className={P}>
            Business insurance can be a complicated concept, so it is important to have an independent agency on your side that has access to multiple carriers and can add value to your insurance needs. Although we understand that every business has its own unique requirements, most business insurance packages include:
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {coverages.map((c) => (
              <div
                key={c}
                className="rounded-xl border-l-4 border-[#3eaa6d] bg-[#f5f7fa] px-5 py-4 text-[15px] font-semibold text-[#0d2b2b] shadow-sm transition hover:shadow-md"
              >
                {c}
              </div>
            ))}
          </div>
        </section>

        {/* Section 3 */}
        <section className="mt-[60px]">
          <h2 className={H2}>Commercial Insurance</h2>
          <p className={P}>
            Custom Insurance Agency is your go-to source for finding the best business coverage for your business at the lowest price. We have a multitude of insurance coverage options available to meet the needs of each individual business. Our diverse customer base includes businesses across the United States. Whether you are looking for a general Business Owner's Policy (BOP) to cover your property and general liability or just looking to get a better understanding of how to manage your risk, make Custom Insurance Agency your only call today.
          </p>
          <p className="mt-8 text-[13px] font-semibold uppercase tracking-[2px] text-[#3eaa6d]">
            Our Markets
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {markets.map((m) => (
              <span
                key={m}
                className="rounded-full bg-[#e8f5ee] px-4 py-1.5 text-[14px] font-medium text-[#3eaa6d]"
              >
                {m}
              </span>
            ))}
          </div>
        </section>

        {/* Section 4 */}
        <section className="mt-[60px]">
          <h2 className={H2}>Personal Insurance</h2>
          <p className={P}>
            Custom Insurance Agency consumer insurance specialists are here to meet the needs of all your personal property & casualty insurance needs. We can offer coverage for personal auto, homeowner's, renter's, or condo insurance for your residence. In addition, we also offer many different types of supplementary coverage such as flood or earthquake. Our capabilities extend to any type of personal or recreational vehicle. These coverages include but are not limited to: auto, motorcycle, motor home, boat or marine, and personal watercraft. If you are in the market for a personal umbrella policy, Custom Insurance Agency is your go-to source.
          </p>
        </section>
      </div>

      {/* CTA */}
      <section className="bg-[#0d2b2b] px-6 py-20 text-center md:px-12">
        <h2 className="text-[28px] md:text-[36px] font-bold text-white">
          Get Your Commercial Insurance Quote Now
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

export default CommercialInsurance;