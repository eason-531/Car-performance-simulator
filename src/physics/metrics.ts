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

/** How a published (or simulated) time is started. */
export type TimingBasis = 'brake-release' | 'rollout-1ft';

export const ROLLOUT_M = 0.3048;

/** Speeds (m/s) at which split times are recorded, keyed for lookup. */
export const SPLIT_SPEEDS: Readonly<Record<string, number>> = (() => {
  const out: Record<string, number> = {};
  for (const mph of [30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180]) out[`${mph}mph`] = mphToMs(mph);
  for (const kmh of [50, 80, 100, 120, 130, 140, 160, 180, 200, 250]) out[`${kmh}kmh`] = kmhToMs(kmh);
  return out;
})();

interface RawCrossings {
  speed: Record<string, number>;
  distance: Record<string, { t: number; v: number }>;
}

const DIST_KEYS = { sixtyFoot: DISTANCES_M.sixtyFoot, eighthMile: DISTANCES_M.eighthMile, quarterMile: DISTANCES_M.quarterMile, kilometer: DISTANCES_M.kilometer, rollout: ROLLOUT_M };

/**
 * Detects threshold crossings between consecutive samples and interpolates the
 * exact crossing time, so results do not depend on the sampling interval.
 * Times are recorded from brake release; `metricsFor('rollout-1ft')` restarts
 * the clock when the car has moved one foot, as US magazines and drag strips
 * do. Distances are always measured from the original standing position.
 * Trap speeds are the instantaneous speed at the line.
 */
export class MetricsTracker {
  private raw: RawCrossings = { speed: {}, distance: {} };
  private top = 0;
  private peakG = 0;
  private prev: MotionSample | null = null;

  update(cur: MotionSample): void {
    const prev = this.prev;
    this.prev = cur;
    this.top = Math.max(this.top, msToKmh(cur.v));
    this.peakG = Math.max(this.peakG, cur.a / GRAVITY);
    if (!prev) return;
    for (const [key, target] of Object.entries(SPLIT_SPEEDS)) {
      if (this.raw.speed[key] === undefined && prev.v < target && cur.v >= target) {
        this.raw.speed[key] = prev.t + ((target - prev.v) / (cur.v - prev.v)) * (cur.t - prev.t);
      }
    }
    for (const [key, target] of Object.entries(DIST_KEYS)) {
      if (this.raw.distance[key] === undefined && prev.x < target && cur.x >= target) {
        const f = (target - prev.x) / (cur.x - prev.x);
        this.raw.distance[key] = { t: prev.t + f * (cur.t - prev.t), v: prev.v + f * (cur.v - prev.v) };
      }
    }
  }

  /** Time offset subtracted for a timing basis (null if the car has not rolled out yet). */
  private offset(basis: TimingBasis): number | null {
    if (basis === 'brake-release') return 0;
    return this.raw.distance.rollout?.t ?? null;
  }

  /** Split times by key (e.g. `60mph`, `100kmh`) for a timing basis. */
  splitsFor(basis: TimingBasis = 'brake-release'): Record<string, number> {
    const off = this.offset(basis);
    const out: Record<string, number> = {};
    if (off === null) return out;
    for (const [k, t] of Object.entries(this.raw.speed)) out[k] = t - off;
    return out;
  }

  metricsFor(basis: TimingBasis = 'brake-release'): PerformanceMetrics {
    const m = emptyMetrics();
    m.topSpeedKmh = this.top;
    m.peakAccelG = this.peakG;
    const off = this.offset(basis);
    if (off === null) return m;
    const sp = (k: string) => (this.raw.speed[k] === undefined ? null : this.raw.speed[k] - off);
    const ds = (k: keyof typeof DIST_KEYS) => this.raw.distance[k];
    m.zeroTo60MphS = sp('60mph');
    m.zeroTo100KmhS = sp('100kmh');
    m.zeroTo200KmhS = sp('200kmh');
    if (m.zeroTo200KmhS !== null && m.zeroTo100KmhS !== null) m.hundredTo200KmhS = m.zeroTo200KmhS - m.zeroTo100KmhS;
    const sixty = ds('sixtyFoot');
    m.sixtyFootS = sixty ? sixty.t - off : null;
    const e = ds('eighthMile');
    if (e) {
      m.eighthMileS = e.t - off;
      m.eighthMileTrapKmh = msToKmh(e.v);
    }
    const q = ds('quarterMile');
    if (q) {
      m.quarterMileS = q.t - off;
      m.quarterMileTrapKmh = msToKmh(q.v);
    }
    const k = ds('kilometer');
    if (k) {
      m.kilometerS = k.t - off;
      m.kilometerTrapKmh = msToKmh(k.v);
    }
    return m;
  }

  /** Brake-release metrics (the simulator baseline). */
  get metrics(): PerformanceMetrics {
    return this.metricsFor('brake-release');
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
