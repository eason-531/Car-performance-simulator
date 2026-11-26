import { useMemo } from 'react';
import type { AutoDriveView, TrafficView } from '../assist/liveDrive';
import { LANE_COUNT, PLAYER_LANE, PLAYER_LENGTH_M } from '../assist/traffic';
import { useElementSize } from '../hooks/useElementSize';
import { fmt } from '../lib/format';

const FARTHEST_M = 3000;
const DASH_PERIOD_M = 12;
const DASH_LENGTH_M = 6;
const PAD = 7;
const SHADES = ['#6b7079', '#7f776b', '#5f7080', '#7a7184'];

interface Scale {
  /** Screen x of a distance ahead of the player's front bumper, px. */
  x(d: number): number;
  /** Relative size of a car at that distance (1 near, smaller far away). */
  size(d: number): number;
  behindM: number;
}

function makeScale(width: number): Scale {
  // Metres ahead drawn to a linear scale (about a 2-second gap at highway speed); farther traffic is compressed toward the horizon.
  const LINEAR_AHEAD_M = Math.min(80, Math.max(55, width / 10));
  const x0 = Math.max(56, width * 0.18);
  const xLin = width * 0.7;
  const k = (xLin - x0) / LINEAR_AHEAD_M;
  const span = width - 8 - xLin;
  // Log compression beyond the linear range, matched in slope at its start: x = xLin + k·L·ln(1 + Δ/L).
  let lo = 0.5;
  let hi = 2000;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (k * mid * Math.log(1 + (FARTHEST_M - LINEAR_AHEAD_M) / mid) > span) hi = mid;
    else lo = mid;
  }
  const L = lo;
  return {
    x: (d) => (d <= LINEAR_AHEAD_M ? x0 + k * d : xLin + k * L * Math.log(1 + (Math.min(d, FARTHEST_M) - LINEAR_AHEAD_M) / L)),
    size: (d) => (d <= LINEAR_AHEAD_M ? 1 : Math.max(0.35, L / (L + d - LINEAR_AHEAD_M))),
    behindM: x0 / k,
  };
}

/**
 * Top-down road strip for Live Drive: three lanes with the player fixed in the
 * middle, seeded traffic, the tracked lead and its gap. Purely a view of the
 * simulation state; it never advances anything.
 */
