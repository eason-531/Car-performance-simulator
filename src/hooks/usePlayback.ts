import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Plays a pre-computed run back over time with requestAnimationFrame.
 * `time` is null when idle (show everything) or the current playback time.
 */
export function usePlayback(durationS: number, speed = 1) {
  const [time, setTime] = useState<number | null>(null);
  const raf = useRef(0);
  const stop = useCallback(() => {
    cancelAnimationFrame(raf.current);
    setTime(null);
  }, []);
  const play = useCallback(
    (onDone?: () => void) => {
      cancelAnimationFrame(raf.current);
      let t = 0;
      let last = performance.now();
      setTime(0);
      const tick = (now: number) => {
        t += (Math.min(0.1, (now - last) / 1000) || 0) * speed;
        last = now;
        if (t >= durationS) {
          setTime(null);
          onDone?.();
          return;
        }
        setTime(t);
        raf.current = requestAnimationFrame(tick);
      };
      raf.current = requestAnimationFrame(tick);
    },
    [durationS, speed],
  );
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  return { time, playing: time !== null, play, stop };
}
