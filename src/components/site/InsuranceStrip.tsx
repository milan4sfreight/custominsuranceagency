const items = [
  { icon: "🚗", label: "Auto" },
  { icon: "🏠", label: "Homeowners" },
  { icon: "🏠", label: "Renters" },
  { icon: "🚛", label: "Trucking" },
  { icon: "🏢", label: "Business & Commercial" },
  { icon: "❤️", label: "Life & Health" },
  { icon: "🌊", label: "Flood" },
  { icon: "🏍", label: "Motorcycle" },
  { icon: "⛵", label: "Watercraft & Boat" },
  { icon: "🚐", label: "Limousine" },
  { icon: "🏕", label: "Recreational Vehicle" },
];

export const InsuranceStrip = () => {
  return (
    <section className="bg-brand text-brand-foreground">
      <div className="mx-auto max-w-7xl overflow-x-auto px-4 py-4">
        <ul className="flex min-w-max items-center gap-8">
          {items.map((it) => (
            <li key={it.label} className="flex items-center gap-2 whitespace-nowrap text-sm font-medium">
              <span className="text-lg" aria-hidden>{it.icon}</span>
              <span>{it.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default InsuranceStrip;