import SEO from "@/components/SEO";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import { Link } from "react-router-dom";

const barlow = { fontFamily: "'Barlow', sans-serif" };

type Props = { title: string; subtitle?: string };

const ComingSoon = ({ title, subtitle = "Coming Soon" }: Props) => (
  <main className="min-h-screen bg-white font-['Inter',sans-serif]">
    <SEO title={`${title} | Custom Insurance Agency`} description={`${title} — coming soon.`} />
    <Navbar />
    <section
      className="relative flex h-[220px] md:h-[300px] w-full items-center justify-center pt-16"
      style={{ background: "linear-gradient(135deg, #0f2a42 0%, #0d2b2b 100%)" }}
    >
      <div className="relative z-10 px-6 text-center text-white">
        <h1 style={{ ...barlow, fontWeight: 700, fontSize: "clamp(36px, 6vw, 52px)", lineHeight: 1.1 }}>
          {title}
        </h1>
        <p className="mt-2 text-[15px] md:text-[18px] text-white/85" style={{ ...barlow, fontWeight: 500 }}>
          {subtitle}
        </p>
      </div>
    </section>
    <section className="relative px-6 py-20 text-center md:px-12">
      <h2 className="text-[24px] md:text-[28px] font-bold text-[#0d2b2b]" style={barlow}>
        Coming Soon
      </h2>
      <p className="mx-auto mt-3 max-w-[640px] text-[14px] text-[#4a5568]">
        This page is on its way. In the meantime, our team is happy to help.
      </p>
      <Link to="/contact" className="btn-quote mt-6 inline-block px-10 py-3 text-[14px] uppercase tracking-wider">
        Contact Us
      </Link>
    </section>
    <Footer />
  </main>
);

export default ComingSoon;