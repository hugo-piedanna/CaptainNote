import { useStorageValue } from '@/hooks/useStorageValue';
import { defaultCriteria, moveCriterion, newCriterionId, normalizeCriterion, type Criterion } from '@/lib/rating';
import { criteriaItem } from '@/lib/store';

/** Criteria of the settings page (FR-criteria-customization). Unsaved criteria show the defaults in the display language. */
export function useCriteria() {
  const [stored, setStored] = useStorageValue(criteriaItem);
  const loaded = stored !== undefined;
  const criteria = loaded ? (stored?.map(normalizeCriterion) ?? defaultCriteria()) : [];

  const save = async (next: Criterion[]) => {
    setStored(next);
    await criteriaItem.setValue(next);
  };

  const update = (id: string, patch: Partial<Omit<Criterion, 'id'>>) =>
    save(criteria.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  return {
    loaded,
    criteria,
    update,
    /** Adds an enabled criterion with Normal weight at the end; returns its position (1-based). */
    add: async (name: string) => {
      await save([...criteria, { id: newCriterionId(name, criteria), name, weight: 1, enabled: true }]);
      return criteria.length + 1;
    },
    move: (index: number, delta: number) => save(moveCriterion(criteria, index, delta)),
    remove: (id: string) => save(criteria.filter((c) => c.id !== id)),
    reset: () => save(defaultCriteria()),
  };
}

export type CriteriaModel = ReturnType<typeof useCriteria>;
