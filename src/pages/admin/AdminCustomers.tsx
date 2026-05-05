import { useMemo, useState } from "react";
import { bookings, formatNaira } from "@/data/bookings";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Row = { name: string; email: string; orders: number; tickets: number; spend: number; last: string };

export default function AdminCustomers() {
  const [q, setQ] = useState("");

  const rows: Row[] = useMemo(() => {
    const map = new Map<string, Row>();
    for (const b of bookings) {
      const key = b.email;
      const r = map.get(key) ?? { name: b.customer, email: b.email, orders: 0, tickets: 0, spend: 0, last: b.createdAt };
      r.orders += 1;
      r.tickets += b.qty;
      if (b.status === "Confirmed") r.spend += b.total;
      if (b.createdAt > r.last) r.last = b.createdAt;
      map.set(key, r);
    }
    return Array.from(map.values()).sort((a, b) => b.spend - a.spend);
  }, []);

  const filtered = rows.filter((r) =>
    q === "" || r.name.toLowerCase().includes(q.toLowerCase()) || r.email.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search customers…" className="pl-9" />
      </div>

      <div className="rounded-sm border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-mono-label">Customer</TableHead>
              <TableHead className="font-mono-label">Orders</TableHead>
              <TableHead className="font-mono-label">Tickets</TableHead>
              <TableHead className="font-mono-label">Lifetime spend</TableHead>
              <TableHead className="font-mono-label">Last booking</TableHead>
              <TableHead className="font-mono-label">Tier</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => (
              <TableRow key={r.email}>
                <TableCell>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.email}</div>
                </TableCell>
                <TableCell>{r.orders}</TableCell>
                <TableCell>{r.tickets}</TableCell>
                <TableCell>{formatNaira(r.spend)}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{new Date(r.last).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={r.spend > 100000 ? "default" : "outline"} className="font-mono-label">
                    {r.spend > 100000 ? "VIP" : r.spend > 30000 ? "Regular" : "New"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
