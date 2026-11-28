import { DASH_LENGTH_M, PAD_PX, type Box, type Cue, type RoadScene } from './roadGeometry';

/**
 * Paints the Live Drive road strip on a 2D canvas in one pass per frame:
 * road, lane markings, gap line, every vehicle, blinkers, distance cues and
 * the gap label all come from the same RoadScene, so what is drawn can never
 * fall out of step (an SVG with one element per car could be repainted
 * piecemeal by the browser, leaving stale bodies behind).
 */

export const SHADES = ['#6b7079', '#7f776b', '#5f7080', '#7a7184'];
export const LEAD_FILL = '#e6e4dc';
export const IN_LANE_FILL = '#a4a9b0';
export const BLINKER = '#fab219';
const ROAD_LINE = 'rgba(240, 239, 236, 0.22)';
const DASH = 'rgba(240, 239, 236, 0.4)';
const WINDSHIELD = 'rgba(10, 12, 15, 0.35)';
const PILL_BG = 'rgba(10, 12, 15, 0.85)';
const PILL_BORDER = 'rgba(255, 255, 255, 0.16)';
const HORIZON_BG = 'rgba(10, 12, 15, 0.55)';
const FONT = '700 11px -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif';

/** The subset of CanvasRenderingContext2D the painter uses (so it can be tested with a recorder). */
export type Painter = Pick<
  CanvasRenderingContext2D,
  | 'clearRect'
  | 'beginPath'
  | 'moveTo'
  | 'lineTo'
  | 'arcTo'
  | 'arc'
  | 'closePath'
  | 'fill'
  | 'stroke'
  | 'setLineDash'
  | 'fillText'
  | 'measureText'
  | 'save'
  | 'restore'
  | 'rect'
  | 'clip'
  | 'fillRect'
  | 'fillStyle'
  | 'strokeStyle'
  | 'lineWidth'
  | 'font'
  | 'textAlign'
  | 'textBaseline'
>;

export interface RoadPaint {
  scene: RoadScene;
  /** Screen x of each lane-marking dash start (fixed spacing, scrolling with the road). */
  dashes: readonly number[];
  blink: boolean;
  playerColor: string;
  playerSignal: -1 | 0 | 1;
  leadTone: string;
  gapTone: string;
  contact: boolean;
  /** "48 m · 2.0 s" for the tracked lead, or null. */
  gapText: string | null;
  cueText: (c: Cue) => string;
}

