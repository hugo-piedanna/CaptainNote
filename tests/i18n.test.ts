import { afterEach, describe, expect, it } from 'vitest';
import { LOCALES, getLocale, messagesFor, resolveLocale, setLocale, t, withStars } from '@/lib/i18n';
import { defaultCriteria, formatValue } from '@/lib/rating';

afterEach(() => setLocale('en'));

describe('resolveLocale', () => {
  it('keeps the languages offered by Captain Coaster', () => {
    expect(resolveLocale('fr')).toBe('fr');
    expect(resolveLocale('de-AT')).toBe('de');
    expect(resolveLocale('ES')).toBe('es');
    expect(resolveLocale('en_GB')).toBe('en');
  });

  it('falls back to English', () => {
    expect(resolveLocale('it')).toBe('en');
    expect(resolveLocale('')).toBe('en');
    expect(resolveLocale(null)).toBe('en');
    expect(resolveLocale(undefined)).toBe('en');
  });
});

describe('messages', () => {
  it('has a complete translation for every locale', () => {
    const keys = Object.keys(messagesFor('fr')).sort();
    for (const locale of LOCALES) {
      const messages = messagesFor(locale);
      expect(Object.keys(messages).sort()).toEqual(keys);
      for (const [key, value] of Object.entries(messages)) {
        if (typeof value === 'string') expect(value, `${locale}.${key}`).not.toBe('');
      }
      expect(messages.weights).toHaveLength(4);
      expect(Object.keys(messages.criteria).sort()).toEqual(Object.keys(messagesFor('fr').criteria).sort());
    }
  });

  it('switches the live strings', () => {
    setLocale('de');
    expect(getLocale()).toBe('de');
    expect(t.send).toBe('Senden');
    setLocale('fr');
    expect(t.send).toBe('Envoyer');
  });
});

describe('withStars', () => {
  it('splits every star message around its placeholder', () => {
    for (const locale of LOCALES) {
      for (const message of [messagesFor(locale).sendStars, messagesFor(locale).captainDiffers]) {
        expect(message, `${locale}: ${message}`).toContain('{stars}');
      }
    }
    expect(withStars('{stars} senden')).toEqual(['', ' senden']);
    expect(withStars('Send {stars}')).toEqual(['Send ', '']);
  });
});

describe('defaultCriteria', () => {
  it('keeps ids, order and state across languages', () => {
    const fr = defaultCriteria('fr');
    expect(fr.map((c) => c.name)).toEqual([
      'Layout et rythme',
      'Confort et fluidité',
      'Envie de le refaire',
      'Thématisation',
      'Longueur du tour',
      'File d’attente',
      'Gestion par le parc',
    ]);
    for (const locale of LOCALES) {
      const criteria = defaultCriteria(locale);
      expect(criteria.map((c) => c.id)).toEqual(fr.map((c) => c.id));
      expect(criteria.map((c) => [c.weight, c.enabled])).toEqual(fr.map((c) => [c.weight, c.enabled]));
    }
    expect(fr.every((c) => c.enabled && c.weight === 1)).toBe(true);
  });

  it('uses the display language by default', () => {
    setLocale('es');
    expect(defaultCriteria()[0]!.name).toBe('Trazado y ritmo');
  });
});

describe('formatValue', () => {
  it('formats numbers for the display language', () => {
    setLocale('fr');
    expect(formatValue(3.5)).toBe('3,5');
    setLocale('en');
    expect(formatValue(3.5)).toBe('3.5');
    setLocale('de');
    expect(formatValue(4.25, 2)).toBe('4,25');
  });
});
