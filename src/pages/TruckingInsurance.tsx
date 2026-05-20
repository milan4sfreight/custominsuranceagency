import truckingHero from "@/assets/getquote-hero.jpg";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";

const coverages = [
  "Auto Liability",
  "Motor Truck Cargo",
  "Physical Damage",
  "General Liability Insurance",
  "Excess or Umbrella Insurance",
  "Non-Trucking Liability & Bobtail Insurance",
  "Occupational Accident Coverage (OCC/ACC)",
];

const HERO_IMG = truckingHero;

const H2 = "text-[26px] font-bold text-[#0d2b2b] leading-tight";
const P = "mt-4 text-[16px] leading-[1.75] text-[#334155]";
const Eyebrow = "text-[13px] font-semibold uppercase tracking-[2px] text-[#3eaa6d]";

const TruckingInsurance = () => {
  return (
    <main className="min-h-screen bg-white font-['Inter',sans-serif]">
      <SEO
        title="Trucking Insurance Illinois | Custom Insurance Agency"
        description="Specialized trucking insurance for owner-operators and fleets in Illinois & Indiana. Auto liability, cargo, physical damage, occupational accident & more. Get a free quote."
      />
      <Navbar />

      {/* HERO */}
      <section
        className="relative flex h-[300px] w-full items-center justify-center pt-16"
        style={{
          backgroundImage: `url(${HERO_IMG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.55)" }} />
        <h1 className="relative z-10 text-center text-white font-bold text-[36px] md:text-[52px]">
          Trucking Insurance
        </h1>
      </section>

      {/* MAIN */}
      <div className="mx-auto w-full max-w-[900px] px-6 py-[60px] md:px-12">
        {/* Section 1 */}
        <section>
          <h2 className={H2}>
            Custom Insurance Agency Is A True Advisor To Professionals In The Transportation Industry.
          </h2>
          <p className={P}>
            At Custom Insurance Agency, we know transportation insurance. Whether you are a single owner-operator or a
            large fleet, we have specialty insurance programs designed with you in mind. We write truck, warehousing,
            and freight broker insurance in almost every US state and have specialty NAFTA trucking programs for
            carriers who require liability and cargo insurance in Canada and Mexico.
          </p>
          <p className={P}>
            We place the most comprehensive and ethical lines of insurance, safety, and risk management products for
            commercial transportation. We offer many exclusive or limited programs for niches such as: couriers, dump
            trucks and high-risk truck insurance, among others.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mt-14">
          <p className={Eyebrow}>Lines of Trucking Insurance Coverage</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {coverages.map((c) => (
              <div
                key={c}
                className="rounded-xl border-l-4 border-[#3eaa6d] bg-[#f1f5f9] px-5 py-5 text-[15px] font-semibold text-[#0d2b2b] shadow-sm transition hover:shadow-md"
              >
                {c}
              </div>
            ))}
          </div>
        </section>

        {/* Section 3 */}
        <section className="mt-14">
          <h2 className={H2}>Truck Insurance Programs</h2>
          <p className={P}>
            Custom Insurance Agency does not sell our product exclusively on price. We provide value-added benefits and
            are proud to have the industry's top customer service team.
          </p>
          <p className={P}>
            Custom Insurance Agency offers a multitude of insurance programs for trucking companies of all risk profiles
            including: new venture truck insurance, high-risk truck insurance, owner-operator programs. We also offer
            many niche insurance products focused around markets like: box trucks, bulk haulers, container haulers,
            couriers, dump operations, haz-mat carriers, hot-shots, LTL trucking companies, tow truck operations, and
            warehouse operations.
          </p>
        </section>

        {/* Section 4 */}
        <section className="mt-14">
          <h2 className={H2}>We Provide Total Coverage</h2>
          <p className={P}>
            We understand that as a business owner, you need to have protection for your trucks at all times. This is
            because mishaps can happen at any time. For this reason, it is necessary to get trucking insurance that
            covers risks such as fire, theft among others. Some areas are quite difficult to drive in. Despite your
            drivers being professionals, your trucks may suffer some damages. Our insurance provides coverage for such
            incidences in form of immediate repair and regular servicing. We also cover physical damages such as gap
            coverage, towing coverage, and the driver's personal effects. To ensure full satisfaction, we also provide
            medical benefits, non-trucking liability, and pollution buyback coverage.
          </p>
        </section>

        {/* Section 5 */}
        <section className="mt-14">
          <h2 className={H2}>Our Cost-Effective Policies</h2>
          <p className={P}>
            The cost of a truck insurance policy is a very important factor to consider. As such, we ensure that our
            policies are affordable for you. In this way, we make it possible for you to invest in multiple policies for
            maximum coverage. Our insurance officers understand that it is not a good idea to be insurance rich and cash
            poor. Therefore, we provide tailored coverage that fits your budget.
          </p>
        </section>

        {/* Section 6 */}
        <section className="mt-14">
          <h2 className={H2}>Categories of Comprehensive Trucking Insurance</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-[#e2e8f0] bg-white p-8">
              <h3 className="text-[20px] font-bold text-[#0d2b2b]">Basic Coverage</h3>
              <p className="mt-3 text-[15px] leading-[1.75] text-[#334155]">
                This is a category of commercial truck insurance that combines liability and collision coverage. At
                Custom Insurance Agency, we provide collision insurance to cover the cost of damage to the other car in
                case you get involved in a road accident where you were at fault. It also covers the damage to your own
                car. The liability insurance covers all damages to your car or its contents that is brought about by
                anything other than collision.
              </p>
            </div>
            <div className="rounded-2xl border border-[#e2e8f0] bg-white p-8">
              <h3 className="text-[20px] font-bold text-[#0d2b2b]">Specialized Coverage</h3>
              <p className="mt-3 text-[15px] leading-[1.75] text-[#334155]">
                Commercial trucks are sometimes used for special deliveries. You may want to deliver some goods on
                behalf of a customer. In such a situation, Specialized Coverage comes in handy. This type of insurance
                provides commercial auto liability. It covers your truck, cargo and bodily injuries which could occur to
                you or other people on the road. It also covers the loss of cargo and considers the type and value of
                your goods.
              </p>
            </div>
          </div>
        </section>

        {/* Section 7 */}
        <section className="mt-14">
          <h2 className={H2}>Our Premiums</h2>
          <p className={P}>
            Upon choosing one of our owner operator truck insurance policies, you can proceed to pay premiums. They need
            to be paid monthly in advance. The premiums are payable for the length of the insurance policy's lifetime.
            The cost of premiums that you will pay to service your insurance policy will depend on you or your driver's
            driving record.
          </p>
        </section>

        {/* Section 8 */}
        <section className="mt-14">
          <h2 className={H2}>Our Deductibles</h2>
          <p className={P}>
            The deductibles for our insurance policies vary in amount. They can range from $500 to $2,000. In the event
            of an accident, the deductible is the amount you pay out of pocket before your insurance coverage kicks in.
            Choosing a higher deductible typically lowers your premium, while a lower deductible means a higher premium
            but less out-of-pocket expense at claim time.
          </p>
        </section>

        {/* CTA */}
        <section className="mt-16 rounded-2xl bg-dark-gradient p-10 text-center text-white">
          <h3 className="text-[24px] font-bold">Ready to protect your trucking business?</h3>
          <p className="mt-3 text-white/80">Get a custom quote tailored to your operation.</p>
          <Link to="/get-a-quote" className="btn-quote mt-6 inline-block px-8 py-3 text-[15px]">
            Get a Quote
          </Link>
        </section>
      </div>

      <Footer />
    </main>
  );
};

export default TruckingInsurance;
