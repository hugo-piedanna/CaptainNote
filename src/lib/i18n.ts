/**
 * Display language (FR-ui-locale-multi). No browser APIs: the caller picks the locale
 * (Captain Coaster URL on a coaster page, stored or browser language on the options page).
 */
import { de } from './locales/de';
import { en } from './locales/en';
import { es } from './locales/es';
import { fr, type Messages } from './locales/fr';

export type { Messages };

/** Languages offered by Captain Coaster. */
export const LOCALES = ['en', 'fr', 'es', 'de'] as const;
export type Locale = (typeof LOCALES)[number];

const MESSAGES: Record<Locale, Messages> = { en, fr, es, de };

/** "de-AT", "FR", "es_ES"… to a supported locale; anything else falls back to English. */
export function resolveLocale(tag: string | null | undefined): Locale {
  const base = String(tag ?? '').slice(0, 2).toLowerCase();
  return (LOCALES as readonly string[]).includes(base) ? (base as Locale) : 'en';
}

export function messagesFor(locale: Locale): Messages {
  return MESSAGES[locale];
}

let current: Locale = 'en';

/** Strings of the current display language. A live binding: always read it at use time. */
export let t: Messages = en;

export function setLocale(locale: Locale): void {
  current = locale;
  t = MESSAGES[locale];
}

export function getLocale(): Locale {
  return current;
}

/** Splits a message around its `{stars}` placeholder, so the UI can insert a star value there. */
export function withStars(message: string): [before: string, after: string] {
  const [before = '', after = ''] = message.split('{stars}');
  return [before, after];
}
