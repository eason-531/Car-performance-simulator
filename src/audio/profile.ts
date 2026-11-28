import { findEntry } from '../data/catalog';
import type { TransmissionType, VehicleSpec } from '../data/types';

export interface SoundProfile {
  /** Cylinders in the four-stroke cycle. Zero selects the electric motor voice. */
  cylinders: number;
  unevenPulses: number;
  exhaustResonanceHz: number;
  idleRpm: number;
  maxRpm: number;
  turboCount: number;
  supercharged: boolean;
  transmission: TransmissionType;
  shiftTimeS: number;
  motorCount: number;
  motorPowerKw: number;
}

export function soundProfile(spec: VehicleSpec, virtualShift = false): SoundProfile {
  const e = spec.engine;
  const virtual = virtualShift ? spec.electric?.virtualShift : null;
  if (spec.electric && !virtual) {
    return {
      cylinders: 0, unevenPulses: 0, exhaustResonanceHz: 0,
      idleRpm: 0, maxRpm: e.revLimitRpm, turboCount: 0, supercharged: false,
      transmission: 'direct-drive', shiftTimeS: spec.transmission.upshiftTimeS,
      motorCount: spec.electric.motors.length, motorPowerKw: spec.electric.systemPowerKw,
    };
  }

  // Reuse existing engine labels, including entries whose spec description only names the engine family.
  const description = `${e.description} ${findEntry(spec.id)?.engineLabel ?? ''}`;
  const layout = description.match(/\b(flat|boxer|inline|[ivw])[- ]?(\d{1,2})\b/i);
  const cylinders = Number(layout?.[2] ?? 4);
  const boxer = /flat|boxer/i.test(layout?.[1] ?? '');
  const crossPlaneV8 = cylinders === 8 && layout?.[1].toLowerCase() === 'v' && !/flat-plane/i.test(description);
  const turboCount = e.aspiration === 'na' || e.aspiration === 'supercharged' || virtual
    ? 0
    : /quad-turbo/i.test(description) ? 4 : e.aspiration === 'twin-turbo' ? 2 : 1;
  return {
    cylinders,
    unevenPulses: crossPlaneV8 ? 0.55 : boxer && cylinders === 4 ? 0.28 : cylinders === 5 ? 0.18 : 0.045,
    exhaustResonanceHz: 235 / Math.sqrt(Math.max(1, e.displacementCc / 2000)),
    idleRpm: virtual?.idleRpm ?? e.idleRpm,
    maxRpm: virtual?.revLimitRpm ?? e.revLimitRpm,
    turboCount,
    supercharged: !virtual && (e.aspiration === 'supercharged' || /supercharged/i.test(description)),
    transmission: virtual ? 'dual-clutch' : spec.transmission.type,
    shiftTimeS: virtual?.upshiftTimeS ?? spec.transmission.upshiftTimeS,
    motorCount: 0,
    motorPowerKw: 0,
  };
}
