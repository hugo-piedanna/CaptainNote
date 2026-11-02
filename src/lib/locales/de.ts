import type { Messages } from './fr';

const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);

export const de: Messages = {
  // ---------- Default criteria and weights ----------
  criteria: {
    layout: 'Layout und Rhythmus',
    confort: 'Komfort und Laufruhe',
    rejouabilite: 'Lust auf eine weitere Fahrt',
    theming: 'Thematisierung',
    longueur: 'Fahrtlänge',
    attente: 'Warteschlange',
    gestion: 'Parkbetrieb',
  },
  weights: ['Normal', 'Wichtig', 'Essenziell'],

  // ---------- Star input ----------
  notApplicable: 'Trifft nicht zu',
  notApplicableHere: 'Trifft auf diesen Coaster nicht zu',
  clearLabel: (label: string) => `${label}: trifft auf diesen Coaster nicht zu`,
  scoreText: (value: string, n: number) => `${value} ${plural(n, 'Stern', 'Sterne')} von 5`,
  starWord: (n: number) => plural(n, 'Stern', 'Sterne'),

  // ---------- Coaster panel ----------
  panelTitle: 'Deine detaillierte Bewertung',
  keyboardHelp:
    'Für jedes Kriterium: Pfeiltasten links und rechts für einen halben Stern, Ziffern 1 bis 5, Entf, wenn das Kriterium nicht zutrifft.',
  criteriaListLabel: 'Kriterien',
  manageCriteria: 'Meine Kriterien verwalten',
  opensNewTab: ' (öffnet einen neuen Tab)',
  noActiveCriteria: 'Kein aktives Kriterium. Füge welche in den Einstellungen hinzu.',
  countsTimes: (n: number) => `Zählt ${n}-fach im Durchschnitt`,
  countsTimesSpoken: (n: number) => `, zählt ${n}-fach`,
  noAverageYet: 'Noch kein Durchschnitt.',
  averageAnnounce: (score: string) => `Durchschnitt: ${score}.`,
  sending: 'Wird an Captain Coaster gesendet…',
  sendingShort: 'Senden…',
  sentOk: (value: string) => `Bewertung von ${value} von 5 auf Captain Coaster gespeichert.`,
  rateOneHint: 'Bewerte mindestens ein Kriterium, um deinen Durchschnitt zu erhalten.',
  yourAverage: (score: string) => `Dein Durchschnitt: ${score}`,
  averageDetail: (raw: string, counted: number, active: number) =>
    `Durchschnitt ${raw} aus ${counted} ${plural(counted, 'Kriterium', 'Kriterien')}${
      counted < active ? ` (von ${active})` : ''
    }, für Captain Coaster auf den halben Punkt abgerundet.`,
  captainDiffers: 'Auf Captain Coaster ist deine Bewertung {stars}. Sende die neue, um sie abzugleichen.',
  loginToSendSaved: 'Melde dich bei Captain Coaster an, um deine Bewertung zu senden. Deine Kriterien sind bereits gespeichert.',
  upToDate: 'Auf Captain Coaster bereits aktuell',
  send: 'Senden',
  sendStars: '{stars} senden',

  // ---------- Errors from Captain Coaster ----------
  errLogin: 'Melde dich bei Captain Coaster an, um deine Bewertung zu senden.',
  errNotRateable: 'Captain Coaster erlaubt keine Bewertung dieses Coasters.',
  errRefused: 'Captain Coaster hat die Bewertung abgelehnt. Versuche es später erneut.',
  errToken: 'Sicherheitstoken nicht gefunden. Lade die Seite neu.',
  errStatus: (status: number) => `Captain Coaster hat mit ${status} geantwortet. Lade die Seite neu und versuche es erneut.`,
  errOffline: 'Keine Verbindung zu Captain Coaster.',

  // ---------- Backup ----------
  errUnreadable: 'Datei nicht lesbar.',
  errNotBackup: 'Diese Datei ist keine Captain-Note-Sicherung.',
  errIncomplete: 'Unvollständige Sicherung.',
  errInvalidJson: 'Ungültige JSON-Datei.',
  exported: (n: number) => `${n} ${plural(n, 'Bewertung', 'Bewertungen')} exportiert.`,
  imported: (n: number) => `${n} ${plural(n, 'Bewertung', 'Bewertungen')} importiert.`,
  optEyebrow: 'Einstellungen der Erweiterung',
  optLede:
    'Wähle, worauf es dir bei einem Coaster ankommt, und bewerte jedes Kriterium. Berechne deinen Durchschnitt nach deinen Kriterien und sende einfach deinen berechneten Durchschnitt.',
  optNavLabel: 'Bereiche der Einstellungen',
  optNavCriteria: 'Kriterien',
  optNavRatings: 'Bewertungen',
  optNavBackup: 'Sicherung',
  optStatRatings: (n: number) => plural(n, 'detaillierte Bewertung', 'detaillierte Bewertungen'),
  optStatSynced: (_n: number) => 'aktuell auf Captain Coaster',
  optStatPending: (n: number) => plural(n, 'wartet auf Versand', 'warten auf Versand'),
  optStatCriteria: (n: number, total: number) =>
    `${plural(n, 'aktives Kriterium', 'aktive Kriterien')} von ${total}`,
  optCancel: 'Abbrechen',
  optDelete: 'Löschen',

  optCriteriaTitle: 'Deine Kriterien',
  optCriteriaIntro:
    'Wähle die Kriterien, die dir wichtig sind. Passe die Gewichtung jedes Kriteriums an seine Bedeutung an.',
  optCriteriaEmpty: 'Noch keine Kriterien. Füge unten eines hinzu oder kehre zu den Standardkriterien zurück.',
  optResetCriteria: 'Standardkriterien',
  optNewCriterionLabel: 'Kriterium hinzufügen',
  optNewCriterionPlaceholder: 'z. B. Erster Drop, Airtime, Inversionen…',
  optAdd: 'Hinzufügen',
  optConfirmResetTitle: 'Zu den Standardkriterien zurückkehren?',
  optConfirmResetBody:
    'Deine eigenen Kriterien werden entfernt und die Gewichtungen auf Normal zurückgesetzt. Bereits vergebene Bewertungen bleiben gespeichert.',
  optConfirmResetAction: 'Wiederherstellen',
  optConfirmDeleteCriterionTitle: (name: string) => `„${name}“ löschen?`,
  optConfirmDeleteCriterionBody:
    'Bereits vergebene Bewertungen für dieses Kriterium bleiben gespeichert, zählen aber nicht mehr in deinen Durchschnitten.',

  optRatingsTitle: 'Deine Bewertungen',
  optRatingsIntro:
    'Hier findest du alle deine Bewertungen und ihren Status. Vergiss nicht, sie an Captain Coaster zu senden, damit sie zählen.',
  optSearchLabel: 'Coaster suchen',
  optSearchPlaceholder: 'Coaster oder Park…',
  optSortLabel: 'Sortieren nach',
  optSortRecent: 'Neueste zuerst',
  optSortName: 'Name (A → Z)',
  optSortAverage: 'Höchster Durchschnitt',
  optPagerLabel: 'Seiten der Bewertungen',
  optPagePrev: 'Vorherige Seite',
  optPageNext: 'Nächste Seite',
  optPageRange: (from: number, to: number, total: number) => `${from}–${to} von ${total}`,
  optPageOf: (page: number, count: number) => `Seite ${page} von ${count}`,
  optColCoaster: 'Coaster',
  optColAverage: 'Dein Durchschnitt',
  optColOnCaptain: 'Auf Captain Coaster',
  optColModified: 'Geändert',
  optColActions: 'Aktionen',
  optStatusSynced: 'Aktuell',
  optStatusSyncedHint: 'Dein Durchschnitt entspricht der auf Captain Coaster gespeicherten Bewertung.',
  optStatusResend: 'Erneut senden',
  optStatusResendHint:
    'Dein Durchschnitt hat sich seit dem letzten Senden geändert. Öffne die Seite des Coasters, um ihn erneut zu senden.',
  optStatusUnsent: 'Nicht gesendet',
  optStatusUnsentHint: 'Dieser Durchschnitt wurde nie gesendet. Öffne die Seite des Coasters, um ihn zu senden.',
  optStatusNone: 'Kein Durchschnitt',
  optStatusNoneHint: 'Für diesen Coaster ist kein aktives Kriterium bewertet.',
  optRatingsEmptyTitle: 'Noch keine detaillierten Bewertungen',
  optRatingsEmpty:
    'Öffne die Seite eines Coasters auf Captain Coaster: Das Panel „Deine detaillierte Bewertung“ wartet direkt unter den Sternen.',
  optConfirmDeleteRatingTitle: (name: string) => `Deine Bewertung von ${name} löschen?`,
  optConfirmDeleteRatingBody:
    'Nur deine detaillierte Bewertung wird gelöscht. Die auf Captain Coaster gespeicherte Bewertung bleibt unverändert.',

  optBackupTitle: 'Sicherung',
  optBackupIntro:
    'Deine Bewertungen existieren nur in diesem Browser. Exportiere sie ab und zu, damit nichts verloren geht, oder um sie auf einen anderen Computer zu übertragen.',
  optExport: 'Sicherung herunterladen',
  optImportModeLegend: 'Was soll mit dem Inhalt der Datei passieren?',
  optModeMerge: 'Zusammenführen',
  optModeMergeHelp: 'Fügt fehlende Kriterien hinzu und behält für jeden Coaster die neueste Bewertung.',
  optModeReplace: 'Alles ersetzen',
  optModeReplaceHelp: 'Löscht deine aktuellen Kriterien und Bewertungen zugunsten derer aus der Datei.',
  optImport: 'Datei auswählen…',
  optConfirmReplaceTitle: 'Alles ersetzen?',
  optConfirmReplaceBody: (n: number) =>
    `Deine Kriterien und ${
      n === 0 ? 'Bewertungen' : n === 1 ? 'deine detaillierte Bewertung' : `deine ${n} detaillierten Bewertungen`
    } werden durch den Inhalt der Datei ersetzt. Exportiere vorher, wenn du eine Kopie behalten willst.`,
  optConfirmReplaceAction: 'Ersetzen',
  optFooter: 'Captain Note ist ein unabhängiges Projekt ohne Verbindung zu Captain Coaster. Es werden keine Daten erhoben.',
  optFooterMadeBy: 'Erstellt von',
  optFooterSource: 'Quellcode',
  enableCriterion: (name: string) => `${name} aktivieren`,
  criterionName: (position: number) => `Name von Kriterium ${position}`,
  weightOf: (name: string) => `Gewichtung von ${name}`,
  moveUp: (name: string) => `${name} nach oben`,
  moveDown: (name: string) => `${name} nach unten`,
  moved: (name: string, position: number, total: number) => `${name} auf Position ${position} von ${total} verschoben.`,
  deleteCriterion: (name: string) => `${name} löschen`,
  criterionDeleted: (name: string) => `Kriterium ${name} gelöscht.`,
  criterionAdded: (name: string, position: number) => `Kriterium ${name} auf Position ${position} hinzugefügt.`,
  resetDone: 'Standardkriterien wiederhergestellt.',
  noMatch: (query: string) => `Kein Coaster passt zu „${query}“.`,
  noMatchShort: 'Kein Coaster passt.',
  shownCount: (n: number) => `${n} Coaster angezeigt.`,
  newTab: ' (neuer Tab)',
  noAverage: 'Keine',
  deleteRating: (name: string) => `Bewertung von ${name} löschen`,
  ratingDeleted: (name: string) => `Bewertung von ${name} gelöscht.`,
};
