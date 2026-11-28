export type IconName =
  | 'drive'
  | 'tests'
  | 'drag'
  | 'dyno'
  | 'tuning'
  | 'results'
  | 'garage'
  | 'play'
  | 'reset'
  | 'save'
  | 'trash'
  | 'download'
  | 'check'
  | 'plus'
  | 'minus'
  | 'table'
  | 'chart'
  | 'info'
  | 'warning'
  | 'skip'
  | 'sound'
  | 'muted'
  | 'search'
  | 'close'
  | 'external';

const PATHS: Record<IconName, string> = {
  drive: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 7.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM3.5 11h5.5M15 11h5.5M12 13.5V21',
  tests: 'M12 8v5l3 2M9 2h6M12 2v3M5.6 6.6l1.4 1.4M12 22a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z',
  drag: 'M5 21V4M5 4h11l-2 3.5L16 11H5',
  dyno: 'M3 20h18M4 16l4-5 4 3 5-8 3 4',
  tuning: 'M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0M16 4v4M10 10v4M18 16v4',
  results: 'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01',
  garage: 'M3 21V9l9-6 9 6v12M7 21v-6h10v6M7 18h10',
  play: 'M7 4.5v15l12-7.5-12-7.5Z',
  reset: 'M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4',
  save: 'M5 3h11l3 3v15H5V3Zm3 0v5h7V3M8 14h8v7H8v-7Z',
  trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3',
  download: 'M12 4v11m0 0-4-4m4 4 4-4M5 20h14',
  check: 'M5 12.5 10 17l9-10',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  table: 'M4 5h16v14H4V5Zm0 5h16M4 14.5h16M10 5v14',
  chart: 'M4 4v16h16M8 15l3-4 3 2 5-6',
  info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-11v6m0-9.5v.5',
  warning: 'M12 3 2 20h20L12 3Zm0 6v5m0 3v.5',
  skip: 'M5 5v14l9-7-9-7Zm12 0v14',
  sound: 'M3 9h4l5-4v14l-5-4H3zM16 9a4 4 0 0 1 0 6m2-9a8 8 0 0 1 0 12',
  muted: 'M3 9h4l5-4v14l-5-4H3zM16 10l4 4m0-4-4 4',
  search: 'M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Zm5.3-2.2L21 21',
  close: 'M6 6l12 12M18 6 6 18',
  external: 'M14 4h6v6M20 4l-9 9M18 14v5H5V6h5',
};

export function Icon({ name, size = 22, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
