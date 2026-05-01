import { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ArrowUpRight, Search, MapPin } from "lucide-react";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { events, CATEGORIES, HALLS } from "@/data/events";

type Sort = "soonest" | "price-low" | "price-high";

const Events = () => {
  const [params, setParams] = useSearchParams();
  const initialCat = params.get("category") ?? "All";

  const [category, setCategory] = useState<string>(initialCat);
  const [hall, setHall] = useState<string>("All");
  const [query, setQuery] = useState<string>("");
  const [sort, setSort] = useState<Sort>("soonest");

  const filtered = useMemo(() => {
    let list = [...events];
    if (category !== "All") list = list.filter((e) => e.category === category);
    if (hall !== "All") list = list.filter((e) => e.hall === hall);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.artist.toLowerCase().includes(q),
      );
    }
    switch (sort) {
      case "price-low":
        list.sort((a, b) => a.priceFrom - b.priceFrom);
        break;
      case "price-high":
        list.sort((a, b) => b.priceFrom - a.priceFrom);
        break;
      default:
        list.sort((a, b) => a.iso.localeCompare(b.iso));
    }
    return list;
  }, [category, hall, query, sort]);

  const updateCategory = (c: string) => {
    setCategory(c);
    if (c === "All") {
      params.delete("category");
    } else {
      params.set("category", c);
    }
    setParams(params, { replace: true });
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* Page header */}
      <section className="relative pt-32 md:pt-44 pb-16 md:pb-24 bg-foreground text-background grain overflow-hidden">
        <div className="absolute inset-0 bg-gradient-spot opacity-60" />
        <div className="container relative">
          <div className="flex items-center gap-3 font-mono-label text-background/60 mb-8">
            <Link to="/" className="hover:text-accent">Home</Link>
            <span>/</span>
            <span className="text-background">Events</span>
          </div>
          <p className="font-mono-label text-accent mb-6">
            ✦ National Theatre · Iganmu, Lagos
          </p>
          <h1 className="font-display font-light text-[clamp(2.5rem,8vw,7rem)] leading-[0.9] tracking-tight text-balance max-w-5xl">
            Every show, every <em className="text-accent not-italic">stage.</em>
          </h1>
          <p className="mt-8 max-w-xl text-background/70 leading-relaxed">
            From the Main Bowl to the Cinema Halls — browse the full season of
            performances coming to Nigeria's National Theatre.
          </p>
        </div>
      </section>

      {/* Filters bar */}
      <section className="sticky top-16 md:top-20 z-30 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container py-4 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search shows or artists…"
                className="pl-10 h-11 rounded-none border-foreground/20"
              />
            </div>

            <div className="flex gap-2 items-center">
              <select
                value={hall}
                onChange={(e) => setHall(e.target.value)}
                className="h-11 px-3 border border-foreground/20 bg-background font-mono-label"
                aria-label="Filter by hall"
              >
                <option value="All">All halls</option>
                {HALLS.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="h-11 px-3 border border-foreground/20 bg-background font-mono-label"
                aria-label="Sort"
              >
                <option value="soonest">Sort: Soonest</option>
                <option value="price-low">Price: Low to high</option>
                <option value="price-high">Price: High to low</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {["All", ...CATEGORIES].map((c) => (
              <button
                key={c}
                onClick={() => updateCategory(c)}
                className={`font-mono-label px-4 py-2 rounded-full border transition-colors ${
                  category === c
                    ? "bg-foreground text-background border-foreground"
                    : "border-border hover:border-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-border">
            <p className="font-mono-label text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "event" : "events"}
            </p>
            {(category !== "All" || hall !== "All" || query) && (
              <button
                onClick={() => {
                  setCategory("All");
                  setHall("All");
                  setQuery("");
                  params.delete("category");
                  setParams(params, { replace: true });
                }}
                className="font-mono-label text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-display text-3xl mb-4">Nothing on this stage yet.</p>
              <p className="text-muted-foreground">Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {filtered.map((e) => (
                <article key={e.id} className="group flex flex-col">
                  <div className="relative overflow-hidden bg-muted aspect-[4/5] mb-5">
                    <img
                      src={e.img}
                      alt={`${e.title} — ${e.artist}`}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <span className="font-mono-label bg-background/90 text-foreground px-3 py-1.5">
                        {e.category}
                      </span>
                      {e.status && (
                        <span className="font-mono-label bg-highlight text-highlight-foreground px-3 py-1.5">
                          {e.status}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="font-mono-label text-muted-foreground">
                      {e.date}
                    </span>
                    <span className="font-mono-label text-foreground">
                      {e.price}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl leading-tight">
                    {e.title}
                  </h3>
                  <p className="text-muted-foreground mt-1">{e.artist}</p>
                  <p className="mt-3 text-sm text-foreground/70 leading-relaxed">
                    {e.blurb}
                  </p>
                  <div className="flex items-center gap-2 mt-4 font-mono-label text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" />
                    National Theatre · {e.hall}
                  </div>

                  <div className="mt-5 flex gap-2">
                    <Button
                      variant={e.status === "Sold Out" ? "outline" : "ticket"}
                      size="sm"
                      className="flex-1"
                      disabled={e.status === "Sold Out"}
                    >
                      {e.status === "Sold Out" ? "Sold Out" : "Get Tickets"}
                      {e.status !== "Sold Out" && <ArrowUpRight className="w-4 h-4" />}
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
};

export default Events;
