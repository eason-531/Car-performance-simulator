import { describe, expect, it } from 'vitest';
import { findEntry } from '../../data/catalog';
import type { VehicleSpec } from '../../data/types';
import { sim } from '../../test-helpers';
import { runAccelerationRun } from '../runners';
import { VehicleSimulator } from '../simulator';
import { msToKmh, rpmToRadS } from '../units';

const spec = (id: string) => findEntry(id)!.sim! as VehicleSpec;
const M5 = '2025-bmw-m5-touring-us-wagon-awd-8at';
const NSX = '2017-acura-nsx-us-coupe-awd-9dct';
const V60 = '2020-volvo-v60-t8-polestar-engineered-us-wagon-awd-8at';
const withoutHybrid = (s: VehicleSpec): VehicleSpec => ({ ...s, hybrid: undefined });

describe('hybrid drive on the engine path', () => {
  it('adds the motors to the engine and makes the car quicker', () => {
    for (const id of [M5, NSX, V60]) {
      const hy = runAccelerationRun(sim(spec(id)), { launch: 'brake-boost' });
      const ice = runAccelerationRun(sim(withoutHybrid(spec(id))), { launch: 'brake-boost' });
      expect(hy.metrics.quarterMileS!).toBeLessThan(ice.metrics.quarterMileS! - 0.1);
    }
  });

  it('holds motor output to the battery limit and engine + motors to the system rating', () => {
    for (const id of [M5, NSX, V60]) {
      const v = sim(spec(id));
      const h = v.hybrid!;
      const s = new VehicleSimulator(v);
      let maxMotor = 0;
      for (let i = 0; i < 20000 && msToKmh(s.state.speed) < 200; i++) {
        s.step(0.001, { throttle: 1, brake: 0 });
        maxMotor = Math.max(maxMotor, s.state.motorPowerKw);
        const engineW = Math.max(0, s.state.engineTorqueNm) * rpmToRadS(s.state.engineRpm);
        expect(s.state.motorPowerKw * 1000).toBeLessThanOrEqual(h.batteryPowerW + 1);
        expect(engineW + s.state.motorPowerKw * 1000).toBeLessThanOrEqual(Math.max(h.systemPowerW, engineW) * 1.001 + 1);
      }
      expect(maxMotor).toBeGreaterThan(10);
    }
  });

  it('gives no motor output with the accelerator up and cuts axle motors above their maximum speed', () => {
    const s = new VehicleSimulator(sim(spec(NSX)));
    s.advance(1, { throttle: 0, brake: 0 });
    expect(s.state.motorPowerKw).toBe(0);
    // The front motors (16,000 rpm through 8.05:1) stop adding above ≈ 245 km/h: only the direct-drive motor remains.
    const v = sim(spec(NSX));
    const fast = new VehicleSimulator(v);
    for (let i = 0; i < 60000 && msToKmh(fast.state.speed) < 252; i++) fast.step(0.001, { throttle: 1, brake: 0 });
    expect(msToKmh(fast.state.speed)).toBeGreaterThanOrEqual(252);
    fast.step(0.001, { throttle: 1, brake: 0 });
    expect(fast.state.motorPowerKw).toBeLessThanOrEqual(v.hybrid!.inputMotor!.peakPowerW / 1000 + 1e-6);
  });
});
