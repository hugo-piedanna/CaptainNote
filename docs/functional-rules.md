# Functional Rules — Captain Note

Stable identifiers: `FR-{domain}-{feature}` (kebab-case, English).

Append any new rule at the **end** of this file.

This document is the repository **functional source of truth**. Any user-visible change or any data / network change MUST be reflected here; keep `README.md` and `PRIVACY.md` in sync when public documentation or the published privacy policy must follow.

---

## FR-ui-coaster-panel

On every Captain Coaster coaster page (logged-in user), the extension MUST show the “Ta note détaillée” panel below the site’s star widget.

## FR-ui-locale-fr

*Superseded by `FR-ui-locale-multi`.*

All user-visible extension strings (panel, options, user-facing error messages) MUST be in French, unless a new rule explicitly documents another language or i18n.

## FR-ui-settings-entry

The settings page MUST open from the extension toolbar button. It MUST allow managing criteria, the list of detailed ratings, and JSON backup.

## FR-criteria-defaults

Default criteria MUST be, in this order of relevance (French names; translated per `FR-ui-locale-multi`): Layout et rythme, Confort et fluidité, Envie de le refaire, Thématisation, Longueur du tour, File d’attente, Gestion par le parc. All are enabled with Normal weight.

## FR-criteria-customization

For each criterion, the user MUST be able to rename, enable/disable, and choose a weight among Normal, Important, Essentiel. The enable/disable switch is the only way to exclude a criterion from scoring.

## FR-criteria-weights

Weights MUST behave in scoring as follows: Normal ×1; Important ×2; Essentiel ×3. A disabled criterion MUST be ignored in scoring even if scores remain in storage.

A criterion stored or imported with the former Ignoré weight (0), or with a missing or invalid weight below 1, MUST be loaded as disabled with Normal weight. Weights above 3 MUST be clamped to 3.

## FR-rating-score-input

Each active criterion MUST accept a half-star score from 0.5 to 5, or remain empty (`null`) when the criterion does not apply. Input MUST remain keyboard accessible.

## FR-rating-weighted-average

The final rating MUST be the weighted average of active, weighted, and scored criteria; rounded down to the nearest half point; clamped between 0.5 and 5. When nothing is scorable, the value to send MUST be absent (`null`).

## FR-rating-submit-trigger

Submission to Captain Coaster MUST happen only when the user clicks “Envoyer”. No automatic background submission MUST be added without a new rule and an update to `PRIVACY.md`.

## FR-captain-integration-dual-path

Submitting the rating on Captain Coaster MUST use, in order:

1. **Primary path**: interact with the site’s star widget at the computed value; wait for `rating:created` or `rating:updated` events to confirm.
2. **Fallback**: the same request the site uses — `POST /{locale}/ratings/coasters/{id}/edit` with `value`, `_token`, and the `X-Requested-With: XMLHttpRequest` header, using the user’s existing session.

## FR-captain-rating-values

Values sent to Captain Coaster MUST be from 0.5 to 5 in steps of 0.5, per the site.

## FR-storage-local-only

Criteria, weights, and detailed ratings MUST be persisted only in the extension’s local storage (`storage.local`). No Captain Note server MUST exist.

## FR-backup-export-import

The user MUST be able to export and import a JSON backup. The format MUST identify the app (`app: captain-note`, `version: 1`). Imported files MUST be validated; an invalid file MUST fail with a readable message without corrupting existing storage.

## FR-backup-merge-replace

Import MUST offer at least two modes:

- **Replace**: criteria and ratings replaced by the backup (empty criteria → revert to default criteria).
- **Merge**: missing criteria added; for each coaster, keep the entry with the latest `updatedAt`.

Coaster URLs in a backup MUST be restricted to `https://captaincoaster.com`; otherwise a safe default URL MUST be used.

## FR-privacy-no-collection

Captain Note MUST NOT collect, sell, or transmit personal data to third parties. No analytics, tracking, or extension-specific cookies MUST be added without a new rule and an update to `PRIVACY.md`.

## FR-privacy-network-send

The only data leaving the browser to an external service MUST be the final rating (0.5–5) saved to the user’s Captain Coaster account, and only on “Envoyer”, as if the user had clicked the site’s stars. The extension MUST NOT read or store session credentials.

## FR-privacy-permissions

