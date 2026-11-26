import { getTireCompound } from '../data/tires';
import type { TireDims, TireSizeOption, VehicleSpec } from '../data/types';
import { DEFAULT_CREEP_TORQUE_NM, DRIVER_MASS_KG } from '../physics/constants';
import { Curve } from '../physics/curve';
import { computeWotUpshiftRpms } from '../physics/gearbox';
import type { SimTransmission, SimVehicle } from '../physics/types';
import { kmhToMs, rpmToRadS } from '../physics/units';
import { defaultTuning, type TuningConfig } from './tuning';

/** Feasible front-axle share of drive force for the drivetrain layout. */
export function frontShareRange(spec: VehicleSpec): readonly [number, number] {
  const d = spec.drivetrain;
  if (d.layout === 'FWD') return [1, 1];
  if (d.layout === 'RWD') return [0, 0];
  if (d.frontShareRange) return d.frontShareRange;
  return [1 - (d.maxRearShare ?? 0.5), 1];
}

/** Dynamic rolling radius of a tire, m (≈ 97 % of the unloaded radius). */
export function tireRollingRadiusM(t: TireDims): number {
  const unloadedMm = (t.rimIn * 25.4) / 2 + (t.widthMm * t.aspectPct) / 100;
  return (unloadedMm / 1000) * 0.97;
}

export function resolveTireSize(spec: VehicleSpec, tuning: TuningConfig): TireSizeOption {
  return spec.tires.sizes.find((s) => s.id === tuning.tireSizeId) ?? spec.tires.sizes[0];
}

/** Engine torque and boost curves after ECU stage and power adjustment. */
export function tunedEngineCurves(spec: VehicleSpec, tuning: TuningConfig): { torque: Curve; boost: Curve } {
  let torque = new Curve(spec.engine.torqueCurveNm);
  let boost = new Curve(spec.engine.boostCurveBar);
  if (tuning.ecuStage === 'stage1' && spec.stage1) {
    torque = torque.multiply(new Curve(spec.stage1.torqueMultiplier));
    boost = boost.add(new Curve(spec.stage1.boostAddBar));
  }
  if (tuning.powerAdjustPct !== 0) {
    const k = 1 + tuning.powerAdjustPct / 100;
    torque = torque.scale(k);
    // Boost scales with the extra airflow needed (absolute pressure ∝ torque).
    boost = new Curve(boost.points.map(([x, y]) => [x, Math.max(0, (1.013 + y) * k - 1.013)] as const));
  }
  return { torque, boost };
}

/**
 * Combine a factory spec and a tuning configuration into the flat, SI-unit
 * `SimVehicle` the physics engine consumes.
 */
export function buildSimVehicle(spec: VehicleSpec, tuning: TuningConfig = defaultTuning(spec)): SimVehicle {
  const { torque, boost } = tunedEngineCurves(spec, tuning);
  const t = spec.transmission;
  const overallRatios = t.gearRatios.map((g, i) => g * t.finalDrive[i]);
  const shiftScale = tuning.ecuStage === 'stage1' ? (spec.stage1?.shiftTimeScale ?? 1) : 1;

  const transmission: SimTransmission = {
    type: t.type,
    gearRatios: [...t.gearRatios],
    finalDrive: [...t.finalDrive],
    overallRatios,
    upshiftTimeS: t.upshiftTimeS * shiftScale,
    downshiftTimeS: t.downshiftTimeS * shiftScale,
    shiftTorqueDip: t.shiftTorqueDip,
    shiftProfile: t.shiftProfile ?? (t.type === 'manual' || t.type === 'automated-manual' ? 'interrupt' : 'blend'),
    maxAutoUpshiftRpm: t.maxAutoUpshiftRpm,
    wotUpshiftRpm: computeWotUpshiftRpms(torque, overallRatios, t.maxAutoUpshiftRpm, spec.engine.revLimitRpm),
  };
  if (t.torqueConverter) {
    const stallOmega = rpmToRadS(t.torqueConverter.stallRpm);
    // Capacity is a property of the converter hardware: size it on the stock
    // engine so a stronger tune raises the stall speed, as in reality.
    const stockStallTorque = new Curve(spec.engine.torqueCurveNm).at(t.torqueConverter.stallRpm);
    transmission.torqueConverter = {
      ...t.torqueConverter,
      capacityAtStall: stockStallTorque / (stallOmega * stallOmega),
    };
  }
  if (t.launchClutch) {
    transmission.launchClutch = {
      launchRpm: t.launchClutch.launchRpm,
      brakeHoldRpmLimit: t.launchClutch.brakeHoldRpmLimit,
      maxClutchTorqueNm: t.launchClutch.maxClutchTorqueNm,
      creep: t.launchClutch.creep ?? t.type === 'dual-clutch',
      creepTorqueNm: t.launchClutch.creepTorqueNm ?? DEFAULT_CREEP_TORQUE_NM,
      driverEngageS: t.launchClutch.driverEngageS ?? 0,
    };
  }

  const size = resolveTireSize(spec, tuning);
  const compound = getTireCompound(tuning.tireCompoundId);
  const layout = spec.drivetrain.layout;
  const drivenTire = layout === 'FWD' ? size.front : size.rear;
  const drivenRadius =
    layout === 'AWD'
      ? (tireRollingRadiusM(size.front) + tireRollingRadiusM(size.rear)) / 2
      : tireRollingRadiusM(drivenTire);
  const drivenWidth = layout === 'AWD' ? (size.front.widthMm + size.rear.widthMm) / 2 : drivenTire.widthMm;
  // Wider tires gain a little grip (contact-patch load sensitivity).
  const widthFactor = (drivenWidth / 225) ** 0.15;

  const o = tuning.overrides;
  const cd = o.dragCoefficient ?? spec.aero.dragCoefficient;
  const area = o.frontalAreaM2 ?? spec.aero.frontalAreaM2;

  return {
    id: spec.id,
    name: spec.shortName,
    colorSlot: spec.colorSlot ?? -1,
    engine: {
      idleRpm: spec.engine.idleRpm,
      redlineRpm: spec.engine.redlineRpm,
      revLimitRpm: spec.engine.revLimitRpm,
      torque,
      boost,
      spoolTau: new Curve(spec.engine.spoolTimeConstantS),
      inertiaKgM2: spec.engine.inertiaKgM2,
      frictionBaseNm: spec.engine.friction.baseNm,
      frictionPerKrpmNm: spec.engine.friction.perKrpmNm,
    },
    transmission,
    drivetrain: {
      layout,
      efficiency: o.drivetrainEfficiency ?? spec.drivetrain.efficiency,
      frontShare: frontShareRange(spec),
    },
    massKg: spec.chassis.curbMassKg + DRIVER_MASS_KG + tuning.weightDeltaKg,
    frontWeightFraction: spec.chassis.frontWeightFraction,
    wheelbaseM: spec.chassis.wheelbaseM,
    cgHeightM: spec.chassis.cgHeightM,
    dragAreaM2: cd * area,
    wheelRadiusM: drivenRadius,
    wheelInertiaKgM2: size.wheelInertiaKgM2 * 4,
    tireMu: compound.mu * widthFactor * (spec.tires.gripScale ?? 1),
    rollingResistance: compound.rollingResistance,
    speedLimitMs: tuning.speedLimiter && spec.speedLimiterKmh !== null ? kmhToMs(spec.speedLimiterKmh) : null,
  };
}
