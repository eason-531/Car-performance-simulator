import { useEffect, useState } from 'react';
import { CatalogBrowser, ClassBadge, Monogram, ReadinessBadge } from '../components/catalog/CatalogBrowser';
import { Icon } from '../components/Icon';
import { Badge, Button, Panel, Segmented, StatTile } from '../components/ui';
import { findEntry, fullName, stockStats } from '../data/catalog';
import { CLASS_FORMULA, CLASS_POLICY } from '../data/catalog/classes';
import { BASIS_LABEL, TIMING_LABEL, compareBenchmark, uncomparedResults } from '../data/catalog/compare';
import { MARKET_LABEL, STATUS_LABEL, type CatalogEntry, type MeasuredBenchmark, type TestConditions } from '../data/catalog/types';
import { getTireCompound } from '../data/tires';
import { fmt, fmtSeconds, ordinalGear } from '../lib/format';
import { DRIVER_MASS_KG } from '../physics/constants';
import { kmhToMs, radSToRpm } from '../physics/units';
import { useApp } from '../state/AppState';
import { resolveTireSize, tireRollingRadiusM } from '../tuning/buildSimVehicle';
import { defaultTuning } from '../tuning/tuning';

function detailFromHash(): string | null {
  const parts = window.location.hash.replace(/^#\/?/, '').split('/');
  return parts[0] === 'garage' && parts[1] ? decodeURIComponent(parts[1]) : null;
}

export function GarageView() {
  const [detail, setDetail] = useState<string | null>(detailFromHash);
  const [tab, setTab] = useState<'mine' | 'all'>('mine');
  useEffect(() => {
    const onHash = () => setDetail(detailFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  const open = (id: string) => {
    window.location.hash = `/garage/${encodeURIComponent(id)}`;
    setDetail(id);
    window.scrollTo({ top: 0 });
  };
  const back = () => {
    window.location.hash = '/garage';
    setDetail(null);
  };

  const entry = detail ? findEntry(detail) : undefined;
  if (entry) return <CarDetails entry={entry} onBack={back} />;

  return (
    <div className="view garage">
      <div className="view__bar">
        <Segmented
          ariaLabel="Garage section"
          size="lg"
          value={tab}
          onChange={setTab}
          options={[
            { value: 'mine', label: 'My Garage' },
            { value: 'all', label: 'All Cars' },
          ]}
        />
      </div>
      {tab === 'mine' ? (
        <MyGarage onOpen={open} onBrowse={() => setTab('all')} />
      ) : (
        <Panel>
          <CatalogBrowser onSelect={open} defaultSort="name" actionLabel="Details for" />
        </Panel>
      )}
      <ClassExplainer />
    </div>
  );
}

function MyGarage({ onOpen, onBrowse }: { onOpen: (id: string) => void; onBrowse: () => void }) {
  const app = useApp();
  const ids = [...app.ownerIds, ...app.settings.favorites.filter((id) => !app.ownerIds.includes(id))];
  return (
    <div className="garage-grid">
      {ids.map((id) => {
        const e = findEntry(id);
        if (!e) return null;
        const st = stockStats(id);
        return (
          <article key={id} className="garage-card panel">
            <header className="garage-card__head">
              <Monogram entry={e} />
              <div>
                <h3 className="garage-card__title">{fullName(e)}</h3>
                <p className="garage-card__meta">
                  {e.market} · {e.transmissionLabel} · {e.drive}
                </p>
              </div>
              <ClassBadge id={id} />
            </header>
            <div className="garage-card__badges">
              {e.owner ? <Badge tone="good">My car</Badge> : <Badge tone="neutral">Favorite</Badge>}
              <ReadinessBadge entry={e} />
            </div>
            <dl className="garage-card__stats">
              <div>
                <dt>0–100 km/h</dt>
                <dd>{fmtSeconds(st?.brakeRelease.zeroTo100KmhS ?? null)}</dd>
              </div>
              <div>
                <dt>¼ mile</dt>
                <dd>{fmtSeconds(st?.brakeRelease.quarterMileS ?? null)}</dd>
              </div>
              <div>
                <dt>Power</dt>
                <dd>{st ? `${fmt(st.peakPowerPs)} PS` : (e.factory.power ?? '—')}</dd>
              </div>
            </dl>
            <p className="garage-card__note">{e.owner?.note ?? (e.sim ? 'Simulated stock, brake-release timing.' : e.unsupportedReason)}</p>
            <div className="garage-card__actions">
              <Button icon="info" onClick={() => onOpen(id)}>
                Details
              </Button>
              {e.sim && (
                <Button
                  icon="drive"
                  variant={app.settings.activeVehicleId === id ? 'ghost' : 'secondary'}
                  disabled={app.settings.activeVehicleId === id}
                  onClick={() => {
                    app.setActiveVehicle(id);
                    app.notify(`${e.sim!.shortName} is now the active car`, 'good');
                  }}
                >
                  {app.settings.activeVehicleId === id ? 'Active car' : 'Make active'}
                </Button>
              )}
              {!e.owner && (
                <Button variant="ghost" onClick={() => app.toggleFavorite(id)}>
                  Remove
                </Button>
              )}
            </div>
          </article>
        );
      })}
      <button type="button" className="garage-add panel" onClick={onBrowse}>
        <Icon name="plus" size={28} />
        <span>Add favorites from All Cars</span>
      </button>
    </div>
  );
}

function ClassExplainer() {
  return (
    <Panel title="About stock classes" subtitle={`Formula ${CLASS_FORMULA.version} · straight-line performance only`}>
      <p className="help">
        D, C, B, A, S and S+ rate <strong>stock straight-line performance in this simulator</strong>, not handling, braking or
        comfort. The score is 45 % quarter-mile ET, 40 % trap speed and 15 % 0–100 km/h, each standardized between fixed slow and
        fast anchors. Every car is scored with one policy, so your tuning and test settings never change its class:
      </p>
      <ul className="notes">
        <li>Tires: {CLASS_POLICY.tires}</li>
        <li>Mass: {CLASS_POLICY.mass}</li>
        <li>Timing: {CLASS_POLICY.timing}</li>
        <li>Launch: {CLASS_POLICY.launch}</li>
        <li>Conditions: {CLASS_POLICY.conditions}</li>
      </ul>
      <p className="footnote">
        Thresholds: C ≥ {CLASS_FORMULA.thresholds.C}, B ≥ {CLASS_FORMULA.thresholds.B}, A ≥ {CLASS_FORMULA.thresholds.A}, S ≥{' '}
        {CLASS_FORMULA.thresholds.S}, S+ ≥ {CLASS_FORMULA.thresholds['S+']}. Cars that cannot be simulated yet show “—” (pending).
      </p>
    </Panel>
  );
}

function CarDetails({ entry: e, onBack }: { entry: CatalogEntry; onBack: () => void }) {
  const app = useApp();
  const st = stockStats(e.id);
  const spec = e.sim;
  const fav = app.isFavorite(e.id);
  return (
    <div className="view garage">
      <div className="view__bar">
        <Button icon="minus" variant="ghost" onClick={onBack}>
          Back to garage
        </Button>
        <div className="view__bar-actions">
          {!e.owner && (
            <Button onClick={() => app.toggleFavorite(e.id)} ariaPressed={fav}>
              {fav ? '★ In My Garage' : '☆ Add to My Garage'}
            </Button>
          )}
          {spec && (
            <Button
              icon="drive"
              variant="primary"
              disabled={app.settings.activeVehicleId === e.id}
              onClick={() => {
                app.setActiveVehicle(e.id);
                app.notify(`${spec.shortName} is now the active car`, 'good');
              }}
            >
              {app.settings.activeVehicleId === e.id ? 'Active car' : 'Use in simulator'}
            </Button>
          )}
        </div>
      </div>

      <Panel
        className="garage__hero"
        title={fullName(e)}
        subtitle={`${e.bodyLabel}${e.chassisCode ? ` · ${e.chassisCode}` : ''} · ${MARKET_LABEL[e.market]} specification · ${e.origin} manufacturer`}
        actions={
          <div className="panel__actions-row">
            <ClassBadge id={e.id} />
            <ReadinessBadge entry={e} />
            {e.owner && <Badge tone="good">My car</Badge>}
          </div>
        }
      >
        {e.owner && <p className="help">{e.owner.note}</p>}
        {!spec && e.unsupportedReason && (
          <div className="callout callout--warning" role="note">
            <Icon name="info" size={18} />
            <span>
              <strong>Not runnable yet.</strong> {e.unsupportedReason} Published results below remain available.
            </span>
          </div>
        )}
        <div className="garage__tiles">
          <StatTile label="Power" value={spec ? fmt(spec.engine.rated.powerPs) : '—'} unit={spec ? 'PS' : undefined} sub={e.factory.power ?? 'Not yet sourced'} />
          <StatTile label="Torque" value={spec ? fmt(spec.engine.rated.torqueNm) : '—'} unit={spec ? 'Nm' : undefined} sub={e.factory.torque ?? 'Not yet sourced'} />
          <StatTile label="Curb mass" value={spec ? fmt(spec.chassis.curbMassKg) : '—'} unit={spec ? 'kg' : undefined} sub={e.factory.curbMass ?? 'Not yet sourced'} />
          <StatTile label="Drivetrain" value={e.drive} sub={spec?.drivetrain.description ?? e.engineLabel} />
          <StatTile label="Gearbox" value={e.transmission} sub={e.transmissionLabel} />
          <StatTile
            label="Stock class"
            value={st?.cls ?? '—'}
            sub={st?.score !== null && st?.score !== undefined ? `Score ${fmt(st.score, 1)} (${st.formula})` : 'Pending — not simulated'}
          />
        </div>
        <p className="footnote">
          Use tags: {e.usage.join(', ')} · Engine: {e.engineLabel} · Powertrain: {e.powertrain}
        </p>
      </Panel>

      <Panel title="Reference tests" subtitle="Published measurements beside the simulator’s stock run on the matching timing basis">
        {e.benchmarks.length === 0 ? (
          <p className="help">Measured results not transcribed yet — see the linked source below.</p>
        ) : (
          e.benchmarks.map((b) => <BenchmarkBlock key={b.id} entry={e} b={b} />)
        )}
      </Panel>

      {spec && <SimSpecs entry={e} />}

      <Panel title="Sources" subtitle="Factory data, road tests and references used for this configuration">
        <ul className="sources">
          {e.sources.map((s) => (
            <li key={s.id}>
              <Badge tone="neutral">{s.kind === 'road-test' ? 'Road test' : s.kind === 'manufacturer' ? 'Manufacturer' : s.kind === 'owner' ? 'Owner' : 'Reference'}</Badge>{' '}
              {s.url ? (
                <a href={s.url} target="_blank" rel="noreferrer noopener">
                  {s.publisher}: {s.title} <Icon name="external" size={14} />
                </a>
              ) : (
                `${s.publisher}: ${s.title}`
              )}
              {s.date && <small> · {s.date}</small>}
            </li>
          ))}
        </ul>
        {e.dataGaps.length > 0 && (
          <>
            <h3 className="subhead">Not yet confirmed</h3>
            <ul className="notes">
              {e.dataGaps.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </>
        )}
        {e.notes && e.notes.length > 0 && (
          <ul className="notes">
            {e.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

function conditionsText(c: TestConditions): string[] {
  const out: string[] = [];
  if (c.surface) out.push(`Surface: ${c.surface}`);
  if (c.weather) out.push(`Weather: ${c.weather}`);
  if (c.temperatureC !== undefined) out.push(`${c.temperatureC} °C`);
  if (c.testMass) out.push(`Test mass: ${c.testMass}`);
  if (c.occupants) out.push(`Occupants: ${c.occupants}`);
  if (c.fuel) out.push(`Fuel/charge: ${c.fuel}`);
  if (c.driveMode) out.push(`Mode: ${c.driveMode}`);
  if (c.launchControl) out.push(`Launch: ${c.launchControl}`);
  if (c.tires) out.push(`Tires: ${c.tires}`);
  return [...out, ...(c.other ?? [])];
}

function BenchmarkBlock({ entry, b }: { entry: CatalogEntry; b: MeasuredBenchmark }) {
  const st = stockStats(entry.id);
  const cmp = compareBenchmark(b, st);
  const source = entry.sources.find((s) => s.id === b.sourceId);
  const cond = conditionsText(b.conditions);
  const unit = (u: string) => (u === 's' ? 's' : u);
  return (
    <section className="benchmark">
      <header className="benchmark__head">
        <div>
          <h3 className="benchmark__title">
            {source?.url ? (
              <a href={source.url} target="_blank" rel="noreferrer noopener">
                {b.publication} <Icon name="external" size={14} />
              </a>
            ) : (
              b.publication
            )}
            {b.date && <small> · {b.date}</small>}
          </h3>
          <p className="benchmark__meta">
            <Badge tone="verified">Measured</Badge> <Badge tone={b.match === 'exact' ? 'good' : 'warning'}>{b.match === 'exact' ? 'Exact configuration' : 'Equivalent configuration'}</Badge>{' '}
            <Badge tone="neutral">{TIMING_LABEL[b.timing]}</Badge>
          </p>
        </div>
      </header>
      {b.deviation && <p className="help">Deviation: {b.deviation}</p>}
      <p className="footnote">{b.timingNote}</p>
      {cmp.rows.length > 0 && (
        <div className="table-scroll">
          <table className="table table--numeric">
            <thead>
              <tr>
                <th scope="col">Metric</th>
                <th scope="col">Published</th>
                {cmp.bases.map((basis) => (
                  <th key={basis} scope="col">
                    Sim · {BASIS_LABEL[basis]}
                  </th>
                ))}
                {cmp.bases.map((basis) => (
                  <th key={`d${basis}`} scope="col">
                    Δ {cmp.bases.length > 1 ? `(${basis === 'brake-release' ? 'BR' : '1 ft'})` : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cmp.rows.map((r) => (
                <tr key={r.label + r.unit}>
                  <th scope="row">{r.label}</th>
                  <td>
                    {fmt(r.published, r.unit === 's' ? 2 : 1)} {unit(r.unit)}
                  </td>
                  {r.simulated.map((v, i) => (
                    <td key={i}>{v === null ? (entry.sim ? '—' : 'not simulated') : `${fmt(v, r.unit === 's' ? 2 : 1)} ${unit(r.unit)}`}</td>
                  ))}
                  {r.simulated.map((v, i) => (
                    <td key={`d${i}`} className={v === null ? '' : Math.abs(v - r.published) / r.published > 0.05 ? 'is-off' : 'is-close'}>
                      {v === null ? '—' : `${v - r.published >= 0 ? '+' : '−'}${fmt(Math.abs(v - r.published), r.unit === 's' ? 2 : 1)}`}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {cmp.mismatch && <p className="footnote">⚠ {cmp.mismatch}</p>}
      {uncomparedResults(b.results).length > 0 && <p className="footnote">Also published: {uncomparedResults(b.results).join(' · ')}</p>}
      {cond.length > 0 && <p className="footnote">Conditions: {cond.join(' · ')}</p>}
      <p className="footnote">Simulated with the stock policy (curb + {DRIVER_MASS_KG} kg driver, stock tires, best launch). Read from: {b.verification}</p>
    </section>
  );
}

function SimSpecs({ entry }: { entry: CatalogEntry }) {
  const spec = entry.sim!;
  const app = useApp();
  const stock = app.simVehicle(spec.id, 'stock');
  const e = spec.engine;
  const t = spec.transmission;
  const c = spec.chassis;
  const size = resolveTireSize(spec, defaultTuning(spec));
  const radius = stock.wheelRadiusM;
  const counts = spec.provenance.reduce<Record<string, number>>((acc, p) => ({ ...acc, [p.status]: (acc[p.status] ?? 0) + 1 }), {});
  return (
    <>
      <div className="grid-2">
        <Panel title="Simulation specifications">
          <div className="spec-list">
            <h3 className="spec-list__group">Engine</h3>
            <Spec label="Engine" value={`${e.code} — ${e.description}`} />
            <Spec label="Displacement" value={`${fmt(e.displacementCc)} cc`} />
            <Spec label="Rated" value={`${fmt(e.rated.powerPs)} PS @ ${rpmRange(e.rated.powerRpm)} · ${fmt(e.rated.torqueNm)} Nm @ ${rpmRange(e.rated.torqueRpm)} rpm`} />
            <Spec label="Idle / redline / limiter" value={`${fmt(e.idleRpm)} / ${fmt(e.redlineRpm)} / ${fmt(e.revLimitRpm)} rpm`} />
            <h3 className="spec-list__group">Driveline</h3>
            <Spec label="Transmission" value={t.name} />
            <Spec label="Final drive" value={[...new Set(t.finalDrive)].map((f) => f.toFixed(3)).join(' / ')} />
            {t.torqueConverter && (
              <Spec label="Torque converter" value={`Stall ≈ ${fmt(t.torqueConverter.stallRpm)} rpm, ${t.torqueConverter.stallTorqueRatio}:1, lock-up from ${ordinalGear(t.torqueConverter.lockupMinGear)}`} />
            )}
            {t.launchClutch && (
              <Spec label="Launch" value={`${t.type === 'manual' ? 'Driver clutch launch' : 'Clutch slip'} to ≈ ${fmt(t.launchClutch.launchRpm)} rpm`} />
            )}
            <Spec label="Drivetrain efficiency" value={`${(spec.drivetrain.efficiency * 100).toFixed(0)} %`} />
            {spec.drivetrain.frontShareRange && (
              <Spec label="AWD front share" value={`${Math.round(spec.drivetrain.frontShareRange[0] * 100)}–${Math.round(spec.drivetrain.frontShareRange[1] * 100)} %`} />
            )}
            <h3 className="spec-list__group">Body</h3>
            {c.lengthMm > 0 && <Spec label="L × W × H" value={`${fmt(c.lengthMm)} × ${fmt(c.widthMm)} × ${fmt(c.heightMm)} mm`} />}
            <Spec label="Wheelbase" value={`${fmt(c.wheelbaseM * 1000)} mm`} />
            <Spec label="Curb / test mass" value={`${fmt(c.curbMassKg)} kg / ${fmt(c.curbMassKg + DRIVER_MASS_KG)} kg`} />
            <Spec label="Weight distribution" value={`${Math.round(c.frontWeightFraction * 100)} / ${Math.round((1 - c.frontWeightFraction) * 100)} F/R`} />
            <Spec label="Aerodynamics" value={`Cd ${spec.aero.dragCoefficient} · A ${spec.aero.frontalAreaM2} m² · CdA ${(spec.aero.dragCoefficient * spec.aero.frontalAreaM2).toFixed(3)} m²`} />
            <Spec label="Tires (stock)" value={`${size.label} · ${getTireCompound(spec.tires.defaultCompoundId).label}`} />
            <Spec label="Speed limiter" value={spec.speedLimiterKmh ? `${spec.speedLimiterKmh} km/h` : 'None modelled'} />
            <Spec label="Stage 1" value={spec.stage1 ? `≈ ${spec.stage1.claimedPowerPs} PS / ${spec.stage1.claimedTorqueNm} Nm (estimated)` : 'Not offered for this configuration'} />
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
        </Panel>
      </div>
      <Panel
        title="Model parameters & confidence"
        subtitle={`${counts.verified ?? 0} verified · ${counts.reported ?? 0} reported · ${counts.estimated ?? 0} estimated. Estimated values can be overridden in Tuning.`}
      >
        <div className="table-scroll">
          <table className="table table--provenance">
            <thead>
              <tr>
                <th scope="col">Parameter</th>
                <th scope="col">Value</th>
                <th scope="col">Status</th>
                <th scope="col">Source / why estimated</th>
              </tr>
            </thead>
            <tbody>
              {spec.provenance.map((p, i) => (
                <tr key={`${p.parameter}-${i}`}>
                  <th scope="row">{p.parameter}</th>
                  <td>{p.value}</td>
                  <td>
                    <Badge tone={p.status}>{STATUS_LABEL[p.status]}</Badge>
                  </td>
                  <td className="cell-source">
                    {p.source}
                    {p.url && (
                      <>
                        {' '}
                        <a href={p.url} target="_blank" rel="noreferrer noopener" aria-label={`Source for ${p.parameter}`}>
                          <Icon name="external" size={14} />
                        </a>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}

function rpmRange([a, b]: readonly [number, number]): string {
  return a === b ? fmt(a) : `${fmt(a)}–${fmt(b)}`;
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <dl className="spec-list__row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </dl>
  );
}
