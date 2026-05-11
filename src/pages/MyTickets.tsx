import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { Download, Ticket as TicketIcon, MapPin, Calendar } from "lucide-react";
import { downloadTicketPdf, type TicketData } from "@/lib/ticketPdf";
import { toast } from "sonner";

const sampleTickets: TicketData[] = [
  {
    ref: "OS-10342",
    eventTitle: "Fela & The Republic",
    eventSubtitle: "An Afrobeat Symphony in Three Acts",
    date: "Sat, 24 May 2026",
    doors: "Doors 6:30 PM",
    hall: "Main Bowl",
    venue: "National Theatre, Iganmu",
    section: "ORCH",
    row: "C",
    seat: "12",
    tier: "Platinum",
    price: "₦25,000",
    holder: "Tomi Adebayo",
    orderId: "ORD-882134",
  },
  {
    ref: "OS-10391",
    eventTitle: "Lagos Jazz Nights",
    eventSubtitle: "Featuring Asa & The Brass Quartet",
    date: "Fri, 06 Jun 2026",
    doors: "Doors 7:00 PM",
    hall: "Cinema Hall 1",
    venue: "National Theatre, Iganmu",
    section: "MEZZ",
    row: "F",
    seat: "08",
    tier: "Gold",
    price: "₦15,000",
    holder: "Tomi Adebayo",
    orderId: "ORD-882201",
  },
  {
    ref: "OS-10422",
    eventTitle: "Wole Soyinka: A Dance of the Forests",
    date: "Sun, 21 Jun 2026",
    doors: "Doors 4:00 PM",
    hall: "Banquet Hall",
    venue: "National Theatre, Iganmu",
    section: "GA",
    row: "—",
    seat: "47",
    tier: "Silver",
    price: "₦8,500",
    holder: "Tomi Adebayo",
    orderId: "ORD-882355",
  },
];

export default function MyTickets() {
  const handleDownload = async (t: TicketData) => {
    try {
      await downloadTicketPdf(t);
      toast.success("Ticket downloaded");
    } catch (e) {
      console.error(e);
      toast.error("Could not generate PDF");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <main className="container pt-32 pb-24">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <p className="font-mono-label text-muted-foreground mb-4">
            ///  Your wallet
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-semibold tracking-tight text-balance">
            My <span className="italic text-highlight">tickets</span>.
          </h1>
          <p className="mt-4 text-muted-foreground max-w-xl">
            Every ticket here is valid for entry at the National Theatre,
            Iganmu. Download the PDF or show the QR at the gate.
          </p>
        </div>

        {/* Tickets */}
        <div className="grid gap-6">
          {sampleTickets.map((t) => (
            <article
              key={t.ref}
              className="group relative bg-card border border-border rounded-sm shadow-card overflow-hidden"
            >
              {/* dashed perforation */}
              <div
                className="absolute top-0 bottom-0 hidden md:block border-l border-dashed border-border"
                style={{ left: "72%" }}
                aria-hidden
              />

              <div className="grid md:grid-cols-[1fr_auto] gap-0">
                {/* main */}
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="font-mono-label bg-accent text-accent-foreground px-2 py-1">
                      {t.tier}
                    </span>
                    <span className="font-mono-label text-muted-foreground">
                      {t.ref}
                    </span>
                  </div>

                  <p className="font-mono-label text-muted-foreground mb-2">
                    The National Theatre presents
                  </p>
                  <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
                    {t.eventTitle}
                  </h2>
                  {t.eventSubtitle && (
                    <p className="font-display italic text-highlight text-lg mt-1">
                      {t.eventSubtitle}
                    </p>
                  )}

                  <div className="h-px bg-highlight/60 my-6" />

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    <Detail icon={<Calendar className="w-3.5 h-3.5" />} label="Date" value={t.date} />
                    <Detail label="Doors" value={t.doors} />
                    <Detail icon={<MapPin className="w-3.5 h-3.5" />} label="Hall" value={t.hall} />
                    <Detail label="Section" value={`${t.section} · Row ${t.row} · Seat ${t.seat}`} />
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Button
                      variant="hero"
                      onClick={() => handleDownload(t)}
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </Button>
                    <Button variant="poster" size="sm">
                      <TicketIcon className="w-4 h-4" />
                      View QR
                    </Button>
                    <span className="font-mono-label text-muted-foreground ml-auto">
                      Paid · {t.price}
                    </span>
                  </div>
                </div>

                {/* stub */}
                <div className="hidden md:flex flex-col items-center justify-center bg-foreground text-background p-8 w-56 relative">
                  <div className="absolute top-4 left-4 font-mono-label opacity-60">Admit One</div>
                  <div className="font-display text-2xl leading-none">
                    Olive<span className="text-accent">.</span>
                  </div>
                  <div className="font-display text-2xl leading-none mb-6">Send</div>
                  <div className="w-28 h-28 bg-background grid grid-cols-8 grid-rows-8 gap-px p-1">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <span
                        key={i}
                        className={
                          (i * 7 + t.ref.length) % 3 === 0
                            ? "bg-foreground"
                            : "bg-background"
                        }
                      />
                    ))}
                  </div>
                  <div className="font-mono-label mt-4 text-accent">{t.ref}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function Detail({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <div className="font-mono-label text-muted-foreground flex items-center gap-1.5 mb-1">
        {icon}
        {label}
      </div>
      <div className="font-display text-base font-semibold leading-snug">
        {value}
      </div>
    </div>
  );
}
