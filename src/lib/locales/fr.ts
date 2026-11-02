/**
 * Reference language: every other locale must provide the same keys (`Messages`).
 * `{stars}` marks where the UI inserts a star value (see `withStars`).
 */
const s = (n: number) => (n > 1 ? 's' : '');

export const fr = {
  // ---------- Default criteria and weights ----------
  criteria: {
    layout: 'Layout et rythme',
    confort: 'Confort et fluidité',
    rejouabilite: 'Envie de le refaire',
    theming: 'Thématisation',
    longueur: 'Longueur du tour',
    attente: 'File d’attente',
    gestion: 'Gestion par le parc',
  },
  weights: ['Normal', 'Important', 'Essentiel'] as [string, string, string],

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
  optEyebrow: 'Réglages de l’extension',
  optLede:
    'Choisis ce qui compte pour toi dans un coaster et note chaque critère. Calcule ta moyenne selon tes critères, et envoie simplement ta moyenne calculée.',
  optNavLabel: 'Sections des réglages',
  optNavCriteria: 'Critères',
  optNavRatings: 'Notes',
  optNavBackup: 'Sauvegarde',
  optStatRatings: (n: number) => `note${s(n)} détaillée${s(n)}`,
  optStatSynced: (_n: number) => 'à jour sur Captain Coaster',
  optStatPending: (_n: number) => 'en attente d’envoi',
  optStatCriteria: (n: number, total: number) => `critère${s(n)} actif${s(n)} sur ${total}`,
  optCancel: 'Annuler',
  optDelete: 'Supprimer',

  optCriteriaTitle: 'Tes critères',
  optCriteriaIntro:
    'Choisis les critères qui comptent pour toi. Ajuste la pondération de chacun selon son importance.',
  optCriteriaEmpty: 'Aucun critère pour l’instant. Ajoute-en un ci-dessous ou reviens aux critères par défaut.',
  optResetCriteria: 'Critères par défaut',
  optNewCriterionLabel: 'Ajouter un critère',
  optNewCriterionPlaceholder: 'Ex. Première chute, Airtime, Inversions…',
  optAdd: 'Ajouter',
  optConfirmResetTitle: 'Revenir aux critères par défaut ?',
  optConfirmResetBody:
    'Tes critères personnalisés seront retirés et les poids remis à Normal. Les notes déjà données restent stockées.',
  optConfirmResetAction: 'Rétablir',
  optConfirmDeleteCriterionTitle: (name: string) => `Supprimer « ${name} » ?`,
  optConfirmDeleteCriterionBody:
    'Les notes déjà données sur ce critère restent stockées, mais ne compteront plus dans tes moyennes.',

  optRatingsTitle: 'Tes notes',
  optRatingsIntro:
    'Retrouve toutes tes notes et leur statut. N’oublie pas de les envoyer à Captain Coaster pour qu’elles soient prises en compte.',
  optSearchLabel: 'Rechercher un coaster',
  optSearchPlaceholder: 'Coaster ou parc…',
  optSortLabel: 'Trier par',
  optSortRecent: 'Les plus récentes',
  optSortName: 'Nom (A → Z)',
  optSortAverage: 'Meilleure moyenne',
  optColCoaster: 'Coaster',
  optColAverage: 'Ta moyenne',
  optColOnCaptain: 'Sur Captain Coaster',
  optColModified: 'Modifiée le',
  optColActions: 'Actions',
  optStatusSynced: 'À jour',
  optStatusSyncedHint: 'Ta moyenne est celle enregistrée sur Captain Coaster.',
  optStatusResend: 'À renvoyer',
  optStatusResendHint: 'Ta moyenne a changé depuis le dernier envoi. Ouvre la page du coaster pour la renvoyer.',
  optStatusUnsent: 'Pas envoyée',
  optStatusUnsentHint: 'Cette moyenne n’a jamais été envoyée. Ouvre la page du coaster pour l’envoyer.',
  optStatusNone: 'Sans moyenne',
  optStatusNoneHint: 'Aucun critère actif n’est noté pour ce coaster.',
  optRatingsEmptyTitle: 'Pas encore de note détaillée',
  optRatingsEmpty:
    'Ouvre la page d’un coaster sur Captain Coaster : le panneau « Ta note détaillée » t’attend juste sous les étoiles.',
  optConfirmDeleteRatingTitle: (name: string) => `Supprimer ta note de ${name} ?`,
  optConfirmDeleteRatingBody:
    'Seule ta note détaillée est effacée. La note enregistrée sur Captain Coaster ne change pas.',

  optBackupTitle: 'Sauvegarde',
  optBackupIntro:
    'Tes notes ne vivent que dans ce navigateur. Exporte-les de temps en temps pour ne rien perdre, ou pour les retrouver sur un autre ordinateur.',
  optExport: 'Télécharger la sauvegarde',
  optImportModeLegend: 'Que faire du contenu du fichier ?',
  optModeMerge: 'Fusionner',
  optModeMergeHelp: 'Ajoute les critères manquants et garde, pour chaque coaster, la note la plus récente.',
  optModeReplace: 'Tout remplacer',
  optModeReplaceHelp: 'Efface tes critères et tes notes actuels au profit de ceux du fichier.',
  optImport: 'Choisir un fichier…',
  optConfirmReplaceTitle: 'Tout remplacer ?',
  optConfirmReplaceBody: (n: number) =>
    `Tes critères et ${
      n === 0 ? 'tes notes' : n === 1 ? 'ta note détaillée' : `tes ${n} notes détaillées`
    } seront remplacés par le contenu du fichier. Exporte d’abord si tu veux en garder une copie.`,
  optConfirmReplaceAction: 'Remplacer',
  optFooter: 'Captain Note est un projet indépendant, sans lien avec Captain Coaster. Aucune donnée n’est collectée.',
  optFooterMadeBy: 'Fait par',
  optFooterSource: 'Code source',
  enableCriterion: (name: string) => `Activer ${name}`,
  criterionName: (position: number) => `Nom du critère ${position}`,
  weightOf: (name: string) => `Poids de ${name}`,
  moveUp: (name: string) => `Monter ${name}`,
  moveDown: (name: string) => `Descendre ${name}`,
  moved: (name: string, position: number, total: number) => `${name} déplacé en position ${position} sur ${total}.`,
  deleteCriterion: (name: string) => `Supprimer ${name}`,
  criterionDeleted: (name: string) => `Critère ${name} supprimé.`,
  criterionAdded: (name: string, position: number) => `Critère ${name} ajouté en position ${position}.`,
  resetDone: 'Critères par défaut rétablis.',
  noMatch: (query: string) => `Aucun coaster ne correspond à « ${query} ».`,
  noMatchShort: 'Aucun coaster ne correspond.',
  shownCount: (n: number) => `${n} coaster${s(n)} affiché${s(n)}.`,
  newTab: ' (nouvel onglet)',
  noAverage: 'Aucune',
  deleteRating: (name: string) => `Supprimer la note de ${name}`,
  ratingDeleted: (name: string) => `Note de ${name} supprimée.`,
};

export type Messages = typeof fr;
