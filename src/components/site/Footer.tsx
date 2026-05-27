import logo from "@/assets/logo.png";
import footerBg from "@/assets/footer-bg.jpg";

const quoteLinks: { label: string; href: string }[] = [
  { label: "Commercial Trucking", href: "/get-a-quote" },
  { label: "Physical Damage & Non-Trucking Liability", href: "/pd-ntl-application" },
  { label: "Occupational Accident", href: "/occ-accident-enrollment" },
];

const moreLinks = ["Personal Auto", "Home", "Life", "Health", "Motorcycle", "Watercraft & Boat", "Recreational Vehicle"];

const companyLinks: { label: string; href: string }[] = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Company News", href: "/company-news" },
  { label: "Careers", href: "/careers" },
  { label: "Claims", href: "/claims" },
  { label: "Resources", href: "/resources" },
  { label: "Client Login", href: "/client-login" },
  { label: "Pay Now", href: "/pay-now" },
  { label: "Carriers", href: "#" },
  { label: "Privacy Policy", href: "/privacy-policy" },
];

export const Footer = () => {
  return (
    <footer
      className="relative text-white/75"
      style={{
        backgroundImage: `url(${footerBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        /* iOS fix: no backgroundAttachment fixed on mobile */
      }}
    >
      {/* Extra wrapper so background-attachment fixed works on desktop only */}
      <div
        className="hidden lg:block absolute inset-0"
        style={{
          backgroundImage: `url(${footerBg})`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0" style={{ background: "rgba(10, 25, 50, 0.82)" }} />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <img src={logo} alt="Custom Insurance Agency" className="h-[44px] w-auto" />
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Independent insurance agency serving clients nationwide with smarter coverage and friendly service.
            </p>
            <p className="mt-4 text-sm text-white/60">
              1333 Burr Ridge Pkwy STE 200, Burr Ridge, IL 60527
              <br />
              708-810-1955
            </p>
          </div>
          <FooterCol title="Get a Quote" links={quoteLinks} />
          <FooterCol title="More Coverage" links={moreLinks} />
          <FooterCol title="Company" links={companyLinks} />
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-xs leading-relaxed text-white/50">
          <p>
            Any submissions or payments made via this website do not constitute a binding agreement to your policy or
            coverages. Changes and payments to policies are not effective or binding until you receive official notice
            from your agent or insurance company. We will not resell your information to any third-party.
          </p>
          <p className="mt-4">© {new Date().getFullYear()} Custom Insurance. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const FooterCol = ({ title, links }: { title: string; links: string[] | { label: string; href: string }[] }) => (
  <div>
    <h4 className="text-sm font-semibold uppercase tracking-wider text-white">{title}</h4>
    <ul className="mt-4 space-y-1 text-sm">
      {links.map((l) => {
        const label = typeof l === "string" ? l : l.label;
        const href = typeof l === "string" ? "#" : l.href;
        return (
          <li key={label}>
            <a href={href} className="block py-2 transition hover:text-white">
              {label}
            </a>
          </li>
        );
      })}
    </ul>
  </div>
);

export default Footer;
