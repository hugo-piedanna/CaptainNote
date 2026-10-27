import { browser, defineContentScript } from '#imports';
import { readCurrentValue, readPage, sendToCaptain, SELECTORS, type CaptainPage } from '@/lib/captain';
import { computeAverage, formatValue, type CoasterRating, type Criterion, type Score } from '@/lib/rating';
import { STAR_CSS, createStarInput, scoreText } from '@/lib/stars';
import { criteriaItem, getRating, saveRating } from '@/lib/store';

export default defineContentScript({
  matches: ['https://captaincoaster.com/*/coasters/*'],
  runAt: 'document_idle',
  async main(ctx) {
    const page = readPage(document, location);
    if (!page) return;

    const host = document.createElement('captain-note-panel');
    // Reuse Captain Coaster's panel classes so the card looks native.
    host.className = 'cc-panel cc-panel__body';
    const ratingPanel = page.widget?.closest(SELECTORS.panel) ?? document.querySelector(SELECTORS.ratingPanel);
    if (ratingPanel) ratingPanel.after(host);
    else (document.querySelector('main') ?? document.body).prepend(host);
    ctx.onInvalidated(() => host.remove());

    const root = host.attachShadow({ mode: 'open' });
    const panel = new Panel(root, page);
    await panel.load();

    // Keep the panel in sync when criteria change in the settings page or in another tab.
    const unwatchCriteria = criteriaItem.watch(() => panel.load());
    ctx.onInvalidated(unwatchCriteria);
  },
});

class Panel {
  private criteria: Criterion[] = [];
  private rating!: CoasterRating;
  private busy = false;
  private status: { text: string; tone: 'info' | 'ok' | 'error' } | null = null;

  constructor(
    private readonly root: ShadowRoot,
    private readonly page: CaptainPage,
  ) {}

  async load(): Promise<void> {
    this.criteria = await criteriaItem.getValue();
    this.rating = (await getRating(this.page.coasterId)) ?? {
      coasterId: this.page.coasterId,
      name: this.page.name,
      park: this.page.park,
      url: this.page.url,
      scores: {},
      sentValue: null,
      updatedAt: new Date().toISOString(),
      sentAt: null,
    };
    this.render();
  }

  private get captainValue(): number {
    return this.page.widget ? readCurrentValue(this.page.widget) : 0;
  }

  /**
   * Screen reader announcement. The live regions stay in the DOM across renders: a region
   * created at the same time as its text is often not read.
   */
  private announce(text: string, urgent = false): void {
    const region = this.root.querySelector<HTMLElement>(urgent ? '.cn__alert' : '.cn__live');
    if (!region) return;
    region.textContent = '';
    // Next frame, so the same message twice in a row is still read.
    requestAnimationFrame(() => (region.textContent = text));
  }

  private async setScore(criterionId: string, score: Score): Promise<void> {
    this.rating = {
      ...this.rating,
      name: this.page.name,
      park: this.page.park,
      url: this.page.url,
      scores: { ...this.rating.scores, [criterionId]: score },
      updatedAt: new Date().toISOString(),
    };
    this.status = null;
    await saveRating(this.rating);
    this.renderSummary();
    const { value } = computeAverage(this.criteria, this.rating.scores);
    this.announce(value === null ? 'Pas encore de moyenne.' : `Moyenne : ${scoreText(value)}.`);
  }

  private async send(): Promise<void> {
    const { value } = computeAverage(this.criteria, this.rating.scores);
    const button = this.root.querySelector('.cn__send');
    if (value === null || this.busy || button?.getAttribute('aria-disabled') === 'true') return;
    this.busy = true;
    this.status = { text: 'Envoi à Captain Coaster…', tone: 'info' };
    this.renderSummary();
    this.announce(this.status.text);

    const result = await sendToCaptain(this.page, value);
    this.busy = false;
    if (result.ok) {
      this.rating = { ...this.rating, sentValue: value, sentAt: new Date().toISOString() };
      await saveRating(this.rating);
      this.status = { text: `Note de ${formatValue(value)} sur 5 enregistrée sur Captain Coaster.`, tone: 'ok' };
    } else {
      this.status = { text: result.reason, tone: 'error' };
    }
    this.renderSummary();
    this.announce(this.status.text, this.status.tone === 'error');
  }

