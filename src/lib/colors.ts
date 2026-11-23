/**
 * Categorical series colours (validated for CVD separation and ≥3:1 contrast
 * on the dark panel surface #15181d). Assigned in fixed order, never cycled.
 *
 * Colour is allocated *locally per chart*, not globally per car: with 70+
 * cars there are not enough distinguishable hues. The owner's two cars keep
 * their home slots (0 and 1) so saved results look as before; every other car
 * takes the next free slot in that chart. Repeats of the same car (stock vs
 * tuned, two saved runs) share its colour and differ by dash pattern. Every
 * chart also labels its series, so identity never relies on colour alone.
 */
export const SERIES_COLORS = ['#3987e5', '#d95926', '#199e70', '#c98500'] as const;

/** Dash patterns for series that share a colour. */
export const DASH_PATTERNS = [undefined, '7 5', '2 4', '10 4 2 4'] as const;

export function seriesColor(slot: number): string {
  return SERIES_COLORS[slot >= 0 && slot < SERIES_COLORS.length ? slot : 0];
}

export interface SeriesItem {
  key: string;
  vehicleId: string;
  /** Home slot (owner cars), or -1/undefined. */
  homeSlot?: number;
}

export interface SeriesStyle {
  color: string;
  slot: number;
  dash: string | undefined;
}

/**
 * Give each item a colour and dash: distinct cars get distinct colours
 * (home slot first if free), repeats of one car get the same colour with the
 * next dash pattern. Deterministic for a given item order.
 */
export function assignSeries(items: readonly SeriesItem[]): Map<string, SeriesStyle> {
  const out = new Map<string, SeriesStyle>();
  const slotOfVehicle = new Map<string, number>();
  const used = new Set<number>();
  const vehicles: SeriesItem[] = [];
  for (const it of items) if (!vehicles.some((v) => v.vehicleId === it.vehicleId)) vehicles.push(it);
  // Home slots first so the owner cars keep their colours whenever possible.
  for (const v of vehicles) {
    if (v.homeSlot !== undefined && v.homeSlot >= 0 && !used.has(v.homeSlot)) {
      slotOfVehicle.set(v.vehicleId, v.homeSlot);
      used.add(v.homeSlot);
    }
  }
  for (const v of vehicles) {
    if (slotOfVehicle.has(v.vehicleId)) continue;
    let slot = 0;
    while (used.has(slot) && slot < SERIES_COLORS.length) slot++;
    if (slot >= SERIES_COLORS.length) slot = slotOfVehicle.size % SERIES_COLORS.length;
    slotOfVehicle.set(v.vehicleId, slot);
    used.add(slot);
  }
  const repeats = new Map<number, number>();
  for (const it of items) {
    const slot = slotOfVehicle.get(it.vehicleId)!;
    const n = repeats.get(slot) ?? 0;
    repeats.set(slot, n + 1);
    out.set(it.key, { color: SERIES_COLORS[slot], slot, dash: DASH_PATTERNS[n % DASH_PATTERNS.length] });
  }
  return out;
}

export const STATUS = {
  good: '#0ca30c',
  warning: '#fab219',
  serious: '#ec835a',
  critical: '#d03b3b',
} as const;
