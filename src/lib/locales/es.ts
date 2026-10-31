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
  weights: ['Ignorado', 'Normal', 'Importante', 'Esencial'],

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
  confirmReplace: '¿Sustituir todas tus notas y criterios por los del archivo?',

  // ---------- Options page ----------
  optEyebrow: 'Extensión para Captain Coaster',
  optLede:
    'Tus criterios, tus pesos, tus notas. Todo se queda en este navegador; solo la media redondeada se envía a Captain Coaster, cuando haces clic en «Enviar».',
  optCriteriaTitle: 'Mis criterios',
  optResetCriteria: 'Restablecer los criterios por defecto',
  optCriteriaHelp:
    'El peso indica cuánto cuenta un criterio en la media. Un criterio desactivado o «Ignorado» desaparece del panel, pero tus notas anteriores se conservan.',
  optNewCriterionLabel: 'Nombre del nuevo criterio',
  optNewCriterionPlaceholder: 'Nuevo criterio, p. ej. Primera caída',
  optAdd: 'Añadir',
  optRatingsTitle: 'Mis notas',
  optSearchLabel: 'Buscar una montaña rusa',
  optSearchPlaceholder: 'Montaña rusa o parque…',
  optColCoaster: 'Montaña rusa',
  optColAverage: 'Media',
  optColOnCaptain: 'En Captain Coaster',
  optColModified: 'Modificada',
  optColActions: 'Acciones',
  optRatingsEmpty:
    'Todavía no hay notas. Abre la página de una montaña rusa en Captain Coaster: el panel «Tu nota detallada» aparece bajo las estrellas.',
  optBackupTitle: 'Copia de seguridad',
  optBackupHelp:
    'Tus notas no salen de este navegador. Expórtalas de vez en cuando, o para pasarlas a otro ordenador.',
  optExport: 'Exportar (.json)',
  optImport: 'Importar…',
  optReplace: 'Sustituir en lugar de combinar',
  optFooter: 'Captain Note no está afiliado a Captain Coaster. No se recoge ningún dato.',
  enableCriterion: (name: string) => `Activar ${name}`,
  criterionName: (position: number) => `Nombre del criterio ${position}`,
  weightOf: (name: string) => `Peso de ${name}`,
  moveUp: (name: string) => `Subir ${name}`,
  moveDown: (name: string) => `Bajar ${name}`,
  moved: (name: string, position: number, total: number) => `${name} movido a la posición ${position} de ${total}.`,
  deleteCriterion: (name: string) => `Eliminar ${name}`,
  confirmDeleteCriterion: (name: string) =>
    `¿Eliminar el criterio «${name}»? Las notas ya dadas en este criterio dejarán de contar.`,
  criterionDeleted: (name: string) => `Criterio ${name} eliminado.`,
  criterionAdded: (name: string, position: number) => `Criterio ${name} añadido en la posición ${position}.`,
  confirmReset:
    '¿Volver a los criterios por defecto? Tus criterios personalizados se eliminarán (las notas siguen guardadas).',
  resetDone: 'Criterios por defecto restablecidos.',
  noMatch: (query: string) => `Ninguna montaña rusa coincide con «${query}».`,
  noMatchShort: 'Ninguna montaña rusa coincide.',
  shownCount: (n: number) => `${n} montaña${s(n)} rusa${s(n)} mostrada${s(n)}.`,
  newTab: ' (pestaña nueva)',
  noAverage: 'Ninguna',
  notSent: 'No enviada',
  toResend: 'por reenviar',
  toResendTitle: 'Tu media ha cambiado desde el último envío. Abre la página de la montaña rusa para reenviarla.',
  deleteRating: (name: string) => `Eliminar la nota de ${name}`,
  confirmDeleteRating: (name: string) =>
    `¿Eliminar tu nota detallada de ${name}? La nota en Captain Coaster no cambia.`,
  ratingDeleted: (name: string) => `Nota de ${name} eliminada.`,
};
