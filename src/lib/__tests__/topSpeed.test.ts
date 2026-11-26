import { describe, expect, it } from 'vitest';
import { getEntry } from '../../data/catalog';
import { Curve } from '../../physics/curve';
import { TOP_SPEED_TIE_KMH, theoreticalTopSpeedKmh, topSpeedBreakdown } from '../../physics/dyno';
import { aeroDragN, rollingResistanceN } from '../../physics/forces';
import type { SimVehicle } from '../../physics/types';
import { kmhToMs } from '../../physics/units';
import { buildSimVehicle } from '../../tuning/buildSimVehicle';
import { defaultTuning } from '../../tuning/tuning';
import { lexus, sim } from '../../test-helpers';
import { topSpeedText } from '../topSpeed';

const stock = (id: string) => {
  const spec = getEntry(id).sim!;
  return buildSimVehicle(spec, defaultTuning(spec));
};

/** A test car with a flat torque curve and the given overall ratios (no limiter). */
const flatCar = (ratios: number[], torqueNm = 400, revLimitRpm = 7000): SimVehicle => {
  const base = sim(lexus);
  return {
    ...base,
    speedLimitMs: null,
    engine: { ...base.engine, revLimitRpm, torque: new Curve([[500, torqueNm], [revLimitRpm, torqueNm]]) },
    transmission: { ...base.transmission, overallRatios: ratios },
  };
};
const wheelForce = (v: SimVehicle, ratio: number) => (v.engine.torque.at(v.engine.revLimitRpm) * ratio * v.drivetrain.efficiency) / v.wheelRadiusM;
const roadLoad = (v: SimVehicle, kmh: number) => aeroDragN(v, kmhToMs(kmh)) + rollingResistanceN(v, kmhToMs(kmh));
const cutKmh = (v: SimVehicle, ratio: number) => ((v.engine.revLimitRpm * 2 * Math.PI * v.wheelRadiusM) / (60 * ratio)) * 3.6;
/** Speed where a constant wheel force meets the road load. */
const crossingKmh = (v: SimVehicle, force: number) => {
  let lo = 1, hi = 600;
  for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (roadLoad(v, m) < force) lo = m; else hi = m; }
  return lo;
};
/** The single-gear ratio whose rev cut lands `offsetKmh` above (or below) its own drag crossing. */
const ratioWithCutOffset = (offsetKmh: number) => {
  let lo = 0.5, hi = 6;
  for (let i = 0; i < 80; i++) {
    const r = (lo + hi) / 2;
    const v = flatCar([r]);
    const gap = cutKmh(v, r) - crossingKmh(v, wheelForce(v, r));
    if (gap > offsetKmh) lo = r; else hi = r;
  }
  return (lo + hi) / 2;
};

