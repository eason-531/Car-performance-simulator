import type {
  CurvePoints,
  DriveLayout,
  LaunchClutchSpec,
  Provenance,
  StageTune,
  TireDims,
  TorqueConverterSpec,
  TransmissionType,
  VehicleSpec,
} from '../types';
import type { BodyStyle } from './types';

/**
 * Helpers that turn published ratings into a full `VehicleSpec`.
 *
 * Every value a car file does not supply is filled with a declared estimate
 * and a provenance line saying why, so nothing in the model is silent.
 */

export const HP_TO_KW = 0.745699872;
export const PS_TO_KW = 0.73549875;
export const LBFT_TO_NM = 1.3558179483;

export type Aspiration = 'turbo' | 'twin-turbo' | 'supercharged' | 'na';

export interface RatedValue<U extends string> {
  value: number;
  unit: U;
  /** rpm range of the peak (equal ends for a single rpm). */
  rpm: readonly [number, number];
}

export interface RatedEngine {
  code: string;
  description: string;
  displacementCc: number;
  aspiration: Aspiration;
  idleRpm: number;
  redlineRpm: number;
  revLimitRpm: number;
  /** As published: SAE net hp, DIN PS or kW. */
  power: RatedValue<'hp' | 'PS' | 'kW'>;
  torque: RatedValue<'lb-ft' | 'Nm'>;
  /** Estimated peak boost, gauge bar (turbo / supercharged only). */
  peakBoostBar?: number;
  /** Torque at idle as a fraction of peak (shape estimate). */
  lowEndFraction?: number;
  /** Power at the rev limit as a fraction of peak (shape estimate). */
  topEndPowerFraction?: number;
  /** Multiplier on the generic turbo spool time constants. */
  spoolScale?: number;
  inertiaKgM2?: number;
  /** Use a published curve instead of the generated shape. */
  torqueCurveNm?: CurvePoints;
}

export const toKw = (p: RatedValue<'hp' | 'PS' | 'kW'>): number =>
  p.unit === 'kW' ? p.value : p.unit === 'hp' ? p.value * HP_TO_KW : p.value * PS_TO_KW;
export const toPs = (p: RatedValue<'hp' | 'PS' | 'kW'>): number => toKw(p) / PS_TO_KW;
export const toNm = (t: RatedValue<'lb-ft' | 'Nm'>): number => (t.unit === 'Nm' ? t.value : t.value * LBFT_TO_NM);

const omega = (rpm: number) => (rpm * 2 * Math.PI) / 60;

/**
 * Full-load torque curve generated from rated peaks:
 * rise from idle → plateau over the rated torque band → taper so power peaks
 * exactly at the rated power band → gentle fall to the rev limit. Every point
 * is clamped so neither torque nor power exceeds its published peak.
 */
export function ratedTorqueCurve(e: RatedEngine): CurvePoints {
  if (e.torqueCurveNm) return e.torqueCurveNm;
  const tPk = toNm(e.torque);
  const pPk = toKw(e.power) * 1000;
  const [tLo, tHi] = e.torque.rpm;
  const [pLo, pHi] = e.power.rpm;
  const na = e.aspiration === 'na';
  const low = e.lowEndFraction ?? (na ? 0.7 : e.aspiration === 'supercharged' ? 0.72 : 0.5);
  const top = e.topEndPowerFraction ?? (na ? 0.95 : 0.92);
  const rpms = new Set<number>([e.idleRpm, tLo, tHi, pLo, pHi, e.revLimitRpm]);
  for (let r = Math.ceil(e.idleRpm / 250) * 250; r < e.revLimitRpm; r += 250) rpms.add(r);
  const sorted = [...rpms].filter((r) => r >= e.idleRpm && r <= e.revLimitRpm).sort((a, b) => a - b);

  const tAtPowerLo = pPk / omega(pLo);
  const pts: [number, number][] = [];
  for (const r of sorted) {
    let t: number;
    if (r <= tLo) {
      const x = tLo > e.idleRpm ? (r - e.idleRpm) / (tLo - e.idleRpm) : 1;
      const shape = na ? Math.sqrt(x) : x * x * (3 - 2 * x);
      t = tPk * (low + (1 - low) * shape);
    } else if (r <= tHi) {
      t = tPk;
    } else if (r <= pLo) {
      const x = (r - tHi) / Math.max(1, pLo - tHi);
      t = tPk + (Math.min(tPk, tAtPowerLo) - tPk) * x;
    } else if (r <= pHi) {
      t = pPk / omega(r);
    } else {
      const x = (r - pHi) / Math.max(1, e.revLimitRpm - pHi);
      t = (pPk * (1 - (1 - top) * x)) / omega(r);
    }
    t = Math.min(t, tPk, pPk / omega(r));
    pts.push([r, Math.round(t * 10) / 10]);
  }
  return pts;
}

