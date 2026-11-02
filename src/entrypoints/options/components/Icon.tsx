const PATHS = {
  up: 'M6 15l6-6 6 6',
  down: 'M6 9l6 6 6-6',
  trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
  plus: 'M12 5v14M5 12h14',
  download: 'M12 4v11M7 10l5 5 5-5M5 20h14',
  upload: 'M12 15V4M7 9l5-5 5 5M5 20h14',
  reset: 'M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4',
  external: 'M14 4h6v6M20 4l-9 9M18 14v6H4V6h6',
} as const;

export type IconName = keyof typeof PATHS;

/** Decorative stroke icon; the surrounding control carries the accessible name. */
export function Icon({ name }: { name: IconName }) {
  return (
    <svg
      className="ico"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false">
      <path d={PATHS[name]} />
    </svg>
  );
}
