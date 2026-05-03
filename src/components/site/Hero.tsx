import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.png";

export const Hero = () => {
  return (
    <section className="relative min-h-[90vh] w-full overflow-hidden lg:min-h-screen">
      <img
        src={heroBg}
        alt="Chicago skyline across Lake Michigan with a professional woman seated on a translucent glass 'quote' sculpture"
        className="absolute inset-0 h-full w-full object-cover object-center"
        loading="eager"
      />
      {/* Subtle left-side legibility wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, hsl(210 60% 99% / 0.55) 0%, hsl(210 60% 99% / 0.2) 35%, transparent 60%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-[90vh] max-w-7xl flex-col justify-center px-6 pt-32 pb-24 lg:min-h-screen lg:px-10">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-3">
            <span className="h-px w-8 bg-brand-gradient" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              Insurance, reimagined
            </span>
          </div>

          <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl">
            Getting insurance is easy.
            <br />
            Getting it{" "}
            <span className="text-brand-gradient italic">right isn't.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-ink">
            Smarter coverage. Better service. Built for modern businesses and
            the people who run them.
          </p>

          <div className="mt-10">
            <Button
              size="lg"
              className="group h-14 rounded-full bg-[#1a56ff] pl-7 pr-2 text-base font-semibold text-white shadow-brand-glow transition-transform hover:-translate-y-0.5 hover:bg-[#1a56ff]/95"
            >
              get your quote
              <span className="ml-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 transition-transform group-hover:translate-x-0.5">
                <ArrowRight className="h-5 w-5 text-white" />
              </span>
            </Button>
          </div>

          <p className="mt-6 text-sm text-muted-ink">
            A+ rated · 10,000+ businesses covered · Licensed in 50 states
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;