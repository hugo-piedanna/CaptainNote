import { storage } from '#imports';
import {
  DEFAULT_CRITERIA,
  isValidScore,
  type CoasterRating,
  type Criterion,
  type Score,
} from './rating';

/** Everything stays in the browser (storage.local). Nothing is sent anywhere except the final note to Captain Coaster. */
export const criteriaItem = storage.defineItem<Criterion[]>('local:criteria', {
  fallback: DEFAULT_CRITERIA,
});

export const ratingsItem = storage.defineItem<Record<string, CoasterRating>>('local:ratings', {
  fallback: {},
});

export async function getRating(coasterId: number): Promise<CoasterRating | null> {
  const all = await ratingsItem.getValue();
  return all[String(coasterId)] ?? null;
}

export async function saveRating(rating: CoasterRating): Promise<void> {
  const all = await ratingsItem.getValue();
  all[String(rating.coasterId)] = rating;
  await ratingsItem.setValue(all);
}

export async function deleteRating(coasterId: number): Promise<void> {
  const all = await ratingsItem.getValue();
  delete all[String(coasterId)];
  await ratingsItem.setValue(all);
}

// ---------- Backup ----------

export interface Backup {
  app: 'captain-note';
  version: 1;
  exportedAt: string;
  criteria: Criterion[];
  ratings: Record<string, CoasterRating>;
}

export async function exportBackup(): Promise<Backup> {
  return {
    app: 'captain-note',
    version: 1,
    exportedAt: new Date().toISOString(),
    criteria: await criteriaItem.getValue(),
    ratings: await ratingsItem.getValue(),
  };
}

/** Validates an untrusted backup file and returns clean data, or throws with a readable message. */
export function parseBackup(json: unknown): Backup {
  if (typeof json !== 'object' || json === null) throw new Error('Fichier illisible.');
  const data = json as Partial<Backup>;
  if (data.app !== 'captain-note' || data.version !== 1) {
    throw new Error("Ce fichier n'est pas une sauvegarde Captain Note.");
  }
  if (!Array.isArray(data.criteria) || typeof data.ratings !== 'object' || data.ratings === null) {
    throw new Error('Sauvegarde incomplète.');
  }

  const criteria: Criterion[] = data.criteria
    .filter((c): c is Criterion => typeof c?.id === 'string' && typeof c?.name === 'string')
    .map((c) => ({
      id: c.id.slice(0, 64),
      name: c.name.slice(0, 60),
      weight: Math.min(3, Math.max(0, Math.round(Number(c.weight) || 0))),
      enabled: c.enabled !== false,
    }));

  const ratings: Record<string, CoasterRating> = {};
  for (const r of Object.values(data.ratings as Record<string, CoasterRating>)) {
    const id = Number(r?.coasterId);
    if (!Number.isInteger(id) || id <= 0) continue;
    const scores: Record<string, Score> = {};
    for (const [key, value] of Object.entries(r.scores ?? {})) {
      scores[key.slice(0, 64)] = isValidScore(value) ? value : null;
    }
    ratings[String(id)] = {
      coasterId: id,
      name: String(r.name ?? '').slice(0, 120),
      park: String(r.park ?? '').slice(0, 120),
      url: safeCaptainUrl(r.url, id),
      scores,
      sentValue: isValidScore(r.sentValue) ? r.sentValue : null,
      updatedAt: String(r.updatedAt ?? new Date().toISOString()),
      sentAt: r.sentAt ? String(r.sentAt) : null,
    };
  }

  return { app: 'captain-note', version: 1, exportedAt: String(data.exportedAt ?? ''), criteria, ratings };
}

/** Only keeps links to captaincoaster.com, so an edited backup cannot inject other links. */
function safeCaptainUrl(url: unknown, coasterId: number): string {
  try {
    const parsed = new URL(String(url));
    if (parsed.protocol === 'https:' && parsed.hostname === 'captaincoaster.com') return parsed.href;
  } catch {
    // fall through
  }
  return `https://captaincoaster.com/fr/coasters/${coasterId}`;
}

export async function importBackup(backup: Backup, mode: 'merge' | 'replace'): Promise<void> {
  if (mode === 'replace') {
    await criteriaItem.setValue(backup.criteria.length ? backup.criteria : DEFAULT_CRITERIA);
    await ratingsItem.setValue(backup.ratings);
    return;
  }
  const criteria = await criteriaItem.getValue();
  for (const c of backup.criteria) if (!criteria.some((x) => x.id === c.id)) criteria.push(c);
  await criteriaItem.setValue(criteria);

  const ratings = await ratingsItem.getValue();
  for (const [id, r] of Object.entries(backup.ratings)) {
    const current = ratings[id];
    if (!current || current.updatedAt < r.updatedAt) ratings[id] = r;
  }
  await ratingsItem.setValue(ratings);
}
