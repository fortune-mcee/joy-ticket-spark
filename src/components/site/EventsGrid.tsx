import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { events } from "@/data/events";

const filters = ["All", "Concert", "Theatre", "Dance", "Jazz", "Festival"];

export const EventsGrid = () => {
  const featured = events.slice(0, 4);

  return (
    <section id="events" className="py-20 md:py-32">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            <p className="font-mono-label text-muted-foreground mb-4">
              ✦ On at the National Theatre · {events.length} upcoming
            </p>
            <h2 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight text-balance">
              Creating experiences <br />
              that <em className="text-highlight">inspire</em> &amp; entertain.
            </h2>
          </div>
          <Button asChild variant="hero" size="lg" className="self-start md:self-end">
            <Link to="/events">
              See all events
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mb-10 pb-6 border-b border-border">
          {filters.map((f, i) => (
            <Link
              key={f}
              to={`/events${i === 0 ? "" : `?category=${f}`}`}
              className={`font-mono-label px-4 py-2 rounded-full border transition-colors ${
                i === 0
                  ? "bg-foreground text-background border-foreground"
                  : "border-border hover:border-foreground"
              }`}
            >
              {f}
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {featured.map((e, i) => (
            <article
              key={e.id}
              className={`group relative flex flex-col ${
                i === 0 ? "lg:col-span-2" : ""
              }`}
            >
              <div className="relative overflow-hidden bg-muted aspect-[3/4] mb-5">
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
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-foreground/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <Button variant="ticket" size="sm" className="w-full">
                    Get Tickets · {e.price.replace("From ", "")}
                  </Button>
                </div>
              </div>

              <div className="flex items-start justify-between gap-3 mb-1">
                <span className="font-mono-label text-muted-foreground">
                  {e.date.split(" · ")[0]}
                </span>
                <span className="font-mono-label text-foreground">{e.price}</span>
              </div>
              <h3 className="font-display text-2xl md:text-3xl leading-tight">
                {e.title}
              </h3>
              <p className="text-muted-foreground mt-1">{e.artist}</p>
              <p className="font-mono-label text-muted-foreground mt-3">
                National Theatre · {e.hall}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
