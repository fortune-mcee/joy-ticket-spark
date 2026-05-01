import { Instagram, Twitter, Youtube } from "lucide-react";

export const SiteFooter = () => {
  const cols = [
    {
      title: "Discover",
      links: ["Concerts", "Theatre", "Jazz", "Festivals", "Club Nights"],
    },
    {
      title: "Company",
      links: ["About", "Journal", "Press", "Careers", "Partners"],
    },
    {
      title: "Support",
      links: ["Help Centre", "Refunds", "Box Office", "Accessibility"],
    },
  ];

  return (
    <footer className="bg-foreground text-background pt-20 pb-10 grain relative">
      <div className="container">
        <div className="grid lg:grid-cols-12 gap-12 pb-16 border-b border-background/15">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-7 h-7 rounded-full bg-accent flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-foreground" />
              </span>
              <span className="font-display text-xl font-semibold">
                Olive<span className="text-highlight">.</span>Send
              </span>
            </div>
            <p className="font-display text-3xl md:text-4xl leading-tight max-w-md text-balance">
              A new stage for Nigeria's <em className="text-accent">creativity</em>.
            </p>
            <div className="flex gap-3 mt-8">
              {[Instagram, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full border border-background/20 flex items-center justify-center hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors"
                  aria-label="Social"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <div className="font-mono-label text-background/50 mb-5">
                {col.title}
              </div>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="hover:text-accent transition-colors">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-1">
            <div className="font-mono-label text-background/50 mb-5">Box Office</div>
            <p className="text-sm text-background/70 leading-relaxed">
              +234 (0) 700 OLIVE
              <br />
              hello@olivesend.com
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4 pt-8 font-mono-label text-background/50">
          <span>© 2026 Olive Send. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-background">Privacy</a>
            <a href="#" className="hover:text-background">Terms</a>
            <a href="#" className="hover:text-background">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
