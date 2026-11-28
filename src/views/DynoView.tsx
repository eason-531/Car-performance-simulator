import { useMemo, useState } from 'react';
import { LineChart, type ChartSeries } from '../components/LineChart';
import { Button, Panel, Segmented, Swatch, Toggle } from '../components/ui';
import { usePlayback } from '../hooks/usePlayback';
import { assignSeries } from '../lib/colors';
import { getVehicle } from '../data/vehicles';
import { CarPickerDialog } from '../components/catalog/CarPicker';
import { Icon } from '../components/Icon';
import { fmt } from '../lib/format';
import { computeDyno, type DynoSheet } from '../physics/dyno';
import { useApp } from '../state/AppState';
import { isStock } from '../tuning/tuning';

type Measure = 'crank' | 'wheel';

interface DynoEntry {
  key: string;
  label: string;
  short: string;
  color: string;
  dashed: boolean;
  sheet: DynoSheet;
  massKg: number;
}

const PULL_SECONDS = 3.2;

export function DynoView() {
  const app = useApp();
  const [selected, setSelected] = useState<string[]>(() => [...app.ownerIds]);
  const [picking, setPicking] = useState(false);
  const [showStock, setShowStock] = useState(true);
  const [measure, setMeasure] = useState<Measure>('crank');
  const [showTable, setShowTable] = useState(false);
  const [hoverX, setHoverX] = useState<number | null>(null);
  const pull = usePlayback(PULL_SECONDS, 1);

  const entries = useMemo<DynoEntry[]>(() => {
    const out: DynoEntry[] = [];
    const styles = assignSeries(selected.map((id) => ({ key: id, vehicleId: id, homeSlot: getVehicle(id).colorSlot })));
    for (const id of selected) {
      const spec = getVehicle(id);
      const color = styles.get(id)!.color;
      const tuning = app.tuningFor(spec.id);
      const stock = isStock(spec, tuning);
      const current = app.simVehicle(spec.id);
      const variant = [
        tuning.ecuStage === 'stage1' ? 'Stage 1' : null,
        tuning.powerAdjustPct ? `${tuning.powerAdjustPct > 0 ? '+' : ''}${tuning.powerAdjustPct} %` : null,
      ]
        .filter(Boolean)
        .join(' ');
      const tag = stock ? null : variant || 'Modified';
      out.push({
        key: `${spec.id}:current`,
        label: tag ? `${spec.shortName} · ${tag}` : spec.shortName,
        short: tag ? `${spec.make} · ${tag}` : spec.make,
        color,
        dashed: false,
        sheet: computeDyno(current),
        massKg: current.massKg,
      });
      if (showStock && !stock) {
        const sv = app.simVehicle(spec.id, 'stock');
        out.push({
          key: `${spec.id}:stock`,
          label: `${spec.shortName} · Stock`,
          short: `${spec.make} · Stock`,
          color,
          dashed: true,
          sheet: computeDyno(sv),
          massKg: sv.massKg,
        });
      }
    }
    return out;
  }, [app, selected, showStock]);

  // Electric cars are measured over road speed; when every car on the dyno is
  // electric the chart uses km/h, otherwise their curves follow motor rpm.
  const speedAxis = entries.length > 0 && entries.every((e) => e.sheet.axis === 'speed');
  const xOf = (p: DynoSheet['points'][number]) => (speedAxis ? (p.speedKmh ?? 0) : p.rpm);
  const xMin = speedAxis ? 0 : 1000;
  const xMaxRaw = Math.max(speedAxis ? 100 : 7000, ...entries.map((e) => xOf(e.sheet.points[e.sheet.points.length - 1])));
  const xStep = speedAxis ? 20 : 500;
  const xDomain = [xMin, Math.ceil(xMaxRaw / xStep) * xStep] as const;
  const xLabel = speedAxis ? 'km/h' : 'rpm';
  const mixedEv = !speedAxis && entries.some((e) => e.sheet.axis === 'speed');
  const anyEv = speedAxis || mixedEv;
  // Motor-side and wheel-side quantities are labelled by basis: electric "crank" figures are motor shaft
  // figures, and electric wheel torque is taken at the wheels (through each motor's reduction).
  const sourceLabel = speedAxis ? 'Motor' : mixedEv ? 'Crank / motor' : 'Crank';
  const powerTitle = measure === 'crank' ? `Power (${sourceLabel.toLowerCase()})` : 'Power (wheel)';
  const torqueTitle =
    measure === 'crank'
      ? speedAxis
        ? 'Torque (motor shafts, summed)'
        : mixedEv
          ? 'Torque (crank / motor shafts)'
          : 'Torque (crank)'
      : speedAxis
        ? 'Torque (at the wheels)'
        : mixedEv
          ? 'Torque (wheel — bases differ)'
          : 'Torque (wheel-equivalent)';
  const torqueSubtitle =
    measure === 'crank'
      ? speedAxis
        ? 'Sum of the motor torques at their shafts'
        : mixedEv
          ? 'Petrol: crank torque · electric: motor shaft torques, summed'
          : undefined
      : speedAxis
        ? 'Each motor’s torque × its reduction × efficiency, summed over the axles'
        : mixedEv
          ? 'Petrol: crank torque × efficiency (wheel-equivalent) · electric: at the wheels, through the reductions — not comparable'
          : 'Crank torque × drivetrain efficiency, at engine rpm';
  const torqueUnit = (e: DynoEntry) => (e.sheet.axis === 'speed' ? (measure === 'crank' ? 'Nm motors' : 'Nm at wheels') : 'Nm');
  const revealX = pull.time !== null ? xMin + (pull.time / PULL_SECONDS) * (xDomain[1] - xMin) : undefined;

  const mk = (pick: (p: DynoSheet['points'][number]) => number): ChartSeries[] =>
    entries.map((e) => ({
      id: e.key,
      label: e.label,
      shortLabel: e.short,
      color: e.color,
      dashed: e.dashed,
      points: e.sheet.points.map((p) => ({ x: xOf(p), y: pick(p) })),
    }));
  const powerSeries = mk((p) => (measure === 'crank' ? p.powerPs : p.wheelPowerPs));
  const torqueSeries = mk((p) => (measure === 'crank' ? p.torqueNm : p.wheelTorqueNm));
  const boostSeries = mk((p) => p.boostBar);

  const MAX_CARS = 4;
  const removeCar = (id: string) => setSelected((s) => s.filter((x) => x !== id));

  const rpmFmt = (v: number) => fmt(v);
  const tableRpms: number[] = [];
  for (let r = speedAxis ? 20 : 1500; r <= xDomain[1]; r += xStep) tableRpms.push(r);
  const nearest = (pts: DynoSheet['points'], x: number) =>
    speedAxis ? pts.find((q) => Math.abs((q.speedKmh ?? -1) - x) < 1e-6) : pts.find((q) => q.rpm === x);

  return (
    <div className="view dyno">
      <div className="view__bar">
        <div className="dyno__vehicles" aria-label="Cars on the dyno">
          {selected.map((id) => {
            const v = getVehicle(id);
            const color = entries.find((e) => e.key === `${id}:current`)?.color;
            return (
              <span key={id} className="dyno-chip">
                <span className="vehicle-dot" style={{ background: color }} />
                {v.shortName}
                <button type="button" className="dyno-chip__x" onClick={() => removeCar(id)} aria-label={`Remove ${v.shortName} from the dyno`}>
                  <Icon name="close" size={16} />
                </button>
              </span>
            );
          })}
          {selected.length < MAX_CARS && (
            <Button icon="plus" onClick={() => setPicking(true)}>
              Add car
            </Button>
          )}
        </div>
        <div className="view__bar-actions">
          <Segmented<Measure>
            ariaLabel="Measurement point"
            value={measure}
            onChange={setMeasure}
            options={[
              { value: 'crank', label: sourceLabel },
              { value: 'wheel', label: 'Wheel' },
            ]}
          />
          <Button icon="play" variant="primary" onClick={() => pull.play()} disabled={pull.playing || entries.length === 0}>
            Dyno pull
          </Button>
        </div>
      </div>

      <div className="dyno__peaks">
        {entries.map((e) => (
          <div key={e.key} className="peak-card">
            <div className="peak-card__name">
              <Swatch color={e.color} dashed={e.dashed} /> {e.label}
            </div>
            <div className="peak-card__row">
              <span className="peak-card__value">{fmt(measure === 'crank' ? e.sheet.peakPowerPs : e.sheet.peakWheelPowerPs)}</span>
              <span className="peak-card__unit">PS @ {e.sheet.axis === 'speed' ? `${fmt(e.sheet.peakPowerKmh)} km/h` : fmt(e.sheet.peakPowerRpm)}</span>
            </div>
            <div className="peak-card__row">
              <span className="peak-card__value">{fmt(measure === 'crank' ? e.sheet.peakTorqueNm : e.sheet.peakWheelTorqueNm)}</span>
              <span className="peak-card__unit">
                {torqueUnit(e)} @ {e.sheet.axis === 'speed' ? `${fmt(measure === 'crank' ? e.sheet.peakTorqueKmh : e.sheet.peakWheelTorqueKmh)} km/h` : fmt(e.sheet.peakTorqueRpm)}
              </span>
            </div>
            <div className="peak-card__meta">
              {e.sheet.axis === 'speed' ? 'electric' : `${fmt(e.sheet.peakBoostBar, 2)} bar peak`} · {fmt((e.sheet.peakPowerPs / e.massKg) * 1000)} PS/t
            </div>
          </div>
        ))}
        <div className="dyno__options">
          <Toggle checked={showStock} onChange={setShowStock} label="Show stock baseline" description="Dashed line when a car is tuned" />
          <Toggle checked={showTable} onChange={setShowTable} label="Table view" />
        </div>
      </div>

      {picking && (
        <CarPickerDialog
          title="Add a car to the dyno"
          onSelect={(id) => setSelected((s) => (s.includes(id) ? s : [...s, id]))}
          onClose={() => setPicking(false)}
        />
      )}

      {entries.length === 0 ? (
        <Panel>
          <p className="footnote">Add at least one car to plot.</p>
        </Panel>
      ) : (
        <>
          <Panel title={powerTitle} subtitle="Full load, steady state">
            <LineChart
              ariaLabel="Power versus engine speed"
              series={powerSeries}
              xLabel={xLabel}
              yLabel="PS"
              xDomain={xDomain}
              height={260}
              xFormat={rpmFmt}
              yFormat={(v) => fmt(v)}
              valueFormat={(v) => `${fmt(v, 1)} PS`}
              hoverX={hoverX}
              onHoverX={setHoverX}
              revealX={revealX}
            />
          </Panel>
          <Panel title={torqueTitle} subtitle={torqueSubtitle}>
            <LineChart
              ariaLabel="Torque versus engine speed"
              series={torqueSeries}
              xLabel={xLabel}
              yLabel="Nm"
              xDomain={xDomain}
              height={220}
              xFormat={rpmFmt}
              yFormat={(v) => fmt(v)}
              valueFormat={(v) => `${fmt(v, 1)} Nm`}
              hoverX={hoverX}
              onHoverX={setHoverX}
              revealX={revealX}
            />
          </Panel>
          {!speedAxis && (
            <Panel title="Boost" subtitle={mixedEv ? 'Steady-state target, gauge pressure (electric cars read 0)' : 'Steady-state target, gauge pressure'}>
              <LineChart
                ariaLabel="Boost versus engine speed"
                series={boostSeries}
                xLabel={xLabel}
                yLabel="bar"
                xDomain={xDomain}
                yDomain={[0, 2]}
                height={170}
                xFormat={rpmFmt}
                yFormat={(v) => fmt(v, 1)}
                valueFormat={(v) => `${fmt(v, 2)} bar`}
                hoverX={hoverX}
                onHoverX={setHoverX}
                revealX={revealX}
              />
            </Panel>
          )}
          {showTable && (
            <Panel title="Dyno table" subtitle={`${measure === 'crank' ? sourceLabel : 'Wheel'} figures every ${speedAxis ? '20 km/h' : '500 rpm'}`}>
              <div className="table-scroll">
                <table className="table table--numeric">
                  <thead>
                    <tr>
                      <th scope="col">{xLabel}</th>
                      {entries.map((e) => (
                        <th key={e.key} scope="col" colSpan={2}>
                          {e.label}
                        </th>
                      ))}
                    </tr>
                    <tr>
                      <th scope="col" />
                      {entries.map((e) => [
                        <th key={`${e.key}p`} scope="col">PS</th>,
                        <th key={`${e.key}t`} scope="col">{torqueUnit(e)}</th>,
                      ])}
                    </tr>
                  </thead>
                  <tbody>
                    {tableRpms.map((rpm) => (
                      <tr key={rpm}>
                        <th scope="row">{fmt(rpm)}</th>
                        {entries.map((e) => {
                          const p = nearest(e.sheet.points, rpm);
                          return [
                            <td key={`${e.key}p`}>{p ? fmt(measure === 'crank' ? p.powerPs : p.wheelPowerPs) : '—'}</td>,
                            <td key={`${e.key}t`}>{p ? fmt(measure === 'crank' ? p.torqueNm : p.wheelTorqueNm) : '—'}</td>,
                          ];
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          )}
          <p className="footnote">
            Wheel figures apply each car’s drivetrain efficiency, as a chassis dyno would read. Curves are modelled from
            rated outputs — see Garage for data sources.
            {anyEv && ' Electric wheel torque is the torque at the wheels (each motor through its own reduction, e.g. both Taycan axles), so it is many times the motor torque; electric wheel power is motor power × efficiency.'}
            {speedAxis && ' Electric cars are measured over road speed (best gear, shared output limits, no boost).'}
            {mixedEv && ' Electric cars are plotted against rear-motor rpm here; load only electric cars for a road-speed axis.'}
          </p>
        </>
      )}
    </div>
  );
}
