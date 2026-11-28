import { describe, expect, it } from 'vitest';
import type { TrafficCarView } from '../../assist/liveDrive';
import { DASH_LENGTH_M, DASH_PERIOD_M, bodyBox, dashXs, laneY, roadLayout, roadScene } from '../roadGeometry';

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

const SIZES: [number, number][] = [
  [360, 96],
  [820, 104],
  [1000, 98],
  [1036, 104],
  [1500, 104],
];

describe('road strip geometry', () => {
  it.each(SIZES)('meets the drawn bumpers with the gap line for a lead between lanes and a player mid-change (%i × %i)', (w, h) => {
    const l = roadLayout(w, h);
    for (const playerLat of [1, 1.3, 0.5]) {
      for (const leadLat of [1, 1.5, 0.7]) {
        const scene = roadScene(l, [car(7, 30, leadLat)], playerLat, 100, 7);
        const lead = scene.bodies.find((b) => b.car.id === 7)!;
        expect(scene.gap).not.toBeNull();
        const g = scene.gap!;
        expect(g.x1).toBeCloseTo(scene.player.x2, 9);
        expect(g.y1).toBeCloseTo(scene.player.cy, 9);
        expect(g.x2).toBeCloseTo(lead.x1, 9);
        expect(g.y2).toBeCloseTo(lead.cy, 9);
        expect(g.midX).toBeCloseTo((g.x1 + g.x2) / 2, 9);
        expect(scene.player.cy).toBeCloseTo(laneY(l, playerLat), 9);
      }
    }
  });

  it('marks a gap too short for a line as a compact marker between the same bumpers', () => {
    const l = roadLayout(1036, 104);
    const scene = roadScene(l, [car(3, 4.6 + 1, 1)], 1, 20, 3);
    expect(scene.gap!.short).toBe(true);
    expect(scene.gap!.x2 - scene.gap!.x1).toBeCloseTo(1 * l.pxPerM, 6);
  });

  it('never draws cars beyond the strip: far traffic becomes one lane cue with the nearest distance', () => {
    const l = roadLayout(1000, 98);
    const scene = roadScene(l, [car(1, 3500, 1), car(2, 8000, 1), car(3, 600, 2, { inLane: false })], 1, 100, 1);
    expect(scene.bodies).toHaveLength(0);
    const lane1 = scene.cues.filter((c) => c.lane === 1);
    expect(lane1).toHaveLength(1);
    expect(lane1[0]).toMatchObject({ id: 1, side: 'ahead', isLead: true });
    expect(lane1[0].distanceM).toBeCloseTo(3500 - 4.6, 6);
    expect(scene.cues.find((c) => c.lane === 2)?.distanceM).toBeCloseTo(600 - 4.6, 6);
    // The lead beyond the strip keeps a gap line, to its cue at the edge.
    expect(scene.gap).toMatchObject({ offscreen: true, x2: l.roadEnd, y2: laneY(l, 1) });
  });

  it('hands a car over from its cue to its body as it enters, without both or neither', () => {
    const l = roadLayout(1036, 104);
    let sawCue = false;
    let sawBody = false;
    for (let dx = l.aheadM + 40; dx > l.aheadM - 20; dx -= 0.25) {
      const scene = roadScene(l, [car(5, dx, 0, { inLane: false })], 1, 100, null);
      const body = scene.bodies.length;
      const cue = scene.cues.length;
      expect(body + cue).toBe(1);
      if (cue) sawCue = true;
      if (body) {
        sawBody = true;
        const b = bodyBox(l, dx, 4.6, 0);
        expect(b.x1).toBeLessThan(l.roadEnd);
      }
    }
    expect(sawCue && sawBody).toBe(true);
  });

  it('previews faster traffic approaching from behind, and not slower traffic dropping back', () => {
    const l = roadLayout(1036, 104);
    const scene = roadScene(l, [car(8, -80, 2, { speedKmh: 160, inLane: false }), car(9, -90, 0, { speedKmh: 70, inLane: false })], 1, 110, null);
    expect(scene.cues).toEqual([expect.objectContaining({ id: 8, side: 'behind', lane: 2 })]);
  });

  it('keeps lane markings evenly spaced at a fixed length while the car moves', () => {
    for (const [w, h] of SIZES) {
      const l = roadLayout(w, h);
      for (const d of [0, 3.7, 1234.56, 99999.9]) {
        const xs = dashXs(l, d);
        for (let k = 1; k < xs.length; k++) expect(xs[k] - xs[k - 1]).toBeCloseTo(DASH_PERIOD_M * l.pxPerM, 9);
        expect(xs[0]).toBeLessThanOrEqual(0);
        expect(xs[xs.length - 1]).toBeGreaterThanOrEqual(l.roadEnd - DASH_PERIOD_M * l.pxPerM);
      }
      expect(DASH_LENGTH_M * l.pxPerM).toBeGreaterThan(5);
    }
  });

  it('ends the drawn road before a horizon strip at the right edge', () => {
    for (const w of [360, 820, 1036, 1500]) {
      const l = roadLayout(w, 104);
      expect(l.roadEnd).toBeLessThan(l.width - 50);
      expect(l.x0 + l.aheadM * l.pxPerM).toBeCloseTo(l.roadEnd, 9);
    }
  });

  it('shows more road ahead on wider strips at one fixed scale', () => {
    expect(roadLayout(1036, 104).aheadM).toBeGreaterThan(150);
    expect(roadLayout(1500, 104).aheadM).toBeGreaterThan(roadLayout(1036, 104).aheadM);
    expect(roadLayout(1036, 104).pxPerM).toBe(roadLayout(1036, 104).pxPerM);
  });
});
