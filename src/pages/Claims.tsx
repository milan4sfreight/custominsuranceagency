import { useState } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import { sendQuoteEmail, SUCCESS_MSG, ERROR_MSG } from "@/lib/sendQuoteEmail";

const HERO_IMG = "https://images.unsplash.com/photo-1450101499163-c8848c66ca85";

const steps = [
  {
    n: "01",
    title: "Contact Us Immediately",
    text: "As soon as an incident occurs, contact Custom Insurance Agency by phone or email. The sooner you report a claim, the faster we can begin the process. Have your policy number ready when you call.",
    contact: "📞 708-810-1955  |  ✉ info@custominsure.com",
  },
  {
    n: "02",
    title: "Document Everything",
    text: "Gather all relevant information including photos of damage, police reports if applicable, contact information of any other parties involved, and witness statements. The more documentation you have, the smoother the process.",
  },
  {
    n: "03",
    title: "Work With Your Adjuster",
    text: "Once your claim is filed, an adjuster will be assigned to your case. They will review your documentation, assess the damage, and work with you to reach a fair settlement as quickly as possible.",
  },
];

const checklist = [
  "Your policy number",
  "Date and time of the incident",
  "Location where the incident occurred",
  "Description of what happened",
  "Photos or videos of the damage",
  "Police report number (if applicable)",
  "Contact info of other parties involved",
  "Names and contact info of any witnesses",
  "Your driver's license number",
  "Vehicle VIN numbers (for auto/trucking claims)",
];

const barlow = { fontFamily: "'Barlow', sans-serif" };

