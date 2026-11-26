import { describe, expect, it } from 'vitest';
import { getEntry } from '../../data/catalog';
import type { VehicleSpec } from '../../data/types';
import { FIXED_DT } from '../../physics/constants';
import { LiveTimer } from '../../physics/liveTimer';
import { VehicleSimulator } from '../../physics/simulator';
import type { SimVehicle } from '../../physics/types';
import { msToKmh } from '../../physics/units';
import { VEHICLES, lexus, sim, skoda } from '../../test-helpers';
import { BRAKE_CANCEL, LiveDriveLoop, PEDAL_RATE, type DriverInput } from '../liveDrive';
import type { TrafficMode } from '../road';
import { ENCOUNTER_INTERVAL_S } from '../traffic';

const nevera = VEHICLES.find((v) => v.id === '2022-rimac-nevera-eu-coupe-awd-ev')!;
const IDLE: DriverInput = { throttle: 0, brake: 0 };
const steps = (s: number) => Math.round(s / FIXED_DT);

function run(loop: LiveDriveLoop, seconds: number, input: DriverInput | ((t: number) => DriverInput) = IDLE, each?: (l: LiveDriveLoop) => void) {
  for (let i = 0; i < steps(seconds); i++) {
    loop.step(typeof input === 'function' ? input(loop.time) : input);
    each?.(loop);
  }
}

/** The Live Drive loop exactly as it ran before Auto Drive (pedal smoothing, Auto Hold, simulator, timer). */
function legacyLoop(vehicle: SimVehicle, seconds: number, input: (t: number) => DriverInput) {
  const sim = new VehicleSimulator(vehicle, 'auto');
  const timer = new LiveTimer();
  const a = { throttle: 0, brake: 0 };
  let hold = true;
  const maxDelta = PEDAL_RATE * FIXED_DT;
  for (let i = 0; i < steps(seconds); i++) {
    const want = input(sim.state.time);
    a.throttle += Math.max(-maxDelta, Math.min(maxDelta, want.throttle - a.throttle));
    a.brake += Math.max(-maxDelta, Math.min(maxDelta, want.brake - a.brake));
    if (sim.state.speed === 0 && a.brake > 0.05) hold = true;
    if (a.throttle > 0.02) hold = false;
    sim.step(FIXED_DT, hold ? { throttle: a.throttle, brake: 1 } : a);
    timer.update(sim.state);
  }
  return { state: sim.state, timer: timer.view, hold };
}

/** A manual drive: launch, part throttle, a lift, braking to a stop and a brake-boost relaunch. */
const manualInput = (t: number): DriverInput =>
  t < 6 ? { throttle: 1, brake: 0 } : t < 9 ? { throttle: 0.35, brake: 0 } : t < 11 ? IDLE : t < 16 ? { throttle: 0, brake: 0.7 } : t < 18 ? { throttle: 1, brake: 1 } : { throttle: 1, brake: 0 };

