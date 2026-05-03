import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.png";

export const Hero = () => {
  return (
    <section className="relative min-h-[90vh] w-full overflow-hidden lg:min-h-screen">
      <img
        src={heroBg}
        alt="Chicago skyline across Lake Michigan with a professional woman seated on a translucent glass 'quote' sculpture"
        className="absolute inset-0 h-full w-full object-cover object-[right_center]"
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

      <div className="relative mx-auto flex min-h-[90vh] max-w-7xl flex-col px-6 pt-40 pb-16 lg:min-h-screen lg:pt-48 lg:px-10">
        <div className="max-w-2xl">
          <h1 className="font-sans text-[40px] font-extrabold leading-[1.08] tracking-tight text-ink sm:text-[48px] lg:text-[52px]">
            Getting insurance
            <br />
            is not the same
            <br />
            as getting insurance
            <br />
            <span className="text-brand">with custom insurance.</span>
          </h1>

          <p
            className="mt-6 max-w-xl text-[18px] font-semibold leading-relaxed text-white sm:text-[20px]"
            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
          >
            Smarter coverage. Better service. Built for you.
          </p>
        </div>

        <div className="mt-auto flex flex-col items-center gap-4 pb-8 lg:pb-16">
          <Button
            size="lg"
            className="group h-14 rounded-full bg-[#1a56ff] pl-7 pr-2 text-base font-semibold text-white shadow-brand-glow transition-transform hover:-translate-y-0.5 hover:bg-[#1a56ff]/95"
          >
            get your
            <span className="ml-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 transition-transform group-hover:translate-x-0.5">
              <ArrowRight className="h-5 w-5 text-white" />
            </span>
          </Button>
          <p className="text-sm text-muted-ink">
            A+ rated · 10,000+ businesses covered · Licensed in 50 states
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;