import type { Messages } from './fr';

const s = (n: number) => (n === 1 ? '' : 's');

export const en: Messages = {
  // ---------- Default criteria and weights ----------
  criteria: {
    layout: 'Layout and pacing',
    confort: 'Comfort and smoothness',
    rejouabilite: 'Rerideability',
    theming: 'Theming',
    longueur: 'Ride length',
    attente: 'Queue',
    gestion: 'Park operations',
  },
  weights: ['Ignored', 'Normal', 'Important', 'Essential'],

  // ---------- Star input ----------
  notApplicable: 'Does not apply',
  notApplicableHere: 'Does not apply to this coaster',
  clearLabel: (label: string) => `${label}: does not apply to this coaster`,
  scoreText: (value: string, n: number) => `${value} star${s(n)} out of 5`,
  starWord: (n: number) => `star${s(n)}`,

  // ---------- Coaster panel ----------
  panelTitle: 'Your detailed rating',
  keyboardHelp:
    'For each criterion: left and right arrows to change by half a star, digits 1 to 5, Delete if the criterion does not apply.',
  criteriaListLabel: 'Criteria',
  manageCriteria: 'Manage my criteria',
  opensNewTab: ' (opens a new tab)',
  noActiveCriteria: 'No active criterion. Add some in the settings.',
  countsTimes: (n: number) => `Counts ${n} times in the average`,
  countsTimesSpoken: (n: number) => `, counts ${n} times`,
  noAverageYet: 'No average yet.',
  averageAnnounce: (score: string) => `Average: ${score}.`,
  sending: 'Sending to Captain Coaster…',
  sendingShort: 'Sending…',
  sentOk: (value: string) => `Rating of ${value} out of 5 saved on Captain Coaster.`,
  rateOneHint: 'Rate at least one criterion to get your average.',
  yourAverage: (score: string) => `Your average: ${score}`,
  averageDetail: (raw: string, counted: number, active: number) =>
    `Average ${raw} over ${counted} criteri${counted === 1 ? 'on' : 'a'}${
      counted < active ? ` (out of ${active})` : ''
    }, rounded down to the half point for Captain Coaster.`,
  captainDiffers: 'On Captain Coaster, your rating is {stars}. Send the new one to match them.',
  loginToSendSaved: 'Log in to Captain Coaster to send your rating. Your criteria are already saved.',
  upToDate: 'Already up to date on Captain Coaster',
  send: 'Send',
  sendStars: 'Send {stars}',

  // ---------- Errors from Captain Coaster ----------
  errLogin: 'Log in to Captain Coaster to send your rating.',
  errNotRateable: 'Captain Coaster does not allow rating this coaster.',
  errRefused: 'Captain Coaster refused the rating. Try again later.',
  errToken: 'Security token not found. Reload the page.',
  errStatus: (status: number) => `Captain Coaster answered ${status}. Reload the page and try again.`,
  errOffline: 'No connection to Captain Coaster.',

  // ---------- Backup ----------
  errUnreadable: 'Unreadable file.',
  errNotBackup: 'This file is not a Captain Note backup.',
  errIncomplete: 'Incomplete backup.',
  errInvalidJson: 'Invalid JSON file.',
  exported: (n: number) => `${n} rating${s(n)} exported.`,
  imported: (n: number) => `${n} rating${s(n)} imported.`,
  confirmReplace: 'Replace all your ratings and criteria with those from the file?',

  // ---------- Options page ----------
  optEyebrow: 'Extension for Captain Coaster',
  optLede:
    'Your criteria, your weights, your ratings. Everything stays in this browser; only the rounded average goes to Captain Coaster, when you click “Send”.',
  optCriteriaTitle: 'My criteria',
  optResetCriteria: 'Restore default criteria',
  optCriteriaHelp:
    'The weight sets how much a criterion counts in the average. A disabled or “Ignored” criterion disappears from the panel, but your past scores are kept.',
  optNewCriterionLabel: 'Name of the new criterion',
  optNewCriterionPlaceholder: 'New criterion, e.g. First drop',
  optAdd: 'Add',
  optRatingsTitle: 'My ratings',
  optSearchLabel: 'Search for a coaster',
  optSearchPlaceholder: 'Coaster or park…',
  optColCoaster: 'Coaster',
  optColAverage: 'Average',
  optColOnCaptain: 'On Captain Coaster',
  optColModified: 'Modified',
  optColActions: 'Actions',
  optRatingsEmpty:
    'No ratings yet. Open a coaster page on Captain Coaster: the “Your detailed rating” panel appears below the stars.',
  optBackupTitle: 'Backup',
  optBackupHelp:
    'Your ratings never leave this browser. Export them from time to time, or to move them to another computer.',
  optExport: 'Export (.json)',
  optImport: 'Import…',
  optReplace: 'Replace instead of merging',
  optFooter: 'Captain Note is not affiliated with Captain Coaster. No data is collected.',
  enableCriterion: (name: string) => `Enable ${name}`,
  criterionName: (position: number) => `Name of criterion ${position}`,
  weightOf: (name: string) => `Weight of ${name}`,
  moveUp: (name: string) => `Move ${name} up`,
  moveDown: (name: string) => `Move ${name} down`,
  moved: (name: string, position: number, total: number) => `${name} moved to position ${position} of ${total}.`,
  deleteCriterion: (name: string) => `Delete ${name}`,
  confirmDeleteCriterion: (name: string) =>
    `Delete the criterion “${name}”? Scores already given on this criterion will no longer count.`,
  criterionDeleted: (name: string) => `Criterion ${name} deleted.`,
  criterionAdded: (name: string, position: number) => `Criterion ${name} added at position ${position}.`,
  confirmReset: 'Go back to the default criteria? Your custom criteria will be removed (scores stay stored).',
  resetDone: 'Default criteria restored.',
  noMatch: (query: string) => `No coaster matches “${query}”.`,
  noMatchShort: 'No coaster matches.',
  shownCount: (n: number) => `${n} coaster${s(n)} shown.`,
  newTab: ' (new tab)',
  noAverage: 'None',
  notSent: 'Not sent',
  toResend: 'to resend',
  toResendTitle: 'Your average changed since the last send. Open the coaster page to send it again.',
  deleteRating: (name: string) => `Delete the rating of ${name}`,
  confirmDeleteRating: (name: string) =>
    `Delete your detailed rating of ${name}? The rating on Captain Coaster does not change.`,
  ratingDeleted: (name: string) => `Rating of ${name} deleted.`,
};
