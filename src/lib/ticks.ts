/** "Nice" axis ticks (1, 2, 2.5, 5 × 10ⁿ steps). */
export function niceStep(range: number, target: number): number {
  const raw = range / Math.max(1, target);
  const mag = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / mag;
  const nice = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10;
  return nice * mag;
}

export function niceDomain(min: number, max: number, target = 5): { min: number; max: number; step: number } {
  if (!(max > min)) max = min + 1;
  const step = niceStep(max - min, target);
  return { min: Math.floor(min / step) * step, max: Math.ceil(max / step) * step, step };
}

export function ticks(min: number, max: number, step: number): number[] {
  const out: number[] = [];
  const n = Math.round((max - min) / step);
  for (let i = 0; i <= n; i++) out.push(+(min + i * step).toFixed(10));
  return out;
}
