import { useMemo } from 'react';
import { useStorageValue } from '@/hooks/useStorageValue';
import type { Criterion } from '@/lib/rating';
import { toRows } from '@/lib/ratingsOverview';
import { deleteRating, ratingsItem } from '@/lib/store';

/** Detailed ratings with their current average and status (FR-options-summary). */
export function useRatings(criteria: Criterion[]) {
  const [stored] = useStorageValue(ratingsItem);
  const rows = useMemo(() => toRows(criteria, stored ?? {}), [criteria, stored]);
  return { loaded: stored !== undefined, rows, remove: deleteRating };
}

export type RatingsModel = ReturnType<typeof useRatings>;
