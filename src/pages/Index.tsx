import { useState } from "react";

import { Link } from "react-router-dom";

import SEO from "@/components/SEO";

import Navbar from "@/components/site/Navbar";

import Hero from "@/components/site/Hero";

import Footer from "@/components/site/Footer";

import { sendQuoteEmail, SUCCESS_MSG, ERROR_MSG } from "@/lib/sendQuoteEmail";

import volvoSemi from "@/assets/volvo-semi.jpeg";

import handshake from "@/assets/handshake.jpg";

const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

const EYEBROW = "text-[11px] font-semibold uppercase tracking-[2px] text-[#2abfbf]";

const FONT = "font-['Inter',sans-serif]";

const features = [
  {
    icon: "🎯",
    title: "Loyalty First",
    text: "Our mission is simple — Loyalty First. We are an independent insurance agency rooted in community, trusted nationwide, and committed to putting our clients above all else.",
  },

  {
    icon: "🌐",
    title: "Our First Language Is Trucking",
    text: "The transportation industry is the backbone of this country, and we know it inside and out. Whether you are an owner-operator, a fleet manager, or a logistics company, we understand the risks you face on and off the road. Our team speaks your language — and our loyalty to the trucking community runs deep.",
  },

  {
    icon: "🚀",
    title: "We Build Your Perfect Strategy",
    text: "We start by listening. Leveraging our network of 50+ insurance companies, we create a customized strategy aligned with your goals — from a single truck to a full fleet.",
  },

  {
    icon: "🏆",
    title: "We Go The Extra Mile",
    text: "We offer guidance on industry changes, help you file claims, and assist in fixing incorrect violations. Fast, direct online access to certificates of insurance. No runaround — just results.",
  },
];

const stats = [
  { num: "50+", label: "Insurance Carriers" },

  { num: "21", label: "Coverage Types" },

  { num: "24hr", label: "Quote Response Time" },

  { num: "50", label: "Licensed States" },
];

const formatPhone = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 10);

  if (d.length < 4) return d;

  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;

  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
};

const inputCls =
  "w-full rounded-lg border border-white/15 bg-white/[0.08] px-[10px] py-[6px] text-[12px] text-white placeholder:text-white/35 outline-none transition focus:border-[#2abfbf] focus:shadow-[0_0_0_3px_rgba(42,191,191,0.15)]";

const labelCls = "mb-[3px] block text-[10px] font-semibold uppercase tracking-[1px] text-[#2abfbf]";

