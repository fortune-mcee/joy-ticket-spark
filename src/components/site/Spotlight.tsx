import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import spotlight from "@/assets/spotlight-artist.jpg";

export const Spotlight = () => {
  return (
    <section
      id="spotlight"
      className="relative bg-foreground text-background py-20 md:py-32 overflow-hidden grain"
    >
      <div className="container grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        <div className="lg:col-span-5 order-2 lg:order-1">
          <p className="font-mono-label text-accent mb-6">✦ Artist Spotlight</p>
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight text-balance">
            "The stage is where <em className="text-accent">stories</em> become memory."
          </h2>
          <p className="mt-8 text-background/70 max-w-md leading-relaxed">
            This season we're showcasing voices reshaping Nigerian performance —
            from afrobeats arenas to intimate jazz rooms. Meet the artists,
            read the stories, secure the seat.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-8 max-w-md">
            <div>
              <div className="font-display text-4xl">12</div>
              <div className="font-mono-label text-background/50 mt-1">
                Featured Artists
              </div>
            </div>
            <div>
              <div className="font-display text-4xl">04</div>
              <div className="font-mono-label text-background/50 mt-1">
                Original Productions
              </div>
            </div>
          </div>

          <div className="mt-10 flex gap-3">
            <Button variant="poster" size="lg">
              Read the journal
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="lg:col-span-7 order-1 lg:order-2 relative">
          <div className="relative overflow-hidden shadow-poster">
            <img
              src={spotlight}
              alt="Featured artist on stage under warm theatre lights"
              loading="lazy"
              className="w-full h-auto object-cover aspect-[4/5]"
            />
            <div className="absolute top-6 left-6 right-6 flex justify-between font-mono-label text-background">
              <span>NO. 04 / 2026</span>
              <span>★ EDITORIAL</span>
            </div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="font-mono-label text-background/70 mb-2">
                In Conversation
              </div>
              <div className="font-display text-3xl md:text-4xl text-background">
                Adé Williams on building a sound
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
