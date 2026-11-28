import { describe, expect, it } from 'vitest';
import { PLAYABLE } from '../data/catalog';
import { lexusIs200t2016Tw } from '../data/vehicles';
import { soundProfile } from './profile';
import { soundTargets } from './voice';

const frame = { rpm: 4200, throttle: 0.9, boostBar: 0.9, gear: 2, powerKw: 120 };

describe('powertrain sound', () => {
  it.each(PLAYABLE.map((spec) => [spec.id, spec] as const))('has finite, audible output under load for %s', (_id, spec) => {
    const profile = soundProfile(spec);
    const targets = soundTargets(profile, frame, false, 0);
    expect(Object.values(targets).every(Number.isFinite)).toBe(true);
    expect(targets.bodyGain).toBeGreaterThan(0.1);
    expect(profile.cylinders === 0).toBe(Boolean(spec.electric));
  });

  it('uses combustion cycle speed and responds to load, fuel cut and gearbox type', () => {
    const profile = soundProfile(lexusIs200t2016Tw);
    const atLoad = soundTargets(profile, frame, false, 0);
    expect(atLoad.frequency).toBe(frame.rpm / 120);
    expect(soundTargets(profile, { ...frame, throttle: 0 }, false, 0).bodyGain).toBeLessThan(atLoad.bodyGain);
    expect(soundTargets(profile, { ...frame, fuelCut: true }, false, 0).bodyGain).toBeLessThan(atLoad.bodyGain);
    const autoShift = soundTargets(profile, frame, true, 0).bodyGain;
    expect(soundTargets({ ...profile, transmission: 'manual' }, frame, true, 0).bodyGain).toBeLessThan(autoShift);
    expect(soundTargets({ ...profile, transmission: 'cvt' }, frame, true, 0).bodyGain).toBe(atLoad.bodyGain);
  });

  it('keeps the electric motor silent at rest and supports the Ioniq virtual gearbox', () => {
    const spec = PLAYABLE.find((car) => car.electric?.virtualShift)!;
    const profile = soundProfile(spec);
    expect(soundTargets(profile, { ...frame, rpm: 0, throttle: 0, powerKw: 0 }, false, 0).bodyGain).toBe(0);
    expect(soundProfile(spec, true)).toMatchObject({ cylinders: 4, transmission: 'dual-clutch' });
  });

  it('identifies distinct cylinder counts and intake types from the catalog', () => {
    const profiles = PLAYABLE.map((spec) => soundProfile(spec));
    expect([...new Set(profiles.map((p) => p.cylinders))].sort((a, b) => a - b)).toEqual([0, 3, 4, 5, 6, 8, 10, 12, 16]);
    expect(profiles.some((p) => p.turboCount === 4)).toBe(true);
    expect(profiles.some((p) => p.supercharged && p.turboCount > 0)).toBe(true);
    const supercharged = profiles.find((p) => p.supercharged && p.turboCount === 0)!;
    expect(soundTargets(supercharged, frame, false, 0).whineGain).toBeGreaterThan(0);
  });
});
