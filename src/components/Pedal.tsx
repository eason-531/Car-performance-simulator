import { useRef, type KeyboardEvent, type PointerEvent } from 'react';

/**
 * Touch pedal. Press anywhere on it: the higher the finger, the deeper the
 * pedal. Releasing returns it to zero. Each pedal tracks its own pointer, so
 * throttle and brake can be pressed at the same time (left-foot braking).
 */
export function Pedal({
  kind,
  value,
  onChange,
  keyHint,
}: {
  kind: 'throttle' | 'brake';
  value: number;
  onChange: (v: number) => void;
  keyHint: string;
}) {
  const pointer = useRef<number | null>(null);
  const label = kind === 'throttle' ? 'Throttle' : 'Brake';

  const fromEvent = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const raw = 1 - (e.clientY - rect.top) / rect.height;
    // Top 15 % = full pedal, bottom 8 % = light touch.
    return Math.min(1, Math.max(0.08, (raw - 0.04) / 0.81));
  };

  const down = (e: PointerEvent<HTMLDivElement>) => {
    if (pointer.current !== null) return;
    pointer.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
    onChange(fromEvent(e));
  };
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerId === pointer.current) onChange(fromEvent(e));
  };
  const up = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerId !== pointer.current) return;
    pointer.current = null;
    onChange(0);
  };
  const key = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowUp' || e.key === 'PageUp') onChange(Math.min(1, value + 0.1));
    else if (e.key === 'ArrowDown' || e.key === 'PageDown') onChange(Math.max(0, value - 0.1));
    else if (e.key === 'Home') onChange(0);
    else if (e.key === 'End') onChange(1);
    else return;
    e.preventDefault();
  };

  return (
    <div
      className={`pedal pedal--${kind} ${value > 0 ? 'is-pressed' : ''}`}
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
      aria-valuetext={`${Math.round(value * 100)} %`}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      onKeyDown={key}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="pedal__fill" style={{ transform: `scaleY(${value})` }} />
      <div className="pedal__ridges" aria-hidden="true" />
      <div className="pedal__text">
        <span className="pedal__name">{label}</span>
        <span className="pedal__pct">{Math.round(value * 100)}%</span>
        <span className="pedal__hint">{keyHint}</span>
      </div>
    </div>
  );
}
