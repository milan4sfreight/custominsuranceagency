import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";
import footerBg from "@/assets/footer-bg.jpg";

const personalLinesContent: Record<string, { icon: string; title: string; body: string }> = {
  "Auto Insurance": {
    icon: "🚗",
    title: "Auto Insurance",
    body: "Protect your personal vehicle with comprehensive coverage tailored to your needs. From liability to full coverage, we find the best rates from 50+ carriers.",
  },
  "Home Insurance": {
    icon: "🏠",
    title: "Home Insurance",
    body: "Your home is your biggest investment. We protect it with the right coverage — from fire and theft to liability and natural disasters. Our team shops 50+ carriers to find you the best protection at the best price.",
  },
  "Health Insurance": {
    icon: "🏥",
    title: "Health Insurance",
    body: "Quality health coverage for you and your family. We work with top providers to find plans that fit your budget and lifestyle — from individual plans to family coverage.",
  },
  "Life Insurance": {
    icon: "🛡️",
    title: "Life Insurance",
    body: "Give your family financial security for the future. Term, whole, and universal life insurance options — we help you choose the right protection for your loved ones.",
  },
};

const PersonalLinesModal = ({ optionKey, onClose }: { optionKey: string | null; onClose: () => void }) => {
  if (!optionKey) return null;
  const data = personalLinesContent[optionKey];
  if (!data) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          maxWidth: "560px",
          width: "100%",
          borderTop: "4px solid #2abfbf",
          borderRadius: "12px",
          padding: "40px",
          position: "relative",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: "12px",
            right: "16px",
            background: "transparent",
            border: "none",
            fontSize: "26px",
            color: "#6b7280",
            cursor: "pointer",
            lineHeight: 1,
          }}
        >
          ×
        </button>
        <div style={{ fontSize: "44px", marginBottom: "12px" }}>{data.icon}</div>
        <div
          style={{
            color: "#2abfbf",
            textTransform: "uppercase",
            fontSize: "11px",
            letterSpacing: "2px",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            marginBottom: "8px",
          }}
        >
          Personal Lines Coverage
        </div>
        <h2
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 700,
            fontSize: "28px",
            color: "#0d2b2b",
            margin: "0 0 16px 0",
          }}
        >
          {data.title}
        </h2>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "15px",
            color: "#6b7280",
            lineHeight: 1.7,
            margin: "0 0 28px 0",
          }}
        >
          {data.body}
        </p>
        <Link
          to="/get-a-quote"
          onClick={onClose}
          style={{
            display: "block",
            width: "100%",
            textAlign: "center",
            background: "linear-gradient(135deg, #f5821f 0%, #f5c518 100%)",
            color: "#fff",
            borderRadius: "50px",
            padding: "14px 22px",
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 700,
            fontSize: "16px",
            textDecoration: "none",
          }}
        >
          Get a Free Quote →
        </Link>
        <div style={{ textAlign: "center", marginTop: "14px" }}>
          <a
            href="tel:7088101955"
            style={{
              color: "#2abfbf",
              fontSize: "13px",
              fontFamily: "'Inter', sans-serif",
              textDecoration: "none",
            }}
          >
            Call us at 708-810-1955
          </a>
        </div>
      </div>
    </div>
  );
};

const solutions = [
  {
    label: "Trucking Insurance",
    to: "/trucking-insurance",
    subItems: [
      "Auto Liability",
      "Motor Truck Cargo Insurance",
      "Physical Damage",
      "General Liability Insurance",
      "Excess or Umbrella Insurance",
      "Non-Trucking Liability & Bobtail Insurance",
      "Occupational Accident Coverage (OCC/ACC)",
      "Workers Compensation",
    ],
  },
  { label: "Freight Broker Insurance", to: "/freight-broker-insurance", subItems: [] },
  { label: "Commercial Insurance", to: "/commercial-insurance", subItems: [] },
  { label: "Risk Management", to: "/risk-management", subItems: [] },
  {
    label: "Personal Lines",
    to: "/get-a-quote",
    subItems: ["Auto Insurance", "Home Insurance", "Health Insurance", "Life Insurance"],
  },
];