/** Steady-state boost estimate following the torque build-up (display + spool target). */
export function estimatedBoostCurve(e: RatedEngine, torque: CurvePoints): CurvePoints {
  if (e.aspiration === 'na') {
    return [
      [e.idleRpm, 0],
      [e.revLimitRpm, 0],
    ];
  }
  const peak = e.peakBoostBar ?? 1.1;
  const tPk = Math.max(...torque.map(([, t]) => t));
  const low = e.lowEndFraction ?? (e.aspiration === 'supercharged' ? 0.72 : 0.5);
  return torque.map(([r, t]) => {
    const f = Math.min(1, Math.max(0, (t / tPk - low * 0.9) / (1 - low * 0.9)));
    return [r, Math.round(Math.max(0.05, peak * f) * 100) / 100] as const;
  });
}

export function estimatedSpool(e: RatedEngine): CurvePoints {
  if (e.aspiration === 'na' || e.aspiration === 'supercharged') {
    return [
      [e.idleRpm, 0.05],
      [e.revLimitRpm, 0.05],
    ];
  }
  const k = (e.spoolScale ?? 1) * (e.aspiration === 'twin-turbo' ? 0.85 : 1);
  const base: [number, number][] = [
    [e.idleRpm, 1.1],
    [1500, 0.7],
    [2000, 0.45],
    [3000, 0.3],
    [4000, 0.24],
    [Math.max(4100, e.revLimitRpm), 0.2],
  ];
  return base.filter(([r], i) => i === 0 || r > e.idleRpm).map(([r, t]) => [r, Math.round(t * k * 100) / 100] as const);
}

export interface SimInput {
  engine: RatedEngine;
  transmission: {
    type: TransmissionType;
    name: string;
    gearRatios: readonly number[];
    /** Single final drive or one per gear (multi-output DCTs). */
    finalDrive: number | readonly number[];
    /** Front-axle ratio where it differs from the rear (reference only). */
    frontAxleRatio?: number;
    upshiftTimeS?: number;
    downshiftTimeS?: number;
    shiftTorqueDip?: number;
    maxAutoUpshiftRpm?: number;
    ratedInputTorqueNm?: number;
    torqueConverter?: Partial<TorqueConverterSpec>;
    launchClutch?: Partial<LaunchClutchSpec>;
  };
  drivetrain: {
    layout: DriveLayout;
    description: string;
    efficiency?: number;
    frontShareRange?: readonly [number, number];
  };
  chassis: {
    curbMassKg: number;
    frontWeightFraction?: number;
    wheelbaseM: number;
    cgHeightM?: number;
    lengthMm?: number;
    widthMm?: number;
    heightMm?: number;
  };
  aero: { dragCoefficient?: number; frontalAreaM2?: number };
  tires: {
    sizes: readonly { id: string; label: string; front: TireDims; rear: TireDims; note?: string }[];
    defaultSizeId?: string;
    /** Stock compound class id (see data/tires.ts). */
    compound: string;
    /** Declared grip calibration (default 1); document the fit in provenance. */
    gripScale?: number;
  };
  speedLimiterKmh: number | null;
  factory?: { zeroTo100S?: number | null; topSpeedKmh?: number | null; zeroTo60MphS?: number | null };
  stage1?: StageTune;
  /** Sourced facts for this configuration (with URLs). Estimates are appended automatically. */
  provenance: readonly Provenance[];
  notes?: readonly string[];
}

