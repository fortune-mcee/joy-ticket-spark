import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Newsletter = () => {
  return (
    <section id="contact" className="py-20 md:py-28 bg-secondary">
      <div className="container">
        <div className="grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-7">
            <p className="font-mono-label text-muted-foreground mb-6">
              ✦ The Send · Newsletter
            </p>
            <h2 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight text-balance">
              Be first to know <br />
              <em className="text-highlight">when the curtain rises.</em>
            </h2>
            <p className="mt-6 text-muted-foreground max-w-lg">
              Early access to new shows, exclusive presales, and dispatches from
              backstage. One short email. Every other Friday.
            </p>
          </div>

          <form
            className="lg:col-span-5 flex flex-col gap-3"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                required
                placeholder="you@inbox.com"
                className="h-14 rounded-none border-foreground/20 bg-background"
                aria-label="Email"
              />
              <Button variant="hero" size="xl" type="submit" className="shrink-0">
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <p className="font-mono-label text-muted-foreground">
              No spam. Unsubscribe anytime.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};