export function RoadView({
  distanceM,
  timeS,
  color,
  traffic,
  auto,
}: {
  distanceM: number;
  timeS: number;
  color: string;
  traffic: TrafficView;
  auto: AutoDriveView;
}) {
  const [ref, { width, height }] = useElementSize<HTMLDivElement>();
  const w = Math.max(width, 240);
  const h = Math.max(height, 72);
  const scale = useMemo(() => makeScale(w), [w]);
  const laneH = (h - 2 * PAD) / LANE_COUNT;
  const laneY = (lat: number) => PAD + laneH * (lat + 0.5);
  const carH = laneH * 0.56;
  const blink = Math.floor(timeS * 3) % 2 === 0;
  const lead = traffic.lead;
  const leadTone = !auto.engaged ? '#f0efec' : auto.mode === 'braking' || auto.mode === 'stopped' ? '#f07a7a' : auto.mode === 'following' ? '#fab219' : '#f0efec';

  const dashes: { x1: number; x2: number }[] = [];
  const first = Math.ceil((distanceM - scale.behindM) / DASH_PERIOD_M) * DASH_PERIOD_M;
  for (let p = first; p - distanceM < 400; p += DASH_PERIOD_M) {
    const x1 = scale.x(p - distanceM);
    const x2 = scale.x(p - distanceM + DASH_LENGTH_M);
    if (x2 - x1 >= 1) dashes.push({ x1, x2 });
  }

  const playerFront = scale.x(0);
  const playerLen = PLAYER_LENGTH_M * (scale.x(1) - scale.x(0));
  const cars = [...traffic.cars].sort((a, b) => b.dx - a.dx);
  const leadCar = lead ? cars.find((c) => c.id === lead.id) : undefined;
  const leadRearX = leadCar ? scale.x(leadCar.dx - leadCar.lengthM) : null;

  return (
    <div className="road" ref={ref}>
      <svg className="road__svg" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
        <line className="road__edge" x1={0} x2={w} y1={PAD} y2={PAD} />
        <line className="road__edge" x1={0} x2={w} y1={h - PAD} y2={h - PAD} />
        {[1, 2].map((b) => (
          <g key={b}>
            {dashes.map((d, i) => (
              <line key={i} className="road__dash" x1={d.x1} x2={d.x2} y1={PAD + laneH * b} y2={PAD + laneH * b} />
            ))}
          </g>
        ))}
        {leadCar && leadRearX !== null && leadRearX - playerFront > 12 && (
          <g className="road__gap">
            <line x1={playerFront + 4} x2={leadRearX - 4} y1={laneY(PLAYER_LANE)} y2={laneY(PLAYER_LANE)} stroke={leadTone} />
            <line x1={leadRearX - 4} x2={leadRearX - 4} y1={laneY(PLAYER_LANE) - 4} y2={laneY(PLAYER_LANE) + 4} stroke={leadTone} />
          </g>
        )}
        {cars.map((c) => {
          const s = scale.size(Math.max(0, c.dx));
          const x2 = scale.x(c.dx);
          const x1 = Math.min(x2 - 6, scale.x(c.dx - c.lengthM));
          const len = Math.max(x2 - x1, 10 * s);
          const ch = carH * Math.max(0.6, s);
          const y = laneY(c.lat) - ch / 2;
          const isLead = lead?.id === c.id;
          const fill = isLead ? '#e6e4dc' : c.inLane ? '#a4a9b0' : SHADES[c.shade % SHADES.length];
          return (
            <g key={c.id}>
              <rect
                x={x2 - len}
                y={y}
                width={len}
                height={ch}
                rx={Math.min(5, ch / 3)}
                fill={fill}
                stroke={isLead ? (traffic.contact ? '#f07a7a' : leadTone) : 'none'}
                strokeWidth={isLead ? 2 : 0}
              />
              <rect x={x2 - len * 0.42} y={y + 2} width={len * 0.16} height={ch - 4} rx={1.5} fill="rgba(10,12,15,0.35)" />
              {c.signal !== 0 && blink && (
                <>
                  <circle cx={x2 - 2} cy={c.signal < 0 ? y + 1 : y + ch - 1} r={2.6} fill="#fab219" />
                  <circle cx={x2 - len + 2} cy={c.signal < 0 ? y + 1 : y + ch - 1} r={2.6} fill="#fab219" />
                </>
              )}
            </g>
          );
        })}
        <rect
          className="road__player"
          x={playerFront - playerLen}
          y={laneY(PLAYER_LANE) - carH / 2}
          width={playerLen}
          height={carH}
          rx={Math.min(6, carH / 3)}
          fill={color}
          stroke={traffic.contact ? '#f07a7a' : 'none'}
          strokeWidth={traffic.contact ? 2 : 0}
        />
        <rect x={playerFront - playerLen * 0.42} y={laneY(PLAYER_LANE) - carH / 2 + 2} width={playerLen * 0.16} height={carH - 4} rx={1.5} fill="rgba(10,12,15,0.35)" />
      </svg>
      {lead && leadRearX !== null && leadRearX - playerFront > 70 && (
        <span className="road__gap-label" style={{ left: (playerFront + leadRearX) / 2, top: laneY(PLAYER_LANE) - carH / 2 - 15, color: leadTone }}>
          {fmt(lead.gapM)} m{lead.timeGapS !== null ? ` · ${lead.timeGapS.toFixed(1)} s` : ''}
        </span>
      )}
      {traffic.contact && <span className="road__contact">Too close — no collision model</span>}
      <span className="road__odo">{fmt(distanceM / 1000, 2)} km</span>
    </div>
  );
}
