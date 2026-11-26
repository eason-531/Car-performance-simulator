/**
 * Stock straight-line classes (simulator classes, not road-test verdicts).
 *
 * Formula SLC-5 (versioned — bump the version and regenerate the stock stats
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
 *
 * Thresholds (SLC-5) were derived against three reference fixtures and the
 * stock roster: a slow fixture (15.5 s @ 150 km/h, 7.5 s to 100 → 12) must be
 * D, a middle one (13.5 s @ 170 km/h, 5.5 s → 42) B and a fast one (11.0 s @
 * 210 km/h, 3.0 s → 87) S+. Within those constraints each boundary sits in the
 * widest nearby gap of the stock-score distribution, so no stock car lies
 * within half a point of a boundary (a test enforces this). SLC-1 used
 * 20/34/48/64/82, which left the GTI and Superb 0.4 points under B and split
 * the GT-R from the M5 and 911 GT3 by under a point. SLC-2 (20/39/49/64/78)
 * was superseded when spec-sheet corrections put the Stinger 0.4 points above
 * A; SLC-3 moves A into the 45.3–47.6 gap and centres B between 38.4 and 40.3.
 * SLC-4 (inspection-handoff recalibration put the Integra Type S 0.3 points
 * under B) centres B in the 33.6–39.1 gap. SLC-5 (the electric Hyundai Ioniq 5 N
 * landed 0.3 points above S+) centres S+ in the 75.6–78.3 gap at 77.0; no car
 * changes class.
 */

export type StockClass = 'D' | 'C' | 'B' | 'A' | 'S' | 'S+';

export const CLASS_ORDER: readonly StockClass[] = ['D', 'C', 'B', 'A', 'S', 'S+'];

export const CLASS_FORMULA = {
  version: 'SLC-5',
  weights: { quarterMileS: 0.45, trapKmh: 0.4, zeroTo100KmhS: 0.15 },
  /** Standardization anchors: slow → 0, fast → 100. */
  anchors: {
    quarterMileS: { slow: 16.0, fast: 10.0 },
    trapKmh: { slow: 140, fast: 220 },
    zeroTo100KmhS: { slow: 9.0, fast: 2.8 },
  },
  /** Lower bound of each class on the score scale. */
  thresholds: { C: 20, B: 36.4, A: 46.5, S: 64, 'S+': 77 } as Record<Exclude<StockClass, 'D'>, number>,
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
