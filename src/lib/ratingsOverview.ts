/** Settings page list and summary (FR-options-summary, FR-options-ratings-sort). Pure logic, no browser APIs. */
import { getLocale, type Locale } from './i18n';
import { computeAverage, type CoasterRating, type Criterion } from './rating';

export type RatingStatus = 'synced' | 'resend' | 'unsent' | 'none';

export function ratingStatus(value: number | null, sentValue: number | null): RatingStatus {
  if (value === null) return 'none';
  if (sentValue === null) return 'unsent';
  return sentValue === value ? 'synced' : 'resend';
}

export interface RatingRow {
  rating: CoasterRating;
  /** Current average to send, null when nothing is scored. */
  value: number | null;
  status: RatingStatus;
}

export function toRows(criteria: Criterion[], ratings: Record<string, CoasterRating>): RatingRow[] {
  return Object.values(ratings).map((rating) => {
    const { value } = computeAverage(criteria, rating.scores);
    return { rating, value, status: ratingStatus(value, rating.sentValue) };
  });
}

export const RATING_SORTS = ['recent', 'name', 'average'] as const;
export type RatingSort = (typeof RATING_SORTS)[number];

export function sortRows(rows: RatingRow[], sort: RatingSort, locale: Locale = getLocale()): RatingRow[] {
  const byRecent = (a: RatingRow, b: RatingRow) => b.rating.updatedAt.localeCompare(a.rating.updatedAt);
  const byName = (a: RatingRow, b: RatingRow) =>
    a.rating.name.localeCompare(b.rating.name, locale, { sensitivity: 'base' });
  const compare: Record<RatingSort, (a: RatingRow, b: RatingRow) => number> = {
    recent: byRecent,
    name: (a, b) => byName(a, b) || byRecent(a, b),
    average: (a, b) => (b.value ?? -1) - (a.value ?? -1) || byName(a, b),
  };
  return [...rows].sort(compare[sort]);
}

/** Case-insensitive match on coaster or park name. */
export function filterRows(rows: RatingRow[], query: string): RatingRow[] {
  const q = query.trim().toLowerCase();
  if (!q) return rows;
  return rows.filter(({ rating }) => `${rating.name} ${rating.park}`.toLowerCase().includes(q));
}

export interface Summary {
  ratings: number;
  synced: number;
  /** To resend or never sent. */
  pending: number;
  activeCriteria: number;
  totalCriteria: number;
}

export function summarize(criteria: Criterion[], rows: RatingRow[]): Summary {
  return {
    ratings: rows.length,
    synced: rows.filter((r) => r.status === 'synced').length,
    pending: rows.filter((r) => r.status === 'resend' || r.status === 'unsent').length,
    activeCriteria: criteria.filter((c) => c.enabled && c.weight > 0).length,
    totalCriteria: criteria.length,
  };
}
