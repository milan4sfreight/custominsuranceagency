import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";

const whyCards = [
  { icon: "🏢", title: "Independent Agency", text: "As an independent agency we are not tied to any single insurance company. We work for you, shopping over 50 carriers to find the best coverage at the best price." },
  { icon: "🤝", title: "Personalized Service", text: "Our dedicated team treats every client like a neighbor. You get the personal touch of a local agent backed by the resources of national insurance carriers." },
  { icon: "💰", title: "Affordable Coverage", text: "We shop the market to find you the lowest price without sacrificing coverage. We can review your current policy and find savings you didn't know existed." },
  { icon: "🔒", title: "50+ Carrier Partners", text: "Access to over 50 regional and national insurance carriers means more options, more competitive rates, and coverage for virtually any insurance need." },
  { icon: "📍", title: "Local Expertise", text: "Based in La Grange Highlands, IL, we understand the unique insurance needs of Illinois and Indiana residents and businesses." },
  { icon: "⏰", title: "Extended Hours", text: "We offer extended office hours to serve you better. Our team is available when you need us — not just during standard business hours." },
];

const contactItems = [
  { icon: "📍", text: "882 62nd St, La Grange Highlands, IL 60525" },
  { icon: "📞", text: "708-810-1955" },
  { icon: "📠", text: "Fax: 708-810-1970" },
  { icon: "✉️", text: "info@custominsure.com" },
  { icon: "🕐", text: "Monday – Friday | 9:00 AM – 5:00 PM" },
];

const HERO_IMG =
  "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=2000&q=80";

const H2 = "text-[24px] md:text-[26px] font-bold text-[#0d2b2b] leading-tight mb-4";
const P = "text-[16px] leading-[1.75] text-[#4a5568]";

const About = () => {
  return (
    <main className="min-h-screen bg-white font-['Inter',sans-serif]">
      <SEO title="About Us | Custom Insurance Agency — La Grange Highlands, IL" description="Independent insurance agency serving Chicago area since day one. 50+ carrier partners, friendly local service, affordable coverage for IL & IN businesses and families." />
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
          About Us
        </h1>
      </section>

      {/* Section 1 */}
      <div className="mx-auto w-full max-w-[900px] px-6 py-[60px] md:px-12">
        <section>
          <h2 className={H2}>Your Trusted Independent Insurance Agency</h2>
          <p className={P}>
            Custom Insurance Agency is an independent insurance agency proudly serving the Chicago area and surrounding communities including La Grange, Burr Ridge, Hinsdale, and the greater Illinois and Indiana region. As an independent agency, we have partnerships with over 50 regional and national carriers to offer you the most comprehensive insurance products available.
          </p>
          <p className={`${P} mt-4`}>
            Our professional agents strive to provide you with the coverage you need at a price you can afford. This means we do the comparison shopping for you — saving you time and money while ensuring you have the right protection for your unique needs.
          </p>
        </section>
      </div>

      {/* Section 2 — Mission */}
      <section className="bg-[#f0f6ff] px-6 py-[60px] md:px-12">
        <div className="mx-auto max-w-[700px] text-center">
          <div className="text-[80px] leading-none text-[#3eaa6d] font-serif">"</div>
          <h2 className="text-[28px] font-bold text-[#0d2b2b]">Our Mission</h2>
          <p className="mt-4 text-[18px] italic leading-[1.7] text-[#4a5568]">
            It is our mission and responsibility to provide you with the best service possible. Our dedicated staff of insurance professionals is known for its friendly service and positive attitude. You can expect the exact same treatment that you would get from your neighborhood insurance agent.
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[900px] px-6 py-[60px] md:px-12">
        {/* Section 3 — Why Choose Us */}
        <section>
          <p className="text-[13px] font-semibold uppercase tracking-[2px] text-[#3eaa6d]">
            Why Choose Us
          </p>
          <h2 className={`${H2} mt-2`}>The Custom Insurance Agency Difference</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {whyCards.map((c) => (
              <div
                key={c.title}
                className="rounded-2xl border-t-[3px] border-t-[#2abfbf] bg-[#f5f7fa] p-8 transition hover:shadow-md"
              >
                <div className="text-[32px]">{c.icon}</div>
                <h3 className="mt-3 text-[18px] font-bold text-[#0d2b2b]">{c.title}</h3>
                <p className="mt-3 text-[15px] leading-[1.7] text-[#4a5568]">{c.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4 — Get in touch */}
        <section className="mt-[60px]">
          <h2 className={H2}>Get In Touch</h2>
          <p className={P}>
            We would love to hear from you. Whether you have questions about coverage, need a quote, or just want to learn more about how we can help — our team is ready to assist.
          </p>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <ul className="flex flex-col gap-4">
              {contactItems.map((c) => (
                <li key={c.text} className="flex items-start gap-3 text-[15px] text-[#4a5568]">
                  <span className="text-[20px] leading-none">{c.icon}</span>
                  <span className="leading-[1.6]">{c.text}</span>
                </li>
              ))}
            </ul>
            <div className="rounded-2xl bg-[#0d2b2b] p-8 text-white">
              <h3 className="text-[20px] font-bold">Request a Free Quote</h3>
              <p className="mt-3 text-[15px] leading-[1.7] text-white/80">
                Ready to get started? Fill out our quick quote form and a Custom Insurance Agency representative will contact you within 24 hours.
              </p>
              <Link
                to="/get-a-quote"
                className="btn-quote mt-6 inline-block px-6 py-3 text-[14px] uppercase tracking-wider"
              >
                Get a Quote →
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* CTA */}
      <section className="bg-[#0d2b2b] px-6 py-20 text-center md:px-12">
        <h2 className="text-[28px] md:text-[36px] font-bold text-white">
          Serving Chicago & Surrounding Areas Since Day One
        </h2>
        <p className="mx-auto mt-4 max-w-[720px] text-[18px] text-white/60">
          La Grange · Burr Ridge · Hinsdale · Oak Brook · Westmont · Illinois & Indiana
        </p>
        <Link
          to="/contact"
          className="btn-quote mt-8 inline-block px-10 py-4 text-[14px] uppercase tracking-wider"
        >
          Contact Us
        </Link>
      </section>

      <Footer />
    </main>
  );
};

export default About;