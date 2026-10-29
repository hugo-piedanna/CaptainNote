# AGENTS.md — Functional workflow gate

This file defines the mandatory workflow for any AI agent working in this repository.

## Normative keywords

The keywords **MUST**, **MUST NOT**, **SHOULD**, and **MAY** indicate requirement levels.

## 1) Scope and goal

- **Captain Note** is a Chrome / Firefox extension ([WXT](https://wxt.dev)) that injects multi-criterion rating on [Captain Coaster](https://captaincoaster.com).
- **Functional source of truth**: `docs/functional-rules.md` (product behavior, scoring, storage, site integration, functional privacy constraints).
- **User-facing and legal documentation**: `README.md` (overview, install, usage) and `PRIVACY.md` (published policy). These MUST NOT substitute for the functional gate, but MUST be updated when `FR-*` rules or shipped behavior change in a user-visible or legally relevant way.
- **Technical reference** (module layout, scripts): Development section of `README.md` and code under `src/`.
- Before any change to visible **behavior** or **data**, the agent MUST check coverage in `docs/functional-rules.md` and obtain **explicit user confirmation** before writing production code (unless the request is already a direct implementation instruction).

## 2) Repository documentation language

All **repository documentation** MUST be written in **English**. This includes, without limitation:

- Markdown and text docs at the repo root and under `docs/` (e.g. `AGENTS.md`, `README.md`, `PRIVACY.md`, `CHANGELOG.md`, `docs/functional-rules.md`).
- New or updated doc content produced by an agent as part of a change.

This rule does **not** override product UI language: user-visible extension strings follow `FR-ui-locale-multi` in `docs/functional-rules.md` (English, French, Spanish, German, matching Captain Coaster). Code comments SHOULD be English unless matching an existing local convention in the touched file.

## 3) Mandatory execution flow

For any request that may affect behavior, privacy, or the contract with Captain Coaster:

1. Read `docs/functional-rules.md`.
2. Identify applicable `FR-*` rules.
3. Classify the request:
   - **Covered**: at least one applicable rule and no conflict;
   - **Missing rule**: no applicable rule;
   - **Conflict**: the request contradicts one or more existing rules.
4. Follow the matching branch (sections 4–6).
5. For **Covered** or after drafting a new rule, request confirmation before implementation when behavior changes (see section 7).

## 4) Branch A — Covered

1. List the `FR-*` rules that apply.
2. Implement in strict compliance with those rules and the architecture (section 9).
3. MUST NOT silently deviate from functional intent.
4. Update `README.md` and/or `PRIVACY.md` when the change must be reflected for users or the published privacy policy.
5. Write or edit any affected repository documentation in English (section 2).

## 5) Branch B — Missing rule

1. Draft a concise, testable rule in `docs/functional-rules.md` (in English).
2. Stable identifier: `FR-{domain}-{feature}` (kebab-case, English), e.g. `FR-rating-weighted-average`.
3. Append the rule at the **end** of the file to reduce merge conflicts.
4. Update `README.md` and/or `PRIVACY.md` if user-visible spec or public privacy changes.
5. Stop and request confirmation before implementation.

## 6) Branch C — Conflict

1. MUST NOT implement immediately.
2. Explain the conflict (request vs `FR-*` rule).
3. Propose options (keep rule, new rule, compromise) including privacy impact when relevant.
4. Obtain confirmation, update `docs/functional-rules.md`, then `README.md` and/or `PRIVACY.md` as needed, before coding.

## 7) Required response template (before behavioral code)

Before implementation that changes behavior, the agent MUST summarize:

1. **Functional status**: Covered | Missing rule | Conflict
2. **Applicable rules**: list of `FR-*` IDs
3. **Proposed action**: short plan
4. **Docs to sync**: README / PRIVACY / none
5. **Confirmation gate**: explicit question to the user

For changes with **no** behavioral impact (formatting, internal refactor, comments), state why `docs/functional-rules.md` needs no update; confirmation SHOULD still be requested when the diff is large.

## 8) Edge cases

- If `docs/functional-rules.md` is missing or unreadable, stop and ask for guidance before coding.
- If a rule is ambiguous, ask a clarifying question and pause implementation.
- If Captain Coaster’s site changes, treat as high-attention (section 11); do not guess the DOM without reproducing or documenting the assumption in a rule or test comment.

## 9) Architecture and code conventions

Respect the existing separation:

| Area | File(s) | Constraint |
| ---- | ------- | ---------- |
| Pure logic (average, rounding, criteria) | `src/lib/rating.ts` | **No** browser APIs; unit tests required for any scoring change |
| DOM / Captain Coaster site integration | `src/lib/captain.ts` | Only place to adapt when the site changes; comply with `FR-captain-*` |
| Storage, export, import | `src/lib/store.ts` | Comply with `FR-storage-*` and `FR-backup-*` |
| Half-star input | `src/components/stars/StarInput.tsx` | Comply with `FR-rating-score-input` |
| Coaster page injection | `src/entrypoints/captain.content.tsx` | “Ta note détaillée” panel (`src/components/panel/CoasterPanel.tsx`) |
| Settings | `src/entrypoints/options/` | Criteria, list, backup |
| Background | `src/entrypoints/background.ts` | Open settings from toolbar |

Other conventions:

- TypeScript, ES modules; follow `.editorconfig` and Prettier (`.prettierrc`).
- Manifest permissions: comply with `FR-privacy-permissions`; any extension MUST go through Conflict / new rule + `PRIVACY.md`.
- Create git commits only when the user explicitly asks.

## 10) Priority when constraints compete

1. User-approved functional decision (current request)
2. `docs/functional-rules.md`
3. Existing patterns in the repository
4. `README.md` (install and structure aid, not a substitute for `FR-*` rules)

## 11) High-attention domains

| Domain | Reference rules | Files / tests |
| ------ | ----------------- | ------------- |
| Captain Coaster integration | `FR-captain-integration-dual-path`, `FR-captain-rating-values`, `FR-rating-submit-trigger` | `src/lib/captain.ts`, `tests/captain.test.ts` |
| Score computation | `FR-criteria-weights`, `FR-rating-weighted-average`, `FR-rating-score-input` | `src/lib/rating.ts`, `tests/rating.test.ts` |
| Privacy | `FR-privacy-*`, `FR-storage-local-only` | `wxt.config.ts`, `PRIVACY.md` |
| Export / import | `FR-backup-export-import`, `FR-backup-merge-replace` | `src/lib/store.ts` |

Any change in these domains MUST update the relevant tests and, when behavior or public privacy changes, `README.md` and/or `PRIVACY.md`.

## 12) Post-implementation checks

For any substantive change:

1. Run `npm run compile` and `npm test`; fix failures before considering the work complete.
2. If site integration or injected UI changes, remind how to test manually (`npm run dev` / `npm run dev:firefox`, logged-in coaster page).
3. Update `CHANGELOG.md` for user-visible releases when the user wants it or when that is the release convention in progress.
4. Ask whether the user is satisfied before a large unrequested polish pass.

## 13) Useful scripts

| Command | Agent use |
| ------- | --------- |
| `npm test` | Vitest (pure logic + simulated integration) |
| `npm run compile` | TypeScript check |
| `npm run dev` / `npm run dev:firefox` | Manual extension testing |
| `npm run build` / `npm run build:firefox` | Release build in `.output/` |

No new behavioral implementation MUST be considered done without green `compile` and `test`, unless the user is told why with a clear cause.
