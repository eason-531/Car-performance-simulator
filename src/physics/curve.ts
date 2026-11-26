import type { CurvePoints } from '../data/types';

/**
 * Smooth, overshoot-free curve through control points using monotone cubic
 * Hermite interpolation (Fritsch–Carlson). Evaluation is O(1) through a
 * pre-sampled lookup table, which keeps the 1 kHz physics loop cheap.
 * Outside the control-point range the curve is held at the end values.
 */
export class Curve {
  readonly points: CurvePoints;
  readonly xMin: number;
  readonly xMax: number;
  private readonly lut: Float64Array;
  private readonly lutStep: number;

  constructor(points: CurvePoints, lutSize = 2048) {
    if (points.length < 2) throw new Error('Curve needs at least two points');
    for (let i = 1; i < points.length; i++) {
      if (!(points[i][0] > points[i - 1][0])) throw new Error('Curve x values must be strictly increasing');
    }
    this.points = points;
    this.xMin = points[0][0];
    this.xMax = points[points.length - 1][0];
    this.lutStep = (this.xMax - this.xMin) / (lutSize - 1);
    this.lut = new Float64Array(lutSize);
    const slopes = monotoneSlopes(points);
    for (let i = 0; i < lutSize; i++) {
      this.lut[i] = hermite(points, slopes, this.xMin + i * this.lutStep);
    }
  }

  at(x: number): number {
    if (x <= this.xMin) return this.lut[0];
    if (x >= this.xMax) return this.lut[this.lut.length - 1];
    const f = (x - this.xMin) / this.lutStep;
    const i = Math.floor(f);
    const t = f - i;
    return this.lut[i] + (this.lut[i + 1] - this.lut[i]) * t;
  }

  /**
   * x positions of the lookup-table samples inside [lo, hi]. `at()` is linear
   * between consecutive samples, so these are the only points where its slope
   * can change.
   */
  knotsWithin(lo: number, hi: number): number[] {
    const out: number[] = [];
    const first = Math.max(0, Math.ceil((lo - this.xMin) / this.lutStep));
    const last = Math.min(this.lut.length - 1, Math.floor((hi - this.xMin) / this.lutStep));
    for (let i = first; i <= last; i++) out.push(this.xMin + i * this.lutStep);
    return out;
  }

  /** Point-wise product with another curve, sampled on the union of both point sets. */
  multiply(other: Curve): Curve {
    return this.combine(other, (a, b) => a * b);
  }

  add(other: Curve): Curve {
    return this.combine(other, (a, b) => a + b);
  }

  scale(factor: number): Curve {
    return new Curve(this.points.map(([x, y]) => [x, y * factor] as const));
  }

  private combine(other: Curve, op: (a: number, b: number) => number): Curve {
    const xs = new Set<number>();
    for (const [x] of this.points) xs.add(x);
    for (const [x] of other.points) if (x >= this.xMin && x <= this.xMax) xs.add(x);
    // Add intermediate samples so the product stays smooth.
    const step = (this.xMax - this.xMin) / 40;
    for (let x = this.xMin; x <= this.xMax; x += step) xs.add(Math.round(x));
    const sorted = [...xs].filter((x) => x >= this.xMin && x <= this.xMax).sort((a, b) => a - b);
    return new Curve(sorted.map((x) => [x, op(this.at(x), other.at(x))] as const));
  }
}

function monotoneSlopes(p: CurvePoints): number[] {
  const n = p.length;
  const d: number[] = [];
  for (let i = 0; i < n - 1; i++) d.push((p[i + 1][1] - p[i][1]) / (p[i + 1][0] - p[i][0]));
  const m: number[] = new Array<number>(n);
  m[0] = d[0];
  m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) {
    if (d[i - 1] * d[i] <= 0) {
      m[i] = 0;
    } else {
      const h0 = p[i][0] - p[i - 1][0];
      const h1 = p[i + 1][0] - p[i][0];
      const w1 = 2 * h1 + h0;
      const w2 = h1 + 2 * h0;
      m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i]);
    }
  }
  return m;
}

function hermite(p: CurvePoints, m: number[], x: number): number {
  let i = 0;
  while (i < p.length - 2 && x > p[i + 1][0]) i++;
  const [x0, y0] = p[i];
  const [x1, y1] = p[i + 1];
  const h = x1 - x0;
  const t = (x - x0) / h;
  const t2 = t * t;
  const t3 = t2 * t;
  return (
    (2 * t3 - 3 * t2 + 1) * y0 + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * y1 + (t3 - t2) * h * m[i + 1]
  );
}