  private render(): void {
    // The whole panel is rebuilt when criteria change elsewhere: put the focus back where it was.
    const focusKey = (this.root.activeElement as HTMLElement | null)?.dataset.focusKey;
    const active = this.criteria.filter((c) => c.enabled && c.weight > 0);
    this.root.innerHTML = `<style>${PANEL_CSS}${STAR_CSS}</style>
      <section class="cn" aria-labelledby="cn-title">
        <header class="cn__head">
          <p class="cn__eyebrow">Captain Note</p>
          <h2 id="cn-title" class="cn__title">Ta note détaillée</h2>
        </header>
        <p id="cn-help" class="cn-sr">Pour chaque critère : flèches gauche et droite pour changer d’une demi-étoile, chiffres de 1 à 5, Suppr si le critère ne s’applique pas.</p>
        <ul class="cn__list" aria-label="Critères"></ul>
        <div class="cn__summary"></div>
        <button type="button" class="cn__send" data-focus-key="send" aria-describedby="cn-send-why"></button>
        <p id="cn-send-why" class="cn__hint" hidden></p>
        <button type="button" class="cn__settings" data-focus-key="settings">Gérer mes critères<span class="cn-sr"> (ouvre un nouvel onglet)</span></button>
        <div class="cn__live cn-sr" role="status"></div>
        <div class="cn__alert cn-sr" role="alert"></div>
      </section>`;

    const list = this.root.querySelector('.cn__list')!;
    if (active.length === 0) {
      list.innerHTML = `<li class="cn__empty">Aucun critère actif. Ajoute-en dans les réglages.</li>`;
    }
    for (const criterion of active) {
      const row = document.createElement('li');
      row.className = 'cn__row';
      const name = document.createElement('span');
      name.className = 'cn__name';
      name.textContent = criterion.name;
      if (criterion.weight > 1) {
        const badge = document.createElement('span');
        badge.className = 'cn__weight';
        badge.textContent = `×${criterion.weight}`;
        badge.title = `Compte ${criterion.weight} fois dans la moyenne`;
        badge.setAttribute('aria-hidden', 'true');
        const spoken = document.createElement('span');
        spoken.className = 'cn-sr';
        spoken.textContent = `, compte ${criterion.weight} fois`;
        name.append(badge, spoken);
      }
      const stars = createStarInput({
        label: criterion.weight > 1 ? `${criterion.name}, compte ${criterion.weight} fois` : criterion.name,
        value: this.rating.scores[criterion.id] ?? null,
        onChange: (score) => void this.setScore(criterion.id, score),
      });
      const slider = stars.querySelector<HTMLElement>('[role="slider"]')!;
      slider.dataset.focusKey = `${criterion.id}:stars`;
      slider.setAttribute('aria-describedby', 'cn-help');
      stars.querySelector<HTMLElement>('button')!.dataset.focusKey = `${criterion.id}:clear`;
      row.append(name, stars);
      list.append(row);
    }

    this.root.querySelector('.cn__send')!.addEventListener('click', () => void this.send());
    this.root.querySelector('.cn__settings')!.addEventListener('click', () => {
      void browser.runtime.sendMessage({ type: 'open-options' });
    });
    this.renderSummary();
    if (focusKey) this.root.querySelector<HTMLElement>(`[data-focus-key="${CSS.escape(focusKey)}"]`)?.focus();
  }

  /**
   * Updates the result and the send button in place. The button is never replaced nor
   * `disabled`, so it keeps the keyboard focus after a click.
   */
  private renderSummary(): void {
    const summary = this.root.querySelector<HTMLElement>('.cn__summary');
    const button = this.root.querySelector<HTMLButtonElement>('.cn__send');
    const why = this.root.querySelector<HTMLElement>('#cn-send-why');
    if (!summary || !button || !why) return;
    const { raw, value, counted, active } = computeAverage(this.criteria, this.rating.scores);
    const onCaptain = this.captainValue;

    const lines: string[] = [];
    if (value === null) {
      lines.push(`<p class="cn__hint">Note au moins un critère pour obtenir ta moyenne.</p>`);
    } else {
      lines.push(`<div class="cn__result">
          <p class="cn__avg"><span class="cn-sr">Ta moyenne : ${scoreText(value)}</span><span class="cn__big" aria-hidden="true">${formatValue(value)}</span><span class="cn__unit" aria-hidden="true">/5</span></p>
          <p class="cn__detail">Moyenne ${formatValue(raw, 2)} sur ${counted} critère${counted > 1 ? 's' : ''}${
            counted < active ? ` (sur ${active})` : ''
          }, arrondie au demi-point inférieur pour Captain Coaster.</p>
        </div>`);
    }

    if (value !== null && onCaptain > 0 && onCaptain !== value && !this.busy) {
      lines.push(`<p class="cn__note cn__note--warn">Sur Captain Coaster, ta note est ${starsHtml(onCaptain)}. Envoie la nouvelle pour les aligner.</p>`);
    }
    if (this.status) {
      // Already announced by the live regions: no role here, or it would be read twice.
      lines.push(`<p class="cn__note cn__status cn__note--${this.status.tone}"></p>`);
    }
    summary.innerHTML = lines.join('');
    const statusEl = summary.querySelector<HTMLElement>('.cn__status');
    if (this.status && statusEl) statusEl.textContent = this.status.text; // textContent: never inject HTML

    const upToDate = value !== null && onCaptain === value;
    const reason = !this.page.widget
      ? 'Connecte-toi à Captain Coaster pour envoyer ta note. Tes critères sont déjà enregistrés.'
      : this.page.readonly
        ? 'Captain Coaster ne permet pas de noter ce coaster.'
        : null;
    const canSend = value !== null && !this.busy && !reason && !upToDate;
    button.setAttribute('aria-disabled', String(!canSend));
    button.innerHTML = this.busy
      ? 'Envoi…'
      : upToDate
        ? 'Déjà à jour sur Captain Coaster'
        : value === null
          ? 'Envoyer'
          : `Envoyer ${starsHtml(value)}`;
    why.hidden = !reason;
    why.textContent = reason ?? '';
  }
}

