import logo from "@/assets/logo.png";

const quoteLinks: { label: string; href: string }[] = [
  { label: "Auto", href: "#" },
  { label: "Homeowners", href: "#" },
  { label: "Renters", href: "#" },
  { label: "Business", href: "#" },
  { label: "Life & Health", href: "#" },
  { label: "OCC/ACC Enrollment", href: "/occ-accident-enrollment" },
];
const moreLinks = ["Trucking", "Flood", "Motorcycle", "Watercraft & Boat", "Recreational Vehicle"];
const companyLinks: { label: string; href: string }[] = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Company News", href: "/company-news" },
  { label: "Careers", href: "/careers" },
  { label: "Claims", href: "/claims" },
  { label: "Resources", href: "/resources" },
  { label: "Client Login", href: "/client-login" },
  { label: "Carriers", href: "#" },
  { label: "Privacy", href: "#" },
];

export const Footer = () => {
  return (
    <footer className="bg-dark-gradient text-white/75">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <img src={logo} alt="Custom Insurance Agency" className="h-[44px] w-auto" />
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Independent insurance agency serving Illinois & Indiana with smarter coverage and friendly local service.
            </p>
            <p className="mt-4 text-sm text-white/60">
              1333 Burr Ridge Pkwy STE 200, Burr Ridge, IL 60527<br />
              708-810-1955
            </p>
          </div>
          <FooterCol title="Get a Quote" links={quoteLinks} />
          <FooterCol title="More Coverage" links={moreLinks} />
          <FooterCol title="Company" links={companyLinks} />
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-xs leading-relaxed text-white/50">
          <p>
            Any submissions or payments made via this website do not constitute a binding agreement to your policy or coverages. Changes and payments to policies are not effective or binding until you receive official notice from your agent or insurance company. We will not resell your information to any third-party.
          </p>
          <p className="mt-4">© {new Date().getFullYear()} Custom Insurance. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const FooterCol = ({
  title,
  links,
}: {
  title: string;
  links: string[] | { label: string; href: string }[];
}) => (
  <div>
    <h4 className="text-sm font-semibold uppercase tracking-wider text-white">{title}</h4>
    <ul className="mt-4 space-y-2 text-sm">
      {links.map((l) => {
        const label = typeof l === "string" ? l : l.label;
        const href = typeof l === "string" ? "#" : l.href;
        return (
          <li key={label}>
            <a href={href} className="transition hover:text-white">
              {label}
            </a>
          </li>
        );
      })}
    </ul>
  </div>
);

export default Footer;