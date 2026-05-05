// Seating model for National Theatre halls.
// Each hall is a set of zones. A zone is a grid of rows × seats,
// linked to a pricing tier. Per-event seat state lives in seatStates.

export type TierId = "platinum" | "gold" | "silver" | "standard" | "balcony";

export type PricingTier = {
  id: TierId;
  label: string;
  color: string; // hsl token reference for swatch
  price: number; // NGN
};

export type Zone = {
  id: string;
  label: string;
  tier: TierId;
  rows: number;
  seatsPerRow: number;
  startRow?: number; // for row letter offset
};

export type HallSeating = {
  hall: string;
  stageLabel?: string;
  tiers: PricingTier[];
  zones: Zone[];
};

export type SeatStatus =
  | "available"
  | "blocked" // taken offline by admin (maintenance, restricted view)
  | "held" // reserved for VIP / press / artist guest list
  | "counter" // sold at the box-office counter
  | "sold"; // sold online

export type SeatId = string; // `${zoneId}-${rowLetter}-${seatNo}`

export const rowLetter = (i: number) => String.fromCharCode(65 + i);

export const seatId = (zoneId: string, rowIdx: number, seatNo: number): SeatId =>
  `${zoneId}-${rowLetter(rowIdx)}${seatNo}`;

const baseTiers: Record<string, PricingTier> = {
  platinum: { id: "platinum", label: "Platinum", color: "var(--highlight)", price: 50000 },
  gold:     { id: "gold",     label: "Gold",     color: "var(--accent)",    price: 30000 },
  silver:   { id: "silver",   label: "Silver",   color: "var(--primary)",   price: 18000 },
  standard: { id: "standard", label: "Standard", color: "var(--muted-foreground)", price: 10000 },
  balcony:  { id: "balcony",  label: "Balcony",  color: "var(--border)",    price: 6000 },
};

export const hallSeating: Record<string, HallSeating> = {
  "Main Bowl": {
    hall: "Main Bowl",
    stageLabel: "Main Stage",
    tiers: [baseTiers.platinum, baseTiers.gold, baseTiers.silver, baseTiers.standard, baseTiers.balcony],
    zones: [
      { id: "front",    label: "Front Orchestra",  tier: "platinum", rows: 4, seatsPerRow: 18 },
      { id: "mid",      label: "Mid Orchestra",    tier: "gold",     rows: 6, seatsPerRow: 22 },
      { id: "rear",     label: "Rear Orchestra",   tier: "silver",   rows: 6, seatsPerRow: 24 },
      { id: "balcony-l",label: "Balcony Left",     tier: "balcony",  rows: 4, seatsPerRow: 10 },
      { id: "balcony-r",label: "Balcony Right",    tier: "balcony",  rows: 4, seatsPerRow: 10 },
    ],
  },
  "Cinema Hall 1": {
    hall: "Cinema Hall 1",
    stageLabel: "Screen",
    tiers: [baseTiers.gold, baseTiers.silver, baseTiers.standard],
    zones: [
      { id: "front", label: "Front",  tier: "standard", rows: 3, seatsPerRow: 16 },
      { id: "mid",   label: "Middle", tier: "gold",     rows: 5, seatsPerRow: 18 },
      { id: "rear",  label: "Rear",   tier: "silver",   rows: 4, seatsPerRow: 18 },
    ],
  },
  "Cinema Hall 2": {
    hall: "Cinema Hall 2",
    stageLabel: "Screen",
    tiers: [baseTiers.gold, baseTiers.silver, baseTiers.standard],
    zones: [
      { id: "front", label: "Front",  tier: "standard", rows: 3, seatsPerRow: 16 },
      { id: "mid",   label: "Middle", tier: "gold",     rows: 5, seatsPerRow: 18 },
      { id: "rear",  label: "Rear",   tier: "silver",   rows: 4, seatsPerRow: 18 },
    ],
  },
  "Exhibition Hall": {
    hall: "Exhibition Hall",
    stageLabel: "Stage",
    tiers: [baseTiers.gold, baseTiers.standard],
    zones: [
      { id: "vip",      label: "VIP Tables",  tier: "gold",     rows: 4, seatsPerRow: 20 },
      { id: "general",  label: "General",     tier: "standard", rows: 8, seatsPerRow: 24 },
    ],
  },
  "Banquet Hall": {
    hall: "Banquet Hall",
    stageLabel: "Performance Area",
    tiers: [baseTiers.platinum, baseTiers.gold],
    zones: [
      { id: "tables-a", label: "Tables A",  tier: "platinum", rows: 4, seatsPerRow: 10 },
      { id: "tables-b", label: "Tables B",  tier: "gold",     rows: 6, seatsPerRow: 10 },
    ],
  },
};

export const hallCapacity = (hall: string) => {
  const cfg = hallSeating[hall];
  if (!cfg) return 0;
  return cfg.zones.reduce((s, z) => s + z.rows * z.seatsPerRow, 0);
};

// Per-event seat state. Mock store keyed by eventId.
export type EventSeatState = Record<SeatId, SeatStatus>;

const STORE: Record<string, EventSeatState> = {};

// Deterministically mark a portion of seats sold/held to look realistic
function seedEvent(eventId: string, hall: string): EventSeatState {
  const cfg = hallSeating[hall];
  const state: EventSeatState = {};
  if (!cfg) return state;
  let n = 0;
  for (const z of cfg.zones) {
    for (let r = 0; r < z.rows; r++) {
      for (let s = 1; s <= z.seatsPerRow; s++) {
        const id = seatId(z.id, r, s);
        // pseudo-random based on position + eventId hash
        const h = (eventId.charCodeAt(0) + n * 7) % 100;
        if (h < 22) state[id] = "sold";
        else if (h < 26) state[id] = "counter";
        else if (h === 30) state[id] = "held";
        else if (h === 31) state[id] = "blocked";
        else state[id] = "available";
        n++;
      }
    }
  }
  return state;
}

export function getEventSeats(eventId: string, hall: string): EventSeatState {
  if (!STORE[eventId]) STORE[eventId] = seedEvent(eventId, hall);
  return STORE[eventId];
}

export function setSeatStatus(eventId: string, id: SeatId, status: SeatStatus) {
  const s = STORE[eventId];
  if (s) s[id] = status;
}

export function tierOfZone(hall: string, zoneId: string): PricingTier | undefined {
  const cfg = hallSeating[hall];
  const z = cfg?.zones.find((x) => x.id === zoneId);
  if (!z || !cfg) return;
  return cfg.tiers.find((t) => t.id === z.tier);
}

export function seatTier(hall: string, id: SeatId): PricingTier | undefined {
  const zoneId = id.split("-").slice(0, -1).join("-");
  return tierOfZone(hall, zoneId);
}
