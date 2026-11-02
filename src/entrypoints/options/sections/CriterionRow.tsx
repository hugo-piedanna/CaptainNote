import { t } from '@/lib/i18n';
import type { Criterion } from '@/lib/rating';
import { IconButton } from '@/entrypoints/options/components/IconButton';
import { WeightPicker } from '@/entrypoints/options/components/WeightPicker';

export function CriterionRow({
  criterion,
  index,
  total,
  onUpdate,
  onMove,
  onDelete,
}: {
  criterion: Criterion;
  index: number;
  total: number;
  onUpdate: (patch: Partial<Omit<Criterion, 'id'>>) => void;
  onMove: (delta: number) => void;
  onDelete: () => void;
}) {
  const counts = criterion.enabled && criterion.weight > 0;

  return (
    <li className={'criterion' + (counts ? '' : ' is-off')}>
      <span
        className="criterion__rank"
        aria-hidden="true">
        {index + 1}
      </span>
      <input
        type="checkbox"
        className="switch"
        checked={criterion.enabled}
        aria-label={t.enableCriterion(criterion.name)}
        data-focus-key={`${criterion.id}:toggle`}
        onChange={(e) => onUpdate({ enabled: e.target.checked })}
      />
      <input
        // Remounted when the name changes elsewhere (other tab, import), so the field shows it.
        key={`${criterion.id}:${criterion.name}`}
        className="criterion__name"
        defaultValue={criterion.name}
        maxLength={60}
        aria-label={t.criterionName(index + 1)}
        data-focus-key={`${criterion.id}:name`}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.currentTarget.blur();
          if (e.key === 'Escape') {
            e.currentTarget.value = criterion.name;
            e.currentTarget.blur();
          }
        }}
        onBlur={(e) => {
          const value = e.target.value.trim();
          if (!value) e.target.value = criterion.name;
          else if (value !== criterion.name) onUpdate({ name: value });
        }}
      />
      <WeightPicker
        criterionId={criterion.id}
        criterionName={criterion.name}
        weight={criterion.weight}
        onChange={(weight) => onUpdate({ weight })}
      />
      <div className="criterion__actions">
        <IconButton
          icon="up"
          label={t.moveUp(criterion.name)}
          focusKey={`${criterion.id}:up`}
          disabled={index === 0}
          onClick={() => onMove(-1)}
        />
        <IconButton
          icon="down"
          label={t.moveDown(criterion.name)}
          focusKey={`${criterion.id}:down`}
          disabled={index === total - 1}
          onClick={() => onMove(1)}
        />
        <IconButton
          icon="trash"
          danger
          label={t.deleteCriterion(criterion.name)}
          focusKey={`${criterion.id}:delete`}
          onClick={onDelete}
        />
      </div>
    </li>
  );
}