describe('top speed boundary and binding constraint', () => {
  it('calls drag when the force crossing comes just before the rev cut (not the next grid sample)', () => {
    const r = ratioWithCutOffset(0.2);
    const v = flatCar([r]);
    const t = topSpeedBreakdown(v);
    expect(t.binding).toBe('drag');
    expect(t.tiedWith).toBeNull();
    expect(t.unlimitedKmh).toBeCloseTo(crossingKmh(v, wheelForce(v, r)), 1);
    expect(cutKmh(v, r) - t.unlimitedKmh).toBeGreaterThan(TOP_SPEED_TIE_KMH);
    expect(topSpeedText(t)).toMatch(/drag-limited in top gear/);
  });

  it('calls the rev cut when the gear runs out of revs while still out-pulling the road load', () => {
    const r = ratioWithCutOffset(-0.3);
    const v = flatCar([r]);
    const t = topSpeedBreakdown(v);
    expect(t.binding).toBe('rev-limit');
    expect(t.tiedWith).toBeNull();
    expect(t.unlimitedKmh).toBeCloseTo(cutKmh(v, r), 1);
  });

  it('reports a rev-cut/drag tie when the two fall within the tie tolerance', () => {
    const t = topSpeedBreakdown(flatCar([ratioWithCutOffset(0.03)]));
    expect(t.tiedWith).not.toBeNull();
    expect(topSpeedText(t)).toMatch(/rev cut and drag coincide in top gear/);
  });

  it('names a lower gear when a stretched top gear cannot pull past its rev cut', () => {
    // 2nd is so tall it never out-pulls the road load beyond 1st's cut speed.
    const v = flatCar([3.0, 0.55]);
    const t = topSpeedBreakdown(v);
    expect(t.binding).toBe('rev-limit');
    expect(t.gear).toBe(1);
    expect(t.gearCount).toBe(2);
    expect(t.unlimitedKmh).toBeCloseTo(cutKmh(v, 3.0), 1);
    expect(topSpeedText(t)).toMatch(/rev-limited in 1st gear \(2nd cannot pull past it\)/);
  });

  it('reports a near-equal limiter as a tie instead of a rounded-equal "below" claim', () => {
    const v = sim(lexus);
    const unlimited = theoreticalTopSpeedKmh({ ...v, speedLimitMs: null });
    const t = topSpeedBreakdown({ ...v, speedLimitMs: kmhToMs(unlimited + 0.04) });
    expect(t.tiedWith).toBe('limiter');
    expect(topSpeedText(t)).toMatch(/^≈ .* limiter and the force\/gearing limit coincide/);
    const apart = topSpeedBreakdown({ ...v, speedLimitMs: kmhToMs(unlimited + 0.3) });
    expect(apart.tiedWith).toBeNull();
    expect(apart.binding).not.toBe('limiter');
    const [speed, cap] = topSpeedText(apart).match(/[\d.,]+(?= km\/h)/g)!;
    expect(speed).not.toBe(cap);
  });

  it('stops at a force dip narrower than the 0.5 km/h scan even when force recovers after it (Codex repro)', () => {
    const base = flatCar([2.0]);
    const r = base.wheelRadiusM;
    const rpmOf = (kmh: number) => ((kmhToMs(kmh) / r) * 2.0 * 60) / (2 * Math.PI);
    const startKmh = ((base.engine.idleRpm * 1.001 * 2 * Math.PI * r) / (60 * 2.0)) * 3.6;
    const c = startKmh + 82.25;
    const torque = new Curve(
      [[500, 400], [rpmOf(c - 0.1), 400], [rpmOf(c), 0], [rpmOf(c + 0.1), 400], [7000, 400]],
      65536,
    );
    const v: SimVehicle = { ...base, engine: { ...base.engine, torque } };
    // The dip is real (net force negative at its centre) and force recovers after it.
    expect(wheelForce({ ...v, engine: { ...v.engine, torque: new Curve([[500, 0], [7000, 0]]) } }, 2.0)).toBe(0);
    expect((torque.at(rpmOf(c)) * 2.0 * v.drivetrain.efficiency) / r - roadLoad(v, c)).toBeLessThan(0);
    expect((torque.at(rpmOf(c + 0.5)) * 2.0 * v.drivetrain.efficiency) / r - roadLoad(v, c + 0.5)).toBeGreaterThan(0);
    const t = topSpeedBreakdown(v);
    expect(t.unlimitedKmh).toBeGreaterThan(c - 0.1);
    expect(t.unlimitedKmh).toBeLessThan(c);
    expect(t.binding).toBe('drag');
  });

  it('stops at a gear-change gap even when the next gear pulls again higher up', () => {
    // Torque that climbs steeply with rpm: 2nd is too weak just past 1st's cut but recovers later.
    // 1st cuts at 7,000 rpm where 2nd turns only 5,600 rpm (300 Nm, too weak there); 2nd reaches 900 Nm from 6,400 rpm.
    const base = flatCar([3.0, 2.4]);
    const torque = new Curve([[500, 300], [5800, 300], [6400, 900], [7000, 900]]);
    const v: SimVehicle = { ...base, engine: { ...base.engine, torque } };
    const cut1 = cutKmh(v, 3.0);
    const net2 = (kmh: number) => (torque.at(((kmhToMs(kmh) / v.wheelRadiusM) * 2.4 * 60) / (2 * Math.PI)) * 2.4 * v.drivetrain.efficiency) / v.wheelRadiusM - roadLoad(v, kmh);
    expect(net2(cut1 + 0.01)).toBeLessThan(0);
    const later = [cut1 + 30, cut1 + 40, cut1 + 50].some((k) => net2(k) > 0);
    expect(later).toBe(true);
    const t = topSpeedBreakdown(v);
    expect(t.unlimitedKmh).toBeCloseTo(cut1, 1);
    expect(t.binding).toBe('rev-limit');
    expect(t.gear).toBe(1);
  });

  it('holds a binding limiter (Chiron Super Sport)', () => {
    const t = topSpeedBreakdown(stock('2022-bugatti-chiron-super-sport-us-coupe-awd-7dct'));
    expect(t.binding).toBe('limiter');
    expect(t.kmh).toBeCloseTo(380, 6);
    expect(t.unlimitedKmh).toBeGreaterThan(380);
    expect(topSpeedText(t)).toMatch(/^380 km\/h · held by the modelled 380 km\/h limiter/);
  });

  it.each([
    ['2022-volkswagen-golf-gti-autobahn-us-hatch-fwd-7dct', 250],
    ['2018-nissan-gt-r-track-edition-us-coupe-awd-6dct', 315],
  ])('does not call a configured limiter binding when the car cannot reach it (%s)', (id, cap) => {
    const t = topSpeedBreakdown(stock(id));
    expect(t.limiterKmh).toBeCloseTo(cap, 6);
    expect(t.unlimitedKmh).toBeLessThan(cap - TOP_SPEED_TIE_KMH);
    expect(t.binding).not.toBe('limiter');
    expect(t.kmh).toBe(t.unlimitedKmh);
    expect(topSpeedText(t)).toMatch(new RegExp(`below the modelled ${cap}(\\.0)? km/h limiter, which is never reached$`));
  });

  it('labels a car with no modelled limiter as an uncapped prediction (Nissan Z)', () => {
    const t = topSpeedBreakdown(stock('2023-nissan-z-performance-9at-us-coupe-rwd-9at'));
    expect(t.limiterKmh).toBeNull();
    expect(topSpeedText(t)).toMatch(/uncapped prediction, .* \(no limiter modelled\); not a published or governed figure$/);
  });
});
