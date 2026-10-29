import { t } from './i18n';
import { formatValue, type Score } from './rating';

/** Spoken value of a score in the display language: "3,5 étoiles sur 5" rather than "3.5". */
export function scoreText(value: Score): string {
  if (value === null) return t.notApplicable;
  return t.scoreText(formatValue(value), value);
}
