import { useMemo } from 'react';
import { Badge, Panel, StatTile, VehiclePicker } from '../components/ui';
import { getTireCompound } from '../data/tires';
import type { DataStatus } from '../data/types';
import { fmt, fmtSeconds, ordinalGear } from '../lib/format';
import { DRIVER_MASS_KG } from '../physics/constants';
import { theoreticalTopSpeedKmh } from '../physics/dyno';
import { runAccelerationRun } from '../physics/runners';
import { kmhToMs, radSToRpm } from '../physics/units';
import { useApp } from '../state/AppState';
import { resolveTireSize, tireRollingRadiusM } from '../tuning/buildSimVehicle';
import { defaultTuning } from '../tuning/tuning';

const STATUS_LABEL: Record<DataStatus, string> = { verified: 'Verified', reported: 'Reported', estimated: 'Estimated' };

export function GarageView() {
  const app = useApp();
  const spec = app.activeVehicle;
  const stock = app.simVehicle(spec.id, 'stock');
  const sim = useMemo(() => runAccelerationRun(stock, { launch: 'brake-boost' }).metrics, [stock]);
  const simStd = useMemo(() => runAccelerationRun(stock, { launch: 'standard', targetSpeedKmh: 100, targetDistanceM: 0 }).metrics, [stock]);
  const e = spec.engine;
  const t = spec.transmission;
  const c = spec.chassis;
  const size = resolveTireSize(spec, defaultTuning(spec));
  const radius = stock.wheelRadiusM;
  const counts = spec.provenance.reduce<Record<DataStatus, number>>(
    (acc, p) => ({ ...acc, [p.status]: acc[p.status] + 1 }),
    { verified: 0, reported: 0, estimated: 0 },
  );

  return (
    <div className="view garage">
      <div className="view__bar">
        <VehiclePicker vehicles={app.vehicles} value={spec.id} onChange={app.setActiveVehicle} />
      </div>

      <Panel
        className="garage__hero"
        title={`${spec.modelYear} ${spec.make} ${spec.model}`}
        subtitle={`${spec.variant} · ${spec.market} market`}
      >
        <div className="garage__tiles">
          <StatTile label="Power" value={fmt(e.rated.powerPs)} unit="PS" sub={`@ ${rpmRange(e.rated.powerRpm)} rpm`} />
          <StatTile label="Torque" value={fmt(e.rated.torqueNm)} unit="Nm" sub={`@ ${rpmRange(e.rated.torqueRpm)} rpm`} />
          <StatTile label="Curb mass" value={fmt(c.curbMassKg)} unit="kg" sub={`${fmt((e.rated.powerPs / (c.curbMassKg + DRIVER_MASS_KG)) * 1000)} PS/t with driver`} />
          <StatTile label="Drivetrain" value={spec.drivetrain.layout} sub={spec.drivetrain.description} />
          <StatTile label="Gearbox" value={`${t.gearRatios.length}-speed`} sub={t.name} />
          <StatTile label="Factory 0–100" value={fmt(spec.factory.zeroTo100S, 1)} unit="s" sub={`Top speed ${spec.factory.topSpeedKmh} km/h`} />
        </div>
      </Panel>

      <div className="grid-2">
        <Panel title="Specifications">
          <div className="spec-list">
            <SpecGroup title="Engine" />
            <Spec label="Engine" value={`${e.code} — ${e.description}`} />
            <Spec label="Displacement" value={`${fmt(e.displacementCc)} cc`} />
            <Spec label="Idle / redline / limiter" value={`${fmt(e.idleRpm)} / ${fmt(e.redlineRpm)} / ${fmt(e.revLimitRpm)} rpm`} />
            <SpecGroup title="Driveline" />
            <Spec label="Transmission" value={t.name} />
            <Spec label="Final drive" value={[...new Set(t.finalDrive)].map((f) => f.toFixed(3)).join(' / ')} />
            {t.torqueConverter && (
              <Spec label="Torque converter" value={`Stall ≈ ${fmt(t.torqueConverter.stallRpm)} rpm, ${t.torqueConverter.stallTorqueRatio}:1, lock-up from ${ordinalGear(t.torqueConverter.lockupMinGear)}`} />
            )}
            {t.launchClutch && <Spec label="Launch" value={`Clutch slip to ≈ ${fmt(t.launchClutch.launchRpm)} rpm`} />}
            <Spec label="Drivetrain efficiency" value={`${(spec.drivetrain.efficiency * 100).toFixed(0)} %`} />
            <SpecGroup title="Body" />
            <Spec label="L × W × H" value={`${fmt(c.lengthMm)} × ${fmt(c.widthMm)} × ${fmt(c.heightMm)} mm`} />
            <Spec label="Wheelbase" value={`${fmt(c.wheelbaseM * 1000)} mm`} />
            <Spec label="Weight distribution" value={`${Math.round(c.frontWeightFraction * 100)} / ${Math.round((1 - c.frontWeightFraction) * 100)} F/R`} />
            <Spec label="Aerodynamics" value={`Cd ${spec.aero.dragCoefficient} · A ${spec.aero.frontalAreaM2} m² · CdA ${(spec.aero.dragCoefficient * spec.aero.frontalAreaM2).toFixed(3)} m²`} />
            <Spec label="Tires (default)" value={`${size.label} · ${getTireCompound(spec.tires.defaultCompoundId).label}`} />
            <Spec label="Speed limiter" value={spec.speedLimiterKmh ? `${spec.speedLimiterKmh} km/h` : 'None'} />
          </div>
        </Panel>

        <Panel title="Gearing" subtitle={`Speed at ${fmt(e.revLimitRpm)} rpm on ${size.label} (${(tireRollingRadiusM(size.rear) * 1000).toFixed(0)} mm rolling radius)`}>
          <div className="table-scroll">
          <table className="table table--numeric">
            <thead>
              <tr>
                <th scope="col">Gear</th>
                <th scope="col">Ratio</th>
                <th scope="col">Overall</th>
                <th scope="col">km/h @ limiter</th>
                <th scope="col">rpm @ 100 km/h</th>
              </tr>
            </thead>
            <tbody>
              {t.gearRatios.map((g, i) => {
                const overall = g * t.finalDrive[i];
                const vmax = ((e.revLimitRpm / overall) * 2 * Math.PI * radius * 3.6) / 60;
                const rpm100 = radSToRpm((kmhToMs(100) / radius) * overall);
                return (
                  <tr key={i}>
                    <th scope="row">{i + 1}</th>
                    <td>{g.toFixed(3)}</td>
                    <td>{overall.toFixed(2)}</td>
                    <td>{fmt(vmax)}</td>
                    <td>{fmt(Math.round(rpm100 / 10) * 10)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
          <h3 className="subhead">Simulation vs published figures (stock)</h3>
          <table className="table">
            <tbody>
              <tr>
                <th scope="row">0–100 km/h</th>
                <td>
                  {fmtSeconds(sim.zeroTo100KmhS)} brake-boost · {fmtSeconds(simStd.zeroTo100KmhS)} standard
                </td>
              </tr>
              <tr>
                <th scope="row">¼ mile</th>
                <td>
                  {fmtSeconds(sim.quarterMileS)} @ {fmt(sim.quarterMileTrapKmh, 1)} km/h
                </td>
              </tr>
              <tr>
                <th scope="row">0–200 km/h</th>
                <td>{fmtSeconds(sim.zeroTo200KmhS)}</td>
              </tr>
              <tr>
                <th scope="row">Drag-limited top speed</th>
                <td>{fmt(theoreticalTopSpeedKmh(stock))} km/h (limiter off)</td>
              </tr>
              {spec.benchmarks.map((b, i) => (
                <tr key={i}>
                  <th scope="row">
                    {b.label} <Badge tone={b.kind === 'factory' ? 'neutral' : 'verified'}>{b.kind === 'factory' ? 'Factory' : 'Measured'}</Badge>
                  </th>
                  <td>
                    {b.value}
                    <small className="cell-source">{b.source}</small>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>

      <Panel
        title="Data sources & confidence"
        subtitle={`${counts.verified} verified · ${counts.reported} reported · ${counts.estimated} estimated. Estimated values can be overridden in Tuning.`}
      >
        <div className="table-scroll">
          <table className="table table--provenance">
            <thead>
              <tr>
                <th scope="col">Parameter</th>
                <th scope="col">Value</th>
                <th scope="col">Status</th>
                <th scope="col">Source / reasoning</th>
              </tr>
            </thead>
            <tbody>
              {spec.provenance.map((p) => (
                <tr key={p.parameter}>
                  <th scope="row">{p.parameter}</th>
                  <td>{p.value}</td>
                  <td>
                    <Badge tone={p.status}>{STATUS_LABEL[p.status]}</Badge>
                  </td>
                  <td className="cell-source">{p.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {spec.notes.length > 0 && (
          <ul className="notes">
            {spec.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

function rpmRange([a, b]: readonly [number, number]): string {
  return a === b ? fmt(a) : `${fmt(a)}–${fmt(b)}`;
}

function SpecGroup({ title }: { title: string }) {
  return <h3 className="spec-list__group">{title}</h3>;
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <dl className="spec-list__row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </dl>
  );
}
