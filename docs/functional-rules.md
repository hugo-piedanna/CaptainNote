# Functional Rules — Captain Note

Stable identifiers: `FR-{domain}-{feature}` (kebab-case, English).

Append any new rule at the **end** of this file.

This document is the repository **functional source of truth**. Any user-visible change or any data / network change MUST be reflected here; keep `README.md` and `PRIVACY.md` in sync when public documentation or the published privacy policy must follow.

---

## FR-ui-coaster-panel

On every Captain Coaster coaster page (logged-in user), the extension MUST show the “Ta note détaillée” panel below the site’s star widget.

## FR-ui-locale-fr

All user-visible extension strings (panel, options, user-facing error messages) MUST be in French, unless a new rule explicitly documents another language or i18n.

## FR-ui-settings-entry

The settings page MUST open from the extension toolbar button. It MUST allow managing criteria, the list of detailed ratings, and JSON backup.

## FR-criteria-defaults

Default criteria MUST be, in this order: Intensité, Airtimes, Layout et rythme, Confort et fluidité, Thématisation, Envie de le refaire (all enabled, Normal weight), then Débit et attente (user-configurable but **disabled** by default, Normal weight).

## FR-criteria-customization

For each criterion, the user MUST be able to rename, enable/disable, and choose a weight among Ignoré, Normal, Important, Essentiel.

## FR-criteria-weights

Weights MUST behave in scoring as follows: Ignoré (weight 0) excluded; Normal ×1; Important ×2; Essentiel ×3. A disabled criterion MUST be ignored in scoring even if scores remain in storage.

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
