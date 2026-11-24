/** Speedometer full scale for ordinary cars; faster cars get a longer dial. */
export const SPEED_DIAL_DEFAULT_KMH = 280;

/**
 * Speedometer range and major step for a car's reachable top speed: the
 * familiar 280 km/h dial in 40 km/h steps unless the car can pass ≈ 260 km/h,
 * then the smallest whole number of steps (60 km/h steps above 360 km/h).
 */
export function speedDial(vmaxKmh: number): { max: number; step: number } {
  const need = vmaxKmh + 20;
  if (need <= SPEED_DIAL_DEFAULT_KMH) return { max: SPEED_DIAL_DEFAULT_KMH, step: 40 };
  const step = need > 360 ? 60 : 40;
  return { max: Math.ceil(need / step) * step, step };
}
