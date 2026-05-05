import { events } from "./events";

export type BookingStatus = "Confirmed" | "Pending" | "Refunded" | "Cancelled";
export type Channel = "Web" | "Box Office" | "Partner";

export type Booking = {
  id: string;
  ref: string;
  eventId: string;
  customer: string;
  email: string;
  qty: number;
  total: number;
  status: BookingStatus;
  channel: Channel;
  createdAt: string; // ISO
};

const customers = [
  ["Tomi Adebayo", "tomi@mail.com"],
  ["Ngozi Okafor", "ngozi@mail.com"],
  ["Emeka Bello", "emeka@mail.com"],
  ["Funke Ade", "funke@mail.com"],
  ["Yusuf Bala", "yusuf@mail.com"],
  ["Aisha Lawal", "aisha@mail.com"],
  ["Chinedu Obi", "chinedu@mail.com"],
  ["Sade Cole", "sade@mail.com"],
  ["Ibrahim Musa", "ibrahim@mail.com"],
  ["Zainab Yusuf", "zainab@mail.com"],
];

const statuses: BookingStatus[] = ["Confirmed", "Confirmed", "Confirmed", "Pending", "Refunded"];
const channels: Channel[] = ["Web", "Web", "Web", "Box Office", "Partner"];

// Deterministic mock generator
function rand(seed: number) {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

export const bookings: Booking[] = (() => {
  const r = rand(42);
  const list: Booking[] = [];
  for (let i = 0; i < 64; i++) {
    const ev = events[Math.floor(r() * events.length)];
    const c = customers[Math.floor(r() * customers.length)];
    const qty = 1 + Math.floor(r() * 4);
    const daysAgo = Math.floor(r() * 30);
    const created = new Date();
    created.setDate(created.getDate() - daysAgo);
    list.push({
      id: `bk-${i + 1}`,
      ref: `OS-${(10234 + i).toString()}`,
      eventId: ev.id,
      customer: c[0],
      email: c[1],
      qty,
      total: ev.priceFrom * qty,
      status: statuses[Math.floor(r() * statuses.length)],
      channel: channels[Math.floor(r() * channels.length)],
      createdAt: created.toISOString(),
    });
  }
  return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
})();

export function bookingStats() {
  const confirmed = bookings.filter((b) => b.status === "Confirmed");
  const revenue = confirmed.reduce((s, b) => s + b.total, 0);
  const tickets = confirmed.reduce((s, b) => s + b.qty, 0);
  return {
    revenue,
    tickets,
    orders: confirmed.length,
    pending: bookings.filter((b) => b.status === "Pending").length,
    refunded: bookings.filter((b) => b.status === "Refunded").length,
    aov: confirmed.length ? Math.round(revenue / confirmed.length) : 0,
  };
}

export function revenueByDay() {
  const map = new Map<string, number>();
  for (const b of bookings) {
    if (b.status !== "Confirmed") continue;
    const d = b.createdAt.slice(5, 10); // MM-DD
    map.set(d, (map.get(d) ?? 0) + b.total);
  }
  return Array.from(map.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, revenue]) => ({ date, revenue }));
}

export function salesByCategory() {
  const map = new Map<string, number>();
  for (const b of bookings) {
    if (b.status !== "Confirmed") continue;
    const ev = events.find((e) => e.id === b.eventId);
    if (!ev) continue;
    map.set(ev.category, (map.get(ev.category) ?? 0) + b.total);
  }
  return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
}

export function salesByHall() {
  const map = new Map<string, number>();
  for (const b of bookings) {
    if (b.status !== "Confirmed") continue;
    const ev = events.find((e) => e.id === b.eventId);
    if (!ev) continue;
    map.set(ev.hall, (map.get(ev.hall) ?? 0) + b.qty);
  }
  return Array.from(map.entries()).map(([hall, tickets]) => ({ hall, tickets }));
}

export const formatNaira = (n: number) =>
  "₦" + n.toLocaleString("en-NG", { maximumFractionDigits: 0 });