const Claims = () => {
  const [form, setForm] = useState({
    name: "",
    policy: "",
    phone: "",
    email: "",
    type: "Auto",
    description: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      await sendQuoteEmail({
        formKind: "Claim Submission",
        source: "Claims Page",
        primaryName: form.name,
        customerName: form.name,
        customerEmail: form.email,
        customerPhone: form.phone,
        sections: [
          {
            title: "Claimant",
            rows: [
              ["Full Name", form.name],
              ["Phone", form.phone],
              ["Email", form.email],
            ],
          },
          {
            title: "Claim Details",
            rows: [
              ["Policy Number", form.policy],
              ["Type of Claim", form.type],
              ["Description", form.description],
            ],
          },
        ],
      });
      setSubmitted(true);
      setStatus("idle");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-white font-['Inter',sans-serif]">
      <SEO title="File a Claim | Custom Insurance Agency" description="Need to file an insurance claim? Custom Insurance Agency claims team is here to help. Call 708-810-1955 or email info@custominsure.com for immediate assistance." />
      <Navbar />

      {/* HERO */}
      <section
        className="relative flex h-[300px] w-full flex-col items-center justify-center pt-16"
        style={{ backgroundImage: `url(${HERO_IMG})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.6)" }} />
        <div className="relative z-10 text-center text-white">
          <h1 style={{ ...barlow, fontWeight: 700, fontSize: "52px", lineHeight: 1.1 }}>Claims</h1>
          <p className="mt-2 text-[18px] text-white/85" style={{ ...barlow, fontWeight: 500 }}>
            We're here to help you through the process
          </p>
        </div>
      </section>

      {/* INTRO */}
      <div className="mx-auto w-full max-w-[900px] px-6 py-[60px] md:px-12">
        <p className="text-[11px] font-semibold uppercase tracking-[2px] text-[#2abfbf]" style={barlow}>
          File A Claim
        </p>
        <h2 className="mt-2 text-[32px] font-bold text-[#0d2b2b] leading-tight" style={barlow}>
          How to File a Claim
        </h2>
        <p className="mt-4 text-[16px] leading-[1.75] text-[#4a5568]">
          At Custom Insurance Agency, we understand that filing a claim can be stressful. Our dedicated claims team is here to guide you through every step of the process and ensure you receive the coverage you are entitled to under your policy.
        </p>

        {/* STEPS */}
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="rounded-2xl bg-[#f5f7fa] p-8">
              <div className="text-[36px] font-bold text-[#3eaa6d]" style={barlow}>{s.n}</div>
              <h3 className="mt-2 text-[18px] font-bold text-[#0d2b2b]" style={barlow}>{s.title}</h3>
              <p className="mt-3 text-[14px] leading-[1.7] text-[#4a5568]">{s.text}</p>
              {s.contact && <p className="mt-4 text-[13px] font-semibold text-[#3eaa6d]">{s.contact}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* WHAT TO HAVE READY */}
      {/* START YOUR CLAIM CTA */}
      <section
        className="px-6 py-[80px] md:px-12"
        style={{ background: "linear-gradient(135deg, #0f2a42 0%, #173b5d 60%, #0d2b2b 100%)" }}
      >
        <div className="mx-auto max-w-[800px] text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[2px] text-[#2abfbf]" style={barlow}>
            Ready To File?
          </p>
          <h2 className="mt-3 text-[36px] font-bold leading-tight text-white" style={barlow}>
            Start Your Claim Online
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-[15px] text-white/50">
            Complete our secure online form and our claims team will contact you within 24 hours.
          </p>
          <Link
            to="/claims/file-a-claim"
            className="mt-8 inline-block"
            style={{
              background: "linear-gradient(135deg, #f5821f 0%, #f5c518 100%)",
              color: "#1a1a1a",
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 700,
              padding: "16px 48px",
              borderRadius: "8px",
            }}
          >
            Start Your Claim →
          </Link>
        </div>
      </section>

      <section className="bg-dark-gradient px-6 py-[60px] md:px-12">
        <div className="mx-auto max-w-[900px]">
          <p className="text-[11px] font-semibold uppercase tracking-[2px] text-[#2abfbf]" style={barlow}>
            Be Prepared
          </p>
          <h2 className="mt-2 text-[28px] font-bold text-white" style={barlow}>
            What to Have Ready When You Call
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {checklist.map((c) => (
              <li key={c} className="flex items-start gap-3 text-[15px] text-white/90">
                <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[#3eaa6d]">
                  <Check className="h-4 w-4 text-white" />
                </span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CONTACT CLAIMS TEAM */}
      <div className="mx-auto w-full max-w-[900px] px-6 py-[60px] md:px-12">
        <p className="text-[11px] font-semibold uppercase tracking-[2px] text-[#2abfbf]" style={barlow}>
          Get Help Now
        </p>
        <h2 className="mt-2 text-[32px] font-bold text-[#0d2b2b] leading-tight" style={barlow}>
          Contact Our Claims Team
        </h2>
        <p className="mt-4 text-[16px] leading-[1.75] text-[#4a5568]">
          Our claims specialists are available during business hours to assist you. For emergencies outside of business hours, please leave a detailed voicemail and we will return your call as soon as possible.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {/* Contact card */}
          <div className="rounded-2xl bg-[#f5f7fa] p-8">
            <ul className="space-y-4 text-[15px] text-[#0d2b2b]">
              <li>📞 <span className="font-semibold">708-810-1955</span></li>
              <li>✉ <span className="font-semibold">info@custominsure.com</span></li>
              <li>🕐 Monday – Friday | 9:00 AM – 5:00 PM</li>
            </ul>
            <p className="mt-6 text-[13px] italic text-[#4a5568]">
              For urgent matters, please call directly
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={onSubmit}
            className="rounded-2xl border border-[#e2e8f0] bg-white p-8"
          >
            <h3 className="text-[20px] font-bold text-[#0d2b2b]" style={barlow}>Start Your Claim</h3>
            {submitted ? (
              <p className="mt-4 rounded-md border border-green-500/40 bg-green-500/10 p-4 text-[14px] font-semibold text-[#15803d]">
                {SUCCESS_MSG}
              </p>
            ) : (
              <div className="mt-5 space-y-4">
                <Field name="name" label="Full Name *" value={form.name} onChange={onChange} required maxLength={100} />
                <Field name="policy" label="Policy Number *" value={form.policy} onChange={onChange} required maxLength={50} />
                <Field name="phone" label="Phone Number *" value={form.phone} onChange={onChange} required type="tel" maxLength={30} />
                <Field name="email" label="Email Address *" value={form.email} onChange={onChange} required type="email" maxLength={255} />
                <div>
                  <label className="block text-[13px] font-semibold text-[#0d2b2b]">Type of Claim</label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={onChange}
                    className="mt-1 w-full rounded-md border border-[#e2e8f0] bg-white px-3 py-2 text-[14px] text-[#0d2b2b] focus:border-[#3eaa6d] focus:outline-none"
                  >
                    {["Auto", "Trucking", "Property", "General Liability", "Other"].map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#0d2b2b]">Brief Description *</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={onChange}
                    required
                    maxLength={1000}
                    rows={4}
                    className="mt-1 w-full rounded-md border border-[#e2e8f0] bg-white px-3 py-2 text-[14px] text-[#0d2b2b] focus:border-[#3eaa6d] focus:outline-none"
                  />
                </div>
                {status === "error" && (
                  <p className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-[13px] font-semibold text-[#b91c1c]">
                    {ERROR_MSG}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="btn-quote w-full px-6 py-3 text-[14px] uppercase tracking-wider"
                >
                  {status === "sending" ? "Sending…" : "Submit Claim"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* CTA */}
      <section className="bg-dark-gradient px-6 py-[60px] text-center md:px-12">
        <h2 className="text-[32px] font-bold text-white" style={barlow}>
          Questions About Your Coverage?
        </h2>
        <Link to="/contact" className="btn-quote mt-8 inline-block px-10 py-4 text-[14px] uppercase tracking-wider">
          Contact Us
        </Link>
      </section>

      <Footer />
    </main>
  );
};

const Field = ({
  name, label, value, onChange, required, type = "text", maxLength,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
  maxLength?: number;
}) => (
  <div>
    <label className="block text-[13px] font-semibold text-[#0d2b2b]">{label}</label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      type={type}
      maxLength={maxLength}
      className="mt-1 w-full rounded-md border border-[#e2e8f0] bg-white px-3 py-2 text-[14px] text-[#0d2b2b] focus:border-[#3eaa6d] focus:outline-none"
    />
  </div>
);

export default Claims;
