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
      <h2 id="backup-title">Sauvegarde</h2>
      <p className="help">
        Tes notes ne quittent pas ce navigateur. Exporte-les de temps en temps, ou pour les passer sur un autre
        ordinateur.
      </p>
      <div className="row">
        <button type="button" className="btn" onClick={() => void exportJson()}>
          Exporter (.json)
        </button>
        <label className="btn btn--ghost" htmlFor="import">
          Importer…
        </label>
        <label className="check">
          <input type="checkbox" checked={importReplace} onChange={(e) => setImportReplace(e.target.checked)} /> Remplacer
          au lieu de fusionner
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
