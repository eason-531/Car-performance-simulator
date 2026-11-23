import { ATMOSPHERE_BAR, FIXED_DT, GRAVITY } from './constants';
import { MetricsTracker, type PerformanceMetrics, type TimingBasis } from './metrics';
import { VehicleSimulator } from './simulator';
import type { SimVehicle } from './types';
import { kmhToMs, msToKmh } from './units';

export type LaunchTechnique = 'standard' | 'brake-boost';

export interface TraceSample {
  /** s since launch */
  t: number;
  speedKmh: number;
  distanceM: number;
  rpm: number;
  gear: number;
  boostBar: number;
  accelG: number;
}

export interface AccelerationRunOptions {
  launch?: LaunchTechnique;
  /** Stop once this speed has been reached (and the distance target too). */
  targetSpeedKmh?: number;
  targetDistanceM?: number;
  maxTimeS?: number;
  sampleIntervalS?: number;
}

export interface AccelerationRunResult {
  vehicleId: string;
  launch: LaunchTechnique;
  /** Timed from brake release (simulator baseline). */
  metrics: PerformanceMetrics;
  /** Same run timed with a 1-ft rollout (US magazine / drag-strip basis). */
  metricsRollout: PerformanceMetrics;
  /** Speed split times keyed like `60mph` / `100kmh`, per timing basis. */
  splits: Record<TimingBasis, Record<string, number>>;
  trace: TraceSample[];
  /** Duration of the recorded run, s. */
  durationS: number;
  /** True if every requested target was reached. */
  completed: boolean;
}

const PRE_LAUNCH_S = 2.5;
const PEDAL_RAMP_S = 0.12;
const STAGNATION_WINDOW_S = 6;

/**
 * Headless full-throttle run from a standstill with automatic shifting, using
 * the same fixed-step simulator as the live driving view.
 *
 * - `standard`: idle in gear, release brake, floor the throttle.
 * - `brake-boost`: hold the brake and full throttle for 2.5 s first (stall
 *   against the converter / launch clutch preload), then release the brake.
 *
 * The clock starts when the brake is released (no roll-out applied).
 */
export function runAccelerationRun(vehicle: SimVehicle, options: AccelerationRunOptions = {}): AccelerationRunResult {
  const launch = options.launch ?? 'brake-boost';
  const targetSpeed = kmhToMs(options.targetSpeedKmh ?? 200);
  const targetDistance = options.targetDistanceM ?? 1000;
  const maxTime = options.maxTimeS ?? 120;
  const sampleInterval = options.sampleIntervalS ?? 0.05;

  const sim = new VehicleSimulator(vehicle, 'auto');
  sim.advance(1, { throttle: 0, brake: 1 });
  if (launch === 'brake-boost') sim.advance(PRE_LAUNCH_S, { throttle: 1, brake: 1 });
  const s = sim.state;
  s.time = 0;
  s.distance = 0;

  const tracker = new MetricsTracker();
  const trace: TraceSample[] = [];
  const record = () =>
    trace.push({
      t: s.time,
      speedKmh: msToKmh(s.speed),
      distanceM: s.distance,
      rpm: s.engineRpm,
      gear: s.gear,
      boostBar: s.manifoldBar - ATMOSPHERE_BAR,
      accelG: s.accelFiltered / GRAVITY,
    });
  tracker.update({ t: 0, v: 0, x: 0, a: 0 });
  record();

  let nextSample = sampleInterval;
  let bestSpeed = 0;
  let bestSpeedTime = 0;
  let completed = false;
  const steps = Math.ceil(maxTime / FIXED_DT);
  for (let i = 0; i < steps; i++) {
    const throttle = launch === 'standard' ? Math.min(1, s.time / PEDAL_RAMP_S) : 1;
    sim.step(FIXED_DT, { throttle, brake: 0 });
    tracker.update({ t: s.time, v: s.speed, x: s.distance, a: s.accel });
    if (s.time >= nextSample - 1e-9) {
      record();
      nextSample += sampleInterval;
    }
    if (s.speed > bestSpeed + 0.03) {
      bestSpeed = s.speed;
      bestSpeedTime = s.time;
    }
    if (s.speed >= targetSpeed && s.distance >= targetDistance) {
      completed = true;
      break;
    }
    if (s.time - bestSpeedTime > STAGNATION_WINDOW_S) break;
  }
  if (trace[trace.length - 1].t < s.time) record();

  return {
    vehicleId: vehicle.id,
    launch,
    metrics: tracker.metrics,
    metricsRollout: tracker.metricsFor('rollout-1ft'),
    splits: { 'brake-release': tracker.splitsFor('brake-release'), 'rollout-1ft': tracker.splitsFor('rollout-1ft') },
    trace,
    durationS: s.time,
    completed,
  };
}

