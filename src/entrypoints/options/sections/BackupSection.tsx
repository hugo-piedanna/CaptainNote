import { t } from '@/lib/i18n';
import { Icon } from '@/entrypoints/options/components/Icon';
import { Section } from '@/entrypoints/options/components/Section';
import { useBackup, type ImportMode } from '@/entrypoints/options/hooks/useBackup';

export function BackupSection({ ratingsCount }: { ratingsCount: number }) {
  const backup = useBackup(ratingsCount);
  const modes: { mode: ImportMode; label: string; help: string }[] = [
    { mode: 'merge', label: t.optModeMerge, help: t.optModeMergeHelp },
    { mode: 'replace', label: t.optModeReplace, help: t.optModeReplaceHelp },
  ];

  return (
    <Section
      id="backup"
      title={t.optBackupTitle}
      intro={<p>{t.optBackupIntro}</p>}
      actions={
        <>
          <button
            type="button"
            className="btn btn--quiet"
            onClick={() => void backup.exportJson()}>
            <Icon name="download" />
            {t.optExport}
          </button>
          <input
            id="import-file"
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = '';
              if (file) await backup.importJson(file);
            }}
          />
          {/* The file input is visually hidden: this label, styled as a button, shows its focus. */}
          <label
            htmlFor="import-file"
            className="btn btn--quiet">
            <Icon name="upload" />
            {t.optImport}
          </label>
        </>
      }>
      <fieldset className="modes">
        <legend>{t.optImportModeLegend}</legend>
        {modes.map(({ mode, label, help }) => (
          <label
            key={mode}
            className="mode">
            <input
              type="radio"
              name="import-mode"
              value={mode}
              checked={backup.mode === mode}
              onChange={() => backup.setMode(mode)}
            />
            <span>
              <span className="mode__label">{label}</span> <span className="mode__help">{help}</span>
            </span>
          </label>
        ))}
      </fieldset>
      <p
        className={'status' + (backup.status?.error ? ' status--error' : '')}
        role="status">
        {backup.status?.text}
      </p>
    </Section>
  );
}
