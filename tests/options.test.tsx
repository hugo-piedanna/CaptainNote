// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { setLocale } from '@/lib/i18n';
import type { CoasterRating, Criterion } from '@/lib/rating';

/** In-memory stand-in for the WXT storage items used by the settings page. */
const fake = vi.hoisted(() => {
  function item<T>(initial: T) {
    let value = initial;
    const listeners = new Set<(next: T) => void>();
    return {
      getValue: async () => value,
      setValue: async (next: T) => {
        value = next;
        listeners.forEach((listener) => listener(next));
      },
      watch: (listener: (next: T) => void) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
      reset: (next: T) => {
        value = next;
        listeners.clear();
      },
    };
  }
  return {
    criteria: item<Criterion[] | null>(null),
    ratings: item<Record<string, CoasterRating>>({}),
  };
});

vi.mock('@/lib/store', () => ({
  criteriaItem: fake.criteria,
  ratingsItem: fake.ratings,
  deleteRating: async (coasterId: number) => {
    const all = { ...(await fake.ratings.getValue()) };
    delete all[String(coasterId)];
    await fake.ratings.setValue(all);
  },
  exportBackup: vi.fn(),
  importBackup: vi.fn(),
  parseBackup: vi.fn(),
}));

const { App } = await import('@/entrypoints/options/App');

function rating(
  coasterId: number,
  name: string,
  score: number,
  sentValue: number | null,
  updatedAt: string,
): CoasterRating {
  return {
    coasterId,
    name,
    park: 'Parc',
    url: `https://captaincoaster.com/fr/coasters/${coasterId}`,
    scores: { layout: score },
    sentValue,
    updatedAt,
    sentAt: null,
  };
}

async function mount() {
  render(<App />);
  // Lets the storage reads resolve.
  await act(async () => {});
}

const dialog = () => document.querySelector('dialog')!;

beforeEach(() => {
  setLocale('fr');
  fake.criteria.reset(null);
  fake.ratings.reset({
    1: rating(1, 'Zadra', 5, 5, '2026-03-01T00:00:00Z'),
    2: rating(2, 'Anaconda', 3, null, '2026-05-01T00:00:00Z'),
  });
});

afterEach(cleanup);