const QuoteForm = () => {
  const [phone, setPhone] = useState("");

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [address, setAddress] = useState("");

  const [stateVal, setStateVal] = useState("");

  const [language, setLanguage] = useState("English");

  const [comments, setComments] = useState("");

  const [consent, setConsent] = useState(false);

  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (status === "sending") return;

    setStatus("sending");

    try {
      await sendQuoteEmail({
        formKind: "Homepage Quote",

        source: "Homepage — Get A Quote",

        primaryName: name,

        customerName: name,

        customerEmail: email,

        customerPhone: phone,

        sections: [
          {
            title: "Contact Info",

            rows: [
              ["Name", name],

              ["Email", email],

              ["Phone", phone],

              ["Address", address],

              ["State", stateVal],

              ["Preferred Language", language],
            ],
          },

          {
            title: "Message",

            rows: [
              ["Comments / Questions", comments],

              ["SMS Consent", consent ? "Yes" : "No"],
            ],
          },
        ],
      });

      setStatus("success");

      setName("");
      setEmail("");
      setPhone("");
      setAddress("");

      setStateVal("");
      setLanguage("English");
      setComments("");
      setConsent(false);
    } catch (err) {
      console.error(err);

      setStatus("error");
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-[7px]">
      <div>
        <label className={labelCls}>Name *</label>

        <input
          required
          maxLength={100}
          className={inputCls}
          placeholder="John Smith"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="grid gap-[7px] md:grid-cols-2">
        <div>
          <label className={labelCls}>Email *</label>

          <input
            required
            type="email"
            maxLength={255}
            className={inputCls}
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className={labelCls}>Phone *</label>

          <input
            required
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            className={inputCls}
            placeholder="(555) 555-5555"
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>Address *</label>

        <input
          required
          maxLength={200}
          className={inputCls}
          placeholder="Street, City, ZIP"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <div className="grid gap-[7px] md:grid-cols-2">
        <div>
          <label className={labelCls}>State *</label>

          <select
            required
            className={inputCls + " appearance-none"}
            value={stateVal}
            onChange={(e) => setStateVal(e.target.value)}
          >
            <option value="" className="text-[#0d2b2b]">
              Select state
            </option>

            {US_STATES.map((s) => (
              <option key={s} value={s} className="text-[#0d2b2b]">
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls}>Language</label>

          <select
            className={inputCls + " appearance-none"}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {["English", "Español", "Russian"].map((l) => (
              <option key={l} value={l} className="text-[#0d2b2b]">
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelCls}>Comments / Questions</label>

        <textarea
          rows={1}
          maxLength={1000}
          className={inputCls}
          style={{ minHeight: 44, resize: "none" }}
          placeholder="Tell us a bit about your needs..."
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
      </div>

      <label className="flex items-start gap-3 text-[10px] leading-[1.5] text-white/60">
        <input
          type="checkbox"
          className="mt-[2px] h-3 w-3 accent-[#2abfbf]"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
        />

        <span>
          By checking this box, I consent to receive SMS messages from Custom Insurance Agency regarding my insurance
          quote. Message and data rates may apply. Reply STOP to unsubscribe.
        </span>
      </label>

      {status === "success" && (
        <div className="rounded-md border border-green-400/40 bg-green-500/15 px-3 py-2 text-[12px] text-green-200">
          {SUCCESS_MSG}
        </div>
      )}

      {status === "error" && (
        <div className="rounded-md border border-red-400/40 bg-red-500/15 px-3 py-2 text-[12px] text-red-200">
          {ERROR_MSG}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-1 w-full rounded-lg px-6 py-[9px] text-[13px] font-semibold uppercase tracking-wider text-white transition hover:brightness-110"
        style={{ background: "linear-gradient(135deg, #f5821f 0%, #f5c518 100%)", fontFamily: "'Barlow', sans-serif" }}
      >
        {status === "sending" ? "Sending…" : "Get Quote"}
      </button>
    </form>
  );
};

const Index = () => {
  return (
    <main className={`min-h-screen bg-white ${FONT}`}>
      <SEO
        title="Custom Insurance Agency | Auto, Trucking & Business Insurance — IL & IN"
        description="Independent insurance agency serving Chicago, La Grange, Burr Ridge & surrounding areas. Auto, Trucking, Home, Business & more. 50+ carriers. Free quote today. Call 708-810-1955."
      />

      <Navbar />

      <Hero />

      {/* COMBINED SECTION — WHY CHOOSE US + GET A QUOTE */}

      <section className="bg-white overflow-hidden" style={{ paddingBottom: 40 }}>
        <div className="mx-auto flex max-w-[1400px] flex-col items-start md:flex-row md:items-start">
          {/* LEFT — Why Choose Us */}

          <div className="bg-white md:w-[60%]" style={{ padding: "48px 40px", alignSelf: "flex-start" }}>
            <div>
              <p className={EYEBROW} style={{ marginBottom: 8 }}>
                Why Choose Us
              </p>

              <h2
                className="leading-tight text-[#0d2b2b]"
                style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700, fontSize: 34 }}
              >
                Why Choose Custom Insurance Agency?
              </h2>

              <div className="mt-8">
                {features.map((f, i) => (
                  <div
                    key={f.title}
                    className="flex flex-col md:flex-row md:items-start"
                    style={{ borderTop: i === 0 ? "none" : "1px solid #f0f0f0", gap: 16, padding: "12px 0" }}
                  >
                    <div
                      className="flex shrink-0 items-center justify-center rounded-full text-[20px] text-[#2abfbf]"
                      style={{ width: 48, height: 48, background: "#e8f0fb" }}
                    >
                      {f.icon}
                    </div>

                    <div className="flex-1">
                      <h3
                        className="text-[#2abfbf]"
                        style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: 15 }}
                      >
                        {f.title}
                      </h3>

                      <p className="mt-2 text-[13px] text-[#4a5568]" style={{ lineHeight: 1.6 }}>
                        {f.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — Get A Quote */}

          <div
            className="w-full md:w-[40%] px-4 pt-8 md:pl-0 md:pr-10 md:pt-12 md:sticky md:top-6 md:self-start"
          >
            <div
              style={{
                background: "linear-gradient(135deg, #0f2a42 0%, #173b5d 60%, #0d2b2b 100%)",

                border: "1px solid rgba(255, 255, 255, 0.15)",

                borderRadius: 16,

                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.08)",

                padding: "24px",
              }}
            >
              <p
                className="text-[10px] font-semibold uppercase tracking-[2px] text-[#2abfbf]"
                style={{ marginBottom: 4 }}
              >
                Free Quote
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <h2
                  className="text-white leading-tight text-[20px] md:text-[28px]"
                  style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700 }}
                >
                  Get A Quote
                </h2>

                <a
                  href="tel:7088101955"
                  className="text-[#f5c518] text-[16px] md:text-[22px] whitespace-nowrap"
                  style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700 }}
                >
                  📞 708-810-1955
                </a>
              </div>

              <QuoteForm />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — INSURANCE SOLUTIONS */}

      <section className="grid min-h-[500px] grid-cols-1 md:grid-cols-2">
        <div
          className="min-h-[300px] bg-cover bg-center"
          style={{ backgroundImage: `url(${volvoSemi})` }}
          aria-label="Trucking on highway"
        />

        <div className="flex flex-col justify-center bg-dark-gradient px-6 py-16 md:px-14">
          <p className={EYEBROW}>Our Solutions</p>

          <h2 className="mt-3 text-[28px] md:text-[36px] font-bold leading-tight text-white">
            Insurance Solutions That Match Your Needs
          </h2>

          <p className="mt-5 text-[16px] leading-[1.75] text-white/65">
            Our dedicated team starts by matching you with a knowledgeable agent who understands the intricacies of
            trucking and commercial insurance. We offer solutions for truck, homeowners, life, health, commercial, and
            freight broker insurance. We cover Illinois, Indiana, and surrounding states.
          </p>

          <div className="mt-6 space-y-3">
            <Link to="/trucking-insurance" className="block font-medium text-[#3eaa6d] hover:underline">
              Trucking Insurance →
            </Link>

            <Link to="/commercial-insurance" className="block font-medium text-[#3eaa6d] hover:underline">
              Commercial Insurance →
            </Link>

            <Link to="/personal-lines" className="block font-medium text-[#3eaa6d] hover:underline">
              Personal Lines →
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 4 — ABOUT / MISSION (reversed) */}

      <section className="grid min-h-[500px] grid-cols-1 md:grid-cols-2">
        <div className="order-2 flex flex-col justify-center bg-dark-gradient px-6 py-16 md:order-1 md:px-14">
          <p className={EYEBROW}>About Us</p>

          <h2 className="mt-3 text-[28px] md:text-[36px] font-bold leading-tight text-white">
            Let's Achieve Success Together
          </h2>

          <p className="mt-5 text-[16px] leading-[1.75] text-white/65">
            At Custom Insurance Agency, we are out to provide the best insurance experience in the industry. Our team
            launched this agency to bring clarity, transparency and new energy to the intersection of transportation and
            insurance. We come from the world of trucking, freight and logistics — and we understand what you need.
          </p>

          <div className="mt-6 space-y-3">
            <Link to="/about" className="block font-medium text-[#3eaa6d] hover:underline">
              About Us →
            </Link>

            <Link to="/contact" className="block font-medium text-[#3eaa6d] hover:underline">
              Contact Us →
            </Link>
          </div>
        </div>

        <div
          className="order-1 min-h-[300px] bg-cover bg-center md:order-2"
          style={{ backgroundImage: `url(${handshake})` }}
          aria-label="Team meeting"
        />
      </section>

      {/* SECTION 5 — TRUSTED & STATS */}

      <section className="bg-white" style={{ padding: "40px 24px", marginBottom: 0 }}>
        <div className="mx-auto max-w-[1200px] text-center">
          <p className={EYEBROW}>By the Numbers</p>

          <h2
            className="mt-3 font-bold text-[#0d2b2b]"
            style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700, fontSize: 28, marginBottom: 24 }}
          >
            Trusted by Businesses Nationwide
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-[#e8f0fb] text-center"
                style={{ padding: "16px 20px", borderRadius: 10 }}
              >
                <div className="font-bold leading-none text-[#173b5d]" style={{ fontSize: 36 }}>
                  {s.num}
                </div>

                <p className="mt-2 font-medium text-[#173b5d]/70" style={{ fontSize: 12 }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — CONTACT CTA */}

      <section style={{ background: "#ffffff", padding: "24px 24px 60px", marginTop: 0 }}>
        <div
          className="flex flex-col items-start gap-10 md:flex-row md:items-center md:justify-between p-6 sm:p-10 md:px-12"
          style={{
            background: "linear-gradient(135deg, #0f2a42 0%, #173b5d 50%, #0d2b2b 100%)",

            maxWidth: 1100,

            margin: "0 auto",

            borderRadius: 16,

            border: "1px solid rgba(255, 255, 255, 0.15)",

            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
          }}
        >
          <div className="max-w-[620px]">
            <h2 className="text-[30px] md:text-[38px] font-bold leading-tight text-white">
              Not Sure What Coverage You Need?
            </h2>

            <p className="mt-4 text-[16px] leading-relaxed text-white/60">
              Call us or send a message — our friendly agents will review your situation and find the right policy at
              the right price. No pressure, no jargon.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-stretch md:items-center w-full md:w-auto" style={{ gap: 12 }}>
            <a
              href="tel:7088101955"
              className="w-full md:w-auto rounded-full font-semibold text-white transition hover:brightness-110 inline-flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #f5821f 0%, #f5c518 100%)",
                height: 44,
                padding: "0 24px",
                whiteSpace: "nowrap",
              }}
            >
              📞 708-810-1955
            </a>

            <Link
              to="/contact"
              className="w-full md:w-auto rounded-full border-[1.5px] border-[#173b5d] bg-white font-semibold text-[#173b5d] transition hover:bg-[#173b5d] hover:text-white inline-flex items-center justify-center"
              style={{ height: 44, padding: "0 24px", whiteSpace: "nowrap" }}
            >
              Send a Message
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Index;
