import { useMemo, type ReactNode } from 'react';

export interface GaugeZone {
  from: number;
  to: number;
  color: string;
}

export interface ArcGaugeProps {
  value: number;
  min: number;
  max: number;
  majorStep: number;
  minorPerMajor?: number;
  labelFormat?: (v: number) => string;
  zones?: readonly GaugeZone[];
  /** Colour of the value arc. */
  color: string;
  /** Draw the value arc from this value instead of `min` (e.g. 0 on a boost gauge). */
  origin?: number;
  children?: ReactNode;
  ariaLabel: string;
  ariaValueText: string;
  className?: string;
}

const CX = 100;
const CY = 100;
const R = 86;
const START = 135;
const SWEEP = 270;

const rad = (deg: number) => (deg * Math.PI) / 180;
const polar = (r: number, deg: number) => [CX + r * Math.cos(rad(deg)), CY + r * Math.sin(rad(deg))] as const;

function arcPath(r: number, a0: number, a1: number): string {
  if (Math.abs(a1 - a0) < 0.01) return '';
  const [x0, y0] = polar(r, Math.min(a0, a1));
  const [x1, y1] = polar(r, Math.max(a0, a1));
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
  return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}

/**
 * 270° instrument-cluster gauge in SVG. Static geometry (ticks, labels, zones)
 * is memoised; only the needle and value arc change per frame.
 */
export function ArcGauge({
  value,
  min,
  max,
  majorStep,
  minorPerMajor = 4,
  labelFormat = (v) => String(v),
  zones = [],
  color,
  origin,
  children,
  ariaLabel,
  ariaValueText,
  className = '',
}: ArcGaugeProps) {
  const angle = (v: number) => START + ((Math.min(max, Math.max(min, v)) - min) / (max - min)) * SWEEP;

  const staticLayer = useMemo(() => {
    const ang = (v: number) => START + ((v - min) / (max - min)) * SWEEP;
    const inZone = (v: number) => zones.find((z) => v >= z.from - 1e-9 && v <= z.to + 1e-9);
    const ticks: ReactNode[] = [];
    const majorCount = Math.round((max - min) / majorStep);
    for (let i = 0; i <= majorCount; i++) {
      const v = min + i * majorStep;
      const a = ang(v);
      const [x0, y0] = polar(R - 12, a);
      const [x1, y1] = polar(R - 2, a);
      const [lx, ly] = polar(R - 25, a);
      const zone = inZone(v);
      ticks.push(
        <line key={`M${i}`} x1={x0} y1={y0} x2={x1} y2={y1} className="gauge__tick gauge__tick--major" style={zone ? { stroke: zone.color } : undefined} />,
        <text key={`L${i}`} x={lx} y={ly} className="gauge__label" textAnchor="middle" dominantBaseline="central" style={zone ? { fill: zone.color } : undefined}>
          {labelFormat(v)}
        </text>,
      );
      if (i < majorCount) {
        for (let j = 1; j < minorPerMajor; j++) {
          const mv = v + (j * majorStep) / minorPerMajor;
          const ma = ang(mv);
          const [a0, b0] = polar(R - 7, ma);
          const [a1, b1] = polar(R - 2, ma);
          const mz = inZone(mv);
          ticks.push(<line key={`m${i}-${j}`} x1={a0} y1={b0} x2={a1} y2={b1} className="gauge__tick" style={mz ? { stroke: mz.color } : undefined} />);
        }
      }
    }
    return (
      <>
        <path d={arcPath(R + 6, START, START + SWEEP)} className="gauge__track" />
        {zones.map((z, i) => (
          <path key={i} d={arcPath(R + 6, ang(z.from), ang(z.to))} className="gauge__zone" style={{ stroke: z.color }} />
        ))}
        {ticks}
      </>
    );
  }, [min, max, majorStep, minorPerMajor, labelFormat, zones]);

  const a = angle(value);
  const a0 = angle(origin ?? min);
  const [nx, ny] = polar(R - 6, a);
  const [tx, ty] = polar(R - 34, a);

  return (
    <div className={`gauge ${className}`} role="meter" aria-label={ariaLabel} aria-valuenow={value} aria-valuemin={min} aria-valuemax={max} aria-valuetext={ariaValueText}>
      <svg viewBox="0 0 200 200" className="gauge__svg" aria-hidden="true">
        {staticLayer}
        <path d={arcPath(R + 6, a0, a)} className="gauge__value" style={{ stroke: color }} />
        <line x1={tx} y1={ty} x2={nx} y2={ny} className="gauge__needle" />
      </svg>
      {children && <div className="gauge__center">{children}</div>}
    </div>
  );
}
