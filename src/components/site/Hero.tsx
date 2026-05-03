import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

const headlineWords = ["Getting", "insurance", "is", "easy."];
const subWords = ["Smarter", "coverage.", "Better", "service.", "Built", "for", "you."];

export const Hero = () => {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yHeadline = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-30%"]);
  const ySub = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] w-full overflow-hidden lg:min-h-screen"
    >
      {/* Soft legibility wash on top of the global parallax bg */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, hsl(210 60% 99% / 0.35) 0%, hsl(210 60% 99% / 0.1) 50%, transparent 100%)",
        }}
      />

      <motion.div
        style={{ y: yHeadline, opacity }}
        className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col px-6 pt-32 pb-12 sm:pt-40 lg:min-h-screen lg:pt-48 lg:px-10"
      >
        <div className="max-w-2xl">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
            }}
            className="font-sans font-extrabold leading-[1.08] tracking-tight text-ink"
            style={{ fontSize: "clamp(28px, 6vw, 64px)" }}
          >
            {headlineWords.map((w, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
                }}
                whileHover={{ scale: 1.06, color: "hsl(var(--brand))" }}
                className="mr-3 inline-block cursor-default transition-colors"
              >
                {w}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            style={{ y: ySub }}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.05, delayChildren: 0.5 } },
            }}
            className="mt-5 max-w-xl text-[16px] font-semibold leading-relaxed text-ink/80 sm:text-[20px]"
          >
            {subWords.map((w, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                }}
                whileHover={{ scale: 1.08, color: "hsl(var(--brand))" }}
                className="mr-1 inline-block cursor-default transition-colors"
              >
                {w}
              </motion.span>
            ))}
          </motion.p>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 pb-8 sm:mt-auto lg:pb-16">
          <motion.a
            href="#contact"
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group inline-flex h-12 items-center gap-3 rounded-full border border-white/40 bg-white/20 pl-5 pr-2 text-sm font-semibold text-ink shadow-[0_8px_32px_-8px_rgba(26,86,255,0.35)] backdrop-blur-md transition-colors hover:bg-white/30"
            style={{
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            get your quote
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/90 text-white transition-transform group-hover:translate-x-0.5">
              <ArrowRight className="h-4 w-4" />
            </span>
          </motion.a>
          <p className="text-sm text-muted-ink">
            A+ rated · 10,000+ businesses covered · Licensed in 50 states
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;