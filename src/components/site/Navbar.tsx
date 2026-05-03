import { useEffect, useState } from "react";
import { Menu, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const links = [
  { label: "Home", href: "#" },
  { label: "Coverage", href: "#coverage" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

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
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
        <a href="#" className="flex items-center gap-2 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gradient shadow-brand-glow">
            <ShieldCheck className="h-5 w-5 text-brand-foreground" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            Custom <span className="text-brand">Insurance</span>
          </span>
        </a>

        <ul className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="relative text-sm font-medium text-muted-ink transition-colors hover:text-ink after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-brand-gradient after:transition-all hover:after:w-full"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <Button
            size="lg"
            className="rounded-full bg-brand-gradient px-6 text-brand-foreground shadow-brand-glow hover:opacity-95"
          >
            Get a Quote
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-ink">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <div className="mt-10 flex flex-col gap-6">
              {links.map((l) => (
                <a key={l.label} href={l.href} className="text-base font-medium text-ink">
                  {l.label}
                </a>
              ))}
              <Button className="mt-4 rounded-full bg-brand-gradient text-brand-foreground shadow-brand-glow">
                Get a Quote
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
};

export default Navbar;