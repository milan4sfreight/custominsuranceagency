import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Menu } from "lucide-react";
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
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-border shadow-soft"
          : "bg-transparent",
      )}
    >
      <nav className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link
          to="/"
          className="group flex items-center md:static md:translate-x-0 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:ml-6"
        >
          <img
            src={logo}
            alt="Custom Insurance Agency"
            className="h-[36px] w-auto md:h-[40px]"
          />
        </Link>

        <ul className="hidden items-center gap-9 md:flex">
          <li>
            <Link
              to="/"
              className="relative text-sm font-medium text-muted-ink transition-colors hover:text-ink after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-brand-gradient after:transition-all hover:after:w-full"
            >
              Home
            </Link>
          </li>
          <li className="group relative">
            <button
              type="button"
              className="relative inline-flex items-center gap-1 text-sm font-medium text-muted-ink transition-colors hover:text-ink after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-brand-gradient after:transition-all group-hover:after:w-full"
            >
              Solutions
              <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
            </button>
            <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100">
              <div className="min-w-[260px] rounded-xl border border-border bg-white py-2 shadow-xl">
                {solutions.map((s) => (
                  <Link
                    key={s.to}
                    to={s.to}
                    className="block border-l-2 border-transparent px-5 py-3 text-sm font-medium text-[#0d2b2b] transition-colors hover:border-[#3eaa6d] hover:bg-[#3eaa6d]/5"
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>
          </li>
          <li>
            <Link
              to="/about"
              className="relative text-sm font-medium text-muted-ink transition-colors hover:text-ink after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-brand-gradient after:transition-all hover:after:w-full"
            >
              About Us
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="relative text-sm font-medium text-muted-ink transition-colors hover:text-ink after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-brand-gradient after:transition-all hover:after:w-full"
            >
              Contact
            </Link>
          </li>
        </ul>

        <div className="hidden md:block">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-[#3eaa6d] px-6 text-white shadow-brand-glow hover:bg-[#2d9960]"
          >
            <Link to="/get-a-quote">Get a Quote</Link>
          </Button>
        </div>

        <div className="md:hidden flex-1" />
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9 text-white hover:bg-transparent hover:text-white drop-shadow-md"
              aria-label="Open menu"
            >
              <Menu className="h-[28px] w-[28px]" strokeWidth={3.5} />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-72 text-white !bg-[hsl(222_47%_11%/0.6)]"
            style={{
              backdropFilter: "blur(24px) saturate(180%)",
              WebkitBackdropFilter: "blur(24px) saturate(180%)",
              borderLeft: "1px solid rgba(255, 255, 255, 0.15)",
            }}
          >
            <div className="mt-12 flex h-[calc(100%-3rem)] flex-col">
              <div className="flex flex-col gap-6">
                <Link to="/" className="text-xl font-semibold tracking-tight text-white hover:text-white/80">
                  Home
                </Link>
                <div>
                  <button
                    type="button"
                    onClick={() => setMobileSolutionsOpen((v) => !v)}
                    className="flex w-full items-center justify-between text-xl font-semibold tracking-tight text-white hover:text-white/80"
                  >
                    Solutions
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 transition-transform duration-200",
                        mobileSolutionsOpen && "rotate-180",
                      )}
                    />
                  </button>
                  {mobileSolutionsOpen && (
                    <div className="mt-3 flex flex-col gap-3 pl-4">
                      {solutions.map((s) => (
                        <Link
                          key={s.to}
                          to={s.to}
                          className="text-base font-medium text-white/85 hover:text-white"
                        >
                          {s.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <Link to="/about" className="text-xl font-semibold tracking-tight text-white hover:text-white/80">
                  About Us
                </Link>
                <Link to="/contact" className="text-xl font-semibold tracking-tight text-white hover:text-white/80">
                  Contact
                </Link>
              </div>
              <Button
                asChild
                className="mt-auto h-12 w-full rounded-full bg-[#3eaa6d] text-base font-semibold text-white shadow-brand-glow hover:bg-[#2d9960]"
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