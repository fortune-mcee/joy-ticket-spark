import event1 from "@/assets/event-1.jpg";
import event2 from "@/assets/event-2.jpg";
import event3 from "@/assets/event-3.jpg";
import event4 from "@/assets/event-4.jpg";
import spotlight from "@/assets/spotlight-artist.jpg";
import hero from "@/assets/hero-stage.jpg";

export type EventCategory =
  | "Concert"
  | "Theatre"
  | "Dance"
  | "Jazz"
  | "Festival"
  | "Cinema"
  | "Talk";

export type EventStatus = "Selling Fast" | "Few Left" | "New" | "Sold Out";

export type Event = {
  id: string;
  img: string;
  category: EventCategory;
  title: string;
  artist: string;
  date: string;        // display date
  iso: string;         // sortable ISO date
  hall: string;        // National Theatre hall
  price: string;
  priceFrom: number;
  status?: EventStatus;
  blurb: string;
};

export const HALLS = [
  "Main Bowl",
  "Cinema Hall 1",
  "Cinema Hall 2",
  "Exhibition Hall",
  "Banquet Hall",
] as const;

export const CATEGORIES: EventCategory[] = [
  "Concert",
  "Theatre",
  "Dance",
  "Jazz",
  "Festival",
  "Cinema",
  "Talk",
];

export const events: Event[] = [
  {
    id: "ag-orchestra",
    img: hero,
    category: "Concert",
    title: "Adekunle Gold · Orchestra Show",
    artist: "Adekunle Gold with the National Symphony",
    date: "Sat 14 Mar 2026 · 7:30 PM",
    iso: "2026-03-14",
    hall: "Main Bowl",
    price: "From ₦25,000",
    priceFrom: 25000,
    status: "Selling Fast",
    blurb:
      "A one-night-only orchestral reimagining of AG's catalogue, staged inside the Main Bowl.",
  },
  {
    id: "lucid-dreams",
    img: event1,
    category: "Concert",
    title: "Lucid Dreams",
    artist: "Tiwa Savage",
    date: "Fri 27 Mar 2026 · 8:00 PM",
    iso: "2026-03-27",
    hall: "Main Bowl",
    price: "From ₦35,000",
    priceFrom: 35000,
    status: "New",
    blurb:
      "A theatrical concert experience blending afrobeats with stagecraft.",
  },
  {
    id: "the-masquerade",
    img: event2,
    category: "Dance",
    title: "The Masquerade",
    artist: "National Troupe of Nigeria",
    date: "Sat 04 Apr 2026 · 6:00 PM",
    iso: "2026-04-04",
    hall: "Main Bowl",
    price: "From ₦8,000",
    priceFrom: 8000,
    blurb:
      "A contemporary dance work tracing the iconography of the Nigerian masquerade.",
  },
  {
    id: "underground-12",
    img: event3,
    category: "Festival",
    title: "Felabration: Underground Vol. 12",
    artist: "DJ Obi · Spinall · Cuppy",
    date: "Sat 18 Apr 2026 · 10:00 PM",
    iso: "2026-04-18",
    hall: "Exhibition Hall",
    price: "From ₦12,500",
    priceFrom: 12500,
    blurb:
      "An all-night tribute to Fela, reimagined for the new generation.",
  },
  {
    id: "after-hours",
    img: event4,
    category: "Jazz",
    title: "After Hours",
    artist: "The Lagos Quartet",
    date: "Thu 23 Apr 2026 · 9:00 PM",
    iso: "2026-04-23",
    hall: "Banquet Hall",
    price: "From ₦9,500",
    priceFrom: 9500,
    status: "Few Left",
    blurb:
      "Intimate late-night jazz in the Banquet Hall — limited capacity.",
  },
  {
    id: "ade-williams-inconv",
    img: spotlight,
    category: "Talk",
    title: "In Conversation: Adé Williams",
    artist: "Adé Williams × Toni Kan",
    date: "Sun 03 May 2026 · 4:00 PM",
    iso: "2026-05-03",
    hall: "Cinema Hall 2",
    price: "From ₦4,500",
    priceFrom: 4500,
    blurb:
      "A conversation on building a sound, recorded live for The Send journal.",
  },
  {
    id: "iganmu-shorts",
    img: event4,
    category: "Cinema",
    title: "Iganmu Shorts: New Nigerian Cinema",
    artist: "Curated by Femi Odugbemi",
    date: "Fri 15 May 2026 · 7:00 PM",
    iso: "2026-05-15",
    hall: "Cinema Hall 1",
    price: "From ₦3,500",
    priceFrom: 3500,
    status: "New",
    blurb:
      "Eight short films from emerging Nigerian directors, plus Q&A.",
  },
  {
    id: "ojo-iya",
    img: event2,
    category: "Theatre",
    title: "Ojó Ìyá",
    artist: "MUSON Centre Ensemble",
    date: "Sat 30 May 2026 · 6:00 PM",
    iso: "2026-05-30",
    hall: "Main Bowl",
    price: "From ₦7,500",
    priceFrom: 7500,
    blurb:
      "A Yoruba-language drama exploring motherhood across three generations.",
  },
];
