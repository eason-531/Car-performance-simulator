import { useMemo, useState } from 'react';
import { DASH_PATTERNS, LineChart } from '../components/LineChart';
import { Badge, Button, EmptyState, Panel, Swatch } from '../components/ui';
import { seriesColor } from '../lib/colors';
import { fmt, fmtDate, fmtSeconds } from '../lib/format';
import type { PerformanceMetrics } from '../physics/metrics';
import type { SavedResult } from '../storage/results';
import { useApp } from '../state/AppState';

const MAX_COMPARE = DASH_PATTERNS.length;

const SOURCE_LABEL: Record<SavedResult['source'], string> = { test: 'Test', drag: 'Drag race', drive: 'Live drive' };
const LAUNCH_LABEL: Record<SavedResult['launch'], string> = { 'brake-boost': 'Brake-boost', standard: 'Standard', driver: 'Driver' };

interface MetricRow {
  label: string;
  get: (r: SavedResult) => number | null;
  better: 'lower' | 'higher';
  format: (v: number | null) => string;
}

const time = (key: keyof PerformanceMetrics) => (r: SavedResult) => r.metrics[key];
const METRIC_ROWS: MetricRow[] = [
  { label: '0–60 mph', get: time('zeroTo60MphS'), better: 'lower', format: (v) => fmtSeconds(v) },
  { label: '0–100 km/h', get: time('zeroTo100KmhS'), better: 'lower', format: (v) => fmtSeconds(v) },
  { label: '0–200 km/h', get: time('zeroTo200KmhS'), better: 'lower', format: (v) => fmtSeconds(v) },
  { label: '100–200 km/h', get: time('hundredTo200KmhS'), better: 'lower', format: (v) => fmtSeconds(v) },
  { label: '60 ft', get: time('sixtyFootS'), better: 'lower', format: (v) => fmtSeconds(v) },
  { label: '⅛ mile', get: time('eighthMileS'), better: 'lower', format: (v) => fmtSeconds(v) },
  { label: '¼ mile', get: time('quarterMileS'), better: 'lower', format: (v) => fmtSeconds(v) },
  { label: '¼ mile trap', get: time('quarterMileTrapKmh'), better: 'higher', format: (v) => (v === null ? '—' : `${fmt(v, 1)} km/h`) },
  { label: '1 km', get: time('kilometerS'), better: 'lower', format: (v) => fmtSeconds(v) },
  { label: 'Max speed', get: (r) => r.metrics.topSpeedKmh, better: 'higher', format: (v) => (v === null ? '—' : `${fmt(v)} km/h`) },
  { label: 'Peak accel', get: (r) => r.metrics.peakAccelG, better: 'higher', format: (v) => (v === null ? '—' : `${fmt(v, 2)} g`) },
  { label: 'Peak power', get: (r) => r.powerPs, better: 'higher', format: (v) => (v === null ? '—' : `${fmt(v)} PS`) },
  { label: 'Peak torque', get: (r) => r.torqueNm, better: 'higher', format: (v) => (v === null ? '—' : `${fmt(v)} Nm`) },
  { label: 'Test mass', get: (r) => r.massKg, better: 'lower', format: (v) => (v === null ? '—' : `${fmt(v)} kg`) },
];

