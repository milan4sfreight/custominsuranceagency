import {
  Car,
  Home,
  Building2,
  Truck,
  HeartPulse,
  Waves,
  Bike,
  Sailboat,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

type Coverage = { icon: LucideIcon; name: string; desc: string };

const coverages: Coverage[] = [
  { icon: Car, name: "Auto", desc: "Liability, collision & comprehensive protection." },
  { icon: Home, name: "Home & Renters", desc: "Protect your home, condo, or rental." },
  { icon: Building2, name: "Business", desc: "BOP, liability, commercial auto & workers comp." },
  { icon: Truck, name: "Trucking", desc: "Coverage for owner-operators and fleets." },
  { icon: HeartPulse, name: "Life & Health", desc: "Term, permanent life, health & disability." },
  { icon: Waves, name: "Flood", desc: "NFIP-based flood protection for your property." },
  { icon: Bike, name: "Motorcycle", desc: "Liability, comprehensive & collision for your ride." },
  { icon: Sailboat, name: "Watercraft", desc: "Marine coverage for all vessel types." },
];

export const CoverageGrid = () => {
  return (
    <section id="coverage" className="bg-transparent py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#f5821f]">
          Coverage
        </p>
        <h2
          className="mx-auto mt-3 max-w-3xl text-center font-bold tracking-tight text-[#0b1530]"
          style={{ fontSize: "clamp(24px, 5vw, 48px)" }}
        >
          Insurance for every part of your life.
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {coverages.map(({ icon: Icon, name, desc }) => (
            <div
              key={name}
              className="group flex flex-col rounded-2xl border border-white/40 bg-white/65 p-6 backdrop-blur-md transition-all hover:-translate-y-1 hover:border-[#1a6dd4]/40 hover:bg-white/85 hover:shadow-[0_12px_40px_-16px_rgba(26,109,212,0.3)]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f0f6ff] text-[#1a6dd4]">
                <Icon className="h-5 w-5" strokeWidth={2} />
              </span>
              <h3 className="mt-5 text-base font-semibold text-[#0b1530]">{name}</h3>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-600">{desc}</p>
              <Link
                to="/get-a-quote"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#1a6dd4] transition-transform group-hover:translate-x-0.5"
              >
                Get a quote <span aria-hidden>→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoverageGrid;