import { useId, type ReactNode } from 'react';
import type { VehicleSpec } from '../data/types';
import { seriesColor } from '../lib/colors';
import { Icon, type IconName } from './Icon';

export function Panel({
  title,
  subtitle,
  actions,
  children,
  className = '',
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`panel ${className}`}>
      {(title || actions) && (
        <header className="panel__head">
          <div>
            {title && <h2 className="panel__title">{title}</h2>}
            {subtitle && <p className="panel__subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="panel__actions">{actions}</div>}
        </header>
      )}
      {children}
    </section>
  );
}

export function Button({
  children,
  icon,
  variant = 'secondary',
  onClick,
  disabled,
  type = 'button',
  className = '',
  ariaLabel,
  ariaPressed,
}: {
  children?: ReactNode;
  icon?: IconName;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  className?: string;
  ariaLabel?: string;
  ariaPressed?: boolean;
}) {
  return (
    <button
      type={type}
      className={`btn btn--${variant} ${children ? '' : 'btn--icon'} ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
    >
      {icon && <Icon name={icon} size={20} />}
      {children && <span>{children}</span>}
    </button>
  );
}

export interface SegmentOption<T extends string> {
  value: T;
  label: ReactNode;
  disabled?: boolean;
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  size = 'md',
  block = false,
}: {
  options: readonly SegmentOption<T>[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel: string;
  size?: 'md' | 'lg';
  /** Stretch to the container width with equal-width segments. */
  block?: boolean;
}) {
  return (
    <div className={`segmented segmented--${size} ${block ? 'segmented--block' : ''}`} role="radiogroup" aria-label={ariaLabel}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={o.value === value}
          className={`segmented__item ${o.value === value ? 'is-active' : ''}`}
          disabled={o.disabled}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: ReactNode;
  description?: ReactNode;
}) {
  return (
    <label className="toggle">
      <span className="toggle__text">
        <span className="toggle__label">{label}</span>
        {description && <span className="toggle__desc">{description}</span>}
      </span>
      <input
        type="checkbox"
        role="switch"
        className="toggle__input"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="toggle__track" aria-hidden="true">
        <span className="toggle__thumb" />
      </span>
    </label>
  );
}

export function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
  hint,
  onReset,
  modified,
}: {
  label: ReactNode;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
  hint?: ReactNode;
  onReset?: () => void;
  modified?: boolean;
}) {
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="slider">
      <div className="slider__head">
        <label htmlFor={id} className="slider__label">
          {label}
        </label>
        <span className="slider__value">
          {format(value)}
          {onReset && modified && (
            <button type="button" className="slider__reset" onClick={onReset} aria-label="Reset to default">
              <Icon name="reset" size={16} />
            </button>
          )}
        </span>
      </div>
      <input
        id={id}
        type="range"
        className="slider__input"
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ '--pct': `${pct}%` } as React.CSSProperties}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {hint && <div className="slider__hint">{hint}</div>}
    </div>
  );
}

export function StatTile({
  label,
  value,
  unit,
  sub,
  emphasis = false,
}: {
  label: ReactNode;
  value: ReactNode;
  unit?: ReactNode;
  sub?: ReactNode;
  emphasis?: boolean;
}) {
  return (
    <div className={`stat ${emphasis ? 'stat--emphasis' : ''}`}>
      <div className="stat__label">{label}</div>
      <div className="stat__value">
        {value}
        {unit && <span className="stat__unit">{unit}</span>}
      </div>
      {sub && <div className="stat__sub">{sub}</div>}
    </div>
  );
}

export function Swatch({ color, dashed = false, dashArray }: { color: string; dashed?: boolean; dashArray?: string }) {
  const dash = dashArray ? dashArray.replace(/\d+/g, (n) => String(Math.max(2, Math.round(Number(n) / 2)))) : dashed ? '3 4' : undefined;
  return (
    <svg className="swatch" width="22" height="10" viewBox="0 0 22 10" aria-hidden="true">
      <line x1="1" y1="5" x2="21" y2="5" stroke={color} strokeWidth="3" strokeLinecap="butt" strokeDasharray={dash} />
    </svg>
  );
}

export function VehicleDot({ slot }: { slot: number }) {
  return <span className="vehicle-dot" style={{ background: seriesColor(slot) }} aria-hidden="true" />;
}

export function VehiclePicker({
  vehicles,
  value,
  onChange,
  ariaLabel = 'Vehicle',
}: {
  vehicles: readonly VehicleSpec[];
  value: string;
  onChange: (id: string) => void;
  ariaLabel?: string;
}) {
  return (
    <div className="vehicle-picker" role="radiogroup" aria-label={ariaLabel}>
      {vehicles.map((v) => (
        <button
          key={v.id}
          type="button"
          role="radio"
          aria-checked={v.id === value}
          className={`vehicle-picker__item ${v.id === value ? 'is-active' : ''}`}
          style={{ '--vehicle-color': seriesColor(v.colorSlot) } as React.CSSProperties}
          onClick={() => onChange(v.id)}
        >
          <VehicleDot slot={v.colorSlot} />
          <span className="vehicle-picker__text">
            <span className="vehicle-picker__name">{v.shortName}</span>
            <span className="vehicle-picker__meta">
              {v.drivetrain.layout} · {v.transmission.gearRatios.length}-spd {v.transmission.type === 'dual-clutch' ? 'DSG' : 'AT'}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}

export type BadgeTone = 'verified' | 'reported' | 'estimated' | 'neutral' | 'good' | 'warning' | 'critical';

export function Badge({ tone, children }: { tone: BadgeTone; children: ReactNode }) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}

export function EmptyState({ icon, title, children }: { icon: IconName; title: string; children?: ReactNode }) {
  return (
    <div className="empty">
      <Icon name={icon} size={36} />
      <h3>{title}</h3>
      {children && <p>{children}</p>}
    </div>
  );
}
