import type { SimTorqueConverter } from './types';

/**
 * Hydrodynamic torque converter (capacity-factor / K-factor model).
 *
 * Pump torque  T_p = C(SR) · ω_e²,  C(SR) = C_stall · (1 − SR⁸)
 * Turbine torque T_t = TR(SR) · T_p, with TR falling linearly from the stall
 * torque ratio to 1.0 at the coupling point. SR = ω_turbine / ω_engine.
 * When the turbine overruns the engine (engine braking) the flow reverses
 * with reduced capacity.
 */
export function torqueConverterTorques(
  tc: SimTorqueConverter,
  engineOmega: number,
  turbineOmega: number,
): { pump: number; turbine: number } {
  if (engineOmega <= 1e-3 && turbineOmega <= 1e-3) return { pump: 0, turbine: 0 };
  if (turbineOmega <= engineOmega) {
    const sr = Math.max(0, turbineOmega / engineOmega);
    const capacity = tc.capacityAtStall * (1 - sr ** 8);
    const pump = capacity * engineOmega * engineOmega;
    const ratio =
      sr < tc.couplingSpeedRatio ? tc.stallTorqueRatio - ((tc.stallTorqueRatio - 1) * sr) / tc.couplingSpeedRatio : 1;
    return { pump, turbine: pump * ratio };
  }
  const inverse = engineOmega / turbineOmega;
  const capacity = 0.8 * tc.capacityAtStall * (1 - inverse ** 8);
  const torque = -capacity * turbineOmega * turbineOmega;
  return { pump: torque, turbine: torque };
}

/** Converter efficiency (output power / input power) at a speed ratio. */
export function torqueConverterEfficiency(tc: SimTorqueConverter, speedRatio: number): number {
  const sr = Math.min(Math.max(speedRatio, 0), 1);
  const ratio =
    sr < tc.couplingSpeedRatio ? tc.stallTorqueRatio - ((tc.stallTorqueRatio - 1) * sr) / tc.couplingSpeedRatio : 1;
  return sr * ratio;
}
