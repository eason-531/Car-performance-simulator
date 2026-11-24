import { computeDyno, topSpeedKmh } from '../../physics/dyno';
import type { PerformanceMetrics, TimingBasis } from '../../physics/metrics';
import { runAccelerationRun, type TraceSample } from '../../physics/runners';
import { buildSimVehicle } from '../../tuning/buildSimVehicle';
import { defaultTuning } from '../../tuning/tuning';
import type { VehicleSpec } from '../types';
import { CLASS_FORMULA, classForScore, classScore } from './classes';
import type { StockStats, StockTimes } from './stockStats.generated';

/** Speed splits kept for comparison with published tests. */
export const STAT_SPLITS = ['30mph', '60mph', '100mph', '130mph', '150mph', '100kmh', '160kmh', '180kmh', '200kmh'] as const;

const r3 = (x: number | null) => (x === null ? null : Math.round(x * 1000) / 1000);

/** Brake-release time and speed at a distance, interpolated from the run trace. */
function crossing(trace: readonly TraceSample[], distanceM: number): { t: number; kmh: number } | null {
  for (let i = 1; i < trace.length; i++) {
    const a = trace[i - 1];
    const b = trace[i];
    if (a.distanceM < distanceM && b.distanceM >= distanceM) {
      const f = (distanceM - a.distanceM) / (b.distanceM - a.distanceM);
      return { t: a.t + f * (b.t - a.t), kmh: a.speedKmh + f * (b.speedKmh - a.speedKmh) };
    }
  }
  return null;
}

function times(m: PerformanceMetrics, splits: Record<string, number>, m400: { t: number; kmh: number } | null): StockTimes {
  const s: Record<string, number> = {};
  for (const k of STAT_SPLITS) if (splits[k] !== undefined) s[k] = r3(splits[k])!;
  return {
    zeroTo100KmhS: r3(m.zeroTo100KmhS),
    zeroTo200KmhS: r3(m.zeroTo200KmhS),
    sixtyFootS: r3(m.sixtyFootS),
    quarterMileS: r3(m.quarterMileS),
    quarterMileTrapKmh: r3(m.quarterMileTrapKmh),
    kilometerS: r3(m.kilometerS),
    kilometerTrapKmh: r3(m.kilometerTrapKmh),
    metres400S: r3(m400?.t ?? null),
    metres400TrapKmh: r3(m400?.kmh ?? null),
    splits: s,
  };
}

/** One standardized stock run (see CLASS_POLICY), both timing bases. */
export function computeStockStats(spec: VehicleSpec): StockStats {
  const v = buildSimVehicle(spec, defaultTuning(spec));
  const run = runAccelerationRun(v, { launch: 'brake-boost', targetSpeedKmh: 250, targetDistanceM: 1000, maxTimeS: 90 });
  const br = run.metrics;
  // The rollout basis restarts the clock after one foot: same offset at every distance.
  const m400 = crossing(run.trace, 400);
  const rolloutOffset =
    br.quarterMileS !== null && run.metricsRollout.quarterMileS !== null ? br.quarterMileS - run.metricsRollout.quarterMileS : null;
  const bases: Record<TimingBasis, StockTimes> = {
    'brake-release': times(br, run.splits['brake-release'], m400),
    'rollout-1ft': times(
      run.metricsRollout,
      run.splits['rollout-1ft'],
      m400 && rolloutOffset !== null ? { t: m400.t - rolloutOffset, kmh: m400.kmh } : null,
    ),
  };
  const dyno = computeDyno(v);
  const ok = br.quarterMileS !== null && br.quarterMileTrapKmh !== null && br.zeroTo100KmhS !== null;
  const score = ok ? classScore(br.quarterMileS!, br.quarterMileTrapKmh!, br.zeroTo100KmhS!) : null;
  return {
    formula: CLASS_FORMULA.version,
    brakeRelease: bases['brake-release'],
    rollout: bases['rollout-1ft'],
    topSpeedKmh: Math.round(topSpeedKmh(v)),
    peakPowerPs: Math.round(dyno.peakPowerPs),
    peakTorqueNm: Math.round(dyno.peakTorqueNm),
    testMassKg: v.massKg,
    score: score === null ? null : Math.round(score * 10) / 10,
    cls: score === null ? null : classForScore(score),
  };
}
