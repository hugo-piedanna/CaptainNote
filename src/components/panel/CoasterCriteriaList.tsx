import type { CoasterRating, Criterion, Score } from '@/lib/rating';
import { StarInput } from '@/components/stars/StarInput';

export function CoasterCriteriaList({
  active,
  rating,
  onScore,
}: {
  active: Criterion[];
  rating: CoasterRating;
  onScore: (criterionId: string, score: Score) => void;
}) {
  if (active.length === 0) {
    return <li className="cn__empty">Aucun critère actif. Ajoute-en dans les réglages.</li>;
  }

  return (
    <>
      {active.map((criterion) => (
        <li key={criterion.id} className="cn__row">
          <span className="cn__name">
            {criterion.name}
            {criterion.weight > 1 && (
              <>
                <span
                  className="cn__weight"
                  title={`Compte ${criterion.weight} fois dans la moyenne`}
                  aria-hidden="true">
                  ×{criterion.weight}
                </span>
                <span className="cn-sr">, compte {criterion.weight} fois</span>
              </>
            )}
          </span>
          <StarInput
            label={criterion.weight > 1 ? `${criterion.name}, compte ${criterion.weight} fois` : criterion.name}
            value={rating.scores[criterion.id] ?? null}
            onChange={(score) => void onScore(criterion.id, score)}
            starsFocusKey={`${criterion.id}:stars`}
            clearFocusKey={`${criterion.id}:clear`}
            describedBy="cn-help"
          />
        </li>
      ))}
    </>
  );
}
