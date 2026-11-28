/**
 * Lateral (lane-to-lane) motion for the player and traffic: a minimum-jerk
 * (quintic) profile from the current lateral position, velocity and
 * acceleration to rest in the target lane. A normal lane change starts and
 * ends with zero velocity and acceleration; a reversal mid-change starts from
 * the car's current lateral velocity and acceleration, so the car eases out
 * of its sideways motion and back instead of stopping dead. Position,
 * velocity and acceleration are continuous at every start, reversal and end.
 */
export interface LateralMove {
  /** Polynomial coefficients for p(t) = c0 + c1 t + … + c5 t⁵, t in seconds since the move began. */
  c: [number, number, number, number, number, number];
  durationS: number;
  target: number;
}

export interface LateralState {
  p: number;
  v: number;
  a: number;
}

export function lateralMove(from: LateralState, target: number, durationS: number): LateralMove {
  const T = Math.max(durationS, 0.05);
  const { p: p0, v: v0, a: a0 } = from;
  const d = target - p0;
  return {
    c: [
      p0,
      v0,
      a0 / 2,
      (20 * d - 12 * v0 * T - 3 * a0 * T * T) / (2 * T ** 3),
      (-30 * d + 16 * v0 * T + 3 * a0 * T * T) / (2 * T ** 4),
      (12 * d - 6 * v0 * T - a0 * T * T) / (2 * T ** 5),
    ],
    durationS: T,
    target,
  };
}

export function sampleLateral(m: LateralMove, t: number): LateralState {
  if (t >= m.durationS) return { p: m.target, v: 0, a: 0 };
  const [c0, c1, c2, c3, c4, c5] = m.c;
  const x = Math.max(0, t);
  return {
    p: c0 + x * (c1 + x * (c2 + x * (c3 + x * (c4 + x * c5)))),
    v: c1 + x * (2 * c2 + x * (3 * c3 + x * (4 * c4 + x * 5 * c5))),
    a: 2 * c2 + x * (6 * c3 + x * (12 * c4 + x * 20 * c5)),
  };
}

/** Time for a reversal: proportional to the distance back, plus time to shed the current sideways speed. */
export function reversalDuration(laneChangeS: number, distanceLanes: number, lateralSpeed: number): number {
  return Math.max(0.9, laneChangeS * Math.abs(distanceLanes) + 1.2 * Math.abs(lateralSpeed) * laneChangeS * 0.5);
}
