import type { TimingBasis } from '../../physics/metrics';
import type { StockStats, StockTimes } from './stockStats.generated';
import type { MeasuredBenchmark, PublishedResults, PublishedTiming } from './types';

export const TIMING_LABEL: Record<PublishedTiming, string> = {
  'rollout-1ft': '1-ft rollout',
  'standing-start': 'Standing start',
  'drag-strip': 'Drag-strip timing',
  unconfirmed: 'Timing basis unconfirmed',
};

export const BASIS_LABEL: Record<TimingBasis, string> = {
  'brake-release': 'Brake release (no rollout)',
  'rollout-1ft': '1-ft rollout',
};

/** Simulator bases to compare a published timing against. */
export function basesFor(timing: PublishedTiming): { bases: TimingBasis[]; mismatch?: string } {
  switch (timing) {
    case 'rollout-1ft':
      return { bases: ['rollout-1ft'] };
    case 'standing-start':
      return { bases: ['brake-release'] };
    case 'drag-strip':
      return {
        bases: ['rollout-1ft'],
        mismatch: 'Drag-strip ETs use staging-beam rollout and exclude reaction time; compared with the 1-ft rollout basis as the closest reproducible match.',
      };
    case 'unconfirmed':
      return {
        bases: ['brake-release', 'rollout-1ft'],
        mismatch: 'The publication’s timing procedure for this test is not confirmed, so both simulator bases are shown.',
      };
  }
}

type ResultKey = keyof PublishedResults;

interface MetricDef {
  key: ResultKey;
  label: string;
  unit: 's' | 'mph' | 'km/h';
  sim: (t: StockTimes) => number | null;
}

const split = (k: string) => (t: StockTimes) => t.splits[k] ?? null;

export const METRICS: readonly MetricDef[] = [
  { key: 'zeroTo30MphS', label: '0–30 mph', unit: 's', sim: split('30mph') },
  { key: 'zeroTo60MphS', label: '0–60 mph', unit: 's', sim: split('60mph') },
  { key: 'zeroTo100KmhS', label: '0–100 km/h', unit: 's', sim: (t) => t.zeroTo100KmhS },
  { key: 'zeroTo100MphS', label: '0–100 mph', unit: 's', sim: split('100mph') },
  { key: 'zeroTo160KmhS', label: '0–160 km/h', unit: 's', sim: split('160kmh') },
  { key: 'zeroTo180KmhS', label: '0–180 km/h', unit: 's', sim: split('180kmh') },
  { key: 'zeroTo200KmhS', label: '0–200 km/h', unit: 's', sim: (t) => t.zeroTo200KmhS },
  { key: 'zeroTo130MphS', label: '0–130 mph', unit: 's', sim: split('130mph') },
  { key: 'zeroTo150MphS', label: '0–150 mph', unit: 's', sim: split('150mph') },
  { key: 'quarterMileS', label: '¼ mile ET', unit: 's', sim: (t) => t.quarterMileS },
  { key: 'quarterMileTrapMph', label: '¼ mile trap', unit: 'mph', sim: (t) => (t.quarterMileTrapKmh === null ? null : t.quarterMileTrapKmh / 1.609344) },
  { key: 'quarterMileTrapKmh', label: '¼ mile trap', unit: 'km/h', sim: (t) => t.quarterMileTrapKmh },
  { key: 'kilometerS', label: '1 km', unit: 's', sim: (t) => t.kilometerS },
];

export interface ResidualRow {
  label: string;
  unit: 's' | 'mph' | 'km/h';
  published: number;
  /** Simulated value per basis (same order as `bases`). */
  simulated: (number | null)[];
}

export interface BenchmarkComparison {
  bases: TimingBasis[];
  mismatch?: string;
  rows: ResidualRow[];
}

/** Published results next to the simulator's stock values on the matching basis. */
export function compareBenchmark(b: MeasuredBenchmark, stats: StockStats | undefined): BenchmarkComparison {
  const { bases, mismatch } = basesFor(b.timing);
  const rows: ResidualRow[] = [];
  for (const m of METRICS) {
    const published = b.results[m.key];
    if (typeof published !== 'number') continue;
    rows.push({
      label: m.label,
      unit: m.unit,
      published,
      simulated: bases.map((basis) => (stats ? m.sim(basis === 'brake-release' ? stats.brakeRelease : stats.rollout) : null)),
    });
  }
  return { bases, mismatch, rows };
}

/** Plain-text top speed etc. that the simulator does not compare. */
export function uncomparedResults(r: PublishedResults): string[] {
  const out: string[] = [];
  if (r.topSpeedMph) out.push(`Top speed ${r.topSpeedMph} mph`);
  if (r.topSpeedKmh) out.push(`Top speed ${r.topSpeedKmh} km/h`);
  if (r.rolloutS) out.push(`Rollout time reported: ${r.rolloutS} s`);
  return out;
}
