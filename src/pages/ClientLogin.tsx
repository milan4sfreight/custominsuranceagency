import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";

const HERO_IMG = "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7";
const barlow = { fontFamily: "'Barlow', sans-serif" };

const CONTACT_URL = "/contact";

const cards = [
  { icon: "📄", title: "Issue a Certificate", text: "Contact our team to request a certificate of insurance.", label: "Contact Us →" },
  { icon: "🔄", title: "Make a Policy Change", text: "Reach out to our team to request changes to your existing policy.", label: "Contact Us →" },
  { icon: "👤", title: "Employee Login", text: "Custom Insurance Agency team members — contact us for access details.", label: "Contact Us →" },
];

const ClientLogin = () => {
  const primaryBtn: React.CSSProperties = {
    background: "linear-gradient(135deg, #f5821f 0%, #f5c518 100%)",
    color: "#fff",
    borderRadius: "50px",
    padding: "16px 36px",
    fontFamily: "'Barlow', sans-serif",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "1px",
    fontSize: "14px",
  };

  return (
    <main className="min-h-screen bg-white font-['Inter',sans-serif]">
      <SEO
        title="Client Login | Custom Insurance Agency"
        description="Access your policy portal, request a certificate of insurance, or sign in to the employee portal."
      />
      <Navbar />

      {/* HERO */}
      <section
        className="relative flex w-full flex-col items-center justify-center px-6 text-center"
        style={{
          minHeight: "100svh",
          backgroundImage: `url(${HERO_IMG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.65)" }} />
        <div className="relative z-10 flex flex-col items-center">
          <h1 className="text-white" style={{ ...barlow, fontWeight: 700, fontSize: "52px", lineHeight: 1.1 }}>
            Client Login
          </h1>
          <p
            className="mt-4 max-w-[640px] text-white/60"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", marginBottom: "48px" }}
          >
            To request a certificate of insurance or make a policy change, please contact our team directly.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to={CONTACT_URL} style={primaryBtn}>
              Issue a Certificate
            </Link>
            <Link to={CONTACT_URL} style={primaryBtn}>
              Make a Policy Change
            </Link>
            <Link
              to={CONTACT_URL}
              className="transition-colors"
              style={{
                background: "transparent",
                border: "2px solid rgba(255,255,255,0.4)",
                color: "#fff",
                borderRadius: "50px",
                padding: "16px 36px",
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "1px",
                fontSize: "14px",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              Employee Login
            </Link>
          </div>
        </div>
      </section>

      {/* INFO */}
      <section className="mx-auto w-full max-w-[700px] px-6 py-[60px] md:px-12">
        <p className="text-[11px] font-semibold uppercase tracking-[2px] text-[#2abfbf]" style={barlow}>
          Portal Access
        </p>
        <h2 className="mt-2 text-[28px] font-bold leading-tight text-[#0d2b2b]" style={barlow}>
          What Would You Like To Do?
        </h2>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {cards.map((c) => (
            <div
              key={c.title}
              className="rounded-2xl bg-[#f5f7fa] p-7 text-center transition hover:shadow-md"
              style={{ borderTop: "3px solid #3eaa6d" }}
            >
              <div className="text-[32px]">{c.icon}</div>
              <h3 className="mt-3 text-[16px] font-bold text-[#0d2b2b]" style={barlow}>{c.title}</h3>
              <p className="mt-2 text-[13px] leading-[1.6] text-[#4a5568]">{c.text}</p>
              <Link
                to={CONTACT_URL}
                className="mt-4 inline-block text-[14px] font-semibold text-[#3eaa6d] hover:underline"
              >
                {c.label}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-dark-gradient px-6 py-[60px] text-center md:px-12">
        <h2 className="text-[32px] font-bold text-white" style={barlow}>
          Need Help Accessing Your Account?
        </h2>
        <p className="mx-auto mt-4 max-w-[640px] text-[16px] text-white/60">
          Contact our team and we will assist you right away.
        </p>
        <Link to="/contact" className="btn-quote mt-8 inline-block px-10 py-4 text-[14px] uppercase tracking-wider">
          Contact Us
        </Link>
      </section>

      <Footer />
    </main>
  );
};

export default ClientLogin;