function roundRect(ctx: Painter, x: number, y: number, w: number, h: number, r: number): void {
  const rr = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.arcTo(x + w, y, x + w, y + rr, rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.arcTo(x + w, y + h, x + w - rr, y + h, rr);
  ctx.lineTo(x + rr, y + h);
  ctx.arcTo(x, y + h, x, y + h - rr, rr);
  ctx.lineTo(x, y + rr);
  ctx.arcTo(x, y, x + rr, y, rr);
  ctx.closePath();
}

function line(ctx: Painter, x1: number, y1: number, x2: number, y2: number): void {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function vehicle(ctx: Painter, b: Box, fill: string, stroke: string | null, signal: -1 | 0 | 1, blink: boolean): void {
  const w = b.x2 - b.x1;
  roundRect(ctx, b.x1, b.y, w, b.h, Math.min(5, b.h / 3));
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  roundRect(ctx, b.x2 - w * 0.42, b.y + 2, w * 0.16, b.h - 4, 1.5);
  ctx.fillStyle = WINDSHIELD;
  ctx.fill();
  if (signal !== 0 && blink) {
    const y = signal < 0 ? b.y + 1 : b.y + b.h - 1;
    ctx.fillStyle = BLINKER;
    for (const x of [b.x2 - 2, b.x1 + 2]) {
      ctx.beginPath();
      ctx.arc(x, y, 2.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

function pillRect(ctx: Painter, text: string, x: number, y: number, align: 'left' | 'center' | 'right'): Rect {
  ctx.font = FONT;
  const w = ctx.measureText(text).width + 12;
  const h = 16;
  return { x: align === 'left' ? x : align === 'right' ? x - w : x - w / 2, y: y - h / 2, w, h };
}

function hits(r: Rect, b: Box): boolean {
  return r.x < b.x2 && r.x + r.w > b.x1 && r.y < b.y + b.h && r.y + r.h > b.y;
}

function pill(ctx: Painter, text: string, x: number, y: number, align: 'left' | 'center' | 'right', color: string, border: string | null): void {
  const { x: left, w, h } = pillRect(ctx, text, x, y, align);
  roundRect(ctx, left, y - h / 2, w, h, 6);
  ctx.fillStyle = PILL_BG;
  ctx.fill();
  if (border) {
    ctx.strokeStyle = border;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, left + w / 2, y + 0.5);
}

export function drawRoad(ctx: Painter, p: RoadPaint): void {
  const { scene } = p;
  const l = scene.layout;
  const { width: w, height: h, laneH, pxPerM, roadEnd } = l;
  ctx.clearRect(0, 0, w, h);

  // Everything on the road is clipped at its end; the horizon strip beyond holds the distance cues.
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, roadEnd, h);
  ctx.clip();
  ctx.lineWidth = 2;
  ctx.strokeStyle = ROAD_LINE;
  line(ctx, 0, PAD_PX, w, PAD_PX);
  line(ctx, 0, h - PAD_PX, w, h - PAD_PX);
  ctx.strokeStyle = DASH;
  const dashLen = DASH_LENGTH_M * pxPerM;
  for (const b of [1, 2]) {
    const y = PAD_PX + laneH * b;
    for (const x of p.dashes) line(ctx, x, y, x + dashLen, y);
  }

  // Gap line under the bodies: from the player's front bumper to the lead's rear bumper, as drawn below.
  const gap = scene.gap;
  if (gap && !gap.short) {
    ctx.save();
    ctx.strokeStyle = p.gapTone;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    line(ctx, gap.x1, gap.y1, gap.x2, gap.y2);
    ctx.setLineDash([]);
    if (!gap.offscreen) line(ctx, gap.x2, gap.y2 - 4, gap.x2, gap.y2 + 4);
    ctx.restore();
  }

  // The gap label goes where it covers no car: on the segment's midpoint, else just above or below it.
  // If every place would cover one, it is drawn under the cars so no car is ever hidden.
  let label: { x: number; y: number } | null = null;
  let labelOnTop = true;
  if (gap && p.gapText) {
    const others = scene.bodies.filter((b) => !b.car.isLead);
    const half = pillRect(ctx, p.gapText, 0, 0, 'center').w / 2;
    const clampX = (x: number) => Math.min(Math.max(x, half + 2), roadEnd - half - 2);
    const off = laneH * 0.28 + 10;
    const candidates: { x: number; y: number }[] = [];
    if (Math.abs(gap.x2 - gap.x1) >= 2 * half + 16) candidates.push({ x: gap.midX, y: gap.midY });
    const above = Math.min(gap.y1, gap.y2) - off;
    const below = Math.max(gap.y1, gap.y2) + off;
    if (above >= 9) candidates.push({ x: clampX(gap.midX), y: above });
    if (below <= h - 9) candidates.push({ x: clampX(gap.midX), y: below });
    const clear = candidates.find((c) => !others.some((b) => hits(pillRect(ctx, p.gapText!, c.x, c.y, 'center'), b)));
    label = clear ?? candidates[0] ?? null;
    labelOnTop = !!clear;
    if (label && !labelOnTop) pill(ctx, p.gapText, label.x, label.y, 'center', p.gapTone, null);
  }

  for (const b of scene.bodies) {
    const c = b.car;
    const fill = c.isLead ? LEAD_FILL : c.inLane ? IN_LANE_FILL : SHADES[((c.shade % SHADES.length) + SHADES.length) % SHADES.length];
    const stroke = c.isLead ? (p.contact ? '#f07a7a' : p.leadTone) : c.bursting ? BLINKER : null;
    vehicle(ctx, b, fill, stroke, c.signal, p.blink);
  }
  vehicle(ctx, scene.player, p.playerColor, p.contact ? '#f07a7a' : null, p.playerSignal, p.blink);

  if (gap && gap.short) {
    ctx.save();
    ctx.strokeStyle = p.gapTone;
    ctx.lineWidth = 2;
    roundRect(ctx, Math.min(gap.x1, gap.x2) - 2, Math.min(gap.y1, gap.y2) - 6, Math.abs(gap.x2 - gap.x1) + 4, Math.abs(gap.y2 - gap.y1) + 12, 3);
    ctx.stroke();
    ctx.restore();
  }
  if (label && labelOnTop && p.gapText) pill(ctx, p.gapText, label.x, label.y, 'center', p.gapTone, null);

  // Faster traffic approaching from behind: a cue at the left edge, unless a car is drawn there.
  for (const c of scene.cues) {
    if (c.side !== 'behind') continue;
    const r = pillRect(ctx, p.cueText(c), 4, c.y, 'left');
    if (!scene.bodies.some((b) => hits(r, b)) && !hits(r, scene.player)) pill(ctx, p.cueText(c), 4, c.y, 'left', BLINKER, PILL_BORDER);
  }
  if (p.contact) pill(ctx, 'Too close — no collision model', 8, h - 14, 'left', '#f07a7a', null);
  ctx.restore();

  // Horizon strip: the road ends here; cars beyond it are previewed by lane with their distance.
  ctx.fillStyle = HORIZON_BG;
  ctx.fillRect(roadEnd, 0, w - roadEnd, h);
  ctx.strokeStyle = PILL_BORDER;
  ctx.lineWidth = 1;
  line(ctx, roadEnd + 0.5, PAD_PX, roadEnd + 0.5, h - PAD_PX);
  for (const c of scene.cues) {
    if (c.side !== 'ahead') continue;
    const color = c.isLead ? p.leadTone : '#c3c2b7';
    pill(ctx, p.cueText(c), w - 3, c.y, 'right', color, c.isLead ? p.leadTone : PILL_BORDER);
  }
}
