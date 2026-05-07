import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import { Button } from "@/components/ui/button";

const HERO_IMG = "https://images.unsplash.com/photo-1521791136064-7986c2920216";

const benefits = [
  { icon: "💼", title: "Competitive Compensation", text: "We offer competitive salaries and performance-based incentives to reward your hard work." },
  { icon: "🏥", title: "Health & Benefits", text: "Comprehensive health, dental, and vision insurance to keep you and your family covered." },
  { icon: "🏡", title: "Flexible Environment", text: "We support work-life balance with flexible scheduling and a positive team atmosphere." },
];

const awards = [
  { title: "Best Workplace", text: "Recognized as one of the best workplaces in financial services & insurance" },
  { title: "Great Place to Work™", text: "Certified with scores in the top percentile nationwide" },
  { title: "Fastest Growing", text: "Recognized among the fastest-growing independent insurance agencies in the U.S." },
];

type Job = {
  title: string;
  category: string;
  type: string;
  location: string;
  workMode: string;
  description: string;
  featured?: boolean;
};

const jobs: Job[] = [
  { title: "Insurance Account Representative", category: "Sales", type: "Full Time", workMode: "On-site", location: "La Grange, IL", description: "Join our growing sales team and help clients find the best insurance coverage for their needs." },
  { title: "Customer Service Representative", category: "Service", type: "Full Time", workMode: "On-site", location: "La Grange, IL", description: "Provide exceptional service to our existing clients and help them navigate their insurance needs." },
  { title: "Commercial Insurance Specialist — Trucking", category: "Operations", type: "Full Time", workMode: "On-site", location: "La Grange, IL", description: "Specialize in trucking and commercial insurance products for our growing fleet of transportation clients." },
  { title: "Insurance Data & Quality Specialist", category: "Technology", type: "Full Time", workMode: "On-site", location: "La Grange, IL", description: "Help maintain data integrity and quality across our insurance management systems." },
  { title: "Sales Representative — Summer 2026 Start", category: "Sales", type: "Full Time", workMode: "On-site", location: "La Grange, IL", description: "We are hiring motivated sales representatives for our Summer 2026 class. No insurance experience required — we train you.", featured: true },
];

