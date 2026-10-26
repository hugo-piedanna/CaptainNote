// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import type { Score } from '../lib/rating';
import { createStarInput, scoreText } from '../lib/stars';

function mount(value: Score = null) {
  const changes: Score[] = [];
  const wrap = createStarInput({ label: 'Airtimes', value, onChange: (v) => changes.push(v) });
  document.body.replaceChildren(wrap);
  const slider = wrap.querySelector<HTMLElement>('[role="slider"]')!;
  const clear = wrap.querySelector<HTMLButtonElement>('button')!;
  const press = (key: string) => slider.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
  return { slider, clear, press, changes };
}

describe('scoreText', () => {
  it('reads French numbers and plurals', () => {
    expect(scoreText(3.5)).toBe('3,5 étoiles sur 5');
    expect(scoreText(1)).toBe('1 étoile sur 5');
    expect(scoreText(0.5)).toBe('0,5 étoile sur 5');
    expect(scoreText(null)).toBe('Ne s’applique pas');
  });
});

describe('createStarInput', () => {
  it('is a focusable slider whose value stays within its range', () => {
    const { slider, clear } = mount(null);
    expect(slider.tabIndex).toBe(0);
    expect(slider.getAttribute('aria-label')).toBe('Airtimes');
    expect(slider.getAttribute('aria-valuemin')).toBe('0');
    expect(slider.getAttribute('aria-valuemax')).toBe('5');
    expect(slider.getAttribute('aria-valuenow')).toBe('0');
    expect(slider.getAttribute('aria-valuetext')).toBe('Ne s’applique pas');
    expect(clear.getAttribute('aria-pressed')).toBe('true');
    expect(clear.getAttribute('aria-label')).toBe('Airtimes : ne s’applique pas à ce coaster');
  });

  it('moves by half stars with the arrows and by one with Page keys', () => {
    const { slider, press, changes } = mount(null);
    press('ArrowRight');
    press('ArrowUp');
    press('PageUp');
    expect(changes).toEqual([0.5, 1, 2]);
    expect(slider.getAttribute('aria-valuetext')).toBe('2 étoiles sur 5');
    press('ArrowLeft');
    press('PageDown');
    expect(changes.slice(-2)).toEqual([1.5, 0.5]);
  });

  it('jumps with digits, Home and End, and stays within bounds', () => {
    const { press, changes } = mount(3);
    press('5');
    press('ArrowRight');
    press('Home');
    press('End');
    press('2');
    expect(changes).toEqual([5, 0.5, 5, 2]);
  });

  it('clears with Delete, 0 or below the minimum', () => {
    const { clear, press, changes } = mount(0.5);
    press('ArrowLeft');
    expect(changes).toEqual([null]);
    expect(clear.getAttribute('aria-pressed')).toBe('true');
    press('4');
    press('Delete');
    press('3');
    press('0');
    expect(changes).toEqual([null, 4, null, 3, null]);
  });

  it('ignores keys with a modifier, so browser shortcuts still work', () => {
    const { slider, changes } = mount(3);
    slider.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', altKey: true, bubbles: true }));
    expect(changes).toEqual([]);
  });

  it('toggles "does not apply" and brings the previous score back', () => {
    const { slider, clear, changes } = mount(4);
    expect(clear.getAttribute('aria-pressed')).toBe('false');
    clear.click();
    expect(clear.getAttribute('aria-pressed')).toBe('true');
    clear.click();
    expect(changes).toEqual([null, 4]);
    expect(slider.getAttribute('aria-valuenow')).toBe('4');
  });

  it('sends the focus to the stars when there is no score to bring back', () => {
    const { slider, clear, changes } = mount(null);
    clear.click();
    expect(changes).toEqual([]);
    expect(document.activeElement).toBe(slider);
  });

  it('hides the decorative SVGs from assistive technologies', () => {
    const { slider, clear } = mount(2);
    for (const svg of [...slider.querySelectorAll('svg'), clear.querySelector('svg')!]) {
      expect(svg.getAttribute('aria-hidden')).toBe('true');
    }
  });
});
