const items = [
  "Auto",
  "Homeowners",
  "Renters",
  "Trucking",
  "Business & Commercial",
  "Life & Health",
  "Flood",
  "Motorcycle",
  "Watercraft & Boat",
  "Limousine",
  "Recreational Vehicle",
];

export const InsuranceStrip = () => {
  return (
    <div className="relative z-20 -mt-12 px-4 sm:-mt-16 lg:-mt-20 lg:px-10">
      <div
        className="mx-auto max-w-6xl overflow-x-auto rounded-2xl px-6 py-5 shadow-lg"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderTop: "1px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        <ul className="flex min-w-max items-center justify-center gap-5">
          {items.map((label, i) => (
            <li key={label} className="flex items-center gap-5 whitespace-nowrap">
              <a
                href="#"
                className="font-sans text-[15px] font-semibold text-white transition-colors hover:text-white/80"
                style={{ letterSpacing: "0.5px", textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}
              >
                {label}
              </a>
              {i < items.length - 1 && (
                <span className="text-white/50" aria-hidden>·</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InsuranceStrip;