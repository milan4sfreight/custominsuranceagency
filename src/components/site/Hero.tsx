import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-bg.jpg";

export const Hero = () => {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: "100svh", display: "flex", flexDirection: "column" }}
    >
      <img
        className="absolute inset-0 h-full w-full object-cover"
        src={heroImage}
        alt="Aerial view of highway interchange"
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.45) 40%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.75) 100%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* CENTER CONTENT */}
      <div
        className="relative mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-6 pt-32 pb-8 sm:pt-36 lg:pt-0 lg:px-10"
        style={{ zIndex: 2 }}
      >
        <div className="flex w-full max-w-[900px] flex-col items-center text-center">
          <span
            className="inline-block"
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 500,
              letterSpacing: "3px",
              fontSize: "12px",
              textTransform: "uppercase",
              color: "#2abfbf",
              marginBottom: "20px",
            }}
          >
            Insurance, reimagined
          </span>
          <h1
            className="text-white text-center"
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 600,
              letterSpacing: "-0.5px",
              fontSize: "clamp(40px, 5vw, 68px)",
              lineHeight: 1.1,
            }}
          >
            Customized Coverage By Trucking Experts
          </h1>
          <p
            className="mt-6 text-center"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300,
              fontSize: "clamp(16px, 1.8vw, 20px)",
              color: "rgba(255,255,255,0.75)",
              maxWidth: "600px",
              textShadow: "0 1px 6px rgba(0,0,0,0.4)",
              marginBottom: "36px",
            }}
          >
            Insurance solutions built for the road ahead.
          </p>
          <Button
            asChild
            size="lg"
            className="btn-quote group h-12 px-7 text-sm"
            style={{ fontFamily: "'Inter', sans-serif", minWidth: "200px" }}
          >
            <Link to="/get-a-quote">
              Get a Quote
              <span
                className="ml-2 inline-flex h-7 w-7 items-center justify-center rounded-full"
                style={{ background: "rgba(255,255,255,0.22)" }}
              >
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </Button>
          <p
            className="text-xs sm:text-sm"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              color: "rgba(255,255,255,0.6)",
              marginTop: "24px",
            }}
          >
            A+ rated · 10,000+ businesses covered · Licensed in 50 states
          </p>
        </div>
      </div>

      {/* BOTTOM TAGLINE — own flex row, vertically centered in remaining space */}
      <div
        className="relative flex flex-1 items-center justify-center px-6 pb-8"
        style={{ zIndex: 2, maxHeight: "180px" }}
      >
        <p
          className="text-center text-[18px] md:text-[38px]"
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 700,
            color: "#ffffff",
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          Loyalty First. Local Roots. National Reach.
        </p>
      </div>
    </section>
  );
};

export default Hero;
