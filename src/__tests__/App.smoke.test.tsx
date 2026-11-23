// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { App, VIEWS } from '../App';
import { AppProvider } from '../state/AppState';
import { createMemoryStore, type KeyValueStore } from '../storage/kv';
import { RESULTS_KEY } from '../storage/results';

let store: KeyValueStore;

function renderApp() {
  return render(
    <AppProvider store={store}>
      <App />
    </AppProvider>,
  );
}

function openView(label: string) {
  const nav = screen.getByRole('navigation', { name: 'Main' });
  fireEvent.click(within(nav).getByRole('button', { name: new RegExp(`^${label}`) }));
}

describe('App (smoke)', () => {
  beforeEach(() => {
    store = createMemoryStore();
    window.location.hash = '';
  });
  afterEach(cleanup);

  it('renders every view without crashing', () => {
    renderApp();
    for (const view of VIEWS) {
      openView(view.label);
      expect(screen.getByRole('heading', { level: 1, name: view.title })).toBeTruthy();
    }
  });

  it('shows live gauges and pedals on the Drive view', () => {
    renderApp();
    expect(screen.getByRole('meter', { name: 'Engine speed' })).toBeTruthy();
    expect(screen.getByRole('meter', { name: 'Speed' })).toBeTruthy();
    expect(screen.getByRole('meter', { name: 'Boost pressure' })).toBeTruthy();
    expect(screen.getByRole('slider', { name: 'Throttle' })).toBeTruthy();
    expect(screen.getByRole('slider', { name: 'Brake' })).toBeTruthy();
    fireEvent.click(screen.getByRole('radio', { name: 'Manual' }));
    expect(screen.getByRole('radio', { name: 'Manual' }).getAttribute('aria-checked')).toBe('true');
    expect(screen.getByRole('button', { name: 'Shift up' })).toBeTruthy();
  });

  it('saves an acceleration test and lists it in Results', () => {
    renderApp();
    openView('Tests');
    expect(screen.getAllByText('0–100 km/h').length).toBeGreaterThan(0);
    expect(screen.getByText(/^Factory 7\.0 s/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Save result' }));
    expect(screen.getByRole('button', { name: 'Saved' })).toBeTruthy();
    const stored = JSON.parse(store.get(RESULTS_KEY) ?? '[]') as unknown[];
    expect(stored).toHaveLength(1);
    openView('Results');
    expect(screen.getByText(/1 stored on this device/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /^Select / }));
    expect(screen.getByText('Selected result')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /^Delete / }));
    expect(screen.getByText('No saved results yet')).toBeTruthy();
  });

  it('applies Stage 1 from the Tuning view and persists it', () => {
    renderApp();
    openView('Tuning');
    fireEvent.click(screen.getByRole('radio', { name: /Stage 1/ }));
    expect(screen.getByRole('button', { name: 'Reset to stock' })).toBeTruthy();
    const settings = JSON.parse(store.get('cps:v1:settings') ?? '{}') as { tunings: Record<string, { ecuStage: string }> };
    expect(settings.tunings['lexus-is200t-2016-tw'].ecuStage).toBe('stage1');
    fireEvent.click(screen.getByRole('button', { name: 'Reset to stock' }));
    expect(screen.getByText('Stock configuration')).toBeTruthy();
  });

  it('runs a drag race to the finish and shows the winner', () => {
    renderApp();
    openView('Drag');
    fireEvent.click(screen.getByRole('button', { name: 'Start race' }));
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Skip to finish' }));
    });
    expect(screen.getByRole('heading', { name: /wins/ })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Save both runs' }));
    expect((JSON.parse(store.get(RESULTS_KEY) ?? '[]') as unknown[]).length).toBe(2);
  });

  it('shows data provenance in the Garage', () => {
    renderApp();
    openView('Garage');
    expect(screen.getAllByText('Estimated').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Verified').length).toBeGreaterThan(0);
  });
});
