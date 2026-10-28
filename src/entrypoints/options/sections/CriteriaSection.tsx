import { WEIGHT_LABELS, type Criterion } from '@/lib/rating';
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
        <h2 id="criteria-title">Mes critères</h2>
        <button type="button" className="link" onClick={resetDefaultCriteria}>
          Rétablir les critères par défaut
        </button>
      </div>
      <p className="help">
        Le poids dit combien un critère compte dans la moyenne. Un critère désactivé ou « Ignoré » disparaît du panneau,
        mais tes notes passées sont gardées.
      </p>
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
              aria-label={`Activer ${criterion.name}`}
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
              aria-label={`Nom du critère ${index + 1}`}
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
              aria-label={`Poids de ${criterion.name}`}
              data-focus-key={`${criterion.id}:weight`}
              value={String(criterion.weight)}
              onChange={(e) =>
                void saveCriteria(
                  criteria.map((c) => (c.id === criterion.id ? { ...c, weight: Number(e.target.value) } : c)),
                )
              }>
              {WEIGHT_LABELS.map((label, w) => (
                <option key={w} value={w}>
                  {w === 0 ? label : `${label} ×${w}`}
                </option>
              ))}
            </select>
            <div className="criterion__actions">
              <IconButton
                text="↑"
                label={`Monter ${criterion.name}`}
                focusKey={`${criterion.id}:up`}
                disabled={index === 0}
                onClick={() => {
                  const next = [...criteria];
                  const [moved] = next.splice(index, 1);
                  next.splice(index - 1, 0, moved!);
                  void saveCriteria(next).then(() =>
                    announce(`${criterion.name} déplacé en position ${index} sur ${next.length}.`),
                  );
                }}
              />
              <IconButton
                text="↓"
                label={`Descendre ${criterion.name}`}
                focusKey={`${criterion.id}:down`}
                disabled={index === criteria.length - 1}
                onClick={() => {
                  const next = [...criteria];
                  const [moved] = next.splice(index, 1);
                  next.splice(index + 1, 0, moved!);
                  void saveCriteria(next).then(() =>
                    announce(`${criterion.name} déplacé en position ${index + 2} sur ${next.length}.`),
                  );
                }}
              />
              <IconButton
                text="✕"
                label={`Supprimer ${criterion.name}`}
                focusKey={`${criterion.id}:delete`}
                onClick={() => {
                  if (
                    confirm(
                      `Supprimer le critère « ${criterion.name} » ? Les notes déjà données sur ce critère ne compteront plus.`,
                    )
                  ) {
                    void saveCriteria(criteria.filter((c) => c.id !== criterion.id)).then(() =>
                      announce(`Critère ${criterion.name} supprimé.`),
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
          Nom du nouveau critère
        </label>
        <input
          ref={newNameRef}
          id="new-name"
          name="name"
          maxLength={60}
          placeholder="Nouveau critère, ex. Première chute"
          autoComplete="off"
          required
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button type="submit" className="btn">
          Ajouter
        </button>
      </form>
    </section>
  );
}
