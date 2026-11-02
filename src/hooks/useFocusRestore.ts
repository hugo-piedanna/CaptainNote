import { useCallback, useLayoutEffect, useRef, type DependencyList, type RefObject } from 'react';
import { restoreFocus } from '@/lib/focus';

/**
 * Keeps keyboard focus inside a list that re-renders (row moved, deleted…).
 * Attach `containerRef` and `onFocusCapture` to the list; controls carry a `data-focus-key`.
 * Focus is only moved when it was lost (the focused control left the DOM or got disabled).
 */
export function useFocusRestore<C extends HTMLElement>(fallbackRef: RefObject<HTMLElement | null>, deps: DependencyList) {
  const containerRef = useRef<C>(null);
  const keyRef = useRef<string | undefined>(undefined);

  const onFocusCapture = useCallback(() => {
    const active = document.activeElement as HTMLElement | null;
    if (active && containerRef.current?.contains(active) && active.dataset.focusKey) {
      keyRef.current = active.dataset.focusKey;
    }
  }, []);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const lost = !document.activeElement || document.activeElement === document.body;
    if (container && keyRef.current && fallbackRef.current && lost) {
      restoreFocus(container, keyRef.current, fallbackRef.current);
    }
  }, deps);

  return { containerRef, onFocusCapture };
}
