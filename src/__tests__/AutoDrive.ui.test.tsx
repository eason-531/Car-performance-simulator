// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
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
    expect(screen.getByText(/simulator aid that works the accelerator and brake/)).toBeTruthy();
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

describe('Live Drive controls (UI)', () => {
  beforeEach(() => {
    window.location.hash = '#/drive';
  });
  afterEach(cleanup);

  it('releases a pedal held with its own keys when the app loses focus or is hidden', async () => {
    renderApp();
    const throttle = screen.getByRole('slider', { name: 'Throttle' });
    const value = () => throttle.getAttribute('aria-valuenow');
    fireEvent.keyDown(throttle, { key: 'End' });
    await waitFor(() => expect(value()).toBe('100'), { timeout: 4000 });
    act(() => {
      window.dispatchEvent(new Event('blur'));
    });
    await waitFor(() => expect(value()).toBe('0'), { timeout: 4000 });
    fireEvent.keyDown(throttle, { key: 'End' });
    await waitFor(() => expect(Number(value())).toBeGreaterThan(0), { timeout: 4000 });
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' });
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'visible' });
    await waitFor(() => expect(value()).toBe('0'), { timeout: 4000 });
  });

  it('releases a touch pedal on pointer cancel and lost capture, keeping both pedals independent', async () => {
    renderApp();
    const throttle = screen.getByRole('slider', { name: 'Throttle' });
    const brake = screen.getByRole('slider', { name: 'Brake' });
    for (const el of [throttle, brake]) {
      el.getBoundingClientRect = () => ({ top: 0, left: 0, width: 100, height: 200, right: 100, bottom: 200, x: 0, y: 0, toJSON: () => ({}) });
      el.setPointerCapture = () => {};
    }
    fireEvent.pointerDown(throttle, { pointerId: 1, clientY: 0 });
    fireEvent.pointerDown(brake, { pointerId: 2, clientY: 0 });
    await waitFor(() => {
      expect(Number(throttle.getAttribute('aria-valuenow'))).toBeGreaterThan(0);
      expect(Number(brake.getAttribute('aria-valuenow'))).toBeGreaterThan(0);
    }, { timeout: 4000 });
    fireEvent.lostPointerCapture(throttle, { pointerId: 1 });
    fireEvent.pointerCancel(brake, { pointerId: 2 });
    await waitFor(() => {
      expect(throttle.getAttribute('aria-valuenow')).toBe('0');
      expect(brake.getAttribute('aria-valuenow')).toBe('0');
    }, { timeout: 4000 });
  });

  it('offers every traffic mode, a seed in generated modes, and road presets with a limit and default', () => {
    renderApp();
    const traffic = screen.getByLabelText('Traffic') as HTMLSelectElement;
    expect([...traffic.options].map((o) => o.value)).toEqual(['off', 'very-sparse', 'sparse', 'mid', 'heavy', 'stuck', 'auto', 'cut-in', 'drivers']);
    for (const mode of ['very-sparse', 'mid', 'heavy', 'stuck', 'auto']) {
      fireEvent.change(traffic, { target: { value: mode } });
      expect(screen.getByRole('button', { name: /Traffic seed \d+: new seed/ })).toBeTruthy();
    }
    fireEvent.change(traffic, { target: { value: 'cut-in' } });
    expect(screen.queryByRole('button', { name: /Traffic seed/ })).toBeNull();
    // Taiwan: 110 by default with a 100 quick choice; Autobahn: no limit; a custom value and Default.
    expect(screen.getByLabelText('NPC speed limit 110 km/h')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '100' }));
    expect(screen.getByLabelText('NPC speed limit 100 km/h')).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Road preset'), { target: { value: 'autobahn' } });
    expect(screen.getByLabelText('NPC speed limit No limit')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Lower NPC speed limit' }));
    fireEvent.click(screen.getByRole('button', { name: 'Lower NPC speed limit' }));
    expect(screen.getByLabelText('NPC speed limit 190 km/h')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Default' }));
    expect(screen.getByLabelText('NPC speed limit No limit')).toBeTruthy();
  });

  it('does not accept Auto Drive or change traffic when the brake was pressed earlier in the same frame', () => {
    renderApp();
    fireEvent.keyDown(window, { key: 's' });
    fireEvent.click(autoButton());
    expect(isOn()).toBe(false);
    expect((screen.getByLabelText('Traffic') as HTMLSelectElement).value).toBe('off');
    expect(screen.getByText('Release the brake to start Auto Drive')).toBeTruthy();
    fireEvent.keyUp(window, { key: 's' });
    fireEvent.click(autoButton());
    expect(isOn()).toBe(true);
  });

  it('explains cruise and lane commands it cannot carry out', () => {
    renderApp();
    fireEvent.click(screen.getByRole('button', { name: 'SET' }));
    expect(screen.getByText('Drive above 20 km/h to set a speed')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'RES' }));
    expect(screen.getByText('No set speed stored yet — use SET')).toBeTruthy();
    expect(screen.getByRole('group', { name: 'Cruise control' }).textContent).toContain('Not set');
    fireEvent.click(screen.getByRole('button', { name: 'Change lane left' }));
    fireEvent.keyDown(window, { key: 'z' });
    expect(screen.getByText('Already changing lanes')).toBeTruthy();
  });
});
