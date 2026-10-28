import type { CaptainPage } from '@/lib/captain';
import type { CoasterRating } from '@/lib/rating';

export function emptyCoasterRating(page: CaptainPage): CoasterRating {
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
