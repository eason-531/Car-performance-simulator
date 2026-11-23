/** Display formatting helpers. All return an em dash for missing values. */
export const DASH = '—';

export function fmt(x: number | null | undefined, digits = 0): string {
  if (x === null || x === undefined || !Number.isFinite(x)) return DASH;
  return x.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

export const fmtSeconds = (x: number | null | undefined, digits = 2) => (x == null ? DASH : `${fmt(x, digits)} s`);
export const fmtKmh = (x: number | null | undefined, digits = 0) => (x == null ? DASH : `${fmt(x, digits)} km/h`);

export function fmtSigned(x: number, digits = 1, unit = ''): string {
  const sign = x > 0 ? '+' : x < 0 ? '−' : '±';
  return `${sign}${fmt(Math.abs(x), digits)}${unit}`;
}

export function fmtDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function ordinalGear(g: number): string {
  return g === 1 ? '1st' : g === 2 ? '2nd' : g === 3 ? '3rd' : `${g}th`;
}
