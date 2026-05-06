import logo from "@/assets/logo.png";

const quoteLinks = ["Auto", "Homeowners", "Renters", "Business", "Life & Health"];
const moreLinks = ["Trucking", "Flood", "Motorcycle", "Watercraft & Boat", "Recreational Vehicle"];
const companyLinks = ["About", "Contact", "Carriers", "Claims", "Privacy"];

export const Footer = () => {
  return (
    <footer className="bg-[#0d2b2b] text-white/75">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <img src={logo} alt="Custom Insurance Agency" className="h-[44px] w-auto" />
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Independent insurance agency serving Illinois & Indiana with smarter coverage and friendly local service.
            </p>
            <p className="mt-4 text-sm text-white/60">
              882 62nd St, La Grange Highlands, IL 60525<br />
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

const FooterCol = ({ title, links }: { title: string; links: string[] }) => (
  <div>
    <h4 className="text-sm font-semibold uppercase tracking-wider text-white">{title}</h4>
    <ul className="mt-4 space-y-2 text-sm">
      {links.map((l) => (
        <li key={l}>
          <a href="#" className="transition hover:text-white">{l}</a>
        </li>
      ))}
    </ul>
  </div>
);

export default Footer;