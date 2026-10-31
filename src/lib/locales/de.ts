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
  weights: ['Ignoriert', 'Normal', 'Wichtig', 'Essenziell'],

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
  confirmReplace: 'Alle deine Bewertungen und Kriterien durch die aus der Datei ersetzen?',

  // ---------- Options page ----------
  optEyebrow: 'Erweiterung für Captain Coaster',
  optLede:
    'Deine Kriterien, deine Gewichtungen, deine Bewertungen. Alles bleibt in diesem Browser; nur der gerundete Durchschnitt geht an Captain Coaster, wenn du auf „Senden“ klickst.',
  optCriteriaTitle: 'Meine Kriterien',
  optResetCriteria: 'Standardkriterien wiederherstellen',
  optCriteriaHelp:
    'Die Gewichtung bestimmt, wie stark ein Kriterium im Durchschnitt zählt. Ein deaktiviertes oder „Ignoriertes“ Kriterium verschwindet aus dem Panel, deine bisherigen Bewertungen bleiben aber erhalten.',
  optNewCriterionLabel: 'Name des neuen Kriteriums',
  optNewCriterionPlaceholder: 'Neues Kriterium, z. B. Erster Drop',
  optAdd: 'Hinzufügen',
  optRatingsTitle: 'Meine Bewertungen',
  optSearchLabel: 'Coaster suchen',
  optSearchPlaceholder: 'Coaster oder Park…',
  optColCoaster: 'Coaster',
  optColAverage: 'Durchschnitt',
  optColOnCaptain: 'Auf Captain Coaster',
  optColModified: 'Geändert',
  optColActions: 'Aktionen',
  optRatingsEmpty:
    'Noch keine Bewertungen. Öffne eine Coaster-Seite auf Captain Coaster: Das Panel „Deine detaillierte Bewertung“ erscheint unter den Sternen.',
  optBackupTitle: 'Sicherung',
  optBackupHelp:
    'Deine Bewertungen verlassen diesen Browser nicht. Exportiere sie ab und zu, oder um sie auf einen anderen Computer zu übertragen.',
  optExport: 'Exportieren (.json)',
  optImport: 'Importieren…',
  optReplace: 'Ersetzen statt zusammenführen',
  optFooter: 'Captain Note ist nicht mit Captain Coaster verbunden. Es werden keine Daten erhoben.',
  enableCriterion: (name: string) => `${name} aktivieren`,
  criterionName: (position: number) => `Name von Kriterium ${position}`,
  weightOf: (name: string) => `Gewichtung von ${name}`,
  moveUp: (name: string) => `${name} nach oben`,
  moveDown: (name: string) => `${name} nach unten`,
  moved: (name: string, position: number, total: number) => `${name} auf Position ${position} von ${total} verschoben.`,
  deleteCriterion: (name: string) => `${name} löschen`,
  confirmDeleteCriterion: (name: string) =>
    `Kriterium „${name}“ löschen? Bereits vergebene Bewertungen für dieses Kriterium zählen dann nicht mehr.`,
  criterionDeleted: (name: string) => `Kriterium ${name} gelöscht.`,
  criterionAdded: (name: string, position: number) => `Kriterium ${name} auf Position ${position} hinzugefügt.`,
  confirmReset:
    'Zu den Standardkriterien zurückkehren? Deine eigenen Kriterien werden entfernt (die Bewertungen bleiben gespeichert).',
  resetDone: 'Standardkriterien wiederhergestellt.',
  noMatch: (query: string) => `Kein Coaster passt zu „${query}“.`,
  noMatchShort: 'Kein Coaster passt.',
  shownCount: (n: number) => `${n} Coaster angezeigt.`,
  newTab: ' (neuer Tab)',
  noAverage: 'Keine',
  notSent: 'Nicht gesendet',
  toResend: 'erneut senden',
  toResendTitle: 'Dein Durchschnitt hat sich seit dem letzten Senden geändert. Öffne die Coaster-Seite, um ihn erneut zu senden.',
  deleteRating: (name: string) => `Bewertung von ${name} löschen`,
  confirmDeleteRating: (name: string) =>
    `Deine detaillierte Bewertung von ${name} löschen? Die Bewertung auf Captain Coaster ändert sich nicht.`,
  ratingDeleted: (name: string) => `Bewertung von ${name} gelöscht.`,
};
