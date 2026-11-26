import { useCallback, useEffect, useRef, useState } from 'react';
import { BRAKE_CANCEL, DEFAULT_TRAFFIC_SEED, LiveDriveLoop, type AutoDriveView, type DisengageReason, type TrafficView } from '../assist/liveDrive';
import type { TrafficMode } from '../assist/traffic';
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
  distanceM: number;
  /** Auto Hold is keeping the car stationary until the throttle is pressed. */
  autoHold: boolean;
  timer: LiveTimerView;
  /** Simulation time since the last reset, s. */
  timeS: number;
  autoDrive: AutoDriveView;
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
    distanceM: s.distance,
    autoHold: loop.hold,
    timer: loop.timer.view,
    timeS: loop.time,
    autoDrive: loop.autoDriveView(),
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
    // A new car (or tuning) starts a new session: Auto Drive is off and must be switched on again.
    const setting = prev ? prev.trafficSetting : { mode: 'off' as const, seed: DEFAULT_TRAFFIC_SEED };
    const next = new LiveDriveLoop(vehicle, shiftMode, {
      trafficMode: setting.mode,
      seed: setting.seed,
      disengaged: prev?.autoDriveEngaged ? 'vehicle' : undefined,
    });
    if (prev) {
      // Keep what the driver's feet are doing, never Auto Drive's requests.
      const driver = driverTargets();
      next.applied.throttle = prev.autoDriveEngaged ? Math.min(prev.applied.throttle, driver.throttle) : prev.applied.throttle;
      next.applied.brake = prev.autoDriveEngaged ? Math.min(prev.applied.brake, driver.brake) : prev.applied.brake;
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
      // The brake cancels Auto Drive the moment it is touched, even for a tap shorter than a frame.
      if (pedal === 'brake' && v > BRAKE_CANCEL && loopRef.current!.autoDriveEngaged) {
        loopRef.current!.disengage('brake');
        refresh();
      }
    },
    [refresh],
  );

  const shift = useCallback((direction: 1 | -1): ShiftRequestResult => loopRef.current!.sim.requestShift(direction), []);

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
      else l.disengage(reason);
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

  const setTraffic = useCallback(
    (mode: TrafficMode, seed?: number) => {
      loopRef.current!.setTraffic(mode, seed);
      refresh();
    },
    [refresh],
  );

  const runSamples = useCallback((): readonly TraceSample[] => loopRef.current!.timer.samples, []);

  return { snapshot, setPedal, shift, reset, runSamples, setAutoDrive, toggleAutoDrive, setTraffic };
}
