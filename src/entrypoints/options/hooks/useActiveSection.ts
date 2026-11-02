import { useEffect, useState } from 'react';

/** Id of the section currently in view, to highlight it in the navigation. */
export function useActiveSection(ids: readonly string[]): string {
  const [active, setActive] = useState(ids[0] ?? '');

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const visible = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) visible.set(entry.target.id, entry.isIntersecting);
        // The lowest section in the band wins, so the last one can become current at the bottom of the page.
        const current = ids.findLast((id) => visible.get(id));
        if (current) setActive(current);
      },
      // A section counts as current while it crosses the band just below the sticky navigation.
      { rootMargin: '-80px 0px -55% 0px' },
    );
    for (const id of ids) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
