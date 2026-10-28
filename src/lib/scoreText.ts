import { formatValue, type Score } from './rating';

/** Spoken value of a score, in French: "3,5 étoiles sur 5" rather than "3.5". */
export function scoreText(value: Score): string {
  if (value === null) return 'Ne s’applique pas';
  return `${formatValue(value)} étoile${value > 1 ? 's' : ''} sur 5`;
}
