import { jsPDF } from "jspdf";
import QRCode from "qrcode";

// Olive Send — Afro-Editorial × Live & Loud ticket PDF
// Mirrors the web design system: cream bg, deep olive primary,
// electric lime accent, terracotta highlight, Fraunces / JetBrains Mono.

export type TicketData = {
  ref: string;
  eventTitle: string;
  eventSubtitle?: string;
  date: string; // formatted
  doors: string; // e.g. "Doors 6:30 PM"
  hall: string; // e.g. "Main Bowl"
  venue?: string; // defaults to National Theatre
  section: string;
  row: string;
  seat: string;
  tier: string; // Platinum / Gold / Silver
  price: string; // formatted "₦15,000"
  holder: string;
  orderId?: string;
};

// Design tokens (RGB approximations of HSL tokens in index.css)
const C = {
  cream: [246, 242, 232] as const,        // --background
  ink: [22, 26, 16] as const,              // --foreground deep olive ink
  olive: [44, 56, 30] as const,            // --primary deep olive
  lime: [196, 232, 60] as const,           // --accent electric lime
  terracotta: [217, 99, 56] as const,      // --highlight
  muted: [120, 122, 100] as const,
  border: [195, 198, 178] as const,
};

const setFill = (doc: jsPDF, c: readonly [number, number, number]) =>
  doc.setFillColor(c[0], c[1], c[2]);
const setDraw = (doc: jsPDF, c: readonly [number, number, number]) =>
  doc.setDrawColor(c[0], c[1], c[2]);
const setText = (doc: jsPDF, c: readonly [number, number, number]) =>
  doc.setTextColor(c[0], c[1], c[2]);

