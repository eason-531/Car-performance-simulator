import { getTireCompound } from '../data/tires';
import type { TireDims, TireSizeOption, VehicleSpec } from '../data/types';
import { DEFAULT_CREEP_TORQUE_NM, DRIVER_MASS_KG } from '../physics/constants';
import { Curve } from '../physics/curve';
import { computeWotUpshiftRpms } from '../physics/gearbox';
import type { SimElectric, SimHybrid, SimTransmission, SimVehicle } from '../physics/types';
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
    // A CVT's simulated steps change at the step-shift rpm; other gearboxes at the best full-throttle point.
    wotUpshiftRpm: t.cvt
      ? overallRatios.map((_, i) => (i < overallRatios.length - 1 ? t.cvt!.stepUpshiftRpm : spec.engine.revLimitRpm))
      : computeWotUpshiftRpms(torque, overallRatios, t.maxAutoUpshiftRpm, spec.engine.revLimitRpm),
    ...(t.cvt ? { cvt: t.cvt } : {}),
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
      creep: t.launchClutch.creep ?? (t.type === 'dual-clutch' || t.type === 'multi-clutch'),
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
    ...(spec.electric ? { electric: buildSimElectric(spec, tuning) } : {}),
    ...(spec.hybrid ? { hybrid: buildSimHybrid(spec) } : {}),
  };
}

/** Axle-motor reduction and bearing losses (single fixed reduction). */
export const HYBRID_AXLE_EFFICIENCY = 0.95;

function buildSimHybrid(spec: VehicleSpec): SimHybrid {
  const h = spec.hybrid!;
  const motor = (m: { peakPowerKw: number; peakTorqueNm: number; maxRpm: number }) => ({ peakTorqueNm: m.peakTorqueNm, peakPowerW: m.peakPowerKw * 1000, maxRpm: m.maxRpm });
  return {
    inputMotor: h.inputMotor ? motor(h.inputMotor) : null,
    axleMotors: (h.axleMotors ?? []).map((m) => ({ ...motor(m), axle: m.axle, reduction: m.reduction })),
    systemPowerW: h.systemPowerKw * 1000,
    batteryPowerW: h.batteryPowerKw * 1000,
    axleEfficiency: HYBRID_AXLE_EFFICIENCY,
  };
}

/** Rotor inertia per motor (reflected through its reduction), kg·m² — a typical traction-motor value. */
export const MOTOR_ROTOR_INERTIA_KG_M2 = 0.05;

/** Electric drive after tuning: the power adjustment scales every motor and the shared limits. */
function buildSimElectric(spec: VehicleSpec, tuning: TuningConfig): SimElectric {
  const el = spec.electric!;
  const k = 1 + tuning.powerAdjustPct / 100;
  return {
    motors: el.motors.map((m) => ({
      axle: m.axle,
      peakPowerW: m.peakPowerKw * 1000 * k,
      peakTorqueNm: m.peakTorqueNm * k,
      maxRpm: m.maxRpm,
      peakPowerEndRpm: m.peakPowerEndRpm ?? null,
      peakPowerFadeExponent: m.peakPowerFadeExponent ?? 1,
      reductions: [...m.reductions],
      upshiftMs: m.upshiftKmh !== undefined ? kmhToMs(m.upshiftKmh) : null,
      rotorInertiaKgM2: MOTOR_ROTOR_INERTIA_KG_M2,
    })),
    systemPowerW: el.systemPowerKw * 1000 * k,
    systemTorqueNm: el.systemTorqueNm !== undefined ? el.systemTorqueNm * k : null,
    boost: el.boost
      ? {
          systemPowerW: el.boost.systemPowerKw * 1000 * k,
          systemTorqueNm: el.boost.systemTorqueNm !== undefined ? el.boost.systemTorqueNm * k : null,
          durationS: el.boost.durationS,
          trigger: el.boost.trigger,
          armed: el.boost.trigger === 'launch-control' || (tuning.electricBoostArmed ?? el.boost.armedByDefault ?? false),
          recoveryS: el.boost.recoveryS ?? 0,
          launchCooldownS: el.boost.launchCooldownS ?? 0,
        }
      : null,
    creep: el.creep,
    virtualShift: el.virtualShift
      ? {
          label: el.virtualShift.label,
          idleRpm: el.virtualShift.idleRpm,
          redlineRpm: el.virtualShift.redlineRpm,
          revLimitRpm: el.virtualShift.revLimitRpm,
          transmission: {
            type: 'dual-clutch',
            gearRatios: [...el.virtualShift.ratios],
            finalDrive: el.virtualShift.ratios.map(() => 1),
            overallRatios: [...el.virtualShift.ratios],
            upshiftTimeS: el.virtualShift.upshiftTimeS,
            downshiftTimeS: el.virtualShift.downshiftTimeS,
            shiftTorqueDip: 1,
            shiftProfile: 'interrupt',
            maxAutoUpshiftRpm: el.virtualShift.redlineRpm,
            // Motor output does not depend on the virtual gear, so the best
            // full-throttle change is at the virtual redline.
            wotUpshiftRpm: el.virtualShift.ratios.map((_, i, a) => (i < a.length - 1 ? el.virtualShift!.redlineRpm : el.virtualShift!.revLimitRpm)),
          },
        }
      : null,
  };
}
