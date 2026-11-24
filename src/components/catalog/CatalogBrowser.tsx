import { useId, useMemo, useState, type ReactNode } from 'react';
import {
  EMPTY_FILTERS,
  FACETS,
  SORT_LABEL,
  activeFilterCount,
  applyFilters,
  fullName,
  matchesQuery,
  readinessOf,
  sortEntries,
  sortNote,
  stockClass,
  type CatalogFilters,
  type SortKey,
} from '../../data/catalog';
import { MARKET_LABEL, READINESS_LABEL, type CatalogEntry, type Market } from '../../data/catalog/types';
import { useApp } from '../../state/AppState';
import { Icon } from '../Icon';
import { Badge } from '../ui';

export interface CatalogBrowserProps {
  /** Called with the chosen car id. */
  onSelect: (id: string) => void;
  /** In simulation contexts, catalog-only cars are listed but cannot be chosen. */
  requirePlayable?: boolean;
  selectedId?: string;
  defaultSort?: SortKey;
  /** Autofocus the search box (dialogs). */
  autoFocus?: boolean;
  /** Text for the action on each row (screen readers). */
  actionLabel?: string;
}

type FacetKey = Exclude<keyof CatalogFilters, 'favoritesOnly' | 'playableOnly'>;

const FACET_LABEL: Record<FacetKey, string> = {
  brands: 'Brand',
  origins: 'Manufacturer origin',
  markets: 'Spec market',
  classes: 'Stock class',
  bodies: 'Body style',
  usage: 'Use',
  eras: 'Era',
  drives: 'Drivetrain',
  transmissions: 'Transmission',
  powertrains: 'Powertrain',
  readiness: 'Readiness',
};

/** Most-used facets shown first. */
const FACET_ORDER: FacetKey[] = ['classes', 'usage', 'drives', 'transmissions', 'bodies', 'brands', 'origins', 'markets', 'eras', 'powertrains', 'readiness'];

function facetLabel(key: FacetKey, value: string): string {
  if (key === 'markets') return `${value} · ${MARKET_LABEL[value as Market] ?? value}`;
  if (key === 'readiness') return READINESS_LABEL[value as keyof typeof READINESS_LABEL] ?? value;
  return value;
}

