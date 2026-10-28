/** Restore keyboard focus after a list re-render (same `data-focus-key` or neighbour row). */
export function restoreFocus(container: HTMLElement, focusKey: string | undefined, fallback: HTMLElement): void {
  if (!focusKey) return;
  const control = focusKey.slice(focusKey.lastIndexOf(':'));
  const sameControl = () => [...container.querySelectorAll<HTMLElement>(`[data-focus-key$="${control}"]`)];
  const index = sameControl().findIndex((el) => el.dataset.focusKey === focusKey);

  const same = container.querySelector<HTMLElement>(`[data-focus-key="${CSS.escape(focusKey)}"]`);
  if (same) {
    if (!same.matches(':disabled')) {
      same.focus();
      return;
    }
    same.closest('li, tr')?.querySelector<HTMLElement>('button:not(:disabled)')?.focus();
    return;
  }
  const others = sameControl();
  (others[Math.min(Math.max(index, 0), others.length - 1)] ?? fallback).focus();
}
