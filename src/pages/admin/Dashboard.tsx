import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  bookings,
  bookingStats,
  formatNaira,
  revenueByDay,
  salesByCategory,
  salesByHall,
} from "@/data/bookings";
import { events } from "@/data/events";
import { TrendingUp, Ticket, ShoppingBag, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const PIE_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--highlight))",
  "hsl(var(--muted-foreground))",
  "hsl(var(--ring))",
  "hsl(var(--foreground))",
  "hsl(var(--secondary-foreground))",
];

function Stat({
  label,
  value,
  delta,
  icon: Icon,
}: {
  label: string;
  value: string;
  delta?: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="border-border">
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardDescription className="font-mono-label">{label}</CardDescription>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="font-display text-3xl">{value}</div>
        {delta && <div className="text-xs text-muted-foreground mt-1">{delta}</div>}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const stats = bookingStats();
  const daily = revenueByDay();
  const byCat = salesByCategory();
  const byHall = salesByHall();
  const recent = bookings.slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Revenue (30d)" value={formatNaira(stats.revenue)} delta="+12.4% vs last period" icon={TrendingUp} />
        <Stat label="Tickets sold" value={stats.tickets.toLocaleString()} delta={`${stats.orders} orders`} icon={Ticket} />
        <Stat label="Avg. order value" value={formatNaira(stats.aov)} delta="Across all halls" icon={ShoppingBag} />
        <Stat label="Pending / Refunded" value={`${stats.pending} / ${stats.refunded}`} delta="Needs review" icon={Clock} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border-border">
          <CardHeader>
            <CardTitle className="font-display">Revenue trend</CardTitle>
            <CardDescription>Daily confirmed sales · last 30 days</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={daily}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 4,
                  }}
                  formatter={(v: number) => formatNaira(v)}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--accent))", r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="font-display">Sales by category</CardTitle>
            <CardDescription>Confirmed revenue share</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={byCat} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                  {byCat.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 4,
                  }}
                  formatter={(v: number) => formatNaira(v)}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border-border">
          <CardHeader>
            <CardTitle className="font-display">Tickets by hall</CardTitle>
            <CardDescription>National Theatre venue performance</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byHall}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="hall" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 4,
                  }}
                />
                <Bar dataKey="tickets" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="font-display">Recent bookings</CardTitle>
            <CardDescription>Latest activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recent.map((b) => {
              const ev = events.find((e) => e.id === b.eventId);
              return (
                <div key={b.id} className="flex items-center justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{b.customer}</div>
                    <div className="font-mono-label text-muted-foreground truncate">
                      {b.ref} · {ev?.title}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatNaira(b.total)}</div>
                    <Badge
                      variant="secondary"
                      className="font-mono-label text-[10px] mt-0.5"
                    >
                      {b.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
