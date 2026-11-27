import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BRAKE_CANCEL,
  DEFAULT_TRAFFIC_SEED,
  LiveDriveLoop,
  type AutoDriveView,
  type CommandResult,
  type CruiseView,
  type DisengageReason,
  type PlayerLaneView,
  type TrafficView,
} from '../assist/liveDrive';
import { defaultRoad, type RoadSettings, type TrafficMode } from '../assist/road';
import { FIXED_DT } from '../physics/constants';
import type { LiveTimerView } from '../physics/liveTimer';
import type { TraceSample } from '../physics/runners';
import type { ShiftRequestResult } from '../physics/simulator';
import type { CouplingState, ShiftMode, SimVehicle } from '../physics/types';
import { msToKmh } from '../physics/units';

export interface DriveSnapshot {
  speedKmh: number;
  rpm: number;
  gear: number;
  gearCount: number;
  shifting: boolean;
  boostBar: number;
  throttle: number;
  brake: number;
  accelG: number;
  engineTorqueNm: number;
  wheelPowerKw: number;
  tractionLimited: boolean;
  speedLimited: boolean;
  fuelCut: boolean;
  coupling: CouplingState;
  /** Clutch disengaged during a clutch-open shift (manual or automated manual). */
  clutchOpen: boolean;
  /** Electric cars: motor output, kW, and whether a published boost is running. */
  motorPowerKw: number;
  boostActive: boolean;
  /** Electric cars: boost seconds left, recovery seconds before the boost button works again, and a primed launch. */
  boostS: number;
  boostRecoveryS: number;
  launchPrimed: boolean;
  /** Simulated stepped gearbox switched on but paused while a boost runs. */
  virtualSuspended: boolean;
  distanceM: number;
  /** Auto Hold is keeping the car stationary until the throttle is pressed. */
  autoHold: boolean;
  timer: LiveTimerView;
  /** Simulation time since the last reset, s. */
  timeS: number;
  autoDrive: AutoDriveView;
  cruise: CruiseView;
  lane: PlayerLaneView;
  traffic: TrafficView;
}

const MAX_FRAME_S = 0.1;

type InputSource = 'pointer' | 'key';

function snapshotOf(loop: LiveDriveLoop): DriveSnapshot {
  const sim = loop.sim;
  const s = sim.state;
  return {
    speedKmh: msToKmh(s.speed),
    rpm: s.engineRpm,
    gear: s.gear,
    gearCount: sim.gearCount,
    shifting: s.shift !== null,
    boostBar: sim.boostBar,
    throttle: loop.applied.throttle,
    brake: loop.applied.brake,
    accelG: s.accelFiltered / 9.80665,
    engineTorqueNm: s.engineTorqueNm,
    wheelPowerKw: Math.max(0, (s.driveForceN * s.speed) / 1000),
    tractionLimited: s.tractionLimited,
    speedLimited: s.speedLimited,
    fuelCut: s.fuelCut,
    coupling: s.coupling,
    clutchOpen: s.clutchOpen,
    motorPowerKw: s.motorPowerKw,
    boostActive: s.boostS > 0,
    boostS: s.boostS,
    boostRecoveryS: s.boostRecoveryS,
    launchPrimed: s.launchPrimed,
    virtualSuspended: sim.virtualShiftSuspended,
    distanceM: s.distance,
    autoHold: loop.hold,
    timer: loop.timer.view,
    timeS: loop.time,
    autoDrive: loop.autoDriveView(),
    cruise: loop.cruise,
    lane: loop.laneView,
    traffic: loop.trafficView(),
  };
}

/**
 * Real-time driving loop. Rendering runs on requestAnimationFrame, but the
 * physics always advances in FIXED_DT steps through a time accumulator, so
 * the simulation is identical at 30, 60 or 120 Hz. Each step goes through
 * `LiveDriveLoop`: driver pedals (or the winning Auto Drive request), pedal
 * smoothing, Auto Hold, the vehicle simulator, the live timer and traffic.
 */
