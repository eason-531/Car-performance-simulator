import { useEffect, useRef, type PointerEvent, type ReactNode } from 'react';
import type { AutoDriveView, CruiseView, TrafficView } from '../assist/liveDrive';
import { LIMIT_RANGE_KMH, ROAD_DEFAULT_LIMIT, ROAD_PRESETS, TAIWAN_QUICK_LIMITS, TRAFFIC_MODES, isGenerated, stepLimit, type RoadPreset, type RoadSettings, type TrafficMode } from '../assist/road';
import { Icon } from './Icon';

/**
 * A button that acts once on press and then repeats while held (cruise + and −),
 * stopping on release, cancel, lost capture or focus loss. Keyboard activation
 * acts once per press.
 */
function RepeatButton({ onStep, label, children, className = '' }: { onStep: () => void; label: string; children: ReactNode; className?: string }) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepRef = useRef(onStep);
  useEffect(() => {
    stepRef.current = onStep;
  });
  const stop = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };
  useEffect(() => {
    window.addEventListener('blur', stop);
    return () => {
      window.removeEventListener('blur', stop);
      stop();
    };
  }, []);
  const down = (e: PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    stop();
    stepRef.current();
    const repeat = (delay: number) => {
      timer.current = setTimeout(() => {
        stepRef.current();
        repeat(120);
      }, delay);
    };
    repeat(450);
  };
  return (
    <button
      type="button"
      className={`cruise__btn ${className}`}
      aria-label={label}
      title={label}
      onPointerDown={down}
      onPointerUp={stop}
      onPointerCancel={stop}
      onLostPointerCapture={stop}
      onClick={(e) => {
        if (e.detail === 0) stepRef.current();
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {children}
    </button>
  );
}

const CRUISE_STATE_TEXT: Record<CruiseView['state'], string> = {
  off: 'Not set',
  standby: 'Standby',
  cruise: 'Cruise active',
  cap: 'Auto Drive cap',
};

/** Conventional cruise control: SET, +, −, CANCEL, RESUME and the stored speed with its state. */
export function CruisePanel({ cruise, onAction }: { cruise: CruiseView; onAction: (a: 'set' | 'up' | 'down' | 'cancel' | 'resume') => void }) {
  const active = cruise.state === 'cruise' || cruise.state === 'cap';
  return (
    <div className={`cruise panel ${active ? 'is-active' : ''}`} role="group" aria-label="Cruise control">
      <button type="button" className="cruise__btn cruise__btn--text" onClick={() => onAction('cancel')} title="Cancel cruise (B) — keeps the set speed">
        CANCEL
      </button>
      <RepeatButton label="Set speed down 1 km/h (−)" onStep={() => onAction('down')}>
        <Icon name="minus" size={18} />
      </RepeatButton>
      <div className="cruise__readout" aria-live="polite">
        <span className="cruise__speed">{cruise.setKmh === null ? '—' : cruise.setKmh}</span>
        <span className="cruise__unit">km/h</span>
        <span className={`cruise__state cruise__state--${cruise.state}`}>{CRUISE_STATE_TEXT[cruise.state]}</span>
      </div>
      <RepeatButton label="Set speed up 1 km/h (+)" onStep={() => onAction('up')}>
        <Icon name="plus" size={18} />
      </RepeatButton>
      <button type="button" className="cruise__btn cruise__btn--text" onClick={() => onAction('set')} title="Set the current speed (C)">
        SET
      </button>
      <button type="button" className="cruise__btn cruise__btn--text" onClick={() => onAction('resume')} title="Resume the stored speed (V)">
        RES
      </button>
    </div>
  );
}

/** Change lane left or right (only ever on the player's command). */
export function LaneButton({ direction, onPress, changing }: { direction: -1 | 1; onPress: () => void; changing: boolean }) {
  const left = direction < 0;
  return (
    <button
      type="button"
      className={`lane-btn ${changing ? 'is-active' : ''}`}
      onClick={onPress}
      aria-label={left ? 'Change lane left' : 'Change lane right'}
      title={left ? 'Change lane left (Z)' : 'Change lane right (X)'}
    >
      {left ? '◀ Lane' : 'Lane ▶'}
    </button>
  );
}

/**
 * The compact Auto Drive row under the road: the Auto Drive switch, traffic
 * (with its seed in every generated mode), road preset and the traffic
 * speed limit with quick choices and a way back to the preset's default.
 */
export function AssistBar({
  auto,
  traffic,
  onToggleAuto,
  onTraffic,
  onReroll,
  onRoad,
}: {
  auto: AutoDriveView;
  traffic: TrafficView;
  onToggleAuto: () => void;
  onTraffic: (mode: TrafficMode) => void;
  onReroll: () => void;
  onRoad: (road: RoadSettings) => void;
}) {
  const road = traffic.road;
  const def = ROAD_DEFAULT_LIMIT[road.preset];
  const quick: (number | null)[] = road.preset === 'taiwan' ? [...TAIWAN_QUICK_LIMITS] : [null];
  const limitText = road.limitKmh === null ? 'No limit' : `${road.limitKmh}`;
  return (
    <div className="assist-bar">
      <button
        type="button"
        className={`assist__toggle ${auto.engaged ? 'is-on' : ''}`}
        aria-pressed={auto.engaged}
        onClick={onToggleAuto}
        title="Auto Drive: works the accelerator and brake (A)"
      >
        <span className="assist__led" aria-hidden="true" />
        <span className="assist__name">Auto Drive</span>
        <span className="assist__state">{auto.engaged ? 'On' : 'Off'}</span>
      </button>
      <div className="assist-bar__group">
        <select className="assist__select" value={traffic.mode} onChange={(e) => onTraffic(e.target.value as TrafficMode)} aria-label="Traffic">
          {TRAFFIC_MODES.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
        {isGenerated(traffic.mode) && (
          <button type="button" className="assist__seed" onClick={onReroll} title="New traffic seed (Reset replays the current one)" aria-label={`Traffic seed ${traffic.seed}: new seed`}>
            #{traffic.seed} <Icon name="reset" size={14} />
          </button>
        )}
      </div>
      <div className="assist-bar__group">
        <select
          className="assist__select assist__select--road"
          value={road.preset}
          onChange={(e) => {
            const preset = e.target.value as RoadPreset;
            onRoad({ preset, limitKmh: ROAD_DEFAULT_LIMIT[preset] });
          }}
          aria-label="Road preset"
        >
          {ROAD_PRESETS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
        <div className="limit" role="group" aria-label="NPC speed limit">
          <button type="button" className="limit__step" aria-label="Lower NPC speed limit" disabled={road.limitKmh !== null && road.limitKmh <= LIMIT_RANGE_KMH[0]} onClick={() => onRoad({ ...road, limitKmh: stepLimit(road.limitKmh, -1) })}>
            <Icon name="minus" size={16} />
          </button>
          <span className="limit__value" aria-label={`NPC speed limit ${limitText}${road.limitKmh === null ? '' : ' km/h'}`}>
            {limitText}
          </span>
          <button type="button" className="limit__step" aria-label="Raise NPC speed limit" disabled={road.limitKmh === null || road.limitKmh >= LIMIT_RANGE_KMH[1]} onClick={() => onRoad({ ...road, limitKmh: stepLimit(road.limitKmh, 1) })}>
            <Icon name="plus" size={16} />
          </button>
          {quick.map((q) => (
            <button key={String(q)} type="button" className={`limit__chip ${road.limitKmh === q ? 'is-active' : ''}`} aria-pressed={road.limitKmh === q} onClick={() => onRoad({ ...road, limitKmh: q })}>
              {q === null ? 'No limit' : q}
            </button>
          ))}
          <button type="button" className="limit__chip" disabled={road.limitKmh === def} onClick={() => onRoad({ ...road, limitKmh: def })} title="Restore the preset's default limit">
            Default
          </button>
        </div>
      </div>
    </div>
  );
}
