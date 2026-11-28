import { useMemo, useState } from 'react';
import { PowertrainSound, SoundButton } from '../audio/PowertrainAudio';
import { CarPickerDialog, CarSwitcher } from '../components/catalog/CarPicker';
import { Icon } from '../components/Icon';
import { LineChart, type ChartSeries } from '../components/LineChart';
import { Badge, Button, Panel, Segmented, StatTile } from '../components/ui';
import { findEntry } from '../data/catalog';
import { BASIS_LABEL, TIMING_LABEL } from '../data/catalog/compare';
import type { PublishedResults } from '../data/catalog/types';
import { usePlayback } from '../hooks/usePlayback';
import { assignSeries } from '../lib/colors';
import { fmt, fmtSeconds, fmtSigned } from '../lib/format';
import { computeDyno } from '../physics/dyno';
import { electricGearCount } from '../physics/electric';
import type { TimingBasis } from '../physics/metrics';
import { launchThrottle, runAccelerationRun, sampleAt, type LaunchTechnique, type TraceSample } from '../physics/runners';
import { useApp } from '../state/AppState';
import type { CarChoice } from '../storage/settings';
import { describeTuning, isStock } from '../tuning/tuning';

const PLAYBACK_SPEED = 4;

const toPoints = (trace: readonly TraceSample[], key: keyof TraceSample, offset = 0) =>
  trace.filter((p) => p.t >= offset).map((p) => ({ x: p.t - offset, y: p[key] as number }));

/** Time at which the car has rolled one foot (start of a rollout-timed run). */
function rolloutOffset(trace: readonly TraceSample[]): number {
  const i = trace.findIndex((p) => p.distanceM >= 0.3048);
  if (i <= 0) return 0;
  const a = trace[i - 1];
  const b = trace[i];
  return a.t + ((0.3048 - a.distanceM) / (b.distanceM - a.distanceM)) * (b.t - a.t);
}

