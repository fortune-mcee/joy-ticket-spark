import { useMemo, useState } from "react";
import { bookings, formatNaira, type BookingStatus } from "@/data/bookings";
import { events } from "@/data/events";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const STATUSES: (BookingStatus | "all")[] = ["all", "Confirmed", "Pending", "Refunded", "Cancelled"];

const statusVariant: Record<BookingStatus, string> = {
  Confirmed: "bg-primary text-primary-foreground",
  Pending: "bg-accent text-accent-foreground",
  Refunded: "bg-muted text-muted-foreground",
  Cancelled: "bg-destructive text-destructive-foreground",
};

export default function AdminBookings() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [channel, setChannel] = useState<string>("all");

  const rows = useMemo(() => {
    return bookings.filter((b) => {
      const ev = events.find((e) => e.id === b.eventId);
      const text = `${b.ref} ${b.customer} ${b.email} ${ev?.title ?? ""}`.toLowerCase();
      return (
        (status === "all" || b.status === status) &&
        (channel === "all" || b.channel === channel) &&
        (q === "" || text.includes(q.toLowerCase()))
      );
    });
  }, [q, status, channel]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search ref, customer, event…" className="pl-9" />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => <SelectItem key={s} value={s}>{s === "all" ? "All statuses" : s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={channel} onValueChange={setChannel}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All channels</SelectItem>
            <SelectItem value="Web">Web</SelectItem>
            <SelectItem value="Box Office">Box Office</SelectItem>
            <SelectItem value="Partner">Partner</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="poster" onClick={() => toast.success("Export queued")}><Download className="h-4 w-4" /> Export CSV</Button>
      </div>

      <div className="rounded-sm border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-mono-label">Ref</TableHead>
              <TableHead className="font-mono-label">Customer</TableHead>
              <TableHead className="font-mono-label">Event</TableHead>
              <TableHead className="font-mono-label">Qty</TableHead>
              <TableHead className="font-mono-label">Total</TableHead>
              <TableHead className="font-mono-label">Channel</TableHead>
              <TableHead className="font-mono-label">Status</TableHead>
              <TableHead className="font-mono-label">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((b) => {
              const ev = events.find((e) => e.id === b.eventId);
              return (
                <TableRow key={b.id}>
                  <TableCell className="font-mono text-xs">{b.ref}</TableCell>
                  <TableCell>
                    <div className="font-medium">{b.customer}</div>
                    <div className="text-xs text-muted-foreground">{b.email}</div>
                  </TableCell>
                  <TableCell className="max-w-[220px] truncate">{ev?.title}</TableCell>
                  <TableCell>{b.qty}</TableCell>
                  <TableCell>{formatNaira(b.total)}</TableCell>
                  <TableCell>{b.channel}</TableCell>
                  <TableCell>
                    <Badge className={`font-mono-label ${statusVariant[b.status]}`}>{b.status}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(b.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              );
            })}
            {rows.length === 0 && (
              <TableRow><TableCell colSpan={8} className="text-center py-12 text-muted-foreground">No bookings.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
