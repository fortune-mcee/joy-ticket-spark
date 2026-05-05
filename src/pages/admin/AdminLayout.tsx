import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Building2,
  Tags,
  Receipt,
  Users,
  Settings,
  TicketCheck,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/events", label: "Events", icon: CalendarDays },
  { to: "/admin/halls", label: "Halls", icon: Building2 },
  { to: "/admin/categories", label: "Categories", icon: Tags },
  { to: "/admin/bookings", label: "Bookings", icon: Receipt },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout() {
  const { pathname } = useLocation();
  const current = nav.find((n) => (n.end ? pathname === n.to : pathname.startsWith(n.to)));

  return (
    <div className="min-h-screen flex w-full bg-background text-foreground">
      <aside className="w-64 shrink-0 border-r border-border bg-secondary/40 hidden md:flex flex-col">
        <div className="p-6 border-b border-border">
          <NavLink to="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-sm bg-primary text-primary-foreground grid place-items-center">
              <TicketCheck className="h-4 w-4" />
            </div>
            <div className="leading-tight">
              <div className="font-display text-lg">Olive Send</div>
              <div className="font-mono-label text-muted-foreground">Admin · Iganmu</div>
            </div>
          </NavLink>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-sm px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/80 hover:bg-muted hover:text-foreground",
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <NavLink
            to="/"
            className="flex items-center justify-between text-xs font-mono-label text-muted-foreground hover:text-foreground"
          >
            View public site <ArrowUpRight className="h-3.5 w-3.5" />
          </NavLink>
        </div>
      </aside>

      <main className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 border-b border-border px-6 flex items-center justify-between bg-background/80 backdrop-blur sticky top-0 z-10">
          <div>
            <div className="font-mono-label text-muted-foreground">Admin</div>
            <h1 className="font-display text-xl leading-none">{current?.label ?? "Admin"}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium">Adé Williams</div>
              <div className="font-mono-label text-muted-foreground">Box Office Lead</div>
            </div>
            <div className="h-9 w-9 rounded-full bg-accent text-accent-foreground grid place-items-center font-display">
              A
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
