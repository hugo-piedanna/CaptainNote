import { t } from '@/lib/i18n';
import { summarize } from '@/lib/ratingsOverview';
import { SectionNav } from '@/entrypoints/options/components/SectionNav';
import { SummaryStats } from '@/entrypoints/options/components/SummaryStats';
import { useCriteria } from '@/entrypoints/options/hooks/useCriteria';
import { useRatings } from '@/entrypoints/options/hooks/useRatings';
import { BackupSection } from '@/entrypoints/options/sections/BackupSection';
import { CriteriaSection } from '@/entrypoints/options/sections/CriteriaSection';
import { RatingsSection } from '@/entrypoints/options/sections/RatingsSection';
import { OptionsServices } from '@/entrypoints/options/services';

const AUTHOR_URL = 'https://piedanna.dev';
const SOURCE_URL = 'https://github.com/hugo-piedanna/CaptainNote';

export function App() {
  const criteria = useCriteria();
  const ratings = useRatings(criteria.criteria);
  const summary = summarize(criteria.criteria, ratings.rows);

  return (
    <OptionsServices>
      <header className="hero">
        <div className="wrap">
          <p className="eyebrow">{t.optEyebrow}</p>
          <h1>
            <span
              className="hero__mark"
              aria-hidden="true">
              ★
            </span>
            Captain Note
          </h1>
          <p className="hero__lede">{t.optLede}</p>
          <SummaryStats summary={summary} />
        </div>
      </header>

      <SectionNav ratingsCount={ratings.rows.length} />

      <main className="wrap main">
        <CriteriaSection model={criteria} />
        <RatingsSection model={ratings} />
        <BackupSection ratingsCount={ratings.rows.length} />
      </main>

      <footer className="wrap foot">
        <p>{t.optFooter}</p>
        {/* Plain links only: nothing is loaded from these sites (FR-options-author-footer). */}
        <p>
          {t.optFooterMadeBy}{' '}
          <a
            href={AUTHOR_URL}
            target="_blank"
            rel="noopener noreferrer">
            Hugo Piedanna
          </a>
          {' · '}
          <a
            href={SOURCE_URL}
            target="_blank"
            rel="noopener noreferrer">
            {t.optFooterSource}
          </a>
        </p>
      </footer>
    </OptionsServices>
  );
}
