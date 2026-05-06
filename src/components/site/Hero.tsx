import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroVideo from "@/assets/hero-bg.mp4";

export const Hero = () => {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: "100svh" }}
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={heroVideo}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      {/* Left-to-right overlay for text readability */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(5,25,55,0.78) 0%, rgba(5,25,55,0.55) 30%, rgba(5,25,55,0.25) 55%, rgba(5,25,55,0) 75%)",
        }}
      />
      {/* Mobile: subtle top shade so text reads on smaller screens */}
      <div
        aria-hidden
        className="absolute inset-0 lg:hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(5,25,55,0.65) 0%, rgba(5,25,55,0.25) 45%, rgba(5,25,55,0) 75%)",
        }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-start px-6 pt-32 sm:pt-36 lg:items-center lg:pt-0 lg:px-10">
        <div className="w-full lg:w-2/5 lg:pt-[15vh]">
          <div className="max-w-[520px]">
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.18em] text-brand-soft/90">
              Insurance, reimagined
            </span>

            <h1
              className="mt-5 font-display font-semibold tracking-tight text-white"
              style={{ fontSize: "clamp(36px, 4.6vw, 64px)", lineHeight: 1.05 }}
            >
              Smarter coverage.
              <br />
              Stronger business.
            </h1>

            <p
              className="mt-6 text-base leading-relaxed text-white/85 sm:text-lg"
              style={{ textShadow: "0 1px 6px rgba(0,0,0,0.4)" }}
            >
              Insurance solutions built for the road ahead.
            </p>

            <div className="mt-9">
              <Button
                asChild
                size="lg"
                className="group h-12 rounded-full bg-brand-gradient px-7 text-sm font-semibold text-brand-foreground shadow-brand-glow transition-all hover:-translate-y-0.5 hover:opacity-95"
              >
                <Link to="/get-a-quote">
                  Get a Quote
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </div>

            <p className="mt-10 text-xs text-white/70 sm:text-sm">
              A+ rated · 10,000+ businesses covered · Licensed in 50 states
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