const Pill = ({ children, color }: { children: React.ReactNode; color: "green" | "gray" | "orange" }) => {
  const styles =
    color === "green"
      ? "bg-[#3eaa6d] text-white"
      : color === "orange"
        ? "text-white"
        : "bg-[#f1f5f9] text-[#4a5568]";
  const inline =
    color === "orange"
      ? { background: "linear-gradient(135deg, #f5821f 0%, #f5c518 100%)" }
      : undefined;
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[12px] font-semibold ${styles}`}
      style={inline}
    >
      {children}
    </span>
  );
};

const JobCard = ({ job }: { job: Job }) => {
  const wrapperStyle = job.featured
    ? {
        background: "linear-gradient(135deg, #f5821f 0%, #f5c518 100%)",
        padding: "2px",
        borderRadius: "14px",
      }
    : undefined;

  const card = (
    <div className="rounded-[12px] border border-[#e2e8f0] bg-white p-6 transition hover:shadow-md">
      <div className="flex items-start gap-2">
        {job.featured && <Star className="mt-1 h-5 w-5 fill-[#f5c518] text-[#f5821f]" />}
        <h3 className="text-[18px] font-bold text-[#0d2b2b]" style={{ fontFamily: "'Barlow', sans-serif" }}>{job.title}</h3>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {job.featured && <Pill color="orange">Featured</Pill>}
        <Pill color="green">{job.category}</Pill>
        <Pill color="gray">{job.type}</Pill>
        {!job.featured && <Pill color="gray">{job.workMode}</Pill>}
        <Pill color="gray">{job.location}</Pill>
      </div>
      <p className="mt-4 text-[14px] leading-[1.6] text-[#4a5568]">{job.description}</p>
      <div className="mt-5">
        {job.featured ? (
          <a href="#" className="btn-quote inline-block px-6 py-2 text-[13px] uppercase tracking-wider">
            Apply Now →
          </a>
        ) : (
          <a
            href="#"
            className="inline-flex items-center rounded-full border-2 border-[#3eaa6d] bg-transparent px-5 py-2 text-[13px] font-semibold uppercase tracking-wider text-[#3eaa6d] transition hover:bg-[#3eaa6d] hover:text-white"
          >
            Apply Now →
          </a>
        )}
      </div>
    </div>
  );

  return job.featured ? <div style={wrapperStyle}>{card}</div> : card;
};

const Careers = () => {
  return (
    <main className="min-h-screen bg-white font-['Inter',sans-serif]">
      <SEO title="Careers | Custom Insurance Agency — Join Our Team" description="Join the Custom Insurance Agency team. We are hiring insurance professionals in the Chicago area. View open positions and apply today." />
      <Navbar />

      {/* HERO */}
      <section
        className="relative flex h-[300px] w-full flex-col items-center justify-center pt-16"
        style={{ backgroundImage: `url(${HERO_IMG})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.6)" }} />
        <div className="relative z-10 text-center text-white">
          <h1 style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700, fontSize: "52px", lineHeight: 1.1 }}>
            Careers
          </h1>
          <p className="mt-2 text-[18px] text-white/85" style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 500 }}>
            Join Our Growing Team
          </p>
        </div>
      </section>

      {/* MAIN */}
      <div className="mx-auto w-full max-w-[900px] px-6 py-[60px] md:px-12">
        {/* Culture */}
        <section>
          <p className="text-[11px] font-semibold uppercase tracking-[2px] text-[#2abfbf]" style={{ fontFamily: "'Barlow', sans-serif" }}>Our Culture</p>
          <h2 className="mt-2 text-[32px] font-bold text-[#0d2b2b] leading-tight" style={{ fontFamily: "'Barlow', sans-serif" }}>A Great Place to Work & Grow</h2>
          <p className="mt-4 text-[16px] leading-[1.75] text-[#4a5568]">
            At Custom Insurance Agency, we bring a vibrant and energetic culture to the transportation insurance space. Our Culture First approach empowers team members by prioritizing their workplace experience. We emphasize efficiency through technology and innovation, paying close attention to those closest to our processes — our team members.
          </p>
        </section>

        {/* Why Join Us */}
        <section className="mt-12 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="rounded-2xl border-t-[3px] border-t-[#3eaa6d] bg-[#f5f7fa] p-7"
            >
              <div className="text-[32px]">{b.icon}</div>
              <h3 className="mt-3 text-[18px] font-bold text-[#0d2b2b]" style={{ fontFamily: "'Barlow', sans-serif" }}>{b.title}</h3>
              <p className="mt-3 text-[15px] leading-[1.7] text-[#4a5568]">{b.text}</p>
            </div>
          ))}
        </section>
      </div>

      {/* Awards */}
      <section className="bg-[#0d2b2b] px-6 py-12 text-center text-white md:px-12">
        <div className="mx-auto max-w-[900px]">
          <p className="text-[11px] font-semibold uppercase tracking-[2px] text-[#2abfbf]" style={{ fontFamily: "'Barlow', sans-serif" }}>Recognition</p>
          <h2 className="mt-2 text-[28px] font-bold" style={{ fontFamily: "'Barlow', sans-serif" }}>Award-Winning Workplace</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {awards.map((a) => (
              <div
                key={a.title}
                className="rounded-[12px] border p-6 text-center"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  borderColor: "rgba(255,255,255,0.1)",
                }}
              >
                <h3 className="text-[18px] font-bold text-white" style={{ fontFamily: "'Barlow', sans-serif" }}>{a.title}</h3>
                <p className="mt-3 text-[14px] leading-[1.6] text-white/70">{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <div className="mx-auto w-full max-w-[900px] px-6 py-[60px] md:px-12">
        <section>
          <p className="text-[11px] font-semibold uppercase tracking-[2px] text-[#2abfbf]" style={{ fontFamily: "'Barlow', sans-serif" }}>Join Our Team</p>
          <h2 className="mt-2 text-[32px] font-bold text-[#0d2b2b] leading-tight" style={{ fontFamily: "'Barlow', sans-serif" }}>Current Open Positions</h2>
          <p className="mt-3 text-[16px] leading-[1.7] text-[#4a5568]">
            We are always looking for talented individuals to join our team. See our current openings below.
          </p>

          <div className="mt-8 flex flex-col gap-5">
            {jobs.map((j) => (
              <JobCard key={j.title} job={j} />
            ))}
          </div>

          <p className="mt-8 text-center text-[14px] italic text-[#718096]">
            Don't see a position that fits? Send your resume to info@custominsure.com and we'll keep you in mind for future openings.
          </p>
        </section>
      </div>

      {/* CTA */}
      <section className="bg-[#0d2b2b] px-6 py-[60px] text-center md:px-12">
        <h2 className="text-[32px] font-bold text-white" style={{ fontFamily: "'Barlow', sans-serif" }}>Ready to Join the Team?</h2>
        <p className="mx-auto mt-4 max-w-[640px] text-[16px] text-white/60">
          Send us your resume and let's start a conversation.
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

export default Careers;