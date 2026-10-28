import { computeAverage, formatValue, type CoasterRating, type Criterion } from '@/lib/rating';
import { IconButton } from '@/entrypoints/options/components/IconButton';

export function RatingsSection({
  criteria,
  allRatings,
  shown,
  search,
  onSearchInput,
  searchRef,
  ratingsBodyRef,
  captureFocusKey,
  deleteRating,
  announce,
}: {
  criteria: Criterion[];
  allRatings: CoasterRating[];
  shown: CoasterRating[];
  search: string;
  onSearchInput: (value: string) => void;
  searchRef: React.RefObject<HTMLInputElement | null>;
  ratingsBodyRef: React.RefObject<HTMLTableSectionElement | null>;
  captureFocusKey: (container: HTMLElement | null) => void;
  deleteRating: (coasterId: number) => Promise<void>;
  announce: (text: string) => void;
}) {
  return (
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
                      data-focus-key={`${rating.coasterId}:link`}>
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
                        title="Ta moyenne a changé depuis le dernier envoi. Ouvre la page du coaster pour renvoyer.">
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
          Aucune note pour l’instant. Ouvre la page d’un coaster sur Captain Coaster : le panneau « Ta note détaillée »
          apparaît sous les étoiles.
        </p>
      )}
    </section>
  );
}
