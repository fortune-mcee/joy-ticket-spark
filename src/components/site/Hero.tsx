import { ArrowUpRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroStage from "@/assets/hero-stage.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-foreground text-background grain">
      <img
        src={heroStage}
        alt="Performance on the Main Bowl stage at Nigeria's National Theatre, Iganmu, Lagos"
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      />
      <div className="absolute inset-0 bg-gradient-stage" />
      <div className="absolute inset-0 bg-gradient-spot" />

      <div className="absolute top-20 md:top-24 inset-x-0 z-10">
        <div className="container flex items-center justify-between font-mono-label text-background/70">
          <span>● Official Box Office</span>
          <span className="hidden md:inline">National Theatre · Iganmu, Lagos</span>
          <span>Season 2026</span>
        </div>
      </div>

      <div className="relative z-10 container min-h-[100svh] flex flex-col justify-end pb-16 md:pb-24">
        <div className="max-w-5xl fade-up">
          <p className="font-mono-label text-accent mb-6">Now on Stage</p>
          <h1 className="font-display font-light text-[clamp(2.75rem,9vw,8.5rem)] leading-[0.9] tracking-tight text-balance">
            A new stage <br />
            for Nigeria's <em className="text-accent not-italic font-normal">creativity.</em>
          </h1>
          <p className="mt-8 max-w-xl text-base md:text-lg text-background/80 leading-relaxed">
            The official ticketing home of the National Theatre, Iganmu — from
            the Main Bowl to the Cinema Halls. Discover groundbreaking
            performances and book your seat in seconds.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button asChild variant="ticket" size="xl" className="group">
              <Link to="/events">
                Browse All Events
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
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

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-background/15">
          {[
            ["1976", "Established"],
            ["5", "Performance halls"],
            ["120k+", "Tickets sold"],
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
