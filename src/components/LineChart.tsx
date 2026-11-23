import { useId, useMemo, useState, type PointerEvent, type ReactNode } from 'react';
import { useElementSize } from '../hooks/useElementSize';
import { niceDomain, ticks } from '../lib/ticks';
import { DASH_PATTERNS } from '../lib/colors';
import { Swatch } from './ui';

export interface ChartPoint {
  x: number;
  y: number;
}

export interface ChartSeries {
  id: string;
  label: string;
  color: string;
  dashed?: boolean;
  /** Explicit SVG dash pattern (overrides `dashed`). */
  dashArray?: string;
  /** Shorter text for the direct label at the line end. */
  shortLabel?: string;
  /** Sorted by x. */
  points: readonly ChartPoint[];
}

export interface ChartMarker {
  axis: 'x' | 'y';
  value: number;
  label: string;
}

export interface LineChartProps {
  series: readonly ChartSeries[];
  ariaLabel: string;
  xLabel: string;
  yLabel: string;
  height?: number;
  xDomain?: readonly [number, number];
  yDomain?: readonly [number, number];
  xFormat?: (v: number) => string;
  yFormat?: (v: number) => string;
  /** Formats the values inside the tooltip. */
  valueFormat?: (v: number) => string;
  markers?: readonly ChartMarker[];
  /** Controlled crosshair position (x value) for synchronised charts. */
  hoverX?: number | null;
  onHoverX?: (x: number | null) => void;
  /** Change to replay the draw-in animation. */
  animateKey?: string | number;
  /** Reveal only up to this x (used for live / replay drawing). */
  revealX?: number;
  showLegend?: boolean;
  directLabels?: boolean;
  footer?: ReactNode;
}

const M = { top: 28, bottom: 34, left: 52 };

export { DASH_PATTERNS };

function dashOf(s: ChartSeries): string | undefined {
  return s.dashArray ?? (s.dashed ? DASH_PATTERNS[1] : undefined);
}

/** Linear interpolation of y at x on a sorted series; null outside its range. */
export function valueAt(points: readonly ChartPoint[], x: number): number | null {
  if (points.length === 0 || x < points[0].x || x > points[points.length - 1].x) return null;
  let lo = 0;
  let hi = points.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (points[mid].x <= x) lo = mid;
    else hi = mid;
  }
  const a = points[lo];
  const b = points[hi];
  if (b.x === a.x) return a.y;
  return a.y + ((x - a.x) / (b.x - a.x)) * (b.y - a.y);
}

/**
 * Single-axis line chart in SVG with a crosshair tooltip, legend, direct
 * labels and a draw-in animation. One y-scale only, by design: two measures
 * of different units belong in two synchronised charts.
 */
