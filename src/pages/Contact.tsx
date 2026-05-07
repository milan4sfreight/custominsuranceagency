import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";

const HERO_IMG = "https://images.unsplash.com/photo-1423666639041-f56000c27a9a";
const barlow = { fontFamily: "'Barlow', sans-serif" };

const inquiryTypes = [
  "General Inquiry",
  "Auto Insurance",
  "Trucking Insurance",
  "Business & Commercial",
  "Life & Health",
  "Homeowners",
  "Flood Insurance",
  "Motorcycle",
  "Watercraft & Boat",
  "Renters Insurance",
  "Limousine",
  "Recreational Vehicle",
  "Workers Compensation",
  "Claims",
];

const schema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(60),
  lastName: z.string().trim().min(1, "Last name is required").max(60),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(7, "Phone is required").max(30),
  inquiry: z.string().min(1, "Select an inquiry type"),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

const contactItems = [
  { icon: "📍", text: "1333 Burr Ridge Pkwy STE 200, Burr Ridge, IL 60527" },
  { icon: "📞", text: "708-810-1955" },
  { icon: "📠", text: "Fax: 708-810-1970" },
  { icon: "✉️", text: "info@custominsure.com" },
  { icon: "🕐", text: "Monday – Friday | 9:00 AM – 5:00 PM" },
];

const Contact = () => {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      firstName: String(fd.get("firstName") ?? ""),
      lastName: String(fd.get("lastName") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      inquiry: String(fd.get("inquiry") ?? ""),
      message: String(fd.get("message") ?? ""),
    };
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check your inputs");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Thanks! We'll be in touch shortly.");
      (e.target as HTMLFormElement).reset();
    }, 600);
  };

  const inputCls =
    "w-full h-11 rounded-md border border-[#e2e8f0] bg-white px-3 text-[14px] outline-none focus:border-[#3eaa6d]";
  const labelCls = "block text-[13px] font-semibold text-[#0d2b2b] mb-1.5";

  return (
    <main className="min-h-screen bg-white font-['Inter',sans-serif]">
      <SEO
        title="Contact Us | Custom Insurance Agency"
        description="Contact Custom Insurance Agency in Burr Ridge, IL. Call 708-810-1955 or send a message. Monday–Friday, 9 AM – 5 PM."
      />
      <Navbar />

      {/* HERO */}
      <section
        className="relative flex h-[300px] w-full flex-col items-center justify-center pt-16"
        style={{ backgroundImage: `url(${HERO_IMG})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.6)" }} />
        <div className="relative z-10 px-6 text-center text-white">
          <h1 style={{ ...barlow, fontWeight: 700, fontSize: "52px", lineHeight: 1.1 }}>Contact Us</h1>
          <p className="mt-2 text-[18px] text-white/85" style={{ ...barlow, fontWeight: 500 }}>
            We're here to help — reach out anytime
          </p>
        </div>
      </section>

      {/* MAIN */}
      <div className="mx-auto w-full max-w-[900px] px-6 py-[60px] md:px-12">
        <div className="grid gap-10 md:grid-cols-2">
          {/* LEFT */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[2px] text-[#2abfbf]" style={barlow}>
              Get In Touch
            </p>
            <h2 className="mt-2 text-[32px] font-bold leading-tight text-[#0d2b2b]" style={barlow}>
              Contact Custom Insurance Agency
            </h2>
            <p className="mt-4 text-[15px] leading-[1.75] text-[#4a5568]">
              Our friendly team is ready to help you find the right coverage at the right price. Give us a call, send an email, or stop by our office.
            </p>

            <ul className="mt-6 flex flex-col gap-3">
              {contactItems.map((c) => (
                <li key={c.text} className="flex items-start gap-3 text-[14px] text-[#4a5568]">
                  <span className="text-[18px] leading-none">{c.icon}</span>
                  <span className="leading-[1.6]">{c.text}</span>
                </li>
              ))}
            </ul>

            <iframe
              title="Custom Insurance Agency Location"
              src="https://www.google.com/maps?q=1333+Burr+Ridge+Pkwy+STE+200,+Burr+Ridge,+IL+60527&output=embed"
              className="mt-6 w-full"
              style={{ height: "250px", border: 0, borderRadius: "12px" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* RIGHT — FORM */}
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-[#e2e8f0] bg-white p-9"
            style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}
          >
            <h3 className="text-[22px] font-bold text-[#0d2b2b]" style={barlow}>
              Send Us a Message
            </h3>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls} htmlFor="firstName">First Name *</label>
                <input id="firstName" name="firstName" required maxLength={60} className={inputCls} />
              </div>
              <div>
                <label className={labelCls} htmlFor="lastName">Last Name *</label>
                <input id="lastName" name="lastName" required maxLength={60} className={inputCls} />
              </div>
              <div>
                <label className={labelCls} htmlFor="email">Email Address *</label>
                <input id="email" name="email" type="email" required maxLength={255} className={inputCls} />
              </div>
              <div>
                <label className={labelCls} htmlFor="phone">Phone Number *</label>
                <input id="phone" name="phone" type="tel" required maxLength={30} className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="inquiry">Inquiry Type *</label>
                <select id="inquiry" name="inquiry" required defaultValue="" className={inputCls}>
                  <option value="" disabled>Select…</option>
                  {inquiryTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  maxLength={2000}
                  className="w-full rounded-md border border-[#e2e8f0] bg-white px-3 py-2 text-[14px] outline-none focus:border-[#3eaa6d]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-5 w-full rounded-lg py-3 text-[14px] font-bold uppercase tracking-wider text-white transition disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #f5821f 0%, #f5c518 100%)" }}
            >
              {submitting ? "Sending…" : "Send Message"}
            </button>
            <p className="mt-3 text-[12px] text-[#94a3b8]">
              We will not resell your information to any third party.
            </p>
          </form>
        </div>
      </div>

      {/* CTA */}
      <section className="bg-dark-gradient px-6 py-[60px] text-center md:px-12">
        <h2 className="text-[32px] font-bold text-white" style={barlow}>Ready to Get Covered?</h2>
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

export default Contact;