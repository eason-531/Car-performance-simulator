/**
 * Categorical series colours (validated for CVD separation and ≥3:1 contrast
 * on the dark panel surface #15181d). Assigned in fixed order, never cycled:
 * a vehicle's `colorSlot` pins its colour everywhere in the app.
 */
export const SERIES_COLORS = ['#3987e5', '#d95926', '#199e70', '#c98500'] as const;

export function seriesColor(slot: number): string {
  return SERIES_COLORS[Math.max(0, Math.min(SERIES_COLORS.length - 1, slot))];
}

export const STATUS = {
  good: '#0ca30c',
  warning: '#fab219',
  serious: '#ec835a',
  critical: '#d03b3b',
} as const;
