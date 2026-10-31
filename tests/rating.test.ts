import { describe, expect, it } from 'vitest';
import { computeAverage, defaultCriteria, newCriterionId, toCaptainValue, type Criterion } from '@/lib/rating';

const crit = (id: string, weight = 1, enabled = true): Criterion => ({ id, name: id, weight, enabled });

describe('toCaptainValue', () => {
  it('snaps to half points within 0.5 and 5', () => {
    expect(toCaptainValue(3.73)).toBe(3.5);
    expect(toCaptainValue(3.75)).toBe(3.5);
    expect(toCaptainValue(3.24)).toBe(3);
    expect(toCaptainValue(0.1)).toBe(0.5);
    expect(toCaptainValue(7)).toBe(5);
  });
});

describe('computeAverage', () => {
  it('returns null when nothing is scored', () => {
    expect(computeAverage(defaultCriteria('fr'), {})).toMatchObject({ raw: null, value: null, counted: 0 });
  });

  it('weights criteria', () => {
    const criteria = [crit('a', 1), crit('b', 3)];
    const result = computeAverage(criteria, { a: 1, b: 5 });
    expect(result.raw).toBe(4); // (1 + 15) / 4
    expect(result.value).toBe(4);
  });

  it('ignores N/A, disabled, zero-weight and deleted criteria', () => {
    const criteria = [crit('a'), crit('b', 0), crit('c', 1, false), crit('d')];
    const result = computeAverage(criteria, { a: 4, b: 1, c: 1, d: null, deleted: 1 });
    expect(result).toMatchObject({ raw: 4, value: 4, counted: 1, active: 2 });
  });

  it('rejects invalid stored scores', () => {
    expect(computeAverage([crit('a'), crit('b')], { a: 4, b: 3.3 }).raw).toBe(4);
  });
});

describe('newCriterionId', () => {
  it('slugifies and avoids collisions', () => {
    expect(newCriterionId('Première chute', [])).toBe('premiere-chute');
    expect(newCriterionId('Layout', defaultCriteria('fr'))).toBe('layout-2');
    expect(newCriterionId('!!!', [])).toBe('critere');
  });
});
