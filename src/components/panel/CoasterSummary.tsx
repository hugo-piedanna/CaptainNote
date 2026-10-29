import { t, withStars } from '@/lib/i18n';
import { formatValue } from '@/lib/rating';
import { scoreText } from '@/lib/scoreText';
import { StarsLabel } from '@/components/panel/StarsLabel';

export function CoasterSummary({
  value,
  raw,
  counted,
  activeCount,
  captainValue,
  busy,
  status,
}: {
  value: number | null;
  raw: number | null;
  counted: number;
  activeCount: number;
  captainValue: number;
  busy: boolean;
  status: { text: string; tone: 'info' | 'ok' | 'error' } | null;
}) {
  return (
    <div className="cn__summary">
      {value === null ? (
        <p className="cn__hint">{t.rateOneHint}</p>
      ) : (
        <div className="cn__result">
          <p className="cn__avg">
            <span className="cn-sr">{t.yourAverage(scoreText(value))}</span>
            <span className="cn__big" aria-hidden="true">
              {formatValue(value)}
            </span>
            <span className="cn__unit" aria-hidden="true">
              /5
            </span>
          </p>
          <p className="cn__detail">
            {t.averageDetail(formatValue(raw ?? 0, 2), counted, activeCount)}
          </p>
        </div>
      )}
      {value !== null && captainValue > 0 && captainValue !== value && !busy && (
        <p className="cn__note cn__note--warn">
          {withStars(t.captainDiffers)[0]}
          <StarsLabel value={captainValue} />
          {withStars(t.captainDiffers)[1]}
        </p>
      )}
      {status && <p className={`cn__note cn__status cn__note--${status.tone}`}>{status.text}</p>}
    </div>
  );
}
