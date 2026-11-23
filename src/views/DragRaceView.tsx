import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '../components/Icon';
import { CarPickerDialog } from '../components/catalog/CarPicker';
import { ClassBadge } from '../components/catalog/CatalogBrowser';
import { Badge, Button, Panel, Segmented } from '../components/ui';
import { useElementSize } from '../hooks/useElementSize';
import { usePlayback } from '../hooks/usePlayback';
import { assignSeries } from '../lib/colors';
import { findEntry } from '../data/catalog';
import { getVehicle } from '../data/vehicles';
import type { CarChoice } from '../storage/settings';
import { fmt, fmtSeconds } from '../lib/format';
import { computeDyno } from '../physics/dyno';
import { DISTANCES_M } from '../physics/metrics';
import { runDragRace, sampleAt, type DragLaneResult, type LaunchTechnique } from '../physics/runners';
import { useApp } from '../state/AppState';
import { defaultTuning, describeTuning } from '../tuning/tuning';
import type { VehicleSpec } from '../data/types';

type DistanceKey = 'eighth' | 'quarter' | 'half' | 'km';
const DISTANCES: Record<DistanceKey, { label: string; m: number }> = {
  eighth: { label: '⅛ mile', m: DISTANCES_M.eighthMile },
  quarter: { label: '¼ mile', m: DISTANCES_M.quarterMile },
  half: { label: '½ mile', m: DISTANCES_M.quarterMile * 2 },
  km: { label: '1 km', m: 1000 },
};

type Variant = 'current' | 'stock';
type Phase = 'setup' | 'staging' | 'racing' | 'finished';

const PX_PER_M = 15;

