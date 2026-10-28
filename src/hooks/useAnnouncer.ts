import { useCallback, useRef } from 'react';

export function useAnnouncer() {
  const regionRef = useRef<HTMLDivElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);

  const announce = useCallback((text: string, urgent = false) => {
    const region = urgent ? alertRef.current : regionRef.current;
    if (!region) return;
    region.textContent = '';
    requestAnimationFrame(() => {
      region.textContent = text;
    });
  }, []);

  return { regionRef, alertRef, announce };
}
