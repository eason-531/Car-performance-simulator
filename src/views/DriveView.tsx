import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { AutoDriveView, CruiseView, DisengageReason, TrafficView } from '../assist/liveDrive';
import { AssistBar, CruisePanel, LaneButton } from '../components/DriveAssist';
import { ArcGauge, type GaugeZone } from '../components/ArcGauge';
import { Icon } from '../components/Icon';
import { Paddle } from '../components/Paddle';
import { Pedal } from '../components/Pedal';
import { RoadView } from '../components/RoadView';
import { ShiftLights } from '../components/ShiftLights';
import { CarSwitcher } from '../components/catalog/CarPicker';
import { Badge, Button, Segmented, Toggle } from '../components/ui';
import { useDriveSimulation } from '../hooks/useDriveSimulation';
import { STATUS, seriesColor } from '../lib/colors';
import { fmt, fmtSeconds } from '../lib/format';
import { speedDial } from '../lib/speedDial';
import { computeDyno, topSpeedKmh } from '../physics/dyno';
import { electricGearCount } from '../physics/electric';
import { kwToPs } from '../physics/units';
import { useApp } from '../state/AppState';
import { describeTuning } from '../tuning/tuning';

const BOOST_MIN = -1;

export function DriveView() {
  const app = useApp();
  const spec = app.activeVehicle;
  const vehicle = app.simVehicle(spec.id);
  const mode = app.settings.shiftMode;
  // Simulated stepped gearbox on an electric car (e.g. N e-Shift): off by
  // default, switched on per car here, and reset when the car changes.
  const vs = vehicle.electric?.virtualShift ?? null;
  const [virtualFor, setVirtualFor] = useState<string | null>(null);
  const [carId, setCarId] = useState(spec.id);
  if (carId !== spec.id) {
    setCarId(spec.id);
    setVirtualFor(null);
  }
  const virtual = !!vs && virtualFor === spec.id;
  const { snapshot: s, setPedal, releaseAll, shift, boost, reset, runSamples, toggleAutoDrive, setTraffic, setSeed, setRoad, changeLane, cruise } = useDriveSimulation(vehicle, mode, virtual);
  const color = seriesColor(spec.colorSlot ?? 0);
  const [flash, setFlash] = useState<string | null>(null);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showFlash = useCallback((msg: string) => {
    setFlash(msg);
    if (flashTimer.current) clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlash(null), 1200);
  }, []);
  useEffect(() => () => {
    if (flashTimer.current) clearTimeout(flashTimer.current);
  }, []);

  const toggleAuto = useCallback(() => {
    if (toggleAutoDrive() === 'refused') showFlash('Release the brake to start Auto Drive');
  }, [toggleAutoDrive, showFlash]);
  const lane = useCallback(
    (dir: -1 | 1) => {
      const r = changeLane(dir);
      if (!r.ok && r.message) showFlash(r.message);
    },
    [changeLane, showFlash],
  );
  const cruiseAction = useCallback(
    (a: 'set' | 'up' | 'down' | 'cancel' | 'resume') => {
      const r = cruise(a);
      if (!r.ok && r.message) showFlash(r.message);
    },
    [cruise, showFlash],
  );

  const pressBoost = useCallback(() => {
    const r = boost();
    if (!r.ok && r.reason) showFlash(r.reason);
  }, [boost, showFlash]);

  const doShift = useCallback(
    (dir: 1 | -1) => {
      if (mode !== 'manual') {
        app.setShiftMode('manual');
      }
      const r = shift(dir);
      if (!r.ok && r.reason) showFlash(r.reason);
    },
    [mode, app, shift, showFlash],
  );

  // Keyboard driving for iPad keyboards and desktops.
  useEffect(() => {
    const isTyping = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      return !!el && (el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA');
    };
    const down = (e: KeyboardEvent) => {
      // A focused pedal handles its own arrow keys (and marks them handled).
      if (e.defaultPrevented || isTyping(e) || e.metaKey || e.ctrlKey) return;
      const k = e.key.toLowerCase();
      if (k === 'arrowup' || k === 'w') setPedal('key', 'throttle', 1);
      else if (k === 'arrowdown' || k === 's') setPedal('key', 'brake', 1);
      else if (!e.repeat && (k === 'e' || k === 'arrowright')) doShift(1);
      else if (!e.repeat && (k === 'q' || k === 'arrowleft')) doShift(-1);
      else if (!e.repeat && k === 'm') app.setShiftMode(mode === 'auto' ? 'manual' : 'auto');
      else if (!e.repeat && k === 'r') reset();
      else if (!e.repeat && k === 'a') toggleAuto();
      else if (!e.repeat && k === 'z') lane(-1);
      else if (!e.repeat && k === 'x') lane(1);
      else if (!e.repeat && k === 'c') cruiseAction('set');
      else if (!e.repeat && k === 'v') cruiseAction('resume');
      else if (!e.repeat && k === 'b') cruiseAction('cancel');
      else if (!e.repeat && k === 'n') pressBoost();
      else if (k === '+' || k === '=') cruiseAction('up');
      else if (k === '-' || k === '_') cruiseAction('down');
      else return;
      e.preventDefault();
    };
    const up = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === 'arrowup' || k === 'w') setPedal('key', 'throttle', 0);
      else if (k === 'arrowdown' || k === 's') setPedal('key', 'brake', 0);
    };
    // Losing focus or hiding the app releases every pedal (keys and touch) and stops Auto Drive and cruise;
    // they have to be switched on again deliberately.
    const blur = () => releaseAll();
    const visibility = () => {
      if (document.visibilityState === 'hidden') blur();
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', blur);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', blur);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [setPedal, doShift, reset, app, mode, toggleAuto, releaseAll, lane, cruiseAction, pressBoost]);

  const dyno = useMemo(() => computeDyno(vehicle), [vehicle]);
  const dial = useMemo(() => speedDial(topSpeedKmh(vehicle)), [vehicle]);
  // Electric cars: motor speed, a power gauge in place of boost, and no
  // shift controls on a single-speed drive.
  const ev = vehicle.electric;
  const singleSpeed = !!ev && electricGearCount(ev) === 1 && !virtual;
  const powerMax = ev ? Math.ceil(((ev.boost?.systemPowerW ?? ev.systemPowerW) / 1000) / 100) * 100 : 0;
  const boostSpec = spec.electric?.boost;
  const boostButton = ev?.boost?.trigger === 'driver' && boostSpec ? boostSpec.label : null;
  const e = vehicle.engine;
  const redlineRpm = virtual ? vs.redlineRpm : e.redlineRpm;
  const tachMax = Math.ceil(((virtual ? vs.revLimitRpm : e.revLimitRpm) + 300) / 1000);
  const tachZones = useMemo<GaugeZone[]>(() => [{ from: redlineRpm / 1000, to: tachMax, color: STATUS.critical }], [redlineRpm, tachMax]);
  const boostMax = Math.max(2, Math.ceil(dyno.peakBoostBar + 0.4));
  const boostZones = useMemo<GaugeZone[]>(() => [{ from: BOOST_MIN, to: 0, color: '#3a3f46' }], []);
  const wot = virtual ? vs.transmission.wotUpshiftRpm : vehicle.transmission.wotUpshiftRpm;
  const shiftRpm = mode === 'auto' ? wot[Math.min(s.gear, s.gearCount, wot.length) - 1] : redlineRpm;
  const fmtTach = useCallback((v: number) => String(v), []);
  const fmtBoost = useCallback((v: number) => (v > 0 ? `+${v}` : String(v)), []);
  const fmtSpeed = useCallback((v: number) => String(v), []);

  const timer = s.timer;
  const m = timer.metrics;
  const canSave = timer.status !== 'ready' && timer.elapsedS > 1 && m.topSpeedKmh > 20;

  const saveRun = () => {
    app.saveResult({
      source: 'drive',
      vehicleId: spec.id,
      vehicleName: spec.shortName,
      colorSlot: spec.colorSlot ?? -1,
      tuningLabel:
        describeTuning(spec, app.tuningFor(spec.id)) +
        (virtual ? ` · ${vs.label}` : '') +
        (s.autoDrive.usedThisRun ? ' · Auto Drive' : '') +
        (s.autoDrive.cruiseUsedThisRun ? ' · Cruise' : ''),
      tuning: app.tuningFor(spec.id),
      launch: 'driver',
      powerPs: dyno.peakPowerPs,
      torqueNm: dyno.peakTorqueNm,
      massKg: vehicle.massKg,
      metrics: m,
      trace: runSamples(),
    });
    app.notify('Run saved to Results', 'good');
  };

  const auto = s.autoDrive;
  const automated = auto.engaged || s.cruise.state === 'cruise';
  const status = autoDriveStatus(auto, s.cruise, s.traffic);

  const boostControl = boostButton ? (
    <button
      type="button"
      className={`boost-btn ${singleSpeed ? 'boost-btn--slot ' : ''}${s.boostActive ? 'is-active' : s.boostRecoveryS > 0 ? 'is-recovering' : ''}`}
      onClick={pressBoost}
      title={`${boostButton} (N key): ${fmt(ev!.boost!.systemPowerW / 1000)} kW for ${fmt(ev!.boost!.durationS)} s`}
      aria-label={`${boostButton}: ${s.boostActive ? `running, ${Math.ceil(s.boostS - 1e-6)} s left` : s.boostRecoveryS > 0 ? `recovering, ready in ${Math.ceil(s.boostRecoveryS - 1e-6)} s` : 'ready'}`}
    >
      <span className="boost-btn__label">{boostButton}</span>
      <span className="boost-btn__state">
        {s.boostActive ? `${Math.ceil(s.boostS - 1e-6)} s` : s.boostRecoveryS > 0 ? `Ready in ${Math.ceil(s.boostRecoveryS - 1e-6)} s` : 'Ready'}
      </span>
    </button>
  ) : null;

  return (
    <div className="view drive">
      <div className="view__bar">
        <CarSwitcher value={spec.id} onChange={app.setActiveVehicle} label="Active car" />
        <div className="view__bar-actions">
          {vs && (
            <div className="drive__virtual-shift">
              <Toggle
                checked={virtual}
                onChange={(on) => setVirtualFor(on ? spec.id : null)}
                label={vs.label}
                description={s.virtualSuspended ? `Paused while ${boostSpec?.label ?? 'the boost'} runs` : `Simulated ${vs.transmission.overallRatios.length}-speed shifts`}
              />
            </div>
          )}
          {!singleSpeed && (
            <Segmented
              ariaLabel="Gear-shift mode"
              value={mode}
              onChange={app.setShiftMode}
              options={[
                { value: 'auto', label: 'Auto' },
                { value: 'manual', label: 'Manual' },
              ]}
            />
          )}
          <Button icon="reset" onClick={reset}>
            Reset
          </Button>
        </div>
      </div>

      <div className="drive__cluster panel">
        <div className="drive__gauge drive__gauge--side">
          <ArcGauge
            value={s.speedKmh}
            min={0}
            max={dial.max}
            majorStep={dial.step}
            minorPerMajor={4}
            labelFormat={fmtSpeed}
            color={color}
            ariaLabel="Speed"
            ariaValueText={`${Math.round(s.speedKmh)} km/h`}
          >
            <div className="readout">
              <span className="readout__big">{Math.round(s.speedKmh)}</span>
              <span className="readout__unit">km/h</span>
            </div>
          </ArcGauge>
          <div className="drive__gauge-title">Speed</div>
        </div>

        <div className="drive__gauge drive__gauge--main">
          {!singleSpeed && <ShiftLights rpm={s.rpm} shiftRpm={shiftRpm} />}
          <ArcGauge
            value={s.rpm / 1000}
            min={0}
            max={tachMax}
            majorStep={1}
            minorPerMajor={5}
            labelFormat={fmtTach}
            zones={tachZones}
            color={color}
            ariaLabel={virtual ? 'Simulated engine speed' : ev ? 'Motor speed' : 'Engine speed'}
            ariaValueText={`${Math.round(s.rpm)} rpm`}
          >
            <div className="readout readout--gear">
              <span className="readout__mode">{ev && !virtual ? 'EV' : mode === 'auto' ? 'D' : 'M'}</span>
              <span className={`readout__gear ${s.shifting ? 'is-shifting' : ''}`}>{s.gear}</span>
              <span className="readout__rpm">{fmt(Math.round(s.rpm / 10) * 10)} rpm</span>
            </div>
          </ArcGauge>
          <div className="drive__gauge-title">{virtual ? 'Simulated RPM ×1000' : ev ? 'Motor rpm ×1000' : 'RPM ×1000'}</div>
          {flash && (
            <div className="drive__flash" role="status">
              <Icon name="warning" size={18} /> {flash}
            </div>
          )}
        </div>

        <div className="drive__gauge drive__gauge--side">
          {ev ? (
            <>
              <ArcGauge
                value={s.motorPowerKw}
                min={0}
                max={powerMax}
                majorStep={100}
                minorPerMajor={4}
                labelFormat={fmtTach}
                color={color}
                ariaLabel="Motor power"
                ariaValueText={`${Math.round(s.motorPowerKw)} kW`}
              >
                <div className="readout">
                  <span className="readout__big readout__big--sm">{fmt(Math.round(s.motorPowerKw))}</span>
                  <span className="readout__unit">kW{s.boostActive ? ' · boost' : ''}</span>
                </div>
              </ArcGauge>
              <div className="drive__gauge-title">Power</div>
            </>
          ) : (
          <>
          <ArcGauge
            value={s.boostBar}
            min={BOOST_MIN}
            max={boostMax}
            majorStep={1}
            minorPerMajor={4}
            labelFormat={fmtBoost}
            zones={boostZones}
            origin={0}
            color={color}
            ariaLabel="Boost pressure"
            ariaValueText={`${s.boostBar.toFixed(2)} bar`}
          >
            <div className="readout">
              <span className="readout__big readout__big--sm">{s.boostBar >= 0 ? '+' : '−'}{Math.abs(s.boostBar).toFixed(2)}</span>
              <span className="readout__unit">bar boost</span>
            </div>
          </ArcGauge>
          <div className="drive__gauge-title">Boost</div>
          </>
          )}
        </div>

        <div className="drive__telemetry">
          <TelemetryRow label={ev ? (ev.motors.length > 1 ? 'Rear motor torque' : 'Motor torque') : 'Engine torque'} value={`${fmt(Math.max(0, s.engineTorqueNm))} Nm`} />
          <TelemetryRow label="Wheel power" value={`${fmt(kwToPs(s.wheelPowerKw))} PS`} />
          <TelemetryRow label="Long. accel" value={`${s.accelG >= 0 ? '' : '−'}${Math.abs(s.accelG).toFixed(2)} g`}>
            <div className="gbar" aria-hidden="true">
              <div className="gbar__fill" style={{ transform: `scaleX(${Math.max(-1, Math.min(1, s.accelG))})`, background: color }} />
            </div>
          </TelemetryRow>
          <div className="lights" aria-label="Warning lights">
            <Light on={s.tractionLimited} label="TC" tone="warning" title="Traction control active" />
            <Light on={s.speedLimited} label="LIM" tone="warning" title="Speed limiter" />
            {(!ev || virtual) && <Light on={s.fuelCut} label="REV" tone="critical" title={virtual ? 'Simulated rev limiter' : 'Rev limiter'} />}
            {ev?.boost && <Light on={s.boostActive} label="BST" tone="good" title="Published boost active" />}
            {ev?.boost?.armed && <Light on={s.launchPrimed} label="LC" tone="good" title="Launch control ready — release the brake to launch with the boost" />}
            <Light on={s.autoHold} label="HOLD" tone="good" title="Auto Hold (released by the throttle)" />
            {!ev && <Light on={s.coupling === 'locked' && !s.clutchOpen} label={vehicle.transmission.torqueConverter ? 'L/U' : 'CLU'} tone="good" title={vehicle.transmission.torqueConverter ? 'Converter lock-up' : 'Clutch closed'} />}
          </div>
        </div>
      </div>

      <RoadView distanceM={s.distanceM} speedKmh={s.speedKmh} timeS={s.timeS} color={color} traffic={s.traffic} auto={auto} lane={s.lane} />
      <p className={`drive__assist-note drive__assist-note--${status.tone}`}>
        <strong role="status">{status.title}</strong>
        <span>{status.detail}</span>
        <span className="drive__odo">{fmt(s.distanceM / 1000, 2)} km</span>
      </p>
      <AssistBar
        auto={auto}
        traffic={s.traffic}
        onToggleAuto={toggleAuto}
        onTraffic={(m) => setTraffic(m)}
        onReroll={() => setSeed(1 + Math.floor(Math.random() * 9999))}
        onRoad={setRoad}
      />

      <div className="drive__controls">
        <div className="drive__pedal-col">
          <LaneButton direction={-1} onPress={() => lane(-1)} changing={s.lane.signal < 0} />
          <Pedal kind="brake" value={s.brake} onChange={(v) => setPedal('pointer', 'brake', v)} keyHint={automated ? 'Cancels' : '↓ / S'} />
        </div>

        <div className="drive__center">
          <div className="paddles">
            {!singleSpeed && <Paddle direction={-1} onShift={doShift} label="Shift down" title="Shift down (Q or ←)" />}
            {singleSpeed && boostControl && <span aria-hidden="true" />}
            <div className="paddles__gear">
              <span className="paddles__gear-label">{singleSpeed ? 'Single-speed' : mode === 'auto' ? 'Automatic' : 'Manual'}</span>
              <span className="paddles__tune" title="Change in Tuning">{describeTuning(spec, app.tuningFor(spec.id))}</span>
              <span className="paddles__gear-value">
                {s.gear}
                <small>/{s.gearCount}</small>
              </span>
            </div>
            {!singleSpeed && <Paddle direction={1} onShift={doShift} label="Shift up" title="Shift up (E or →)" />}
            {/* Single-speed drive: the boost button takes the free paddle slot instead of a row of its own. */}
            {singleSpeed && boostControl}
          </div>

          {boostControl && !singleSpeed && boostControl}

          <CruisePanel cruise={s.cruise} onAction={cruiseAction} />

          <div className="timer panel">
            <div className="timer__head">
              <span className="timer__title">Performance timer</span>
              <Badge tone={timer.status === 'running' ? 'good' : timer.armed ? 'reported' : 'neutral'}>
                {timer.status === 'running' ? 'Recording' : timer.armed ? 'Armed — launch' : 'Stop to arm'}
              </Badge>
            </div>
            <div className="timer__grid">
              <TimerCell label="0–100" value={fmtSeconds(m.zeroTo100KmhS)} />
              <TimerCell label="0–200" value={fmtSeconds(m.zeroTo200KmhS)} />
              <TimerCell label="¼ mile" value={fmtSeconds(m.quarterMileS)} />
              <TimerCell label="Elapsed" value={fmtSeconds(timer.elapsedS, 1)} />
            </div>
            <Button icon="save" variant="primary" onClick={saveRun} disabled={!canSave} className="timer__save">
              Save run
            </Button>
          </div>
        </div>

        <div className="drive__pedal-col">
          <LaneButton direction={1} onPress={() => lane(1)} changing={s.lane.signal > 0} />
          <Pedal kind="throttle" value={s.throttle} onChange={(v) => setPedal('pointer', 'throttle', v)} keyHint={auto.engaged ? 'Auto Drive' : s.cruise.state === 'cruise' ? 'Cruise' : '↑ / W'} />
        </div>
      </div>

    </div>
  );
}

