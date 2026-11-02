import { useEffect, useRef, useState } from 'react';
import { useFocusRestore } from '@/hooks/useFocusRestore';
import { t } from '@/lib/i18n';
import { filterRows, RATING_SORTS, sortRows, type RatingSort } from '@/lib/ratingsOverview';
import { Icon } from '@/entrypoints/options/components/Icon';
import { Section } from '@/entrypoints/options/components/Section';
import type { RatingsModel } from '@/entrypoints/options/hooks/useRatings';
import { useAnnounce, useConfirm } from '@/entrypoints/options/services';
import { RatingRow } from './RatingRow';

export function RatingsSection({ model }: { model: RatingsModel }) {
  const announce = useAnnounce();
  const confirm = useConfirm();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<RatingSort>('recent');
  const searchRef = useRef<HTMLInputElement>(null);
  const body = useFocusRestore<HTMLTableSectionElement>(searchRef, [model.rows, search, sort]);

  const shown = sortRows(filterRows(model.rows, search), sort);
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
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <label className="sort">
            <span>{t.optSortLabel}</span>
            <select
              className="field"
              value={sort}
              onChange={(e) => setSort(e.target.value as RatingSort)}>
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
            {shown.map((row) => (
              <RatingRow
                key={row.rating.coasterId}
                row={row}
                onDelete={() => void remove(row.rating.coasterId, row.rating.name)}
              />
            ))}
          </tbody>
        </table>
      </div>
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
