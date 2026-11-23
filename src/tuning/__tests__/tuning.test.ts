import { describe, expect, it } from 'vitest';
import { buildSimVehicle, tireRollingRadiusM } from '../buildSimVehicle';
import { defaultTuning, describeTuning, isStock, sanitizeTuning } from '../tuning';
import { DRIVER_MASS_KG } from '../../physics/constants';
import { lexus, skoda } from '../../test-helpers';

describe('tuning config', () => {
  it('defaults to stock', () => {
    const t = defaultTuning(lexus);
    expect(isStock(lexus, t)).toBe(true);
    expect(describeTuning(lexus, t)).toBe('Stock');
    expect(t.speedLimiter).toBe(true);
  });

  it('describes modifications', () => {
    const t = { ...defaultTuning(skoda), ecuStage: 'stage1' as const, weightDeltaKg: 80, tireCompoundId: 'uhp' };
    expect(isStock(skoda, t)).toBe(false);
    const label = describeTuning(skoda, t);
    expect(label).toContain('Stage 1');
    expect(label).toContain('+80 kg');
    expect(label).toContain('Ultra-high-performance');
  });

  it('sanitizes untrusted input', () => {
    expect(sanitizeTuning(lexus, null)).toEqual(defaultTuning(lexus));
    expect(sanitizeTuning(lexus, 'garbage')).toEqual(defaultTuning(lexus));
    const t = sanitizeTuning(lexus, {
      ecuStage: 'stage9',
      powerAdjustPct: 1000,
      weightDeltaKg: -9999,
      tireSizeId: 'unknown',
      tireCompoundId: 'uhp',
      speedLimiter: false,
      overrides: { dragCoefficient: 0.01, frontalAreaM2: 'x', drivetrainEfficiency: 0.9 },
    });
    expect(t.ecuStage).toBe('stock');
    expect(t.powerAdjustPct).toBe(50);
    expect(t.weightDeltaKg).toBe(-200);
    expect(t.tireSizeId).toBe(lexus.tires.defaultSizeId);
    expect(t.tireCompoundId).toBe('uhp');
    expect(t.speedLimiter).toBe(false);
    expect(t.overrides).toEqual({ dragCoefficient: 0.2, frontalAreaM2: null, drivetrainEfficiency: 0.9 });
  });
});

describe('buildSimVehicle', () => {
  it('computes tire rolling radius', () => {
    // 225/45 R17: 215.9 + 101.25 = 317.15 mm unloaded
    expect(tireRollingRadiusM({ widthMm: 225, aspectPct: 45, rimIn: 17 })).toBeCloseTo(0.31715 * 0.97, 5);
  });

  it('adds the driver and weight delta to the curb mass', () => {
    const v = buildSimVehicle(lexus, { ...defaultTuning(lexus), weightDeltaKg: 100 });
    expect(v.massKg).toBe(lexus.chassis.curbMassKg + DRIVER_MASS_KG + 100);
  });

  it('applies Stage 1 and power adjustment to the torque curve and boost', () => {
    const stock = buildSimVehicle(skoda);
    const tuned = buildSimVehicle(skoda, { ...defaultTuning(skoda), ecuStage: 'stage1', powerAdjustPct: 5 });
    expect(tuned.engine.torque.at(3000)).toBeGreaterThan(stock.engine.torque.at(3000) * 1.3);
    expect(tuned.engine.boost.at(3000)).toBeGreaterThan(stock.engine.boost.at(3000));
  });

  it('applies overrides and the limiter switch', () => {
    const v = buildSimVehicle(lexus, {
      ...defaultTuning(lexus),
      speedLimiter: false,
      overrides: { dragCoefficient: 0.3, frontalAreaM2: 2.0, drivetrainEfficiency: 0.8 },
    });
    expect(v.dragAreaM2).toBeCloseTo(0.6, 9);
    expect(v.drivetrain.efficiency).toBe(0.8);
    expect(v.speedLimitMs).toBeNull();
    expect(buildSimVehicle(lexus).speedLimitMs).toBeCloseTo(230 / 3.6, 9);
  });

  it('uses the rear tire for a staggered RWD setup', () => {
    const v = buildSimVehicle(lexus, { ...defaultTuning(lexus), tireSizeId: 'fsport' });
    expect(v.wheelRadiusM).toBeCloseTo(tireRollingRadiusM({ widthMm: 255, aspectPct: 35, rimIn: 18 }), 9);
    expect(v.tireMu).toBeGreaterThan(buildSimVehicle(lexus).tireMu);
  });

  it('sizes the torque converter on the stock engine so tunes raise stall speed', () => {
    const stock = buildSimVehicle(lexus).transmission.torqueConverter!;
    const tuned = buildSimVehicle(lexus, { ...defaultTuning(lexus), ecuStage: 'stage1' }).transmission.torqueConverter!;
    expect(tuned.capacityAtStall).toBeCloseTo(stock.capacityAtStall, 12);
  });
});
