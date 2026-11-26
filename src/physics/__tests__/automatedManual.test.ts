import { describe, expect, it } from 'vitest';
import type { VehicleSpec } from '../../data/types';
import { VehicleSimulator } from '../simulator';
import { runAccelerationRun } from '../runners';
import { msToKmh } from '../units';
import { VEHICLES, sim, skoda } from '../../test-helpers';

/** The owner's dual-clutch Škoda with its gearbox switched to a single-clutch automated manual. */
const asAmt = (spec: VehicleSpec): VehicleSpec => ({
  ...spec,
  transmission: {
    ...spec.transmission,
    type: 'automated-manual',
    shiftProfile: undefined,
    launchClutch: spec.transmission.launchClutch ? { ...spec.transmission.launchClutch, creep: undefined } : undefined,
  },
});

/** Acceleration samples taken in the middle half of each full-throttle upshift. */
function midShiftAccel(spec: VehicleSpec): number[] {
  const s = new VehicleSimulator(sim(spec), 'auto');
  const out: number[] = [];
  for (let i = 0; i < 12000 && msToKmh(s.state.speed) < 180; i++) {
    s.step(0.001, { throttle: 1, brake: 0 });
    const sh = s.state.shift;
    if (sh && s.state.gear >= 3 && sh.elapsed / sh.duration > 0.25 && sh.elapsed / sh.duration < 0.75) out.push(s.state.accel);
  }
  return out;
}

describe('single-clutch automated manual (AMT / ASG)', () => {
  const dct = skoda;
  const amt = asAmt(skoda);

  it('builds as a TCU-clutch gearbox with clutch-open shifts and no idle creep', () => {
    const v = sim(amt);
    expect(v.transmission.type).toBe('automated-manual');
    expect(v.transmission.shiftProfile).toBe('interrupt');
    expect(v.transmission.launchClutch?.creep).toBe(false);
    expect(v.transmission.launchClutch?.driverEngageS).toBe(0);
    expect(sim(dct).transmission.shiftProfile).toBe('blend');
  });

  it('holds still at idle off the brake (the single clutch stays open)', () => {
    const s = new VehicleSimulator(sim(amt));
    s.advance(4, { throttle: 0, brake: 0 });
    expect(msToKmh(s.state.speed)).toBeLessThan(0.5);
  });

  it('launches by slipping its clutch under TCU control, then locks it', () => {
    const s = new VehicleSimulator(sim(amt));
    s.advance(0.15, { throttle: 1, brake: 0 });
    expect(s.state.coupling).toBe('slipping');
    expect(s.state.engineRpm).toBeGreaterThan(sim(amt).engine.idleRpm * 1.5);
    s.advance(3, { throttle: 1, brake: 0 });
    expect(s.state.coupling).toBe('locked');
    expect(msToKmh(s.state.speed)).toBeGreaterThan(60);
  });

  it('cuts drive torque for the whole shift, unlike a dual-clutch handover', () => {
    const amtMid = midShiftAccel(amt);
    const dctMid = midShiftAccel(dct);
    expect(amtMid.length).toBeGreaterThan(20);
    expect(dctMid.length).toBeGreaterThan(5);
    // With the clutch open the car only decelerates (drag + rolling resistance).
    expect(Math.max(...amtMid)).toBeLessThan(0);
    expect(Math.min(...dctMid)).toBeGreaterThan(0);
  });

  it('reports the clutch open through the shift envelope and closed again after re-engagement', () => {
    const lfa = VEHICLES.find((x) => x.transmission.type === 'automated-manual')!;
    const s = new VehicleSimulator(sim(lfa), 'auto');
    let seen = false;
    for (let i = 0; i < 20000 && !seen; i++) {
      s.step(0.001, { throttle: 1, brake: 0 });
      const sh = s.state.shift;
      if (sh && sh.from === 2 && sh.to === 3 && Math.abs(sh.elapsed - sh.duration / 2) < 0.0006) {
        seen = true;
        // Mid-shift (0.100 s of the 0.2 s 2→3 upshift): torque interrupted, clutch indicated open.
        expect(s.state.clutchOpen).toBe(true);
        expect(s.state.accel).toBeLessThan(0);
      }
    }
    expect(seen).toBe(true);
    s.advance(0.15, { throttle: 1, brake: 0 });
    expect(s.state.shift).toBeNull();
    expect(s.state.clutchOpen).toBe(false);
    expect(s.state.coupling).toBe('locked');
  });

  it('never reports a dual-clutch or converter car with its clutch open', () => {
    for (const spec of VEHICLES.filter((x) => x.transmission.type === 'dual-clutch' || x.transmission.type === 'torque-converter-automatic').slice(0, 6)) {
      const s = new VehicleSimulator(sim(spec), 'auto');
      for (let i = 0; i < 8000; i++) {
        s.step(0.001, { throttle: 1, brake: 0 });
        expect(s.state.clutchOpen).toBe(false);
      }
    }
  });

  it('is slower than the same car with a dual-clutch box, but still completes every split', () => {
    const a = runAccelerationRun(sim(amt), { launch: 'brake-boost' }).metrics;
    const d = runAccelerationRun(sim(dct), { launch: 'brake-boost' }).metrics;
    expect(a.zeroTo100KmhS).not.toBeNull();
    expect(a.quarterMileS!).toBeGreaterThan(d.quarterMileS!);
    expect(a.quarterMileS! - d.quarterMileS!).toBeLessThan(1);
  });

  it('applies to every automated-manual car in the catalog', () => {
    for (const v of VEHICLES.filter((x) => x.transmission.type === 'automated-manual')) {
      const s = sim(v);
      expect(s.transmission.shiftProfile).toBe('interrupt');
      expect(runAccelerationRun(s, { launch: 'brake-boost' }).metrics.quarterMileS).not.toBeNull();
    }
  });
});
