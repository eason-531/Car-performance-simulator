import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { findEntry, fullName } from '../../data/catalog';
import { seriesColor } from '../../lib/colors';
import { useApp } from '../../state/AppState';
import { Icon } from '../Icon';
import { CatalogBrowser, ClassBadge } from './CatalogBrowser';

/** Modal car picker: keyboard accessible (Escape closes, focus returns to the opener). */
export function CarPickerDialog({
  title,
  selectedId,
  onSelect,
  onClose,
  requirePlayable = true,
}: {
  title: string;
  selectedId?: string;
  onSelect: (id: string) => void;
  onClose: () => void;
  requirePlayable?: boolean;
}) {
  const titleId = useId();
  const panel = useRef<HTMLDivElement>(null);
  // Capture the opener during the first render: by the time effects run, the
  // search field has already taken focus via autoFocus.
  const [opener] = useState(() => (typeof document === 'undefined' ? null : (document.activeElement as HTMLElement | null)));
  // Callers pass a fresh onClose each render; read it through a ref so the
  // keyboard handler (and the focus restore in its cleanup) is set up once.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });
  useEffect(() => {
    // Own the focus while open. On first mount the search field's autoFocus has
    // already done this; under StrictMode's development effect replay the
    // cleanup below has just handed focus back to the opener, so take it back.
    if (panel.current && !panel.current.contains(document.activeElement)) {
      (panel.current.querySelector<HTMLElement>('input') ?? panel.current.querySelector<HTMLElement>('button:not([disabled])'))?.focus();
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current();
      } else if (e.key === 'Tab' && panel.current) {
        // Keep focus inside the dialog.
        const f = panel.current.querySelectorAll<HTMLElement>('button:not([disabled]), input, select, [tabindex="0"]');
        if (f.length === 0) return;
        const first = f[0];
        const last = f[f.length - 1];
        const inside = panel.current.contains(document.activeElement);
        if (e.shiftKey && (document.activeElement === first || !inside)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (document.activeElement === last || !inside)) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      // Escape, the close button, the backdrop and a selection all unmount the
      // dialog, so focus goes back to whatever opened it. (A StrictMode replay
      // also lands here; the setup above immediately reclaims focus.)
      if (opener && opener.isConnected) opener.focus();
    };
  }, [opener]);

  // Dismiss on a completed tap/click that both started and ended on the
  // backdrop. Closing on pointerdown let the browser's own mousedown (fired after
  // the dialog was gone) blur to <body> and click through to whatever lay
  // underneath; a drag that starts inside the dialog must not close it either.
  const pressedBackdrop = useRef(false);

  return createPortal(
    <div
      className="dialog-backdrop"
      onPointerDown={(e) => {
        pressedBackdrop.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        if (pressedBackdrop.current && e.target === e.currentTarget) onClose();
        pressedBackdrop.current = false;
      }}
    >
      <div ref={panel} className="dialog" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <header className="dialog__head">
          <h2 id={titleId} className="dialog__title">
            {title}
          </h2>
          <button type="button" className="btn btn--ghost btn--icon" onClick={onClose} aria-label="Close">
            <Icon name="close" size={22} />
          </button>
        </header>
        <div className="dialog__body">
          <CatalogBrowser
            autoFocus
            requirePlayable={requirePlayable}
            selectedId={selectedId}
            defaultSort="favorites"
            actionLabel="Choose"
            onSelect={(id) => {
              onSelect(id);
              onClose();
            }}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}

/**
 * Active-car selector: the owner's cars and favorites as one-tap chips, plus a
 * button that opens the full searchable picker.
 */
export function CarSwitcher({
  value,
  onChange,
  label = 'Vehicle',
  pickerTitle = 'Choose a car',
}: {
  value: string;
  onChange: (id: string) => void;
  label?: string;
  pickerTitle?: string;
}) {
  const app = useApp();
  const [open, setOpen] = useState(false);
  const quick = [...app.ownerIds, ...app.settings.favorites.filter((id) => !app.ownerIds.includes(id) && findEntry(id)?.sim)];
  if (!quick.includes(value)) quick.unshift(value);
  return (
    <div className="car-switcher">
      <div className="car-switcher__chips" role="radiogroup" aria-label={label}>
        {quick.map((id) => {
          const e = findEntry(id);
          if (!e) return null;
          const home = e.sim?.colorSlot;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={id === value}
              className={`car-chip ${id === value ? 'is-active' : ''}`}
              onClick={() => onChange(id)}
              title={fullName(e)}
            >
              {home !== undefined ? <span className="vehicle-dot" style={{ background: seriesColor(home) }} /> : <ClassBadge id={id} />}
              <span className="car-chip__text">
                <span className="car-chip__name">{e.sim?.shortName ?? `${e.make} ${e.model}`}</span>
                <span className="car-chip__meta">
                  {e.modelYear} · {e.drive} · {e.transmissionLabel.replace('-speed', 'sp')}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <button type="button" className="btn btn--secondary car-switcher__browse" onClick={() => setOpen(true)}>
        <Icon name="search" size={20} />
        <span>All cars</span>
      </button>
      {open && <CarPickerDialog title={pickerTitle} selectedId={value} onSelect={onChange} onClose={() => setOpen(false)} />}
    </div>
  );
}
