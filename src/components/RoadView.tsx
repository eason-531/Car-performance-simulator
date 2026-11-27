import { useLayoutEffect, useMemo, useRef } from 'react';
import type { AutoDriveView, PlayerLaneView, TrafficView } from '../assist/liveDrive';
import { useElementSize } from '../hooks/useElementSize';
import { fmt } from '../lib/format';
import { drawRoad } from './roadCanvas';
import { dashXs, roadLayout, roadScene, type RoadScene } from './roadGeometry';

function distanceText(m: number): string {
  return m >= 1000 ? `${fmt(m / 1000, 1)} km` : `${fmt(Math.round(m / 5) * 5)} m`;
}

/** The canvas keeps the last painted scene, so browser checks can compare pixels with geometry. */
export type RoadCanvasElement = HTMLCanvasElement & { roadScene?: RoadScene };

const IS_JSDOM = typeof navigator !== 'undefined' && /jsdom/i.test(navigator.userAgent);

/**
 * Top-down road strip for Live Drive: three lanes across the full width at
 * one fixed scale, the player in its lane (moving between lanes on command),
 * traffic, the tracked lead with a bumper-to-bumper gap line, and edge cues
 * for traffic beyond the drawn range. Painted on one canvas per frame from a
 * single scene; a view of the simulation state only.
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
  const canvasRef = useRef<RoadCanvasElement>(null);
  const layout = useMemo(() => roadLayout(width, height), [width, height]);
  const lead = traffic.lead;
  const scene = roadScene(layout, traffic.cars, lane.lat, speedKmh, lead?.id ?? null);
  const leadTone = !auto.engaged ? '#f0efec' : auto.mode === 'braking' || auto.mode === 'stopped' ? '#f07a7a' : auto.mode === 'following' ? '#fab219' : '#f0efec';
  const gapTone = traffic.contact || (scene.gap?.short ?? false) ? '#f07a7a' : leadTone;
  const gapText = lead && scene.gap ? `${fmt(Math.max(0, lead.gapM))} m${lead.timeGapS !== null ? ` · ${lead.timeGapS.toFixed(1)} s` : ''}` : null;

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || IS_JSDOM) return;
    const dpr = Math.min(3, window.devicePixelRatio || 1);
    const pw = Math.round(layout.width * dpr);
    const ph = Math.round(layout.height * dpr);
    if (canvas.width !== pw) canvas.width = pw;
    if (canvas.height !== ph) canvas.height = ph;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawRoad(ctx, {
      scene,
      dashes: dashXs(layout, distanceM),
      blink: Math.floor(timeS * 3) % 2 === 0,
      playerColor: color,
      playerSignal: lane.signal,
      leadTone,
      gapTone,
      contact: traffic.contact,
      gapText,
      // The horizon strip is narrower on small screens: the arrow is dropped there.
      cueText: (c) => (c.side === 'ahead' ? (layout.width < 520 ? distanceText(c.distanceM) : `${distanceText(c.distanceM)} ›`) : `‹ ${distanceText(c.distanceM)}`),
    });
    canvas.roadScene = scene;
  });

  return (
    <div className="road" ref={ref} data-px-per-m={layout.pxPerM.toFixed(3)}>
      <canvas ref={canvasRef} className="road__canvas" aria-hidden="true" />
      {traffic.contact && <span className="visually-hidden">Too close — no collision model</span>}
    </div>
  );
}
