import { ATMOSPHERE_BAR, GRAVITY } from './constants';
import { MetricsTracker, emptyMetrics, type PerformanceMetrics } from './metrics';
import type { TraceSample } from './runners';
import type { SimState } from './types';
import { msToKmh } from './units';

export type LiveTimerStatus = 'ready' | 'running' | 'finished';

export interface LiveTimerView {
  status: LiveTimerStatus;
  elapsedS: number;
  distanceM: number;
  metrics: PerformanceMetrics;
  /** True while the car is at rest, so the next pull-away will start a run. */
  armed: boolean;
}

const SAMPLE_INTERVAL = 0.05;
/** Speed that triggers a run (0.36 km/h), m/s. */
const START_SPEED_MS = 0.1;

/**
 * Performance timer for live driving, like a GPS performance box: arms at a
 * standstill, starts the moment the car pulls away under throttle, and
 * finishes when it stops again. Rolling away on idle creep disarms it (the
 * run would not be from rest). Records a trace so the run can be saved.
 */
export class LiveTimer {
  private status: LiveTimerStatus = 'ready';
  private t0 = 0;
  private x0 = 0;
  private tracker = new MetricsTracker();
  private trace: TraceSample[] = [];
  private nextSample = 0;
  private elapsed = 0;
  private dist = 0;
  private armed = true;

  reset(): void {
    this.status = 'ready';
    this.armed = true;
    this.tracker = new MetricsTracker();
    this.trace = [];
    this.elapsed = 0;
    this.dist = 0;
  }

  update(s: SimState): void {
    if (this.status !== 'running') {
      if (s.speed <= 0) {
        this.armed = true;
        return;
      }
      if (!this.armed || s.speed < START_SPEED_MS) return;
      if (s.throttle <= 0.05) {
        // Creeping away without throttle: not a standing start.
        this.armed = false;
        return;
      }
      // Pulling away from rest under throttle: start a new run. Like a GPS
      // box, trigger at a small speed and back-date the start assuming
      // constant acceleration over that first instant.
      const a = Math.max(s.accel, 0.5);
      const dt = s.speed / a;
      this.armed = false;
      this.status = 'running';
      this.t0 = s.time - dt;
      this.x0 = s.distance - 0.5 * a * dt * dt;
      this.tracker = new MetricsTracker();
      this.trace = [];
      this.nextSample = 0;
      this.tracker.update({ t: 0, v: 0, x: 0, a: 0 });
    }
    const t = s.time - this.t0;
    const x = s.distance - this.x0;
    this.elapsed = t;
    this.dist = x;
    this.tracker.update({ t, v: s.speed, x, a: s.accel });
    if (t >= this.nextSample) this.push(s, t, x);
    if (s.speed <= 0) {
      this.status = 'finished';
      this.armed = true;
    }
  }

  private push(s: SimState, t: number, x: number): void {
    this.trace.push({
      t,
      speedKmh: msToKmh(s.speed),
      distanceM: x,
      rpm: s.engineRpm,
      gear: s.gear,
      boostBar: s.manifoldBar - ATMOSPHERE_BAR,
      accelG: s.accelFiltered / GRAVITY,
    });
    this.nextSample = t + SAMPLE_INTERVAL;
  }

  get view(): LiveTimerView {
    return {
      status: this.status,
      elapsedS: this.elapsed,
      distanceM: this.dist,
      metrics: this.status === 'ready' ? emptyMetrics() : this.tracker.metrics,
      armed: this.armed,
    };
  }

  /** Recorded samples of the current / last run. */
  get samples(): readonly TraceSample[] {
    return this.trace;
  }
}