export function LineChart({
  series,
  ariaLabel,
  xLabel,
  yLabel,
  height = 260,
  xDomain,
  yDomain,
  xFormat = (v) => String(v),
  yFormat = (v) => String(v),
  valueFormat,
  markers = [],
  hoverX: hoverXProp,
  onHoverX,
  animateKey,
  revealX,
  showLegend,
  directLabels,
  footer,
}: LineChartProps) {
  const [ref, { width }] = useElementSize<HTMLDivElement>();
  const [localHover, setLocalHover] = useState<number | null>(null);
  const hoverX = hoverXProp !== undefined ? hoverXProp : localHover;
  const setHover = (x: number | null) => {
    if (onHoverX) onHoverX(x);
    else setLocalHover(x);
  };
  const clipId = useId().replace(/:/g, '');
  const legend = showLegend ?? series.length >= 2;
  const labels = (directLabels ?? series.length <= 4) && width > 520;
  const right = labels ? 140 : 18;
  const plotW = Math.max(10, width - M.left - right);
  const plotH = height - M.top - M.bottom;

  const scales = useMemo(() => {
    const all = series.flatMap((s) => s.points);
    const xMin = xDomain?.[0] ?? Math.min(...all.map((p) => p.x), 0);
    const xMax = xDomain?.[1] ?? Math.max(...all.map((p) => p.x), 1);
    let y = yDomain ? { min: yDomain[0], max: yDomain[1], step: niceDomain(yDomain[0], yDomain[1]).step } : null;
    if (!y) {
      const ys = all.map((p) => p.y);
      y = niceDomain(Math.min(0, ...ys), Math.max(1, ...ys) * 1.04, 5);
    }
    const xd = xDomain ? { min: xMin, max: xMax, step: niceDomain(xMin, xMax, 7).step } : niceDomain(xMin, xMax, 7);
    if (xDomain) {
      xd.min = xMin;
      xd.max = xMax;
    }
    return { x: xd, y };
  }, [series, xDomain, yDomain]);

  const sx = (x: number) => M.left + ((x - scales.x.min) / (scales.x.max - scales.x.min)) * plotW;
  const sy = (y: number) => M.top + plotH - ((y - scales.y.min) / (scales.y.max - scales.y.min)) * plotH;

  const paths = useMemo(
    () =>
      series.map((s) => {
        let d = '';
        const pts = revealX === undefined ? s.points : s.points.filter((p) => p.x <= revealX);
        pts.forEach((p, i) => {
          d += `${i ? 'L' : 'M'}${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`;
        });
        return d;
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [series, scales, plotW, plotH, revealX],
  );

  const xTicks = ticks(scales.x.min, scales.x.max, scales.x.step).filter((t) => t >= scales.x.min && t <= scales.x.max);
  const yTicks = ticks(scales.y.min, scales.y.max, scales.y.step);

  // Direct labels at series ends, nudged apart to avoid collisions.
  const endLabels = useMemo(() => {
    if (!labels) return [];
    const items = series
      .map((s) => {
        const pts = revealX === undefined ? s.points : s.points.filter((p) => p.x <= revealX);
        const last = pts[pts.length - 1];
        return last ? { id: s.id, label: s.shortLabel ?? s.label, color: s.color, dash: dashOf(s), x: sx(last.x), y: sy(last.y) } : null;
      })
      .filter((v): v is NonNullable<typeof v> => v !== null)
      .sort((a, b) => a.y - b.y);
    for (let i = 1; i < items.length; i++) {
      if (items[i].y - items[i - 1].y < 16) items[i].y = items[i - 1].y + 16;
    }
    return items;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [series, labels, scales, plotW, plotH, revealX]);

  const onMove = (e: PointerEvent<SVGRectElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const fx = (e.clientX - rect.left) / rect.width;
    setHover(scales.x.min + Math.min(1, Math.max(0, fx)) * (scales.x.max - scales.x.min));
  };

  const hoverValues =
    hoverX === null || hoverX === undefined
      ? []
      : series
          .map((s) => ({ s, y: valueAt(s.points, hoverX) }))
          .filter((h): h is { s: ChartSeries; y: number } => h.y !== null && (revealX === undefined || hoverX <= revealX));
  const fmtValue = valueFormat ?? yFormat;
  const tooltipLeft = hoverX !== null && hoverX !== undefined ? sx(hoverX) : 0;

  return (
    <figure className="chart" aria-label={ariaLabel}>
      {legend && (
        <figcaption className="chart__legend">
          {series.map((s) => (
            <span key={s.id} className="chart__legend-item">
              <Swatch color={s.color} dashArray={dashOf(s)} />
              {s.label}
            </span>
          ))}
        </figcaption>
      )}
      <div ref={ref} className="chart__frame" style={{ height }}>
        {width > 0 && (
          <svg width={width} height={height} className="chart__svg" role="img" aria-label={ariaLabel}>
            <defs>
              <clipPath id={`clip-${clipId}`}>
                <rect key={animateKey} x={M.left} y={0} width={plotW + right} height={height} className={animateKey !== undefined ? 'chart__reveal' : undefined} />
              </clipPath>
            </defs>
            {yTicks.map((t) => (
              <g key={`y${t}`}>
                <line x1={M.left} x2={M.left + plotW} y1={sy(t)} y2={sy(t)} className={t === scales.y.min ? 'chart__axis' : 'chart__grid'} />
                <text x={M.left - 8} y={sy(t)} className="chart__tick" textAnchor="end" dominantBaseline="central">
                  {yFormat(t)}
                </text>
              </g>
            ))}
            {xTicks.map((t) => (
              <text key={`x${t}`} x={sx(t)} y={M.top + plotH + 18} className="chart__tick" textAnchor="middle">
                {xFormat(t)}
              </text>
            ))}
            <text x={M.left - 8} y={12} className="chart__axis-title" textAnchor="end">
              {yLabel}
            </text>
            <text x={M.left + plotW} y={height - 2} className="chart__axis-title" textAnchor="end">
              {xLabel}
            </text>
            {markers.map((m, i) =>
              m.axis === 'x' ? (
                m.value >= scales.x.min && m.value <= scales.x.max ? (
                  <g key={i}>
                    <line x1={sx(m.value)} x2={sx(m.value)} y1={M.top} y2={M.top + plotH} className="chart__marker" />
                    <text x={sx(m.value) + 4} y={M.top + 10} className="chart__marker-label">
                      {m.label}
                    </text>
                  </g>
                ) : null
              ) : m.value >= scales.y.min && m.value <= scales.y.max ? (
                <g key={i}>
                  <line x1={M.left} x2={M.left + plotW} y1={sy(m.value)} y2={sy(m.value)} className="chart__marker" />
                  <text x={M.left + 4} y={sy(m.value) - 5} className="chart__marker-label">
                    {m.label}
                  </text>
                </g>
              ) : null,
            )}
            <g clipPath={`url(#clip-${clipId})`}>
              {series.map((s, i) => (
                <path
                  key={s.id}
                  d={paths[i]}
                  className="chart__line"
                  style={{ stroke: s.color }}
                  strokeDasharray={dashOf(s)}
                />
              ))}
              {endLabels.map((l) => (
                <g key={l.id}>
                  <text x={M.left + plotW + 10} y={l.y} className="chart__direct-label" dominantBaseline="central">
                    {l.label.length > 18 ? `${l.label.slice(0, 17)}…` : l.label}
                  </text>
                  <line x1={M.left + plotW + 2} x2={M.left + plotW + 7} y1={l.y} y2={l.y} stroke={l.color} strokeWidth={2} />
                </g>
              ))}
            </g>
            {hoverX !== null && hoverX !== undefined && hoverValues.length > 0 && (
              <g pointerEvents="none">
                <line x1={sx(hoverX)} x2={sx(hoverX)} y1={M.top} y2={M.top + plotH} className="chart__crosshair" />
                {hoverValues.map(({ s, y }) => (
                  <circle key={s.id} cx={sx(hoverX)} cy={sy(y)} r={5} className="chart__dot" style={{ fill: s.color }} />
                ))}
              </g>
            )}
            <rect
              x={M.left}
              y={M.top}
              width={plotW}
              height={plotH}
              fill="transparent"
              className="chart__hit"
              onPointerMove={onMove}
              onPointerDown={onMove}
              onPointerLeave={() => setHover(null)}
            />
          </svg>
        )}
        {hoverX !== null && hoverX !== undefined && hoverValues.length > 0 && (
          <div
            className="chart__tooltip"
            style={{
              left: tooltipLeft,
              transform: tooltipLeft > width * 0.6 ? 'translateX(calc(-100% - 14px))' : 'translateX(14px)',
            }}
          >
            <div className="chart__tooltip-head">
              {xFormat(hoverX)} {xLabel}
            </div>
            {hoverValues.map(({ s, y }) => (
              <div key={s.id} className="chart__tooltip-row">
                <Swatch color={s.color} dashArray={dashOf(s)} />
                <span className="chart__tooltip-name">{s.label}</span>
                <span className="chart__tooltip-value">{fmtValue(y)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {footer}
    </figure>
  );
}
