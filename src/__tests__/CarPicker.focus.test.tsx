// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { App } from '../App';
import { AppProvider } from '../state/AppState';
import { createMemoryStore } from '../storage/kv';

function openDragView() {
  render(
    <AppProvider store={createMemoryStore()}>
      <App />
    </AppProvider>,
  );
  const nav = screen.getByRole('navigation', { name: 'Main' });
  fireEvent.click(within(nav).getByRole('button', { name: /^Drag/ }));
}

/** Focus the Lane B car button and open its picker the way a keyboard user would. */
function openLaneBPicker() {
  const opener = screen.getByRole('button', { name: /^Lane B car:/ });
  opener.focus();
  fireEvent.click(opener);
  const dialog = screen.getByRole('dialog');
  return { opener, dialog };
}

describe('car picker focus handling', () => {
  beforeEach(() => {
    window.location.hash = '';
  });
  afterEach(cleanup);

  it('auto-focuses search and returns focus to the opener on Escape', () => {
    openDragView();
    const { opener, dialog } = openLaneBPicker();
    expect(document.activeElement).toBe(within(dialog).getByPlaceholderText(/Search make/));
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(opener);
  });

  it('returns focus to the opener after the close button', () => {
    openDragView();
    const { opener, dialog } = openLaneBPicker();
    fireEvent.click(within(dialog).getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(opener);
  });

  it('returns focus to the opener after choosing a car', () => {
    openDragView();
    const { dialog } = openLaneBPicker();
    fireEvent.change(within(dialog).getByPlaceholderText(/Search make/), { target: { value: 'gr86' } });
    fireEvent.click(within(dialog).getByRole('button', { name: /^Choose 2022 Toyota GR86/ }));
    expect(screen.queryByRole('dialog')).toBeNull();
    const opener = screen.getByRole('button', { name: /^Lane B car:/ });
    expect(opener.getAttribute('aria-label')).toMatch(/GR86/);
    expect(document.activeElement).toBe(opener);
  });

  it('survives re-renders while open (handler registered once, opener kept)', () => {
    openDragView();
    const { opener, dialog } = openLaneBPicker();
    // Typing re-renders the picker and its parent with a fresh onClose.
    fireEvent.change(within(dialog).getByPlaceholderText(/Search make/), { target: { value: 'porsche' } });
    fireEvent.change(within(dialog).getByPlaceholderText(/Search make/), { target: { value: '' } });
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(document.activeElement).toBe(opener);
  });

  it('wraps Tab and Shift+Tab at the dialog boundaries', () => {
    openDragView();
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
