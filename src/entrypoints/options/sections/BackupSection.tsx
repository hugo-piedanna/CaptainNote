import { t } from '@/lib/i18n';

export function BackupSection({
  importReplace,
  setImportReplace,
  backupStatus,
  exportJson,
  importJson,
}: {
  importReplace: boolean;
  setImportReplace: (value: boolean) => void;
  backupStatus: string;
  exportJson: () => Promise<void>;
  importJson: (file: File) => Promise<void>;
}) {
  return (
    <section aria-labelledby="backup-title">
      <h2 id="backup-title">{t.optBackupTitle}</h2>
      <p className="help">{t.optBackupHelp}</p>
      <div className="row">
        <button type="button" className="btn" onClick={() => void exportJson()}>
          {t.optExport}
        </button>
        <label className="btn btn--ghost" htmlFor="import">
          {t.optImport}
        </label>
        <label className="check">
          <input type="checkbox" checked={importReplace} onChange={(e) => setImportReplace(e.target.checked)} />{' '}
          {t.optReplace}
        </label>
      </div>
      <input
        id="import"
        type="file"
        accept="application/json,.json"
        className="sr-only"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = '';
          if (!file) return;
          await importJson(file);
        }}
      />
      <p className="status" role="status">
        {backupStatus}
      </p>
    </section>
  );
}
