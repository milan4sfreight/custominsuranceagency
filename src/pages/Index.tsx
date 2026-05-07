import { useState } from "react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import Navbar from "@/components/site/Navbar";
import Hero from "@/components/site/Hero";
import Footer from "@/components/site/Footer";

const US_STATES = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];

const EYEBROW = "text-[11px] font-semibold uppercase tracking-[2px] text-[#2abfbf]";
const FONT = "font-['Inter',sans-serif]";

const features = [
  { icon: "🌐", title: "We Speak Your Language", text: "Whether it's Spanish, Bosnian, or the language of trucking. Operating ratios or CSA scores. We get it. Our diverse team of experts works closely with you to ensure that you make the best decisions to protect your business. We understand the road you're on — and we want to ride along." },
  { icon: "🚀", title: "We Build Your Perfect Strategy", text: "We start by listening. By leveraging our extensive network of over 50 insurance companies, we create a customized strategy that aligns with your goals and priorities. Whether you are a small operation with a single truck or a large enterprise with a fleet, we have you covered." },
  { icon: "🏆", title: "We Go The Extra Mile", text: "At Custom Insurance Agency, we offer guidance on industry changes, help you file claims, and assist in fixing any incorrect violations. We provide fast and direct online access to certificates of insurance. No runaround — just results." },
];

const stats = [
  { num: "50+", label: "Insurance Carriers" },
  { num: "21", label: "Coverage Types" },
  { num: "24hr", label: "Quote Response Time" },
  { num: "IL & IN", label: "Licensed States" },
];

