import { getLocale, t } from '@/lib/i18n';
import { formatValue } from '@/lib/rating';
import type { RatingRow as Row } from '@/lib/ratingsOverview';
import { IconButton } from '@/entrypoints/options/components/IconButton';
import { StatusBadge } from '@/entrypoints/options/components/StatusBadge';

export function RatingRow({ row, onDelete }: { row: Row; onDelete: () => void }) {
  const { rating, value, status } = row;

  return (
    <tr>
      <th
        scope="row"
        className="rating__coaster">
        <a
          href={rating.url}
          target="_blank"
          rel="noopener"
          data-focus-key={`${rating.coasterId}:link`}>
          {rating.name}
          <span className="sr-only">{t.newTab}</span>
        </a>
        {rating.park && <span className="rating__park">{rating.park}</span>}
      </th>
      <td
        className="num rating__avg"
        data-label={t.optColAverage}>
        {value === null ? (
          <>
            <span aria-hidden="true">–</span>
            <span className="sr-only">{t.noAverage}</span>
          </>
        ) : (
          formatValue(value)
        )}
      </td>
      <td
        className="rating__sent"
        data-label={t.optColOnCaptain}>
        <span className="rating__sent-value">
          {rating.sentValue === null ? (
            <span className="muted">–</span>
          ) : (
            <>
              {formatValue(rating.sentValue)}{' '}
              <span
                className="star"
                aria-hidden="true">
                ★
              </span>
              <span className="sr-only">{t.starWord(rating.sentValue)}</span>
            </>
          )}
        </span>
        <StatusBadge status={status} />
      </td>
      <td
        className="rating__date"
        data-label={t.optColModified}>
        <time dateTime={rating.updatedAt}>
          {new Date(rating.updatedAt).toLocaleDateString(getLocale(), {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </time>
      </td>
      <td className="rating__actions">
        <IconButton
          icon="trash"
          danger
          label={t.deleteRating(rating.name)}
          focusKey={`${rating.coasterId}:delete`}
          onClick={onDelete}
        />
      </td>
    </tr>
  );
}
