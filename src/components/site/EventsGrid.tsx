import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import event1 from "@/assets/event-1.jpg";
import event2 from "@/assets/event-2.jpg";
import event3 from "@/assets/event-3.jpg";
import event4 from "@/assets/event-4.jpg";

type Event = {
  img: string;
  category: string;
  title: string;
  artist: string;
  date: string;
  venue: string;
  city: string;
  price: string;
  status?: "Selling Fast" | "Few Left" | "New";
};

const events: Event[] = [
  {
    img: event1,
    category: "Concert",
    title: "Lucid Dreams",
    artist: "Tiwa Savage",
    date: "Sat 14 Mar",
    venue: "Eko Hotel Hall",
    city: "Lagos",
    price: "₦35,000",
    status: "Selling Fast",
  },
  {
    img: event2,
    category: "Theatre",
    title: "The Masquerade",
    artist: "MUSON Centre Ensemble",
    date: "Fri 27 Mar",
    venue: "MUSON Centre",
    city: "Lagos",
    price: "₦18,000",
    status: "New",
  },
  {
    img: event3,
    category: "Club Night",
    title: "Underground Vol. 12",
    artist: "DJ Obi · Spinall · Cuppy",
    date: "Sat 04 Apr",
    venue: "Quilox",
    city: "Lagos",
    price: "₦12,500",
  },
  {
    img: event4,
    category: "Jazz",
    title: "After Hours",
    artist: "The Lagos Quartet",
    date: "Thu 16 Apr",
    venue: "Bogobiri House",
    city: "Lagos",
    price: "₦9,500",
    status: "Few Left",
  },
];

const filters = ["All", "Concerts", "Theatre", "Jazz", "Club Nights", "Festivals"];

export const EventsGrid = () => {
  return (
    <section id="events" className="py-20 md:py-32">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            <p className="font-mono-label text-muted-foreground mb-4">
              ✦ Upcoming · 24 events
            </p>
            <h2 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight text-balance">
              Creating experiences <br />
              that <em className="text-highlight">inspire</em> &amp; entertain.
            </h2>
          </div>
          <Button variant="hero" size="lg" className="self-start md:self-end">
            Browse All Events
            <ArrowUpRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 mb-10 pb-6 border-b border-border">
          {filters.map((f, i) => (
            <button
              key={f}
              className={`font-mono-label px-4 py-2 rounded-full border transition-colors ${
                i === 0
                  ? "bg-foreground text-background border-foreground"
                  : "border-border hover:border-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {events.map((e, i) => (
            <article
              key={e.title}
              className={`group relative flex flex-col ${
                i === 0 ? "lg:col-span-2 lg:row-span-1" : ""
              }`}
            >
              <div className="relative overflow-hidden bg-muted aspect-[3/4] mb-5">
                <img
                  src={e.img}
                  alt={`${e.title} by ${e.artist}`}
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
                    Get Tickets · {e.price}
                  </Button>
                </div>
              </div>

              <div className="flex items-start justify-between gap-3 mb-1">
                <span className="font-mono-label text-muted-foreground">
                  {e.date}
                </span>
                <span className="font-mono-label text-foreground">{e.price}</span>
              </div>
              <h3 className="font-display text-2xl md:text-3xl leading-tight">
                {e.title}
              </h3>
              <p className="text-muted-foreground mt-1">{e.artist}</p>
              <p className="font-mono-label text-muted-foreground mt-3">
                {e.venue} · {e.city}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
