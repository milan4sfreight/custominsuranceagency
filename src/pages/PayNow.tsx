import { CreditCard } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";

const TEAL = "#2abfbf";
const NAVY = "#173b5d";
const ORANGE_GRADIENT = "linear-gradient(135deg, #f5821f, #f5c518)";

// NOTE: replace this single placeholder URL with the real ePayPolicy URL when ready.
const EPAY_URL = "https://custominsure.epaypolicy.com/";

const features = [
  "Credit card and ACH/bank transfer accepted",
  "Secure, encrypted transactions",
  "Instant payment confirmation and e-receipt",
  "Available 24/7 — pay anytime, anywhere",
];

const steps = [
  { n: "1", title: "Enter Your Info", body: "Provide your name and policy number on the secure payment page" },
  { n: "2", title: "Choose Payment Method", body: "Pay with credit card or ACH bank transfer — your choice" },
  { n: "3", title: "Get Confirmation", body: "Receive instant email confirmation and receipt after payment" },
];

export default function PayNow() {
  return (
    <main className="min-h-screen bg-white font-['Inter',sans-serif]">
      <SEO
        title="Pay Your Premium Online | Custom Insurance Agency"
        description="Pay your insurance premium online via credit card or ACH through our secure ePayPolicy payment portal."
      />
      <Navbar />

      {/* HERO */}
      <section
        className="relative flex items-center justify-center pt-28 pb-10 md:pt-32 md:pb-14"
        style={{ background: "linear-gradient(to bottom, #1f4d7a 0%, #173b5d 60%, #0f2a42 100%)" }}
      >
        <div className="px-6 text-center text-white">
          <h1 style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700, fontSize: "clamp(32px, 5vw, 46px)", lineHeight: 1.1 }}>
            Pay Your Premium Online
          </h1>
          <p className="mt-3 text-[14px] md:text-[16px]" style={{ color: "rgba(255,255,255,0.8)" }}>
            Fast, secure online payments accepted via Credit Card or ACH
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="px-4 py-10 md:px-12" style={{ maxWidth: 920, margin: "0 auto" }}>
        {/* INTRO CARD */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderTop: `3px solid ${TEAL}`,
            borderRadius: 12,
            padding: "32px 28px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
          }}
        >
          <CreditCard size={32} color={TEAL} />
          <h2
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 700,
              fontSize: 26,
              color: NAVY,
              margin: "12px 0 10px",
            }}
          >
            Online Payment Portal
          </h2>
          <p style={{ color: "#4b5563", fontSize: 15, lineHeight: 1.7, margin: 0 }}>
            Custom Insurance Agency now accepts secure online payments through our payment portal. You can pay your
            insurance premium quickly and easily using your credit card or bank account (ACH).
          </p>

          <ul style={{ listStyle: "none", padding: 0, margin: "20px 0 28px" }}>
            {features.map((f) => (
              <li
                key={f}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 13,
                  color: "#6b7280",
                  padding: "6px 0",
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: TEAL,
                    flexShrink: 0,
                  }}
                />
                {f}
              </li>
            ))}
          </ul>

          <a
            href={EPAY_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              width: "100%",
              textAlign: "center",
              background: ORANGE_GRADIENT,
              color: "#fff",
              borderRadius: 999,
              padding: "16px",
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 600,
              fontSize: 16,
              textDecoration: "none",
              letterSpacing: "0.04em",
            }}
          >
            PAY NOW →
          </a>
          <p style={{ textAlign: "center", color: "#9ca3af", fontSize: 12, marginTop: 12 }}>
            You will be redirected to our secure ePayPolicy payment portal
          </p>
        </div>

        {/* HOW IT WORKS */}
        <div style={{ marginTop: 40 }}>
          <h3
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 700,
              fontSize: 22,
              color: NAVY,
              margin: "0 0 18px",
              textAlign: "center",
            }}
          >
            How It Works
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            {steps.map((s) => (
              <div
                key={s.n}
                style={{
                  background: "#f5f7f9",
                  borderRadius: 12,
                  padding: 20,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: TEAL,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Barlow', sans-serif",
                    fontWeight: 700,
                    fontSize: 18,
                    margin: "0 auto 12px",
                  }}
                >
                  {s.n}
                </div>
                <div
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontWeight: 700,
                    fontSize: 16,
                    color: NAVY,
                    marginBottom: 6,
                  }}
                >
                  {s.title}
                </div>
                <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.55 }}>{s.body}</div>
              </div>
            ))}
          </div>
        </div>

        {/* QUESTIONS */}
        <div
          style={{
            marginTop: 40,
            background: "linear-gradient(to bottom, #1f4d7a 0%, #173b5d 60%, #0f2a42 100%)",
            borderRadius: 12,
            padding: "36px 28px",
            textAlign: "center",
            color: "#fff",
          }}
        >
          <h3
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 700,
              fontSize: 24,
              margin: "0 0 10px",
            }}
          >
            Need Help With Your Payment?
          </h3>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, margin: "0 0 22px" }}>
            Our team is here to assist you with any payment questions.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            <a
              href="tel:7088101970"
              style={{
                border: "1.5px solid rgba(255,255,255,0.6)",
                color: "#fff",
                borderRadius: 999,
                padding: "12px 22px",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: 13,
                textDecoration: "none",
              }}
            >
              CALL US: 708-810-1970
            </a>
            <a
              href="mailto:Quotes@custominsure.com"
              style={{
                background: ORANGE_GRADIENT,
                color: "#fff",
                borderRadius: 999,
                padding: "12px 22px",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: 13,
                textDecoration: "none",
              }}
            >
              EMAIL US
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}