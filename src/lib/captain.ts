/**
 * Everything that depends on Captain Coaster's internal HTML lives here.
 * If the site changes and the extension breaks, this is the only file to fix.
 *
 * Verified against github.com/captain-coaster/captain-coaster (October 2026):
 * - templates/Coaster/_rating_widget.html.twig : the star widget
 * - assets/controllers/rating_controller.js    : how a click becomes a value
 * - src/Controller/RatingCoasterController.php  : POST /{locale}/ratings/coasters/{id}/edit
 */
import { t } from './i18n';
import { MAX_VALUE } from './rating';

export const SELECTORS = {
  /** The user's own star widget on a coaster page (only rendered when logged in). */
  widget: '[data-controller~="rating"][data-rating-coaster-id-value]',
  /** Panel that wraps the widget, used to place our panel right after it. */
  panel: '.cc-panel',
  /** The "rate this coaster" panel, also rendered when logged out. */
  ratingPanel: '.cc-panel[data-controller~="rating-actions"]',
  star: '.rating-star',
  title: 'h1',
  parkLink: 'a[href*="/parks/"]',
} as const;

export interface CaptainPage {
  coasterId: number;
  name: string;
  park: string;
  url: string;
  locale: string;
  widget: HTMLElement | null;
  /** Value currently shown by Captain Coaster (0 = not rated yet). */
  currentValue: number;
  readonly: boolean;
}

/** Coaster pages look like /fr/coasters/123/slug. */
export function coasterIdFromPath(pathname: string): number | null {
  const match = pathname.match(/^\/(en|fr|es|de)\/coasters\/(\d+)(\/|$)/);
  return match ? Number(match[2]) : null;
}

export function readPage(doc: Document, location: Location): CaptainPage | null {
  const coasterId = coasterIdFromPath(location.pathname);
  if (coasterId === null) return null;

  const widget = doc.querySelector<HTMLElement>(SELECTORS.widget);
  const widgetId = widget ? Number(widget.dataset.ratingCoasterIdValue) : null;
  const usable = widget && widgetId === coasterId ? widget : null;

  const name =
    doc.querySelector(SELECTORS.title)?.textContent?.trim() ||
    doc.title.split('|')[0]?.trim() ||
    `Coaster #${coasterId}`;

  return {
    coasterId,
    name,
    park: doc.querySelector(SELECTORS.parkLink)?.textContent?.trim() ?? '',
    url: location.origin + location.pathname,
    locale: location.pathname.split('/')[1] ?? 'en',
    widget: usable,
    currentValue: usable ? Number(usable.dataset.ratingCurrentValueValue) || 0 : 0,
    readonly: usable?.dataset.ratingReadonlyValue === 'true',
  };
}

export function readCurrentValue(widget: HTMLElement): number {
  return Number(widget.dataset.ratingCurrentValueValue) || 0;
}

/**
 * x position, inside the widget, of a click that Captain Coaster reads as `value`.
 * Their controller computes round((x / width) * 5 * 2) / 2, so we aim at the exact spot.
 */
export function clickOffsetFor(value: number, width: number): number {
  return (value / MAX_VALUE) * width;
}

export type SendResult =
  | { ok: true; method: 'widget' | 'request' }
  | { ok: false; reason: string };

/**
 * Sends the note to Captain Coaster as the logged-in user.
 *
 * Preferred path: a click on their own star widget, at the right spot. Their code then
 * does everything (CSRF token, request, star display, delete and date buttons).
 * Fallback (touch screens, hidden widget): the same request their widget sends.
 */
export async function sendToCaptain(page: CaptainPage, value: number): Promise<SendResult> {
  const widget = page.widget;
  if (!widget) return { ok: false, reason: t.errLogin };
  if (page.readonly) return { ok: false, reason: t.errNotRateable };
  if (readCurrentValue(widget) === value) return { ok: true, method: 'widget' };

  const rect = widget.getBoundingClientRect();
  const touch = 'ontouchstart' in window;
  if (!touch && rect.width > 0) {
    const confirmed = waitForCaptainEvent(widget);
    widget.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        clientX: rect.left + clickOffsetFor(value, rect.width),
        clientY: rect.top + rect.height / 2,
      }),
    );
    const result = await confirmed;
    if (result === 'saved') return { ok: true, method: 'widget' };
    if (result === 'failed') return { ok: false, reason: t.errRefused };
    // 'timeout': their widget did not react, try the direct request.
  }

  return sendWithRequest(page, widget, value);
}

/** Their controller dispatches rating:created / rating:updated on success and resets the widget on failure. */
function waitForCaptainEvent(widget: HTMLElement): Promise<'saved' | 'failed' | 'timeout'> {
  return new Promise((resolve) => {
    const done = (result: 'saved' | 'failed' | 'timeout') => {
      widget.removeEventListener('rating:created', onSaved);
      widget.removeEventListener('rating:updated', onSaved);
      observer.disconnect();
      clearTimeout(timer);
      resolve(result);
    };
    const onSaved = () => done('saved');
    let sawChange = false;
    const before = readCurrentValue(widget);
    const observer = new MutationObserver(() => {
      const now = readCurrentValue(widget);
      if (now !== before) sawChange = true;
      else if (sawChange) done('failed');
    });
    widget.addEventListener('rating:created', onSaved);
    widget.addEventListener('rating:updated', onSaved);
    observer.observe(widget, { attributes: true, attributeFilter: ['data-rating-current-value-value'] });
    const timer = setTimeout(() => done(sawChange ? 'failed' : 'timeout'), 8000);
  });
}

async function sendWithRequest(page: CaptainPage, widget: HTMLElement, value: number): Promise<SendResult> {
  const token =
    widget.closest<HTMLElement>('[data-csrf-protection-token-value]')?.dataset.csrfProtectionTokenValue;
  if (!token) return { ok: false, reason: t.errToken };

  try {
    // Firefox content scripts must use content.fetch to send the request as the page (same cookies and origin).
    const pageFetch: typeof fetch =
      (globalThis as { content?: { fetch?: typeof fetch } }).content?.fetch ?? fetch;
    const response = await pageFetch(`${location.origin}/${page.locale}/ratings/coasters/${page.coasterId}/edit`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: new URLSearchParams({ value: String(value), _token: token }).toString(),
    });
    if (!response.ok) {
      return { ok: false, reason: t.errStatus(response.status) };
    }
    widget.dataset.ratingCurrentValueValue = String(value);
    paintStars(widget, value);
    return { ok: true, method: 'request' };
  } catch {
    return { ok: false, reason: t.errOffline };
  }
}

/** Same classes as their controller, so the stars match after a direct request. */
function paintStars(widget: HTMLElement, value: number): void {
  widget.querySelectorAll<HTMLElement>(SELECTORS.star).forEach((star, index) => {
    const position = index + 1;
    star.classList.remove('star-full', 'star-half', 'star-empty');
    star.classList.add(value >= position ? 'star-full' : value >= position - 0.5 ? 'star-half' : 'star-empty');
  });
}
