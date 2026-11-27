import { describe, expect, it } from 'vitest';
import type { VehicleSpec } from '../../data/types';
import { FIXED_DT } from '../../physics/constants';
import { msToKmh } from '../../physics/units';
import { VEHICLES, lexus, sim, skoda } from '../../test-helpers';
import { CRUISE_STEP_KMH, LiveDriveLoop, type DriverInput } from '../liveDrive';
import type { RoadSettings, TrafficMode } from '../road';

const nevera = VEHICLES.find((v) => v.id === '2022-rimac-nevera-eu-coupe-awd-ev')!;
const IDLE: DriverInput = { throttle: 0, brake: 0 };
const steps = (s: number) => Math.round(s / FIXED_DT);
const kmh = (l: LiveDriveLoop) => msToKmh(l.sim.state.speed);

function run(loop: LiveDriveLoop, seconds: number, input: DriverInput | ((t: number) => DriverInput) = IDLE, each?: (l: LiveDriveLoop) => void) {
  for (let i = 0; i < steps(seconds); i++) {
    loop.step(typeof input === 'function' ? input(loop.time) : input);
    each?.(loop);
  }
}

/** Accelerate with the driver's foot to a speed, then hand over. */
function upTo(loop: LiveDriveLoop, target: number) {
  for (let i = 0; i < steps(60) && kmh(loop) < target; i++) loop.step({ throttle: 0.8, brake: 0 });
}

function session(spec: VehicleSpec, mode: TrafficMode = 'off', road?: RoadSettings) {
  return new LiveDriveLoop(sim(spec), 'auto', { trafficMode: mode, seed: 1, road });
}

describe('conventional cruise control', () => {
  it('needs a stored speed and a moving car: SET at a standstill and RESUME before SET explain themselves', () => {
    const loop = session(lexus);
    run(loop, 1);
    expect(loop.cruiseSet()).toEqual({ ok: false, message: 'Drive above 20 km/h to set a speed' });
    expect(loop.cruiseResume()).toEqual({ ok: false, message: 'No set speed stored yet — use SET' });
    expect(loop.cruiseAdjust(1).ok).toBe(false);
    expect(loop.cruise).toEqual({ setKmh: null, state: 'off' });
  });

  it.each([
    ['Lexus IS 200t', lexus],
    ['Škoda Superb', skoda],
    ['Rimac Nevera', nevera],
  ] as [string, VehicleSpec][])('captures the speed, holds it with the accelerator only and adjusts in small steps (%s)', (_, spec) => {
    const loop = session(spec);
    upTo(loop, 90);
    expect(loop.cruiseSet().ok).toBe(true);
    const set = loop.cruise.setKmh!;
    expect(Math.abs(set - kmh(loop))).toBeLessThan(1);
    expect(loop.cruise.state).toBe('cruise');
    let braked = false;
    let worst = 0;
    run(loop, 30, IDLE, (l) => {
      if (l.applied.brake > 0) braked = true;
      if (l.time > 0) worst = Math.max(worst, Math.abs(kmh(l) - set));
    });
    expect(braked).toBe(false);
    expect(worst).toBeLessThan(3);
    expect(Math.abs(kmh(loop) - set)).toBeLessThan(1);
    // + three times, then − five times: 1 km/h steps; slowing down is by coasting, never braking.
    for (let i = 0; i < 3; i++) loop.cruiseAdjust(1);
    expect(loop.cruise.setKmh).toBe(set + 3 * CRUISE_STEP_KMH);
    run(loop, 20);
    expect(Math.abs(kmh(loop) - (set + 3))).toBeLessThan(1);
    for (let i = 0; i < 5; i++) loop.cruiseAdjust(-1);
    run(loop, 30, IDLE, (l) => {
      if (l.applied.brake > 0) braked = true;
    });
    expect(braked).toBe(false);
    expect(Math.abs(kmh(loop) - (set - 2))).toBeLessThan(1.2);
  }, 30_000);

  it('lets the accelerator override and returns smoothly to the set speed; the brake cancels and RESUME restores', () => {
    const loop = session(lexus);
    upTo(loop, 80);
    loop.cruiseSet();
    const set = loop.cruise.setKmh!;
    run(loop, 10);
    run(loop, 5, { throttle: 1, brake: 0 });
    expect(loop.autoDriveView().override).toBe(true);
    expect(kmh(loop)).toBeGreaterThan(set + 10);
    let braked = false;
    run(loop, 40, IDLE, (l) => {
      if (l.applied.brake > 0) braked = true;
    });
    expect(braked).toBe(false);
    expect(Math.abs(kmh(loop) - set)).toBeLessThan(1.5);
    // A one-step tap on the brake cancels at once and keeps the speed stored.
    loop.step({ throttle: 0, brake: 0.1 });
    expect(loop.cruise).toEqual({ setKmh: set, state: 'standby' });
    expect(loop.applied.throttle).toBe(0);
    expect(loop.autoDriveView().lastDisengage?.reason).toBe('brake');
    run(loop, 5);
    expect(kmh(loop)).toBeLessThan(set - 1);
    expect(loop.cruiseResume().ok).toBe(true);
    run(loop, 20);
    expect(Math.abs(kmh(loop) - set)).toBeLessThan(1.5);
    // CANCEL keeps the speed in standby and hands the pedals back.
    expect(loop.cruiseCancel().ok).toBe(true);
    expect(loop.cruise.state).toBe('standby');
    expect(loop.applied.throttle).toBe(0);
  }, 30_000);

  it('releases on focus loss, and Reset clears the stored speed', () => {
    const loop = session(lexus);
    upTo(loop, 70);
    loop.cruiseSet();
    run(loop, 2);
    loop.disengage('focus');
    expect(loop.cruise.state).toBe('standby');
    expect(loop.applied.throttle).toBe(0);
    loop.reset();
    expect(loop.cruise).toEqual({ setKmh: null, state: 'off' });
  });
});

