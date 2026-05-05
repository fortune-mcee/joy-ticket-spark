import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { events as seedEvents, CATEGORIES, HALLS } from "@/data/events";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, Eye } from "lucide-react";
import { formatNaira } from "@/data/bookings";
import { toast } from "sonner";

export default function AdminEvents() {
  const [list, setList] = useState(seedEvents);
  const [q, setQ] = useState("");
  const [hall, setHall] = useState<string>("all");
  const [cat, setCat] = useState<string>("all");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    return list.filter(
      (e) =>
        (hall === "all" || e.hall === hall) &&
        (cat === "all" || e.category === cat) &&
        (q === "" || e.title.toLowerCase().includes(q.toLowerCase()) || e.artist.toLowerCase().includes(q.toLowerCase())),
    );
  }, [list, q, hall, cat]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search events…" className="pl-9" />
        </div>
        <Select value={hall} onValueChange={setHall}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Hall" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All halls</SelectItem>
            {HALLS.map((h) => <SelectItem key={h} value={h}>{h}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={cat} onValueChange={setCat}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="hero" size="default"><Plus className="h-4 w-4" /> New event</Button>
          </DialogTrigger>
          <NewEventDialog
            onCreate={(ev) => {
              setList((l) => [ev, ...l]);
              setOpen(false);
              toast.success("Event created");
            }}
          />
        </Dialog>
      </div>

      <div className="rounded-sm border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-mono-label">Event</TableHead>
              <TableHead className="font-mono-label">Hall</TableHead>
              <TableHead className="font-mono-label">Category</TableHead>
              <TableHead className="font-mono-label">Date</TableHead>
              <TableHead className="font-mono-label">Price from</TableHead>
              <TableHead className="font-mono-label">Status</TableHead>
              <TableHead className="font-mono-label text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((e) => (
              <TableRow key={e.id}>
                <TableCell>
                  <div className="font-medium">{e.title}</div>
                  <div className="text-xs text-muted-foreground">{e.artist}</div>
                </TableCell>
                <TableCell>{e.hall}</TableCell>
                <TableCell><Badge variant="outline" className="font-mono-label">{e.category}</Badge></TableCell>
                <TableCell className="text-sm">{e.date}</TableCell>
                <TableCell>{formatNaira(e.priceFrom)}</TableCell>
                <TableCell>
                  {e.status ? (
                    <Badge className="font-mono-label" variant="secondary">{e.status}</Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">On sale</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="ghost" size="sm">
                    <Link to={`/admin/events/${e.id}`}><Eye className="h-4 w-4" /> View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                  No events match your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function NewEventDialog({ onCreate }: { onCreate: (e: any) => void }) {
  const [form, setForm] = useState({
    title: "",
    artist: "",
    hall: HALLS[0] as string,
    category: CATEGORIES[0] as string,
    date: "",
    price: 5000,
  });
  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle className="font-display text-2xl">Create new event</DialogTitle>
        <DialogDescription>Add a show to the National Theatre programme.</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-2">
        <div className="grid gap-2">
          <Label>Title</Label>
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div className="grid gap-2">
          <Label>Artist / company</Label>
          <Input value={form.artist} onChange={(e) => setForm({ ...form, artist: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-2">
            <Label>Hall</Label>
            <Select value={form.hall} onValueChange={(v) => setForm({ ...form, hall: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {HALLS.map((h) => <SelectItem key={h} value={h}>{h}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-2">
            <Label>Date</Label>
            <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <Label>Price from (₦)</Label>
            <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button
          variant="hero"
          onClick={() =>
            onCreate({
              id: form.title.toLowerCase().replace(/\s+/g, "-").slice(0, 24) || `evt-${Date.now()}`,
              img: seedEvents[0].img,
              category: form.category,
              title: form.title || "Untitled show",
              artist: form.artist,
              date: form.date || "TBA",
              iso: form.date || new Date().toISOString().slice(0, 10),
              hall: form.hall,
              price: `From ₦${form.price.toLocaleString()}`,
              priceFrom: form.price,
              status: "New",
              blurb: "",
            })
          }
        >
          Create event
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