export function DragRaceView() {
  const app = useApp();
  const lanes = app.settings.dragLanes;
  const [picking, setPicking] = useState<0 | 1 | null>(null);
  const [distanceKey, setDistanceKey] = useState<DistanceKey>('quarter');
  const launch = app.settings.launch;
  const distance = DISTANCES[distanceKey].m;

  const specs = lanes.map((l) => getVehicle(l.vehicleId)) as [VehicleSpec, VehicleSpec];
  const simA = app.simVehicle(lanes[0].vehicleId, lanes[0].variant);
  const simB = app.simVehicle(lanes[1].vehicleId, lanes[1].variant);
  const race = useMemo(() => runDragRace(simA, simB, distance, launch), [simA, simB, distance, launch]);
  // Lane colours are local to this race: always distinct, owner cars keep their home colour when free.
  const laneStyles = assignSeries([
    { key: 'A', vehicleId: `${specs[0].id}#A`, homeSlot: specs[0].colorSlot },
    { key: 'B', vehicleId: `${specs[1].id}#B`, homeSlot: specs[1].id === specs[0].id ? undefined : specs[1].colorSlot },
  ]);
  const colors = [laneStyles.get('A')!.color, laneStyles.get('B')!.color];
  const labels = lanes.map((l, i) => `${specs[i].shortName}${l.variant === 'stock' ? ' (stock)' : ''}`);

  const duration = Math.max(...race.lanes.map((l) => l.elapsedS ?? l.trace[l.trace.length - 1].t)) + 1.2;
  const playback = usePlayback(duration, 1);
  const [phase, setPhase] = useState<Phase>('setup');
  const [tree, setTree] = useState(0);
  const [savedRace, setSavedRace] = useState<typeof race | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const stopPlayback = playback.stop;
  useEffect(() => {
    clearTimers();
    stopPlayback();
    setPhase('setup');
    setTree(0);
  }, [race, stopPlayback]);
  useEffect(() => clearTimers, []);

  const start = () => {
    clearTimers();
    setPhase('staging');
    setTree(0);
    [1, 2, 3].forEach((n) => timers.current.push(setTimeout(() => setTree(n), n * 500 - 400)));
    timers.current.push(
      setTimeout(() => {
        setTree(4);
        setPhase('racing');
        playback.play(() => setPhase('finished'));
      }, 1600),
    );
  };
  const skip = () => {
    clearTimers();
    playback.stop();
    setTree(4);
    setPhase('finished');
  };

  const raceTime = phase === 'racing' ? (playback.time ?? duration) : phase === 'finished' ? duration : 0;
  // Track positions keep moving past the line; HUD readouts freeze at each car's finish.
  const pos = race.lanes.map((l) => sampleAt(l.trace, raceTime));
  const hud = race.lanes.map((l) => sampleAt(l.trace, l.elapsedS !== null ? Math.min(raceTime, l.elapsedS) : raceTime));

  const setLane = (i: 0 | 1, patch: Partial<CarChoice>) => app.setDragLane(i, { ...lanes[i], ...patch });

  const saveBoth = useCallback(() => {
    race.lanes.forEach((lane, i) => {
      const spec = specs[i];
      const sim = i === 0 ? simA : simB;
      const tuning = lanes[i].variant === 'stock' ? defaultTuning(spec) : app.tuningFor(spec.id);
      const dyno = computeDyno(sim);
      app.saveResult({
        source: 'drag',
        vehicleId: spec.id,
        vehicleName: spec.shortName,
        colorSlot: spec.colorSlot ?? -1,
        tuningLabel: describeTuning(spec, tuning),
        tuning,
        launch,
        powerPs: dyno.peakPowerPs,
        torqueNm: dyno.peakTorqueNm,
        massKg: sim.massKg,
        metrics: lane.metrics,
        trace: lane.trace,
      });
    });
    setSavedRace(race);
    app.notify('Both runs saved to Results', 'good');
  }, [race, specs, simA, simB, lanes, app, launch]);

  const winnerName = race.winner !== null ? labels[race.winner] : null;

  return (
    <div className="view drag">
      <div className="drag__setup">
        {([0, 1] as const).map((i) => (
          <Panel key={i} className="drag__lane-config" title={<span className="lane-title"><span className="lane-tag" style={{ background: colors[i] }}>Lane {i === 0 ? 'A' : 'B'}</span></span>}>
            <button type="button" className="lane-car" onClick={() => setPicking(i)} aria-label={`Lane ${i === 0 ? 'A' : 'B'} car: ${specs[i].shortName}. Change`}>
              <span className="lane-car__text">
                <span className="lane-car__name">{specs[i].shortName}</span>
                <span className="lane-car__meta">
                  {specs[i].modelYear} · {findEntry(specs[i].id)?.drive} · {findEntry(specs[i].id)?.transmissionLabel}
                </span>
              </span>
              <ClassBadge id={specs[i].id} />
              <Icon name="search" size={18} />
            </button>
            <Segmented<Variant>
              block
              ariaLabel={`Lane ${i === 0 ? 'A' : 'B'} configuration`}
              value={lanes[i].variant}
              onChange={(variant) => setLane(i, { variant })}
              options={[
                { value: 'current', label: `Current tune` },
                { value: 'stock', label: 'Stock' },
              ]}
            />
            <p className="drag__lane-desc">
              {lanes[i].variant === 'stock' ? 'Stock' : describeTuning(specs[i], app.tuningFor(specs[i].id))} ·{' '}
              {fmt((i === 0 ? simA : simB).massKg)} kg
            </p>
          </Panel>
        ))}
        <Panel className="drag__race-config" title="Race">
          <Segmented<DistanceKey>
            block
            ariaLabel="Race distance"
            value={distanceKey}
            onChange={setDistanceKey}
            options={(Object.keys(DISTANCES) as DistanceKey[]).map((k) => ({ value: k, label: DISTANCES[k].label }))}
          />
          <Segmented<LaunchTechnique>
            block
            ariaLabel="Launch technique"
            value={launch}
            onChange={app.setLaunch}
            options={[
              { value: 'brake-boost', label: 'Brake-boost' },
              { value: 'standard', label: 'Standard' },
            ]}
          />
          {phase === 'staging' || phase === 'racing' ? (
            <Button icon="skip" onClick={skip} className="drag__go">
              Skip to finish
            </Button>
          ) : (
            <Button icon="play" variant="primary" onClick={start} className="drag__go">
              {phase === 'finished' ? 'Race again' : 'Start race'}
            </Button>
          )}
        </Panel>
      </div>

      <Track
        distance={distance}
        distanceLabel={DISTANCES[distanceKey].label}
        positions={pos.map((p) => p.distanceM)}
        colors={colors}
        labels={labels}
        tree={phase === 'staging' || (phase === 'racing' && raceTime < 1) ? tree : 0}
      />

      <div className="drag__hud">
        {race.lanes.map((lane, i) => (
          <LaneHud
            key={i}
            lane={lane}
            label={labels[i]}
            color={colors[i]}
            sample={hud[i]}
            raceTime={raceTime}
            phase={phase}
            winner={race.winner === i}
          />
        ))}
      </div>

      {picking !== null && (
        <CarPickerDialog
          title={`Lane ${picking === 0 ? 'A' : 'B'} car`}
          selectedId={lanes[picking].vehicleId}
          onSelect={(id) => setLane(picking, { vehicleId: id })}
          onClose={() => setPicking(null)}
        />
      )}

      {phase === 'finished' && (
        <Panel
          className="drag__result"
          title={winnerName ? `${winnerName} wins` : 'Dead heat'}
          subtitle={
            race.winner !== null && race.marginS !== null
              ? `by ${fmt(race.marginS, 3)} s · ${fmt(race.marginM, 1)} m ahead at the line · ${DISTANCES[distanceKey].label}`
              : DISTANCES[distanceKey].label
          }
          actions={
            <Button icon={savedRace === race ? 'check' : 'save'} onClick={saveBoth} disabled={savedRace === race}>
              {savedRace === race ? 'Saved' : 'Save both runs'}
            </Button>
          }
        >
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Lane</th>
                <th scope="col">60 ft</th>
                <th scope="col">0–100 km/h</th>
                <th scope="col">⅛ mile</th>
                <th scope="col">ET ({DISTANCES[distanceKey].label})</th>
                <th scope="col">Trap</th>
              </tr>
            </thead>
            <tbody>
              {race.lanes.map((l, i) => (
                <tr key={i}>
                  <th scope="row">
                    <span className="cell-vehicle">
                      <span className="vehicle-dot" style={{ background: colors[i] }} /> {labels[i]}
                      {race.winner === i && <Badge tone="good">Winner</Badge>}
                    </span>
                  </th>
                  <td>{fmtSeconds(l.sixtyFootS)}</td>
                  <td>{fmtSeconds(l.zeroTo100KmhS)}</td>
                  <td>{fmtSeconds(l.metrics.eighthMileS)}</td>
                  <td className="table__strong">{fmtSeconds(l.elapsedS, 3)}</td>
                  <td>{l.trapKmh !== null ? `${fmt(l.trapKmh, 1)} km/h` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}
    </div>
  );
}

function LaneHud({
  lane,
  label,
  color,
  sample,
  raceTime,
  phase,
  winner,
}: {
  lane: DragLaneResult;
  label: string;
  color: string;
  sample: { speedKmh: number; gear: number; rpm: number };
  raceTime: number;
  phase: Phase;
  winner: boolean;
}) {
  const finished = lane.elapsedS !== null && raceTime >= lane.elapsedS;
  return (
    <div className={`lane-hud ${finished && winner ? 'is-winner' : ''}`} style={{ '--lane-color': color } as React.CSSProperties}>
      <div className="lane-hud__name">
        <span className="vehicle-dot" style={{ background: color }} /> {label}
      </div>
      <div className="lane-hud__stats">
        <div>
          <span className="lane-hud__big">{Math.round(sample.speedKmh)}</span>
          <span className="lane-hud__unit">km/h</span>
        </div>
        <div className="lane-hud__meta">
          {phase === 'setup' ? 'Staged' : `Gear ${sample.gear} · ${fmt(Math.round(sample.rpm / 10) * 10)} rpm`}
        </div>
        <div className="lane-hud__time">
          {finished ? (
            <>
              <Icon name="drag" size={16} /> {fmt(lane.elapsedS, 3)} s @ {fmt(lane.trapKmh, 1)} km/h
            </>
          ) : (
            `${fmt(Math.max(0, raceTime), 2)} s`
          )}
        </div>
      </div>
    </div>
  );
}

function Track({
  distance,
  distanceLabel,
  positions,
  colors,
  labels,
  tree,
}: {
  distance: number;
  distanceLabel: string;
  positions: number[];
  colors: string[];
  labels: string[];
  tree: number;
}) {
  const [ref, { width }] = useElementSize<HTMLDivElement>();
  // Past the line, cars coast to a stop just beyond the finish so both stay in view.
  positions = positions.map((p) => (p <= distance ? p : distance + 9 * (1 - Math.exp(-(p - distance) / 12))));
  const windowM = Math.max(20, width / PX_PER_M);
  const leader = Math.max(...positions);
  // Chase camera: keep the leader at 65 % of the view, never before the start or past the finish.
  const camera = Math.min(Math.max(-6, leader - windowM * 0.65), distance + 12 - windowM);
  const px = (m: number) => (m - camera) * PX_PER_M;

  const ticks: number[] = [];
  for (let m = Math.ceil(camera / 10) * 10; m <= camera + windowM; m += 10) ticks.push(m);
  const markers = [
    { m: DISTANCES_M.sixtyFoot, label: '60 ft' },
    { m: DISTANCES_M.eighthMile, label: '⅛ mi' },
    { m: 100, label: '100 m' },
    { m: DISTANCES_M.quarterMile, label: '¼ mi' },
  ].filter((k) => k.m < distance - 1);

  return (
    <div className="track panel">
      <div className="track__minimap" aria-hidden="true">
        <div className="track__minimap-bar" />
        {positions.map((p, i) => (
          <span key={i} className="track__minimap-dot" style={{ left: `${Math.min(100, (p / distance) * 100)}%`, background: colors[i] }} />
        ))}
        <span className="track__minimap-label">{distanceLabel}</span>
      </div>
      <div ref={ref} className="track__view" role="img" aria-label={`Drag strip: ${labels.map((l, i) => `${l} at ${Math.round(positions[i])} m`).join(', ')}`}>
        {width > 0 && (
          <>
            {ticks.map((m) => (
              <div key={m} className={`track__tick ${m % 50 === 0 ? 'is-major' : ''}`} style={{ left: px(m) }}>
                {m % 50 === 0 && m > 0 && <span>{m} m</span>}
              </div>
            ))}
            {markers.map((k) => (
              <div key={k.label} className="track__marker" style={{ left: px(k.m) }}>
                <span>{k.label}</span>
              </div>
            ))}
            <div className="track__start" style={{ left: px(0) }} />
            <div className="track__finish" style={{ left: px(distance) }} />
            {positions.map((p, i) => {
              const x = px(p);
              const offscreen = x < 30;
              return (
                <div key={i} className={`track__lane track__lane--${i}`}>
                  {offscreen ? (
                    <div className="track__behind" style={{ borderColor: colors[i] }}>
                      ◀ {labels[i]} −{fmt(leader - p, 1)} m
                    </div>
                  ) : (
                    <div className="car" style={{ transform: `translateX(${x - 4.8 * PX_PER_M}px)`, width: 4.8 * PX_PER_M }}>
                      <div className="car__body" style={{ background: colors[i] }}>
                        <div className="car__glass" />
                        <div className="car__roof" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
        {tree > 0 && (
          <div className="tree" aria-label={tree === 4 ? 'Green light' : `Amber ${tree}`}>
            {[1, 2, 3].map((n) => (
              <span key={n} className={`tree__light tree__light--amber ${tree >= n && tree < 4 ? 'is-on' : ''}`} />
            ))}
            <span className={`tree__light tree__light--green ${tree === 4 ? 'is-on' : ''}`} />
          </div>
        )}
      </div>
    </div>
  );
}
