import { GRAVITY } from './constants';
import { METERS_PER_FOOT, METERS_PER_MILE, kmhToMs, mphToMs, msToKmh } from './units';

/** Standard performance figures. `null` = not reached during the run. */
export interface PerformanceMetrics {
  zeroTo60MphS: number | null;
  zeroTo100KmhS: number | null;
  zeroTo200KmhS: number | null;
  hundredTo200KmhS: number | null;
  sixtyFootS: number | null;
  eighthMileS: number | null;
  eighthMileTrapKmh: number | null;
  quarterMileS: number | null;
  quarterMileTrapKmh: number | null;
  kilometerS: number | null;
  kilometerTrapKmh: number | null;
  topSpeedKmh: number;
  peakAccelG: number;
}

export const DISTANCES_M = {
  sixtyFoot: 60 * METERS_PER_FOOT,
  eighthMile: METERS_PER_MILE / 8,
  quarterMile: METERS_PER_MILE / 4,
  kilometer: 1000,
} as const;

export const SPEEDS_MS = {
  mph60: mphToMs(60),
  kmh100: kmhToMs(100),
  kmh200: kmhToMs(200),
} as const;

export function emptyMetrics(): PerformanceMetrics {
  return {
    zeroTo60MphS: null,
    zeroTo100KmhS: null,
    zeroTo200KmhS: null,
    hundredTo200KmhS: null,
    sixtyFootS: null,
    eighthMileS: null,
    eighthMileTrapKmh: null,
    quarterMileS: null,
    quarterMileTrapKmh: null,
    kilometerS: null,
    kilometerTrapKmh: null,
    topSpeedKmh: 0,
    peakAccelG: 0,
  };
}

export interface MotionSample {
  /** Time since launch, s. */
  t: number;
  /** Speed, m/s. */
  v: number;
  /** Distance since launch, m. */
  x: number;
  /** Acceleration, m/s². */
  a: number;
}

/**
 * Detects threshold crossings between consecutive samples and interpolates the
 * exact crossing time, so results do not depend on the sampling interval.
 * Trap speeds are the instantaneous speed at the line.
 */
export class MetricsTracker {
  private m: PerformanceMetrics = emptyMetrics();
  private prev: MotionSample | null = null;

  update(cur: MotionSample): void {
    const prev = this.prev;
    this.prev = cur;
    this.m.topSpeedKmh = Math.max(this.m.topSpeedKmh, msToKmh(cur.v));
    this.m.peakAccelG = Math.max(this.m.peakAccelG, cur.a / GRAVITY);
    if (!prev) return;

    const speedCross = (target: number): number | null =>
      prev.v < target && cur.v >= target ? prev.t + ((target - prev.v) / (cur.v - prev.v)) * (cur.t - prev.t) : null;
    const distCross = (target: number): { t: number; v: number } | null => {
      if (!(prev.x < target && cur.x >= target)) return null;
      const f = (target - prev.x) / (cur.x - prev.x);
      return { t: prev.t + f * (cur.t - prev.t), v: prev.v + f * (cur.v - prev.v) };
    };

    const m = this.m;
    m.zeroTo60MphS ??= speedCross(SPEEDS_MS.mph60);
    m.zeroTo100KmhS ??= speedCross(SPEEDS_MS.kmh100);
    if (m.zeroTo200KmhS === null) {
      m.zeroTo200KmhS = speedCross(SPEEDS_MS.kmh200);
      if (m.zeroTo200KmhS !== null && m.zeroTo100KmhS !== null) m.hundredTo200KmhS = m.zeroTo200KmhS - m.zeroTo100KmhS;
    }
    if (m.sixtyFootS === null) m.sixtyFootS = distCross(DISTANCES_M.sixtyFoot)?.t ?? null;
    if (m.eighthMileS === null) {
      const c = distCross(DISTANCES_M.eighthMile);
      if (c) {
        m.eighthMileS = c.t;
        m.eighthMileTrapKmh = msToKmh(c.v);
      }
    }
    if (m.quarterMileS === null) {
      const c = distCross(DISTANCES_M.quarterMile);
      if (c) {
        m.quarterMileS = c.t;
        m.quarterMileTrapKmh = msToKmh(c.v);
      }
    }
    if (m.kilometerS === null) {
      const c = distCross(DISTANCES_M.kilometer);
      if (c) {
        m.kilometerS = c.t;
        m.kilometerTrapKmh = msToKmh(c.v);
      }
    }
  }

  get metrics(): PerformanceMetrics {
    return { ...this.m };
  }

  /** Time at which a distance was crossed, for arbitrary distances (drag races). */
  static crossingTime(samples: readonly MotionSample[], distance: number): { t: number; v: number } | null {
    for (let i = 1; i < samples.length; i++) {
      const a = samples[i - 1];
      const b = samples[i];
      if (a.x < distance && b.x >= distance) {
        const f = (distance - a.x) / (b.x - a.x);
        return { t: a.t + f * (b.t - a.t), v: a.v + f * (b.v - a.v) };
      }
    }
    return null;
  }
}
