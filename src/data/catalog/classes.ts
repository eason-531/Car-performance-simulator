/**
 * Stock straight-line classes (simulator classes, not road-test verdicts).
 *
 * Formula SLC-1 (versioned — bump the version and regenerate the stock stats
 * if any constant below changes):
 *
 *   each input is standardized to a 0–100 scale between a "slow" and a "fast"
 *   anchor (linear, not clamped), then
 *
 *   score = 0.45 · ET  +  0.40 · trap  +  0.15 · 0–100 km/h
 *
 * Inputs come from one standardized stock run per car (see POLICY), so the
 * class never depends on the user's tuning or test settings. Quarter-mile ET
 * and trap speed dominate; 0–100 km/h makes launch count without letting it
 * dominate. Body style and usage play no part.
 */

export type StockClass = 'D' | 'C' | 'B' | 'A' | 'S' | 'S+';

export const CLASS_ORDER: readonly StockClass[] = ['D', 'C', 'B', 'A', 'S', 'S+'];

export const CLASS_FORMULA = {
  version: 'SLC-1',
  weights: { quarterMileS: 0.45, trapKmh: 0.4, zeroTo100KmhS: 0.15 },
  /** Standardization anchors: slow → 0, fast → 100. */
  anchors: {
    quarterMileS: { slow: 16.0, fast: 10.0 },
    trapKmh: { slow: 140, fast: 220 },
    zeroTo100KmhS: { slow: 9.0, fast: 2.8 },
  },
  /** Lower bound of each class on the score scale. */
  thresholds: { C: 20, B: 34, A: 48, S: 64, 'S+': 82 } as Record<Exclude<StockClass, 'D'>, number>,
} as const;

export const CLASS_POLICY = {
  tires: 'Stock tire size and compound class for the configuration',
  mass: 'Curb mass + 75 kg driver; no options or cargo',
  timing: 'From brake release, no rollout (simulator baseline)',
  launch:
    'Best transmission-appropriate launch: brake-torque against the converter (automatic), launch-control preload (dual-clutch), pre-revved clutch launch by the deterministic driver (manual)',
  conditions: '20 °C, sea level, flat dry road, automatic upshifts at the computed best points',
} as const;

const standardize = (value: number, a: { slow: number; fast: number }) => ((value - a.slow) / (a.fast - a.slow)) * 100;

export function classScore(quarterMileS: number, trapKmh: number, zeroTo100KmhS: number): number {
  const { weights: w, anchors: a } = CLASS_FORMULA;
  return (
    w.quarterMileS * standardize(quarterMileS, a.quarterMileS) +
    w.trapKmh * standardize(trapKmh, a.trapKmh) +
    w.zeroTo100KmhS * standardize(zeroTo100KmhS, a.zeroTo100KmhS)
  );
}

export function classForScore(score: number): StockClass {
  const t = CLASS_FORMULA.thresholds;
  if (score >= t['S+']) return 'S+';
  if (score >= t.S) return 'S';
  if (score >= t.A) return 'A';
  if (score >= t.B) return 'B';
  if (score >= t.C) return 'C';
  return 'D';
}