export interface DragLaneResult {
  vehicleId: string;
  name: string;
  elapsedS: number | null;
  trapKmh: number | null;
  sixtyFootS: number | null;
  zeroTo100KmhS: number | null;
  /** Full metrics of the run (it continues a little past the finish line). */
  metrics: PerformanceMetrics;
  trace: TraceSample[];
}

export interface DragRaceResult {
  distanceM: number;
  lanes: [DragLaneResult, DragLaneResult];
  /** Index of the winning lane, or null for a dead heat / no finisher. */
  winner: 0 | 1 | null;
  marginS: number | null;
  /** How far behind the loser was when the winner crossed the line, m. */
  marginM: number | null;
}

function laneFromRun(vehicle: SimVehicle, run: AccelerationRunResult, distanceM: number): DragLaneResult {
  const samples = run.trace.map((p) => ({ t: p.t, v: kmhToMs(p.speedKmh), x: p.distanceM, a: 0 }));
  const cross = MetricsTracker.crossingTime(samples, distanceM);
  return {
    vehicleId: vehicle.id,
    name: vehicle.name,
    elapsedS: cross?.t ?? null,
    trapKmh: cross ? msToKmh(cross.v) : null,
    sixtyFootS: run.metrics.sixtyFootS,
    zeroTo100KmhS: run.metrics.zeroTo100KmhS,
    metrics: run.metrics,
    trace: run.trace,
  };
}

/** Interpolated distance at time t along a trace, m. */
export function distanceAt(trace: readonly TraceSample[], t: number): number {
  if (t <= 0) return 0;
  for (let i = 1; i < trace.length; i++) {
    if (trace[i].t >= t) {
      const a = trace[i - 1];
      const b = trace[i];
      return a.distanceM + ((t - a.t) / (b.t - a.t)) * (b.distanceM - a.distanceM);
    }
  }
  return trace[trace.length - 1].distanceM;
}

/** Simulate both cars over the same distance from a standing start. */
export function runDragRace(
  a: SimVehicle,
  b: SimVehicle,
  distanceM: number,
  launch: LaunchTechnique = 'brake-boost',
): DragRaceResult {
  const opts: AccelerationRunOptions = {
    launch,
    targetSpeedKmh: 0,
    targetDistanceM: distanceM + 40,
    maxTimeS: 90,
    sampleIntervalS: 1 / 60,
  };
  const laneA = laneFromRun(a, runAccelerationRun(a, opts), distanceM);
  const laneB = laneFromRun(b, runAccelerationRun(b, opts), distanceM);

  let winner: 0 | 1 | null = null;
  let marginS: number | null = null;
  let marginM: number | null = null;
  if (laneA.elapsedS !== null || laneB.elapsedS !== null) {
    const ta = laneA.elapsedS ?? Infinity;
    const tb = laneB.elapsedS ?? Infinity;
    if (Math.abs(ta - tb) > 1e-4) {
      winner = ta < tb ? 0 : 1;
      const winnerTime = Math.min(ta, tb);
      const loser = winner === 0 ? laneB : laneA;
      marginS = Number.isFinite(Math.max(ta, tb)) ? Math.abs(ta - tb) : null;
      marginM = distanceM - distanceAt(loser.trace, winnerTime);
    }
  }
  return { distanceM, lanes: [laneA, laneB], winner, marginS, marginM };
}

/** Interpolate any trace sample field at time t. */
export function sampleAt(trace: readonly TraceSample[], t: number): TraceSample {
  if (t <= trace[0].t) return trace[0];
  for (let i = 1; i < trace.length; i++) {
    if (trace[i].t >= t) {
      const a = trace[i - 1];
      const b = trace[i];
      const f = (t - a.t) / (b.t - a.t);
      return {
        t,
        speedKmh: a.speedKmh + f * (b.speedKmh - a.speedKmh),
        distanceM: a.distanceM + f * (b.distanceM - a.distanceM),
        rpm: a.rpm + f * (b.rpm - a.rpm),
        gear: f < 0.5 ? a.gear : b.gear,
        boostBar: a.boostBar + f * (b.boostBar - a.boostBar),
        accelG: a.accelG + f * (b.accelG - a.accelG),
      };
    }
  }
  return trace[trace.length - 1];
}
