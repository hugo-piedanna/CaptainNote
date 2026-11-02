import { getLocale, t } from '@/lib/i18n';
import type { Summary } from '@/lib/ratingsOverview';

/** Local summary at the top of the page (FR-options-summary). */
export function SummaryStats({ summary }: { summary: Summary }) {
  const number = (n: number) => n.toLocaleString(getLocale());
  const stats = [
    { value: number(summary.ratings), label: t.optStatRatings(summary.ratings) },
    { value: number(summary.synced), label: t.optStatSynced(summary.synced) },
    {
      value: number(summary.pending),
      label: t.optStatPending(summary.pending),
      highlight: summary.pending > 0,
    },
    {
      value: number(summary.activeCriteria),
      label: t.optStatCriteria(summary.activeCriteria, summary.totalCriteria),
    },
  ];

  return (
    <dl className="stats">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={'stat' + (stat.highlight ? ' stat--highlight' : '')}>
          <dt className="stat__label">{stat.label}</dt>
          <dd className="stat__value">{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}