describe('options page', () => {
  it('shows the default criteria and the local summary', async () => {
    await mount();
    const names = screen.getAllByRole('textbox', { name: /Nom du critère/ }) as HTMLInputElement[];
    expect(names.map((input) => input.value)[0]).toBe('Layout et rythme');
    expect(names).toHaveLength(7);

    const stats = document.querySelector('.stats')!;
    expect(within(stats as HTMLElement).getByText('notes détaillées').nextSibling?.textContent).toBe('2');
    expect(within(stats as HTMLElement).getByText('à jour sur Captain Coaster').nextSibling?.textContent).toBe('1');
    expect(within(stats as HTMLElement).getByText('en attente d’envoi').nextSibling?.textContent).toBe('1');
    expect(within(stats as HTMLElement).getByText('critères actifs sur 7').nextSibling?.textContent).toBe('7');
  });

  it('saves the weight chosen in the segmented control', async () => {
    await mount();
    const group = screen.getByRole('group', { name: 'Poids de Layout et rythme' });
    await act(async () => {
      fireEvent.click(within(group).getByRole('radio', { name: /Essentiel/ }));
    });
    const saved = await fake.criteria.getValue();
    expect(saved?.find((c) => c.id === 'layout')?.weight).toBe(3);
  });

  it('offers three weights, without Ignoré', async () => {
    await mount();
    const group = screen.getByRole('group', { name: 'Poids de Layout et rythme' });
    const radios = within(group).getAllByRole('radio');
    expect(radios.map((radio) => radio.closest('label')?.textContent)).toEqual([
      'Normal×1',
      'Important×2',
      'Essentiel×3',
    ]);
    expect(within(group).queryByRole('radio', { name: /Ignoré/ })).toBeNull();
  });

  it('shows a criterion saved as Ignoré as disabled with Normal weight', async () => {
    fake.criteria.reset([{ id: 'layout', name: 'Layout et rythme', weight: 0, enabled: true }]);
    await mount();
    expect((screen.getByRole('checkbox', { name: /Layout et rythme/ }) as HTMLInputElement).checked).toBe(false);
    const group = screen.getByRole('group', { name: 'Poids de Layout et rythme' });
    expect((within(group).getByRole('radio', { name: /Normal/ }) as HTMLInputElement).checked).toBe(true);
  });

  it('restores the name on Escape and saves it on Enter', async () => {
    await mount();
    const input = screen.getByRole('textbox', { name: 'Nom du critère 1' }) as HTMLInputElement;
    input.focus();
    fireEvent.change(input, { target: { value: 'Brouillon' } });
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(input.value).toBe('Layout et rythme');
    expect(await fake.criteria.getValue()).toBeNull();

    const again = screen.getByRole('textbox', { name: 'Nom du critère 1' }) as HTMLInputElement;
    again.focus();
    fireEvent.change(again, { target: { value: 'Tracé' } });
    await act(async () => {
      fireEvent.keyDown(again, { key: 'Enter' });
    });
    expect((await fake.criteria.getValue())?.[0]?.name).toBe('Tracé');
  });

  it('asks for confirmation in a dialog before deleting a criterion', async () => {
    await mount();
    fireEvent.click(screen.getByRole('button', { name: 'Supprimer Thématisation' }));
    await act(async () => {});
    expect(dialog().open).toBe(true);
    expect(within(dialog()).getByRole('heading').textContent).toBe('Supprimer « Thématisation » ?');
    expect(document.activeElement?.textContent).toBe('Annuler');

    await act(async () => {
      fireEvent.click(within(dialog()).getByRole('button', { name: 'Annuler' }));
    });
    expect(dialog().open).toBe(false);
    expect(await fake.criteria.getValue()).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Supprimer Thématisation' }));
    await act(async () => {});
    await act(async () => {
      fireEvent.click(within(dialog()).getByRole('button', { name: 'Supprimer' }));
    });
    const saved = await fake.criteria.getValue();
    expect(saved).toHaveLength(6);
    expect(saved?.some((c) => c.id === 'theming')).toBe(false);
  });

  it('shows each rating status and sorts the list', async () => {
    await mount();
    const rows = () => [...document.querySelectorAll('.ratings tbody tr')];
    expect(rows().map((row) => row.querySelector('a')?.firstChild?.textContent)).toEqual(['Anaconda', 'Zadra']);
    expect(rows().map((row) => row.querySelector('.badge')?.textContent)).toEqual(['Pas envoyée', 'À jour']);

    fireEvent.change(screen.getByRole('combobox', { name: 'Trier par' }), { target: { value: 'average' } });
    expect(rows().map((row) => row.querySelector('a')?.firstChild?.textContent)).toEqual(['Zadra', 'Anaconda']);
  });

  it('pages the list 10 by 10 and goes back to page 1 on search', async () => {
    fake.ratings.reset(
      Object.fromEntries(
        Array.from({ length: 23 }, (_, i) => [
          i + 1,
          rating(i + 1, `Coaster ${String(i + 1).padStart(2, '0')}`, 3, null, `2026-01-${String(i + 1).padStart(2, '0')}T00:00:00Z`),
        ]),
      ),
    );
    await mount();
    const rows = () => document.querySelectorAll('.ratings tbody tr');
    expect(rows()).toHaveLength(10);
    expect(screen.getByText('1–10 sur 23')).toBeTruthy();

    const prev = screen.getByRole('button', { name: 'Page précédente' }) as HTMLButtonElement;
    const next = screen.getByRole('button', { name: 'Page suivante' }) as HTMLButtonElement;
    expect(prev.disabled).toBe(true);
    fireEvent.click(next);
    fireEvent.click(next);
    expect(rows()).toHaveLength(3);
    expect(screen.getByText('Page 3 sur 3')).toBeTruthy();
    expect(next.disabled).toBe(true);

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'parc' } });
    expect(screen.getByText('Page 1 sur 3')).toBeTruthy();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Coaster 2' } });
    expect(rows()).toHaveLength(4);
    expect(document.querySelector('.pager')).toBeNull();
  });

  it('credits the author with plain links in the footer', async () => {
    await mount();
    const footer = document.querySelector('footer')!;
    const links = [...footer.querySelectorAll('a')];
    expect(links.map((a) => [a.textContent, a.getAttribute('href')])).toEqual([
      ['Hugo Piedanna', 'https://piedanna.dev'],
      ['Code source', 'https://github.com/hugo-piedanna/CaptainNote'],
    ]);
    expect(links.every((a) => a.target === '_blank' && a.rel === 'noopener noreferrer')).toBe(true);
    expect(footer.textContent).toContain('Fait par Hugo Piedanna');
  });

  it('defaults the import mode to merge', async () => {
    await mount();
    expect((screen.getByRole('radio', { name: /Fusionner/ }) as HTMLInputElement).checked).toBe(true);
    expect((screen.getByRole('radio', { name: /Tout remplacer/ }) as HTMLInputElement).checked).toBe(false);
  });
});
