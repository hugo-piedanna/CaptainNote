import { t } from '@/lib/i18n';
import { formatValue } from '@/lib/rating';

export function StarsLabel({ value }: { value: number }) {
  return (
    <>
      {formatValue(value)} <span aria-hidden="true">★</span>
      <span className="cn-sr">{t.starWord(value)}</span>
    </>
  );
}
