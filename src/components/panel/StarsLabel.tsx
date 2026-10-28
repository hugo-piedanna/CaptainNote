import { formatValue } from '@/lib/rating';

export function StarsLabel({ value }: { value: number }) {
  return (
    <>
      {formatValue(value)} <span aria-hidden="true">★</span>
      <span className="cn-sr">étoile{value > 1 ? 's' : ''}</span>
    </>
  );
}