export function TestsView() {
  const app = useApp();
  const spec = app.activeVehicle;
  const vehicle = app.simVehicle(spec.id);
  const launch = app.settings.launch;
  const basis = app.settings.timingBasis;
  const tuning = app.tuningFor(spec.id);
  const compare = app.settings.testCompare;
  const [picking, setPicking] = useState(false);
  const [hoverX, setHoverX] = useState<number | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);

  const result = useMemo(() => runAccelerationRun(vehicle, { launch }), [vehicle, launch]);
  const compareVehicle = compare ? app.simVehicle(compare.vehicleId, compare.variant) : null;
  const compareResult = useMemo(() => (compareVehicle ? runAccelerationRun(compareVehicle, { launch }) : null), [compareVehicle, launch]);
  const dyno = useMemo(() => computeDyno(vehicle), [vehicle]);
  const playback = usePlayback(result.durationS, PLAYBACK_SPEED, result);
  const t = playback.time;
  const configKey = `${spec.id}|${launch}|${JSON.stringify(tuning)}`;
  const saved = savedKey === configKey;

  const m = basis === 'rollout-1ft' ? result.metricsRollout : result.metrics;
  const off = basis === 'rollout-1ft' ? rolloutOffset(result.trace) : 0;
  // Playback runs on the brake-release clock; shown times are on the chosen basis.
  const shown = (x: number | null): number | null => (x === null ? null : t === null || x + off <= t ? x : null);
  const live = t !== null ? sampleAt(result.trace, t) : null;

  const mainLabel = `${spec.shortName}${isStock(spec, tuning) ? '' : ' (tuned)'}`;
  const compareSpec = compare ? findEntry(compare.vehicleId)?.sim : undefined;
  const compareLabel = compareSpec && compare ? `${compareSpec.shortName}${compare.variant === 'stock' ? ' (stock)' : isStock(compareSpec, app.tuningFor(compareSpec.id)) ? '' : ' (tuned)'}` : '';
  const styles = assignSeries([
    { key: 'main', vehicleId: spec.id, homeSlot: spec.colorSlot },
    ...(compare ? [{ key: 'cmp', vehicleId: compare.vehicleId, homeSlot: compareSpec?.colorSlot }] : []),
  ]);
  const main = styles.get('main')!;
  const speedSeries: ChartSeries[] = [{ id: 'main', label: mainLabel, color: main.color, dashArray: main.dash, points: toPoints(result.trace, 'speedKmh', off) }];
  if (compareResult && compare) {
    const st = styles.get('cmp')!;
    const coff = basis === 'rollout-1ft' ? rolloutOffset(compareResult.trace) : 0;
    speedSeries.push({ id: 'cmp', label: compareLabel, color: st.color, dashArray: st.dash, points: toPoints(compareResult.trace, 'speedKmh', coff) });
  }
  const xMax = Math.max(result.durationS, compareResult?.durationS ?? 0);
  const xDomain = [0, Math.ceil(xMax)] as const;

  const save = () => {
    app.saveResult({
      source: 'test',
      vehicleId: spec.id,
      vehicleName: spec.shortName,
      colorSlot: spec.colorSlot ?? -1,
      tuningLabel: describeTuning(spec, tuning),
      tuning,
      launch,
      powerPs: dyno.peakPowerPs,
      torqueNm: dyno.peakTorqueNm,
      massKg: vehicle.massKg,
      metrics: result.metrics,
      trace: result.trace,
    });
    setSavedKey(configKey);
    app.notify('Test result saved (brake-release timing)', 'good');
  };

  // Electric cars: motor speed and motor power (with any published boost window) in place of engine speed and turbo boost.
  const el = vehicle.electric;
  const boostSpec = spec.electric?.boost;
  const boostStart = el ? result.trace.find((p) => p.boostActive) : undefined;
  const boostEnd = boostStart ? [...result.trace].reverse().find((p) => p.boostActive) : undefined;
  const motorMaxRpm = el ? Math.max(...el.motors.map((mo) => mo.maxRpm)) : 0;
  const powerMaxKw = el ? Math.ceil(((el.boost?.systemPowerW ?? el.systemPowerW) / 1000) * 1.05 / 100) * 100 : 0;
  const boostNote = !el
    ? null
    : !el.boost || !boostSpec
      ? 'No published boost on this car.'
      : el.boost.trigger === 'launch-control'
        ? launch === 'brake-boost'
          ? `${boostSpec.label} (${fmt(boostSpec.systemPowerKw)} kW) fires at brake release on this launch-control start for ${fmt(boostSpec.durationS, 1)} s.`
          : `${boostSpec.label} needs a launch-control (brake-held) start: not used on a standard launch.`
        : el.boost.armed
          ? `${boostSpec.label} linked to the launch: ${fmt(boostSpec.systemPowerKw)} kW for ${fmt(boostSpec.durationS)} s from brake release (set in Tuning).`
          : `${boostSpec.label} not used (stock comparison; whether published tests used it is not stated). Link it to launches in Tuning.`;

  const factory100 = spec.factory.zeroTo100S;
  const delta100 = m.zeroTo100KmhS !== null && factory100 !== null ? m.zeroTo100KmhS - factory100 : null;
  const entry = findEntry(spec.id);
  const chooseCompare = (choice: CarChoice | null) => app.setTestCompare(choice);

  return (
    <div className="view tests">
      <PowertrainSound spec={spec} frame={live && { ...live, throttle: launchThrottle(launch, live.t) }} />
      <div className="view__bar">
        <CarSwitcher value={spec.id} onChange={app.setActiveVehicle} label="Car to test" />
        <div className="view__bar-actions">
          <Segmented<LaunchTechnique>
            ariaLabel="Launch technique"
            value={launch}
            onChange={app.setLaunch}
            options={[
              { value: 'brake-boost', label: 'Best launch' },
              { value: 'standard', label: 'Standard launch' },
            ]}
          />
          {playback.playing ? (
            <Button icon="skip" onClick={playback.stop}>
              Skip
            </Button>
          ) : (
            <Button icon="play" variant="primary" onClick={() => playback.play()}>
              Run test
            </Button>
          )}
          <SoundButton />
        </div>
      </div>

      <div className="tests__basis">
        <Segmented<TimingBasis>
          ariaLabel="Timing basis"
          value={basis}
          onChange={app.setTimingBasis}
          options={[
            { value: 'brake-release', label: 'Brake release' },
            { value: 'rollout-1ft', label: '1-ft rollout (US magazines)' },
          ]}
        />
        <span className="footnote">
          Times shown: <strong>{BASIS_LABEL[basis]}</strong>.{' '}
          {basis === 'rollout-1ft'
            ? 'The clock starts after the car has moved one foot, as at a drag strip and in Car and Driver / MotorTrend tests.'
            : 'The clock starts when the brake is released (simulator baseline, saved results use this).'}
        </span>
      </div>

      <div className="tests__hero">
        <StatTile
          emphasis
          label="0–100 km/h"
          value={fmt(shown(m.zeroTo100KmhS), 2)}
          unit="s"
          sub={
            factory100 === null
              ? 'No factory 0–100 claim'
              : delta100 !== null && shown(m.zeroTo100KmhS) !== null
                ? `Factory ${factory100.toFixed(1)} s (${fmtSigned(delta100, 2, ' s')})`
                : `Factory ${factory100.toFixed(1)} s`
          }
        />
        <StatTile emphasis label="0–200 km/h" value={fmt(shown(m.zeroTo200KmhS), 2)} unit="s" sub={`100–200: ${fmtSeconds(shown(m.hundredTo200KmhS))}`} />
        <StatTile
          emphasis
          label="¼ mile"
          value={fmt(shown(m.quarterMileS), 2)}
          unit="s"
          sub={shown(m.quarterMileS) !== null ? `Trap ${fmt(m.quarterMileTrapKmh, 1)} km/h (${fmt((m.quarterMileTrapKmh ?? 0) / 1.609344, 1)} mph)` : 'Trap —'}
        />
        <div className="tests__live panel" aria-live="off">
          {live ? (
            <>
              <div className="tests__live-row">
                <span className="tests__live-big">{Math.round(live.speedKmh)}</span>
                <span className="tests__live-unit">km/h</span>
              </div>
              <div className="tests__live-meta">
                {el
                  ? `${fmt(live.t, 1)} s${electricGearCount(el) > 1 ? ` · Gear ${live.gear}` : ''} · motor ${fmt(Math.round(live.rpm / 10) * 10)} rpm · ${fmt(live.powerKw ?? 0)} kW${live.boostActive ? ' · boost' : ''}`
                  : `${fmt(live.t, 1)} s · Gear ${live.gear} · ${fmt(Math.round(live.rpm / 10) * 10)} rpm`}
              </div>
              <div className="progress">
                <div className="progress__fill" style={{ transform: `scaleX(${live.t / result.durationS})`, background: main.color }} />
              </div>
            </>
          ) : (
            <>
              <div className="tests__live-meta">Test setup</div>
              <div className="tests__setup">
                <span>{fmt(dyno.peakPowerPs)} PS</span>
                <span>{fmt(dyno.peakTorqueNm)} Nm</span>
                <span>{fmt(vehicle.massKg)} kg</span>
              </div>
              <div className="tests__live-meta">{describeTuning(spec, tuning)} · incl. 75 kg driver</div>
              {boostNote && <div className="tests__live-meta">{boostNote}</div>}
            </>
          )}
        </div>
      </div>

      <div className="tests__secondary">
        <MetricChip label="0–60 mph" value={fmtSeconds(shown(m.zeroTo60MphS))} />
        <MetricChip label="60 ft" value={fmtSeconds(shown(m.sixtyFootS))} />
        <MetricChip label="⅛ mile" value={shown(m.eighthMileS) !== null ? `${fmtSeconds(m.eighthMileS)} @ ${fmt(m.eighthMileTrapKmh)} km/h` : '—'} />
        <MetricChip label="1 km" value={shown(m.kilometerS) !== null ? `${fmtSeconds(m.kilometerS)} @ ${fmt(m.kilometerTrapKmh)} km/h` : '—'} />
        <MetricChip label="Peak accel" value={`${fmt(m.peakAccelG, 2)} g`} />
        <MetricChip label="Max speed in run" value={`${fmt(t === null ? m.topSpeedKmh : (live?.speedKmh ?? 0))} km/h`} />
      </div>

      <Panel
        title="Speed"
        subtitle={`Full throttle, automatic shifts · ${BASIS_LABEL[basis]}`}
        actions={
          <div className="panel__actions-row">
            {compare ? (
              <>
                <Button icon="search" onClick={() => setPicking(true)}>
                  {compareLabel}
                </Button>
                <Segmented<'current' | 'stock'>
                  ariaLabel="Comparison configuration"
                  value={compare.variant}
                  onChange={(variant) => chooseCompare({ ...compare, variant })}
                  options={[
                    { value: 'current', label: 'Its tune' },
                    { value: 'stock', label: 'Stock' },
                  ]}
                />
                <Button icon="close" variant="ghost" onClick={() => chooseCompare(null)} ariaLabel="Remove comparison" />
              </>
            ) : (
              <Button icon="plus" onClick={() => setPicking(true)}>
                Compare with…
              </Button>
            )}
            <Button icon={saved ? 'check' : 'save'} variant={saved ? 'ghost' : 'secondary'} onClick={save} disabled={saved || playback.playing}>
              {saved ? 'Saved' : 'Save result'}
            </Button>
          </div>
        }
      >
        <LineChart
          ariaLabel="Speed versus time"
          series={speedSeries}
          xLabel="s"
          yLabel="km/h"
          xDomain={xDomain}
          height={280}
          xFormat={(v) => fmt(v, v % 1 ? 1 : 0)}
          yFormat={(v) => fmt(v)}
          valueFormat={(v) => `${fmt(v, 1)} km/h`}
          markers={[
            { axis: 'y', value: 100, label: '100 km/h' },
            { axis: 'y', value: 200, label: '200 km/h' },
          ]}
          hoverX={hoverX}
          onHoverX={setHoverX}
          revealX={t === null ? undefined : t - off}
          showLegend={speedSeries.length > 1}
        />
      </Panel>
      {picking && (
        <CarPickerDialog
          title="Compare with…"
          selectedId={compare?.vehicleId}
          onSelect={(id) => chooseCompare({ vehicleId: id, variant: id === spec.id ? 'stock' : 'current' })}
          onClose={() => setPicking(false)}
        />
      )}

      <div className="grid-2">
        <Panel
          title={el ? (el.motors.length > 1 ? 'Rear motor speed' : 'Motor speed') : 'Engine speed'}
          subtitle={el ? (electricGearCount(el) > 1 ? 'Two-speed axle changes' : 'Single-speed reduction') : 'Shift pattern'}
        >
          <LineChart
            ariaLabel={el ? 'Motor speed versus time' : 'Engine speed versus time'}
            series={[{ id: 'rpm', label: 'rpm', color: main.color, points: toPoints(result.trace, 'rpm', off) }]}
            xLabel="s"
            yLabel="rpm"
            xDomain={xDomain}
            yDomain={[0, Math.ceil((el ? motorMaxRpm : vehicle.engine.revLimitRpm) / 1000) * 1000]}
            height={200}
            xFormat={(v) => fmt(v)}
            yFormat={(v) => fmt(v)}
            valueFormat={(v) => `${fmt(v)} rpm`}
            hoverX={hoverX}
            onHoverX={setHoverX}
            revealX={t === null ? undefined : t - off}
            directLabels={false}
          />
        </Panel>
        {el ? (
          <Panel title="Motor power" subtitle={boostSpec ? `${boostSpec.label} ${boostStart ? 'window marked' : 'not used on this run'}` : 'Shared output limit'}>
            <LineChart
              ariaLabel="Motor power versus time"
              series={[{ id: 'power', label: 'kW', color: main.color, points: toPoints(result.trace, 'powerKw', off) }]}
              xLabel="s"
              yLabel="kW"
              xDomain={xDomain}
              yDomain={[0, powerMaxKw]}
              height={200}
              xFormat={(v) => fmt(v)}
              yFormat={(v) => fmt(v)}
              valueFormat={(v) => `${fmt(v)} kW`}
              markers={
                boostStart && boostEnd && boostSpec
                  ? [
                      { axis: 'x', value: Math.max(0, boostStart.t - off), label: `${boostSpec.label} ${fmt(boostSpec.durationS, 1)} s` },
                      { axis: 'x', value: Math.max(0, boostEnd.t - off), label: '' },
                    ]
                  : []
              }
              hoverX={hoverX}
              onHoverX={setHoverX}
              revealX={t === null ? undefined : t - off}
              directLabels={false}
            />
          </Panel>
        ) : (
          <Panel title="Boost" subtitle="Turbo spool and shifts">
            <LineChart
              ariaLabel="Boost pressure versus time"
              series={[{ id: 'boost', label: 'boost', color: main.color, points: toPoints(result.trace, 'boostBar', off) }]}
              xLabel="s"
              yLabel="bar"
              xDomain={xDomain}
              yDomain={[-1, 2]}
              height={200}
              xFormat={(v) => fmt(v)}
              yFormat={(v) => fmt(v, 1)}
              valueFormat={(v) => `${fmt(v, 2)} bar`}
              hoverX={hoverX}
              onHoverX={setHoverX}
              revealX={t === null ? undefined : t - off}
              directLabels={false}
            />
          </Panel>
        )}
      </div>

      {entry && (
        <Panel
          title="Published reference figures"
          subtitle="Measured tests for this configuration — open the car in Garage for the side-by-side residuals"
          actions={
            <Button icon="garage" onClick={() => (window.location.hash = `/garage/${encodeURIComponent(spec.id)}`)}>
              Garage details
            </Button>
          }
        >
          {entry.benchmarks.length === 0 ? (
            <p className="help">No measured test transcribed for this car yet.</p>
          ) : (
            <ul className="benchmarks">
              {entry.benchmarks.map((b) => (
                <li key={b.id} className="benchmarks__item">
                  <Badge tone={b.match === 'exact' ? 'verified' : 'warning'}>{b.match === 'exact' ? 'Exact' : 'Equivalent'}</Badge>
                  <span className="benchmarks__label">{b.publication}</span>
                  <span className="benchmarks__value">{summarize(b.results)}</span>
                  <span className="benchmarks__source">
                    {TIMING_LABEL[b.timing]}
                    {b.deviation ? ` · ${b.deviation}` : ''}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {factory100 !== null && (
            <p className="footnote">
              <Icon name="info" size={14} /> Factory 0–100 km/h claim: {factory100.toFixed(1)} s.
            </p>
          )}
        </Panel>
      )}
    </div>
  );
}

function summarize(r: PublishedResults): string {
  const parts: string[] = [];
  if (r.zeroTo60MphS) parts.push(`0–60 mph ${r.zeroTo60MphS} s`);
  if (r.zeroTo100KmhS) parts.push(`0–100 km/h ${r.zeroTo100KmhS} s`);
  if (r.zeroTo100MphS) parts.push(`0–100 mph ${r.zeroTo100MphS} s`);
  if (r.quarterMileS) parts.push(`¼ mi ${r.quarterMileS} s${r.quarterMileTrapMph ? ` @ ${r.quarterMileTrapMph} mph` : r.quarterMileTrapKmh ? ` @ ${r.quarterMileTrapKmh} km/h` : ''}`);
  return parts.join(' · ') || '—';
}

function MetricChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric-chip">
      <span className="metric-chip__label">{label}</span>
      <span className="metric-chip__value">{value}</span>
    </div>
  );
}
