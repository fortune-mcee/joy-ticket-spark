import { ArrowUpRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroStage from "@/assets/hero-stage.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-foreground text-background grain">
      <img
        src={heroStage}
        alt="Artist on stage performing with an orchestra at the National Theatre, Lagos"
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      />
      <div className="absolute inset-0 bg-gradient-stage" />
      <div className="absolute inset-0 bg-gradient-spot" />

      {/* Top meta strip */}
      <div className="absolute top-20 md:top-24 inset-x-0 z-10">
        <div className="container flex items-center justify-between font-mono-label text-background/70">
          <span>● Live Now · Season 04</span>
          <span className="hidden md:inline">Lagos / Abuja / Port Harcourt</span>
          <span>2026 / Edition 01</span>
        </div>
      </div>

      {/* Hero copy */}
      <div className="relative z-10 container min-h-[100svh] flex flex-col justify-end pb-16 md:pb-24">
        <div className="max-w-5xl fade-up">
          <p className="font-mono-label text-accent mb-6">Now Playing</p>
          <h1 className="font-display font-light text-[clamp(2.75rem,9vw,8.5rem)] leading-[0.9] tracking-tight text-balance">
            A new stage <br />
            for Nigeria's <em className="text-accent not-italic font-normal">creativity.</em>
          </h1>
          <p className="mt-8 max-w-xl text-base md:text-lg text-background/80 leading-relaxed">
            From orchestra halls to underground rooms — discover groundbreaking
            performances and book your seat in seconds.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button variant="ticket" size="xl" className="group">
              Get Your Tickets
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Button>
            <Button
              variant="ghost"
              size="xl"
              className="text-background hover:bg-background/10 hover:text-background border border-background/30"
            >
              <Play className="w-4 h-4" />
              Watch the trailer
            </Button>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-background/15">
          {[
            ["120k+", "Tickets sold"],
            ["48", "Curated shows"],
            ["12", "Cities"],
            ["4.9★", "Patron rating"],
          ].map(([n, l]) => (
            <div key={l}>
              <div className="font-display text-3xl md:text-4xl">{n}</div>
              <div className="font-mono-label text-background/60 mt-1">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
