import { t } from '@/lib/i18n';
import type { RatingStatus } from '@/lib/ratingsOverview';

export function StatusBadge({ status }: { status: RatingStatus }) {
  const { label, hint } = {
    synced: { label: t.optStatusSynced, hint: t.optStatusSyncedHint },
    resend: { label: t.optStatusResend, hint: t.optStatusResendHint },
    unsent: { label: t.optStatusUnsent, hint: t.optStatusUnsentHint },
    none: { label: t.optStatusNone, hint: t.optStatusNoneHint },
  }[status];

  return (
    <span
      className={`badge badge--${status}`}
      title={hint}>
      {label}
    </span>
  );
}
