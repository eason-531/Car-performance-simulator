import { useLayoutEffect, type RefObject } from 'react';

/** Space kept under the driving controls (matches the immersive page padding). */
const BOTTOM_MARGIN_PX = 12;

/**
 * Keeps the Live Drive gauges, shift paddles and pedals on one screen.
 *
 * Measures everything stacked from the top of the page to the bottom of the
 * driving controls (pedals, paddles and cruise panel) except the main gauge,
 * and publishes it as `--drive-stack` on the Drive view. On short landscape
 * screens the stylesheet sizes the gauges to `100svh − --drive-stack`, so a
 * wrapped car bar, an extra boost row or the browser toolbars take their
 * height from the gauges instead of pushing the paddles and pedals off screen.
 * The stack does not depend on the gauge size, so one pass settles it.
 *
 * Positions come from the layout (offsetTop and rects relative to the view),
 * so the view's entry animation does not skew them. Without ResizeObserver
 * (jsdom) the stylesheet's default applies.
 */
export function useDriveFit(root: RefObject<HTMLElement | null>): void {
  useLayoutEffect(() => {
    const el = root.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    let last = '';
    const measure = () => {
      const gauge = el.querySelector<HTMLElement>('.drive__gauge--main .gauge');
      const controls = el.querySelector<HTMLElement>('.drive__controls');
      if (!gauge || !controls) return;
      const view = el.getBoundingClientRect();
      const stack = el.offsetTop + (controls.getBoundingClientRect().bottom - view.top) - gauge.getBoundingClientRect().height + BOTTOM_MARGIN_PX;
      const value = `${Math.ceil(stack)}px`;
      if (value !== last) {
        last = value;
        el.style.setProperty('--drive-stack', value);
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [root]);
}
