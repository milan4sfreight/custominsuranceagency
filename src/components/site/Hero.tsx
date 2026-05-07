import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-bg.jpg";

export const Hero = () => {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: "100svh" }}
    >
      <img
        className="absolute inset-0 h-full w-full object-cover"
        src={heroImage}
        alt="Aerial view of highway interchange"
      />

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 pt-32 pb-16 sm:pt-36 lg:pt-0 lg:px-10">
        <div className="flex w-full max-w-[900px] flex-col items-center text-center">
          <span
            className="inline-block"
            style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 600, letterSpacing: "3px", fontSize: "12px", textTransform: "uppercase", color: "#2abfbf" }}
          >
            Insurance, reimagined
          </span>

          <h1
            className="mt-5 text-white"
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 800,
              letterSpacing: "-1px",
              fontSize: "clamp(48px, 6vw, 80px)",
              lineHeight: 1.05,
              textTransform: "none",
            }}
          >
            Smarter coverage.
            <br />
            Stronger business.
          </h1>

          <p
            className="mt-6"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: "20px", color: "rgba(255,255,255,0.75)", maxWidth: "600px", textShadow: "0 1px 6px rgba(0,0,0,0.4)" }}
          >
            Insurance solutions built for the road ahead.
          </p>

          <div className="mt-9">
            <Button
              asChild
              size="lg"
              className="btn-quote group h-12 px-7 text-sm"
              style={{ fontFamily: "'Inter', sans-serif", minWidth: "200px" }}
            >
              <Link to="/get-a-quote">
                Get a Quote
                <span className="ml-2 inline-flex h-7 w-7 items-center justify-center rounded-full" style={{ background: "rgba(255,255,255,0.22)" }}>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Button>
          </div>

          <p
            className="mt-10 text-xs sm:text-sm"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, color: "rgba(255,255,255,0.6)" }}
          >
            A+ rated · 10,000+ businesses covered · Licensed in 50 states
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
