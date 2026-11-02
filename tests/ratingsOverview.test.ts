import { describe, expect, it } from 'vitest';
import { moveCriterion, type CoasterRating, type Criterion } from '@/lib/rating';
import { filterRows, paginate, ratingStatus, sortRows, summarize, toRows } from '@/lib/ratingsOverview';

const criteria: Criterion[] = [
  { id: 'a', name: 'A', weight: 1, enabled: true },
  { id: 'b', name: 'B', weight: 2, enabled: true },
  { id: 'c', name: 'C', weight: 1, enabled: false },
];

function rating(coasterId: number, name: string, park: string, score: number | null, sentValue: number | null, updatedAt: string): CoasterRating {
  return {
    coasterId,
    name,
    park,
    url: `https://captaincoaster.com/en/coasters/${coasterId}`,
    scores: { a: score, b: score },
    sentValue,
    updatedAt,
    sentAt: sentValue === null ? null : updatedAt,
  };
}

const ratings = {
  1: rating(1, 'Zadra', 'Energylandia', 5, 5, '2026-03-01T00:00:00Z'),
  2: rating(2, 'Ébène', 'Parc Astérix', 3, 4, '2026-05-01T00:00:00Z'),
  3: rating(3, 'Taron', 'Phantasialand', 4.5, null, '2026-01-01T00:00:00Z'),
  4: rating(4, 'Blue Fire', 'Europa-Park', null, null, '2026-04-01T00:00:00Z'),
};

describe('ratingStatus (FR-options-summary)', () => {
  it('compares the current average with the last sent value', () => {
    expect(ratingStatus(4, 4)).toBe('synced');
    expect(ratingStatus(4, 3.5)).toBe('resend');
    expect(ratingStatus(4, null)).toBe('unsent');
    expect(ratingStatus(null, null)).toBe('none');
    expect(ratingStatus(null, 3)).toBe('none');
  });
});

describe('toRows and summarize', () => {
  it('computes each status and the summary counts', () => {
    const rows = toRows(criteria, ratings);
    expect(Object.fromEntries(rows.map((r) => [r.rating.coasterId, r.status]))).toEqual({
      1: 'synced',
      2: 'resend',
      3: 'unsent',
      4: 'none',
    });
    expect(summarize(criteria, rows)).toEqual({
      ratings: 4,
      synced: 1,
      pending: 2,
      activeCriteria: 2,
      totalCriteria: 3,
    });
  });

  it('does not count ignored criteria as active', () => {
    expect(summarize([{ ...criteria[0]!, weight: 0 }], []).activeCriteria).toBe(0);
  });
});

describe('sortRows (FR-options-ratings-sort)', () => {
  const rows = toRows(criteria, ratings);
  const names = (sort: Parameters<typeof sortRows>[1]) => sortRows(rows, sort, 'fr').map((r) => r.rating.name);

  it('sorts by most recent first by default order', () => {
    expect(names('recent')).toEqual(['Ébène', 'Blue Fire', 'Zadra', 'Taron']);
  });

  it('sorts names for the display language, ignoring accents', () => {
    expect(names('name')).toEqual(['Blue Fire', 'Ébène', 'Taron', 'Zadra']);
  });

  it('sorts by highest average, ratings without average last', () => {
    expect(names('average')).toEqual(['Zadra', 'Taron', 'Ébène', 'Blue Fire']);
  });

  it('does not mutate its input', () => {
    const before = rows.map((r) => r.rating.coasterId);
    sortRows(rows, 'name', 'fr');
    expect(rows.map((r) => r.rating.coasterId)).toEqual(before);
  });
});

describe('filterRows', () => {
  const rows = toRows(criteria, ratings);

  it('matches coaster or park, case-insensitive', () => {
    expect(filterRows(rows, 'TARON').map((r) => r.rating.coasterId)).toEqual([3]);
    expect(filterRows(rows, 'LAND').map((r) => r.rating.coasterId).sort()).toEqual([1, 3]);
    expect(filterRows(rows, '  ')).toHaveLength(4);
    expect(filterRows(rows, 'nothing')).toHaveLength(0);
  });

  it('ignores accents', () => {
    const withAccent = toRows(criteria, { 9: rating(9, 'Tonnerre de Zeus', 'Parc Astérix', 4, null, '2026-01-01T00:00:00Z') });
    expect(filterRows(withAccent, 'asterix')).toHaveLength(1);
    expect(filterRows(withAccent, 'ASTÉRIX')).toHaveLength(1);
  });
});

describe('paginate', () => {
  const many = toRows(
    criteria,
    Object.fromEntries(
      Array.from({ length: 23 }, (_, i) => [i + 1, rating(i + 1, `C${i + 1}`, 'P', 3, null, '2026-01-01T00:00:00Z')]),
    ),
  );

  it('cuts the list in pages of 10', () => {
    expect(paginate(many, 1)).toMatchObject({ page: 1, pageCount: 3, from: 1, to: 10 });
    expect(paginate(many, 1).rows).toHaveLength(10);
    expect(paginate(many, 3)).toMatchObject({ page: 3, from: 21, to: 23 });
    expect(paginate(many, 3).rows).toHaveLength(3);
  });

  it('clamps out-of-range pages', () => {
    expect(paginate(many, 9).page).toBe(3);
    expect(paginate(many, 0).page).toBe(1);
    expect(paginate([], 2)).toMatchObject({ page: 1, pageCount: 1, from: 0, to: 0, rows: [] });
  });
});

describe('moveCriterion', () => {
  it('moves a criterion up or down', () => {
    expect(moveCriterion(criteria, 0, 1).map((c) => c.id)).toEqual(['b', 'a', 'c']);
    expect(moveCriterion(criteria, 2, -2).map((c) => c.id)).toEqual(['c', 'a', 'b']);
  });

  it('ignores moves out of range', () => {
    expect(moveCriterion(criteria, 0, -1)).toBe(criteria);
    expect(moveCriterion(criteria, 2, 1)).toBe(criteria);
  });
});