export interface Identity {
  id: string;
  make: string;
  model: string;
  trim: string;
  modelYear: number;
  market: string;
  shortName: string;
  body: BodyStyle;
}

const CG_BY_BODY: Record<BodyStyle, number> = {
  Sedan: 0.52,
  Hatchback: 0.54,
  Liftback: 0.52,
  Wagon: 0.55,
  Coupe: 0.48,
  Convertible: 0.46,
  SUV: 0.65,
  Crossover: 0.6,
  Pickup: 0.75,
};
const CD_BY_BODY: Record<BodyStyle, number> = {
  Sedan: 0.29,
  Hatchback: 0.32,
  Liftback: 0.3,
  Wagon: 0.31,
  Coupe: 0.33,
  Convertible: 0.35,
  SUV: 0.36,
  Crossover: 0.34,
  Pickup: 0.5,
};

function defaultEfficiency(layout: DriveLayout, type: TransmissionType): number {
  const base = type === 'torque-converter-automatic' ? 0.87 : 0.89;
  return layout === 'FWD' ? base : layout === 'RWD' ? base - 0.01 : base - 0.04;
}

function wheelInertia(rimIn: number): number {
  return Math.round((0.55 + rimIn * 0.033) * 100) / 100;
}

/** Combine identity + researched inputs into a VehicleSpec with declared estimates. */
export function buildSpec(id: Identity, input: SimInput): VehicleSpec {
  const est: Provenance[] = [];
  const estimate = (parameter: string, value: string, source: string) =>
    est.push({ parameter, value, status: 'estimated', source });

  const e = input.engine;
  const torqueCurve = ratedTorqueCurve(e);
  if (!e.torqueCurveNm) {
    estimate(
      'Torque curve shape',
      `Generated from ${e.torque.value} ${e.torque.unit} @ ${e.torque.rpm.join('–')} and ${e.power.value} ${e.power.unit} @ ${e.power.rpm.join('–')} rpm`,
      'No published full-load curve found; shape generated so it never exceeds the rated peaks',
    );
  }
  const boost = estimatedBoostCurve(e, torqueCurve);
  if (e.aspiration !== 'na') {
    estimate('Boost curve', `Peak ≈ ${(e.peakBoostBar ?? 1.1).toFixed(2)} bar`, e.peakBoostBar ? 'Typical published/logged value for this engine family' : 'No published figure; generic turbo estimate');
  }
  const spool = estimatedSpool(e);
  if (e.aspiration === 'turbo' || e.aspiration === 'twin-turbo') {
    estimate('Turbo response', `τ ≈ ${spool.find(([r]) => r >= 2000)?.[1] ?? 0.45} s @ 2,000 rpm`, 'Generic spool model scaled by turbo layout');
  }
  const liters = e.displacementCc / 1000;
  const tc = input.transmission.type === 'torque-converter-automatic';
  const inertia =
    e.inertiaKgM2 ?? Math.round(((liters < 2.1 ? 0.17 : liters < 3.1 ? 0.2 : liters < 4.5 ? 0.24 : 0.28) + (tc ? 0.03 : 0)) * 100) / 100;
  if (e.inertiaKgM2 === undefined) estimate('Engine inertia', `${inertia} kg·m²`, 'Displacement class; includes converter pump for automatics');

  const t = input.transmission;
  const n = t.gearRatios.length;
  const finalDrive = typeof t.finalDrive === 'number' ? Array<number>(n).fill(t.finalDrive) : [...t.finalDrive];
  const isManual = t.type === 'manual';
  const isDct = t.type === 'dual-clutch';
  const up = t.upshiftTimeS ?? (isManual ? 0.3 : isDct ? 0.15 : 0.3);
  const down = t.downshiftTimeS ?? (isManual ? 0.5 : isDct ? 0.25 : 0.4);
  const dip = t.shiftTorqueDip ?? (isManual ? 1 : isDct ? 0.18 : 0.45);
  if (t.upshiftTimeS === undefined) {
    estimate('Shift time', `${up} s up / ${down} s down`, isManual ? 'Deterministic test driver: brisk full-throttle clutch shift' : isDct ? 'Typical dual-clutch handover' : 'Typical modern planetary automatic');
  }
  const tPk = toNm(e.torque);
  const torqueConverter: TorqueConverterSpec | undefined = tc
    ? {
        stallRpm: t.torqueConverter?.stallRpm ?? 2400,
        stallTorqueRatio: t.torqueConverter?.stallTorqueRatio ?? 1.9,
        couplingSpeedRatio: t.torqueConverter?.couplingSpeedRatio ?? 0.85,
        lockupMinGear: t.torqueConverter?.lockupMinGear ?? 2,
      }
    : undefined;
  if (tc && t.torqueConverter?.stallRpm === undefined) estimate('Torque converter', 'Stall ≈ 2,400 rpm, 1.9:1', 'Typical for modern planetary automatics');
  // Deterministic manual launch: slip the clutch at the peak-torque rpm, no
  // lower than 4,000 rpm (turbo spool) and no higher than 75 % of the redline.
  const manualLaunchRpm = Math.round(Math.min(Math.max(e.torque.rpm[0], 4000), e.redlineRpm * 0.75) / 100) * 100;
  const defaultLaunchRpm = isManual ? manualLaunchRpm : 3000;
  const launchClutch: LaunchClutchSpec | undefined = tc
    ? undefined
    : {
        launchRpm: t.launchClutch?.launchRpm ?? defaultLaunchRpm,
        brakeHoldRpmLimit: t.launchClutch?.brakeHoldRpmLimit ?? t.launchClutch?.launchRpm ?? defaultLaunchRpm,
        maxClutchTorqueNm: t.launchClutch?.maxClutchTorqueNm ?? Math.round(tPk * 1.6),
        creep: t.launchClutch?.creep ?? !isManual,
        driverEngageS: t.launchClutch?.driverEngageS ?? (isManual ? 0.3 : undefined),
      };
  if (launchClutch && t.launchClutch?.launchRpm === undefined) {
    estimate('Launch rpm', `≈ ${launchClutch.launchRpm} rpm`, isManual ? 'Deterministic test driver: clutch slip at the peak-torque rpm (4,000 rpm minimum, 75 % of redline maximum)' : 'Launch-control / brake-boost behaviour');
  }

  const d = input.drivetrain;
  const efficiency = d.efficiency ?? defaultEfficiency(d.layout, t.type);
  if (d.efficiency === undefined) {
    estimate('Drivetrain efficiency', `${(efficiency * 100).toFixed(0)} %`, `Typical ${d.layout} ${t.type.replace(/-/g, ' ')} losses`);
  }
  if ((d.layout === 'AWD' || d.layout === '4WD') && !d.frontShareRange) {
    estimate('AWD split', 'Front share 0.5–1.0', 'Generic on-demand front-biased system');
  }

  const c = input.chassis;
  const fwf = c.frontWeightFraction ?? (d.layout === 'FWD' ? 0.61 : d.layout === 'RWD' ? 0.52 : 0.57);
  if (c.frontWeightFraction === undefined) estimate('Weight distribution', `${Math.round(fwf * 100)} % front`, `Typical ${d.layout} layout`);
  const cg = c.cgHeightM ?? CG_BY_BODY[id.body];
  if (c.cgHeightM === undefined) estimate('CG height', `${cg} m`, `Typical ${id.body.toLowerCase()} value`);

  const cd = input.aero.dragCoefficient ?? CD_BY_BODY[id.body];
  if (input.aero.dragCoefficient === undefined) estimate('Drag coefficient', `Cd ${cd}`, `No published figure found; typical ${id.body.toLowerCase()}`);
  let area = input.aero.frontalAreaM2;
  if (area === undefined) {
    area = c.widthMm && c.heightMm ? Math.round(0.84 * (c.widthMm / 1000) * (c.heightMm / 1000) * 100) / 100 : 2.2;
    estimate('Frontal area', `${area} m²`, c.widthMm && c.heightMm ? '≈ 0.84 × width × height' : 'No dimensions; generic value');
  }

  const sizes = input.tires.sizes.map((s) => ({ ...s, wheelInertiaKgM2: wheelInertia(Math.max(s.front.rimIn, s.rear.rimIn)) }));
  estimate('Wheel inertia', `${sizes[0].wheelInertiaKgM2} kg·m² per corner`, 'Rim-diameter class estimate');

  return {
    id: id.id,
    make: id.make,
    model: id.model,
    variant: id.trim,
    modelYear: id.modelYear,
    market: id.market,
    shortName: id.shortName,
    engine: {
      code: e.code,
      description: e.description,
      displacementCc: e.displacementCc,
      idleRpm: e.idleRpm,
      redlineRpm: e.redlineRpm,
      revLimitRpm: e.revLimitRpm,
      torqueCurveNm: torqueCurve,
      boostCurveBar: boost,
      spoolTimeConstantS: spool,
      inertiaKgM2: inertia,
      friction: { baseNm: Math.round(8 + 3 * liters), perKrpmNm: Math.round((4 + 1.6 * liters) * 10) / 10 },
      rated: {
        powerPs: Math.round(toPs(e.power) * 10) / 10,
        powerRpm: e.power.rpm,
        torqueNm: Math.round(tPk * 10) / 10,
        torqueRpm: e.torque.rpm,
      },
    },
    transmission: {
      type: t.type,
      name: t.name,
      gearRatios: t.gearRatios,
      finalDrive,
      ...(t.frontAxleRatio !== undefined ? { frontAxleRatio: t.frontAxleRatio } : {}),
      upshiftTimeS: up,
      downshiftTimeS: down,
      shiftTorqueDip: dip,
      maxAutoUpshiftRpm: t.maxAutoUpshiftRpm ?? Math.min(e.redlineRpm, e.revLimitRpm - (tc ? 300 : 100)),
      ratedInputTorqueNm: t.ratedInputTorqueNm ?? Math.round(tPk * 1.1),
      torqueConverter,
      launchClutch,
    },
    drivetrain: { layout: d.layout, description: d.description, efficiency, frontShareRange: d.frontShareRange },
    chassis: {
      curbMassKg: c.curbMassKg,
      frontWeightFraction: fwf,
      wheelbaseM: c.wheelbaseM,
      cgHeightM: cg,
      lengthMm: c.lengthMm ?? 0,
      widthMm: c.widthMm ?? 0,
      heightMm: c.heightMm ?? 0,
    },
    aero: { dragCoefficient: cd, frontalAreaM2: area },
    tires: {
      sizes,
      defaultSizeId: input.tires.defaultSizeId ?? sizes[0].id,
      defaultCompoundId: input.tires.compound,
      gripScale: input.tires.gripScale,
    },
    speedLimiterKmh: input.speedLimiterKmh,
    factory: {
      zeroTo100S: input.factory?.zeroTo100S ?? null,
      topSpeedKmh: input.factory?.topSpeedKmh ?? null,
      zeroTo60MphS: input.factory?.zeroTo60MphS ?? null,
    },
    stage1: input.stage1,
    provenance: [...input.provenance, ...est],
    notes: input.notes ?? [],
  };
}

/** Convenience for a square tire fitment. */
export function square(id: string, label: string, widthMm: number, aspectPct: number, rimIn: number, note?: string) {
  const dims = { widthMm, aspectPct, rimIn };
  return { id, label, front: dims, rear: dims, note };
}

/** Convenience for a staggered fitment. */
export function staggered(id: string, label: string, front: TireDims, rear: TireDims, note?: string) {
  return { id, label, front, rear, note };
}
