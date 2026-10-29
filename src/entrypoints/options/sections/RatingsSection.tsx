import { getLocale, t } from '@/lib/i18n';
import { computeAverage, formatValue, type CoasterRating, type Criterion } from '@/lib/rating';
import { IconButton } from '@/entrypoints/options/components/IconButton';

export function RatingsSection({
  criteria,
  allRatings,
  shown,
  search,
  onSearchInput,
  searchRef,
  ratingsBodyRef,
  captureFocusKey,
  deleteRating,
  announce,
}: {
  criteria: Criterion[];
  allRatings: CoasterRating[];
  shown: CoasterRating[];
  search: string;
  onSearchInput: (value: string) => void;
  searchRef: React.RefObject<HTMLInputElement | null>;
  ratingsBodyRef: React.RefObject<HTMLTableSectionElement | null>;
  captureFocusKey: (container: HTMLElement | null) => void;
  deleteRating: (coasterId: number) => Promise<void>;
  announce: (text: string) => void;
}) {
  return (
    <section aria-labelledby="ratings-title">
      <div className="section-head">
        <h2 id="ratings-title">
          {t.optRatingsTitle} {allRatings.length > 0 && <span className="count">({allRatings.length})</span>}
        </h2>
        <label className="search">
          <span className="sr-only">{t.optSearchLabel}</span>
          <input
            ref={searchRef}
            id="search"
            type="search"
            placeholder={t.optSearchPlaceholder}
            value={search}
            onChange={(e) => onSearchInput(e.target.value)}
          />
        </label>
      </div>
      <div className="table-wrap" hidden={shown.length === 0}>
        <table className="ratings" aria-labelledby="ratings-title">
          <thead>
            <tr>
              <th scope="col">{t.optColCoaster}</th>
              <th scope="col" className="num">
                {t.optColAverage}
              </th>
              <th scope="col" className="num">
                {t.optColOnCaptain}
              </th>
              <th scope="col">{t.optColModified}</th>
              <th scope="col">
                <span className="sr-only">{t.optColActions}</span>
              </th>
            </tr>
          </thead>
          <tbody ref={ratingsBodyRef} id="ratings" onFocusCapture={() => captureFocusKey(ratingsBodyRef.current)}>
            {shown.map((rating) => {
              const { value } = computeAverage(criteria, rating.scores);
              return (
                <tr key={rating.coasterId}>
                  <td>
                    <a
                      href={rating.url}
                      target="_blank"
                      rel="noopener"
                      data-focus-key={`${rating.coasterId}:link`}>
                      {rating.name}
                      <span className="sr-only">{t.newTab}</span>
                    </a>
                    <span className="park">{rating.park}</span>
                  </td>
                  <td className="num strong">
                    {value === null ? (
                      <>
                        <span aria-hidden="true">–</span>
                        <span className="sr-only">{t.noAverage}</span>
                      </>
                    ) : (
                      formatValue(value)
                    )}
                  </td>
                  <td className="num">
                    {rating.sentValue === null ? (
                      t.notSent
                    ) : (
                      <>
                        {formatValue(rating.sentValue)}{' '}
                        <span aria-hidden="true">★</span>
                        <span className="sr-only">{t.starWord(rating.sentValue)}</span>
                      </>
                    )}
                    {value !== null && rating.sentValue !== value && (
                      <span className="badge" title={t.toResendTitle}>
                        {t.toResend}
                      </span>
                    )}
                  </td>
                  <td>
                    {new Date(rating.updatedAt).toLocaleDateString(getLocale(), {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td>
                    <IconButton
                      text="✕"
                      label={t.deleteRating(rating.name)}
                      focusKey={`${rating.coasterId}:delete`}
                      onClick={() => {
                        if (confirm(t.confirmDeleteRating(rating.name))) {
                          void deleteRating(rating.coasterId).then(() =>
                            announce(t.ratingDeleted(rating.name)),
                          );
                        }
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {allRatings.length > 0 && shown.length === 0 && (
        <p className="empty">{t.noMatch(search.trim())}</p>
      )}
      {allRatings.length === 0 && (
        <p className="empty">{t.optRatingsEmpty}</p>
      )}
    </section>
  );
}
