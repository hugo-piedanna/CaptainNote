import { useCallback, useRef } from 'react';

/** Screen reader announcement via a persistent live region. */
export function useAnnouncer() {
  const regionRef = useRef<HTMLDivElement>(null);

  const announce = useCallback((text: string) => {
    const region = regionRef.current;
    if (!region) return;
    region.textContent = '';
    requestAnimationFrame(() => {
      region.textContent = text;
    });
  }, []);

  return { regionRef, announce };
}
