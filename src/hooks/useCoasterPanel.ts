import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { readCurrentValue, sendToCaptain, type CaptainPage } from '@/lib/captain';
import { emptyCoasterRating } from '@/lib/emptyCoasterRating';
import {
  DEFAULT_CRITERIA,
  computeAverage,
  formatValue,
  type CoasterRating,
  type Criterion,
  type Score,
} from '@/lib/rating';
import { scoreText } from '@/lib/scoreText';
import { criteriaItem, getRating, saveRating } from '@/lib/store';
import { useAnnouncer } from '@/hooks/useAnnouncer';

export function useCoasterPanel(page: CaptainPage) {
  const rootRef = useRef<HTMLDivElement>(null);
  const focusKeyRef = useRef<string | undefined>(undefined);
  const { regionRef, alertRef, announce } = useAnnouncer();

  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [rating, setRating] = useState<CoasterRating>(() => emptyCoasterRating(page));
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ text: string; tone: 'info' | 'ok' | 'error' } | null>(null);

  const captainValue = page.widget ? readCurrentValue(page.widget) : 0;
  const active = criteria.filter((c) => c.enabled && c.weight > 0);
  const { raw, value, counted, active: activeCount } = computeAverage(criteria, rating.scores);

  useEffect(() => {
    void (async () => {
      setCriteria(await criteriaItem.getValue());
      setRating((await getRating(page.coasterId)) ?? emptyCoasterRating(page));
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
    const el = rootRef.current?.querySelector(':focus') as HTMLElement | undefined;
    if (el?.dataset.focusKey) focusKeyRef.current = el.dataset.focusKey;
  };

  const reason = !page.widget
    ? 'Connecte-toi à Captain Coaster pour envoyer ta note. Tes critères sont déjà enregistrés.'
    : page.readonly
      ? 'Captain Coaster ne permet pas de noter ce coaster.'
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
    announce(avg === null ? 'Pas encore de moyenne.' : `Moyenne : ${scoreText(avg)}.`);
  };

  const send = async () => {
    const { value: avg } = computeAverage(criteria, rating.scores);
    if (avg === null || !canSend) return;

    setBusy(true);
    setStatus({ text: 'Envoi à Captain Coaster…', tone: 'info' });
    announce('Envoi à Captain Coaster…');

    const result = await sendToCaptain(page, avg);
    setBusy(false);
    if (result.ok) {
      const saved = { ...rating, sentValue: avg, sentAt: new Date().toISOString() };
      setRating(saved);
      await saveRating(saved);
      setStatus({
        text: `Note de ${formatValue(avg)} sur 5 enregistrée sur Captain Coaster.`,
        tone: 'ok',
      });
    } else {
      setStatus({ text: result.reason, tone: 'error' });
    }
    const finalStatus = result.ok
      ? `Note de ${formatValue(avg)} sur 5 enregistrée sur Captain Coaster.`
      : result.reason;
    announce(finalStatus, !result.ok);
  };

  return {
    rootRef,
    regionRef,
    alertRef,
    captureFocusKey,
    active,
    rating,
    setScore,
    send,
    raw,
    value,
    counted,
    activeCount,
    captainValue,
    reason,
    upToDate,
    canSend,
    busy,
    status,
  };
}