/** "3,5 ★" on screen, "3,5 étoiles" for a screen reader (which would say "étoile noire"). */
function starsHtml(value: number): string {
  return `${formatValue(value)} <span aria-hidden="true">★</span><span class="cn-sr">étoile${value > 1 ? 's' : ''}</span>`;
}

const PANEL_CSS = `
:host { all: initial; display: block; margin: 16px 0; color-scheme: light dark;
  --cn-ink: var(--color-ink, #18202b); --cn-muted: var(--color-muted, #64748b); --cn-line: var(--color-line, #d5dde6);
  --cn-surface: var(--color-surface, #fff); --cn-subtle: var(--color-subtle, #eef2f6);
  --cn-accent: var(--color-action, #1d4ed8); --cn-on-accent: var(--color-on-action, #fff);
  --cn-star: var(--color-highlight, #f5b82e); --cn-star-off: var(--color-subtle, #e3e9ef);
  /* Outline at 3:1 or more, so empty stars stay visible (WCAG 1.4.11). */
  --cn-star-stroke: var(--cn-muted);
  --cn-warn: var(--color-warning, #92400e); --cn-warn-bg: var(--color-warning-bg, #fff8e6);
  --cn-ok: var(--color-success, #15803d); --cn-ok-bg: var(--color-success-bg, #ecfdf3);
  --cn-danger: var(--color-danger, #dc4c3f); --cn-danger-bg: var(--color-danger-bg, #fdf0ee);
  font-family: var(--font-sans, system-ui, sans-serif); font-size: 15px; line-height: 1.45; color: var(--cn-ink); }
.cn { text-align: left; }
.cn__eyebrow { margin: 0; font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--cn-muted); }
.cn__title { margin: 2px 0 10px; font-family: var(--font-display, inherit); font-size: 22px; font-weight: 600; line-height: 1.1; }
.cn__list { list-style: none; margin: 0; padding: 0; }
.cn__row { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 7px 0; border-top: 1px solid var(--cn-line); flex-wrap: wrap; }
.cn__name { font-weight: 600; display: inline-flex; align-items: center; gap: 6px; }
.cn__weight { font-size: 11px; font-weight: 700; color: var(--cn-muted); background: var(--cn-subtle); padding: 1px 7px; }
.cn__empty, .cn__hint { color: var(--cn-muted); font-size: 13px; margin: 8px 0 0; }
.cn__summary { border-top: 1px solid var(--cn-line); padding-top: 12px; margin-top: 2px; }
.cn__result { display: flex; align-items: center; gap: 14px; }
.cn__avg { margin: 0; display: flex; align-items: baseline; gap: 2px; }
.cn__big { font-family: var(--font-display, inherit); font-size: 40px; font-weight: 700; line-height: 1; font-variant-numeric: tabular-nums; }
.cn__unit { color: var(--cn-muted); font-weight: 600; }
.cn__detail { margin: 0; font-size: 13px; color: var(--cn-muted); }
.cn__note { margin: 10px 0 0; font-size: 13px; padding: 8px 10px; }
.cn__note--warn { color: var(--cn-warn); background: var(--cn-warn-bg); }
.cn__note--ok { color: var(--cn-ok); background: var(--cn-ok-bg); }
.cn__note--error { color: var(--cn-danger); background: var(--cn-danger-bg); }
.cn__note--info { color: var(--cn-muted); background: var(--cn-subtle); }
.cn__send { margin-top: 12px; width: 100%; font: inherit; font-weight: 700; padding: 10px 14px;
  border: 1px solid var(--cn-accent); background: var(--cn-accent); color: var(--cn-on-accent); cursor: pointer; }
.cn__send[aria-disabled="true"] { background: transparent; color: var(--cn-muted); border-color: var(--cn-line); cursor: default; }
.cn__send:focus-visible, .cn__settings:focus-visible { outline: 2px solid var(--cn-accent); outline-offset: 2px; }
.cn__settings { margin-top: 10px; font: inherit; font-size: 13px; color: var(--cn-accent); background: none; border: 0; padding: 0; cursor: pointer; text-decoration: underline; text-underline-offset: 2px; }
.cn-sr { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; border: 0; overflow: hidden;
  clip-path: inset(50%); white-space: nowrap; }
@media (forced-colors: active) {
  .cn__send { border-color: ButtonText; }
  .cn__send[aria-disabled="true"] { color: GrayText; border-color: GrayText; }
  .cn__note { border: 1px solid CanvasText; }
}
`;