const CANCEL_TEXT: Record<DisengageReason, string> = {
  brake: 'Cancelled — brake pressed',
  switch: 'Auto Drive switched off',
  focus: 'Off — the app lost focus',
  reset: 'Off — car reset',
  vehicle: 'Off — car changed',
};

const LEVEL_TEXT: Record<string, string> = { 'very-sparse': 'very sparse', sparse: 'sparse', mid: 'mid', heavy: 'heavy', jam: 'congestion' };

function leadText(t: TrafficView): string {
  const l = t.lead;
  if (!l) return t.mode === 'off' ? 'No traffic' : 'Lane clear';
  const gap = l.timeGapS !== null ? `${fmt(Math.max(0, l.gapM))} m · ${l.timeGapS.toFixed(1)} s gap` : `${fmt(Math.max(0, l.gapM))} m`;
  return `${l.cutIn ? 'Cut-in ' : 'Lead '}${fmt(l.speedKmh)} km/h · ${gap}`;
}

function trafficText(t: TrafficView): string {
  const road = `${t.road.preset === 'taiwan' ? 'Taiwan' : 'Autobahn'} ${t.road.limitKmh === null ? 'no limit' : `${t.road.limitKmh} km/h`}`;
  const level = t.mode === 'auto' && t.level ? ` · Auto: ${LEVEL_TEXT[t.level]}` : '';
  const scenario = t.note ? ` · ${t.note}` : '';
  return `${road}${level}${scenario}`;
}