export async function downloadTicketPdf(t: TicketData) {
  const doc = new jsPDF({ unit: "pt", format: [612, 396] }); // landscape ticket ~ 8.5x5.5"
  const W = 612;
  const H = 396;

  // ---------- Cream background ----------
  setFill(doc, C.cream);
  doc.rect(0, 0, W, H, "F");

  // ---------- Subtle grid dots (editorial texture) ----------
  setFill(doc, C.border);
  for (let x = 24; x < W; x += 16) {
    for (let y = 24; y < H; y += 16) {
      doc.circle(x, y, 0.4, "F");
    }
  }

  // ---------- Stub split (perforation at 72% width) ----------
  const stubX = W * 0.72;
  setDraw(doc, C.olive);
  doc.setLineDashPattern([3, 3], 0);
  doc.setLineWidth(0.6);
  doc.line(stubX, 24, stubX, H - 24);
  doc.setLineDashPattern([], 0);

  // ---------- Outer frame ----------
  setDraw(doc, C.olive);
  doc.setLineWidth(1);
  doc.rect(16, 16, W - 32, H - 32);

  // ===================== MAIN PANEL =====================

  // Top bar — olive band with mono label
  setFill(doc, C.olive);
  doc.rect(16, 16, stubX - 16, 30, "F");
  setText(doc, C.cream);
  doc.setFont("courier", "bold");
  doc.setFontSize(8.5);
  doc.text("OLIVE SEND  ///  OFFICIAL E-TICKET  ///  NATIONAL THEATRE, IGANMU LAGOS", 28, 35);

  // Lime tier chip (top-right of main panel)
  const chipW = 96;
  const chipX = stubX - chipW - 12;
  setFill(doc, C.lime);
  doc.rect(chipX, 22, chipW, 18, "F");
  setText(doc, C.ink);
  doc.setFont("courier", "bold");
  doc.setFontSize(8);
  doc.text(t.tier.toUpperCase(), chipX + chipW / 2, 34, { align: "center" });

  // "PRESENTS" eyebrow
  setText(doc, C.muted);
  doc.setFont("courier", "normal");
  doc.setFontSize(7.5);
  doc.text("THE NATIONAL THEATRE PRESENTS", 32, 76);

  // Big serif title (Fraunces vibe via Times)
  setText(doc, C.ink);
  doc.setFont("times", "bold");
  doc.setFontSize(34);
  const titleLines = doc.splitTextToSize(t.eventTitle, stubX - 64);
  doc.text(titleLines, 32, 108);

  let titleBottom = 108 + titleLines.length * 32;

  if (t.eventSubtitle) {
    setText(doc, C.terracotta);
    doc.setFont("times", "italic");
    doc.setFontSize(14);
    doc.text(t.eventSubtitle, 32, titleBottom + 4);
    titleBottom += 22;
  }

  // Terracotta hairline divider
  setDraw(doc, C.terracotta);
  doc.setLineWidth(1.5);
  doc.line(32, titleBottom + 18, stubX - 24, titleBottom + 18);

  // ---------- Detail grid ----------
  const gridY = titleBottom + 42;
  const colGap = (stubX - 64) / 4;

  const cells: Array<[string, string]> = [
    ["DATE", t.date],
    ["DOORS", t.doors],
    ["HALL", t.hall],
    ["VENUE", t.venue ?? "National Theatre"],
  ];
  cells.forEach(([label, value], i) => {
    const x = 32 + i * colGap;
    setText(doc, C.muted);
    doc.setFont("courier", "normal");
    doc.setFontSize(7);
    doc.text(label, x, gridY);
    setText(doc, C.ink);
    doc.setFont("times", "bold");
    doc.setFontSize(13);
    const v = doc.splitTextToSize(value, colGap - 8);
    doc.text(v, x, gridY + 16);
  });

  // ---------- Seat block (highlighted band) ----------
  const seatY = gridY + 60;
  setFill(doc, C.ink);
  doc.rect(32, seatY, stubX - 64, 64, "F");

  const seatCols: Array<[string, string]> = [
    ["SECTION", t.section],
    ["ROW", t.row],
    ["SEAT", t.seat],
    ["PRICE", t.price],
  ];
  const sCol = (stubX - 64) / 4;
  seatCols.forEach(([label, value], i) => {
    const x = 32 + i * sCol + 14;
    setText(doc, C.lime);
    doc.setFont("courier", "bold");
    doc.setFontSize(7.5);
    doc.text(label, x, seatY + 20);
    setText(doc, C.cream);
    doc.setFont("times", "bold");
    doc.setFontSize(22);
    doc.text(value, x, seatY + 48);
  });

  // ---------- Footer line ----------
  setText(doc, C.muted);
  doc.setFont("courier", "normal");
  doc.setFontSize(7);
  doc.text(
    `HOLDER  ${t.holder.toUpperCase()}     ///     REF  ${t.ref}${t.orderId ? `     ///     ORDER  ${t.orderId}` : ""}`,
    32,
    H - 32,
  );

  // ===================== STUB =====================

  const sx = stubX + 12;
  const sw = W - sx - 20;

  // Stub eyebrow
  setText(doc, C.muted);
  doc.setFont("courier", "normal");
  doc.setFontSize(7);
  doc.text("ADMIT ONE", sx, 40);

  // Vertical "OLIVE SEND" wordmark
  setText(doc, C.olive);
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.text("OLIVE", sx, 64);
  doc.text("SEND.", sx, 80);

  // QR code
  const qrDataUrl = await QRCode.toDataURL(
    JSON.stringify({ ref: t.ref, event: t.eventTitle, seat: `${t.section}-${t.row}-${t.seat}` }),
    { margin: 0, color: { dark: "#161A10", light: "#F6F2E8" }, width: 256 },
  );
  const qrSize = sw - 8;
  const qrX = sx;
  const qrY = 100;
  doc.addImage(qrDataUrl, "PNG", qrX, qrY, qrSize, qrSize);

  // Lime underline
  setFill(doc, C.lime);
  doc.rect(sx, qrY + qrSize + 10, qrSize, 4, "F");

  // Stub details
  setText(doc, C.ink);
  doc.setFont("courier", "bold");
  doc.setFontSize(8);
  doc.text(t.ref, sx, qrY + qrSize + 30);

  setText(doc, C.muted);
  doc.setFont("courier", "normal");
  doc.setFontSize(6.5);
  const stubMeta = doc.splitTextToSize(
    `${t.hall.toUpperCase()} · ${t.tier.toUpperCase()} · SEAT ${t.seat}`,
    qrSize,
  );
  doc.text(stubMeta, sx, qrY + qrSize + 42);

  // Bottom corner mark
  setText(doc, C.terracotta);
  doc.setFont("times", "italic");
  doc.setFontSize(9);
  doc.text("scan at gate", sx, H - 32);

  doc.save(`olive-send-${t.ref}.pdf`);
}
