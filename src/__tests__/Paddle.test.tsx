// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Paddle } from '../components/Paddle';

afterEach(cleanup);

describe('Paddle', () => {
  it('shifts on pointer-down, so it works while another finger holds the throttle', () => {
    const onShift = vi.fn();
    render(<Paddle direction={1} onShift={onShift} label="Shift up" title="Shift up" />);
    const paddle = screen.getByRole('button', { name: 'Shift up' });
    fireEvent.pointerDown(paddle, { pointerId: 7, pointerType: 'touch', button: 0, isPrimary: false });
    expect(onShift).toHaveBeenCalledTimes(1);
    expect(onShift).toHaveBeenCalledWith(1);
    expect(paddle.className).toContain('is-pressed');
    fireEvent.pointerUp(paddle, { pointerId: 7, pointerType: 'touch' });
    expect(paddle.className).not.toContain('is-pressed');
  });

  it('does not shift twice when the pointer-down is followed by its click', () => {
    const onShift = vi.fn();
    render(<Paddle direction={-1} onShift={onShift} label="Shift down" title="Shift down" />);
    const paddle = screen.getByRole('button', { name: 'Shift down' });
    fireEvent.pointerDown(paddle, { pointerId: 1, pointerType: 'mouse', button: 0 });
    fireEvent.click(paddle, { detail: 1 });
    expect(onShift).toHaveBeenCalledTimes(1);
    expect(onShift).toHaveBeenCalledWith(-1);
  });

  it('still shifts from the keyboard (Enter / Space produce a click with detail 0)', () => {
    const onShift = vi.fn();
    render(<Paddle direction={1} onShift={onShift} label="Shift up" title="Shift up" />);
    fireEvent.click(screen.getByRole('button', { name: 'Shift up' }), { detail: 0 });
    expect(onShift).toHaveBeenCalledTimes(1);
  });

  it('ignores secondary mouse buttons', () => {
    const onShift = vi.fn();
    render(<Paddle direction={1} onShift={onShift} label="Shift up" title="Shift up" />);
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Shift up' }), { pointerType: 'mouse', button: 2 });
    expect(onShift).not.toHaveBeenCalled();
  });
});
