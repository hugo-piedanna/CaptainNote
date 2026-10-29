import { useOptionsPage } from '@/hooks/useOptionsPage';
import { t } from '@/lib/i18n';
import { BackupSection } from '@/entrypoints/options/sections/BackupSection';
import { CriteriaSection } from '@/entrypoints/options/sections/CriteriaSection';
import { RatingsSection } from '@/entrypoints/options/sections/RatingsSection';

export function App() {
  const page = useOptionsPage();

  return (
    <>
      <header className="top">
        <div className="wrap">
          <p className="eyebrow">{t.optEyebrow}</p>
          <h1>Captain Note</h1>
          <p className="lede">{t.optLede}</p>
        </div>
      </header>

      <main className="wrap">
        <CriteriaSection
          criteria={page.criteria}
          criteriaListRef={page.criteriaListRef}
          captureFocusKey={page.captureFocusKey}
          saveCriteria={page.saveCriteria}
          newName={page.newName}
          setNewName={page.setNewName}
          newNameRef={page.newNameRef}
          addCriterion={page.addCriterion}
          resetDefaultCriteria={page.resetDefaultCriteria}
          announce={page.announce}
        />
        <RatingsSection
          criteria={page.criteria}
          allRatings={page.allRatings}
          shown={page.shown}
          search={page.search}
          onSearchInput={page.onSearchInput}
          searchRef={page.searchRef}
          ratingsBodyRef={page.ratingsBodyRef}
          captureFocusKey={page.captureFocusKey}
          deleteRating={page.deleteRating}
          announce={page.announce}
        />
        <BackupSection
          importReplace={page.importReplace}
          setImportReplace={page.setImportReplace}
          backupStatus={page.backupStatus}
          exportJson={page.exportJson}
          importJson={page.importJson}
        />
      </main>

      <footer className="wrap foot">
        <p>{t.optFooter}</p>
      </footer>
      <div ref={page.regionRef} className="sr-only" role="status" />
    </>
  );
}