Extension permissions MUST remain limited to `storage` and access to `https://captaincoaster.com/*` to show the panel and submit the rating. Any additional permission or `host_permission` MUST have a new rule, an update to `PRIVACY.md`, and user confirmation.

## FR-ui-locale-multi

Supersedes `FR-ui-locale-fr`. User-visible extension strings (panel, options page, user-facing error messages, manifest name/description/toolbar title) MUST be available in every language offered by Captain Coaster: English (`en`), French (`fr`), Spanish (`es`), German (`de`).

- **Coaster panel**: the display language MUST be the Captain Coaster locale of the current page (first URL segment, e.g. `/de/coasters/…`).
- **Options page**: the display language MUST be the last Captain Coaster locale seen on a coaster page, stored as `uiLocale` in `storage.local` (`FR-storage-local-only`). Before any coaster page has been visited, it MUST follow the browser UI language.
- **Manifest strings** (extension name, description, toolbar title) cannot depend on the site: they MUST follow the browser UI language (native `_locales`).
- Any language other than `en`, `fr`, `es`, `de` MUST fall back to English.
- Default criterion names (`FR-criteria-defaults`) MUST be shown in the display language as long as the user has not saved criteria. Criteria already saved, including renamed ones, MUST NOT be renamed or translated automatically. “Restore defaults” and an import in Replace mode with empty criteria MUST use the display language.
- Numbers and dates MUST be formatted for the display language.
- Language detection MUST NOT add any permission or network request (`FR-privacy-*`).
- The locale used in Captain Coaster URLs for submission (`FR-captain-integration-dual-path`) stays the one read from the current page.
- Adding a language requires updating this list and providing a complete translation.

## FR-options-layout

The settings page (`FR-ui-settings-entry`) MUST be a single scrolling page with three sections, in this order: Criteria, Ratings, Backup. A navigation bar MUST stay visible while scrolling and link to each section.

- Destructive actions (delete a criterion, delete a detailed rating, restore default criteria, import in Replace mode) MUST ask for confirmation in an in-page dialog in the display language (`FR-ui-locale-multi`). The dialog MUST be keyboard accessible, MUST focus the cancel button first, and MUST treat Escape as cancel.
- Renaming a criterion MUST be saved on blur or Enter; Escape MUST restore the previous name. An empty name MUST NOT be saved.
- The weight (`FR-criteria-customization`) MUST be chosen with one control showing the three levels and their multiplier.
- Import (`FR-backup-merge-replace`) MUST show the two modes as an explicit choice with a description of each, Merge selected by default.

## FR-options-summary

The top of the settings page MUST show a summary computed locally from storage, with no network request: the number of detailed ratings, how many are up to date on Captain Coaster, how many wait to be sent, and the number of active criteria out of the total.

Each detailed rating MUST have one status, based on its current average (`FR-rating-weighted-average`) and its last sent value:

- **Up to date**: the average equals the last sent value.
- **To resend**: a value was sent, and the average now differs from it.
- **Not sent**: there is an average, and nothing was ever sent.
- **No average**: no active criterion is scored. Nothing waits to be sent.

“Waiting to be sent” counts the To resend and Not sent statuses. The ratings list MUST show the status of each rating.

## FR-options-ratings-sort

The ratings list MUST be filterable by coaster or park name (case-insensitive substring) and sortable by:

- **Most recent** (default): last modification date, newest first.
- **Name**: coaster name A→Z, compared for the display language.
- **Average**: highest average first; ratings with no average last.

The chosen sort applies to the current page view only and MUST NOT be persisted.

## FR-options-author-footer

The settings page footer (`FR-options-layout`) MUST include the mention “Made by Hugo Piedanna” with two links: the author’s website (`https://piedanna.dev`) and the source code repository (`https://github.com/hugo-piedanna/CaptainNote`). Texts MUST follow `FR-ui-locale-multi`.

- The mention MUST appear only on the settings page, never in the panel injected into Captain Coaster pages.
- Links MUST be plain links opening in a new tab (`target="_blank"`, `rel="noopener noreferrer"`). No URL parameter MUST carry user data.
- No image, font, script, or widget from these sites MUST be loaded: nothing leaves the browser until the user clicks a link (`FR-privacy-network-send`). No permission is added (`FR-privacy-permissions`).