export function useDriveSimulation(vehicle: SimVehicle, shiftMode: ShiftMode, virtualShift = false) {
  const loopRef = useRef<LiveDriveLoop | null>(null);
  const targets = useRef({ pointer: { throttle: 0, brake: 0 }, key: { throttle: 0, brake: 0 } });

  const driverTargets = () => {
    const t = targets.current;
    return { throttle: Math.max(t.pointer.throttle, t.key.throttle), brake: Math.max(t.pointer.brake, t.key.brake) };
  };

  if (loopRef.current === null || loopRef.current.vehicle !== vehicle) {
    const prev = loopRef.current;
    // A new car (or tuning) starts a new session: Auto Drive and cruise are off, the set speed is cleared.
    const setting = prev ? prev.trafficSetting : { mode: 'off' as const, seed: DEFAULT_TRAFFIC_SEED, road: defaultRoad() };
    const next = new LiveDriveLoop(vehicle, shiftMode, {
      trafficMode: setting.mode,
      seed: setting.seed,
      road: setting.road,
      disengaged: prev?.automated ? 'vehicle' : undefined,
    });
    if (prev) {
      // Keep what the driver's feet are doing, never automated requests.
      const driver = driverTargets();
      next.applied.throttle = prev.automated ? Math.min(prev.applied.throttle, driver.throttle) : prev.applied.throttle;
      next.applied.brake = prev.automated ? Math.min(prev.applied.brake, driver.brake) : prev.applied.brake;
    }
    loopRef.current = next;
  }
  const loop = loopRef.current;
  loop.sim.shiftMode = shiftMode;
  // Electric cars with a simulated stepped gearbox (e.g. N e-Shift): Live Drive only, off unless chosen.
  loop.sim.setVirtualShift(virtualShift);

  const [snapshot, setSnapshot] = useState<DriveSnapshot>(() => snapshotOf(loop));
  const refresh = useCallback(() => setSnapshot(snapshotOf(loopRef.current!)), []);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    const tick = (now: number) => {
      acc += Math.min(MAX_FRAME_S, Math.max(0, (now - last) / 1000));
      last = now;
      const current = loopRef.current!;
      const t = targets.current;
      const driver = { throttle: Math.max(t.pointer.throttle, t.key.throttle), brake: Math.max(t.pointer.brake, t.key.brake) };
      const steps = Math.floor(acc / FIXED_DT + 1e-9);
      acc -= steps * FIXED_DT;
      for (let i = 0; i < steps; i++) current.step(driver);
      setSnapshot(snapshotOf(current));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const setPedal = useCallback(
    (source: InputSource, pedal: 'throttle' | 'brake', value: number) => {
      const v = Math.min(1, Math.max(0, value));
      targets.current[source][pedal] = v;
      const t = targets.current;
      loopRef.current!.setDriverInput({ throttle: Math.max(t.pointer.throttle, t.key.throttle), brake: Math.max(t.pointer.brake, t.key.brake) });
      // The brake cancels Auto Drive and cruise the moment it is touched, even for a tap shorter than a frame.
      if (pedal === 'brake' && v > BRAKE_CANCEL && loopRef.current!.automated) {
        loopRef.current!.disengage('brake');
        refresh();
      }
    },
    [refresh],
  );

  /** Focus lost or app hidden: release every pedal command (keys, touch and focused-pedal keys) and stop automation. */
  const releaseAll = useCallback(() => {
    const t = targets.current;
    t.pointer.throttle = t.pointer.brake = t.key.throttle = t.key.brake = 0;
    loopRef.current!.setDriverInput({ throttle: 0, brake: 0 });
    loopRef.current!.disengage('focus');
    refresh();
  }, [refresh]);

  /** Paddle request. Paddles always select manual (the view switches its mode too), so it applies before the next step. */
  const shift = useCallback((direction: 1 | -1): ShiftRequestResult => {
    const sim = loopRef.current!.sim;
    sim.shiftMode = 'manual';
    return sim.requestShift(direction);
  }, []);
  /** Boost button (e.g. N Grin Boost). */
  const boost = useCallback((): ShiftRequestResult => {
    const r = loopRef.current!.sim.requestBoost();
    refresh();
    return r;
  }, [refresh]);

  const reset = useCallback(() => {
    loopRef.current!.reset();
    refresh();
  }, [refresh]);

  /** Switch Auto Drive on or off. Returns false if it could not be switched on (driver braking). */
  const setAutoDrive = useCallback(
    (on: boolean, reason: DisengageReason = 'switch'): boolean => {
      const l = loopRef.current!;
      let ok = true;
      if (on) ok = l.engage();
      else if (l.autoDriveEngaged || reason !== 'switch') l.disengage(reason);
      refresh();
      return ok;
    },
    [refresh],
  );

  /**
   * Toggle Auto Drive. Switching it on with traffic off also starts sparse
   * traffic, so there is something to follow. Returns the new state, or
   * 'refused' while the driver is braking.
   */
  const toggleAutoDrive = useCallback((): 'on' | 'off' | 'refused' => {
    const l = loopRef.current!;
    let result: 'on' | 'off' | 'refused';
    if (l.autoDriveEngaged) {
      l.disengage('switch');
      result = 'off';
    } else if (l.engage()) {
      if (l.trafficSetting.mode === 'off') l.setTraffic('sparse');
      result = 'on';
    } else {
      result = 'refused';
    }
    refresh();
    return result;
  }, [refresh]);

  const command = useCallback(
    (run: (l: LiveDriveLoop) => CommandResult | void): CommandResult => {
      const r = run(loopRef.current!) ?? { ok: true };
      refresh();
      return r;
    },
    [refresh],
  );

  const setTraffic = useCallback((mode: TrafficMode, seed?: number) => command((l) => l.setTraffic(mode, seed)), [command]);
  const setSeed = useCallback((seed: number) => command((l) => l.setSeed(seed)), [command]);
  const setRoad = useCallback((road: RoadSettings) => command((l) => l.setRoad(road)), [command]);
  const changeLane = useCallback((direction: -1 | 1) => command((l) => l.requestLaneChange(direction)), [command]);
  const cruise = useCallback(
    (action: 'set' | 'up' | 'down' | 'cancel' | 'resume') =>
      command((l) =>
        action === 'set' ? l.cruiseSet() : action === 'up' ? l.cruiseAdjust(1) : action === 'down' ? l.cruiseAdjust(-1) : action === 'cancel' ? l.cruiseCancel() : l.cruiseResume(),
      ),
    [command],
  );

  const runSamples = useCallback((): readonly TraceSample[] => loopRef.current!.timer.samples, []);

  return { snapshot, setPedal, releaseAll, shift, boost, reset, runSamples, setAutoDrive, toggleAutoDrive, setTraffic, setSeed, setRoad, changeLane, cruise };
}
