<p align="center">
  <img src="public/icon/128.png" alt="Captain Note logo" width="96" height="96">
</p>

<h1 align="center">Captain Note</h1>

<p align="center">
  Chrome and Firefox extension to rate <a href="https://captaincoaster.com">Captain Coaster</a> coasters criterion by criterion.
</p>

---

Captain Note adds a detailed rating panel to every coaster page on Captain Coaster. Each coaster is rated on several criteria (intensity, airtime, theming…), weighted by how much they matter to the user. The extension computes the weighted average and submits it as a rating out of 5 to the user's Captain Coaster account.

## Table of contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)
- [Privacy](#privacy)

## Features

- "Ta note détaillée" (detailed rating) panel below the stars on every coaster page
- Customizable criteria: name, on/off and weight (Ignoré, Normal, Important, Essentiel)
- Half-star input, keyboard accessible; a criterion can be left empty when it does not apply
- One-click submission of the final rating to Captain Coaster
- List of all detailed ratings on the settings page
- JSON export and import (merge or replace)
- Fully local, no server

## Installation

Publication on the Chrome Web Store and addons.mozilla.org is planned. Until then, the extension can be installed from source.

Requirements: [Node.js](https://nodejs.org) and npm.

```bash
git clone https://github.com/hugo-piedanna/CaptainNote.git
cd CaptainNote
npm install
```

### Chrome

1. `npm run build`
2. Open `chrome://extensions` and enable Developer mode
3. Click "Load unpacked" and select the `.output/chrome-mv3` folder

### Firefox

1. `npm run build:firefox`
2. Open `about:debugging`, then "This Firefox"
3. Click "Load Temporary Add-on" and select `.output/firefox-mv2/manifest.json`

## Usage

1. Log in to [captaincoaster.com](https://captaincoaster.com) and open a coaster page.
2. Rate each criterion in the "Ta note détaillée" panel.
3. Click "Envoyer" (send) to save the final rating on Captain Coaster.

Criteria, weights and the list of ratings are managed from the settings page, opened with the extension's toolbar button.

> The extension interface is currently in French only.

### Default criteria

Intensité (intensity), Airtimes, Layout et rythme (layout and pacing), Confort et fluidité (comfort and smoothness), Thématisation (theming), Envie de le refaire (rerideability), and Débit et attente (capacity and wait time, disabled by default).

### How the rating is computed

The final rating is the average of the rated criteria, weighted by their weight (Normal ×1, Important ×2, Essentiel ×3, Ignoré excluded), rounded down to the nearest half point and clamped between 0.5 and 5.

| Criterion           | Score | Weight         |
| ------------------- | ----- | -------------- |
| Intensité           | 5     | Essentiel (×3) |
| Airtimes            | 4.5   | Important (×2) |
| Confort et fluidité | 3     | Normal (×1)    |

(5×3 + 4.5×2 + 3×1) / 6 = **4.5**

## Development

[WXT](https://wxt.dev) project written in TypeScript, tested with [Vitest](https://vitest.dev).

### Scripts

| Command                                   | Description                                                                                   |
| ----------------------------------------- | --------------------------------------------------------------------------------------------- |
| `npm run dev`                             | Launches Chrome with the extension and hot reload                                             |
| `npm run dev:firefox`                     | Same in Firefox                                                                               |
| `npm run build` / `npm run build:firefox` | Production build in `.output/`                                                                |
| `npm test`                                | Unit tests                                                                                    |
| `npm run compile`                         | TypeScript type check                                                                         |
| `npm run zip` / `npm run zip:firefox`     | Release archives in `.output/` (the Firefox zip includes the sources for Mozilla's review)    |

### Project structure

| File                                                               | Purpose                                                                                  |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| [`lib/rating.ts`](lib/rating.ts)                                   | Default criteria, weighted average, rounding. No browser APIs.                           |
| [`lib/captain.ts`](lib/captain.ts)                                 | Everything that depends on Captain Coaster's HTML. The only file to fix if the site changes. |
| [`lib/store.ts`](lib/store.ts)                                     | Local storage, export and import (with validation).                                      |
| [`lib/stars.ts`](lib/stars.ts)                                     | Half-star input component, keyboard accessible.                                          |
| [`entrypoints/captain.content.ts`](entrypoints/captain.content.ts) | Panel injected into coaster pages.                                                       |
| [`entrypoints/options/`](entrypoints/options/)                     | Settings page: criteria, list of ratings, backup.                                        |
| [`entrypoints/background.ts`](entrypoints/background.ts)           | Opens the settings from the toolbar button.                                              |

### Captain Coaster integration

Based on the open source repository [`captain-coaster/captain-coaster`](https://github.com/captain-coaster/captain-coaster) (October 2026), the rating is submitted in one of two ways:

1. **Primary path**: the extension clicks the site's star widget at the position matching the value. The site handles the CSRF token, the request and the display, then emits `rating:created` or `rating:updated`, which the extension waits for to confirm the submission.
2. **Fallback** (touch screens, where the widget does not listen to clicks): the same request the site sends, `POST /{locale}/ratings/coasters/{id}/edit` with `value`, `_token` and the `X-Requested-With: XMLHttpRequest` header, using the user's session.

The site accepts values from 0.5 to 5 in steps of 0.5.

## Privacy

Data stays in the browser: no server, no analytics, no data collection. Only the final rating is sent to the Captain Coaster account, when "Envoyer" is clicked. See [PRIVACY.md](PRIVACY.md).

---

<sub>Captain Note is an independent project, not affiliated with Captain Coaster.</sub>
