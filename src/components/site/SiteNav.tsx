import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export const SiteNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Events", href: "/events" },
    { label: "Halls", href: "/#halls" },
    { label: "Spotlight", href: "/#spotlight" },
    { label: "My Tickets", href: "/my-tickets" },
    { label: "Visit", href: "/#contact" },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-border text-foreground"
          : "bg-transparent text-background"
      }`}
    >
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="w-7 h-7 rounded-full bg-accent flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-foreground" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">
            Olive<span className="text-highlight">.</span>Send
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className="font-mono-label opacity-70 hover:opacity-100 transition-opacity"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Cart" className="relative">
            <ShoppingBag className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-highlight" />
          </Button>
          <Button asChild variant="poster" size="sm" className="hidden sm:inline-flex">
            <Link to="/events">Get Tickets</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md text-foreground">
          <nav className="container flex flex-col py-4 gap-4">
            {links.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                onClick={() => setOpen(false)}
                className="font-mono-label py-2"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
