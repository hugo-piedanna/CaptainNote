import { t } from '@/lib/i18n';

/** The three weight levels and their multiplier as one radio group (FR-options-layout, FR-criteria-weights). */
export function WeightPicker({
  criterionId,
  criterionName,
  weight,
  onChange,
}: {
  criterionId: string;
  criterionName: string;
  weight: number;
  onChange: (weight: number) => void;
}) {
  return (
    <fieldset className="seg">
      <legend className="sr-only">{t.weightOf(criterionName)}</legend>
      {t.weights.map((label, i) => {
        const w = i + 1;
        return (
          <label
            key={w}
            className="seg__option">
            <input
              type="radio"
              className="seg__input"
              name={`weight-${criterionId}`}
              value={w}
              checked={weight === w}
              data-focus-key={`${criterionId}:weight${w}`}
              onChange={() => onChange(w)}
            />
            <span className="seg__label">
              {label}
              <span className="seg__mult">×{w}</span>
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}