const formatPhone = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0,3)}) ${d.slice(3)}`;
  return `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`;
};

const inputCls =
  "w-full rounded-lg border border-white/15 bg-white/[0.08] px-4 py-3 text-white placeholder:text-white/40 outline-none transition focus:border-[#3eaa6d] focus:shadow-[0_0_0_3px_rgba(62,170,109,0.15)]";

const QuoteForm = () => {
  const [phone, setPhone] = useState("");
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="rounded-2xl border border-white/10 bg-white/[0.06] p-9"
    >
      <div className="grid gap-4">
        <div>
          <label className={`${EYEBROW} mb-2 block`}>Name *</label>
          <input required maxLength={100} className={inputCls} placeholder="John Smith" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={`${EYEBROW} mb-2 block`}>Email *</label>
            <input required type="email" maxLength={255} className={inputCls} placeholder="you@email.com" />
          </div>
          <div>
            <label className={`${EYEBROW} mb-2 block`}>Phone *</label>
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
          <label className={`${EYEBROW} mb-2 block`}>Address *</label>
          <input required maxLength={200} className={inputCls} placeholder="Street, City, ZIP" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={`${EYEBROW} mb-2 block`}>State *</label>
            <select required className={inputCls + " appearance-none"}>
              <option value="" className="text-[#0d2b2b]">Select state</option>
              {US_STATES.map((s) => (
                <option key={s} value={s} className="text-[#0d2b2b]">{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={`${EYEBROW} mb-2 block`}>Language</label>
            <select className={inputCls + " appearance-none"} defaultValue="English">
              {["English","Español","Russian"].map((l) => (
                <option key={l} value={l} className="text-[#0d2b2b]">{l}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className={`${EYEBROW} mb-2 block`}>Comments / Questions</label>
          <textarea rows={4} maxLength={1000} className={inputCls} placeholder="Tell us a bit about your needs..." />
        </div>
        <label className="flex items-start gap-3 text-[13px] leading-[1.6] text-white/70">
          <input type="checkbox" className="mt-1 h-4 w-4 accent-[#3eaa6d]" />
          <span>By checking this box, I consent to receive SMS messages from Custom Insurance Agency regarding my insurance quote. Message and data rates may apply. Reply STOP to unsubscribe.</span>
        </label>
        <button
          type="submit"
          className="mt-2 w-full rounded-lg bg-[#3eaa6d] px-6 py-[14px] text-[14px] font-semibold uppercase tracking-wider text-white transition hover:bg-[#2d9960]"
        >
          Get Quote
        </button>
      </div>
    </form>
  );
};

const Index = () => {
  return (
    <main className={`min-h-screen bg-white ${FONT}`}>
      <SEO title="Custom Insurance Agency | Auto, Trucking & Business Insurance — IL & IN" description="Independent insurance agency serving Chicago, La Grange, Burr Ridge & surrounding areas. Auto, Trucking, Home, Business & more. 50+ carriers. Free quote today. Call 708-810-1955." />
      <Navbar />
      <Hero />

      {/* SECTION 1 — WHY CHOOSE US */}
      <section className="bg-white px-6 py-20 md:px-14 md:py-24">
        <div className="mx-auto max-w-[1100px]">
          <p className={EYEBROW}>Why Choose Us</p>
          <h2 className="mt-3 text-[32px] md:text-[42px] font-bold leading-tight text-[#0d2b2b]">
            Why Choose Custom Insurance Agency?
          </h2>
          <div className="mt-12 divide-y divide-[#e2e8f0]">
            {features.map((f) => (
              <div key={f.title} className="flex flex-col gap-6 py-10 md:flex-row md:items-start md:gap-8">
                <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full bg-[#e8f5ee] text-[28px] text-[#3eaa6d]">
                  {f.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-[20px] font-bold text-[#3eaa6d]">{f.title}</h3>
                  <p className="mt-3 text-[16px] leading-[1.75] text-[#4a5568]">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2 — GET A QUOTE FORM */}
      <section className="bg-dark-gradient px-6 py-20 md:px-14 md:py-24">
        <div className="mx-auto grid max-w-[1200px] gap-12 md:grid-cols-5">
          <div className="flex flex-col justify-center md:col-span-2">
            <p className={EYEBROW}>Free Quote</p>
            <h2 className="mt-3 text-[34px] md:text-[42px] font-bold leading-tight text-white">Get A Quote</h2>
            <p className="mt-4 text-[18px] leading-relaxed text-white/60">
              Our agents will find you the best coverage at the best price.
            </p>
            <a href="tel:7088101955" className="mt-8 block text-[24px] md:text-[28px] font-bold text-[#3eaa6d]">
              📞 708-810-1955
            </a>
            <p className="mt-2 text-[14px] text-white/50">Monday – Friday | 9:00 AM – 5:00 PM</p>
          </div>
          <div className="md:col-span-3">
            <QuoteForm />
          </div>
        </div>
      </section>

      {/* SECTION 3 — INSURANCE SOLUTIONS */}
      <section className="grid min-h-[500px] grid-cols-1 md:grid-cols-2">
        <div
          className="min-h-[300px] bg-cover bg-center"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1600&q=80)" }}
          aria-label="Trucking on highway"
        />
        <div className="flex flex-col justify-center bg-dark-gradient px-6 py-16 md:px-14">
          <p className={EYEBROW}>Our Solutions</p>
          <h2 className="mt-3 text-[28px] md:text-[36px] font-bold leading-tight text-white">
            Insurance Solutions That Match Your Needs
          </h2>
          <p className="mt-5 text-[16px] leading-[1.75] text-white/65">
            Our dedicated team starts by matching you with a knowledgeable agent who understands the intricacies of trucking and commercial insurance. We offer solutions for truck, homeowners, life, health, commercial, and freight broker insurance. We cover Illinois, Indiana, and surrounding states.
          </p>
          <div className="mt-6 space-y-3">
            <Link to="/trucking-insurance" className="block font-medium text-[#3eaa6d] hover:underline">Trucking Insurance →</Link>
            <Link to="/commercial-insurance" className="block font-medium text-[#3eaa6d] hover:underline">Commercial Insurance →</Link>
            <Link to="/get-a-quote" className="block font-medium text-[#3eaa6d] hover:underline">View All Coverage →</Link>
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
            At Custom Insurance Agency, we are out to provide the best insurance experience in the industry. Our team launched this agency to bring clarity, transparency and new energy to the intersection of transportation and insurance. We come from the world of trucking, freight and logistics — and we understand what you need.
          </p>
          <div className="mt-6 space-y-3">
            <Link to="/about" className="block font-medium text-[#3eaa6d] hover:underline">About Us →</Link>
            <Link to="/contact" className="block font-medium text-[#3eaa6d] hover:underline">Contact Us →</Link>
          </div>
        </div>
        <div
          className="order-1 min-h-[300px] bg-cover bg-center md:order-2"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80)" }}
          aria-label="Team meeting"
        />
      </section>

      {/* SECTION 5 — TRUSTED & STATS */}
      <section className="bg-white px-6 py-20 md:px-14">
        <div className="mx-auto max-w-[1200px] text-center">
          <p className={EYEBROW}>By the Numbers</p>
          <h2 className="mt-3 text-[28px] md:text-[36px] font-bold text-[#0d2b2b]" style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700 }}>
            Trusted by Businesses Across Illinois &amp; Indiana
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl bg-[#e8f0fb] p-8 text-center">
                <div className="text-[44px] md:text-[48px] font-bold leading-none text-[#173b5d]">{s.num}</div>
                <p className="mt-4 text-[15px] font-medium text-[#173b5d]/70">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — CONTACT CTA */}
      <section
        className="px-6 py-20 md:px-14"
        style={{ background: "linear-gradient(135deg, #0f2a42 0%, #173b5d 50%, #0d2b2b 100%)" }}
      >
        <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-[620px]">
            <h2 className="text-[30px] md:text-[38px] font-bold leading-tight text-white">
              Not Sure What Coverage You Need?
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-white/60">
              Call us or send a message — our friendly agents will review your situation and find the right policy at the right price. No pressure, no jargon.
            </p>
          </div>
          <div className="flex w-full flex-col items-stretch gap-3.5 md:w-auto md:flex-row md:items-center">
            <a
              href="tel:7088101955"
              className="rounded-full px-7 py-[14px] text-center font-semibold text-white transition hover:brightness-110"
              style={{ background: "linear-gradient(135deg, #f5821f 0%, #f5c518 100%)" }}
            >
              📞 Call 708-810-1955
            </a>
            <Link
              to="/contact"
              className="rounded-full border-[1.5px] border-[#173b5d] bg-white px-7 py-[14px] text-center font-semibold text-[#173b5d] transition hover:bg-[#173b5d] hover:text-white"
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
