import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArcGauge, type GaugeZone } from '../components/ArcGauge';
import { Icon } from '../components/Icon';
import { Paddle } from '../components/Paddle';
import { Pedal } from '../components/Pedal';
import { ShiftLights } from '../components/ShiftLights';
import { CarSwitcher } from '../components/catalog/CarPicker';
import { Badge, Button, Segmented } from '../components/ui';
import { useDriveSimulation } from '../hooks/useDriveSimulation';
import { STATUS, seriesColor } from '../lib/colors';
import { fmt, fmtSeconds } from '../lib/format';
import { speedDial } from '../lib/speedDial';
import { computeDyno, topSpeedKmh } from '../physics/dyno';
import { kwToPs } from '../physics/units';
import { useApp } from '../state/AppState';
import { describeTuning } from '../tuning/tuning';

const BOOST_MIN = -1;

export function DriveView() {
  const app = useApp();
  const spec = app.activeVehicle;
  const vehicle = app.simVehicle(spec.id);
  const mode = app.settings.shiftMode;
  const { snapshot: s, setPedal, shift, reset, runSamples } = useDriveSimulation(vehicle, mode);
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
      else return;
      e.preventDefault();
    };
    const up = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === 'arrowup' || k === 'w') setPedal('key', 'throttle', 0);
      else if (k === 'arrowdown' || k === 's') setPedal('key', 'brake', 0);
    };
    const blur = () => {
      setPedal('key', 'throttle', 0);
      setPedal('key', 'brake', 0);
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', blur);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', blur);
    };
  }, [setPedal, doShift, reset, app, mode]);

  const dyno = useMemo(() => computeDyno(vehicle), [vehicle]);
  const dial = useMemo(() => speedDial(topSpeedKmh(vehicle)), [vehicle]);
  const e = vehicle.engine;
  const tachMax = Math.ceil((e.revLimitRpm + 300) / 1000);
  const tachZones = useMemo<GaugeZone[]>(() => [{ from: e.redlineRpm / 1000, to: tachMax, color: STATUS.critical }], [e.redlineRpm, tachMax]);
  const boostMax = Math.max(2, Math.ceil(dyno.peakBoostBar + 0.4));
  const boostZones = useMemo<GaugeZone[]>(() => [{ from: BOOST_MIN, to: 0, color: '#3a3f46' }], []);
  const shiftRpm = mode === 'auto' ? vehicle.transmission.wotUpshiftRpm[Math.min(s.gear, s.gearCount) - 1] : e.redlineRpm;
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
      tuningLabel: describeTuning(spec, app.tuningFor(spec.id)),
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

  // Road texture scroll: one dash period = 12 m.
  const roadOffset = -((s.distanceM % 12) / 12) * 100;

  return (
    <div className="view drive">
      <div className="view__bar">
        <CarSwitcher value={spec.id} onChange={app.setActiveVehicle} label="Active car" />
        <div className="view__bar-actions">
          <Segmented
            ariaLabel="Gear-shift mode"
            value={mode}
            onChange={app.setShiftMode}
            options={[
              { value: 'auto', label: 'Auto' },
              { value: 'manual', label: 'Manual' },
            ]}
          />
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
          <ShiftLights rpm={s.rpm} shiftRpm={shiftRpm} />
          <ArcGauge
            value={s.rpm / 1000}
            min={0}
            max={tachMax}
            majorStep={1}
            minorPerMajor={5}
            labelFormat={fmtTach}
            zones={tachZones}
            color={color}
            ariaLabel="Engine speed"
            ariaValueText={`${Math.round(s.rpm)} rpm`}
          >
            <div className="readout readout--gear">
              <span className="readout__mode">{mode === 'auto' ? 'D' : 'M'}</span>
              <span className={`readout__gear ${s.shifting ? 'is-shifting' : ''}`}>{s.gear}</span>
              <span className="readout__rpm">{fmt(Math.round(s.rpm / 10) * 10)} rpm</span>
            </div>
          </ArcGauge>
          <div className="drive__gauge-title">RPM ×1000</div>
          {flash && (
            <div className="drive__flash" role="status">
              <Icon name="warning" size={18} /> {flash}
            </div>
          )}
        </div>

        <div className="drive__gauge drive__gauge--side">
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
        </div>

        <div className="drive__telemetry">
          <TelemetryRow label="Engine torque" value={`${fmt(Math.max(0, s.engineTorqueNm))} Nm`} />
          <TelemetryRow label="Wheel power" value={`${fmt(kwToPs(s.wheelPowerKw))} PS`} />
          <TelemetryRow label="Long. accel" value={`${s.accelG >= 0 ? '' : '−'}${Math.abs(s.accelG).toFixed(2)} g`}>
            <div className="gbar" aria-hidden="true">
              <div className="gbar__fill" style={{ transform: `scaleX(${Math.max(-1, Math.min(1, s.accelG))})`, background: color }} />
            </div>
          </TelemetryRow>
          <div className="lights" aria-label="Warning lights">
            <Light on={s.tractionLimited} label="TC" tone="warning" title="Traction control active" />
            <Light on={s.speedLimited} label="LIM" tone="warning" title="Speed limiter" />
            <Light on={s.fuelCut} label="REV" tone="critical" title="Rev limiter" />
            <Light on={s.autoHold} label="HOLD" tone="good" title="Auto Hold (released by the throttle)" />
            <Light on={s.coupling === 'locked' && !s.clutchOpen} label={vehicle.transmission.torqueConverter ? 'L/U' : 'CLU'} tone="good" title={vehicle.transmission.torqueConverter ? 'Converter lock-up' : 'Clutch closed'} />
          </div>
        </div>
      </div>

      <div className="drive__road" aria-hidden="true">
        <div className="drive__road-lines" style={{ transform: `translateX(${roadOffset}%)` }} />
        <div className="drive__road-car" style={{ background: color }} />
        <div className="drive__road-odo">{fmt(s.distanceM / 1000, 2)} km</div>
      </div>

      <div className="drive__controls">
        <Pedal kind="brake" value={s.brake} onChange={(v) => setPedal('pointer', 'brake', v)} keyHint="↓ / S" />

        <div className="drive__center">
          <div className="paddles">
            <Paddle direction={-1} onShift={doShift} label="Shift down" title="Shift down (Q or ←)" />
            <div className="paddles__gear">
              <span className="paddles__gear-label">{mode === 'auto' ? 'Automatic' : 'Manual'}</span>
              <span className="paddles__tune" title="Change in Tuning">{describeTuning(spec, app.tuningFor(spec.id))}</span>
              <span className="paddles__gear-value">
                {s.gear}
                <small>/{s.gearCount}</small>
              </span>
            </div>
            <Paddle direction={1} onShift={doShift} label="Shift up" title="Shift up (E or →)" />
          </div>

          <div className="timer panel">
            <div className="timer__head">
              <span className="timer__title">Performance timer</span>
              <Badge tone={timer.status === 'running' ? 'good' : timer.armed ? 'reported' : 'neutral'}>
                {timer.status === 'running' ? 'Recording' : timer.armed ? 'Armed — launch' : 'Stop to arm'}
              </Badge>
              <Button icon="save" variant="primary" onClick={saveRun} disabled={!canSave} className="timer__save">
                Save run
              </Button>
            </div>
            <div className="timer__grid">
              <TimerCell label="0–100" value={fmtSeconds(m.zeroTo100KmhS)} />
              <TimerCell label="0–200" value={fmtSeconds(m.zeroTo200KmhS)} />
              <TimerCell label="¼ mile" value={fmtSeconds(m.quarterMileS)} />
              <TimerCell label="Elapsed" value={fmtSeconds(timer.elapsedS, 1)} />
            </div>
          </div>
        </div>

        <Pedal kind="throttle" value={s.throttle} onChange={(v) => setPedal('pointer', 'throttle', v)} keyHint="↑ / W" />
      </div>

    </div>
  );
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
