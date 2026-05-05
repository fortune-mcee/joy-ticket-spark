import { cn } from "@/lib/utils";
import {
  HallSeating,
  EventSeatState,
  SeatStatus,
  rowLetter,
  seatId,
} from "@/data/seating";

type Props = {
  config: HallSeating;
  state: EventSeatState;
  selected?: Set<string>;
  onSeatClick?: (id: string, status: SeatStatus) => void;
  highlightTier?: string;
  compact?: boolean;
};

const STATUS_CLASS: Record<SeatStatus, string> = {
  available: "bg-background border-border hover:border-foreground",
  sold: "bg-primary/80 border-primary text-primary-foreground cursor-not-allowed",
  counter: "bg-highlight border-highlight text-highlight-foreground",
  held: "bg-accent border-accent text-accent-foreground",
  blocked: "bg-muted border-border text-muted-foreground line-through",
};

export function SeatMap({ config, state, selected, onSeatClick, highlightTier, compact }: Props) {
  const seatSize = compact ? "h-4 w-4 text-[8px]" : "h-6 w-6 text-[10px]";

  return (
    <div className="space-y-6">
      {/* Stage */}
      <div className="mx-auto max-w-3xl">
        <div className="h-8 rounded-sm bg-foreground text-background grid place-items-center font-mono-label tracking-widest">
          {config.stageLabel ?? "Stage"}
        </div>
      </div>

      {/* Zones */}
      <div className="space-y-5">
        {config.zones.map((z) => {
          const tier = config.tiers.find((t) => t.id === z.tier);
          const dim = highlightTier && highlightTier !== z.tier;
          return (
            <div key={z.id} className={cn("space-y-1", dim && "opacity-30")}>
              <div className="flex items-center justify-between">
                <div className="font-mono-label text-muted-foreground">
                  {z.label} · <span className="text-foreground">{tier?.label}</span>
                </div>
                <div className="font-mono-label text-muted-foreground">
                  ₦{tier?.price.toLocaleString()}
                </div>
              </div>
              <div className="space-y-0.5 overflow-x-auto">
                {Array.from({ length: z.rows }).map((_, r) => (
                  <div key={r} className="flex items-center gap-1 justify-center">
                    <div className="w-4 font-mono-label text-muted-foreground text-right">
                      {rowLetter(r)}
                    </div>
                    {Array.from({ length: z.seatsPerRow }).map((_, s) => {
                      const id = seatId(z.id, r, s + 1);
                      const status = state[id] ?? "available";
                      const isSel = selected?.has(id);
                      return (
                        <button
                          key={id}
                          type="button"
                          disabled={!onSeatClick}
                          onClick={() => onSeatClick?.(id, status)}
                          title={`${id} · ${status}`}
                          className={cn(
                            "border rounded-[3px] grid place-items-center transition-colors",
                            seatSize,
                            STATUS_CLASS[status],
                            isSel && "ring-2 ring-foreground ring-offset-1 ring-offset-background",
                          )}
                        >
                          {s + 1}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SeatLegend({ tiers }: { tiers: { label: string; status: SeatStatus | "tier"; tone?: string }[] }) {
  return (
    <div className="flex flex-wrap gap-3 font-mono-label text-muted-foreground">
      {tiers.map((t) => (
        <div key={t.label} className="flex items-center gap-1.5">
          <span
            className={cn(
              "inline-block h-3 w-3 rounded-[2px] border",
              t.status !== "tier" && STATUS_CLASS[t.status as SeatStatus],
            )}
            style={t.status === "tier" && t.tone ? { background: `hsl(${t.tone})` } : undefined}
          />
          {t.label}
        </div>
      ))}
    </div>
  );
}
