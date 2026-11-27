import { useMemo } from 'react';
import type { AutoDriveView, PlayerLaneView, TrafficView } from '../assist/liveDrive';
import { useElementSize } from '../hooks/useElementSize';
import { fmt } from '../lib/format';
import { DASH_LENGTH_M, PAD_PX, dashXs, roadLayout, roadScene, type Box } from './roadGeometry';

const SHADES = ['#6b7079', '#7f776b', '#5f7080', '#7a7184'];
const LEAD_FILL = '#e6e4dc';
const IN_LANE_FILL = '#a4a9b0';

function distanceText(m: number): string {
  return m >= 1000 ? `${fmt(m / 1000, 1)} km` : `${fmt(Math.round(m / 5) * 5)} m`;
}

/**
 * Top-down road strip for Live Drive: three lanes across the full width at
 * one fixed scale, the player in its lane (moving between lanes on command),
 * traffic, the tracked lead with a bumper-to-bumper gap line, and edge cues
 * for traffic beyond the drawn range. A view of the simulation state only.
 */
export function RoadView({
  distanceM,
  speedKmh,
  timeS,
  color,
  traffic,
  auto,
  lane,
}: {
  distanceM: number;
  speedKmh: number;
  timeS: number;
  color: string;
  traffic: TrafficView;
  auto: AutoDriveView;
  lane: PlayerLaneView;
}) {
  const [ref, { width, height }] = useElementSize<HTMLDivElement>();
  const layout = useMemo(() => roadLayout(width, height), [width, height]);
  const w = layout.width;
  const h = layout.height;
  const lead = traffic.lead;
  const scene = roadScene(layout, traffic.cars, lane.lat, speedKmh, lead?.id ?? null);
  const blink = Math.floor(timeS * 3) % 2 === 0;
  const leadTone = !auto.engaged ? '#f0efec' : auto.mode === 'braking' || auto.mode === 'stopped' ? '#f07a7a' : auto.mode === 'following' ? '#fab219' : '#f0efec';
  const dashLen = DASH_LENGTH_M * layout.pxPerM;
  const dashes = dashXs(layout, distanceM);
  const gap = scene.gap;
  const gapTone = traffic.contact || (gap?.short ?? false) ? '#f07a7a' : leadTone;

  const blinkers = (b: Box, signal: -1 | 0 | 1) =>
    signal !== 0 &&
    blink && (
      <>
        <circle cx={b.x2 - 2} cy={signal < 0 ? b.y + 1 : b.y + b.h - 1} r={2.6} fill="#fab219" />
        <circle cx={b.x1 + 2} cy={signal < 0 ? b.y + 1 : b.y + b.h - 1} r={2.6} fill="#fab219" />
      </>
    );

  return (
    <div className="road" ref={ref} data-px-per-m={layout.pxPerM.toFixed(3)}>
      <svg className="road__svg" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
        <line className="road__edge" x1={0} x2={w} y1={PAD_PX} y2={PAD_PX} />
        <line className="road__edge" x1={0} x2={w} y1={h - PAD_PX} y2={h - PAD_PX} />
        {[1, 2].map((b) => (
          <g key={b} className="road__marks">
            {dashes.map((x, i) => (
              <line key={i} className="road__dash" x1={x} x2={x + dashLen} y1={PAD_PX + layout.laneH * b} y2={PAD_PX + layout.laneH * b} />
            ))}
          </g>
        ))}
        {gap && !gap.short && (
          <g className="road__gap" data-testid="gap-line">
            <line x1={gap.x1} y1={gap.y1} x2={gap.x2} y2={gap.y2} stroke={gapTone} />
            {!gap.offscreen && <line x1={gap.x2} x2={gap.x2} y1={gap.y2 - 4} y2={gap.y2 + 4} stroke={gapTone} />}
          </g>
        )}
        {scene.bodies.map(({ car, ...b }) => {
          const isLead = car.isLead;
          const fill = isLead ? LEAD_FILL : car.inLane ? IN_LANE_FILL : SHADES[car.shade % SHADES.length];
          return (
            <g key={car.id} data-car={car.id}>
              <rect
                x={b.x1}
                y={b.y}
                width={b.x2 - b.x1}
                height={b.h}
                rx={Math.min(5, b.h / 3)}
                fill={fill}
                stroke={isLead ? (traffic.contact ? '#f07a7a' : leadTone) : car.bursting ? '#fab219' : 'none'}
                strokeWidth={isLead || car.bursting ? 2 : 0}
              />
              <rect x={b.x2 - (b.x2 - b.x1) * 0.42} y={b.y + 2} width={(b.x2 - b.x1) * 0.16} height={b.h - 4} rx={1.5} fill="rgba(10,12,15,0.35)" />
              {blinkers(b, car.signal)}
            </g>
          );
        })}
        <g data-car="player">
          <rect
            className="road__player"
            x={scene.player.x1}
            y={scene.player.y}
            width={scene.player.x2 - scene.player.x1}
            height={scene.player.h}
            rx={Math.min(6, scene.player.h / 3)}
            fill={color}
            stroke={traffic.contact ? '#f07a7a' : 'none'}
            strokeWidth={traffic.contact ? 2 : 0}
          />
          <rect
            x={scene.player.x2 - (scene.player.x2 - scene.player.x1) * 0.42}
            y={scene.player.y + 2}
            width={(scene.player.x2 - scene.player.x1) * 0.16}
            height={scene.player.h - 4}
            rx={1.5}
            fill="rgba(10,12,15,0.35)"
          />
          {blinkers(scene.player, lane.signal)}
        </g>
        {gap && gap.short && (
          <g className="road__gap road__gap--short" data-testid="gap-short">
            <rect x={Math.min(gap.x1, gap.x2) - 2} y={Math.min(gap.y1, gap.y2) - 6} width={Math.abs(gap.x2 - gap.x1) + 4} height={Math.abs(gap.y2 - gap.y1) + 12} rx={3} fill="none" stroke={gapTone} />
          </g>
        )}
      </svg>
      {scene.cues.map((c) => (
        <span
          key={`${c.side}${c.lane}`}
          className={`road__cue road__cue--${c.side} ${c.isLead ? 'is-lead' : ''}`}
          style={{ top: c.y, ...(c.isLead ? { color: leadTone, borderColor: leadTone } : {}) }}
          data-cue={c.id}
        >
          {c.side === 'ahead' ? `${distanceText(c.distanceM)} ›` : `‹ ${distanceText(c.distanceM)}`}
        </span>
      ))}
      {lead && gap && (
        <span
          className="road__gap-label"
          style={{ left: Math.min(Math.max(gap.midX, 40), w - 40), top: Math.max(0, Math.min(gap.y1, gap.y2) - (gap.short ? 22 : 17)), color: gapTone }}
        >
          {fmt(Math.max(0, lead.gapM))} m{lead.timeGapS !== null ? ` · ${lead.timeGapS.toFixed(1)} s` : ''}
        </span>
      )}
      {traffic.contact && <span className="road__contact">Too close — no collision model</span>}
    </div>
  );
}