describe('Auto Drive speed cap', () => {
  it('holds the cap on a clear road, and canceling only the cap returns to 100 % throttle', () => {
    const loop = session(nevera);
    loop.engage();
    run(loop, 3);
    // SET while Auto Drive is on: the current speed becomes its cap; Auto Drive stays on.
    loop.cruiseSet();
    const cap = loop.cruise.setKmh!;
    expect(loop.cruise.state).toBe('cap');
    expect(loop.autoDriveEngaged).toBe(true);
    run(loop, 25);
    expect(Math.abs(kmh(loop) - cap)).toBeLessThan(2);
    expect(loop.autoDriveView().mode).toBe('cruising');
    expect(loop.cruiseCancel().ok).toBe(true);
    expect(loop.autoDriveEngaged).toBe(true);
    expect(loop.cruise.state).toBe('standby');
    run(loop, 3);
    expect(loop.autoDriveView().throttle).toBe(1);
    expect(kmh(loop)).toBeGreaterThan(cap + 20);
    // RESUME restores the cap without turning Auto Drive off; it eases back down to it.
    loop.cruiseResume();
    expect(loop.cruise.state).toBe('cap');
    let prev = kmh(loop);
    let rising = false;
    run(loop, 60, IDLE, (l) => {
      if (kmh(l) > prev + 0.05) rising = true;
      prev = kmh(l);
    });
    expect(rising).toBe(false);
    expect(Math.abs(kmh(loop) - cap)).toBeLessThan(2);
  }, 30_000);

  it('slows for a slower lead with or without the cap and recovers to the cap or full throttle when it leaves', () => {
    for (const withCap of [true, false]) {
      const loop = session(lexus, 'cut-in', { preset: 'taiwan', limitKmh: 110 });
      loop.engage();
      if (withCap) {
        upTo(loop, 0);
        run(loop, 5);
        loop.cruiseSet();
        while (loop.cruise.setKmh! < 100) loop.cruiseAdjust(1);
      }
      let following = false;
      let afterClear: number[] = [];
      run(loop, 120, IDLE, (l) => {
        const lead = l.traffic!.lead();
        if (lead && lead.speedMs < 23 && l.autoDriveView().mode === 'following') following = true;
        if (l.traffic!.phase === 'done') afterClear.push(kmh(l));
      });
      expect(following).toBe(true);
      expect(loop.traffic!.phase).toBe('done');
      afterClear = afterClear.slice(-5000);
      if (withCap) {
        expect(Math.max(...afterClear)).toBeLessThan(100 + 2);
        expect(Math.abs(kmh(loop) - 100)).toBeLessThan(2);
      } else {
        expect(loop.autoDriveView().throttle).toBe(1);
        expect(kmh(loop)).toBeGreaterThan(110);
      }
    }
  }, 90_000);

  it('carries active cruise into Auto Drive as its cap, and leaves it in standby when Auto Drive is switched off', () => {
    const loop = session(skoda);
    upTo(loop, 85);
    loop.cruiseSet();
    const set = loop.cruise.setKmh!;
    run(loop, 3);
    loop.engage();
    expect(loop.cruise).toEqual({ setKmh: set, state: 'cap' });
    run(loop, 10);
    expect(Math.abs(kmh(loop) - set)).toBeLessThan(2);
    loop.disengage('switch');
    expect(loop.cruise).toEqual({ setKmh: set, state: 'standby' });
    expect(loop.automated).toBe(false);
    expect(loop.applied.throttle).toBe(0);
  }, 30_000);

  it('keeps the player cruise setting independent of the road limit for traffic', () => {
    const loop = session(lexus, 'mid', { preset: 'taiwan', limitKmh: 110 });
    upTo(loop, 90);
    loop.cruiseSet();
    const set = loop.cruise.setKmh;
    loop.setRoad({ preset: 'autobahn', limitKmh: 130 });
    loop.setRoad({ preset: 'taiwan', limitKmh: 100 });
    expect(loop.cruise.setKmh).toBe(set);
    loop.cruiseAdjust(1);
    expect(loop.trafficSetting.road).toEqual({ preset: 'taiwan', limitKmh: 100 });
  });
});

describe('brake interlock', () => {
  it('refuses Auto Drive, SET and RESUME while the brake is held, even before the next step, and changes nothing', () => {
    const loop = session(lexus);
    upTo(loop, 70);
    loop.cruiseSet();
    loop.cruiseCancel();
    const stored = loop.cruise;
    expect(stored.state).toBe('standby');
    // The brake is pressed between steps (as a pedal event would report it).
    loop.setDriverInput({ throttle: 0, brake: 1 });
    expect(loop.engage()).toBe(false);
    expect(loop.cruiseSet()).toEqual({ ok: false, message: 'Release the brake to set a speed' });
    expect(loop.cruiseResume()).toEqual({ ok: false, message: 'Release the brake to resume' });
    expect(loop.cruise).toEqual(stored);
    expect(loop.automated).toBe(false);
    expect(loop.trafficSetting.mode).toBe('off');
    // Released: deliberate engagement works again; a brake tap still cancels at once.
    loop.setDriverInput({ throttle: 0, brake: 0 });
    expect(loop.cruiseResume().ok).toBe(true);
    expect(loop.engage()).toBe(true);
    loop.step({ throttle: 0, brake: 0.1 });
    expect(loop.automated).toBe(false);
  });
});
