import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Plays a pre-computed run back over time with requestAnimationFrame.
 * `time` is null when idle (show everything) or the current playback time.
 * A new run identity cancels playback, even if the new trace has the same duration.
 */
export function usePlayback(durationS: number, speed = 1, run: object | number = durationS) {
  const [progress, setProgress] = useState<{ run: object | number; time: number } | null>(null);
  const time = progress?.run === run ? progress.time : null;
  const raf = useRef(0);
  const stop = useCallback(() => {
    cancelAnimationFrame(raf.current);
    setProgress(null);
  }, []);
  const play = useCallback(
    (onDone?: () => void) => {
      cancelAnimationFrame(raf.current);
      let t = 0;
      let last = performance.now();
      setProgress({ run, time: 0 });
      const tick = (now: number) => {
        t += (Math.min(0.1, (now - last) / 1000) || 0) * speed;
        last = now;
        if (t >= durationS) {
          setProgress(null);
          onDone?.();
          return;
        }
        setProgress({ run, time: t });
        raf.current = requestAnimationFrame(tick);
      };
      raf.current = requestAnimationFrame(tick);
    },
    [durationS, speed, run],
  );
  useEffect(() => () => cancelAnimationFrame(raf.current), [run]);
  return { time, playing: time !== null, play, stop };
}