let closeTimer: ReturnType<typeof setTimeout> | null = null;

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [hoveredSolution, setHoveredSolution] = useState(0);
  const [personalLinesModal, setPersonalLinesModal] = useState<string | null>(null);
  const location = useLocation();

  const handleLogoClick = (e: React.MouseEvent) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, left: 0 });
    }
    setOpen(false);
  };

  useEffect(() => {
    setOpen(false);
    setMobileSolutionsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = () => {
    if (closeTimer) clearTimeout(closeTimer);
    setSolutionsOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimer = setTimeout(() => setSolutionsOpen(false), 250);
  };

  return (
    <header
      className={cn("fixed inset-x-0 top-0 z-50 transition-all duration-500")}
      style={{
        background: scrolled ? "linear-gradient(to bottom, #1f4d7a 0%, #173b5d 60%, #0f2a42 100%)" : "transparent",
        boxShadow: scrolled ? "0 4px 16px rgba(0,0,0,0.3)" : "none",
      }}
    >
      {/* Desktop top bar — visible only at top */}
      <div
        className="hidden lg:block"
        style={{
          background: "transparent",
          padding: isScrolled ? "0 56px" : "6px 56px",
          maxHeight: isScrolled ? "0" : "40px",
          overflow: "hidden",
          transition: "max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease",
          opacity: isScrolled ? 0 : 1,
        }}
      >
        <div
          className="flex items-center justify-end gap-3"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "12.5px",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          <Link to="/company-news" className="transition-colors hover:text-white">
            Company News
          </Link>
          <span style={{ opacity: 0.3 }}>|</span>
          <Link to="/careers" className="transition-colors hover:text-white">
            Careers
          </Link>
          <span style={{ opacity: 0.3 }}>|</span>
          <Link to="/contact" className="transition-colors hover:text-white">
            Contact
          </Link>
        </div>
      </div>

      {/* Desktop main nav */}
      <nav
        className="relative hidden lg:flex items-center justify-between"
        style={{ padding: "8px 56px" }}
        onMouseLeave={handleMouseLeave}
      >
        <Link to="/" className="flex items-center" onClick={handleLogoClick}>
          <img src={logo} alt="Custom Insurance Agency" style={{ height: "56px", width: "auto" }} />
        </Link>

        <div className="flex items-center" style={{ gap: "28px" }}>
          {/* Solutions trigger button only */}
          <div style={{ position: "relative" }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <button
              type="button"
              className="flex items-center gap-1 text-white"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "13.5px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Solutions
              <ChevronDown className={cn("h-4 w-4 transition-transform", solutionsOpen && "rotate-180")} />
            </button>
          </div>

          {[
            { label: "Resources", to: "/resources" },
            { label: "Claims", to: "/claims" },
          ].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="transition-colors"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "13.5px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: location.pathname === l.to ? "#3eaa6d" : "#fff",
                textDecoration: "none",
              }}
            >
              {l.label}
            </Link>
          ))}

          <div className="flex items-center" style={{ gap: "12px", marginLeft: "16px" }}>
            <Link
              to="/get-a-quote"
              style={{
                background: "linear-gradient(135deg, #f5821f 0%, #f5c518 100%)",
                color: "#fff",
                borderRadius: "50px",
                padding: "10px 22px",
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                fontSize: "13.5px",
                textDecoration: "none",
              }}
            >
              Get a Quote
            </Link>
            <Link
              to="/client-login"
              style={{
                background: "transparent",
                border: "1.5px solid rgba(255,255,255,0.5)",
                color: "#fff",
                borderRadius: "50px",
                padding: "10px 22px",
                fontFamily: "'Inter', sans-serif",
                fontSize: "13.5px",
                fontWeight: 600,
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              Client Login
            </Link>
          </div>
        </div>

        {/* Dropdown — Reliance Partners style: gray left col, white right, square corners */}
        {solutionsOpen && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              right: 0,
              width: "640px",
              zIndex: 49,
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "240px 1fr",
                borderRadius: 0,
                overflow: "hidden",
              }}
            >
              {/* Left column — gray background */}
              <div style={{ background: "#f0f0ee", padding: "28px 28px" }}>
                <div
                  style={{
                    color: "#999",
                    textTransform: "uppercase",
                    fontSize: "10.5px",
                    letterSpacing: "2px",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    marginBottom: "16px",
                  }}
                >
                  Solutions
                </div>
                {solutions.map((s, i) => (
                  <Link
                    key={s.to}
                    to={s.to}
                    onMouseEnter={() => setHoveredSolution(i)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      color: hoveredSolution === i ? "#2abfbf" : "#333",
                      fontSize: "14px",
                      fontWeight: 400,
                      padding: "11px 0",
                      borderBottom: "1px solid #ddd",
                      fontFamily: "'Inter', sans-serif",
                      textDecoration: "none",
                      transition: "color 0.15s",
                    }}
                  >
                    <span>{s.label}</span>
                    {hoveredSolution === i && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2abfbf" strokeWidth="2.5">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    )}
                  </Link>
                ))}
              </div>

              {/* Right column — white background */}
              <div style={{ background: "#fff", padding: "28px 28px" }}>
                <div
                  style={{
                    color: "#999",
                    textTransform: "uppercase",
                    fontSize: "10.5px",
                    letterSpacing: "2px",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    marginBottom: "16px",
                  }}
                >
                  {solutions[hoveredSolution].label}
                </div>
                {solutions[hoveredSolution].subItems.length > 0 ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      columnGap: "20px",
                    }}
                  >
                    {solutions[hoveredSolution].subItems.map((item) => (
                      <a
                        key={item}
                        href={
                          solutions[hoveredSolution].label === "Personal Lines"
                            ? "/get-a-quote"
                            : solutions[hoveredSolution].to
                        }
                        onClick={(e) => {
                          if (solutions[hoveredSolution].label === "Personal Lines") {
                            e.preventDefault();
                            setSolutionsOpen(false);
                            setPersonalLinesModal(item);
                          }
                        }}
                        style={{
                          color: "#2abfbf",
                          fontSize: "13px",
                          fontWeight: 400,
                          padding: "8px 0",
                          fontFamily: "'Inter', sans-serif",
                          textDecoration: "none",
                          display: "block",
                          borderBottom: "1px solid #f5f5f5",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                        onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                      >
                        {item}
                      </a>
                    ))}
                  </div>
                ) : (
                  <Link
                    to={solutions[hoveredSolution].to}
                    style={{
                      color: "#2abfbf",
                      fontSize: "14px",
                      fontWeight: 400,
                      fontFamily: "'Inter', sans-serif",
                      textDecoration: "none",
                    }}
                  >
                    Learn more →
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile nav */}
      <nav className="relative mx-auto flex h-20 min-h-20 max-w-7xl items-center justify-between px-6 lg:hidden">
        <Link to="/" className="flex items-center" onClick={handleLogoClick}>
          <img src={logo} alt="Custom Insurance Agency" className="h-[52px] w-auto md:h-[64px]" />
        </Link>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="flex h-10 w-10 flex-col items-center justify-center gap-[6px] text-white hover:bg-transparent hover:text-white"
              aria-label="Open menu"
            >
              <span className="block h-[3px] w-[28px] rounded-full bg-white" />
              <span className="block h-[3px] w-[28px] rounded-full bg-white" />
              <span className="block h-[3px] w-[28px] rounded-full bg-white" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-full max-w-md border-0 p-0 text-white overflow-y-auto [&>button.right-4]:hidden"
            style={{
              backgroundImage: `url(${footerBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              height: "100dvh",
            }}
          >
            <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(10, 25, 50, 0.82)" }} />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              style={{
                position: "absolute",
                top: 20,
                right: 24,
                zIndex: 10,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#ffffff",
                fontSize: 32,
                lineHeight: 1,
                padding: "4px 8px",
              }}
            >
              ×
            </button>
            <div
              className="relative flex min-h-full flex-col px-8 pt-20"
              style={{ zIndex: 1, paddingBottom: "max(40px, env(safe-area-inset-bottom, 40px))" }}
            >
              <div className="flex flex-col" style={{ fontFamily: "'Barlow', sans-serif" }}>
                <Link
                  to="/"
                  className="border-b border-white/10 py-4 text-[24px] font-semibold tracking-tight text-white hover:text-white/75"
                >
                  Home
                </Link>
                <div className="border-b border-white/10">
                  <button
                    type="button"
                    onClick={() => setMobileSolutionsOpen((v) => !v)}
                    className="flex w-full items-center justify-between py-4 text-[24px] font-semibold tracking-tight text-white hover:text-white/75"
                  >
                    Solutions
                    <ChevronDown
                      className={cn("h-6 w-6 transition-transform duration-200", mobileSolutionsOpen && "rotate-180")}
                    />
                  </button>
                  {mobileSolutionsOpen && (
                    <div className="flex flex-col gap-3 pb-4 pl-5">
                      {solutions.map((s) =>
                        s.label === "Personal Lines" ? (
                          <div key={s.to} className="flex flex-col">
                            <button
                              type="button"
                              onClick={() => setMobilePersonalOpen((v) => !v)}
                              className="flex w-full items-center justify-between text-[18px] font-medium text-white/80 hover:text-white"
                            >
                              {s.label}
                              <ChevronDown
                                className={cn(
                                  "h-5 w-5 transition-transform duration-200",
                                  mobilePersonalOpen && "rotate-180",
                                )}
                              />
                            </button>
                            {mobilePersonalOpen && (
                              <div className="mt-2 flex flex-col gap-2 pl-4">
                                {s.subItems.map((item) => (
                                  <button
                                    key={item}
                                    type="button"
                                    onClick={() => {
                                      setOpen(false);
                                      setPersonalLinesModal(item);
                                    }}
                                    className="text-left text-[16px] font-normal text-white/75 hover:text-white"
                                  >
                                    {item}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <Link key={s.to} to={s.to} className="text-[18px] font-medium text-white/80 hover:text-white">
                            {s.label}
                          </Link>
                        ),
                      )}
                    </div>
                  )}
                </div>
                <Link
                  to="/about"
                  className="border-b border-white/10 py-4 text-[24px] font-semibold tracking-tight text-white hover:text-white/75"
                >
                  About Us
                </Link>
                <Link
                  to="/contact"
                  className="border-b border-white/10 py-4 text-[24px] font-semibold tracking-tight text-white hover:text-white/75"
                >
                  Contact
                </Link>
                <Link
                  to="/company-news"
                  className="border-b border-white/10 py-4 text-[24px] font-semibold tracking-tight text-white hover:text-white/75"
                >
                  Company News
                </Link>
                <Link
                  to="/careers"
                  className="border-b border-white/10 py-4 text-[24px] font-semibold tracking-tight text-white hover:text-white/75"
                >
                  Careers
                </Link>
                <Link
                  to="/claims"
                  className="border-b border-white/10 py-4 text-[24px] font-semibold tracking-tight text-white hover:text-white/75"
                >
                  Claims
                </Link>
                <Link
                  to="/resources"
                  className="border-b border-white/10 py-4 text-[24px] font-semibold tracking-tight text-white hover:text-white/75"
                >
                  Resources
                </Link>
                <Link
                  to="/client-login"
                  className="border-b border-white/10 py-4 text-[24px] font-semibold tracking-tight text-white hover:text-white/75"
                >
                  Client Login
                </Link>
              </div>
              <Button asChild className="btn-quote mt-8 h-14 w-full text-base uppercase tracking-[2px]">
                <Link to="/get-a-quote">Get a Quote</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </nav>

      <PersonalLinesModal optionKey={personalLinesModal} onClose={() => setPersonalLinesModal(null)} />
    </header>
  );
};

export default Navbar;
