import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import volvoCab from "@/assets/volvo-cab.webp";
import handshake from "@/assets/handshake.jpg";

const whyCards = [
  { icon: "🤝", title: "Loyalty First", text: "Your trust is the foundation of everything we do." },
  { icon: "⚖️", title: "Independent & Unbiased", text: "We shop multiple carriers to find your best option." },
  { icon: "🚚", title: "Industry Expertise", text: "Deep knowledge in trucking and commercial insurance." },
  { icon: "🌐", title: "Multilingual Team", text: "Serving clients comfortably in their preferred language." },
  { icon: "🇺🇸", title: "National Coverage", text: "Licensed and equipped to serve you across the country." },
  { icon: "👥", title: "Personal Service", text: "Real people who know your name and your policy." },
];

const contactItems = [
  { icon: "📍", text: "1333 Burr Ridge Pkwy STE 200, Burr Ridge, IL 60527" },
  { icon: "📞", text: "708-810-1955" },
  { icon: "📠", text: "Fax: 708-810-1970" },
  { icon: "✉️", text: "coi@custominsure.com" },
  { icon: "🕐", text: "Monday – Friday | 9:00 AM – 5:00 PM" },
];

const HERO_IMG = handshake;

const H2 = "text-[24px] md:text-[26px] font-bold text-[#0d2b2b] leading-tight mb-4";
const P = "text-[16px] leading-[1.75] text-[#4a5568]";

const About = () => {
  return (
    <main className="min-h-screen bg-white font-['Inter',sans-serif]">
      <SEO title="About Us | Custom Insurance Agency — La Grange Highlands, IL" description="Independent insurance agency serving Chicago area since day one. 50+ carrier partners, friendly local service, affordable coverage for IL & IN businesses and families." />
      <Navbar />

      {/* HERO */}
      <section
        className="relative flex h-[380px] w-full items-center justify-center pt-16 md:h-[440px]"
        style={{
          backgroundImage: `url(${HERO_IMG})`,
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
        }}
      >
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.55)" }} />
        <h1 className="relative z-10 text-center text-white font-bold text-[36px] md:text-[52px]">
          About Us
        </h1>
      </section>

      {/* Section 1 */}
      <div className="mx-auto w-full max-w-[900px] px-6 pt-[20px] pb-[24px] md:px-12">
        <section>
          <h2 className={H2}>Loyalty First. Local Roots. National Reach.</h2>
          <p className={P}>
            We are an independent insurance agency built on one unshakeable principle — loyalty to our clients, our community, and the industries we serve. From our local beginnings, we have grown into a nationally serving agency that never loses sight of what matters most: you.
          </p>
        </section>
      </div>

      {/* Section 2 — Mission */}
      <section className="bg-[#f0f6ff] px-6 py-[28px] md:px-12">
        <div className="mx-auto max-w-[700px] text-center">
          <div className="text-[56px] leading-none text-[#3eaa6d] font-serif">"</div>
          <h2 className="text-[28px] font-bold text-[#0d2b2b]">Loyalty First</h2>
          <p className="mt-4 text-[18px] italic leading-[1.7] text-[#4a5568]">
            Our mission is simple — Loyalty First. We are an independent insurance agency rooted in community, trusted nationwide, and committed to putting our clients above all else.
          </p>
        </div>
      </section>

      {/* Parallax band */}
      <section
        aria-hidden="true"
        className="relative w-full"
        style={{
          height: "420px",
          backgroundImage: `url(${volvoCab})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0" style={{ background: "rgba(10,25,50,0.35)" }} />
      </section>

      <div className="mx-auto w-full max-w-[900px] px-6 py-[60px] md:px-12">
        {/* Section 3 — Why Choose Us */}
        <section>
          <p className="text-[13px] font-semibold uppercase tracking-[2px] text-[#3eaa6d]">
            Why Choose Us
          </p>
          <h2 className={`${H2} mt-2`}>What Sets Us Apart</h2>
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
            <div className="rounded-2xl bg-dark-gradient p-8 text-white">
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
      <section className="bg-dark-gradient px-6 py-20 text-center md:px-12">
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