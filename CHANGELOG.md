# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Interface available in English, French, Spanish and German, the languages offered by Captain Coaster (`FR-ui-locale-multi`). The coaster panel follows the page language, the settings page the last Captain Coaster language seen (or the browser language), the extension name and description the browser language. Other languages fall back to English.
- Default criteria names, numbers and dates follow the display language. Saved criteria are not renamed.

## [0.1.0] - 2026-10-27

### Added

- Chrome (MV3) and Firefox (MV2) extension built with [WXT](https://wxt.dev) and TypeScript.
- “Ta note détaillée” panel on Captain Coaster coaster pages: per-criterion half-star ratings, customizable criteria (name, on/off, weight), weighted average, and one-click “Envoyer” to save the final rating on Captain Coaster.
- Settings page (toolbar button): manage criteria, browse detailed ratings, JSON export and import (merge or replace).
- Local-only storage; submission via the site star widget with POST fallback for touch devices.
- Unit tests (Vitest) for rating logic, stars, and Captain Coaster integration helpers.
- Contributor workflow: `AGENTS.md` and `docs/functional-rules.md` (`FR-*` rules).
- Privacy policy in `PRIVACY.md`.

[0.1.0]: https://github.com/hugo-piedanna/CaptainNote/releases/tag/v0.1.0
