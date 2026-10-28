import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  DEFAULT_CRITERIA,
  WEIGHT_LABELS,
  computeAverage,
  formatValue,
  newCriterionId,
  type CoasterRating,
  type Criterion,
} from '@/lib/rating';
import { restoreFocus } from '@/lib/focus';
import {
  criteriaItem,
  deleteRating,
  exportBackup,
  importBackup,
  parseBackup,
  ratingsItem,
} from '@/lib/store';
import { useAnnouncer } from '@/hooks/useAnnouncer';

function IconButton({
  text,
  label,
  focusKey,
  disabled,
  onClick,
}: {
  text: string;
  label: string;
  focusKey: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="icon"
      title={label}
      aria-label={label}
      disabled={disabled}
      data-focus-key={focusKey}
      onClick={onClick}
    >
      <span aria-hidden="true">{text}</span>
    </button>
  );
}

export function App() {
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [ratings, setRatings] = useState<Record<string, CoasterRating>>({});
  const [search, setSearch] = useState('');
  const [newName, setNewName] = useState('');
  const [importReplace, setImportReplace] = useState(false);
  const [backupStatus, setBackupStatus] = useState('');

  const criteriaListRef = useRef<HTMLOListElement>(null);
  const ratingsBodyRef = useRef<HTMLTableSectionElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const newNameRef = useRef<HTMLInputElement>(null);
  const focusKeyRef = useRef<string | undefined>(undefined);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const { regionRef, announce } = useAnnouncer();

  const captureFocusKey = (container: HTMLElement | null) => {
    const active = document.activeElement as HTMLElement | null;
    if (active && container?.contains(active) && active.dataset.focusKey) {
      focusKeyRef.current = active.dataset.focusKey;
    }
  };

  useEffect(() => {
    void (async () => {
      setCriteria(await criteriaItem.getValue());
      setRatings(await ratingsItem.getValue());
    })();
    const unwatchCriteria = criteriaItem.watch((next) => {
      setCriteria(next ?? DEFAULT_CRITERIA);
    });
    const unwatchRatings = ratingsItem.watch((next) => {
      setRatings(next ?? {});
    });
    return () => {
      unwatchCriteria();
      unwatchRatings();
    };
  }, []);

  useLayoutEffect(() => {
    if (criteriaListRef.current && focusKeyRef.current) {
      restoreFocus(criteriaListRef.current, focusKeyRef.current, newNameRef.current!);
    }
  }, [criteria]);

  useLayoutEffect(() => {
    if (ratingsBodyRef.current && focusKeyRef.current) {
      restoreFocus(ratingsBodyRef.current, focusKeyRef.current, searchRef.current!);
    }
  }, [ratings, search]);

  const saveCriteria = async (next: Criterion[]) => {
    captureFocusKey(criteriaListRef.current);
    setCriteria(next);
    await criteriaItem.setValue(next);
  };

  const allRatings = Object.values(ratings).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const query = search.trim().toLowerCase();
  const shown = allRatings.filter((r) => !query || `${r.name} ${r.park}`.toLowerCase().includes(query));

  const onSearchInput = (value: string) => {
    setSearch(value);
    clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      const q = value.trim().toLowerCase();
      const count = Object.values(ratings).filter(
        (r) => !q || `${r.name} ${r.park}`.toLowerCase().includes(q),
      ).length;
      announce(
        count ? `${count} coaster${count > 1 ? 's' : ''} affiché${count > 1 ? 's' : ''}.` : 'Aucun coaster ne correspond.',
      );
    }, 600);
  };

  const backupStatusMsg = (text: string) => {
    setBackupStatus('');
    requestAnimationFrame(() => setBackupStatus(text));
  };

  return (
    <>
      <header className="top">
        <div className="wrap">
          <p className="eyebrow">Extension pour Captain Coaster</p>
          <h1>Captain Note</h1>
          <p className="lede">
            Tes critères, tes poids, tes notes. Tout reste dans ce navigateur ; seule la moyenne arrondie part sur
            Captain Coaster, quand tu cliques sur « Envoyer ».
          </p>
        </div>
      </header>

      <main className="wrap">
        <section aria-labelledby="criteria-title">
          <div className="section-head">
            <h2 id="criteria-title">Mes critères</h2>
            <button
              type="button"
              className="link"
              onClick={() => {
                if (
                  confirm(
                    'Revenir aux critères par défaut ? Tes critères personnalisés seront retirés (les notes restent stockées).',
                  )
                ) {
                  void saveCriteria(structuredClone(DEFAULT_CRITERIA)).then(() => announce('Critères par défaut rétablis.'));
                }
              }}
            >
              Rétablir les critères par défaut
            </button>
          </div>
          <p className="help">
            Le poids dit combien un critère compte dans la moyenne. Un critère désactivé ou « Ignoré » disparaît du
            panneau, mais tes notes passées sont gardées.
          </p>
          <ol
            ref={criteriaListRef}
            className="criteria"
            onFocusCapture={() => captureFocusKey(criteriaListRef.current)}
          >
            {criteria.map((criterion, index) => (
              <li
                key={criterion.id}
                className={'criterion' + (criterion.enabled && criterion.weight > 0 ? '' : ' is-off')}
              >
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
                  }
                >
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
          <form
            className="add"
            onSubmit={(e) => {
              e.preventDefault();
              const name = newName.trim();
              if (!name) return;
              void saveCriteria([
                ...criteria,
                { id: newCriterionId(name, criteria), name, weight: 1, enabled: true },
              ]).then(() => announce(`Critère ${name} ajouté en position ${criteria.length + 1}.`));
              setNewName('');
              newNameRef.current?.focus();
            }}
          >
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

        <section aria-labelledby="ratings-title">
          <div className="section-head">
            <h2 id="ratings-title">
              Mes notes {allRatings.length > 0 && <span className="count">({allRatings.length})</span>}
            </h2>
            <label className="search">
              <span className="sr-only">Rechercher un coaster</span>
              <input
                ref={searchRef}
                id="search"
                type="search"
                placeholder="Coaster ou parc…"
                value={search}
                onChange={(e) => onSearchInput(e.target.value)}
              />
            </label>
          </div>
          <div className="table-wrap" hidden={shown.length === 0}>
            <table className="ratings" aria-labelledby="ratings-title">
              <thead>
                <tr>
                  <th scope="col">Coaster</th>
                  <th scope="col" className="num">
                    Moyenne
                  </th>
                  <th scope="col" className="num">
                    Sur Captain Coaster
                  </th>
                  <th scope="col">Modifiée</th>
                  <th scope="col">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody ref={ratingsBodyRef} id="ratings" onFocusCapture={() => captureFocusKey(ratingsBodyRef.current)}>
                {shown.map((rating) => {
                  const { value } = computeAverage(criteria, rating.scores);
                  return (
                    <tr key={rating.coasterId}>
                      <td>
                        <a
                          href={rating.url}
                          target="_blank"
                          rel="noopener"
                          data-focus-key={`${rating.coasterId}:link`}
                        >
                          {rating.name}
                          <span className="sr-only"> (nouvel onglet)</span>
                        </a>
                        <span className="park">{rating.park}</span>
                      </td>
                      <td className="num strong">
                        {value === null ? (
                          <>
                            <span aria-hidden="true">–</span>
                            <span className="sr-only">Aucune</span>
                          </>
                        ) : (
                          formatValue(value)
                        )}
                      </td>
                      <td className="num">
                        {rating.sentValue === null ? (
                          'Pas envoyée'
                        ) : (
                          <>
                            {formatValue(rating.sentValue)}{' '}
                            <span aria-hidden="true">★</span>
                            <span className="sr-only">étoile{rating.sentValue > 1 ? 's' : ''}</span>
                          </>
                        )}
                        {value !== null && rating.sentValue !== value && (
                          <span
                            className="badge"
                            title="Ta moyenne a changé depuis le dernier envoi. Ouvre la page du coaster pour renvoyer."
                          >
                            à renvoyer
                          </span>
                        )}
                      </td>
                      <td>
                        {new Date(rating.updatedAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td>
                        <IconButton
                          text="✕"
                          label={`Supprimer la note de ${rating.name}`}
                          focusKey={`${rating.coasterId}:delete`}
                          onClick={() => {
                            if (
                              confirm(
                                `Supprimer ta note détaillée de ${rating.name} ? La note sur Captain Coaster ne change pas.`,
                              )
                            ) {
                              void deleteRating(rating.coasterId).then(() =>
                                announce(`Note de ${rating.name} supprimée.`),
                              );
                            }
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {allRatings.length > 0 && shown.length === 0 && (
            <p className="empty">Aucun coaster ne correspond à « {search.trim()} ».</p>
          )}
          {allRatings.length === 0 && (
            <p className="empty">
              Aucune note pour l’instant. Ouvre la page d’un coaster sur Captain Coaster : le panneau « Ta note
              détaillée » apparaît sous les étoiles.
            </p>
          )}
        </section>

        <section aria-labelledby="backup-title">
          <h2 id="backup-title">Sauvegarde</h2>
          <p className="help">
            Tes notes ne quittent pas ce navigateur. Exporte-les de temps en temps, ou pour les passer sur un autre
            ordinateur.
          </p>
          <div className="row">
            <button
              type="button"
              className="btn"
              onClick={async () => {
                const backup = await exportBackup();
                const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `captain-note-${new Date().toISOString().slice(0, 10)}.json`;
                link.click();
                URL.revokeObjectURL(link.href);
                backupStatusMsg(`${Object.keys(backup.ratings).length} notes exportées.`);
              }}
            >
              Exporter (.json)
            </button>
            <label className="btn btn--ghost" htmlFor="import">
              Importer…
            </label>
            <label className="check">
              <input
                type="checkbox"
                checked={importReplace}
                onChange={(e) => setImportReplace(e.target.checked)}
              />{' '}
              Remplacer au lieu de fusionner
            </label>
          </div>
          <input
            id="import"
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = '';
              if (!file) return;
              try {
                const backup = parseBackup(JSON.parse(await file.text()));
                if (importReplace && !confirm('Remplacer toutes tes notes et tes critères par ceux du fichier ?')) return;
                await importBackup(backup, importReplace ? 'replace' : 'merge');
                backupStatusMsg(`${Object.keys(backup.ratings).length} notes importées.`);
              } catch (error) {
                backupStatusMsg(error instanceof SyntaxError ? 'Fichier JSON invalide.' : (error as Error).message);
              }
            }}
          />
          <p className="status" role="status">
            {backupStatus}
          </p>
        </section>
      </main>

      <footer className="wrap foot">
        <p>Captain Note n’est pas affilié à Captain Coaster. Aucune donnée n’est collectée.</p>
      </footer>
      <div ref={regionRef} className="sr-only" role="status" />
    </>
  );
}
