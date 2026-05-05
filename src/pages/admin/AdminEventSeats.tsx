import { Link, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { events } from "@/data/events";
import {
  hallSeating,
  getEventSeats,
  setSeatStatus,
  SeatStatus,
  seatTier,
} from "@/data/seating";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Lock, Ticket, Sparkles, RotateCcw, ShoppingBag } from "lucide-react";
import { SeatMap, SeatLegend } from "@/components/admin/SeatMap";
import { toast } from "sonner";

type Tool = "select" | "block" | "hold" | "counter" | "release";

const TOOLS: { id: Tool; label: string; icon: any; tone: string }[] = [
  { id: "select",  label: "Select",         icon: Ticket,    tone: "" },
  { id: "block",   label: "Block",          icon: Lock,      tone: "bg-muted" },
  { id: "hold",    label: "Hold (VIP)",     icon: Sparkles,  tone: "bg-accent text-accent-foreground" },
  { id: "counter", label: "Sell at counter",icon: ShoppingBag, tone: "bg-highlight text-highlight-foreground" },
  { id: "release", label: "Release",        icon: RotateCcw, tone: "" },
];

export default function AdminEventSeats() {
  const { id } = useParams();
  const ev = events.find((e) => e.id === id);
  const cfg = ev ? hallSeating[ev.hall] : undefined;

  const [tool, setTool] = useState<Tool>("select");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [, force] = useState(0);
  const [counterOpen, setCounterOpen] = useState(false);
  const [counterForm, setCounterForm] = useState({ name: "", phone: "" });

  const state = useMemo(
    () => (ev ? getEventSeats(ev.id, ev.hall) : {}),
    [ev],
  );

  if (!ev || !cfg) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Event or hall not found.</p>
        <Button asChild variant="link"><Link to="/admin/events">Back to events</Link></Button>
      </div>
    );
  }

  const counts = Object.values(state).reduce(
    (acc, s) => ((acc[s] = (acc[s] ?? 0) + 1), acc),
    {} as Record<SeatStatus, number>,
  );
  const total = Object.values(state).length;
  const sellable = (counts.available ?? 0);

  const selectedRevenue = Array.from(selected).reduce((sum, sid) => {
    const t = seatTier(ev.hall, sid);
    return sum + (t?.price ?? 0);
  }, 0);

  const applyTool = (id: string, status: SeatStatus) => {
    if (tool === "select") {
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else if (status !== "sold") next.add(id);
        return next;
      });
      return;
    }
    if (status === "sold" && tool !== "release") {
      toast.error("Online-sold seats can't be modified here.");
      return;
    }
    const next: SeatStatus =
      tool === "block" ? "blocked"
      : tool === "hold" ? "held"
      : tool === "counter" ? "counter"
      : "available";
    setSeatStatus(ev.id, id, next);
    force((n) => n + 1);
  };

  const bulk = (status: SeatStatus) => {
    if (selected.size === 0) return toast.error("No seats selected.");
    selected.forEach((sid) => setSeatStatus(ev.id, sid, status));
    toast.success(`${selected.size} seat(s) → ${status}`);
    setSelected(new Set());
    force((n) => n + 1);
  };

  const completeCounterSale = () => {
    if (selected.size === 0) return;
    selected.forEach((sid) => setSeatStatus(ev.id, sid, "counter"));
    toast.success(`Sold ${selected.size} seat(s) at counter to ${counterForm.name || "walk-in"} · ₦${selectedRevenue.toLocaleString()}`);
    setSelected(new Set());
    setCounterOpen(false);
    setCounterForm({ name: "", phone: "" });
    force((n) => n + 1);
  };

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-3">
        <Link to={`/admin/events/${ev.id}`}><ArrowLeft className="h-4 w-4" /> Event detail</Link>
      </Button>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-mono-label text-muted-foreground">Box office · {ev.hall}</div>
          <h2 className="font-display text-4xl">{ev.title}</h2>
          <p className="text-muted-foreground">{ev.date}</p>
        </div>
        <div className="flex gap-2">
          {(["sold","counter","held","blocked","available"] as SeatStatus[]).map((s) => (
            <Card key={s} className="border-border min-w-[110px]">
              <CardContent className="p-3">
                <div className="font-mono-label text-muted-foreground capitalize">{s}</div>
                <div className="font-display text-xl">{counts[s] ?? 0}</div>
              </CardContent>
            </Card>
          ))}
          <Card className="border-border min-w-[110px]">
            <CardContent className="p-3">
              <div className="font-mono-label text-muted-foreground">Total</div>
              <div className="font-display text-xl">{total}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Toolbar */}
      <Card className="border-border">
        <CardContent className="p-4 flex flex-wrap items-center gap-3">
          <span className="font-mono-label text-muted-foreground">Tool</span>
          <div className="flex flex-wrap gap-1">
            {TOOLS.map((t) => (
              <Button
                key={t.id}
                size="sm"
                variant={tool === t.id ? "hero" : "outline"}
                onClick={() => setTool(t.id)}
              >
                <t.icon className="h-3 w-3" /> {t.label}
              </Button>
            ))}
          </div>

          <div className="flex-1" />

          <span className="font-mono-label text-muted-foreground">
            {selected.size} selected · ₦{selectedRevenue.toLocaleString()}
          </span>
          <Button size="sm" variant="outline" onClick={() => bulk("blocked")} disabled={!selected.size}>Block</Button>
          <Button size="sm" variant="outline" onClick={() => bulk("held")} disabled={!selected.size}>Hold</Button>
          <Button size="sm" variant="outline" onClick={() => bulk("available")} disabled={!selected.size}>Release</Button>
          <Button size="sm" variant="ticket" onClick={() => setCounterOpen(true)} disabled={!selected.size}>
            <ShoppingBag className="h-3 w-3" /> Sell at counter
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="border-border lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-display">Seat map</CardTitle>
            <CardDescription>Click seats to {tool === "select" ? "add to selection" : `mark as ${tool}`}.</CardDescription>
          </CardHeader>
          <CardContent>
            <SeatMap
              config={cfg}
              state={state}
              selected={selected}
              onSeatClick={applyTool}
            />
            <div className="mt-6">
              <SeatLegend
                tiers={[
                  { label: "Available", status: "available" },
                  { label: "Sold (online)", status: "sold" },
                  { label: "Counter", status: "counter" },
                  { label: "Held / VIP", status: "held" },
                  { label: "Blocked", status: "blocked" },
                ]}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="font-display text-xl">Tiers</CardTitle>
            <CardDescription>Pricing applied to this event</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {cfg.tiers.map((t) => (
              <div key={t.id} className="flex items-center justify-between border border-border rounded-sm p-2">
                <div className="font-medium">{t.label}</div>
                <Badge variant="outline" className="font-mono-label">₦{t.price.toLocaleString()}</Badge>
              </div>
            ))}
            <div className="border-t border-border pt-3 mt-3 space-y-1 font-mono-label text-muted-foreground">
              <div className="flex justify-between"><span>Sellable now</span><span className="text-foreground">{sellable}</span></div>
              <div className="flex justify-between"><span>Capacity</span><span className="text-foreground">{total}</span></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={counterOpen} onOpenChange={setCounterOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-display text-2xl">Counter sale</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2"><Label>Customer name</Label><Input value={counterForm.name} onChange={(e) => setCounterForm({ ...counterForm, name: e.target.value })} placeholder="Walk-in" /></div>
            <div className="grid gap-2"><Label>Phone (optional)</Label><Input value={counterForm.phone} onChange={(e) => setCounterForm({ ...counterForm, phone: e.target.value })} /></div>
            <div className="border border-border rounded-sm p-3 font-mono-label text-muted-foreground">
              <div className="flex justify-between"><span>Seats</span><span className="text-foreground">{selected.size}</span></div>
              <div className="flex justify-between"><span>Total</span><span className="text-foreground">₦{selectedRevenue.toLocaleString()}</span></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCounterOpen(false)}>Cancel</Button>
            <Button variant="ticket" onClick={completeCounterSale}>Complete sale</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