/** Search, filter and sort the whole catalog. Used inline (Garage) and inside the picker dialog. */
export function CatalogBrowser({
  onSelect,
  requirePlayable = false,
  selectedId,
  defaultSort = 'name',
  autoFocus = false,
  actionLabel = 'Open',
}: CatalogBrowserProps) {
  const app = useApp();
  const favorites = app.settings.favorites;
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<CatalogFilters>({ ...EMPTY_FILTERS, playableOnly: requirePlayable });
  const [sort, setSort] = useState<SortKey>(defaultSort);
  const [showFilters, setShowFilters] = useState(false);
  const searchId = useId();
  const sortId = useId();

  const results = useMemo(() => {
    const filtered = applyFilters(app.catalog, filters, favorites).filter((e) => matchesQuery(e, query));
    return sortEntries(filtered, sort, favorites);
  }, [app.catalog, filters, favorites, query, sort]);

  const toggle = (key: FacetKey, value: string) =>
    setFilters((f) => {
      const list = f[key];
      return { ...f, [key]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value] };
    });
  const nActive = activeFilterCount(filters) - (requirePlayable && filters.playableOnly ? 1 : 0);
  const reset = () => {
    setQuery('');
    setFilters({ ...EMPTY_FILTERS, playableOnly: requirePlayable });
    setSort(defaultSort);
  };

  return (
    <div className="browser">
      <div className="browser__search">
        <Icon name="search" size={20} />
        <label htmlFor={searchId} className="visually-hidden">
          Search cars
        </label>
        <input
          id={searchId}
          type="search"
          className="browser__input"
          placeholder="Search make, model, year, trim, chassis code…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus={autoFocus}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
      </div>

      <div className="browser__quick">
        <ChipToggle on={filters.playableOnly} onClick={() => setFilters((f) => ({ ...f, playableOnly: !f.playableOnly }))}>
          Runnable only
        </ChipToggle>
        <ChipToggle on={filters.favoritesOnly} onClick={() => setFilters((f) => ({ ...f, favoritesOnly: !f.favoritesOnly }))}>
          ★ My garage
        </ChipToggle>
        {FACETS.classes.map((c) => (
          <ChipToggle key={c} on={filters.classes.includes(c)} onClick={() => toggle('classes', c)} ariaLabel={`Class ${c}`}>
            {c === 'Pending' ? 'Class pending' : c}
          </ChipToggle>
        ))}
      </div>

      <div className="browser__bar">
        <button type="button" className={`chip ${showFilters ? 'is-active' : ''}`} aria-expanded={showFilters} onClick={() => setShowFilters((s) => !s)}>
          <Icon name="tuning" size={16} /> Filters{nActive > 0 ? ` (${nActive})` : ''}
        </button>
        <label htmlFor={sortId} className="visually-hidden">
          Sort
        </label>
        <select id={sortId} className="select" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
          {(Object.keys(SORT_LABEL) as SortKey[]).map((k) => (
            <option key={k} value={k}>
              {SORT_LABEL[k]}
            </option>
          ))}
        </select>
        <span className="browser__count" aria-live="polite">
          {results.length} of {app.catalog.length}
        </span>
        {(nActive > 0 || query || sort !== defaultSort) && (
          <button type="button" className="chip" onClick={reset}>
            <Icon name="reset" size={16} /> Reset
          </button>
        )}
      </div>

      {showFilters && (
        <div className="browser__filters">
          {FACET_ORDER.filter((k) => k !== 'classes').map((key) => (
            <fieldset key={key} className="facet">
              <legend className="facet__title">{FACET_LABEL[key]}</legend>
              <div className="facet__chips">
                {(FACETS[key] as readonly string[]).map((v) => (
                  <ChipToggle key={v} on={filters[key].includes(v)} onClick={() => toggle(key, v)}>
                    {facetLabel(key, v)}
                  </ChipToggle>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
      )}

      {results.length === 0 ? (
        <p className="browser__empty">No cars match. Try fewer filters or a shorter search.</p>
      ) : (
        <ul className="car-list">
          {results.map((e) => (
            <CarRow
              key={e.id}
              entry={e}
              selected={e.id === selectedId}
              disabled={requirePlayable && !e.sim}
              favorite={favorites.includes(e.id)}
              onToggleFavorite={() => app.toggleFavorite(e.id)}
              onSelect={() => onSelect(e.id)}
              actionLabel={actionLabel}
              note={sortNote(e, sort)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function ChipToggle({ on, onClick, children, ariaLabel }: { on: boolean; onClick: () => void; children: ReactNode; ariaLabel?: string }) {
  return (
    <button type="button" className={`chip ${on ? 'is-active' : ''}`} aria-pressed={on} aria-label={ariaLabel} onClick={onClick}>
      {children}
    </button>
  );
}

export function ClassBadge({ id }: { id: string }) {
  const c = stockClass(id);
  return (
    <span className={`class-badge ${c ? `class-badge--${c === 'S+' ? 'splus' : c.toLowerCase()}` : 'class-badge--pending'}`} title={c ? `Stock straight-line class ${c}` : 'Class pending (not simulated)'}>
      {c ?? '—'}
    </span>
  );
}

export function ReadinessBadge({ entry }: { entry: CatalogEntry }) {
  const r = readinessOf(entry);
  const caveats = entry.sim ? (entry.simCaveats ?? []) : [];
  return (
    <>
      <Badge tone={r === 'catalog' ? 'neutral' : r === 'sim' ? 'reported' : 'verified'}>{READINESS_LABEL[r]}</Badge>
      {caveats.length > 0 && (
        <span className="badge-wrap" title={caveats.join(' ')}>
          <Badge tone="warning">Provisional model</Badge>
        </span>
      )}
    </>
  );
}

export function Monogram({ entry }: { entry: CatalogEntry }) {
  const letters = entry.make
    .replace(/-.*/, '')
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <span className="monogram" aria-hidden="true">
      {letters}
    </span>
  );
}

function CarRow({
  entry: e,
  selected,
  disabled,
  favorite,
  onToggleFavorite,
  onSelect,
  actionLabel,
  note,
}: {
  entry: CatalogEntry;
  selected: boolean;
  disabled: boolean;
  favorite: boolean;
  onToggleFavorite: () => void;
  onSelect: () => void;
  actionLabel: string;
  /** Value the list is currently sorted by, with its provenance. */
  note: string | null;
}) {
  return (
    <li className={`car-row ${selected ? 'is-selected' : ''} ${disabled ? 'is-disabled' : ''}`}>
      <button
        type="button"
        className="car-row__main"
        onClick={onSelect}
        disabled={disabled}
        aria-current={selected ? 'true' : undefined}
        aria-label={`${actionLabel} ${fullName(e)}${disabled ? ' (not runnable yet)' : ''}`}
      >
        <Monogram entry={e} />
        <span className="car-row__text">
          <span className="car-row__title">
            {e.modelYear} {e.make} {e.model}
          </span>
          <span className="car-row__meta">
            {e.trim} · {e.market} · {e.transmissionLabel} · {e.drive}
          </span>
          {note && <span className="car-row__sortnote">{note}</span>}
          {disabled && e.unsupportedReason && <span className="car-row__reason">{e.unsupportedReason}</span>}
        </span>
        <span className="car-row__badges">
          <ClassBadge id={e.id} />
          <ReadinessBadge entry={e} />
        </span>
      </button>
      {e.owner ? (
        <span className="car-row__owner" title="Your car">
          Mine
        </span>
      ) : (
        <button
          type="button"
          className={`star ${favorite ? 'is-on' : ''}`}
          aria-pressed={favorite}
          aria-label={`${favorite ? 'Remove' : 'Add'} ${fullName(e)} ${favorite ? 'from' : 'to'} My garage`}
          onClick={onToggleFavorite}
        >
          {favorite ? '★' : '☆'}
        </button>
      )}
    </li>
  );
}
