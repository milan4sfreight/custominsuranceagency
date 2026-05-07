import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import { Button } from "@/components/ui/button";

const HERO_IMG = "https://images.unsplash.com/photo-1504711434969-e33886168f5c";

const newsItems = [
  { date: "October 2025", title: "Custom Insurance Agency Named Top Company for Women in Transportation", desc: "We are proud to be recognized for our commitment to diversity and inclusion in the transportation insurance industry." },
  { date: "September 2025", title: "Custom Insurance Agency Joins The Council of Insurance Agents & Brokers", desc: "Custom Insurance Agency has been accepted as a member of one of the most prestigious insurance industry organizations." },
  { date: "September 2025", title: "Custom Insurance Agency Earns Great Place To Work Certification™", desc: "Our team culture and employee satisfaction has been officially recognized with the Great Place To Work Certification." },
  { date: "July 2025", title: "Annual Trucking Matters Seminar Series 2025 Recap", desc: "Our annual seminar brought together industry leaders to discuss the latest trends and challenges in trucking insurance." },
  { date: "January 2025", title: "Custom Insurance Agency Launches New Coverage Solutions", desc: "We are excited to announce the launch of new specialty coverage products designed for the modern transportation industry." },
  { date: "October 2024", title: "Custom Insurance Agency Named Top Company for Women in Transportation", desc: "For the second consecutive year, we have been recognized for creating an outstanding workplace for women in transportation." },
  { date: "September 2024", title: "Ranked Among Best Workplaces in Financial Services & Insurance", desc: "Custom Insurance Agency has been ranked among the top workplaces in the financial services and insurance sector." },
  { date: "June 2024", title: "Annual Trucking Matters Seminar Series Recap", desc: "Another successful year of bringing the trucking and insurance communities together for education and networking." },
  { date: "August 2023", title: "Custom Insurance Agency Honored as One of Fastest-Growing Private Companies", desc: "We are proud to be recognized among the fastest-growing private companies in the United States." },
  { date: "March 2023", title: "Custom Insurance Agency Expands to Serve More Markets", desc: "We are growing our team and expanding our reach to better serve clients across Illinois, Indiana, and beyond." },
  { date: "August 2022", title: "Custom Insurance Agency Ranks in Top Commercial Insurance Agencies", desc: "Independent rankings place Custom Insurance Agency among the top commercial insurance agencies in the country." },
  { date: "August 2021", title: "Custom Insurance Agency Celebrates Consecutive Year on Growth List", desc: "We continue to grow year over year, driven by our commitment to exceptional client service." },
];

const PAGE_SIZE = 6;

const CompanyNews = () => {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const shown = newsItems.slice(0, visible);

  return (
    <main className="min-h-screen bg-white font-['Inter',sans-serif]">
      <Navbar />

      {/* HERO */}
      <section
        className="relative flex h-[300px] w-full items-center justify-center pt-16"
        style={{ backgroundImage: `url(${HERO_IMG})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.6)" }} />
        <h1
          className="relative z-10 text-center text-white"
          style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700, fontSize: "52px" }}
        >
          Company News
        </h1>
      </section>

      {/* MAIN CONTENT */}
      <div className="mx-auto w-full max-w-[900px] px-6 py-[60px] md:px-12">
        <p
          className="text-[11px] font-semibold uppercase tracking-[2px] text-[#2abfbf]"
          style={{ fontFamily: "'Barlow', sans-serif" }}
        >
          Latest Updates
        </p>
        <h2
          className="mt-2 text-[36px] font-bold text-[#0d2b2b] leading-tight"
          style={{ fontFamily: "'Barlow', sans-serif" }}
        >
          News & Announcements
        </h2>
        <p className="mt-3 text-[16px] leading-[1.7] text-[#4a5568]">
          Stay up to date with the latest news from Custom Insurance Agency.
        </p>

        <ul className="mt-8">
          {shown.map((n, i) => (
            <li
              key={i}
              className="border-b border-[#e2e8f0] py-6 transition hover:bg-[#f5f7fa]"
            >
              <div className="grid gap-2 md:grid-cols-[140px_1fr] md:gap-6 md:px-2">
                <div className="text-[13px] font-semibold text-[#3eaa6d]">{n.date}</div>
                <div>
                  <h3
                    className="text-[18px] font-semibold text-[#0d2b2b] leading-snug"
                    style={{ fontFamily: "'Barlow', sans-serif" }}
                  >
                    {n.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-[1.6] text-[#4a5568]">{n.desc}</p>
                  <a href="#" className="mt-3 inline-block text-[14px] font-semibold text-[#3eaa6d] hover:underline">
                    Read More →
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {visible < newsItems.length && (
          <div className="mt-10 flex justify-center">
            <Button
              variant="outline"
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="rounded-full border-2 border-[#3eaa6d] bg-transparent px-8 py-2 text-[13px] font-semibold uppercase tracking-[2px] text-[#3eaa6d] hover:bg-[#3eaa6d] hover:text-white"
            >
              Load More
            </Button>
          </div>
        )}
      </div>

      {/* CTA */}
      <section className="bg-[#0d2b2b] px-6 py-[60px] text-center md:px-12">
        <h2
          className="text-[32px] font-bold text-white"
          style={{ fontFamily: "'Barlow', sans-serif" }}
        >
          Want to Learn More About Us?
        </h2>
        <Link
          to="/about"
          className="btn-quote mt-8 inline-block px-10 py-4 text-[14px] uppercase tracking-wider"
        >
          About Us
        </Link>
      </section>

      <Footer />
    </main>
  );
};

export default CompanyNews;