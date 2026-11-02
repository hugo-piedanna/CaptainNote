import { useRef, useState } from 'react';
import { useFocusRestore } from '@/hooks/useFocusRestore';
import { t } from '@/lib/i18n';
import { Icon } from '@/entrypoints/options/components/Icon';
import { Section } from '@/entrypoints/options/components/Section';
import type { CriteriaModel } from '@/entrypoints/options/hooks/useCriteria';
import { useAnnounce, useConfirm } from '@/entrypoints/options/services';
import { CriterionRow } from './CriterionRow';

export function CriteriaSection({ model }: { model: CriteriaModel }) {
  const { criteria } = model;
  const announce = useAnnounce();
  const confirm = useConfirm();
  const [newName, setNewName] = useState('');
  const newNameRef = useRef<HTMLInputElement>(null);
  const list = useFocusRestore<HTMLOListElement>(newNameRef, [criteria]);

  const reset = async () => {
    const ok = await confirm({
      title: t.optConfirmResetTitle,
      message: t.optConfirmResetBody,
      confirmLabel: t.optConfirmResetAction,
    });
    if (!ok) return;
    await model.reset();
    announce(t.resetDone);
  };

  const remove = async (id: string, name: string) => {
    const ok = await confirm({
      title: t.optConfirmDeleteCriterionTitle(name),
      message: t.optConfirmDeleteCriterionBody,
      confirmLabel: t.optDelete,
    });
    if (!ok) return;
    await model.remove(id);
    announce(t.criterionDeleted(name));
  };

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    setNewName('');
    newNameRef.current?.focus();
    const position = await model.add(name);
    announce(t.criterionAdded(name, position));
  };

  return (
    <Section
      id="criteria"
      title={t.optCriteriaTitle}
      intro={<p>{t.optCriteriaIntro}</p>}
      actions={
        <button
          type="button"
          className="btn btn--quiet"
          onClick={() => void reset()}>
          <Icon name="reset" />
          {t.optResetCriteria}
        </button>
      }>
      {model.loaded && criteria.length === 0 && <p className="empty">{t.optCriteriaEmpty}</p>}
      <ol
        ref={list.containerRef}
        className="criteria"
        onFocusCapture={list.onFocusCapture}>
        {criteria.map((criterion, index) => (
          <CriterionRow
            key={criterion.id}
            criterion={criterion}
            index={index}
            total={criteria.length}
            onUpdate={(patch) => void model.update(criterion.id, patch)}
            onMove={(delta) =>
              void model.move(index, delta).then(() =>
                announce(t.moved(criterion.name, index + 1 + delta, criteria.length)),
              )
            }
            onDelete={() => void remove(criterion.id, criterion.name)}
          />
        ))}
      </ol>
      <form
        className="add"
        onSubmit={(e) => void add(e)}>
        <label
          htmlFor="new-criterion"
          className="add__label">
          {t.optNewCriterionLabel}
        </label>
        <div className="add__row">
          <input
            ref={newNameRef}
            id="new-criterion"
            className="field"
            maxLength={60}
            placeholder={t.optNewCriterionPlaceholder}
            autoComplete="off"
            required
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button
            type="submit"
            className="btn">
            <Icon name="plus" />
            {t.optAdd}
          </button>
        </div>
      </form>
    </Section>
  );
}
