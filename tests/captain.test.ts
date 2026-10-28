// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clickOffsetFor, coasterIdFromPath, readPage, sendToCaptain } from '@/lib/captain';

// jsdom pretends to be a touch screen; a desktop browser is not.
delete (window as unknown as Record<string, unknown>).ontouchstart;

/**
 * Markup copied from templates/Coaster/_rating_widget.html.twig, and a click handler that
 * reproduces assets/controllers/rating_controller.js (getValueFromEvent + save + dispatch).
 */
function mountCoasterPage(currentValue = 0, onSave: (value: number) => boolean = () => true) {
  document.body.innerHTML = `
    <h1>Zadra</h1><a href="/fr/parks/12/energylandia">Energylandia</a>
    <div class="cc-panel cc-panel__body csrf-protection" data-controller="csrf-protection rating-actions">
      <div class="csrf-protection" data-controller="csrf-protection rating"
           data-csrf-protection-token-value="tok123"
           data-rating-coaster-id-value="4242"
           data-rating-current-value-value="${currentValue}"
           data-rating-locale-value="fr"></div>
    </div>`;
  const widget = document.querySelector<HTMLElement>('[data-controller~="rating"]')!;
  widget.getBoundingClientRect = () => ({ left: 100, top: 50, width: 130, height: 26 }) as DOMRect;

  const saved: number[] = [];
  widget.addEventListener('click', (e) => {
    const rect = widget.getBoundingClientRect();
    const value = Math.max(0.5, Math.min(5, Math.round(((e.clientX - rect.left) / rect.width) * 5 * 2) / 2));
    const before = widget.dataset.ratingCurrentValueValue!;
    widget.dataset.ratingCurrentValueValue = String(value);
    setTimeout(() => {
      if (onSave(value)) {
        saved.push(value);
        widget.dispatchEvent(new CustomEvent(before === '0' ? 'rating:created' : 'rating:updated', { bubbles: true }));
      } else {
        widget.dataset.ratingCurrentValueValue = before; // their controller resets on failure
      }
    }, 10);
  });
  return { widget, saved };
}

const loc = (path: string) => ({ pathname: path, origin: 'https://captaincoaster.com' }) as Location;

describe('coasterIdFromPath', () => {
  it('reads coaster pages only', () => {
    expect(coasterIdFromPath('/fr/coasters/4242/zadra')).toBe(4242);
    expect(coasterIdFromPath('/en/coasters/4242')).toBe(4242);
    expect(coasterIdFromPath('/fr/coasters/ranking/2')).toBeNull();
    expect(coasterIdFromPath('/fr/coasters/4242/zadra/images/upload')).toBe(4242);
  });
});

describe('clickOffsetFor', () => {
  it('lands every half-point value on itself with their rounding', () => {
    for (let v = 0.5; v <= 5; v += 0.5) {
      const x = clickOffsetFor(v, 130);
      expect(Math.round((x / 130) * 5 * 2) / 2).toBe(v);
    }
  });
});

describe('readPage', () => {
  beforeEach(() => mountCoasterPage(3.5));
  it('finds the coaster, the widget and the current note', () => {
    const page = readPage(document, loc('/fr/coasters/4242/zadra'))!;
    expect(page).toMatchObject({ coasterId: 4242, name: 'Zadra', park: 'Energylandia', locale: 'fr', currentValue: 3.5 });
    expect(page.widget).not.toBeNull();
  });
  it('ignores a widget that belongs to another coaster', () => {
    expect(readPage(document, loc('/fr/coasters/1/other'))!.widget).toBeNull();
  });
});

describe('sendToCaptain', () => {
  it('rates through the native widget', async () => {
    const { saved } = mountCoasterPage(0);
    const page = readPage(document, loc('/fr/coasters/4242/zadra'))!;
    await expect(sendToCaptain(page, 3.5)).resolves.toEqual({ ok: true, method: 'widget' });
    expect(saved).toEqual([3.5]);
  });

  it('reports a refusal from Captain Coaster', async () => {
    mountCoasterPage(2, () => false);
    const page = readPage(document, loc('/fr/coasters/4242/zadra'))!;
    const result = await sendToCaptain(page, 4.5);
    expect(result.ok).toBe(false);
  });

  it('falls back to the direct request on touch screens', async () => {
    mountCoasterPage(2);
    const page = readPage(document, loc('/fr/coasters/4242/zadra'))!;
    (window as unknown as Record<string, unknown>).ontouchstart = null;
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ state: 'success' }) });
    vi.stubGlobal('fetch', fetchMock);
    vi.stubGlobal('location', { origin: 'https://captaincoaster.com' });

    await expect(sendToCaptain(page, 4)).resolves.toEqual({ ok: true, method: 'request' });
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe('https://captaincoaster.com/fr/ratings/coasters/4242/edit');
    expect(init.headers['X-Requested-With']).toBe('XMLHttpRequest');
    expect(init.body).toBe('value=4&_token=tok123');
    expect(page.widget!.dataset.ratingCurrentValueValue).toBe('4');

    delete (window as unknown as Record<string, unknown>).ontouchstart;
    vi.unstubAllGlobals();
  });

  it('asks to log in when there is no widget', async () => {
    document.body.innerHTML = '<h1>Zadra</h1>';
    const page = readPage(document, loc('/fr/coasters/4242/zadra'))!;
    expect((await sendToCaptain(page, 3)).ok).toBe(false);
  });
});
