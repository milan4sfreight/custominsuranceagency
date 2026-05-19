import { useNavigate } from "react-router-dom";
import { Phone, Mail, Clock } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import claimsHero from "@/assets/claims-hero.jpg";

const HERO_IMG = claimsHero;

const barlow = { fontFamily: "'Barlow', sans-serif" };

const steps = [
  {
    n: "01",
    title: "Contact Us Immediately",
    text: "As soon as an incident occurs, contact our claims team at 708-810-1955 or claims@custominsure.com",
  },
  {
    n: "02",
    title: "Document Everything",
    text: "Gather all relevant information including photos, police reports, witness information, and any other documentation.",
  },
  {
    n: "03",
    title: "Work With Your Adjuster",
    text: "Once your claim is filed, an adjuster will be assigned to your case and guide you through the resolution process.",
  },
];

export default function Claims() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'Barlow', sans-serif" }}>
      <SEO
        title="Claims | Custom Insurance Agency"
        description="Need to file an insurance claim? Custom Insurance Agency claims team is here to help. Call 708-810-1955 or email claims@custominsure.com for immediate assistance."
      />
      <Navbar />

      {/* HERO */}
      <section
        className="relative flex w-full flex-col items-center justify-center bg-foreground pt-16 [background-attachment:scroll] md:[background-attachment:fixed] md:min-h-[500px]"
        style={{
          minHeight: "320px",
          backgroundImage: `url(${HERO_IMG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-foreground/65" />
        <div className="relative z-10 px-6 text-center text-primary-foreground">
          <h1
            style={{
              ...barlow,
              fontWeight: 700,
              fontSize: "clamp(40px, 5vw, 52px)",
              lineHeight: 1.1,
              color: "#ffffff",
            }}
          >
            Claims
          </h1>
          <p className="mt-3 text-[18px] font-medium text-white/85" style={barlow}>
            We're here to help you through the process
          </p>
        </div>
      </section>

      {/* WHITE CONTENT on parallax */}
      <section
        className="relative py-[60px]"
        style={{
          backgroundImage: `url(${claimsHero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0" style={{ background: "rgba(10,25,50,0.35)" }} />
        <div
          className="relative mx-auto w-full max-w-[900px] px-6 sm:px-10 py-[60px] bg-white rounded-[16px]"
          style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <h2 style={{ ...barlow, fontSize: 36, fontWeight: 700, lineHeight: 1.2, color: "#0d2b2b", margin: 0 }}>
              We're Here to Help.
            </h2>
            <p
              className="mt-5 text-[16px] leading-[1.75] text-[#374151]"
              style={{ fontFamily: "'Inter', sans-serif", alignSelf: "stretch" }}
            >
              When you contact us to report a commercial trucking claim, we'll ask some initial questions and assign a
              claims representative to your case. They will guide you through every step of the process.
            </p>
            <button
              type="button"
              onClick={() => navigate("/claims/file-a-claim")}
              className="mt-8 font-bold uppercase transition-all hover:brightness-110"
              style={{
                background: "linear-gradient(90deg, #f97316 0%, #eab308 100%)",
                color: "#ffffff",
                ...barlow,
                letterSpacing: "0.08em",
                padding: "10px 32px",
                alignSelf: "stretch",
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 15px rgba(245, 130, 31, 0.35)",
                cursor: "pointer",
              }}
            >
              FILE A CLAIM ONLINE »
            </button>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-start gap-2">
              <Phone size={22} style={{ color: "#2abfbf" }} />
              <div className="text-[16px] font-semibold uppercase tracking-wide text-[#0d2b2b]" style={barlow}>
                Phone
              </div>
              <div className="text-[18px] font-medium" style={{ color: "#2abfbf", ...barlow }}>
                708-810-1955
              </div>
            </div>
            <div className="flex flex-col items-start gap-2">
              <Mail size={22} style={{ color: "#2abfbf" }} />
              <div className="text-[16px] font-semibold uppercase tracking-wide text-[#0d2b2b]" style={barlow}>
                Email
              </div>
              <div className="text-[15px] font-medium break-all" style={{ color: "#2abfbf", ...barlow }}>
                claims@custominsure.com
              </div>
            </div>
            <div className="flex flex-col items-start gap-2">
              <Clock size={22} style={{ color: "#2abfbf" }} />
              <div className="text-[16px] font-semibold uppercase tracking-wide text-[#0d2b2b]" style={barlow}>
                Hours
              </div>
              <div className="text-[18px] font-medium" style={{ color: "#2abfbf", ...barlow }}>
                Mon–Fri, 9:00 AM–5:00 PM
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW TO FILE */}
      <section style={{ background: "linear-gradient(135deg, #0f2a42 0%, #173b5d 60%, #0d2b2b 100%)" }}>
        <div className="mx-auto w-full max-w-[1100px] px-6 py-[80px]">
          <p
            style={{
              ...barlow,
              color: "#2abfbf",
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
            }}
          >
            File A Claim
          </p>
          <h2 style={{ ...barlow, fontSize: 38, fontWeight: 700, lineHeight: 1.2, color: "#ffffff", marginTop: 12 }}>
            How to File a Claim
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <article
                key={step.n}
                className="rounded-[12px] p-8"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div style={{ ...barlow, fontSize: 32, fontWeight: 700, color: "#2abfbf" }}>{step.n}</div>
                <h3 style={{ ...barlow, fontSize: 20, fontWeight: 700, color: "#ffffff", marginTop: 12 }}>
                  {step.title}
                </h3>
                <p
                  className="mt-3 text-[15px] leading-[1.7] text-white/70"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {step.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
