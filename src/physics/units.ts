/** Unit conversions. Internal physics is SI (m, s, kg, N, rad/s). */

export const KMH_PER_MS = 3.6;
export const MPH_PER_MS = 2.2369362920544;
export const KW_PER_PS = 0.73549875;
export const KW_PER_HP = 0.745699872;
export const METERS_PER_FOOT = 0.3048;
export const METERS_PER_MILE = 1609.344;

export const msToKmh = (ms: number): number => ms * KMH_PER_MS;
export const kmhToMs = (kmh: number): number => kmh / KMH_PER_MS;
export const msToMph = (ms: number): number => ms * MPH_PER_MS;
export const mphToMs = (mph: number): number => mph / MPH_PER_MS;

export const rpmToRadS = (rpm: number): number => (rpm * 2 * Math.PI) / 60;
export const radSToRpm = (radS: number): number => (radS * 60) / (2 * Math.PI);

/** Shaft power in kW from torque (Nm) and speed (rpm). */
export const powerKw = (torqueNm: number, rpm: number): number => (torqueNm * rpmToRadS(rpm)) / 1000;
export const kwToPs = (kw: number): number => kw / KW_PER_PS;
export const psToKw = (ps: number): number => ps * KW_PER_PS;
export const kwToHp = (kw: number): number => kw / KW_PER_HP;
export const powerPs = (torqueNm: number, rpm: number): number => kwToPs(powerKw(torqueNm, rpm));

export const clamp = (x: number, lo: number, hi: number): number => (x < lo ? lo : x > hi ? hi : x);
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
export const smoothstep = (t: number): number => {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
};
