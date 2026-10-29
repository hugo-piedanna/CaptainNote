import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { t } from '@/lib/i18n';
import {
  defaultCriteria,
  newCriterionId,
  type CoasterRating,
  type Criterion,
} from '@/lib/rating';
import { restoreFocus } from '@/lib/focus';
import {
  criteriaItem,
  deleteRating,
  exportBackup,
  getCriteria,
  importBackup,
  parseBackup,
  ratingsItem,
} from '@/lib/store';
import { useAnnouncer } from '@/hooks/useAnnouncer';

export function useOptionsPage() {
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [ratings, setRatings] = useState<Record<string, CoasterRating>>({});
  const [search, setSearch] = useState('');
  const [newName, setNewName] = useState('');
  const [importReplace, setImportReplace] = useState(false);
  const [backupStatus, setBackupStatus] = useState('');

  const criteriaListRef = useRef<HTMLOListElement>(null);
  const ratingsBodyRef = useRef<HTMLTableSectionElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const newNameRef = useRef<HTMLInputElement>(null);
  const focusKeyRef = useRef<string | undefined>(undefined);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const { regionRef, announce } = useAnnouncer();

  const captureFocusKey = (container: HTMLElement | null) => {
    const active = document.activeElement as HTMLElement | null;
    if (active && container?.contains(active) && active.dataset.focusKey) {
      focusKeyRef.current = active.dataset.focusKey;
    }
  };

  useEffect(() => {
    void (async () => {
      setCriteria(await getCriteria());
      setRatings(await ratingsItem.getValue());
    })();
    const unwatchCriteria = criteriaItem.watch((next) => {
      setCriteria(next ?? defaultCriteria());
    });
    const unwatchRatings = ratingsItem.watch((next) => {
      setRatings(next ?? {});
    });
    return () => {
      unwatchCriteria();
      unwatchRatings();
    };
  }, []);

  useLayoutEffect(() => {
    if (criteriaListRef.current && focusKeyRef.current) {
      restoreFocus(criteriaListRef.current, focusKeyRef.current, newNameRef.current!);
    }
  }, [criteria]);

  useLayoutEffect(() => {
    if (ratingsBodyRef.current && focusKeyRef.current) {
      restoreFocus(ratingsBodyRef.current, focusKeyRef.current, searchRef.current!);
    }
  }, [ratings, search]);

  const saveCriteria = async (next: Criterion[]) => {
    captureFocusKey(criteriaListRef.current);
    setCriteria(next);
    await criteriaItem.setValue(next);
  };

  const allRatings = Object.values(ratings).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const query = search.trim().toLowerCase();
  const shown = allRatings.filter((r) => !query || `${r.name} ${r.park}`.toLowerCase().includes(query));

  const onSearchInput = (value: string) => {
    setSearch(value);
    clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      const q = value.trim().toLowerCase();
      const count = Object.values(ratings).filter(
        (r) => !q || `${r.name} ${r.park}`.toLowerCase().includes(q),
      ).length;
      announce(count ? t.shownCount(count) : t.noMatchShort);
    }, 600);
  };

  const backupStatusMsg = (text: string) => {
    setBackupStatus('');
    requestAnimationFrame(() => setBackupStatus(text));
  };

  const resetDefaultCriteria = () => {
    if (confirm(t.confirmReset)) {
      void saveCriteria(defaultCriteria()).then(() => announce(t.resetDone));
    }
  };

  const addCriterion = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    void saveCriteria([
      ...criteria,
      { id: newCriterionId(name, criteria), name, weight: 1, enabled: true },
    ]).then(() => announce(t.criterionAdded(name, criteria.length + 1)));
    setNewName('');
    newNameRef.current?.focus();
  };

  const exportJson = async () => {
    const backup = await exportBackup();
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `captain-note-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
    backupStatusMsg(t.exported(Object.keys(backup.ratings).length));
  };

  const importJson = async (file: File) => {
    try {
      const backup = parseBackup(JSON.parse(await file.text()));
      if (importReplace && !confirm(t.confirmReplace)) return;
      await importBackup(backup, importReplace ? 'replace' : 'merge');
      backupStatusMsg(t.imported(Object.keys(backup.ratings).length));
    } catch (error) {
      backupStatusMsg(error instanceof SyntaxError ? t.errInvalidJson : (error as Error).message);
    }
  };

  return {
    regionRef,
    announce,
    criteria,
    saveCriteria,
    criteriaListRef,
    captureFocusKey,
    newName,
    setNewName,
    newNameRef,
    addCriterion,
    resetDefaultCriteria,
    allRatings,
    shown,
    search,
    onSearchInput,
    searchRef,
    ratingsBodyRef,
    deleteRating,
    importReplace,
    setImportReplace,
    backupStatus,
    exportJson,
    importJson,
  };
}
