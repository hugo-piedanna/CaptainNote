import { browser } from "#imports";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { readCurrentValue, sendToCaptain, type CaptainPage } from "@/lib/captain";
import {
  DEFAULT_CRITERIA,
  computeAverage,
  formatValue,
  type CoasterRating,
  type Criterion,
  type Score,
} from "@/lib/rating";
import { scoreText } from "@/lib/scoreText";
import { criteriaItem, getRating, saveRating } from "@/lib/store";
import { StarInput } from "@/components/stars/StarInput";
import "./panel.css";
import "@/components/stars/StarInput.css";

function starsLabel(value: number): ReactNode {
  return (
    <>
      {formatValue(value)} <span aria-hidden="true">★</span>
      <span className="cn-sr">étoile{value > 1 ? "s" : ""}</span>
    </>
  );
}

function emptyRating(page: CaptainPage): CoasterRating {
  return {
    coasterId: page.coasterId,
    name: page.name,
    park: page.park,
    url: page.url,
    scores: {},
    sentValue: null,
    updatedAt: new Date().toISOString(),
    sentAt: null,
  };
}

export function CoasterPanel({ page }: { page: CaptainPage }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const liveRef = useRef<HTMLDivElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);
  const focusKeyRef = useRef<string | undefined>(undefined);

  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [rating, setRating] = useState<CoasterRating>(() => emptyRating(page));
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ text: string; tone: "info" | "ok" | "error" } | null>(null);

  const captainValue = page.widget ? readCurrentValue(page.widget) : 0;
  const active = criteria.filter((c) => c.enabled && c.weight > 0);
  const { raw, value, counted, active: activeCount } = computeAverage(criteria, rating.scores);

  const announce = useCallback((text: string, urgent = false) => {
    const region = urgent ? alertRef.current : liveRef.current;
    if (!region) return;
    region.textContent = "";
    requestAnimationFrame(() => {
      region.textContent = text;
    });
  }, []);

  useEffect(() => {
    void (async () => {
      setCriteria(await criteriaItem.getValue());
      setRating((await getRating(page.coasterId)) ?? emptyRating(page));
    })();
  }, [page.coasterId, page.name, page.park, page.url]);

  useEffect(() => {
    return criteriaItem.watch((next) => {
      setCriteria(next ?? DEFAULT_CRITERIA);
    });
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const key = focusKeyRef.current;
    if (!root || !key) return;
    root.querySelector<HTMLElement>(`[data-focus-key="${CSS.escape(key)}"]`)?.focus();
  }, [criteria]);

  const captureFocusKey = () => {
    const el = rootRef.current?.querySelector(":focus") as HTMLElement | undefined;
    if (el?.dataset.focusKey) focusKeyRef.current = el.dataset.focusKey;
  };

  const reason = !page.widget
    ? "Connecte-toi à Captain Coaster pour envoyer ta note. Tes critères sont déjà enregistrés."
    : page.readonly
      ? "Captain Coaster ne permet pas de noter ce coaster."
      : null;
  const upToDate = value !== null && captainValue === value;
  const canSend = value !== null && !busy && !reason && !upToDate;

  const setScore = async (criterionId: string, score: Score) => {
    const next: CoasterRating = {
      ...rating,
      name: page.name,
      park: page.park,
      url: page.url,
      scores: { ...rating.scores, [criterionId]: score },
      updatedAt: new Date().toISOString(),
    };
    setRating(next);
    setStatus(null);
    await saveRating(next);
    const { value: avg } = computeAverage(criteria, next.scores);
    announce(avg === null ? "Pas encore de moyenne." : `Moyenne : ${scoreText(avg)}.`);
  };

  const send = async () => {
    const { value: avg } = computeAverage(criteria, rating.scores);
    if (avg === null || !canSend) return;

    setBusy(true);
    setStatus({ text: "Envoi à Captain Coaster…", tone: "info" });
    announce("Envoi à Captain Coaster…");

    const result = await sendToCaptain(page, avg);
    setBusy(false);
    if (result.ok) {
      const saved = { ...rating, sentValue: avg, sentAt: new Date().toISOString() };
      setRating(saved);
      await saveRating(saved);
      setStatus({
        text: `Note de ${formatValue(avg)} sur 5 enregistrée sur Captain Coaster.`,
        tone: "ok",
      });
    } else {
      setStatus({ text: result.reason, tone: "error" });
    }
    const finalStatus = result.ok
      ? `Note de ${formatValue(avg)} sur 5 enregistrée sur Captain Coaster.`
      : result.reason;
    announce(finalStatus, !result.ok);
  };

  return (
    <div ref={rootRef} onFocusCapture={captureFocusKey}>
      <section
        className="cn"
        aria-labelledby="cn-title">
        <header className="cn__head">
          <p className="cn__eyebrow">Captain Note</p>
          <h2
            id="cn-title"
            className="cn__title">
            Ta note détaillées
          </h2>
        </header>
        <p
          id="cn-help"
          className="cn-sr">
          Pour chaque critère : flèches gauche et droite pour changer d’une demi-étoile, chiffres de 1 à 5, Suppr si le
          critère ne s’applique pas.
        </p>
        <ul
          className="cn__list"
          aria-label="Critères">
          {active.length === 0 ? (
            <li className="cn__empty">Aucun critère actif. Ajoute-en dans les réglages.</li>
          ) : (
            active.map((criterion) => (
              <li
                key={criterion.id}
                className="cn__row">
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
                  onChange={(score) => void setScore(criterion.id, score)}
                  starsFocusKey={`${criterion.id}:stars`}
                  clearFocusKey={`${criterion.id}:clear`}
                  describedBy="cn-help"
                />
              </li>
            ))
          )}
        </ul>

        <div className="cn__summary">
          {value === null ? (
            <p className="cn__hint">Note au moins un critère pour obtenir ta moyenne.</p>
          ) : (
            <div className="cn__result">
              <p className="cn__avg">
                <span className="cn-sr">Ta moyenne : {scoreText(value)}</span>
                <span
                  className="cn__big"
                  aria-hidden="true">
                  {formatValue(value)}
                </span>
                <span
                  className="cn__unit"
                  aria-hidden="true">
                  /5
                </span>
              </p>
              <p className="cn__detail">
                Moyenne {formatValue(raw, 2)} sur {counted} critère{counted > 1 ? "s" : ""}
                {counted < activeCount ? ` (sur ${activeCount})` : ""}, arrondie au demi-point inférieur pour Captain
                Coaster.
              </p>
            </div>
          )}
          {value !== null && captainValue > 0 && captainValue !== value && !busy && (
            <p className="cn__note cn__note--warn">
              Sur Captain Coaster, ta note est {starsLabel(captainValue)}. Envoie la nouvelle pour les aligner.
            </p>
          )}
          {status && <p className={`cn__note cn__status cn__note--${status.tone}`}>{status.text}</p>}
        </div>

        <button
          type="button"
          className="cn__send"
          data-focus-key="send"
          aria-disabled={!canSend}
          aria-describedby={reason ? "cn-send-why" : undefined}
          onClick={() => void send()}>
          {busy ? (
            "Envoi…"
          ) : upToDate ? (
            "Déjà à jour sur Captain Coaster"
          ) : value === null ? (
            "Envoyer"
          ) : (
            <>Envoyer {starsLabel(value)}</>
          )}
        </button>
        <p
          id="cn-send-why"
          className="cn__hint"
          hidden={!reason}>
          {reason ?? ""}
        </p>
        <button
          type="button"
          className="cn__settings"
          data-focus-key="settings"
          onClick={() => void browser.runtime.sendMessage({ type: "open-options" })}>
          Gérer mes critères<span className="cn-sr"> (ouvre un nouvel onglet)</span>
        </button>
        <div
          ref={liveRef}
          className="cn__live cn-sr"
          role="status"
        />
        <div
          ref={alertRef}
          className="cn__alert cn-sr"
          role="alert"
        />
      </section>
    </div>
  );
}
