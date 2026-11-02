import { useEffect, useRef, useState } from 'react';
import { useFocusRestore } from '@/hooks/useFocusRestore';
import { t } from '@/lib/i18n';
import { filterRows, paginate, RATING_SORTS, sortRows, type RatingSort } from '@/lib/ratingsOverview';
import { Icon } from '@/entrypoints/options/components/Icon';
import { IconButton } from '@/entrypoints/options/components/IconButton';
import { Section } from '@/entrypoints/options/components/Section';
import type { RatingsModel } from '@/entrypoints/options/hooks/useRatings';
import { useAnnounce, useConfirm } from '@/entrypoints/options/services';
import { RatingRow } from './RatingRow';

export function RatingsSection({ model }: { model: RatingsModel }) {
  const announce = useAnnounce();
  const confirm = useConfirm();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<RatingSort>('recent');
  const [page, setPage] = useState(1);
  const searchRef = useRef<HTMLInputElement>(null);
  const body = useFocusRestore<HTMLTableSectionElement>(searchRef, [model.rows, search, sort, page]);

  const shown = sortRows(filterRows(model.rows, search), sort);
  // Clamped, so deleting the last row of the last page shows the previous one.
  const current = paginate(shown, page);
  const total = model.rows.length;

  // Announces the result count once typing pauses.
  useEffect(() => {
    if (!search.trim()) return;
    const timer = setTimeout(() => announce(shown.length ? t.shownCount(shown.length) : t.noMatchShort), 600);
    return () => clearTimeout(timer);
  }, [search]);

  const remove = async (coasterId: number, name: string) => {
    const ok = await confirm({
      title: t.optConfirmDeleteRatingTitle(name),
      message: t.optConfirmDeleteRatingBody,
      confirmLabel: t.optDelete,
    });
    if (!ok) return;
    await model.remove(coasterId);
    announce(t.ratingDeleted(name));
  };

  const sortLabels: Record<RatingSort, string> = {
    recent: t.optSortRecent,
    name: t.optSortName,
    average: t.optSortAverage,
  };

  return (
    <Section
      id="ratings"
      title={t.optRatingsTitle}
      count={total}
      intro={<p>{t.optRatingsIntro}</p>}>
      {total > 0 && (
        <div className="toolbar">
          <label className="search">
            <Icon name="search" />
            <span className="sr-only">{t.optSearchLabel}</span>
            <input
              ref={searchRef}
              type="search"
              className="field"
              placeholder={t.optSearchPlaceholder}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </label>
          <label className="sort">
            <span>{t.optSortLabel}</span>
            <select
              className="field"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as RatingSort);
                setPage(1);
              }}>
              {RATING_SORTS.map((key) => (
                <option
                  key={key}
                  value={key}>
                  {sortLabels[key]}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
      <div
        className="table-wrap"
        hidden={shown.length === 0}>
        <table
          className="ratings"
          aria-labelledby="ratings-title">
          <thead>
            <tr>
              <th scope="col">{t.optColCoaster}</th>
              <th
                scope="col"
                className="num">
                {t.optColAverage}
              </th>
              <th scope="col">{t.optColOnCaptain}</th>
              <th scope="col">{t.optColModified}</th>
              <th scope="col">
                <span className="sr-only">{t.optColActions}</span>
              </th>
            </tr>
          </thead>
          <tbody
            ref={body.containerRef}
            onFocusCapture={body.onFocusCapture}>
            {current.rows.map((row) => (
              <RatingRow
                key={row.rating.coasterId}
                row={row}
                onDelete={() => void remove(row.rating.coasterId, row.rating.name)}
              />
            ))}
          </tbody>
        </table>
      </div>
      {current.pageCount > 1 && (
        <nav
          className="pager"
          aria-label={t.optPagerLabel}>
          <span className="pager__range">{t.optPageRange(current.from, current.to, shown.length)}</span>
          <div className="pager__controls">
            <IconButton
              icon="left"
              label={t.optPagePrev}
              focusKey="pager:prev"
              disabled={current.page === 1}
              onClick={() => setPage(current.page - 1)}
            />
            <span
              className="pager__status"
              aria-live="polite">
              {t.optPageOf(current.page, current.pageCount)}
            </span>
            <IconButton
              icon="right"
              label={t.optPageNext}
              focusKey="pager:next"
              disabled={current.page === current.pageCount}
              onClick={() => setPage(current.page + 1)}
            />
          </div>
        </nav>
      )}
      {total > 0 && shown.length === 0 && <p className="empty">{t.noMatch(search.trim())}</p>}
      {model.loaded && total === 0 && (
        <div className="empty empty--box">
          <p className="empty__title">{t.optRatingsEmptyTitle}</p>
          <p>{t.optRatingsEmpty}</p>
        </div>
      )}
    </Section>
  );
}
