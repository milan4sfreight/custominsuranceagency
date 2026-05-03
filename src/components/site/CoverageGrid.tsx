const coverages = [
  { icon: "🚗", name: "Auto Insurance", desc: "Liability, collision, comprehensive, medical & uninsured motorist protection" },
  { icon: "🏠", name: "Home & Renters", desc: "Protect your home, condo, or rental against damage, theft, and liability" },
  { icon: "🏢", name: "Business & Commercial", desc: "BOP, general liability, commercial auto, workers comp & more" },
  { icon: "🚛", name: "Trucking", desc: "Specialized coverage for owner-operators and fleets in IL & IN" },
  { icon: "❤️", name: "Life & Health", desc: "Term life, permanent life, health plans, long-term care & disability" },
  { icon: "🌊", name: "Flood Insurance", desc: "NFIP-based flood protection for your property and contents" },
  { icon: "🏍", name: "Motorcycle", desc: "Liability, comprehensive, and collision coverage for your ride" },
  { icon: "⛵", name: "Watercraft & Boat", desc: "Comprehensive marine coverage for all vessel types" },
];

export const CoverageGrid = () => {
  return (
    <section className="bg-[hsl(222_47%_11%)] py-20 text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <h2 className="mx-auto max-w-3xl text-center text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Insurance for every part of your life.
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {coverages.map((c) => (
            <div
              key={c.name}
              className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-brand hover:bg-white/10"
            >
              <div className="text-3xl" aria-hidden>{c.icon}</div>
              <h3 className="mt-4 text-lg font-semibold">{c.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-white/70">{c.desc}</p>
              <a
                href="#contact"
                className="mt-4 text-sm font-semibold text-[hsl(220_90%_70%)] transition group-hover:translate-x-1"
              >
                Get a quote →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoverageGrid;