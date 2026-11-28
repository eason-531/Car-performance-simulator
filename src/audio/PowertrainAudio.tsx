import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Button } from '../components/ui';
import type { VehicleSpec } from '../data/types';
import { useApp } from '../state/AppState';
import { soundProfile } from './profile';
import { PowertrainVoice, type SoundFrame } from './voice';

const AudioSession = createContext<{
  context: AudioContext | null;
  enabled: boolean;
  toggle: () => void;
} | null>(null);

export function PowertrainAudioProvider({ children }: { children: ReactNode }) {
  const { notify } = useApp();
  const session = useRef<{ context: AudioContext | null; wanted: boolean; attempt: number }>({
    context: null, wanted: false, attempt: 0,
  });
  const [ready, setReady] = useState<AudioContext | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(() => document.visibilityState !== 'hidden');

  useEffect(() => {
    const audio = session.current;
    const visibility = () => setVisible(document.visibilityState !== 'hidden');
    const hide = () => setVisible(false);
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('pagehide', hide);
    window.addEventListener('pageshow', visibility);
    return () => {
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('pagehide', hide);
      window.removeEventListener('pageshow', visibility);
      ++audio.attempt;
      audio.wanted = false;
      const context = audio.context;
      audio.context = null;
      if (context) {
        context.onstatechange = null;
        void context.close().catch(() => {});
      }
    };
  }, []);

  const toggle = () => {
    const audio = session.current;
    const id = ++audio.attempt;
    const mute = () => {
      ++audio.attempt;
      audio.wanted = false;
      setEnabled(false);
      setReady(null);
    };
    if (audio.wanted) {
      mute();
      return;
    }
    const unavailable = () => {
      if (id !== audio.attempt) return;
      mute();
      notify('Sound could not start. Tap Powertrain sound to try again.', 'warning');
    };
    if (!window.AudioContext) {
      notify('Powertrain sound is unavailable in this browser.', 'warning');
      return;
    }

    try {
      const existing = audio.context;
      const context = existing && existing.state !== 'closed' ? existing : new AudioContext();
      audio.context = context;
      audio.wanted = true;
      setEnabled(true);
      let started = false;
      const readyToPlay = () => {
        if (id !== audio.attempt) return;
        if (context.state !== 'running') {
          unavailable();
          return;
        }
        started = true;
        setReady(context);
      };
      context.onstatechange = () => {
        if (id !== audio.attempt) return;
        if (context.state === 'running') readyToPlay();
        else if (started || context.state === 'closed') mute();
      };
      // Creating/resuming the context inside the button's click also unlocks it in Safari.
      if (context.state === 'running') readyToPlay();
      else void context.resume().then(readyToPlay, unavailable);
    } catch {
      unavailable();
    }
  };

  return <AudioSession.Provider value={{ context: visible ? ready : null, enabled, toggle }}>{children}</AudioSession.Provider>;
}

export function SoundButton() {
  const audio = useContext(AudioSession);
  if (!audio) return null;
  return <Button icon={audio.enabled ? 'sound' : 'muted'} ariaLabel="Powertrain sound" ariaPressed={audio.enabled} onClick={audio.toggle} />;
}

export function PowertrainSound({ spec, frame, virtualShift = false, pan = 0 }: {
  spec: VehicleSpec;
  frame: SoundFrame | null;
  virtualShift?: boolean;
  pan?: number;
}) {
  const context = useContext(AudioSession)?.context;
  const audible = frame !== null;
  const profile = useMemo(() => soundProfile(spec, virtualShift), [spec, virtualShift]);
  const voice = useRef<PowertrainVoice | null>(null);

  useLayoutEffect(() => {
    if (!context || !audible) return;
    const current = new PowertrainVoice(context, profile, pan);
    voice.current = current;
    return () => {
      voice.current = null;
      current.dispose();
    };
  }, [context, audible, profile, pan]);

  useLayoutEffect(() => {
    if (frame) voice.current?.update(frame);
  }, [frame, context, profile, pan]);
  return null;
}
