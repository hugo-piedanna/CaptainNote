import { useOptionsPage } from '@/hooks/useOptionsPage';
import { BackupSection } from '@/entrypoints/options/sections/BackupSection';
import { CriteriaSection } from '@/entrypoints/options/sections/CriteriaSection';
import { RatingsSection } from '@/entrypoints/options/sections/RatingsSection';

export function App() {
  const page = useOptionsPage();

  return (
    <>
      <header className="top">
        <div className="wrap">
          <p className="eyebrow">Extension pour Captain Coaster</p>
          <h1>Captain Note</h1>
          <p className="lede">
            Tes critères, tes poids, tes notes. Tout reste dans ce navigateur ; seule la moyenne arrondie part sur
            Captain Coaster, quand tu cliques sur « Envoyer ».
          </p>
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
        <p>Captain Note n’est pas affilié à Captain Coaster. Aucune donnée n’est collectée.</p>
      </footer>
      <div ref={page.regionRef} className="sr-only" role="status" />
    </>
  );
}
