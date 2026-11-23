import { describe, expect, it } from 'vitest';
import { TIRE_COMPOUNDS, getTireCompound } from '../tires';
import { VEHICLES, findVehicle, getVehicle } from '../vehicles';
import { Curve } from '../../physics/curve';
import { powerPs } from '../../physics/units';

describe('vehicle registry', () => {
  it('keeps the owner cars first with their original ids and colour slots', () => {
    expect(VEHICLES.slice(0, 2).map((v) => v.id)).toEqual(['lexus-is200t-2016-tw', 'skoda-superb-combi-lk-280']);
    expect(VEHICLES[0].colorSlot).toBe(0);
    expect(VEHICLES[1].colorSlot).toBe(1);
  });

  it('has unique ids, and only the owner cars hold a home colour slot', () => {
    expect(new Set(VEHICLES.map((v) => v.id)).size).toBe(VEHICLES.length);
    expect(VEHICLES.filter((v) => v.colorSlot !== undefined)).toHaveLength(2);
  });

  it('looks vehicles up by id', () => {
    expect(getVehicle('lexus-is200t-2016-tw').make).toBe('Lexus');
    expect(findVehicle('nope')).toBeUndefined();
    expect(() => getVehicle('nope')).toThrow();
  });
});

describe.each(VEHICLES.map((v) => [v.shortName, v] as const))('%s data', (_name, v) => {
  it('has a valid gearbox', () => {
    const t = v.transmission;
    expect(t.gearRatios.length).toBeGreaterThanOrEqual(5);
    expect(t.finalDrive).toHaveLength(t.gearRatios.length);
    const overall = t.gearRatios.map((g, i) => g * t.finalDrive[i]);
    for (let i = 1; i < overall.length; i++) expect(overall[i]).toBeLessThan(overall[i - 1]);
    expect(t.upshiftTimeS).toBeGreaterThan(0);
    expect(t.shiftTorqueDip).toBeGreaterThanOrEqual(0);
    expect(t.shiftTorqueDip).toBeLessThan(1);
    if (t.type === 'torque-converter-automatic') expect(t.torqueConverter).toBeDefined();
    if (t.type === 'dual-clutch') expect(t.launchClutch).toBeDefined();
  });

  it('has a torque curve covering idle to the rev limit that matches the rated figures', () => {
    const e = v.engine;
    const c = new Curve(e.torqueCurveNm);
    expect(c.xMin).toBeLessThanOrEqual(e.idleRpm);
    expect(c.xMax).toBeGreaterThanOrEqual(e.revLimitRpm);
    expect(e.redlineRpm).toBeLessThanOrEqual(e.revLimitRpm);
    expect(e.idleRpm).toBeLessThan(1000);
    const [tLo, tHi] = e.rated.torqueRpm;
    expect(c.at(tLo)).toBeCloseTo(e.rated.torqueNm, 0);
    expect(c.at(tHi)).toBeCloseTo(e.rated.torqueNm, 0);
    const [pLo, pHi] = e.rated.powerRpm;
    for (const rpm of [pLo, pHi]) {
      // Published bands are rounded: e.g. 553 lb-ft at 5,600 rpm is 1.7 % short of 600 hp.
      expect(Math.abs(powerPs(c.at(rpm), rpm) - e.rated.powerPs) / e.rated.powerPs).toBeLessThan(0.02);
    }
    for (const [rpm, nm] of e.torqueCurveNm) {
      expect(nm).toBeLessThanOrEqual(e.rated.torqueNm + 0.05);
      // Never exceed the published peak power either.
      expect(powerPs(nm, rpm)).toBeLessThanOrEqual(e.rated.powerPs * 1.002 + 0.1);
    }
  });

  it('has valid boost and spool data', () => {
    const boost = new Curve(v.engine.boostCurveBar);
    expect(boost.at(3000)).toBeGreaterThanOrEqual(0);
    expect(boost.at(3000)).toBeLessThan(2.5);
    for (const [, tau] of v.engine.spoolTimeConstantS) expect(tau).toBeGreaterThan(0);
  });

  it('has plausible chassis and aero values', () => {
    const c = v.chassis;
    expect(c.curbMassKg).toBeGreaterThan(900);
    expect(c.curbMassKg).toBeLessThan(3200);
    expect(c.frontWeightFraction).toBeGreaterThan(0.35); // rear-engine 911s sit near 0.39
    expect(c.frontWeightFraction).toBeLessThan(0.7);
    expect(v.aero.dragCoefficient).toBeGreaterThan(0.2);
    expect(v.aero.dragCoefficient).toBeLessThan(0.6);
    expect(v.aero.frontalAreaM2).toBeGreaterThan(1.6);
    expect(v.aero.frontalAreaM2).toBeLessThan(3.8);
    expect(v.drivetrain.efficiency).toBeGreaterThan(0.75);
    expect(v.drivetrain.efficiency).toBeLessThan(0.95);
  });

  it('references valid default tires', () => {
    expect(v.tires.sizes.some((s) => s.id === v.tires.defaultSizeId)).toBe(true);
    expect(TIRE_COMPOUNDS.some((c) => c.id === v.tires.defaultCompoundId)).toBe(true);
    expect(new Set(v.tires.sizes.map((s) => s.id)).size).toBe(v.tires.sizes.length);
  });

  it('documents provenance and clearly flags estimates', () => {
    const statuses = new Set(v.provenance.map((p) => p.status));
    // Every car needs sourced (verified or reported) data, and estimates must be declared.
    expect(statuses.has('verified') || statuses.has('reported')).toBe(true);
    expect(statuses.has('estimated')).toBe(true);
    for (const p of v.provenance) if (p.status !== 'estimated' && p.url) expect(p.url).toMatch(/^https:\/\//);
    for (const p of v.provenance) {
      expect(['verified', 'reported', 'estimated']).toContain(p.status);
      expect(p.parameter.length).toBeGreaterThan(0);
      expect(p.source.length).toBeGreaterThan(0);
    }
    const params = v.provenance.map((p) => p.parameter);
    for (const required of ['Peak power', 'Peak torque', 'Gear ratios', 'Curb mass', 'Drag coefficient']) {
      expect(params).toContain(required);
    }
  });

  it('only offers a Stage 1 tune that adds power', () => {
    if (!v.stage1) return;
    expect(v.stage1.claimedPowerPs).toBeGreaterThan(v.engine.rated.powerPs);
    for (const [, k] of v.stage1.torqueMultiplier) expect(k).toBeGreaterThanOrEqual(1);
  });
});

describe('vehicle-specific facts', () => {
  it('Lexus IS200t: 8AR-FTS, RWD, 8-speed, 245 PS / 350 Nm', () => {
    const v = getVehicle('lexus-is200t-2016-tw');
    expect(v.engine.code).toBe('8AR-FTS');
    expect(v.drivetrain.layout).toBe('RWD');
    expect(v.transmission.gearRatios).toEqual([4.596, 2.724, 1.863, 1.464, 1.231, 1.0, 0.824, 0.685]);
    expect(v.engine.rated.powerPs).toBe(245);
    expect(v.engine.rated.torqueNm).toBe(350);
    expect(v.market).toBe('Taiwan');
  });

  it('Škoda Superb 280: EA888, AWD, 6-speed DSG, 280 PS / 350 Nm', () => {
    const v = getVehicle('skoda-superb-combi-lk-280');
    expect(v.engine.code).toMatch(/EA888/);
    expect(v.drivetrain.layout).toBe('AWD');
    expect(v.transmission.type).toBe('dual-clutch');
    expect(v.transmission.gearRatios).toHaveLength(6);
    expect(v.engine.rated.powerPs).toBe(280);
    expect(v.engine.rated.torqueNm).toBe(350);
  });

  it('falls back to the OE compound for unknown tire ids', () => {
    expect(getTireCompound('does-not-exist').id).toBe('oe-performance');
  });
});
