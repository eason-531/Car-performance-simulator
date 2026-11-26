import { describe, expect, it } from 'vitest';
import { VEHICLES, sim } from '../../test-helpers';
import { runAccelerationRun } from '../runners';
import { VehicleSimulator } from '../simulator';
import { kmhToMs, msToKmh } from '../units';

const civic = VEHICLES.find((v) => v.id === '2022-honda-civic-sport-touring-1-5t-us-hatch-fwd-cvt')!;
const FULL = { throttle: 1, brake: 0 };

describe('belt CVT with torque converter and Step Shift (Honda LL-CVT)', () => {
  it('builds as a CVT behind a converter with seven simulated steps inside the published span', () => {
    const v = sim(civic);
    const c = v.transmission.cvt!;
    expect(v.transmission.type).toBe('cvt');
    expect(v.transmission.torqueConverter).toBeDefined();
    expect(c.ratioLow).toBe(2.645);
    expect(c.ratioHigh).toBe(0.405);
    expect(v.transmission.finalDrive[0]).toBe(4.81);
    expect(v.transmission.gearRatios).toHaveLength(7);
    expect(v.transmission.gearRatios[0]).toBe(c.ratioLow);
    for (const r of v.transmission.gearRatios) expect(r).toBeGreaterThanOrEqual(c.ratioHigh);
  });

  it('launches on the converter, locks up, and steps up at full throttle with the ratio inside its span', () => {
    const v = sim(civic);
    const c = v.transmission.cvt!;
    const s = new VehicleSimulator(v, 'auto');
    let lockKmh: number | null = null;
    let drops = 0;
    let prevRpm = s.state.engineRpm;
    let peakSinceDrop = 0;
    let prevRatio = s.state.cvtRatio;
    for (let i = 0; i < 40000 && msToKmh(s.state.speed) < 160; i++) {
      s.step(0.001, FULL);
      const st = s.state;
      expect(st.cvtRatio).toBeLessThanOrEqual(c.ratioLow + 1e-9);
      expect(st.cvtRatio).toBeGreaterThanOrEqual(c.ratioHigh - 1e-9);
      expect(st.cvtRatio).toBeLessThanOrEqual(prevRatio + 1e-9); // never shortens under full throttle
      prevRatio = st.cvtRatio;
      if (lockKmh === null && st.coupling === 'locked') lockKmh = msToKmh(st.speed);
      peakSinceDrop = Math.max(peakSinceDrop, st.engineRpm);
      if (peakSinceDrop - st.engineRpm > 600) {
        drops++;
        peakSinceDrop = st.engineRpm;
      }
      expect(st.engineRpm).toBeLessThan(6700);
      prevRpm = st.engineRpm;
    }
    expect(prevRpm).toBeGreaterThan(0);
    expect(lockKmh).not.toBeNull();
    expect(lockKmh!).toBeLessThan(40);
    expect(drops).toBeGreaterThanOrEqual(4);
    // Past the last step the program holds the hold rpm.
    expect(Math.abs(s.state.engineRpm - c.holdRpm)).toBeLessThan(200);
    expect(s.state.gear).toBe(7);
  });

  it('cruises at low rpm toward overdrive on light throttle, kicks down at full throttle and drops revs for braking', () => {
    const v = sim(civic);
    const s = new VehicleSimulator(v, 'auto');
    s.state.speed = kmhToMs(100);
    s.state.cvtRatio = 1.0;
    s.state.coupling = 'locked';
    s.advance(6, { throttle: 0.15, brake: 0 });
    expect(s.state.engineRpm).toBeLessThan(2500);
    const cruise = s.state.cvtRatio;
    expect(cruise).toBeLessThan(0.8);
    s.advance(0.6, FULL);
    expect(s.state.cvtRatio).toBeGreaterThan(cruise);
    expect(s.state.engineRpm).toBeGreaterThan(5000);
    const b = new VehicleSimulator(v, 'auto');
    b.state.speed = kmhToMs(80);
    b.state.cvtRatio = 0.6;
    b.state.coupling = 'locked';
    b.advance(1.5, { throttle: 0, brake: 0.4 });
    expect(b.state.engineRpm).toBeGreaterThan(1800);
  });

  it('paddles select the simulated steps', () => {
    const v = sim(civic);
    const s = new VehicleSimulator(v, 'manual');
    s.advance(3, FULL);
    const g = s.state.gear;
    expect(s.requestShift(1).ok).toBe(true);
    expect(s.state.gear).toBe(g + 1);
    s.advance(0.5, FULL);
    expect(s.state.cvtRatio).toBeCloseTo(v.transmission.gearRatios[g], 2);
    expect(s.requestShift(-1).ok || s.requestShift(-1).reason === 'Over-rev protection').toBe(true);
  });

  it('runs the standard tests deterministically', () => {
    const a = runAccelerationRun(sim(civic), { targetSpeedKmh: 100 });
    const b = runAccelerationRun(sim(civic), { targetSpeedKmh: 100 });
    expect(a.metrics.zeroTo100KmhS).toBe(b.metrics.zeroTo100KmhS);
    expect(a.metrics.zeroTo100KmhS).toBeGreaterThan(7);
    expect(a.metrics.zeroTo100KmhS).toBeLessThan(9);
  });
});
