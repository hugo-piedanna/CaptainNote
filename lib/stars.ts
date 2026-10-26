import { MAX_VALUE, MIN_VALUE, formatValue, type Score } from './rating';

const STAR_PATH =
  'M12 2.8l2.7 6.1 6.6.6-5 4.4 1.5 6.5L12 17l-5.8 3.4 1.5-6.5-5-4.4 6.6-.6z';

let uid = 0;

/** Spoken value of a score, in French: "3,5 étoiles sur 5" rather than "3.5". */
export function scoreText(value: Score): string {
  if (value === null) return 'Ne s’applique pas';
  return `${formatValue(value)} étoile${value > 1 ? 's' : ''} sur 5`;
}

/**
 * Half-star input: click or drag on the stars, arrow keys to adjust, Delete to clear.
 * Exposed as an ARIA slider so it works with a keyboard and a screen reader.
 * The value 0 of the slider stands for "does not apply" (null).
 */
export function createStarInput(options: {
  label: string;
  value: Score;
  onChange: (value: Score) => void;
}): HTMLElement {
  let value = options.value;
  /** Score restored when "does not apply" is switched off again. */
  let lastScore: number | null = value;
  const id = `cn-stars-${++uid}`;

  const wrap = document.createElement('div');
  wrap.className = 'cn-stars';

  const slider = document.createElement('div');
  slider.className = 'cn-stars__track';
  slider.tabIndex = 0;
  slider.setAttribute('role', 'slider');
  slider.setAttribute('aria-label', options.label);
  slider.setAttribute('aria-valuemin', '0');
  slider.setAttribute('aria-valuemax', String(MAX_VALUE));
  slider.setAttribute('aria-orientation', 'horizontal');

  for (let i = 1; i <= 5; i++) {
    const gradient = `${id}-${i}`;
    slider.insertAdjacentHTML(
      'beforeend',
      `<svg class="cn-star" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <defs><linearGradient id="${gradient}">
          <stop offset="0" class="cn-star__on"/><stop offset="0" class="cn-star__on" data-split/>
          <stop offset="0" class="cn-star__off" data-split/><stop offset="1" class="cn-star__off"/>
        </linearGradient></defs>
        <path d="${STAR_PATH}" fill="url(#${gradient})" class="cn-star__shape"/>
      </svg>`,
    );
  }

  const clear = document.createElement('button');
  clear.type = 'button';
  clear.className = 'cn-stars__clear';
  clear.title = 'Ne s’applique pas à ce coaster';
  // The criterion name keeps each button distinct when tabbing through the list.
  clear.setAttribute('aria-label', `${options.label} : ne s’applique pas à ce coaster`);
  clear.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="8.5"/><path d="M6 18L18 6"/>
  </svg>`;

  wrap.append(slider, clear);

  // Only the look follows the pointer while hovering; ARIA states follow the committed value.
  const paint = (shown: Score) => {
    slider.querySelectorAll('svg').forEach((svg, index) => {
      const fill = shown === null ? 0 : Math.min(1, Math.max(0, shown - index));
      svg.querySelectorAll('[data-split]').forEach((stop) => stop.setAttribute('offset', String(fill)));
    });
    wrap.classList.toggle('is-empty', shown === null);
  };

  const sync = () => {
    slider.setAttribute('aria-valuenow', value === null ? '0' : String(value));
    slider.setAttribute('aria-valuetext', scoreText(value));
    clear.setAttribute('aria-pressed', String(value === null));
    paint(value);
  };

  const commit = (next: Score) => {
    if (next === value) return paint(value);
    value = next;
    if (value !== null) lastScore = value;
    sync();
    options.onChange(value);
  };

  const valueAt = (clientX: number): number => {
    const rect = slider.getBoundingClientRect();
    const raw = ((clientX - rect.left) / rect.width) * MAX_VALUE;
    return Math.min(MAX_VALUE, Math.max(MIN_VALUE, Math.ceil(raw * 2) / 2));
  };

  let dragging = false;
  slider.addEventListener('pointerdown', (e) => {
    dragging = true;
    slider.setPointerCapture(e.pointerId);
    paint(valueAt(e.clientX));
  });
  slider.addEventListener('pointermove', (e) => {
    if (dragging || e.pointerType === 'mouse') paint(valueAt(e.clientX));
  });
  slider.addEventListener('pointerup', (e) => {
    if (!dragging) return;
    dragging = false;
    commit(valueAt(e.clientX));
  });
  slider.addEventListener('pointerleave', () => {
    if (!dragging) paint(value);
  });
  slider.addEventListener('pointercancel', () => {
    dragging = false;
    paint(value);
  });
  slider.addEventListener('keydown', (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const current = value ?? 0;
    const steps: Record<string, number> = {
      ArrowRight: current + 0.5,
      ArrowUp: current + 0.5,
      ArrowLeft: current - 0.5,
      ArrowDown: current - 0.5,
      PageUp: current + 1,
      PageDown: current - 1,
      Home: MIN_VALUE,
      End: MAX_VALUE,
      Delete: 0,
      Backspace: 0,
      '0': 0,
      '1': 1,
      '2': 2,
      '3': 3,
      '4': 4,
      '5': 5,
    };
    const next = steps[e.key];
    if (next === undefined) return;
    e.preventDefault();
    commit(next < MIN_VALUE ? null : Math.min(MAX_VALUE, next));
  });

  // Toggle: switching "does not apply" off brings back the previous score.
  clear.addEventListener('click', () => {
    if (value !== null) return commit(null);
    if (lastScore !== null) return commit(lastScore);
    slider.focus();
  });

  sync();
  return wrap;
}

export const STAR_CSS = `
.cn-stars { display: flex; align-items: center; gap: 8px; }
.cn-stars__track { display: flex; gap: 2px; cursor: pointer; touch-action: none; padding: 2px; outline: none; }
.cn-stars__track:focus-visible { outline: 2px solid var(--cn-accent); outline-offset: 1px; }
.cn-star { width: 24px; height: 24px; display: block; }
.cn-star__on { stop-color: var(--cn-star); }
.cn-star__off { stop-color: var(--cn-star-off); }
.cn-star__shape { stroke: var(--cn-star-stroke); stroke-width: 1; stroke-linejoin: round; }
.cn-stars__clear { display: grid; place-items: center; width: 28px; height: 28px; padding: 0; border: none;
  border-radius: 50%; background: none; color: var(--cn-muted); cursor: pointer; }
.cn-stars__clear svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; }
.cn-stars__clear:hover { color: var(--cn-ink); background: var(--cn-subtle); }
.cn-stars__clear:focus-visible { outline: 2px solid var(--cn-accent); outline-offset: 1px; }
.cn-stars__clear[aria-pressed="true"] { color: var(--cn-surface); background: var(--cn-ink); }
@media (prefers-reduced-motion: no-preference) {
  .cn-stars__clear { transition: color .15s, background .15s; }
}
@media (forced-colors: active) {
  .cn-star__on { stop-color: Highlight; }
  .cn-star__off { stop-color: Canvas; }
  .cn-star__shape { stroke: CanvasText; }
  .cn-stars__clear { color: ButtonText; }
  .cn-stars__clear[aria-pressed="true"] { color: HighlightText; background: Highlight; forced-color-adjust: none; }
}
`;