describe('Live Drive loop', () => {
  it.each([
    ['Lexus IS 200t', lexus],
    ['Škoda Superb', skoda],
    ['Rimac Nevera', nevera],
  ] as [string, VehicleSpec][])('reproduces the original manual loop exactly with Auto Drive and traffic off (%s)', (_, spec) => {
    const v = sim(spec);
    const legacy = legacyLoop(v, 25, manualInput);
    const loop = new LiveDriveLoop(v);
    run(loop, 25, manualInput);
    expect(loop.sim.state).toEqual(legacy.state);
    expect(loop.timer.view).toEqual(legacy.timer);
    expect(loop.hold).toBe(legacy.hold);
  });

  it('leaves the car untouched by traffic while Auto Drive is off', () => {
    const plain = new LiveDriveLoop(sim(lexus));
    const busy = new LiveDriveLoop(sim(lexus), 'auto', { trafficMode: 'sparse', seed: 5 });
    run(plain, 40, manualInput);
    run(busy, 40, manualInput);
    expect(busy.sim.state).toEqual(plain.sim.state);
    expect(busy.traffic!.events.length).toBeGreaterThan(1);
  }, 30_000);

  it('starts off and releases Auto Hold when Auto Drive pulls away, at 100 % requested throttle', () => {
    const loop = new LiveDriveLoop(sim(skoda));
    expect(loop.autoDriveEngaged).toBe(false);
    run(loop, 1);
    expect(loop.hold).toBe(true);
    expect(loop.sim.state.speed).toBe(0);
    expect(loop.engage()).toBe(true);
    run(loop, 0.2);
    expect(loop.autoDriveView().throttle).toBe(1);
    expect(loop.applied.throttle).toBe(1); // through pedal smoothing (full travel in ~0.14 s)
    expect(loop.hold).toBe(false);
    run(loop, 5);
    expect(loop.autoDriveView().mode).toBe('accelerating');
    expect(msToKmh(loop.sim.state.speed)).toBeGreaterThan(60);
    expect(loop.timer.view.status).toBe('running');
  });

  it('cancels on the driver brake in the same step, with brake priority and no stale throttle', () => {
    const loop = new LiveDriveLoop(sim(lexus), 'auto', { trafficMode: 'sparse', seed: 3 });
    loop.engage();
    run(loop, 8);
    expect(loop.applied.throttle).toBe(1);
    loop.step({ throttle: 0, brake: 1 });
    expect(loop.autoDriveEngaged).toBe(false);
    expect(loop.autoDriveView().lastDisengage?.reason).toBe('brake');
    expect(loop.applied.throttle).toBe(0);
    expect(loop.applied.brake).toBeCloseTo(PEDAL_RATE * FIXED_DT, 9);
    run(loop, 0.5, { throttle: 0, brake: 1 });
    expect(loop.applied.brake).toBe(1);
    // Releasing the brake does not bring Auto Drive back.
    run(loop, 3);
    expect(loop.autoDriveEngaged).toBe(false);
    expect(loop.applied.throttle).toBe(0);
    expect(loop.sim.state.throttle).toBe(0);
  });

  it('treats a light brake touch as a cancel, and refuses to engage while braking', () => {
    const loop = new LiveDriveLoop(sim(lexus));
    loop.engage();
    run(loop, 3);
    loop.step({ throttle: 0, brake: BRAKE_CANCEL + 0.01 });
    expect(loop.autoDriveEngaged).toBe(false);
    expect(loop.engage()).toBe(false);
    run(loop, 0.5);
    expect(loop.engage()).toBe(true);
  });

  it('needs deliberate re-engagement after the switch, a reset and focus loss, clearing its throttle each time', () => {
    for (const how of ['switch', 'reset', 'focus'] as const) {
      const loop = new LiveDriveLoop(sim(skoda), 'auto', { trafficMode: 'cut-in', seed: 1 });
      loop.engage();
      run(loop, 4);
      expect(loop.applied.throttle).toBe(1);
      if (how === 'reset') loop.reset();
      else loop.disengage(how);
      expect(loop.autoDriveEngaged).toBe(false);
      expect(loop.autoDriveView().lastDisengage?.reason).toBe(how);
      expect(loop.applied.throttle).toBe(0);
      run(loop, 2);
      expect(loop.autoDriveEngaged).toBe(false);
      expect(loop.sim.state.throttle).toBe(0);
    }
  });

  it('lets the driver override automatic braking with the accelerator', () => {
    const loop = new LiveDriveLoop(sim(lexus), 'auto', { trafficMode: 'cut-in', seed: 1 });
    loop.engage();
    for (let i = 0; i < steps(60) && loop.autoDriveView().mode !== 'braking'; i++) loop.step(IDLE);
    expect(loop.autoDriveView().mode).toBe('braking');
    run(loop, 0.3);
    expect(loop.applied.brake).toBeGreaterThan(0);
    // Pressing the accelerator during automatic braking wins (and does not cancel Auto Drive).
    const t0 = loop.time;
    run(loop, 0.5, (t) => (t - t0 > 0 ? { throttle: 0.6, brake: 0 } : IDLE));
    const view = loop.autoDriveView();
    expect(loop.autoDriveEngaged).toBe(true);
    expect(view.override).toBe(true);
    expect(loop.applied.brake).toBe(0);
    expect(loop.applied.throttle).toBeGreaterThanOrEqual(0.6 - 1e-9);
  });

  it('works on every playable car without consulting factory ACC metadata', () => {
    // The Škoda is documented without ACC; the Lexus leaves it unspecified. Neither gates Auto Drive.
    expect(getEntry('skoda-superb-combi-lk-280').owner?.acc).toBe(false);
    expect(getEntry('lexus-is200t-2016-tw').owner?.acc).toBeUndefined();
    for (const spec of VEHICLES) {
      const loop = new LiveDriveLoop(sim(spec));
      expect(loop.engage()).toBe(true);
      run(loop, 3);
      expect(loop.autoDriveView().throttle).toBe(1);
      expect(loop.sim.state.speed).toBeGreaterThan(5);
    }
  }, 60_000);
});

interface ScenarioTrace {
  phases: string[];
  leads: (number | null)[];
  modes: Set<string>;
  minGap: number;
  cutInSeen: boolean;
  brakingAfterCutIn: boolean;
  fullThrottleAfterClear: number | null;
  doneAt: number | null;
  pedalOverlap: boolean;
}

function scenario(spec: VehicleSpec): ScenarioTrace {
  const loop = new LiveDriveLoop(sim(spec), 'auto', { trafficMode: 'cut-in', seed: 1 });
  loop.engage();
  const tr: ScenarioTrace = { phases: [], leads: [], modes: new Set(), minGap: Infinity, cutInSeen: false, brakingAfterCutIn: false, fullThrottleAfterClear: null, doneAt: null, pedalOverlap: false };
  let lastLead: number | null | undefined;
  run(loop, 90, IDLE, (l) => {
    const t = l.trafficView();
    const a = l.autoDriveView();
    tr.modes.add(a.mode);
    if (a.throttle > 0 && a.brake > 0) tr.pedalOverlap = true;
    const id = t.lead?.id ?? null;
    if (id !== lastLead) tr.leads.push(id);
    lastLead = id;
    if (t.lead) tr.minGap = Math.min(tr.minGap, t.lead.gapM);
    if (t.lead?.cutIn) tr.cutInSeen = true;
    if (tr.cutInSeen && t.phase === 'cut-in' && a.mode === 'braking') tr.brakingAfterCutIn = true;
    if (t.phase && tr.phases[tr.phases.length - 1] !== t.phase) tr.phases.push(t.phase);
    if (t.phase === 'done' && tr.doneAt === null) tr.doneAt = l.time;
    if (tr.doneAt !== null && tr.fullThrottleAfterClear === null && a.throttle === 1) tr.fullThrottleAfterClear = l.time - tr.doneAt;
  });
  return tr;
}

