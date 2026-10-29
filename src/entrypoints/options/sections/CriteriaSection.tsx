import { t } from '@/lib/i18n';
import type { Criterion } from '@/lib/rating';
import { IconButton } from '@/entrypoints/options/components/IconButton';

export function CriteriaSection({
  criteria,
  criteriaListRef,
  captureFocusKey,
  saveCriteria,
  newName,
  setNewName,
  newNameRef,
  addCriterion,
  resetDefaultCriteria,
  announce,
}: {
  criteria: Criterion[];
  criteriaListRef: React.RefObject<HTMLOListElement | null>;
  captureFocusKey: (container: HTMLElement | null) => void;
  saveCriteria: (next: Criterion[]) => Promise<void>;
  newName: string;
  setNewName: (value: string) => void;
  newNameRef: React.RefObject<HTMLInputElement | null>;
  addCriterion: (e: React.FormEvent) => void;
  resetDefaultCriteria: () => void;
  announce: (text: string) => void;
}) {
  return (
    <section aria-labelledby="criteria-title">
      <div className="section-head">
        <h2 id="criteria-title">{t.optCriteriaTitle}</h2>
        <button type="button" className="link" onClick={resetDefaultCriteria}>
          {t.optResetCriteria}
        </button>
      </div>
      <p className="help">{t.optCriteriaHelp}</p>
      <ol
        ref={criteriaListRef}
        className="criteria"
        onFocusCapture={() => captureFocusKey(criteriaListRef.current)}>
        {criteria.map((criterion, index) => (
          <li
            key={criterion.id}
            className={'criterion' + (criterion.enabled && criterion.weight > 0 ? '' : ' is-off')}>
            <input
              type="checkbox"
              checked={criterion.enabled}
              aria-label={t.enableCriterion(criterion.name)}
              data-focus-key={`${criterion.id}:toggle`}
              onChange={(e) =>
                void saveCriteria(
                  criteria.map((c) => (c.id === criterion.id ? { ...c, enabled: e.target.checked } : c)),
                )
              }
            />
            <input
              key={`${criterion.id}:${criterion.name}`}
              className="criterion__name"
              defaultValue={criterion.name}
              maxLength={60}
              aria-label={t.criterionName(index + 1)}
              data-focus-key={`${criterion.id}:name`}
              onBlur={(e) => {
                const value = e.target.value.trim();
                if (!value) {
                  e.target.value = criterion.name;
                  return;
                }
                void saveCriteria(criteria.map((c) => (c.id === criterion.id ? { ...c, name: value } : c)));
              }}
            />
            <select
              aria-label={t.weightOf(criterion.name)}
              data-focus-key={`${criterion.id}:weight`}
              value={String(criterion.weight)}
              onChange={(e) =>
                void saveCriteria(
                  criteria.map((c) => (c.id === criterion.id ? { ...c, weight: Number(e.target.value) } : c)),
                )
              }>
              {t.weights.map((label, w) => (
                <option key={w} value={w}>
                  {w === 0 ? label : `${label} ×${w}`}
                </option>
              ))}
            </select>
            <div className="criterion__actions">
              <IconButton
                text="↑"
                label={t.moveUp(criterion.name)}
                focusKey={`${criterion.id}:up`}
                disabled={index === 0}
                onClick={() => {
                  const next = [...criteria];
                  const [moved] = next.splice(index, 1);
                  next.splice(index - 1, 0, moved!);
                  void saveCriteria(next).then(() =>
                    announce(t.moved(criterion.name, index, next.length)),
                  );
                }}
              />
              <IconButton
                text="↓"
                label={t.moveDown(criterion.name)}
                focusKey={`${criterion.id}:down`}
                disabled={index === criteria.length - 1}
                onClick={() => {
                  const next = [...criteria];
                  const [moved] = next.splice(index, 1);
                  next.splice(index + 1, 0, moved!);
                  void saveCriteria(next).then(() =>
                    announce(t.moved(criterion.name, index + 2, next.length)),
                  );
                }}
              />
              <IconButton
                text="✕"
                label={t.deleteCriterion(criterion.name)}
                focusKey={`${criterion.id}:delete`}
                onClick={() => {
                  if (confirm(t.confirmDeleteCriterion(criterion.name))) {
                    void saveCriteria(criteria.filter((c) => c.id !== criterion.id)).then(() =>
                      announce(t.criterionDeleted(criterion.name)),
                    );
                  }
                }}
              />
            </div>
          </li>
        ))}
      </ol>
      <form className="add" onSubmit={addCriterion}>
        <label htmlFor="new-name" className="sr-only">
          {t.optNewCriterionLabel}
        </label>
        <input
          ref={newNameRef}
          id="new-name"
          name="name"
          maxLength={60}
          placeholder={t.optNewCriterionPlaceholder}
          autoComplete="off"
          required
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button type="submit" className="btn">
          {t.optAdd}
        </button>
      </form>
    </section>
  );
}
