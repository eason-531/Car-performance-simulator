import { STATUS } from '../lib/colors';

const LEDS = 10;

/** Motorsport-style shift light bar: fills over the last 1,800 rpm before the shift point. */
export function ShiftLights({ rpm, shiftRpm }: { rpm: number; shiftRpm: number }) {
  const start = shiftRpm - 1800;
  const lit = Math.max(0, Math.min(LEDS, Math.floor(((rpm - start) / (shiftRpm - start)) * LEDS)));
  const flash = rpm >= shiftRpm - 30;
  return (
    <div className={`shift-lights ${flash ? 'is-flashing' : ''}`} aria-hidden="true">
      {Array.from({ length: LEDS }, (_, i) => {
        const color = i < 4 ? STATUS.good : i < 7 ? STATUS.warning : STATUS.critical;
        const on = flash || i < lit;
        return (
          <span
            key={i}
            className={`shift-lights__led ${on ? 'is-on' : ''}`}
            style={on ? { background: flash ? STATUS.critical : color, boxShadow: `0 0 10px ${flash ? STATUS.critical : color}` } : undefined}
          />
        );
      })}
    </div>
  );
}
