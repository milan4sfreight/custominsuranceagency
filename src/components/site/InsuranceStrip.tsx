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
        className="mx-auto max-w-6xl overflow-x-auto rounded-2xl border px-6 py-4"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderColor: "rgba(255, 255, 255, 0.15)",
        }}
      >
        <ul className="flex min-w-max items-center justify-center gap-5">
          {items.map((label, i) => (
            <li key={label} className="flex items-center gap-5 whitespace-nowrap">
              <a
                href="#"
                className="font-sans text-[14px] text-white/70 transition-colors hover:text-white"
                style={{ letterSpacing: "0.5px" }}
              >
                {label}
              </a>
              {i < items.length - 1 && (
                <span className="text-white/30" aria-hidden>·</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InsuranceStrip;