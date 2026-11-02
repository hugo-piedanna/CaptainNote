# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-11-02

### Added

- Interface available in English, French, Spanish and German, the languages offered by Captain Coaster (`FR-ui-locale-multi`). The coaster panel follows the page language, the settings page the last Captain Coaster language seen (or the browser language), the extension name and description the browser language. Other languages fall back to English.
- Default criteria names, numbers and dates follow the display language. Saved criteria are not renamed.
- Settings page summary: detailed ratings, up to date on Captain Coaster, waiting to be sent, active criteria (`FR-options-summary`).
- MIT license (`LICENSE`).
- Settings page footer: “Made by Hugo Piedanna” with links to the author’s website and the source code (`FR-options-author-footer`).
- Ratings list: status per coaster (up to date, to resend, not sent, no average) and sort by most recent, name or highest average (`FR-options-ratings-sort`).
- Ratings list shows 10 ratings per page, with previous / next buttons (`FR-options-ratings-pagination`).

### Changed

- Settings page redesigned (`FR-options-layout`): single page with a sticky navigation, segmented weight control, in-page confirmation dialog for destructive actions, explicit Merge / Replace choice for import, mobile layout, and rewritten texts in every language.
- The Ignored weight is removed: the on/off switch is the only way to exclude a criterion (`FR-criteria-weights`). Criteria saved or imported as Ignored are loaded as disabled with Normal weight.
- New default criteria, sorted by relevance and all enabled with Normal weight: Layout and pacing, Comfort and smoothness, Rerideability, Theming, Ride length, Queue, Park operations. Intensity and Airtime are no longer defaults. Saved criteria are not changed.

### Fixed

- Park name was saved empty: the icon-only “back” link of the coaster page was read instead of the park name, so searching by park found nothing. Ratings without a park get it back when their coaster page is opened (`FR-captain-park-name`).
- Ratings list search ignores accents (“asterix” finds “Parc Astérix”).
- Ratings list rows use one text size across all cells.
- A detailed rating whose average equals the rating already on Captain Coaster is now shown as up to date instead of not sent (`FR-rating-captain-match`).

## [0.1.0] - 2026-10-27

### Added

- Chrome (MV3) and Firefox (MV2) extension built with [WXT](https://wxt.dev) and TypeScript.
- “Ta note détaillée” panel on Captain Coaster coaster pages: per-criterion half-star ratings, customizable criteria (name, on/off, weight), weighted average, and one-click “Envoyer” to save the final rating on Captain Coaster.
- Settings page (toolbar button): manage criteria, browse detailed ratings, JSON export and import (merge or replace).
- Local-only storage; submission via the site star widget with POST fallback for touch devices.
- Unit tests (Vitest) for rating logic, stars, and Captain Coaster integration helpers.
- Contributor workflow: `AGENTS.md` and `docs/functional-rules.md` (`FR-*` rules).
- Privacy policy in `PRIVACY.md`.

[1.0.0]: https://github.com/hugo-piedanna/CaptainNote/releases/tag/v1.0.0
[0.1.0]: https://github.com/hugo-piedanna/CaptainNote/releases/tag/v0.1.0
