import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

const solutions = [
  { label: "Trucking Insurance", to: "/trucking-insurance" },
  { label: "Commercial Insurance", to: "/commercial-insurance" },
  { label: "Freight Broker Insurance", to: "/freight-broker-insurance" },
  { label: "Risk Management", to: "/risk-management" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const [open, setOpen] = useState(false);
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
        scrolled ? "bg-[#0d2b2b] shadow-soft" : "bg-transparent",
      )}
    >
      <nav className="relative mx-auto flex h-20 min-h-20 max-w-7xl items-center justify-between px-6 lg:pl-14 lg:pr-10">
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="Custom Insurance Agency"
            className="h-[44px] w-auto md:h-[64px]"
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
              <span className="block h-[2px] w-[28px] bg-white" />
              <span className="block h-[2px] w-[28px] bg-white" />
              <span className="block h-[2px] w-[28px] bg-white" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-full max-w-md border-0 p-0 text-white !bg-[#0d2b2b]"
          >
            <div className="flex h-full flex-col px-8 pb-10 pt-20">
              <div className="flex flex-col gap-7" style={{ fontFamily: "'Barlow', sans-serif" }}>
                <Link to="/" className="text-[24px] font-bold tracking-tight text-white hover:text-white/80">
                  Home
                </Link>
                <div>
                  <button
                    type="button"
                    onClick={() => setMobileSolutionsOpen((v) => !v)}
                    className="flex w-full items-center justify-between text-[24px] font-bold tracking-tight text-white hover:text-white/80"
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
                    <div className="mt-4 flex flex-col gap-4 pl-4">
                      {solutions.map((s) => (
                        <Link
                          key={s.to}
                          to={s.to}
                          className="text-lg font-medium text-white/85 hover:text-white"
                        >
                          {s.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <Link to="/about" className="text-[24px] font-bold tracking-tight text-white hover:text-white/80">
                  About Us
                </Link>
                <Link to="/contact" className="text-[24px] font-bold tracking-tight text-white hover:text-white/80">
                  Contact
                </Link>
              </div>
              <Button
                asChild
                className="mt-auto h-14 w-full rounded-full bg-[#3eaa6d] text-base font-semibold uppercase tracking-[2px] text-white shadow-brand-glow hover:bg-[#2d9960]"
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