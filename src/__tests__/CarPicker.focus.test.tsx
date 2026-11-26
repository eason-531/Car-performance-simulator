// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { App } from '../App';
import { Root } from '../Root';
import { AppProvider } from '../state/AppState';
import { createMemoryStore } from '../storage/kv';

/**
 * Each check runs twice: without StrictMode (the production behaviour) and
 * through the app's real `Root` wrapper, whose StrictMode replays effects in
 * development (mount → cleanup → mount). The picker must hold up in both.
 */
const MODES = [
  ['without StrictMode', () => render(<AppProvider store={createMemoryStore()}><App /></AppProvider>)],
  ['through the StrictMode Root', () => render(<Root store={createMemoryStore()} />)],
] as const;

function openDragView(mount: () => unknown) {
  mount();
  const nav = screen.getByRole('navigation', { name: 'Main' });
  fireEvent.click(within(nav).getByRole('button', { name: /^Drag/ }));
}

/** Focus the Lane B car button and open its picker the way a keyboard user would. */
function openLaneBPicker() {
  const opener = screen.getByRole('button', { name: /^Lane B car:/ });
  opener.focus();
  fireEvent.click(opener);
  const dialog = screen.getByRole('dialog');
  return { opener, dialog, search: within(dialog).getByPlaceholderText(/Search make/) };
}

describe.each(MODES)('car picker focus handling (%s)', (_mode, mount) => {
  beforeEach(() => {
    window.location.hash = '';
  });
  afterEach(cleanup);

  it('gives the search field focus on open and returns it to the opener on Escape', () => {
    openDragView(mount);
    const { opener, search } = openLaneBPicker();
    expect(document.activeElement).toBe(search);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(opener);
  });

  it('keeps focus inside the dialog while it is open and re-rendering', () => {
    openDragView(mount);
    const { dialog, search } = openLaneBPicker();
    fireEvent.change(search, { target: { value: 'porsche' } });
    fireEvent.change(search, { target: { value: '' } });
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it('returns focus to the opener after the close button', () => {
    openDragView(mount);
    const { opener, dialog } = openLaneBPicker();
    fireEvent.click(within(dialog).getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(opener);
  });

  it('returns focus to the opener after a backdrop tap', () => {
    openDragView(mount);
    const { opener, dialog } = openLaneBPicker();
    const backdrop = dialog.parentElement!;
    expect(backdrop.className).toContain('dialog-backdrop');
    fireEvent.pointerDown(backdrop);
    // The browser's own mousedown on non-focusable space blurs to <body> before
    // the click; the dialog must still hand focus back once it closes.
    (document.activeElement as HTMLElement | null)?.blur();
    fireEvent.click(backdrop);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(opener);
  });

  it('does not close when a press starts inside the dialog and ends on the backdrop', () => {
    openDragView(mount);
    const { dialog, search } = openLaneBPicker();
    fireEvent.pointerDown(search);
    fireEvent.click(dialog.parentElement!);
    expect(screen.queryByRole('dialog')).not.toBeNull();
  });

  it('returns focus to the opener after choosing a car', () => {
    openDragView(mount);
    const { dialog, search } = openLaneBPicker();
    fireEvent.change(search, { target: { value: 'gr86' } });
    fireEvent.click(within(dialog).getByRole('button', { name: /^Choose 2022 Toyota GR86/ }));
    expect(screen.queryByRole('dialog')).toBeNull();
    const opener = screen.getByRole('button', { name: /^Lane B car:/ });
    expect(opener.getAttribute('aria-label')).toMatch(/GR86/);
    expect(document.activeElement).toBe(opener);
  });

  it('wraps Tab and Shift+Tab at the dialog boundaries', () => {
    openDragView(mount);
    const { dialog } = openLaneBPicker();
    const focusables = dialog.querySelectorAll<HTMLElement>('button:not([disabled]), input, select, [tabindex="0"]');
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    last.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(first);
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(last);
  });
});

/** Emulate a touch-first device (phone or tablet): no hover, coarse pointer. */
function mockTouchFirst(on: boolean) {
  const original = window.matchMedia;
  window.matchMedia = ((query: string) => ({
    matches: on && query.includes('pointer: coarse'),
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
  return () => {
    window.matchMedia = original;
  };
}

describe.each(MODES)('car picker on a touch-first device (%s)', (_mode, mount) => {
  let restore: () => void = () => {};
  beforeEach(() => {
    window.location.hash = '';
    restore = mockTouchFirst(true);
  });
  afterEach(() => {
    cleanup();
    restore();
  });

  it('does not focus the search field on open, so the on-screen keyboard stays down', () => {
    openDragView(mount);
    const { dialog, search } = openLaneBPicker();
    expect(document.activeElement).not.toBe(search);
    expect(document.activeElement).toBe(dialog);
    expect(search.autofocus).toBe(false);
  });

  it('still closes on Escape and returns focus to the opener', () => {
    openDragView(mount);
    const { opener } = openLaneBPicker();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(opener);
  });

  it('lets the user focus the search field by tapping it', () => {
    openDragView(mount);
    const { dialog, search } = openLaneBPicker();
    search.focus();
    fireEvent.change(search, { target: { value: 'lexus' } });
    expect(document.activeElement).toBe(search);
    expect(dialog.contains(document.activeElement)).toBe(true);
  });
});

describe('car picker on a desktop pointer device', () => {
  afterEach(cleanup);
  it('keeps focusing the search field on open', () => {
    const restore = mockTouchFirst(false);
    try {
      openDragView(MODES[0][1]);
      const { search } = openLaneBPicker();
      expect(document.activeElement).toBe(search);
    } finally {
      restore();
    }
  });
});
