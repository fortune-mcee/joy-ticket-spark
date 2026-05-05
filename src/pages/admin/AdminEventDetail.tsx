import { Link, useParams } from "react-router-dom";
import { events } from "@/data/events";
import { bookings, formatNaira } from "@/data/bookings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Calendar, Tag } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function AdminEventDetail() {
  const { id } = useParams();
  const ev = events.find((e) => e.id === id);
  if (!ev) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Event not found.</p>
        <Button asChild variant="link"><Link to="/admin/events">Back to events</Link></Button>
      </div>
    );
  }

  const evBookings = bookings.filter((b) => b.eventId === ev.id);
  const tickets = evBookings.filter((b) => b.status === "Confirmed").reduce((s, b) => s + b.qty, 0);
  const revenue = evBookings.filter((b) => b.status === "Confirmed").reduce((s, b) => s + b.total, 0);

  // tier mock
  const tiers = [
    { tier: "Gold", sold: Math.round(tickets * 0.45), capacity: 200 },
    { tier: "Silver", sold: Math.round(tickets * 0.35), capacity: 400 },
    { tier: "Standard", sold: Math.round(tickets * 0.20), capacity: 600 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="-ml-3">
          <Link to="/admin/events"><ArrowLeft className="h-4 w-4" /> All events</Link>
        </Button>
        <Button asChild variant="hero" size="sm">
          <Link to={`/admin/events/${ev.id}/seats`}>Manage seats & box office</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="aspect-[16/8] rounded-sm overflow-hidden border border-border">
            <img src={ev.img} alt={ev.title} className="w-full h-full object-cover" />
          </div>
          <div>
            <Badge variant="outline" className="font-mono-label">{ev.category}</Badge>
            <h2 className="font-display text-4xl mt-2">{ev.title}</h2>
            <p className="text-muted-foreground mt-1">{ev.artist}</p>
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {ev.date}</span>
              <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {ev.hall} · National Theatre</span>
              <span className="flex items-center gap-2"><Tag className="h-4 w-4" /> {ev.price}</span>
            </div>
            {ev.blurb && <p className="mt-4 text-sm">{ev.blurb}</p>}
          </div>
        </div>

        <div className="space-y-4">
          <Card className="border-border">
            <CardHeader><CardDescription className="font-mono-label">Tickets sold</CardDescription></CardHeader>
            <CardContent><div className="font-display text-3xl">{tickets}</div></CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader><CardDescription className="font-mono-label">Revenue</CardDescription></CardHeader>
            <CardContent><div className="font-display text-3xl">{formatNaira(revenue)}</div></CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader><CardDescription className="font-mono-label">Orders</CardDescription></CardHeader>
            <CardContent><div className="font-display text-3xl">{evBookings.length}</div></CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="font-display">Tier performance</CardTitle>
          <CardDescription>Sold vs. capacity per ticket tier</CardDescription>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={tiers}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="tier" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }} />
              <Bar dataKey="capacity" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="sold" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="font-display">Bookings for this event</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-mono-label">Ref</TableHead>
                <TableHead className="font-mono-label">Customer</TableHead>
                <TableHead className="font-mono-label">Qty</TableHead>
                <TableHead className="font-mono-label">Total</TableHead>
                <TableHead className="font-mono-label">Channel</TableHead>
                <TableHead className="font-mono-label">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evBookings.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-mono text-xs">{b.ref}</TableCell>
                  <TableCell>{b.customer}</TableCell>
                  <TableCell>{b.qty}</TableCell>
                  <TableCell>{formatNaira(b.total)}</TableCell>
                  <TableCell>{b.channel}</TableCell>
                  <TableCell><Badge variant="secondary" className="font-mono-label">{b.status}</Badge></TableCell>
                </TableRow>
              ))}
              {evBookings.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No bookings yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
