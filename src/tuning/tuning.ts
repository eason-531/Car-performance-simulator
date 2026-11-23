import type { VehicleSpec } from '../data/types';
import { TIRE_COMPOUNDS, getTireCompound } from '../data/tires';

export type EcuStage = 'stock' | 'stage1';

export interface TuningOverrides {
  dragCoefficient: number | null;
  frontalAreaM2: number | null;
  drivetrainEfficiency: number | null;
}

export interface TuningConfig {
  ecuStage: EcuStage;
  /** Extra scaling of the whole torque (and therefore power) curve, percent. */
  powerAdjustPct: number;
  tireSizeId: string;
  tireCompoundId: string;
  /** Added (+) or removed (−) mass relative to curb + driver, kg. */
  weightDeltaKg: number;
  /** Whether the factory top-speed limiter is active. */
  speedLimiter: boolean;
  /** Overrides for estimated parameters (null = use the vehicle data). */
  overrides: TuningOverrides;
}

export const TUNING_LIMITS = {
  powerAdjustPct: { min: -30, max: 50, step: 1 },
  weightDeltaKg: { min: -200, max: 500, step: 5 },
  dragCoefficient: { min: 0.2, max: 0.45, step: 0.005 },
  frontalAreaM2: { min: 1.6, max: 3.0, step: 0.01 },
  drivetrainEfficiency: { min: 0.7, max: 0.95, step: 0.005 },
} as const;

export function defaultTuning(spec: VehicleSpec): TuningConfig {
  return {
    ecuStage: 'stock',
    powerAdjustPct: 0,
    tireSizeId: spec.tires.defaultSizeId,
    tireCompoundId: spec.tires.defaultCompoundId,
    weightDeltaKg: 0,
    speedLimiter: spec.speedLimiterKmh !== null,
    overrides: { dragCoefficient: null, frontalAreaM2: null, drivetrainEfficiency: null },
  };
}

export function isStock(spec: VehicleSpec, t: TuningConfig): boolean {
  const d = defaultTuning(spec);
  return (
    t.ecuStage === d.ecuStage &&
    t.powerAdjustPct === d.powerAdjustPct &&
    t.tireSizeId === d.tireSizeId &&
    t.tireCompoundId === d.tireCompoundId &&
    t.weightDeltaKg === d.weightDeltaKg &&
    t.speedLimiter === d.speedLimiter &&
    t.overrides.dragCoefficient === null &&
    t.overrides.frontalAreaM2 === null &&
    t.overrides.drivetrainEfficiency === null
  );
}

/** Short human-readable summary, e.g. "Stage 1 · +5 % · UHP tires · +80 kg". */
export function describeTuning(spec: VehicleSpec, t: TuningConfig): string {
  if (isStock(spec, t)) return 'Stock';
  const parts: string[] = [];
  parts.push(t.ecuStage === 'stage1' ? 'Stage 1' : 'Stock ECU');
  if (t.powerAdjustPct !== 0) parts.push(`${t.powerAdjustPct > 0 ? '+' : ''}${t.powerAdjustPct} % power`);
  if (t.tireCompoundId !== spec.tires.defaultCompoundId) parts.push(getTireCompound(t.tireCompoundId).label);
  if (t.tireSizeId !== spec.tires.defaultSizeId) {
    const size = spec.tires.sizes.find((s) => s.id === t.tireSizeId);
    if (size) parts.push(size.label);
  }
  if (t.weightDeltaKg !== 0) parts.push(`${t.weightDeltaKg > 0 ? '+' : ''}${t.weightDeltaKg} kg`);
  if (!t.speedLimiter && spec.speedLimiterKmh !== null) parts.push('No limiter');
  const o = t.overrides;
  if (o.dragCoefficient !== null || o.frontalAreaM2 !== null || o.drivetrainEfficiency !== null) parts.push('Custom params');
  return parts.join(' · ');
}

const clampNum = (v: unknown, min: number, max: number, fallback: number): number =>
  typeof v === 'number' && Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : fallback;

const clampOrNull = (v: unknown, min: number, max: number): number | null =>
  typeof v === 'number' && Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : null;

/** Validate untrusted data (e.g. from localStorage) into a safe TuningConfig. */
export function sanitizeTuning(spec: VehicleSpec, raw: unknown): TuningConfig {
  const d = defaultTuning(spec);
  if (!raw || typeof raw !== 'object') return d;
  const r = raw as Record<string, unknown>;
  const o = (r.overrides && typeof r.overrides === 'object' ? r.overrides : {}) as Record<string, unknown>;
  const L = TUNING_LIMITS;
  return {
    ecuStage: r.ecuStage === 'stage1' ? 'stage1' : 'stock',
    powerAdjustPct: Math.round(clampNum(r.powerAdjustPct, L.powerAdjustPct.min, L.powerAdjustPct.max, 0)),
    tireSizeId:
      typeof r.tireSizeId === 'string' && spec.tires.sizes.some((s) => s.id === r.tireSizeId)
        ? r.tireSizeId
        : d.tireSizeId,
    tireCompoundId:
      typeof r.tireCompoundId === 'string' && TIRE_COMPOUNDS.some((c) => c.id === r.tireCompoundId)
        ? r.tireCompoundId
        : d.tireCompoundId,
    weightDeltaKg: Math.round(clampNum(r.weightDeltaKg, L.weightDeltaKg.min, L.weightDeltaKg.max, 0)),
    speedLimiter: typeof r.speedLimiter === 'boolean' ? r.speedLimiter : d.speedLimiter,
    overrides: {
      dragCoefficient: clampOrNull(o.dragCoefficient, L.dragCoefficient.min, L.dragCoefficient.max),
      frontalAreaM2: clampOrNull(o.frontalAreaM2, L.frontalAreaM2.min, L.frontalAreaM2.max),
      drivetrainEfficiency: clampOrNull(o.drivetrainEfficiency, L.drivetrainEfficiency.min, L.drivetrainEfficiency.max),
    },
  };
}
