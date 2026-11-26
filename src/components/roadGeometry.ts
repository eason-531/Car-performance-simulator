import type { TrafficCarView } from '../assist/liveDrive';
import { LANE_COUNT, PLAYER_LENGTH_M, laneOf } from '../assist/traffic';

/**
 * Geometry of the Live Drive road strip, kept free of React so it can be
 * tested. One linear scale (pixels per metre, fixed by the strip's width)
 * draws the lane markings, every car body and the gap line, so markings keep
 * their length and spacing, and the gap line always meets the bumpers that
 * are drawn. Traffic beyond either edge is not drawn as a body; the nearest
 * car per lane is previewed by a lane-aligned cue with its distance.
 */

export const PAD_PX = 7;
/** Visible road ahead of the player the scale aims for, m. */
export const AHEAD_TARGET_M = 170;
export const DASH_PERIOD_M = 12;
export const DASH_LENGTH_M = 6;
/** A gap line shorter than this is drawn as a compact short-gap marker, px. */
export const SHORT_GAP_PX = 16;

export interface RoadLayout {
  width: number;
  height: number;
  laneH: number;
  pxPerM: number;
  /** Screen x of the player's front bumper, px. */
  x0: number;
  aheadM: number;
  behindM: number;
}

export function roadLayout(width: number, height: number): RoadLayout {
  const w = Math.max(width, 200);
  const h = Math.max(height, 60);
  const x0 = Math.min(140, Math.max(46, w * 0.11));
  const pxPerM = Math.min(6.5, Math.max(2.2, (w - x0 - 12) / AHEAD_TARGET_M));
  return { width: w, height: h, laneH: (h - 2 * PAD_PX) / LANE_COUNT, pxPerM, x0, aheadM: (w - x0) / pxPerM, behindM: x0 / pxPerM };
}

export function laneY(l: RoadLayout, lat: number): number {
  return PAD_PX + l.laneH * (lat + 0.5);
}

export interface Box {
  /** Rear and front bumpers, px. */
  x1: number;
  x2: number;
  y: number;
  h: number;
  /** Vertical centre, px. */
  cy: number;
}

/** The body of a vehicle whose front bumper is `dxFront` metres ahead of the player's front bumper. */
export function bodyBox(l: RoadLayout, dxFront: number, lengthM: number, lat: number, kind: 'car' | 'van' | 'truck' = 'car'): Box {
  const x2 = l.x0 + dxFront * l.pxPerM;
  const h = l.laneH * (kind === 'truck' ? 0.66 : 0.56);
  const cy = laneY(l, lat);
  return { x1: x2 - lengthM * l.pxPerM, x2, y: cy - h / 2, h, cy };
}

export function dashXs(l: RoadLayout, distanceM: number): number[] {
  const out: number[] = [];
  const first = Math.floor((distanceM - l.behindM) / DASH_PERIOD_M) * DASH_PERIOD_M;
  for (let p = first; p - distanceM < l.aheadM + DASH_PERIOD_M; p += DASH_PERIOD_M) out.push(l.x0 + (p - distanceM) * l.pxPerM);
  return out;
}

export interface Body extends Box {
  car: TrafficCarView;
}

export interface Cue {
  id: number;
  lane: number;
  side: 'ahead' | 'behind';
  /** Bumper-to-bumper distance from the player, m. */
  distanceM: number;
  y: number;
  isLead: boolean;
}

export interface GapLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  /** Label anchor: the segment's midpoint. */
  midX: number;
  midY: number;
  /** Too short for a line: drawn as a compact marker between the bumpers. */
  short: boolean;
  /** The lead is beyond the right edge: the line runs to its cue. */
  offscreen: boolean;
}

export interface RoadScene {
  layout: RoadLayout;
  player: Box;
  bodies: Body[];
  cues: Cue[];
  gap: GapLine | null;
}

/**
 * Everything the strip draws for one frame. Bodies are cars with any part
 * between the edges (clipped there); cars wholly beyond the right edge, or
 * approaching from beyond the left edge, become one cue per lane.
 */
export function roadScene(l: RoadLayout, cars: readonly TrafficCarView[], playerLat: number, playerSpeedKmh: number, leadId: number | null): RoadScene {
  const player = bodyBox(l, 0, PLAYER_LENGTH_M, playerLat);
  const bodies: Body[] = [];
  const ahead = new Map<number, Cue>();
  const behind = new Map<number, Cue>();
  let leadBody: Body | null = null;
  let leadCue: Cue | null = null;
  for (const car of cars) {
    const b = bodyBox(l, car.dx, car.lengthM, car.lat, car.kind);
    const isLead = car.id === leadId;
    if (b.x2 > 0 && b.x1 < l.width) {
      const body = { ...b, car };
      bodies.push(body);
      if (isLead) leadBody = body;
      continue;
    }
    const lane = laneOf(car.lat);
    if (b.x1 >= l.width) {
      const d = car.dx - car.lengthM;
      const cue: Cue = { id: car.id, lane, side: 'ahead', distanceM: d, y: laneY(l, lane), isLead };
      const prev = ahead.get(lane);
      if (!prev || (!prev.isLead && (isLead || d < prev.distanceM))) ahead.set(lane, cue);
      if (isLead) leadCue = cue;
    } else if (car.speedKmh > playerSpeedKmh + 2) {
      const d = -car.dx - PLAYER_LENGTH_M;
      const prev = behind.get(lane);
      if (!prev || d < prev.distanceM) behind.set(lane, { id: car.id, lane, side: 'behind', distanceM: d, y: laneY(l, lane), isLead: false });
    }
  }
  bodies.sort((a, b) => a.x2 - b.x2);
  let gap: GapLine | null = null;
  if (leadBody) {
    const x1 = player.x2;
    const x2 = leadBody.x1;
    gap = { x1, y1: player.cy, x2, y2: leadBody.cy, midX: (x1 + x2) / 2, midY: (player.cy + leadBody.cy) / 2, short: x2 - x1 < SHORT_GAP_PX, offscreen: false };
  } else if (leadCue) {
    const x2 = l.width - 2;
    gap = { x1: player.x2, y1: player.cy, x2, y2: leadCue.y, midX: (player.x2 + x2) / 2, midY: (player.cy + leadCue.y) / 2, short: false, offscreen: true };
  }
  return { layout: l, player, bodies, cues: [...ahead.values(), ...behind.values()], gap };
}
