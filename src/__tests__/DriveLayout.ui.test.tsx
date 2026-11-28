// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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

const before = (a: Element, b: Element) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;

describe('Live Drive layout (UI)', () => {
  beforeEach(() => {
    window.location.hash = '#/drive';
  });
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('keeps only the road, the lane / Auto Drive row and nothing else between the gauges and the paddles', () => {
    const { container } = renderApp();
    const roadbar = container.querySelector('.drive__roadbar')!;
    expect(roadbar).toBeTruthy();
    // Lane buttons and the Auto Drive switch sit in the row under the road, with the status between them.
    for (const name of ['Change lane left', 'Change lane right']) expect(roadbar.contains(screen.getByRole('button', { name }))).toBe(true);
    const auto = screen.getByRole('button', { name: /Auto Drive/ });
    expect(roadbar.contains(auto)).toBe(true);
    expect(roadbar.querySelector('.drive__assist-note [role="status"]')?.textContent).toBe('Auto Drive off');
    // Order: gauges → road → lane / Auto Drive row → paddles; traffic and road settings and the timer come after.
    const gauge = screen.getByRole('meter', { name: 'Speed' });
    const road = container.querySelector('.road')!;
    const up = screen.getByRole('button', { name: 'Shift up' });
    const traffic = screen.getByLabelText('Traffic');
    expect(before(gauge, road) && before(road, roadbar) && before(roadbar, up)).toBe(true);
    expect(before(up, traffic)).toBe(true);
    expect(container.querySelector('.drive__lower')!.contains(traffic)).toBe(true);
    expect(container.querySelector('.drive__lower')!.contains(screen.getByText('Performance timer'))).toBe(true);
    // The pedals share the paddles' row; the cruise panel sits under the paddles.
    const controls = container.querySelector('.drive__controls')!;
    expect(controls.contains(screen.getByRole('slider', { name: 'Throttle' }))).toBe(true);
    expect(controls.contains(screen.getByRole('group', { name: 'Cruise control' }))).toBe(true);
  });

  it('publishes the measured stack under the gauge so short screens shrink the gauges, not the paddles', () => {
    let observed: (() => void) | null = null;
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(cb: () => void) {
          observed = cb;
        }
        observe() {}
        disconnect() {}
      },
    );
    // Layout stub: the view starts 20 px down, the controls end 640 px below it and the main gauge is 250 px tall.
    const rect = (top: number, height: number) => ({ top, bottom: top + height, height, left: 0, right: 0, width: 0, x: 0, y: top, toJSON: () => ({}) }) as DOMRect;
    let gaugeH = 250;
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      if (this.classList.contains('drive')) return rect(20, 900);
      // Everything under the cluster moves with the gauge height.
      if (this.classList.contains('drive__controls')) return rect(500 - (250 - gaugeH), 160);
      if (this.classList.contains('gauge') && this.closest('.drive__gauge--main')) return rect(100, gaugeH);
      return rect(0, 0);
    });
    vi.spyOn(HTMLElement.prototype, 'offsetTop', 'get').mockImplementation(function (this: HTMLElement) {
      return this.classList.contains('drive') ? 12 : 0;
    });
    const { container } = renderApp();
    const view = container.querySelector<HTMLElement>('.view.drive')!;
    // 12 (page offset) + (660 − 20) (controls bottom below the view top) − 250 (gauge) + 12 (margin) = 414 px.
    expect(view.style.getPropertyValue('--drive-stack')).toBe('414px');
    // Once the stylesheet shrinks the gauge the controls move up with it and the stack stays put: the fit settles in one pass.
    gaugeH = 200;
    observed!();
    expect(view.style.getPropertyValue('--drive-stack')).toBe('414px');
    // A taller bar (e.g. it wrapped) pushes the controls down: the stack grows by the same amount.
    vi.spyOn(HTMLElement.prototype, 'offsetTop', 'get').mockImplementation(function (this: HTMLElement) {
      return this.classList.contains('drive') ? 72 : 0;
    });
    observed!();
    expect(view.style.getPropertyValue('--drive-stack')).toBe('474px');
  });
});
