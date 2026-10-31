/** Pure rating logic, no browser APIs: easy to test. */
import { getLocale, messagesFor, type Locale } from './i18n';

export interface Criterion {
  id: string;
  name: string;
  /** 0 = ignored, 1 = normal, 2 = important, 3 = essential. */
  weight: number;
  enabled: boolean;
}

/** A score is 0.5 to 5 by half steps, or null when the criterion does not apply. */
export type Score = number | null;

export interface CoasterRating {
  coasterId: number;
  name: string;
  park: string;
  url: string;
  scores: Record<string, Score>;
  /** Last value sent to Captain Coaster, null if never sent. */
  sentValue: number | null;
  updatedAt: string;
  sentAt: string | null;
}

export const MIN_VALUE = 0.5;
export const MAX_VALUE = 5;
/** Default criteria, in order. Ids stay stable across languages: scores are keyed by id. */
const DEFAULT_IDS = ['layout', 'confort', 'rejouabilite', 'theming', 'longueur', 'attente', 'gestion'] as const;

/** Default criteria named in `locale` (FR-ui-locale-multi), sorted by relevance, all enabled. */
export function defaultCriteria(locale: Locale = getLocale()): Criterion[] {
  const names = messagesFor(locale).criteria;
  return DEFAULT_IDS.map((id) => ({ id, name: names[id], weight: 1, enabled: true }));
}

/** Snaps any number to a valid Captain Coaster value (0.5 to 5, half steps). */
export function toCaptainValue(raw: number): number {
  const snapped = Math.floor(raw * 2) / 2;
  return Math.min(MAX_VALUE, Math.max(MIN_VALUE, snapped));
}

export function isValidScore(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    value >= MIN_VALUE &&
    value <= MAX_VALUE &&
    Number.isInteger(value * 2)
  );
}

export interface AverageResult {
  /** Weighted average before rounding, null when nothing is scored. */
  raw: number | null;
  /** Value to send to Captain Coaster, null when nothing is scored. */
  value: number | null;
  /** How many active criteria have a score. */
  counted: number;
  /** How many criteria are active (enabled with a weight above 0). */
  active: number;
}

/**
 * Weighted average over the criteria that are enabled, weighted above 0 and scored.
 * Scores of deleted or disabled criteria are kept in storage but ignored here.
 */
export function computeAverage(criteria: Criterion[], scores: Record<string, Score>): AverageResult {
  const active = criteria.filter((c) => c.enabled && c.weight > 0);
  let sum = 0;
  let weights = 0;
  let counted = 0;

  for (const criterion of active) {
    const score = scores[criterion.id];
    if (!isValidScore(score)) continue;
    sum += score * criterion.weight;
    weights += criterion.weight;
    counted++;
  }

  if (weights === 0) return { raw: null, value: null, counted, active: active.length };
  const raw = sum / weights;
  return { raw, value: toCaptainValue(raw), counted, active: active.length };
}

export function formatValue(value: number | null, digits = 1): string {
  if (value === null) return '–';
  return value.toLocaleString(getLocale(), { minimumFractionDigits: 0, maximumFractionDigits: digits });
}

export function newCriterionId(name: string, existing: Criterion[]): string {
  const base =
    name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'critere';
  let id = base;
  let n = 2;
  while (existing.some((c) => c.id === id)) id = `${base}-${n++}`;
  return id;
}
