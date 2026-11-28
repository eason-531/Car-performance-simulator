import { describe, expect, it } from 'vitest';
import type { TrafficCarView } from '../../assist/liveDrive';
import { LEAD_FILL, drawRoad, type Painter, type RoadPaint } from '../roadCanvas';
import { dashXs, roadLayout, roadScene } from '../roadGeometry';

interface Op {
  kind: 'fill' | 'stroke' | 'text';
  style: string;
  points: [number, number][];
  dash: number[];
  text?: string;
  at?: [number, number];
}

/** Records what the painter draws: each fill/stroke with its path points and style. */
function recorder() {
  const ops: Op[] = [];
  let path: [number, number][] = [];
  let dash: number[] = [];
  const ctx = {
    fillStyle: '' as string,
    strokeStyle: '' as string,
    lineWidth: 1,
    font: '',
    textAlign: 'left',
    textBaseline: 'alphabetic',
    clearRect() {},
    rect() {},
    clip() {},
    fillRect(x: number, y: number, w: number, h: number) {
      ops.push({ kind: 'fill', style: String(ctx.fillStyle), points: [[x, y], [x + w, y + h]], dash: [] });
    },
    save() {},
    restore() {},
    beginPath() {
      path = [];
    },
    moveTo(x: number, y: number) {
      path.push([x, y]);
    },
    lineTo(x: number, y: number) {
      path.push([x, y]);
    },
    arcTo(x1: number, y1: number, x2: number, y2: number) {
      path.push([x1, y1], [x2, y2]);
    },
    arc(x: number, y: number, r: number) {
      path.push([x - r, y - r], [x + r, y + r]);
    },
    closePath() {},
    fill() {
      ops.push({ kind: 'fill', style: String(ctx.fillStyle), points: [...path], dash: [...dash] });
    },
    stroke() {
      ops.push({ kind: 'stroke', style: String(ctx.strokeStyle), points: [...path], dash: [...dash] });
    },
    setLineDash(d: number[]) {
      dash = [...d];
    },
    fillText(text: string, x: number, y: number) {
      ops.push({ kind: 'text', style: String(ctx.fillStyle), points: [], dash: [], text, at: [x, y] });
    },
    measureText(text: string) {
      return { width: text.length * 6 } as TextMetrics;
    },
  };
  return { ctx: ctx as unknown as Painter, ops };
}

const bbox = (pts: [number, number][]) => ({
  x1: Math.min(...pts.map((p) => p[0])),
  x2: Math.max(...pts.map((p) => p[0])),
  y1: Math.min(...pts.map((p) => p[1])),
  y2: Math.max(...pts.map((p) => p[1])),
});

const car = (id: number, dx: number, lat: number, extra: Partial<TrafficCarView> = {}): TrafficCarView => ({
  id,
  dx,
  lengthM: 4.6,
  lat,
  speedKmh: 90,
  inLane: true,
  isLead: false,
  signal: 0,
  shade: 0,
  kind: 'car',
  courteous: true,
  bursting: false,
  ...extra,
});

function paint(width: number, cars: TrafficCarView[], playerLat: number, leadId: number | null, extra: Partial<RoadPaint> = {}) {
  const l = roadLayout(width, 104);
  const scene = roadScene(l, cars, playerLat, 100, leadId);
  const { ctx, ops } = recorder();
  drawRoad(ctx, {
    scene,
    dashes: dashXs(l, 123.4),
    blink: true,
    playerColor: '#3987e5',
    playerSignal: 0,
    leadTone: '#fab219',
    gapTone: '#fab219',
    contact: false,
    gapText: '30 m · 1.1 s',
    cueText: (c) => `${Math.round(c.distanceM)} m`,
    ...extra,
  });
  return { scene, ops };
}

