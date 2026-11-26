// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { App } from '../App';
import { AppProvider } from '../state/AppState';
import { createMemoryStore } from '../storage/kv';

function renderApp() {
  return render(
    <AppProvider store={createMemoryStore()}>
      <App />
    </AppProvider>,
  );
}

const autoButton = () => screen.getByRole('button', { name: /Auto Drive/ });
const isOn = () => autoButton().getAttribute('aria-pressed') === 'true';
/** Let the requestAnimationFrame loop run a few frames. */
const frames = (ms = 120) => act(() => new Promise<void>((r) => setTimeout(r, ms)));

describe('Auto Drive (UI)', () => {
  beforeEach(() => {
    window.location.hash = '#/drive';
  });
  afterEach(cleanup);

  it('starts off, explains itself, and switches on with sparse traffic', () => {
    renderApp();
    expect(isOn()).toBe(false);
    expect(screen.getByText(/Simulator aid that works the accelerator and brake/)).toBeTruthy();
    expect((screen.getByLabelText('Traffic') as HTMLSelectElement).value).toBe('off');
    fireEvent.click(autoButton());
    expect(isOn()).toBe(true);
    expect((screen.getByLabelText('Traffic') as HTMLSelectElement).value).toBe('sparse');
    expect(screen.getByRole('button', { name: /Traffic seed 1/ })).toBeTruthy();
    fireEvent.click(autoButton());
    expect(isOn()).toBe(false);
  });

  it('switches off on focus loss, reset and car change, and needs a deliberate restart', async () => {
    renderApp();
    fireEvent.click(autoButton());
    act(() => {
      window.dispatchEvent(new Event('blur'));
    });
    expect(isOn()).toBe(false);
    expect(screen.getByText('Off — the app lost focus')).toBeTruthy();
    await frames();
    expect(isOn()).toBe(false);

    fireEvent.keyDown(window, { key: 'a' });
    expect(isOn()).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(isOn()).toBe(false);

    fireEvent.click(autoButton());
    expect(isOn()).toBe(true);
    const cars = screen.getByRole('radiogroup', { name: 'Active car' });
    fireEvent.click(within(cars).getByRole('radio', { name: /Škoda Superb 280/ }));
    await frames(60);
    expect(isOn()).toBe(false);
    expect(screen.getByText('Off — car changed')).toBeTruthy();
    // Traffic setting survives the car change; Auto Drive does not.
    expect((screen.getByLabelText('Traffic') as HTMLSelectElement).value).toBe('sparse');
  });

  it('is cancelled by the brake and drives the pedals while on', async () => {
    renderApp();
    fireEvent.change(screen.getByLabelText('Traffic'), { target: { value: 'cut-in' } });
    fireEvent.click(autoButton());
    await frames(300);
    expect(isOn()).toBe(true);
    expect(Number(screen.getByRole('slider', { name: 'Throttle' }).getAttribute('aria-valuenow'))).toBeGreaterThan(0);
    fireEvent.keyDown(window, { key: 's' });
    await frames();
    fireEvent.keyUp(window, { key: 's' });
    expect(isOn()).toBe(false);
    expect(screen.getByText('Cancelled — brake pressed')).toBeTruthy();
    // Braking while off refuses to start Auto Drive.
    fireEvent.keyDown(window, { key: 's' });
    await frames(60);
    fireEvent.click(autoButton());
    expect(isOn()).toBe(false);
    expect(screen.getByText('Release the brake to start Auto Drive')).toBeTruthy();
    fireEvent.keyUp(window, { key: 's' });
  });
});
