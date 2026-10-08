# AGENTS.md

Instructions for coding agents working in this repository.

## Project overview

Plain is a client-rendered personal blog built with Vue 3, TypeScript, Vite 5, Pinia, Vue Router, UnoCSS, and pnpm. Posts, labels, comments, and site content come from GitHub Issues/GraphQL; some counters and visitor data are stored in GitHub Gists.

## Branch and Git workflow (mandatory)

- **All development must happen on the `dev` branch.** Before editing files, run `git branch --show-current` and ensure it prints `dev`.
- If on another branch, check for uncommitted work first. Do not discard, stash, or overwrite user changes without permission. Switch to `dev` only when safe; otherwise stop and explain the blocker.
- **Never implement changes or commit directly on `main` or `test`.** Do not merge, rebase, cherry-pick, push, force-push, or create releases unless explicitly asked.
- Keep changes focused. Do not modify unrelated files or regenerate lockfiles without a dependency change.
- Inspect `git status --short` before and after work. Do not commit unless the user requests it.

## Setup and verification

- Use **pnpm** and the existing lockfile; avoid npm/yarn.
- Install dependencies: `pnpm install --frozen-lockfile`.
- Develop: `pnpm dev`.
- Type-check and build: `pnpm build` (runs `vue-tsc && vite build`).
- Lint: `pnpm lint`. Use `pnpm lint:fix` only when appropriate and review the resulting diff.
- Run the Gist statistics tests with `pnpm test`; they use mocked responses and must not write to a real Gist. Describe any additional manual verification rather than claiming unexecuted checks passed.
- Do not run production deployments or release workflows without authorization.

## Code organization

- `src/views/`: route-level pages (Home, Posts, Post, Tags, Search, Friend).
- `src/components/`: shared UI and Markdown rendering.
- `src/api/index.ts`: GitHub REST/GraphQL and Gist requests.
- `src/utils/`: network helpers, formatting, Markdown setup, and homepage configuration.
- `src/stores/`: Pinia state (theme, views/counters/visitors).
- `src/services/`: notification service.
- `src/locale/`: internationalization.
- `src/types/`: shared TypeScript types.
- `src/router.ts`: routes; `src/main.ts`: app bootstrap.
- `public/`: static assets; `dist/`: generated build output.

## Implementation guidelines

- Follow existing Vue 3 Single File Component conventions, Composition API, and `<script setup lang="ts">`.
- Prefer explicit TypeScript types for API responses and shared data; avoid `any` when a real type can be defined.
- Reuse existing components, stores, utilities, and UnoCSS patterns before adding dependencies or new abstractions.
- Keep API transport and formatting logic out of view components where practical.
- Handle loading, empty, and error states; do not silently convert every failure into a successful empty result.
- Preserve existing routes, content formats (GitHub Issues and front matter), responsive layout, light/dark themes, and internationalization behavior unless changes are requested.
- Avoid unrelated formatting sweeps and breaking changes.

## Security and privacy

- **Never disclose or copy contents of `.env.local`, tokens, or secrets into reports, logs, commits, or examples.** Use placeholder values and `.env.sample` for documentation.
- Vite is configured with `envPrefix: ['V_']`. These variables are exposed to client-side bundles. **Do not treat `V_*` variables as secrets or add new privileged credentials to browser code.**
- Existing GitHub/Gist token handling requires special care. Flag sensitive flows and propose server-side or narrowly scoped alternatives rather than expanding exposure.
- Treat Markdown, Issue content, comments, and remote URLs as untrusted input. Review HTML sanitization before using `v-html`.
- Avoid adding visitor tracking or collecting additional personal data without an explicit request and appropriate privacy review.
- Do not write or delete real GitHub Issues/Gists as part of tests unless specifically authorized.

## Completion checklist

1. Confirm work was performed on `dev`.
2. Review `git diff` and `git status --short` for unintended changes.
3. Run applicable checks (normally `pnpm lint` and `pnpm build`) for source changes when feasible.
4. Summarize changed files, user-visible behavior, verification performed, remaining risks, and any checks not run.
