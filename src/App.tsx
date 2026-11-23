import { useEffect, useState, type ComponentType } from 'react';
import { Icon, type IconName } from './components/Icon';
import { useApp } from './state/AppState';
import { DragRaceView } from './views/DragRaceView';
import { DriveView } from './views/DriveView';
import { DynoView } from './views/DynoView';
import { GarageView } from './views/GarageView';
import { ResultsView } from './views/ResultsView';
import { TestsView } from './views/TestsView';
import { TuningView } from './views/TuningView';

export type ViewId = 'drive' | 'tests' | 'drag' | 'dyno' | 'tuning' | 'results' | 'garage';

interface ViewDef {
  id: ViewId;
  label: string;
  title: string;
  description: string;
  icon: IconName;
  component: ComponentType;
}

export const VIEWS: readonly ViewDef[] = [
  { id: 'drive', label: 'Drive', title: 'Live drive', description: 'Real-time simulation with touch pedals and paddles', icon: 'drive', component: DriveView },
  { id: 'tests', label: 'Tests', title: 'Acceleration tests', description: '0–100, 0–200 km/h and quarter mile', icon: 'tests', component: TestsView },
  { id: 'drag', label: 'Drag', title: 'Drag race', description: 'Head-to-head from a standing start', icon: 'drag', component: DragRaceView },
  { id: 'dyno', label: 'Dyno', title: 'Dyno', description: 'Power, torque and boost versus rpm', icon: 'dyno', component: DynoView },
  { id: 'tuning', label: 'Tuning', title: 'Tuning', description: 'ECU, tires, weight and model parameters', icon: 'tuning', component: TuningView },
  { id: 'results', label: 'Results', title: 'Saved results', description: 'Stored on this device — compare runs side by side', icon: 'results', component: ResultsView },
  { id: 'garage', label: 'Garage', title: 'Garage', description: 'My Garage, the full car catalog, specifications and sources', icon: 'garage', component: GarageView },
];

function readHash(): ViewId {
  const id = window.location.hash.replace(/^#\/?/, '').split('/')[0];
  return (VIEWS.find((v) => v.id === id)?.id ?? 'drive') as ViewId;
}

export function App() {
  const app = useApp();
  const [view, setView] = useState<ViewId>(readHash);

  useEffect(() => {
    const onHash = () => setView(readHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const go = (id: ViewId) => {
    if (id === view && !window.location.hash.includes(`${id}/`)) return;
    window.location.hash = `/${id}`;
    setView(id);
  };

  const current = VIEWS.find((v) => v.id === view)!;
  const View = current.component;

  return (
    <div className="app">
      <nav className="nav" aria-label="Main">
        <div className="nav__brand" aria-hidden="true">
          <svg viewBox="0 0 32 32" width="30" height="30">
            <path d="M4 22a12 12 0 1 1 24 0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M16 22l7-8" stroke="#d03b3b" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="16" cy="22" r="2.5" fill="currentColor" />
          </svg>
        </div>
        <ul className="nav__list">
          {VIEWS.map((v) => (
            <li key={v.id}>
              <button
                type="button"
                className={`nav__item ${v.id === view ? 'is-active' : ''}`}
                aria-current={v.id === view ? 'page' : undefined}
                onClick={() => go(v.id)}
              >
                <Icon name={v.icon} size={24} />
                <span>{v.label}</span>
                {v.id === 'results' && app.results.length > 0 && <span className="nav__count">{app.results.length}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <main className={`main ${current.id === 'drive' ? 'main--immersive' : ''}`}>
        <header className="main__head">
          <div>
            <h1 className="main__title">{current.title}</h1>
            <p className="main__desc">{current.description}</p>
          </div>
        </header>
        <View key={current.id} />
      </main>

      <div className="toasts" role="status" aria-live="polite">
        {app.toasts.map((t) => (
          <div key={t.id} className={`toast toast--${t.tone}`}>
            <Icon name={t.tone === 'good' ? 'check' : t.tone === 'warning' ? 'warning' : 'info'} size={18} />
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}
