import { useState } from 'react';
import { t } from '@/lib/i18n';
import { exportBackup, importBackup, parseBackup } from '@/lib/store';
import { useConfirm } from '@/entrypoints/options/services';

export type ImportMode = 'merge' | 'replace';

/** JSON export and import (FR-backup-export-import, FR-backup-merge-replace). */
export function useBackup(ratingsCount: number) {
  const confirm = useConfirm();
  const [mode, setMode] = useState<ImportMode>('merge');
  const [status, setStatus] = useState<{ text: string; error: boolean } | null>(null);

  // Cleared first so the same message is announced again by the live region.
  const report = (text: string, error = false) => {
    setStatus(null);
    requestAnimationFrame(() => setStatus({ text, error }));
  };

  const exportJson = async () => {
    const backup = await exportBackup();
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `captain-note-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
    report(t.exported(Object.keys(backup.ratings).length));
  };

  const importJson = async (file: File) => {
    try {
      const backup = parseBackup(JSON.parse(await file.text()));
      if (
        mode === 'replace' &&
        !(await confirm({
          title: t.optConfirmReplaceTitle,
          message: t.optConfirmReplaceBody(ratingsCount),
          confirmLabel: t.optConfirmReplaceAction,
        }))
      ) {
        return;
      }
      await importBackup(backup, mode);
      report(t.imported(Object.keys(backup.ratings).length));
    } catch (error) {
      report(error instanceof SyntaxError ? t.errInvalidJson : (error as Error).message, true);
    }
  };

  return { mode, setMode, status, exportJson, importJson };
}
