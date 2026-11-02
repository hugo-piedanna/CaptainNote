import { t } from '@/lib/i18n';
import { useActiveSection } from '@/entrypoints/options/hooks/useActiveSection';

export const SECTION_IDS = ['criteria', 'ratings', 'backup'] as const;

/** Sticky navigation to the sections (FR-options-layout). */
export function SectionNav({ ratingsCount }: { ratingsCount: number }) {
  const active = useActiveSection(SECTION_IDS);
  const labels: Record<(typeof SECTION_IDS)[number], string> = {
    criteria: t.optNavCriteria,
    ratings: t.optNavRatings,
    backup: t.optNavBackup,
  };

  return (
    <nav
      className="nav"
      aria-label={t.optNavLabel}>
      <ul className="wrap nav__list">
        {SECTION_IDS.map((id) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className="nav__link"
              aria-current={active === id ? 'location' : undefined}>
              {labels[id]}
              {id === 'ratings' && ratingsCount > 0 && <span className="nav__count">{ratingsCount}</span>}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