describe('Auto Drive in traffic', () => {
  it.each([
    ['Lexus IS 200t', lexus],
    ['Škoda Superb', skoda],
    ['Rimac Nevera', nevera],
  ] as [string, VehicleSpec][])('follows, takes a cut-in, recovers after cut-outs and returns to full throttle (%s)', (_, spec) => {
    const tr = scenario(spec);
    expect(tr.phases).toEqual(['approach', 'cut-in', 'follow', 'resume', 'clear', 'done']);
    // Lead A, then the cut-in car B, then A again after B leaves, then a clear lane.
    expect(tr.leads).toEqual([1, 2, 1, null]);
    expect(tr.cutInSeen).toBe(true);
    expect(tr.brakingAfterCutIn).toBe(true);
    expect(tr.minGap).toBeGreaterThan(10);
    expect(tr.pedalOverlap).toBe(false);
    expect([...tr.modes].sort()).toEqual(['accelerating', 'braking', 'following']);
    expect(tr.fullThrottleAfterClear).not.toBeNull();
    expect(tr.fullThrottleAfterClear!).toBeLessThan(3);
  }, 30_000);

  it('replays a seed exactly and differs with another seed', () => {
    const go = (mode: TrafficMode, seed: number) => {
      const loop = new LiveDriveLoop(sim(nevera), 'auto', { trafficMode: mode, seed });
      loop.engage();
      const trace: number[] = [];
      run(loop, 150, IDLE, (l) => {
        if (Math.round(l.time * 1000) % 500 === 0) trace.push(l.sim.state.distance, l.autoDriveView().throttle, l.autoDriveView().brake, l.trafficView().lead?.gapM ?? -1);
      });
      return { events: JSON.stringify(loop.traffic!.events), trace, state: loop.sim.state };
    };
    const a = go('sparse', 42);
    const b = go('sparse', 42);
    expect(b.events).toBe(a.events);
    expect(b.trace).toEqual(a.trace);
    expect(b.state).toEqual(a.state);
    expect(go('sparse', 43).events).not.toBe(a.events);
    // Reset replays the same seed from the same starting state.
    const loop = new LiveDriveLoop(sim(nevera), 'auto', { trafficMode: 'sparse', seed: 42 });
    loop.engage();
    run(loop, 30);
    loop.reset();
    loop.engage();
    run(loop, 150);
    expect(JSON.stringify(loop.traffic!.events)).toBe(a.events);
    expect(loop.sim.state).toEqual(a.state);
  }, 60_000);

  it('generates light Sparse traffic: encounters every 12–25 s of driving near the Taiwan limit, with lane changes into and out of the lane', () => {
    let cutIns = 0;
    let cutOuts = 0;
    for (const seed of [1, 2, 3, 4]) {
      const loop = new LiveDriveLoop(sim(lexus), 'auto', { trafficMode: 'sparse', seed });
      loop.engage();
      let minGap = Infinity;
      run(loop, 240, IDLE, (l) => {
        const g = l.traffic!.lead()?.gapM;
        if (g !== undefined) minGap = Math.min(minGap, g);
      });
      const t = loop.traffic!;
      // The car is moving almost all the time, so encounters track simulation time.
      expect(t.encounters).toBeGreaterThanOrEqual(Math.floor(235 / ENCOUNTER_INTERVAL_S[1]));
      expect(t.encounters).toBeLessThanOrEqual(Math.ceil(240 / ENCOUNTER_INTERVAL_S[0]));
      // Default road: Taiwan, 110 km/h. Traffic keeps to about 75–125 km/h, mostly at or below the limit.
      const speeds = t.events.filter((x) => x.kind === 'spawn' && x.role !== 'behind').map((x) => x.speedKmh!);
      for (const v of speeds) {
        expect(v).toBeGreaterThanOrEqual(70);
        expect(v).toBeLessThanOrEqual(110 * 1.1 + 0.1);
      }
      expect(speeds.filter((v) => v <= 110).length / speeds.length).toBeGreaterThan(0.7);
      const signals = t.events.filter((x) => x.kind === 'signal');
      cutIns += signals.filter((x) => x.to === 1).length;
      cutOuts += signals.filter((x) => x.lane === 1).length;
      expect(minGap).toBeGreaterThan(10);
    }
    expect(cutIns).toBeGreaterThan(3);
    expect(cutOuts).toBeGreaterThan(3);
  }, 60_000);
});
