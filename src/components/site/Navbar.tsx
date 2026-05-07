import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

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
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [hoveredSolution, setHoveredSolution] = useState(0);
  const location = useLocation();

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

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
      )}
      style={{
        background: scrolled
          ? "#0f2a42"
          : "linear-gradient(to bottom, #1f4d7a 0%, #173b5d 60%, #0f2a42 100%)",
        borderBottom: "1px solid rgba(0,0,0,0.15)",
        boxShadow: scrolled ? "0 4px 16px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.2)",
      }}
    >
      {/* Desktop top bar */}
      <div
        className="hidden lg:block"
        style={{ background: "#0f2a42", padding: "6px 56px" }}
      >
        <div
          className="flex items-center justify-end gap-3"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "12.5px",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          <Link to="/company-news" className="transition-colors hover:text-white">Company News</Link>
          <span style={{ opacity: 0.3 }}>|</span>
          <Link to="/careers" className="transition-colors hover:text-white">Careers</Link>
          <span style={{ opacity: 0.3 }}>|</span>
          <Link to="/contact" className="transition-colors hover:text-white">Contact</Link>
        </div>
      </div>

      {/* Desktop main nav */}
      <nav
        className="relative hidden lg:flex items-center justify-between"
        style={{ height: "72px", padding: "0 56px" }}
      >
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Custom Insurance Agency" style={{ height: "56px", width: "auto" }} />
        </Link>

        <div className="flex items-center" style={{ gap: "28px" }}>
          {/* Solutions with mega dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setSolutionsOpen(true)}
            onMouseLeave={() => setSolutionsOpen(false)}
          >
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

            {solutionsOpen && (
              <div
                className="absolute left-1/2 -translate-x-1/2"
                style={{ top: "100%", paddingTop: "12px" }}
              >
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "0 0 16px 16px",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                    padding: "32px 40px",
                    display: "grid",
                    gridTemplateColumns: "320px 1fr",
                    gap: "40px",
                    minWidth: "780px",
                  }}
                >
                  {/* Left column */}
                  <div>
                    <div
                      style={{
                        color: "#173b5d",
                        textTransform: "uppercase",
                        fontSize: "11px",
                        letterSpacing: "2px",
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 600,
                        marginBottom: "12px",
                      }}
                    >
                      Solutions
                    </div>
                    {solutions.map((s, i) => (
                      <Link
                        key={s.to}
                        to={s.to}
                        onMouseEnter={() => setHoveredSolution(i)}
                        className="flex items-center justify-between transition-colors"
                        style={{
                          color: hoveredSolution === i ? "#3eaa6d" : "#173b5d",
                          fontSize: "15px",
                          fontWeight: 500,
                          padding: "12px 0",
                          borderBottom: "1px solid #f0f0f0",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        <span>{s.label}</span>
                        <span>→</span>
                      </Link>
                    ))}
                  </div>

                  {/* Right column */}
                  <div>
                    <div
                      style={{
                        color: "#173b5d",
                        textTransform: "uppercase",
                        fontSize: "11px",
                        letterSpacing: "2px",
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 600,
                        marginBottom: "12px",
                      }}
                    >
                      {solutions[hoveredSolution].label}
                    </div>
                    {solutions[hoveredSolution].subItems.length > 0 ? (
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          columnGap: "32px",
                        }}
                      >
                        {solutions[hoveredSolution].subItems.map((item) => (
                          <a
                            key={item}
                            href={solutions[hoveredSolution].to}
                            style={{
                              color: "#3eaa6d",
                              fontSize: "14px",
                              padding: "8px 0",
                              fontFamily: "'Inter', sans-serif",
                              textDecoration: "none",
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
                        style={{ color: "#3eaa6d", fontSize: "14px", fontFamily: "'Inter', sans-serif" }}
                      >
                        Learn more →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}
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
              }}
            >
              Get a Quote
            </Link>
            <Link
              to="/contact"
              className="transition-colors"
              style={{
                background: "transparent",
                border: "1.5px solid rgba(255,255,255,0.5)",
                color: "#fff",
                borderRadius: "50px",
                padding: "10px 22px",
                fontFamily: "'Inter', sans-serif",
                fontSize: "13.5px",
                fontWeight: 600,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              Client Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile nav (unchanged) */}
      <nav className="relative mx-auto flex h-20 min-h-20 max-w-7xl items-center justify-between px-6 lg:hidden">
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="Custom Insurance Agency"
            className="h-[52px] w-auto md:h-[64px]"
          />
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
            className="w-full max-w-md border-0 p-0 text-white"
            style={{
              background:
                "linear-gradient(to bottom, #1f4d7a 0%, #173b5d 60%, #0f2a42 100%)",
            }}
          >
            <div className="flex h-full flex-col px-8 pb-10 pt-20">
              <div className="flex flex-col" style={{ fontFamily: "'Barlow', sans-serif" }}>
                <Link to="/" className="border-b border-white/10 py-4 text-[24px] font-semibold tracking-tight text-white hover:text-white/75">
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
                      className={cn(
                        "h-6 w-6 transition-transform duration-200",
                        mobileSolutionsOpen && "rotate-180",
                      )}
                    />
                  </button>
                  {mobileSolutionsOpen && (
                    <div className="flex flex-col gap-3 pb-4 pl-5">
                      {solutions.map((s) => (
                        <Link
                          key={s.to}
                          to={s.to}
                          className="text-[18px] font-medium text-white/80 hover:text-white"
                        >
                          {s.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <Link to="/about" className="border-b border-white/10 py-4 text-[24px] font-semibold tracking-tight text-white hover:text-white/75">
                  About Us
                </Link>
                <Link to="/contact" className="border-b border-white/10 py-4 text-[24px] font-semibold tracking-tight text-white hover:text-white/75">
                  Contact
                </Link>
                <Link to="/company-news" className="border-b border-white/10 py-4 text-[24px] font-semibold tracking-tight text-white hover:text-white/75">
                  Company News
                </Link>
                <Link to="/careers" className="border-b border-white/10 py-4 text-[24px] font-semibold tracking-tight text-white hover:text-white/75">
                  Careers
                </Link>
                <Link to="/claims" className="border-b border-white/10 py-4 text-[24px] font-semibold tracking-tight text-white hover:text-white/75">
                  Claims
                </Link>
                <Link to="/resources" className="border-b border-white/10 py-4 text-[24px] font-semibold tracking-tight text-white hover:text-white/75">
                  Resources
                </Link>
              </div>
              <Button
                asChild
                className="btn-quote mt-auto h-14 w-full text-base uppercase tracking-[2px]"
              >
                <Link to="/get-a-quote">Get a Quote</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
};

export default Navbar;