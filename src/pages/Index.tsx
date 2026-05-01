import { SiteNav } from "@/components/site/SiteNav";
import { Hero } from "@/components/site/Hero";
import { Marquee } from "@/components/site/Marquee";
import { EventsGrid } from "@/components/site/EventsGrid";
import { Spotlight } from "@/components/site/Spotlight";
import { Newsletter } from "@/components/site/Newsletter";
import { SiteFooter } from "@/components/site/SiteFooter";

const Index = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <Hero />
      <Marquee />
      <EventsGrid />
      <Spotlight />
      <Newsletter />
      <SiteFooter />
    </main>
  );
};

export default Index;
