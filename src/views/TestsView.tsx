import { useMemo, useState } from 'react';
import { LineChart, type ChartSeries } from '../components/LineChart';
import { Badge, Button, Panel, Segmented, StatTile, Toggle, VehiclePicker } from '../components/ui';
import { usePlayback } from '../hooks/usePlayback';
import { seriesColor } from '../lib/colors';
import { fmt, fmtSeconds, fmtSigned } from '../lib/format';
import { computeDyno } from '../physics/dyno';
import { runAccelerationRun, sampleAt, type LaunchTechnique, type TraceSample } from '../physics/runners';
import { useApp } from '../state/AppState';
import { describeTuning } from '../tuning/tuning';

const PLAYBACK_SPEED = 4;

const toPoints = (trace: readonly TraceSample[], key: keyof TraceSample, scale = 1) =>
  trace.map((p) => ({ x: p.t, y: (p[key] as number) * scale }));

export function TestsView() {
  const app = useApp();
  const spec = app.activeVehicle;
  const vehicle = app.simVehicle(spec.id);
  const launch = app.settings.launch;
  const tuning = app.tuningFor(spec.id);
  const other = app.vehicles.find((v) => v.id !== spec.id);
  const [overlay, setOverlay] = useState(false);
  const [hoverX, setHoverX] = useState<number | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);

  const result = useMemo(() => runAccelerationRun(vehicle, { launch }), [vehicle, launch]);
  const otherVehicle = other ? app.simVehicle(other.id) : null;
  const otherResult = useMemo(
    () => (overlay && otherVehicle ? runAccelerationRun(otherVehicle, { launch }) : null),
    [overlay, otherVehicle, launch],
  );
  const dyno = useMemo(() => computeDyno(vehicle), [vehicle]);
  const playback = usePlayback(result.durationS, PLAYBACK_SPEED);
  const t = playback.time;
  const configKey = `${spec.id}|${launch}|${JSON.stringify(tuning)}`;
  const saved = savedKey === configKey;

  const m = result.metrics;
  const shown = (x: number | null): number | null => (x === null ? null : t === null || x <= t ? x : null);
  const live = t !== null ? sampleAt(result.trace, t) : null;
  const color = seriesColor(spec.colorSlot);

  const speedSeries: ChartSeries[] = [
    { id: spec.id, label: spec.shortName, color, points: toPoints(result.trace, 'speedKmh') },
  ];
  if (otherResult && other) {
    speedSeries.push({
      id: other.id,
      label: other.shortName,
      color: seriesColor(other.colorSlot),
      dashed: true,
      points: toPoints(otherResult.trace, 'speedKmh'),
    });
  }
  const xMax = Math.max(result.durationS, otherResult?.durationS ?? 0);
  const xDomain = [0, Math.ceil(xMax)] as const;

  const save = () => {
    app.saveResult({
      source: 'test',
      vehicleId: spec.id,
      vehicleName: spec.shortName,
      colorSlot: spec.colorSlot,
      tuningLabel: describeTuning(spec, tuning),
      tuning,
      launch,
      powerPs: dyno.peakPowerPs,
      torqueNm: dyno.peakTorqueNm,
      massKg: vehicle.massKg,
      metrics: m,
      trace: result.trace,
    });
    setSavedKey(configKey);
    app.notify('Test result saved', 'good');
  };

  const delta100 = m.zeroTo100KmhS !== null ? m.zeroTo100KmhS - spec.factory.zeroTo100S : null;

  return (
    <div className="view tests">
      <div className="view__bar">
        <VehiclePicker vehicles={app.vehicles} value={spec.id} onChange={app.setActiveVehicle} />
        <div className="view__bar-actions">
          <Segmented<LaunchTechnique>
            ariaLabel="Launch technique"
            value={launch}
            onChange={app.setLaunch}
            options={[
              { value: 'brake-boost', label: 'Brake-boost launch' },
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
        </div>
      </div>

      <div className="tests__hero">
        <StatTile
          emphasis
          label="0–100 km/h"
          value={fmt(shown(m.zeroTo100KmhS), 2)}
          unit="s"
          sub={
            delta100 !== null && shown(m.zeroTo100KmhS) !== null
              ? `Factory ${spec.factory.zeroTo100S.toFixed(1)} s (${fmtSigned(delta100, 2, ' s')})`
              : `Factory ${spec.factory.zeroTo100S.toFixed(1)} s`
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
                {fmt(live.t, 1)} s · Gear {live.gear} · {fmt(Math.round(live.rpm / 10) * 10)} rpm
              </div>
              <div className="progress">
                <div className="progress__fill" style={{ transform: `scaleX(${live.t / result.durationS})`, background: color }} />
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
        <MetricChip label="Max speed in run" value={`${fmt(t === null ? m.topSpeedKmh : live?.speedKmh ?? 0)} km/h`} />
      </div>

      <Panel
        title="Speed"
        subtitle="Full throttle, automatic shifts, clock starts at brake release"
        actions={
          <div className="panel__actions-row">
            {other && <Toggle checked={overlay} onChange={setOverlay} label={`Overlay ${other.shortName}`} />}
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
          revealX={t ?? undefined}
          showLegend={speedSeries.length > 1}
        />
      </Panel>

      <div className="grid-2">
        <Panel title="Engine speed" subtitle="Shift pattern">
          <LineChart
            ariaLabel="Engine speed versus time"
            series={[{ id: 'rpm', label: 'rpm', color, points: toPoints(result.trace, 'rpm') }]}
            xLabel="s"
            yLabel="rpm"
            xDomain={xDomain}
            yDomain={[0, Math.ceil(vehicle.engine.revLimitRpm / 1000) * 1000]}
            height={200}
            xFormat={(v) => fmt(v)}
            yFormat={(v) => fmt(v)}
            valueFormat={(v) => `${fmt(v)} rpm`}
            hoverX={hoverX}
            onHoverX={setHoverX}
            revealX={t ?? undefined}
            directLabels={false}
          />
        </Panel>
        <Panel title="Boost" subtitle="Turbo spool and shifts">
          <LineChart
            ariaLabel="Boost pressure versus time"
            series={[{ id: 'boost', label: 'boost', color, points: toPoints(result.trace, 'boostBar') }]}
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
            revealX={t ?? undefined}
            directLabels={false}
          />
        </Panel>
      </div>

      <Panel title="Reference figures" subtitle="Published data for comparison with the simulation">
        <ul className="benchmarks">
          {spec.benchmarks.map((b, i) => (
            <li key={i} className="benchmarks__item">
              <Badge tone={b.kind === 'factory' ? 'neutral' : 'verified'}>{b.kind === 'factory' ? 'Factory' : 'Measured'}</Badge>
              <span className="benchmarks__label">{b.label}</span>
              <span className="benchmarks__value">{b.value}</span>
              <span className="benchmarks__source">{b.source}</span>
            </li>
          ))}
        </ul>
        <p className="footnote">
          Simulated times start at brake release with no 1-ft roll-out; magazine figures often subtract roll-out
          (≈0.3 s). Trap speed is the instantaneous speed at the line.
        </p>
      </Panel>
    </div>
  );
}

function MetricChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric-chip">
      <span className="metric-chip__label">{label}</span>
      <span className="metric-chip__value">{value}</span>
    </div>
  );
}

