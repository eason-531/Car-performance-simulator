import { useDeferredValue, useMemo } from 'react';
import { LineChart } from '../components/LineChart';
import { Icon } from '../components/Icon';
import { CarSwitcher } from '../components/catalog/CarPicker';
import { Badge, Button, Panel, Segmented, Slider, Toggle } from '../components/ui';
import { TIRE_COMPOUNDS } from '../data/tires';
import { seriesColor } from '../lib/colors';
import { fmt, fmtSigned } from '../lib/format';
import { DRIVER_MASS_KG } from '../physics/constants';
import { computeDyno, topSpeedKmh } from '../physics/dyno';
import { runAccelerationRun } from '../physics/runners';
import { useApp } from '../state/AppState';
import { buildSimVehicle } from '../tuning/buildSimVehicle';
import { TUNING_LIMITS, isStock, type EcuStage, type TuningConfig, type TuningOverrides } from '../tuning/tuning';

const WEIGHT_PRESETS = [
  { label: 'Driver only', kg: 0 },
  { label: '+1 passenger', kg: 75 },
  { label: '+2 passengers', kg: 150 },
  { label: 'Family + luggage', kg: 350 },
];

export function TuningView() {
  const app = useApp();
  const spec = app.activeVehicle;
  const tuning = app.tuningFor(spec.id);
  const deferred = useDeferredValue(tuning);
  const color = seriesColor(spec.colorSlot ?? 0);
  const launch = app.settings.launch;

  const update = (patch: Partial<TuningConfig>) => app.setTuning(spec.id, { ...tuning, ...patch });
  const updateOverride = (patch: Partial<TuningOverrides>) => update({ overrides: { ...tuning.overrides, ...patch } });

  const stockVehicle = app.simVehicle(spec.id, 'stock');
  const tunedVehicle = useMemo(() => buildSimVehicle(spec, deferred), [spec, deferred]);
  const stockPerf = useMemo(() => perf(stockVehicle, launch), [stockVehicle, launch]);
  const tunedPerf = useMemo(() => perf(tunedVehicle, launch), [tunedVehicle, launch]);
  const stale = deferred !== tuning;

  const peakTorque = tunedPerf.dyno.peakTorqueNm;
  const overGearbox = peakTorque > spec.transmission.ratedInputTorqueNm + 0.5;

  return (
    <div className="view tuning">
      <div className="view__bar">
        <CarSwitcher value={spec.id} onChange={app.setActiveVehicle} label="Car to tune" />
        <div className="view__bar-actions">
          {isStock(spec, tuning) ? (
            <Badge tone="neutral">Stock configuration</Badge>
          ) : (
            <Button icon="reset" onClick={() => app.resetTuning(spec.id)}>
              Reset to stock
            </Button>
          )}
        </div>
      </div>

      <div className="tuning__layout">
        <div className="tuning__controls">
          <Panel title={spec.electric ? 'Electric drive' : 'ECU calibration'} subtitle={`${spec.engine.code} · ${spec.engine.description}`}>
            {spec.electric ? (
              <>
                <p className="help">
                  {spec.electric.motors.length} motor{spec.electric.motors.length > 1 ? 's' : ''} (
                  {spec.electric.motors.map((m) => `${m.axle} ${fmt(m.peakPowerKw)} kW`).join(' + ')}), shared limit {fmt(spec.electric.systemPowerKw)} kW.
                  There is no ECU stage for electric cars; the power adjustment scales the motors and the shared limits together.
                </p>
                {spec.electric.boost?.trigger === 'driver' && (
                  <Toggle
                    checked={tuning.electricBoostArmed ?? spec.electric.boost.armedByDefault ?? false}
                    onChange={(electricBoostArmed) => update({ electricBoostArmed })}
                    label={`${spec.electric.boost.label} (${fmt(spec.electric.boost.systemPowerKw)} kW for ${spec.electric.boost.durationS} s)`}
                    description="Armed: the boost fires on the next full-throttle pull."
                  />
                )}
                {spec.electric.boost?.trigger === 'launch-control' && (
                  <p className="help">
                    {spec.electric.boost.label}: {fmt(spec.electric.boost.systemPowerKw)} kW for {spec.electric.boost.durationS} s after a launch-control
                    (brake-held) start.
                  </p>
                )}
              </>
            ) : (
              <>
            <Segmented<EcuStage>
              size="lg"
              ariaLabel="ECU stage"
              value={tuning.ecuStage}
              onChange={(ecuStage) => update({ ecuStage })}
              options={[
                { value: 'stock', label: <StageLabel title="Stock" detail={`${fmt(spec.engine.rated.powerPs)} PS · ${fmt(spec.engine.rated.torqueNm)} Nm`} /> },
                {
                  value: 'stage1',
                  disabled: !spec.stage1,
                  label: spec.stage1 ? (
                    <StageLabel title="Stage 1" detail={`≈${spec.stage1.claimedPowerPs} PS · ${spec.stage1.claimedTorqueNm} Nm`} />
                  ) : (
                    <StageLabel title="Stage 1" detail="Not offered for this car" />
                  ),
                },
              ]}
            />
            <p className="help">
              {tuning.ecuStage === 'stage1' && spec.stage1
                ? spec.stage1.description
                : spec.stage1
                  ? 'Factory calibration.'
                  : 'Factory calibration. No Stage 1 is modelled for this configuration because no credible, documented calibration was found.'}
            </p>
              </>
            )}
            <Slider
              label="Power adjustment"
              value={tuning.powerAdjustPct}
              min={TUNING_LIMITS.powerAdjustPct.min}
              max={TUNING_LIMITS.powerAdjustPct.max}
              step={TUNING_LIMITS.powerAdjustPct.step}
              onChange={(powerAdjustPct) => update({ powerAdjustPct })}
              format={(v) => `${v > 0 ? '+' : ''}${v} %`}
              hint={spec.electric ? 'Scales every motor and the shared output limit.' : 'Scales the whole torque curve (and boost) — e.g. fuel quality, intake/exhaust, or a dyno-measured offset.'}
              onReset={() => update({ powerAdjustPct: 0 })}
              modified={tuning.powerAdjustPct !== 0}
            />
            {overGearbox && (
              <div className="callout callout--warning" role="note">
                <Icon name="warning" size={18} />
                <span>
                  {fmt(peakTorque)} Nm exceeds the {spec.transmission.name.split(' (')[0]} rating of about{' '}
                  {spec.transmission.ratedInputTorqueNm} Nm. Real cars typically need a gearbox (TCU) calibration.
                </span>
              </div>
            )}
          </Panel>

          <Panel title="Tires">
            <div className="option-grid" role="radiogroup" aria-label="Tire size">
              {spec.tires.sizes.map((size) => (
                <button
                  key={size.id}
                  type="button"
                  role="radio"
                  aria-checked={tuning.tireSizeId === size.id}
                  className={`option ${tuning.tireSizeId === size.id ? 'is-active' : ''}`}
                  onClick={() => update({ tireSizeId: size.id })}
                >
                  <span className="option__title">{size.label}</span>
                  <span className="option__meta">{size.note}</span>
                </button>
              ))}
            </div>
            <div className="option-grid option-grid--compound" role="radiogroup" aria-label="Tire compound">
              {TIRE_COMPOUNDS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  role="radio"
                  aria-checked={tuning.tireCompoundId === c.id}
                  className={`option ${tuning.tireCompoundId === c.id ? 'is-active' : ''}`}
                  onClick={() => update({ tireCompoundId: c.id })}
                >
                  <span className="option__title">{c.label}</span>
                  <span className="option__meta">μ {c.mu.toFixed(2)} · {c.description}</span>
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Weight" subtitle={`Curb ${fmt(spec.chassis.curbMassKg)} kg + ${DRIVER_MASS_KG} kg driver`}>
            <Slider
              label="Added / removed weight"
              value={tuning.weightDeltaKg}
              min={TUNING_LIMITS.weightDeltaKg.min}
              max={TUNING_LIMITS.weightDeltaKg.max}
              step={TUNING_LIMITS.weightDeltaKg.step}
              onChange={(weightDeltaKg) => update({ weightDeltaKg })}
              format={(v) => `${v > 0 ? '+' : ''}${v} kg`}
              hint={`Test mass ${fmt(spec.chassis.curbMassKg + DRIVER_MASS_KG + tuning.weightDeltaKg)} kg. Negative values model weight reduction or a lighter trim.`}
              onReset={() => update({ weightDeltaKg: 0 })}
              modified={tuning.weightDeltaKg !== 0}
            />
            <div className="chips">
              {WEIGHT_PRESETS.map((p) => (
                <button key={p.label} type="button" className={`chip ${tuning.weightDeltaKg === p.kg ? 'is-active' : ''}`} onClick={() => update({ weightDeltaKg: p.kg })}>
                  {p.label}
                </button>
              ))}
            </div>
          </Panel>

          {spec.speedLimiterKmh !== null && (
            <Panel title="Speed limiter">
              <Toggle
                checked={tuning.speedLimiter}
                onChange={(speedLimiter) => update({ speedLimiter })}
                label={`Factory limiter at ${spec.speedLimiterKmh} km/h`}
                description="Turn off to see the drag-limited top speed."
              />
            </Panel>
          )}

          <Panel title="Estimated parameters" subtitle="Values not published by the manufacturer — adjust if you have better data">
            <Slider
              label="Drag coefficient (Cd)"
              value={tuning.overrides.dragCoefficient ?? spec.aero.dragCoefficient}
              {...TUNING_LIMITS.dragCoefficient}
              onChange={(v) => updateOverride({ dragCoefficient: v })}
              format={(v) => v.toFixed(3)}
              hint={`Vehicle data: ${spec.aero.dragCoefficient.toFixed(3)}`}
              onReset={() => updateOverride({ dragCoefficient: null })}
              modified={tuning.overrides.dragCoefficient !== null}
            />
            <Slider
              label="Frontal area"
              value={tuning.overrides.frontalAreaM2 ?? spec.aero.frontalAreaM2}
              {...TUNING_LIMITS.frontalAreaM2}
              onChange={(v) => updateOverride({ frontalAreaM2: v })}
              format={(v) => `${v.toFixed(2)} m²`}
              hint={`Vehicle data: ${spec.aero.frontalAreaM2.toFixed(2)} m²`}
              onReset={() => updateOverride({ frontalAreaM2: null })}
              modified={tuning.overrides.frontalAreaM2 !== null}
            />
            <Slider
              label="Drivetrain efficiency"
              value={tuning.overrides.drivetrainEfficiency ?? spec.drivetrain.efficiency}
              {...TUNING_LIMITS.drivetrainEfficiency}
              onChange={(v) => updateOverride({ drivetrainEfficiency: v })}
              format={(v) => `${(v * 100).toFixed(1)} %`}
              hint={`Vehicle data: ${(spec.drivetrain.efficiency * 100).toFixed(1)} % (crank to wheel)`}
              onReset={() => updateOverride({ drivetrainEfficiency: null })}
              modified={tuning.overrides.drivetrainEfficiency !== null}
            />
          </Panel>
        </div>

        <aside className={`tuning__summary ${stale ? 'is-stale' : ''}`} aria-busy={stale}>
          <Panel title="Predicted performance" subtitle={`${launch === 'brake-boost' ? 'Brake-boost' : 'Standard'} launch · vs stock`}>
            <div className="compare-list">
              <CompareRow label="Peak power" stock={stockPerf.dyno.peakPowerPs} tuned={tunedPerf.dyno.peakPowerPs} unit="PS" digits={0} better="higher" />
              <CompareRow label="Peak torque" stock={stockPerf.dyno.peakTorqueNm} tuned={tunedPerf.dyno.peakTorqueNm} unit="Nm" digits={0} better="higher" />
              <CompareRow label="Test mass" stock={stockVehicle.massKg} tuned={tunedVehicle.massKg} unit="kg" digits={0} better="lower" />
              <CompareRow label="Power-to-weight" stock={stockPerf.psPerTonne} tuned={tunedPerf.psPerTonne} unit="PS/t" digits={0} better="higher" />
              <CompareRow label="0–100 km/h" stock={stockPerf.m.zeroTo100KmhS} tuned={tunedPerf.m.zeroTo100KmhS} unit="s" digits={2} better="lower" />
              <CompareRow label="0–200 km/h" stock={stockPerf.m.zeroTo200KmhS} tuned={tunedPerf.m.zeroTo200KmhS} unit="s" digits={2} better="lower" />
              <CompareRow label="¼ mile" stock={stockPerf.m.quarterMileS} tuned={tunedPerf.m.quarterMileS} unit="s" digits={2} better="lower" />
              <CompareRow label="¼ mile trap" stock={stockPerf.m.quarterMileTrapKmh} tuned={tunedPerf.m.quarterMileTrapKmh} unit="km/h" digits={1} better="higher" />
              <CompareRow label="Top speed" stock={stockPerf.vmax} tuned={tunedPerf.vmax} unit="km/h" digits={0} better="higher" />
            </div>
          </Panel>
          <Panel title="Power curve" subtitle="Crank PS vs rpm">
            <LineChart
              ariaLabel="Tuned versus stock power curve"
              series={[
                { id: 'stock', label: 'Stock', color, dashed: true, points: stockPerf.dyno.points.map((p) => ({ x: p.rpm, y: p.powerPs })) },
                { id: 'tuned', label: 'Current', color, points: tunedPerf.dyno.points.map((p) => ({ x: p.rpm, y: p.powerPs })) },
              ]}
              xLabel="rpm"
              yLabel="PS"
              height={210}
              xDomain={[1000, Math.ceil(spec.engine.revLimitRpm / 500) * 500]}
              xFormat={(v) => fmt(v)}
              yFormat={(v) => fmt(v)}
              valueFormat={(v) => `${fmt(v, 1)} PS`}
              directLabels={false}
            />
          </Panel>
          <p className="footnote">Tuning is saved automatically on this device and used by Drive, Tests, Drag Race and Dyno.</p>
        </aside>
      </div>
    </div>
  );
}

function perf(vehicle: ReturnType<typeof buildSimVehicle>, launch: 'brake-boost' | 'standard') {
  const dyno = computeDyno(vehicle);
  const m = runAccelerationRun(vehicle, { launch, targetSpeedKmh: 200, targetDistanceM: 402.336 }).metrics;
  return { dyno, m, vmax: topSpeedKmh(vehicle), psPerTonne: (dyno.peakPowerPs / vehicle.massKg) * 1000 };
}

function StageLabel({ title, detail }: { title: string; detail: string }) {
  return (
    <span className="stage-label">
      <span className="stage-label__title">{title}</span>
      <span className="stage-label__detail">{detail}</span>
    </span>
  );
}

function CompareRow({
  label,
  stock,
  tuned,
  unit,
  digits,
  better,
}: {
  label: string;
  stock: number | null;
  tuned: number | null;
  unit: string;
  digits: number;
  better: 'higher' | 'lower';
}) {
  const delta = stock !== null && tuned !== null ? tuned - stock : null;
  const threshold = 0.5 * 10 ** -digits;
  const improved = delta !== null && Math.abs(delta) >= threshold && (better === 'higher' ? delta > 0 : delta < 0);
  const worse = delta !== null && Math.abs(delta) >= threshold && !improved;
  return (
    <div className="compare-row">
      <span className="compare-row__label">{label}</span>
      <span className="compare-row__value">
        {tuned === null ? '—' : fmt(tuned, digits)} <small>{unit}</small>
      </span>
      <span className={`compare-row__delta ${improved ? 'is-better' : worse ? 'is-worse' : ''}`}>
        {delta === null || Math.abs(delta) < threshold ? '—' : `${delta > 0 ? '▲' : '▼'} ${fmtSigned(delta, digits)}`}
      </span>
    </div>
  );
}

