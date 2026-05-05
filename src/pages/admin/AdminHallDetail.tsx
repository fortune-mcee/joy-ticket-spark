import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { hallSeating, hallCapacity, PricingTier, Zone, TierId } from "@/data/seating";
import { events } from "@/data/events";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Plus, Trash2, Users, Layers } from "lucide-react";
import { SeatMap } from "@/components/admin/SeatMap";
import { toast } from "sonner";

export default function AdminHallDetail() {
  const { hall: hallParam } = useParams();
  const hall = decodeURIComponent(hallParam ?? "");
  const initial = hallSeating[hall];

  const [tiers, setTiers] = useState<PricingTier[]>(initial?.tiers ?? []);
  const [zones, setZones] = useState<Zone[]>(initial?.zones ?? []);
  const [highlight, setHighlight] = useState<string | undefined>();

  if (!initial) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Hall not found.</p>
        <Button asChild variant="link"><Link to="/admin/halls">Back to halls</Link></Button>
      </div>
    );
  }

  const capacity = zones.reduce((s, z) => s + z.rows * z.seatsPerRow, 0);
  const upcoming = events.filter((e) => e.hall === hall);

  const updateZone = (id: string, patch: Partial<Zone>) =>
    setZones(zones.map((z) => (z.id === id ? { ...z, ...patch } : z)));

  const addZone = () =>
    setZones([
      ...zones,
      { id: `zone-${zones.length + 1}`, label: "New zone", tier: tiers[0]?.id ?? "standard", rows: 4, seatsPerRow: 12 },
    ]);

  const removeZone = (id: string) => setZones(zones.filter((z) => z.id !== id));

  const updateTier = (id: TierId, patch: Partial<PricingTier>) =>
    setTiers(tiers.map((t) => (t.id === id ? { ...t, ...patch } : t)));

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-3">
        <Link to="/admin/halls"><ArrowLeft className="h-4 w-4" /> All halls</Link>
      </Button>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-mono-label text-muted-foreground">National Theatre · Iganmu</div>
          <h2 className="font-display text-4xl">{hall}</h2>
        </div>
        <div className="flex gap-3">
          <Card className="border-border min-w-[140px]">
            <CardContent className="p-4">
              <div className="font-mono-label text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3" /> Capacity</div>
              <div className="font-display text-2xl">{capacity.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="border-border min-w-[140px]">
            <CardContent className="p-4">
              <div className="font-mono-label text-muted-foreground flex items-center gap-1"><Layers className="h-3 w-3" /> Zones</div>
              <div className="font-display text-2xl">{zones.length}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Editors */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-display">Pricing tiers</CardTitle>
              <CardDescription>Default ticket prices per tier. Events can override these.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {tiers.map((t) => (
                <div
                  key={t.id}
                  className="grid grid-cols-[1fr_120px] gap-2 items-center"
                  onMouseEnter={() => setHighlight(t.id)}
                  onMouseLeave={() => setHighlight(undefined)}
                >
                  <Input
                    value={t.label}
                    onChange={(e) => updateTier(t.id, { label: e.target.value })}
                  />
                  <div className="flex items-center gap-1">
                    <span className="font-mono-label text-muted-foreground">₦</span>
                    <Input
                      type="number"
                      value={t.price}
                      onChange={(e) => updateTier(t.id, { price: Number(e.target.value) })}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle className="font-display">Zones</CardTitle>
                <CardDescription>Group rows of seats and assign each to a tier.</CardDescription>
              </div>
              <Button size="sm" variant="hero" onClick={addZone}><Plus className="h-3 w-3" /> Add</Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-mono-label">Zone</TableHead>
                    <TableHead className="font-mono-label">Tier</TableHead>
                    <TableHead className="font-mono-label">Rows</TableHead>
                    <TableHead className="font-mono-label">Seats/row</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {zones.map((z) => (
                    <TableRow
                      key={z.id}
                      onMouseEnter={() => setHighlight(z.tier)}
                      onMouseLeave={() => setHighlight(undefined)}
                    >
                      <TableCell>
                        <Input value={z.label} onChange={(e) => updateZone(z.id, { label: e.target.value })} className="h-8" />
                      </TableCell>
                      <TableCell>
                        <Select value={z.tier} onValueChange={(v) => updateZone(z.id, { tier: v as TierId })}>
                          <SelectTrigger className="h-8 w-[120px]"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {tiers.map((t) => <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input type="number" value={z.rows} onChange={(e) => updateZone(z.id, { rows: Number(e.target.value) })} className="h-8 w-16" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" value={z.seatsPerRow} onChange={(e) => updateZone(z.id, { seatsPerRow: Number(e.target.value) })} className="h-8 w-16" />
                      </TableCell>
                      <TableCell>
                        <Button size="icon" variant="ghost" onClick={() => removeZone(z.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Button variant="hero" className="w-full" onClick={() => toast.success("Hall layout saved")}>
            Save hall layout
          </Button>
        </div>

        {/* Preview */}
        <div className="lg:col-span-3">
          <Card className="border-border sticky top-20">
            <CardHeader>
              <CardTitle className="font-display">Layout preview</CardTitle>
              <CardDescription>Hover a tier or zone to highlight it in the map.</CardDescription>
            </CardHeader>
            <CardContent>
              <SeatMap
                config={{ hall, stageLabel: initial.stageLabel, tiers, zones }}
                state={{}}
                highlightTier={highlight}
                compact
              />
              <div className="mt-6 flex flex-wrap gap-3 font-mono-label text-muted-foreground">
                {tiers.map((t) => (
                  <Badge key={t.id} variant="outline">{t.label} · ₦{t.price.toLocaleString()}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="font-display">Upcoming in this hall</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-mono-label">Event</TableHead>
                <TableHead className="font-mono-label">Date</TableHead>
                <TableHead className="font-mono-label">Box office</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcoming.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>{e.title}</TableCell>
                  <TableCell className="text-muted-foreground">{e.date}</TableCell>
                  <TableCell>
                    <Button asChild size="sm" variant="outline">
                      <Link to={`/admin/events/${e.id}/seats`}>Manage seats</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {upcoming.length === 0 && (
                <TableRow><TableCell colSpan={3} className="text-center py-6 text-muted-foreground">No upcoming events.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
