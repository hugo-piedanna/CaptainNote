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
  weights: ['Normal', 'Important', 'Essential'],

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
  optEyebrow: 'Extension settings',
  optLede:
    'Pick what matters to you in a coaster and rate each criterion. Compute your average from your own criteria, and simply send that calculated average.',
  optNavLabel: 'Settings sections',
  optNavCriteria: 'Criteria',
  optNavRatings: 'Ratings',
  optNavBackup: 'Backup',
  optStatRatings: (n: number) => `detailed rating${s(n)}`,
  optStatSynced: (_n: number) => 'up to date on Captain Coaster',
  optStatPending: (_n: number) => 'waiting to be sent',
  optStatCriteria: (n: number, total: number) => `active criteri${n === 1 ? 'on' : 'a'} out of ${total}`,
  optCancel: 'Cancel',
  optDelete: 'Delete',

  optCriteriaTitle: 'Your criteria',
  optCriteriaIntro:
    'Pick the criteria that matter to you. Adjust the weight of each one to match its importance.',
  optCriteriaEmpty: 'No criteria yet. Add one below or go back to the default criteria.',
  optResetCriteria: 'Default criteria',
  optNewCriterionLabel: 'Add a criterion',
  optNewCriterionPlaceholder: 'E.g. First drop, Airtime, Inversions…',
  optAdd: 'Add',
  optConfirmResetTitle: 'Go back to the default criteria?',
  optConfirmResetBody:
    'Your custom criteria will be removed and weights set back to Normal. Scores already given stay stored.',
  optConfirmResetAction: 'Restore',
  optConfirmDeleteCriterionTitle: (name: string) => `Delete “${name}”?`,
  optConfirmDeleteCriterionBody:
    'Scores already given on this criterion stay stored, but will no longer count in your averages.',

  optRatingsTitle: 'Your ratings',
  optRatingsIntro:
    'Find all your ratings and their status. Don’t forget to send them to Captain Coaster so they count.',
  optSearchLabel: 'Search for a coaster',
  optSearchPlaceholder: 'Coaster or park…',
  optSortLabel: 'Sort by',
  optSortRecent: 'Most recent',
  optSortName: 'Name (A → Z)',
  optSortAverage: 'Highest average',
  optColCoaster: 'Coaster',
  optColAverage: 'Your average',
  optColOnCaptain: 'On Captain Coaster',
  optColModified: 'Modified',
  optColActions: 'Actions',
  optStatusSynced: 'Up to date',
  optStatusSyncedHint: 'Your average matches the rating saved on Captain Coaster.',
  optStatusResend: 'To resend',
  optStatusResendHint: 'Your average changed since the last send. Open the coaster page to send it again.',
  optStatusUnsent: 'Not sent',
  optStatusUnsentHint: 'This average was never sent. Open the coaster page to send it.',
  optStatusNone: 'No average',
  optStatusNoneHint: 'No active criterion is scored for this coaster.',
  optRatingsEmptyTitle: 'No detailed ratings yet',
  optRatingsEmpty:
    'Open a coaster page on Captain Coaster: the “Your detailed rating” panel is waiting right below the stars.',
  optConfirmDeleteRatingTitle: (name: string) => `Delete your rating of ${name}?`,
  optConfirmDeleteRatingBody:
    'Only your detailed rating is erased. The rating saved on Captain Coaster does not change.',

  optBackupTitle: 'Backup',
  optBackupIntro:
    'Your ratings only live in this browser. Export them from time to time so you never lose them, or to move them to another computer.',
  optExport: 'Download backup',
  optImportModeLegend: 'What should happen with the file’s content?',
  optModeMerge: 'Merge',
  optModeMergeHelp: 'Adds missing criteria and keeps, for each coaster, the most recent rating.',
  optModeReplace: 'Replace everything',
  optModeReplaceHelp: 'Erases your current criteria and ratings in favour of those in the file.',
  optImport: 'Choose a file…',
  optConfirmReplaceTitle: 'Replace everything?',
  optConfirmReplaceBody: (n: number) =>
    `Your criteria and ${
      n === 0 ? 'ratings' : n === 1 ? 'your detailed rating' : `your ${n} detailed ratings`
    } will be replaced by the file’s content. Export first if you want to keep a copy.`,
  optConfirmReplaceAction: 'Replace',
  optFooter: 'Captain Note is an independent project, not affiliated with Captain Coaster. No data is collected.',
  optFooterMadeBy: 'Made by',
  optFooterSource: 'Source code',
  enableCriterion: (name: string) => `Enable ${name}`,
  criterionName: (position: number) => `Name of criterion ${position}`,
  weightOf: (name: string) => `Weight of ${name}`,
  moveUp: (name: string) => `Move ${name} up`,
  moveDown: (name: string) => `Move ${name} down`,
  moved: (name: string, position: number, total: number) => `${name} moved to position ${position} of ${total}.`,
  deleteCriterion: (name: string) => `Delete ${name}`,
  criterionDeleted: (name: string) => `Criterion ${name} deleted.`,
  criterionAdded: (name: string, position: number) => `Criterion ${name} added at position ${position}.`,
  resetDone: 'Default criteria restored.',
  noMatch: (query: string) => `No coaster matches “${query}”.`,
  noMatchShort: 'No coaster matches.',
  shownCount: (n: number) => `${n} coaster${s(n)} shown.`,
  newTab: ' (new tab)',
  noAverage: 'None',
  deleteRating: (name: string) => `Delete the rating of ${name}`,
  ratingDeleted: (name: string) => `Rating of ${name} deleted.`,
};