describe('road canvas painter', () => {
  it.each([360, 820, 1036, 1500])('draws the gap line from the drawn player front to the drawn lead rear, in and between lanes (%i px)', (w) => {
    for (const [playerLat, leadLat] of [
      [1, 1],
      [1.4, 1.8],
      [0.5, 1],
    ]) {
      const { ops } = paint(w, [car(7, 34.6, leadLat, { isLead: true })], playerLat, 7);
      const leadBody = bbox(ops.find((o) => o.kind === 'fill' && o.style === LEAD_FILL)!.points);
      const playerBody = bbox(ops.find((o) => o.kind === 'fill' && o.style === '#3987e5')!.points);
      const gapLine = ops.find((o) => o.kind === 'stroke' && o.dash.length > 0)!;
      const [start, end] = gapLine.points;
      expect(start[0]).toBeCloseTo(playerBody.x2, 9);
      expect(start[1]).toBeCloseTo((playerBody.y1 + playerBody.y2) / 2, 9);
      expect(end[0]).toBeCloseTo(leadBody.x1, 9);
      expect(end[1]).toBeCloseTo((leadBody.y1 + leadBody.y2) / 2, 9);
      // The label sits on the segment's midpoint.
      const label = ops.find((o) => o.kind === 'text' && o.text === '30 m · 1.1 s')!;
      expect(label.at![0]).toBeCloseTo((start[0] + end[0]) / 2, 9);
    }
  });

  it('draws one body per visible car, blinkers only on bodies, and cues (not bodies) for cars beyond the edge', () => {
    const { scene, ops } = paint(1036, [car(1, 30, 1, { signal: 1 }), car(2, 60, 2, { inLane: false }), car(3, 3500, 1), car(4, 8000, 1)], 1, null);
    const bodies = ops.filter((o) => o.kind === 'fill' && (o.style.startsWith('#a4a9b0') || o.style.startsWith('#6b7079') || o.style === '#3987e5'));
    expect(bodies).toHaveLength(3);
    expect(scene.bodies.map((b) => b.car.id).sort()).toEqual([1, 2]);
    const blinkers = ops.filter((o) => o.kind === 'fill' && o.style === '#fab219');
    expect(blinkers).toHaveLength(2);
    const body1 = bbox(bodies.find((o) => o.style.startsWith('#a4a9b0'))!.points);
    for (const b of blinkers) {
      const c = bbox(b.points);
      const cx = (c.x1 + c.x2) / 2;
      expect(cx).toBeGreaterThanOrEqual(body1.x1);
      expect(cx).toBeLessThanOrEqual(body1.x2);
    }
    expect(ops.filter((o) => o.kind === 'text').map((o) => o.text)).toEqual(['3495 m']);
  });
});

describe('road canvas layering', () => {
  it('keeps distance cues in the horizon strip, never over the road', () => {
    const { scene, ops } = paint(1036, [car(1, 3500, 0), car(2, 400, 1), car(3, 900, 2)], 1, null);
    const texts = ops.filter((o) => o.kind === 'text');
    expect(texts).toHaveLength(3);
    for (const t of texts) expect(t.at![0]).toBeGreaterThan(scene.layout.roadEnd);
  });

  it('never paints the gap label over another car: it moves, or goes underneath', () => {
    // A car changing lanes right across the middle of the gap segment.
    const { ops } = paint(1036, [car(7, 70, 1, { isLead: true }), car(8, 38, 1.5, { inLane: false })], 1, 7);
    const crossing = ops.findIndex((o) => o.kind === 'fill' && o.style.startsWith('#6b7079'));
    const label = ops.findIndex((o) => o.kind === 'text' && o.text === '30 m · 1.1 s');
    const crossingBox = bbox(ops[crossing].points);
    const at = ops[label].at!;
    const overlapsCar = Math.abs(at[0] - (crossingBox.x1 + crossingBox.x2) / 2) < 40 && Math.abs(at[1] - (crossingBox.y1 + crossingBox.y2) / 2) < 16;
    // Either clear of the crossing car, or drawn before it (underneath).
    expect(!overlapsCar || label < crossing).toBe(true);
  });
});
