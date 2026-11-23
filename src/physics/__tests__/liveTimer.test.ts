import { describe, expect, it } from 'vitest';
import { LiveTimer } from '../liveTimer';
import { VehicleSimulator } from '../simulator';
import { runAccelerationRun } from '../runners';
import { sim, skoda } from '../../test-helpers';

function drive(s: VehicleSimulator, timer: LiveTimer, seconds: number, throttle: number, brake = 0) {
  for (let i = 0; i < Math.round(seconds / 0.001); i++) {
    s.step(0.001, { throttle, brake });
    timer.update(s.state);
  }
}

describe('LiveTimer', () => {
  it('stays armed at rest and records a run when pulling away under throttle', () => {
    const s = new VehicleSimulator(sim(skoda));
    const timer = new LiveTimer();
    drive(s, timer, 1, 0, 1);
    expect(timer.view.status).toBe('ready');
    expect(timer.view.armed).toBe(true);
    drive(s, timer, 12, 1);
    const v = timer.view;
    expect(v.status).toBe('running');
    expect(v.metrics.zeroTo100KmhS).not.toBeNull();
    expect(timer.samples.length).toBeGreaterThan(100);
  });

  it('matches the headless runner for an identical standard launch (timed from first motion)', () => {
    const s = new VehicleSimulator(sim(skoda));
    const timer = new LiveTimer();
    drive(s, timer, 1, 0, 1);
    // Same pedal ramp as the runner's standard launch.
    for (let i = 0; i < 12000; i++) {
      const thr = Math.min(1, ((i + 1) * 0.001) / 0.12);
      s.step(0.001, { throttle: thr, brake: 0 });
      timer.update(s.state);
    }
    const headless = runAccelerationRun(sim(skoda), {
      launch: 'standard',
      targetSpeedKmh: 100,
      targetDistanceM: 0,
      sampleIntervalS: 0.001,
    });
    // The headless clock starts at brake release; the live timer (like a GPS
    // box) starts when the car actually pulls away, so subtract the launch
    // delay (the DSG revs to its launch speed before the clutch bites).
    const pullAway = headless.trace.find((p) => p.speedKmh > 0.36)!.t;
    expect(pullAway).toBeGreaterThan(0.1);
    expect(timer.view.metrics.zeroTo100KmhS!).toBeCloseTo(headless.metrics.zeroTo100KmhS! - pullAway, 1);
  });

  it('does not start on idle creep, and re-arms after stopping', () => {
    const s = new VehicleSimulator(sim(skoda));
    const timer = new LiveTimer();
    drive(s, timer, 3, 0);
    expect(s.state.speed).toBeGreaterThan(0);
    expect(timer.view.status).toBe('ready');
    expect(timer.view.armed).toBe(false);
    drive(s, timer, 2, 1); // flooring it while rolling is not a standing start
    expect(timer.view.status).toBe('ready');
    drive(s, timer, 8, 0, 1);
    expect(s.state.speed).toBe(0);
    expect(timer.view.armed).toBe(true);
    drive(s, timer, 3, 1);
    expect(timer.view.status).toBe('running');
    drive(s, timer, 8, 0, 1);
    expect(timer.view.status).toBe('finished');
    expect(timer.view.metrics.topSpeedKmh).toBeGreaterThan(30);
  });
});
