/**
 * Reference language: every other locale must provide the same keys (`Messages`).
 * `{stars}` marks where the UI inserts a star value (see `withStars`).
 */
const s = (n: number) => (n > 1 ? 's' : '');

export const fr = {
  // ---------- Default criteria and weights ----------
  criteria: {
    intensite: 'Intensité',
    airtimes: 'Airtimes',
    layout: 'Layout et rythme',
    confort: 'Confort et fluidité',
    theming: 'Thématisation',
    rejouabilite: 'Envie de le refaire',
    attente: 'Débit et attente',
  },
  weights: ['Ignoré', 'Normal', 'Important', 'Essentiel'] as [string, string, string, string],

  // ---------- Star input ----------
  notApplicable: 'Ne s’applique pas',
  notApplicableHere: 'Ne s’applique pas à ce coaster',
  clearLabel: (label: string) => `${label} : ne s’applique pas à ce coaster`,
  scoreText: (value: string, n: number) => `${value} étoile${s(n)} sur 5`,
  starWord: (n: number) => `étoile${s(n)}`,

  // ---------- Coaster panel ----------
  panelTitle: 'Ta note détaillée',
  keyboardHelp:
    'Pour chaque critère : flèches gauche et droite pour changer d’une demi-étoile, chiffres de 1 à 5, Suppr si le critère ne s’applique pas.',
  criteriaListLabel: 'Critères',
  manageCriteria: 'Gérer mes critères',
  opensNewTab: ' (ouvre un nouvel onglet)',
  noActiveCriteria: 'Aucun critère actif. Ajoute-en dans les réglages.',
  countsTimes: (n: number) => `Compte ${n} fois dans la moyenne`,
  countsTimesSpoken: (n: number) => `, compte ${n} fois`,
  noAverageYet: 'Pas encore de moyenne.',
  averageAnnounce: (score: string) => `Moyenne : ${score}.`,
  sending: 'Envoi à Captain Coaster…',
  sendingShort: 'Envoi…',
  sentOk: (value: string) => `Note de ${value} sur 5 enregistrée sur Captain Coaster.`,
  rateOneHint: 'Note au moins un critère pour obtenir ta moyenne.',
  yourAverage: (score: string) => `Ta moyenne : ${score}`,
  averageDetail: (raw: string, counted: number, active: number) =>
    `Moyenne ${raw} sur ${counted} critère${s(counted)}${
      counted < active ? ` (sur ${active})` : ''
    }, arrondie au demi-point inférieur pour Captain Coaster.`,
  captainDiffers: 'Sur Captain Coaster, ta note est {stars}. Envoie la nouvelle pour les aligner.',
  loginToSendSaved: 'Connecte-toi à Captain Coaster pour envoyer ta note. Tes critères sont déjà enregistrés.',
  upToDate: 'Déjà à jour sur Captain Coaster',
  send: 'Envoyer',
  sendStars: 'Envoyer {stars}',

  // ---------- Errors from Captain Coaster ----------
  errLogin: 'Connecte-toi à Captain Coaster pour envoyer ta note.',
  errNotRateable: 'Captain Coaster ne permet pas de noter ce coaster.',
  errRefused: 'Captain Coaster a refusé la note. Réessaie plus tard.',
  errToken: 'Jeton de sécurité introuvable. Recharge la page.',
  errStatus: (status: number) => `Captain Coaster a répondu ${status}. Recharge la page et réessaie.`,
  errOffline: 'Pas de connexion à Captain Coaster.',

  // ---------- Backup ----------
  errUnreadable: 'Fichier illisible.',
  errNotBackup: "Ce fichier n'est pas une sauvegarde Captain Note.",
  errIncomplete: 'Sauvegarde incomplète.',
  errInvalidJson: 'Fichier JSON invalide.',
  exported: (n: number) => `${n} note${s(n)} exportée${s(n)}.`,
  imported: (n: number) => `${n} note${s(n)} importée${s(n)}.`,
  confirmReplace: 'Remplacer toutes tes notes et tes critères par ceux du fichier ?',

  // ---------- Options page ----------
  optEyebrow: 'Extension pour Captain Coaster',
  optLede:
    'Tes critères, tes poids, tes notes. Tout reste dans ce navigateur ; seule la moyenne arrondie part sur Captain Coaster, quand tu cliques sur « Envoyer ».',
  optCriteriaTitle: 'Mes critères',
  optResetCriteria: 'Rétablir les critères par défaut',
  optCriteriaHelp:
    'Le poids dit combien un critère compte dans la moyenne. Un critère désactivé ou « Ignoré » disparaît du panneau, mais tes notes passées sont gardées.',
  optNewCriterionLabel: 'Nom du nouveau critère',
  optNewCriterionPlaceholder: 'Nouveau critère, ex. Première chute',
  optAdd: 'Ajouter',
  optRatingsTitle: 'Mes notes',
  optSearchLabel: 'Rechercher un coaster',
  optSearchPlaceholder: 'Coaster ou parc…',
  optColCoaster: 'Coaster',
  optColAverage: 'Moyenne',
  optColOnCaptain: 'Sur Captain Coaster',
  optColModified: 'Modifiée',
  optColActions: 'Actions',
  optRatingsEmpty:
    'Aucune note pour l’instant. Ouvre la page d’un coaster sur Captain Coaster : le panneau « Ta note détaillée » apparaît sous les étoiles.',
  optBackupTitle: 'Sauvegarde',
  optBackupHelp:
    'Tes notes ne quittent pas ce navigateur. Exporte-les de temps en temps, ou pour les passer sur un autre ordinateur.',
  optExport: 'Exporter (.json)',
  optImport: 'Importer…',
  optReplace: 'Remplacer au lieu de fusionner',
  optFooter: 'Captain Note n’est pas affilié à Captain Coaster. Aucune donnée n’est collectée.',
  enableCriterion: (name: string) => `Activer ${name}`,
  criterionName: (position: number) => `Nom du critère ${position}`,
  weightOf: (name: string) => `Poids de ${name}`,
  moveUp: (name: string) => `Monter ${name}`,
  moveDown: (name: string) => `Descendre ${name}`,
  moved: (name: string, position: number, total: number) => `${name} déplacé en position ${position} sur ${total}.`,
  deleteCriterion: (name: string) => `Supprimer ${name}`,
  confirmDeleteCriterion: (name: string) =>
    `Supprimer le critère « ${name} » ? Les notes déjà données sur ce critère ne compteront plus.`,
  criterionDeleted: (name: string) => `Critère ${name} supprimé.`,
  criterionAdded: (name: string, position: number) => `Critère ${name} ajouté en position ${position}.`,
  confirmReset: 'Revenir aux critères par défaut ? Tes critères personnalisés seront retirés (les notes restent stockées).',
  resetDone: 'Critères par défaut rétablis.',
  noMatch: (query: string) => `Aucun coaster ne correspond à « ${query} ».`,
  noMatchShort: 'Aucun coaster ne correspond.',
  shownCount: (n: number) => `${n} coaster${s(n)} affiché${s(n)}.`,
  newTab: ' (nouvel onglet)',
  noAverage: 'Aucune',
  notSent: 'Pas envoyée',
  toResend: 'à renvoyer',
  toResendTitle: 'Ta moyenne a changé depuis le dernier envoi. Ouvre la page du coaster pour renvoyer.',
  deleteRating: (name: string) => `Supprimer la note de ${name}`,
  confirmDeleteRating: (name: string) =>
    `Supprimer ta note détaillée de ${name} ? La note sur Captain Coaster ne change pas.`,
  ratingDeleted: (name: string) => `Note de ${name} supprimée.`,
};

export type Messages = typeof fr;