export function ResultsView() {
  const app = useApp();
  const results = app.results;
  /**
   * id → selection order. Lines take their vehicle's colour; repeat runs of the
   * same vehicle are told apart by a dash pattern fixed at selection time, so
   * nothing repaints when other results are deselected.
   */
  const [selection, setSelection] = useState<Record<string, { order: number; dash: number }>>({});
  const [confirmClear, setConfirmClear] = useState(false);

  const selected = useMemo(
    () => results.filter((r) => r.id in selection).sort((a, b) => selection[a.id].order - selection[b.id].order),
    [results, selection],
  );

  const toggle = (id: string) =>
    setSelection((sel) => {
      if (id in sel) {
        const next = { ...sel };
        delete next[id];
        return next;
      }
      if (Object.keys(sel).length >= MAX_COMPARE) return sel;
      const vehicleId = results.find((r) => r.id === id)?.vehicleId;
      const usedDash = new Set(
        Object.entries(sel)
          .filter(([rid]) => results.find((r) => r.id === rid)?.vehicleId === vehicleId)
          .map(([, v]) => v.dash),
      );
      let dash = 0;
      while (usedDash.has(dash)) dash++;
      const order = Math.max(-1, ...Object.values(sel).map((v) => v.order)) + 1;
      return { ...sel, [id]: { order, dash } };
    });

  const remove = (id: string) => {
    app.deleteResult(id);
    setSelection((sel) => {
      const next = { ...sel };
      delete next[id];
      return next;
    });
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ app: 'car-performance-simulator', version: 1, exportedAt: new Date().toISOString(), results }, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-results-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  if (results.length === 0) {
    return (
      <div className="view results">
        <Panel>
          <EmptyState icon="results" title="No saved results yet">
            Run an acceleration test, a drag race or a live drive and tap <strong>Save</strong>. Results are stored on this
            device and can be compared side by side here.
          </EmptyState>
        </Panel>
      </div>
    );
  }

  const colorOf = (r: SavedResult) => seriesColor(r.colorSlot);
  const dashOf = (r: SavedResult) => DASH_PATTERNS[selection[r.id]?.dash ?? 0];
  const labelOf = (r: SavedResult) => `${r.vehicleName} · ${r.tuningLabel}`;

  return (
    <div className="view results">
      {!app.persistent && (
        <div className="callout callout--warning" role="note">
          Storage is unavailable in this browser mode (e.g. Private Browsing). Results will be kept until the tab closes.
        </div>
      )}

      {selected.length > 0 && (
        <Panel
          title={selected.length === 1 ? 'Selected result' : `Comparing ${selected.length} results`}
          subtitle="Best value in each row is marked"
          actions={
            <Button variant="ghost" onClick={() => setSelection({})}>
              Clear selection
            </Button>
          }
        >
          <LineChart
            ariaLabel="Speed versus time for selected results"
            series={selected.map((r) => ({
              id: r.id,
              label: labelOf(r),
              color: colorOf(r),
              dashArray: dashOf(r),
              points: r.trace.t.map((t, i) => ({ x: t, y: r.trace.v[i] })),
            }))}
            xLabel="s"
            yLabel="km/h"
            height={260}
            xFormat={(v) => fmt(v)}
            yFormat={(v) => fmt(v)}
            valueFormat={(v) => `${fmt(v, 1)} km/h`}
            markers={[
              { axis: 'y', value: 100, label: '100 km/h' },
              { axis: 'y', value: 200, label: '200 km/h' },
            ]}
            directLabels={false}
          />
          <div className="table-scroll">
            <table className="table table--compare">
              <thead>
                <tr>
                  <th scope="col">Metric</th>
                  {selected.map((r) => (
                    <th key={r.id} scope="col">
                      <span className="compare-head">
                        <Swatch color={colorOf(r)} dashArray={dashOf(r)} />
                        <span>
                          {r.vehicleName}
                          <small>{r.tuningLabel}</small>
                        </span>
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {METRIC_ROWS.map((row) => {
                  const values = selected.map(row.get);
                  const valid = values.filter((v): v is number => v !== null);
                  const distinct = new Set(valid).size > 1;
                  const best = distinct ? (row.better === 'lower' ? Math.min(...valid) : Math.max(...valid)) : null;
                  return (
                    <tr key={row.label}>
                      <th scope="row">{row.label}</th>
                      {values.map((v, i) => (
                        <td key={selected[i].id} className={best !== null && v === best ? 'is-best' : ''}>
                          {row.format(v)}
                          {best !== null && v === best && <span className="best-mark" aria-label="best"> ★</span>}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      <Panel
        title="Saved results"
        subtitle={`${results.length} stored on this device · select up to ${MAX_COMPARE} to compare`}
        actions={
          <div className="panel__actions-row">
            <Button icon="download" onClick={exportJson}>
              Export JSON
            </Button>
            {confirmClear ? (
              <>
                <Button variant="danger" icon="trash" onClick={() => { app.clearResults(); setSelection({}); setConfirmClear(false); }}>
                  Delete all
                </Button>
                <Button variant="ghost" onClick={() => setConfirmClear(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button variant="ghost" icon="trash" onClick={() => setConfirmClear(true)}>
                Clear all
              </Button>
            )}
          </div>
        }
      >
        <ul className="result-list">
          {results.map((r) => {
            const isSel = r.id in selection;
            const full = !isSel && Object.keys(selection).length >= MAX_COMPARE;
            return (
              <li key={r.id} className={`result ${isSel ? 'is-selected' : ''}`}>
                <button
                  type="button"
                  className="result__select"
                  onClick={() => toggle(r.id)}
                  disabled={full}
                  aria-pressed={isSel}
                  aria-label={`${isSel ? 'Deselect' : 'Select'} ${labelOf(r)} for comparison`}
                >
                  <span className={`result__check ${isSel ? 'is-checked' : ''}`}>{isSel ? '✓' : ''}</span>
                </button>
                <div className="result__main">
                  {isSel && (
                    <span className="result__line">
                      <Swatch color={colorOf(r)} dashArray={dashOf(r)} />
                    </span>
                  )}
                  <div className="result__title">
                    <span className="vehicle-dot" style={{ background: seriesColor(r.colorSlot) }} />
                    {r.vehicleName}
                    <span className="result__tune">{r.tuningLabel}</span>
                  </div>
                  <div className="result__meta">
                    <Badge tone="neutral">{SOURCE_LABEL[r.source]}</Badge>
                    <span>{LAUNCH_LABEL[r.launch]} launch</span>
                    <span>{fmtDate(r.createdAt)}</span>
                  </div>
                </div>
                <div className="result__metrics">
                  <Metric label="0–100" value={fmtSeconds(r.metrics.zeroTo100KmhS)} />
                  <Metric label="0–200" value={fmtSeconds(r.metrics.zeroTo200KmhS)} />
                  <Metric label="¼ mile" value={fmtSeconds(r.metrics.quarterMileS)} />
                  <Metric label="Trap" value={r.metrics.quarterMileTrapKmh === null ? '—' : `${fmt(r.metrics.quarterMileTrapKmh)} km/h`} />
                </div>
                <Button icon="trash" variant="ghost" onClick={() => remove(r.id)} ariaLabel={`Delete ${labelOf(r)}`} />
              </li>
            );
          })}
        </ul>
      </Panel>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="result__metric">
      <span className="result__metric-label">{label}</span>
      <span className="result__metric-value">{value}</span>
    </div>
  );
}