/** One-line status for the HUD under the road: Auto Drive or cruise state, the lead and the traffic setting. */
function autoDriveStatus(a: AutoDriveView, c: CruiseView, t: TrafficView): { tone: 'off' | 'good' | 'warning' | 'critical'; title: string; detail: string } {
  const pedals = a.brake > 0.005 ? `brake ${fmt(a.brake * 100)} %` : `throttle ${fmt(a.throttle * 100)} %`;
  if (!a.engaged && c.state === 'cruise') {
    return {
      tone: 'good',
      title: a.override ? `Cruise ${c.setKmh} km/h · accelerator override` : `Cruise ${c.setKmh} km/h`,
      detail: `Holds the set speed with the accelerator only (coasts above it; you brake for traffic) · requested ${pedals} · ${leadText(t)} · ${trafficText(t)}`,
    };
  }
  if (!a.engaged) {
    const recent = a.lastDisengage && a.lastDisengage.agoS < 4 ? a.lastDisengage : null;
    return {
      tone: recent?.reason === 'brake' ? 'warning' : 'off',
      title: recent ? CANCEL_TEXT[recent.reason] : 'Auto Drive off',
      detail:
        t.mode === 'off'
          ? 'Auto Drive is a simulator aid that works the accelerator and brake for you: 100 % throttle when the lane is clear, a 2-second gap behind traffic, and the cruise set speed as an optional cap. Gears, lanes and drivetrain stay yours. Brake or tap Auto Drive (A) to cancel.'
          : `${leadText(t)} · ${trafficText(t)} · Auto Drive is a simulator aid for accelerator and brake; brake or tap it to cancel.`,
    };
  }
  const cap = c.state === 'cap' ? ` · cap ${c.setKmh} km/h` : '';
  const title = a.override
    ? 'Driver override'
    : a.mode === 'braking'
      ? 'Braking'
      : a.mode === 'stopped'
        ? 'Holding behind lead'
        : a.mode === 'following'
          ? 'Following'
          : a.mode === 'cruising'
            ? 'Holding the set speed'
            : 'Accelerating';
  const tone = a.mode === 'braking' || a.mode === 'stopped' ? 'critical' : a.mode === 'following' ? 'warning' : 'good';
  return { tone, title: `${title}${cap}`, detail: `${leadText(t)} · requested ${pedals} · ${trafficText(t)}` };
}

function TelemetryRow({ label, value, children }: { label: string; value: string; children?: React.ReactNode }) {
  return (
    <div className="telemetry-row">
      <span className="telemetry-row__label">{label}</span>
      <span className="telemetry-row__value">{value}</span>
      {children}
    </div>
  );
}

function TimerCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="timer__cell">
      <span className="timer__label">{label}</span>
      <span className="timer__value">{value}</span>
    </div>
  );
}

function Light({ on, label, tone, title }: { on: boolean; label: string; tone: 'warning' | 'critical' | 'good'; title: string }) {
  return (
    <span className={`light ${on ? `is-on light--${tone}` : ''}`} title={title} aria-label={`${title}: ${on ? 'on' : 'off'}`}>
      {label}
    </span>
  );
}
