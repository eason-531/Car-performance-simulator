import { useMemo, useState } from 'react';
import { LineChart, type ChartSeries } from '../components/LineChart';
import { Button, Panel, Segmented, Swatch, Toggle } from '../components/ui';
import { usePlayback } from '../hooks/usePlayback';
import { seriesColor } from '../lib/colors';
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
  const [selected, setSelected] = useState<string[]>(() => app.vehicles.map((v) => v.id));
  const [showStock, setShowStock] = useState(true);
  const [measure, setMeasure] = useState<Measure>('crank');
  const [showTable, setShowTable] = useState(false);
  const [hoverX, setHoverX] = useState<number | null>(null);
  const pull = usePlayback(PULL_SECONDS, 1);

  const entries = useMemo<DynoEntry[]>(() => {
    const out: DynoEntry[] = [];
    for (const spec of app.vehicles) {
      if (!selected.includes(spec.id)) continue;
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
        color: seriesColor(spec.colorSlot),
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
          color: seriesColor(spec.colorSlot),
          dashed: true,
          sheet: computeDyno(sv),
          massKg: sv.massKg,
        });
      }
    }
    return out;
  }, [app, selected, showStock]);

  const maxRpm = Math.max(7000, ...entries.map((e) => e.sheet.points[e.sheet.points.length - 1].rpm));
  const xDomain = [1000, Math.ceil(maxRpm / 500) * 500] as const;
  const revealX = pull.time !== null ? 1000 + (pull.time / PULL_SECONDS) * (xDomain[1] - 1000) : undefined;

  const mk = (pick: (p: DynoSheet['points'][number]) => number): ChartSeries[] =>
    entries.map((e) => ({
      id: e.key,
      label: e.label,
      shortLabel: e.short,
      color: e.color,
      dashed: e.dashed,
      points: e.sheet.points.map((p) => ({ x: p.rpm, y: pick(p) })),
    }));
  const powerSeries = mk((p) => (measure === 'crank' ? p.powerPs : p.wheelPowerPs));
  const torqueSeries = mk((p) => (measure === 'crank' ? p.torqueNm : p.wheelTorqueNm));
  const boostSeries = mk((p) => p.boostBar);

  const toggleVehicle = (id: string, on: boolean) =>
    setSelected((s) => (on ? app.vehicles.filter((v) => v.id === id || s.includes(v.id)).map((v) => v.id) : s.filter((x) => x !== id)));

  const rpmFmt = (v: number) => fmt(v);
  const tableRpms: number[] = [];
  for (let r = 1500; r <= xDomain[1]; r += 500) tableRpms.push(r);

  return (
    <div className="view dyno">
      <div className="view__bar">
        <div className="dyno__vehicles">
          {app.vehicles.map((v) => (
            <Toggle
              key={v.id}
              checked={selected.includes(v.id)}
              onChange={(on) => toggleVehicle(v.id, on)}
              label={
                <span className="seg-vehicle">
                  <span className="vehicle-dot" style={{ background: seriesColor(v.colorSlot) }} /> {v.shortName}
                </span>
              }
            />
          ))}
        </div>
        <div className="view__bar-actions">
          <Segmented<Measure>
            ariaLabel="Measurement point"
            value={measure}
            onChange={setMeasure}
            options={[
              { value: 'crank', label: 'Crank' },
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
              <span className="peak-card__unit">PS @ {fmt(e.sheet.peakPowerRpm)}</span>
            </div>
            <div className="peak-card__row">
              <span className="peak-card__value">{fmt(measure === 'crank' ? e.sheet.peakTorqueNm : e.sheet.peakWheelTorqueNm)}</span>
              <span className="peak-card__unit">Nm @ {fmt(e.sheet.peakTorqueRpm)}</span>
            </div>
            <div className="peak-card__meta">
              {fmt(e.sheet.peakBoostBar, 2)} bar peak · {fmt((e.sheet.peakPowerPs / e.massKg) * 1000)} PS/t
            </div>
          </div>
        ))}
        <div className="dyno__options">
          <Toggle checked={showStock} onChange={setShowStock} label="Show stock baseline" description="Dashed line when a car is tuned" />
          <Toggle checked={showTable} onChange={setShowTable} label="Table view" />
        </div>
      </div>

      {entries.length === 0 ? (
        <Panel>
          <p className="footnote">Select at least one vehicle to plot.</p>
        </Panel>
      ) : (
        <>
          <Panel title={measure === 'crank' ? 'Power (crank)' : 'Power (wheel)'} subtitle="Full load, steady state">
            <LineChart
              ariaLabel="Power versus engine speed"
              series={powerSeries}
              xLabel="rpm"
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
          <Panel title={measure === 'crank' ? 'Torque (crank)' : 'Torque (wheel-equivalent)'}>
            <LineChart
              ariaLabel="Torque versus engine speed"
              series={torqueSeries}
              xLabel="rpm"
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
          <Panel title="Boost" subtitle="Steady-state target, gauge pressure">
            <LineChart
              ariaLabel="Boost versus engine speed"
              series={boostSeries}
              xLabel="rpm"
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
          {showTable && (
            <Panel title="Dyno table" subtitle={`${measure === 'crank' ? 'Crank' : 'Wheel'} figures every 500 rpm`}>
              <div className="table-scroll">
                <table className="table table--numeric">
                  <thead>
                    <tr>
                      <th scope="col">rpm</th>
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
                        <th key={`${e.key}t`} scope="col">Nm</th>,
                      ])}
                    </tr>
                  </thead>
                  <tbody>
                    {tableRpms.map((rpm) => (
                      <tr key={rpm}>
                        <th scope="row">{fmt(rpm)}</th>
                        {entries.map((e) => {
                          const p = e.sheet.points.find((q) => q.rpm === rpm);
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
          </p>
        </>
      )}
    </div>
  );
}
