// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { App } from '../App';
import { AppProvider } from '../state/AppState';
import { createMemoryStore } from '../storage/kv';
import { SETTINGS_KEY } from '../storage/settings';

const IONIQ = '2025-hyundai-ioniq-5-n-us-cuv-awd-ev';
const TAYCAN = '2020-porsche-taycan-turbo-s-us-sedan-awd-ev2';

function renderWith(activeVehicleId: string) {
  const store = createMemoryStore();
  store.set(SETTINGS_KEY, JSON.stringify({ activeVehicleId }));
  return render(
    <AppProvider store={store}>
      <App />
    </AppProvider>,
  );
}

const frames = (ms = 120) => act(() => new Promise<void>((r) => setTimeout(r, ms)));

describe('Electric boost controls in Live Drive (UI)', () => {
  beforeEach(() => {
    window.location.hash = '#/drive';
  });
  afterEach(cleanup);

  it('offers the N Grin Boost button, runs it, and refuses a second press while it runs', async () => {
    renderWith(IONIQ);
    const button = screen.getByRole('button', { name: /^N Grin Boost: ready/ });
    fireEvent.click(button);
    expect(screen.getByRole('button', { name: /^N Grin Boost: running, 10 s left/ })).toBeTruthy();
    await frames();
    fireEvent.keyDown(window, { key: 'n' });
    expect(screen.getByText(/Boost already running/)).toBeTruthy();
    expect(screen.getByLabelText(/Published boost active: on/)).toBeTruthy();
  });

  it('has no boost button on a launch-control car but shows the launch-control light', () => {
    renderWith(TAYCAN);
    expect(screen.queryByRole('button', { name: /Boost:/ })).toBeNull();
    expect(screen.getByLabelText(/Launch control ready.*: off/)).toBeTruthy();
  });
});
