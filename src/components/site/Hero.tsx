import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import skyline from "@/assets/chicago-skyline.jpg";
import quoteGlass from "@/assets/quote-glass.png";

export const Hero = () => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${skyline})` }}
        aria-hidden
      />
      {/* Overlay gradients for legibility */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(115deg, hsl(210 50% 99% / 0.96) 0%, hsl(210 60% 97% / 0.85) 38%, hsl(210 60% 95% / 0.45) 65%, hsl(210 60% 90% / 0.15) 100%)",
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(70% 60% at 15% 35%, hsl(0 0% 100% / 0.7) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-10 px-6 pb-16 pt-32 lg:grid-cols-12 lg:px-10 lg:pt-36">
        {/* Left: copy */}
        <div className="lg:col-span-6">
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
            Smarter coverage. Better service. Built for modern businesses and the
            people who run them.
          </p>

          <div className="mt-10">
            <Button
              size="lg"
              className="group h-14 rounded-full bg-brand-gradient px-8 text-base font-semibold text-brand-foreground shadow-brand-glow transition-transform hover:-translate-y-0.5 hover:opacity-95"
            >
              Get Your Quote
              <ArrowRight className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          <p className="mt-6 text-sm text-muted-ink">
            A+ rated · 10,000+ businesses covered · Licensed in 50 states
          </p>
        </div>

        {/* Right: visual */}
        <div className="relative lg:col-span-6">
          <div className="relative mx-auto max-w-xl lg:max-w-none">
            <div
              className="absolute inset-0 -z-10 blur-3xl"
              style={{
                background:
                  "radial-gradient(50% 50% at 50% 50%, hsl(220 90% 60% / 0.25) 0%, transparent 70%)",
              }}
              aria-hidden
            />
            <img
              src={quoteGlass}
              alt="Translucent blue glass 'quote' sculpture with a professional woman seated on top working on a laptop"
              className="relative h-auto w-full object-contain drop-shadow-2xl"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;