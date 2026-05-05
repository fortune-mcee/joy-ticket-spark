import { useState } from "react";
import { HALLS, events } from "@/data/events";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Users } from "lucide-react";
import { toast } from "sonner";

type Hall = { name: string; capacity: number; type: string; description: string };

const initial: Hall[] = [
  { name: "Main Bowl", capacity: 5000, type: "Auditorium", description: "Iconic circular auditorium for major concerts and ceremonies." },
  { name: "Cinema Hall 1", capacity: 700, type: "Cinema", description: "Classic cinema for screenings and premieres." },
  { name: "Cinema Hall 2", capacity: 700, type: "Cinema", description: "Sister hall to Cinema 1, also used for talks." },
  { name: "Exhibition Hall", capacity: 1200, type: "Flex space", description: "Large flat-floor hall for festivals and expos." },
  { name: "Banquet Hall", capacity: 400, type: "Reception", description: "Intimate reception room for jazz and dinners." },
];

export default function AdminHalls() {
  const [halls, setHalls] = useState<Hall[]>(initial);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Hall>({ name: "", capacity: 0, type: "", description: "" });

  const eventsByHall = (h: string) => events.filter((e) => e.hall === h).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground max-w-xl">
          Manage the National Theatre's halls and their seating capacity. Events are programmed into these spaces.
        </p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="hero"><Plus className="h-4 w-4" /> Add hall</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-display text-2xl">Add hall</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2"><Label>Type</Label><Input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} /></div>
                <div className="grid gap-2"><Label>Capacity</Label><Input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} /></div>
              </div>
              <div className="grid gap-2"><Label>Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            </div>
            <DialogFooter>
              <Button variant="hero" onClick={() => { setHalls([...halls, form]); setOpen(false); setForm({ name: "", capacity: 0, type: "", description: "" }); toast.success("Hall added"); }}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {halls.map((h) => (
          <Card key={h.name} className="border-border">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="font-display text-2xl">{h.name}</CardTitle>
                  <CardDescription>{h.type}</CardDescription>
                </div>
                <Badge variant="outline" className="font-mono-label">{eventsByHall(h.name)} shows</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{h.description}</p>
              <div className="flex items-center gap-2 font-mono-label text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                Capacity {h.capacity.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
