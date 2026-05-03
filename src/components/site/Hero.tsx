import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.png";

export const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMouse({ x, y });
    };
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const headlineTransform = `translate3d(${mouse.x * -14}px, ${mouse.y * -8 + scrollY * 0.08}px, 0)`;
  const tagTransform = `translate3d(${mouse.x * 18}px, ${mouse.y * 12 + scrollY * 0.18}px, 0)`;

  return (
    <section ref={sectionRef} className="relative min-h-[100svh] w-full overflow-hidden lg:min-h-screen">
      <img
        src={heroBg}
        alt="Custom Insurance Agency branded semi truck on an open highway under a bright blue sky"
        className="absolute inset-0 h-full w-full object-cover object-[78%_bottom] lg:object-center"
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

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col px-6 pt-32 pb-12 sm:pt-40 lg:min-h-screen lg:pt-48 lg:px-10">
        <div className="max-w-2xl">
          <h1
            className="font-sans font-extrabold leading-[1.08] tracking-tight text-ink will-change-transform transition-transform duration-300 ease-out"
            style={{ fontSize: "clamp(28px, 6vw, 64px)", transform: headlineTransform }}
          >
            <span className="inline-block transition-transform duration-300 hover:-translate-y-1 hover:text-brand">Getting</span>{" "}
            <span className="inline-block transition-transform duration-300 hover:-translate-y-1 hover:text-brand">insurance</span>
            <br />
            <span className="inline-block transition-transform duration-300 hover:-translate-y-1 hover:text-brand">is</span>{" "}
            <span className="inline-block transition-transform duration-300 hover:-translate-y-1 hover:text-brand">not</span>{" "}
            <span className="inline-block transition-transform duration-300 hover:-translate-y-1 hover:text-brand">the</span>{" "}
            <span className="inline-block transition-transform duration-300 hover:-translate-y-1 hover:text-brand">same</span>
            <br />
            <span className="inline-block transition-transform duration-300 hover:-translate-y-1 hover:text-brand">as</span>{" "}
            <span className="inline-block transition-transform duration-300 hover:-translate-y-1 hover:text-brand">getting</span>{" "}
            <span className="inline-block transition-transform duration-300 hover:-translate-y-1 hover:text-brand">insurance</span>
            <br />
            <span className="text-brand">
              {"with custom insurance.".split(" ").map((w, i) => (
                <span
                  key={i}
                  className="inline-block transition-transform duration-300 hover:-translate-y-1 hover:scale-105"
                >
                  {w}{i < 2 ? "\u00A0" : ""}
                </span>
              ))}
            </span>
          </h1>

          <p
            className="mt-5 max-w-xl text-[16px] font-semibold leading-relaxed text-white sm:text-[20px] will-change-transform transition-transform duration-300 ease-out"
            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)", transform: tagTransform }}
          >
            {["Smarter coverage.", "Better service.", "Built for you."].map((s, i) => (
              <span
                key={i}
                className="mr-2 inline-block cursor-default transition-transform duration-300 hover:-translate-y-0.5 hover:text-brand-soft"
              >
                {s}
              </span>
            ))}
          </p>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 pb-8 sm:mt-auto lg:pb-16">
          <Button
            size="lg"
            className="group relative h-12 w-[90%] max-w-[240px] justify-between overflow-hidden rounded-full pl-6 pr-1.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 sm:w-auto sm:justify-center"
            style={{
              background:
                "linear-gradient(135deg, hsl(220 90% 60% / 0.35) 0%, hsl(220 90% 45% / 0.45) 100%)",
              backdropFilter: "blur(14px) saturate(140%)",
              WebkitBackdropFilter: "blur(14px) saturate(140%)",
              border: "1px solid hsl(220 100% 85% / 0.45)",
              boxShadow:
                "0 10px 30px -10px hsl(220 90% 40% / 0.45), inset 0 1px 0 hsl(0 0% 100% / 0.35)",
              letterSpacing: "0.3px",
            }}
          >
            <span className="relative z-10">get your quote</span>
            <span
              className="relative z-10 ml-3 flex h-9 w-9 items-center justify-center rounded-full transition-transform group-hover:translate-x-0.5"
              style={{
                background:
                  "linear-gradient(135deg, hsl(0 0% 100% / 0.35), hsl(0 0% 100% / 0.1))",
                border: "1px solid hsl(0 0% 100% / 0.4)",
              }}
            >
              <ArrowRight className="h-4 w-4 text-white" />
            </span>
            {/* Glass highlight to visually continue the sculpture */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 -top-6 h-10"
              style={{
                background:
                  "linear-gradient(180deg, hsl(0 0% 100% / 0.4), transparent)",
                filter: "blur(6px)",
              }}
            />
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