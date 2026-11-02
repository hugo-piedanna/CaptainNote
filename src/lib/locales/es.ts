import type { Messages } from './fr';

const s = (n: number) => (n === 1 ? '' : 's');

export const es: Messages = {
  // ---------- Default criteria and weights ----------
  criteria: {
    layout: 'Trazado y ritmo',
    confort: 'Comodidad y suavidad',
    rejouabilite: 'Ganas de repetir',
    theming: 'Tematización',
    longueur: 'Duración del recorrido',
    attente: 'Cola de espera',
    gestion: 'Gestión del parque',
  },
  weights: ['Normal', 'Importante', 'Esencial'],

  // ---------- Star input ----------
  notApplicable: 'No aplica',
  notApplicableHere: 'No aplica a esta montaña rusa',
  clearLabel: (label: string) => `${label}: no aplica a esta montaña rusa`,
  scoreText: (value: string, n: number) => `${value} estrella${s(n)} de 5`,
  starWord: (n: number) => `estrella${s(n)}`,

  // ---------- Coaster panel ----------
  panelTitle: 'Tu nota detallada',
  keyboardHelp:
    'Para cada criterio: flechas izquierda y derecha para cambiar media estrella, números del 1 al 5, Supr si el criterio no aplica.',
  criteriaListLabel: 'Criterios',
  manageCriteria: 'Gestionar mis criterios',
  opensNewTab: ' (abre una pestaña nueva)',
  noActiveCriteria: 'Ningún criterio activo. Añade alguno en los ajustes.',
  countsTimes: (n: number) => `Cuenta ${n} veces en la media`,
  countsTimesSpoken: (n: number) => `, cuenta ${n} veces`,
  noAverageYet: 'Todavía no hay media.',
  averageAnnounce: (score: string) => `Media: ${score}.`,
  sending: 'Enviando a Captain Coaster…',
  sendingShort: 'Enviando…',
  sentOk: (value: string) => `Nota de ${value} sobre 5 guardada en Captain Coaster.`,
  rateOneHint: 'Puntúa al menos un criterio para obtener tu media.',
  yourAverage: (score: string) => `Tu media: ${score}`,
  averageDetail: (raw: string, counted: number, active: number) =>
    `Media ${raw} sobre ${counted} criterio${s(counted)}${
      counted < active ? ` (de ${active})` : ''
    }, redondeada a la media estrella inferior para Captain Coaster.`,
  captainDiffers: 'En Captain Coaster, tu nota es {stars}. Envía la nueva para igualarlas.',
  loginToSendSaved: 'Inicia sesión en Captain Coaster para enviar tu nota. Tus criterios ya están guardados.',
  upToDate: 'Ya está al día en Captain Coaster',
  send: 'Enviar',
  sendStars: 'Enviar {stars}',

  // ---------- Errors from Captain Coaster ----------
  errLogin: 'Inicia sesión en Captain Coaster para enviar tu nota.',
  errNotRateable: 'Captain Coaster no permite puntuar esta montaña rusa.',
  errRefused: 'Captain Coaster ha rechazado la nota. Inténtalo más tarde.',
  errToken: 'No se encuentra el token de seguridad. Recarga la página.',
  errStatus: (status: number) => `Captain Coaster ha respondido ${status}. Recarga la página e inténtalo de nuevo.`,
  errOffline: 'Sin conexión con Captain Coaster.',

  // ---------- Backup ----------
  errUnreadable: 'Archivo ilegible.',
  errNotBackup: 'Este archivo no es una copia de seguridad de Captain Note.',
  errIncomplete: 'Copia de seguridad incompleta.',
  errInvalidJson: 'Archivo JSON no válido.',
  exported: (n: number) => `${n} nota${s(n)} exportada${s(n)}.`,
  imported: (n: number) => `${n} nota${s(n)} importada${s(n)}.`,
  optEyebrow: 'Ajustes de la extensión',
  optLede:
    'Elige lo que te importa en una montaña rusa y puntúa cada criterio. Calcula tu media según tus criterios y envía simplemente tu media calculada.',
  optNavLabel: 'Secciones de los ajustes',
  optNavCriteria: 'Criterios',
  optNavRatings: 'Notas',
  optNavBackup: 'Copia de seguridad',
  optStatRatings: (n: number) => `nota${s(n)} detallada${s(n)}`,
  optStatSynced: (_n: number) => 'al día en Captain Coaster',
  optStatPending: (n: number) => `pendiente${s(n)} de envío`,
  optStatCriteria: (n: number, total: number) => `criterio${s(n)} activo${s(n)} de ${total}`,
  optCancel: 'Cancelar',
  optDelete: 'Eliminar',

  optCriteriaTitle: 'Tus criterios',
  optCriteriaIntro:
    'Elige los criterios que te importan. Ajusta la ponderación de cada uno según su importancia.',
  optCriteriaEmpty: 'Aún no hay criterios. Añade uno abajo o vuelve a los criterios por defecto.',
  optResetCriteria: 'Criterios por defecto',
  optNewCriterionLabel: 'Añadir un criterio',
  optNewCriterionPlaceholder: 'P. ej. Primera caída, Airtime, Inversiones…',
  optAdd: 'Añadir',
  optConfirmResetTitle: '¿Volver a los criterios por defecto?',
  optConfirmResetBody:
    'Se quitarán tus criterios personalizados y los pesos volverán a Normal. Las notas ya dadas se conservan.',
  optConfirmResetAction: 'Restablecer',
  optConfirmDeleteCriterionTitle: (name: string) => `¿Eliminar «${name}»?`,
  optConfirmDeleteCriterionBody:
    'Las notas ya dadas en este criterio se conservan, pero dejarán de contar en tus medias.',

  optRatingsTitle: 'Tus notas',
  optRatingsIntro:
    'Encuentra todas tus notas y su estado. No olvides enviarlas a Captain Coaster para que se tengan en cuenta.',
  optSearchLabel: 'Buscar una montaña rusa',
  optSearchPlaceholder: 'Montaña rusa o parque…',
  optSortLabel: 'Ordenar por',
  optSortRecent: 'Más recientes',
  optSortName: 'Nombre (A → Z)',
  optSortAverage: 'Mejor media',
  optColCoaster: 'Montaña rusa',
  optColAverage: 'Tu media',
  optColOnCaptain: 'En Captain Coaster',
  optColModified: 'Modificada',
  optColActions: 'Acciones',
  optStatusSynced: 'Al día',
  optStatusSyncedHint: 'Tu media coincide con la nota guardada en Captain Coaster.',
  optStatusResend: 'Por reenviar',
  optStatusResendHint:
    'Tu media ha cambiado desde el último envío. Abre la página de la montaña rusa para reenviarla.',
  optStatusUnsent: 'No enviada',
  optStatusUnsentHint: 'Esta media nunca se ha enviado. Abre la página de la montaña rusa para enviarla.',
  optStatusNone: 'Sin media',
  optStatusNoneHint: 'Ningún criterio activo está puntuado para esta montaña rusa.',
  optRatingsEmptyTitle: 'Aún no hay notas detalladas',
  optRatingsEmpty:
    'Abre la página de una montaña rusa en Captain Coaster: el panel «Tu nota detallada» te espera justo debajo de las estrellas.',
  optConfirmDeleteRatingTitle: (name: string) => `¿Eliminar tu nota de ${name}?`,
  optConfirmDeleteRatingBody: 'Solo se borra tu nota detallada. La nota guardada en Captain Coaster no cambia.',

  optBackupTitle: 'Copia de seguridad',
  optBackupIntro:
    'Tus notas solo viven en este navegador. Expórtalas de vez en cuando para no perder nada, o para pasarlas a otro ordenador.',
  optExport: 'Descargar la copia',
  optImportModeLegend: '¿Qué hacer con el contenido del archivo?',
  optModeMerge: 'Combinar',
  optModeMergeHelp: 'Añade los criterios que faltan y conserva, para cada montaña rusa, la nota más reciente.',
  optModeReplace: 'Sustituirlo todo',
  optModeReplaceHelp: 'Borra tus criterios y notas actuales y los sustituye por los del archivo.',
  optImport: 'Elegir un archivo…',
  optConfirmReplaceTitle: '¿Sustituirlo todo?',
  optConfirmReplaceBody: (n: number) =>
    `Tus criterios y ${
      n === 0 ? 'tus notas' : n === 1 ? 'tu nota detallada' : `tus ${n} notas detalladas`
    } se sustituirán por el contenido del archivo. Exporta antes si quieres conservar una copia.`,
  optConfirmReplaceAction: 'Sustituir',
  optFooter: 'Captain Note es un proyecto independiente, sin relación con Captain Coaster. No se recoge ningún dato.',
  optFooterMadeBy: 'Hecho por',
  optFooterSource: 'Código fuente',
  enableCriterion: (name: string) => `Activar ${name}`,
  criterionName: (position: number) => `Nombre del criterio ${position}`,
  weightOf: (name: string) => `Peso de ${name}`,
  moveUp: (name: string) => `Subir ${name}`,
  moveDown: (name: string) => `Bajar ${name}`,
  moved: (name: string, position: number, total: number) => `${name} movido a la posición ${position} de ${total}.`,
  deleteCriterion: (name: string) => `Eliminar ${name}`,
  criterionDeleted: (name: string) => `Criterio ${name} eliminado.`,
  criterionAdded: (name: string, position: number) => `Criterio ${name} añadido en la posición ${position}.`,
  resetDone: 'Criterios por defecto restablecidos.',
  noMatch: (query: string) => `Ninguna montaña rusa coincide con «${query}».`,
  noMatchShort: 'Ninguna montaña rusa coincide.',
  shownCount: (n: number) => `${n} montaña${s(n)} rusa${s(n)} mostrada${s(n)}.`,
  newTab: ' (pestaña nueva)',
  noAverage: 'Ninguna',
  deleteRating: (name: string) => `Eliminar la nota de ${name}`,
  ratingDeleted: (name: string) => `Nota de ${name} eliminada.`,
};
