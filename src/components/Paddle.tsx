import { useState, type MouseEvent, type PointerEvent } from 'react';
import { Icon } from './Icon';

/**
 * Shift paddle that fires on pointer-down instead of click.
 *
 * iOS Safari only turns a tap into a `click` when it is the sole touch on the
 * screen, so with a finger holding the throttle pedal a click-based paddle
 * never shifts. Pointer events are delivered per finger, so acting on
 * pointer-down works mid-throttle (and removes tap latency). Keyboard
 * activation (Enter / Space) still arrives as a click with `detail === 0`.
 */
export function Paddle({
  direction,
  onShift,
  label,
  title,
}: {
  direction: 1 | -1;
  onShift: (direction: 1 | -1) => void;
  label: string;
  title: string;
}) {
  const [pressed, setPressed] = useState(false);

  const down = (e: PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return; // primary button / touch / pen only
    e.preventDefault();
    setPressed(true);
    onShift(direction);
  };
  const release = () => setPressed(false);
  const click = (e: MouseEvent<HTMLButtonElement>) => {
    // Pointer clicks were already handled on pointer-down.
    if (e.detail === 0) onShift(direction);
  };

  return (
    <button
      type="button"
      className={`paddle ${pressed ? 'is-pressed' : ''}`}
      aria-label={label}
      title={title}
      onPointerDown={down}
      onPointerUp={release}
      onPointerCancel={release}
      onPointerLeave={release}
      onClick={click}
      onContextMenu={(e) => e.preventDefault()}
    >
      <Icon name={direction > 0 ? 'plus' : 'minus'} size={30} />
      <span>{direction > 0 ? 'Up' : 'Down'}</span>
    </button>
  );
}
