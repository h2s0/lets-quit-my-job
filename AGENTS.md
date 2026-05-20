# Repository Guidelines

## Project Structure & Module Organization

This is a Vite 8, React 19, TypeScript single-page app for a three-step resignation/severance flow. Code lives in `src/`:

- `src/main.tsx` mounts the app and router.
- `src/App.tsx` and `src/App.css` hold top-level layout and shared app styling.
- `src/pages/` contains route-level screens such as `ResignationPage.tsx`, `PlaquePage.tsx`, and `SeverancePage.tsx`, with matching `.css` files.
- `src/components/` contains reusable UI pieces, also with colocated CSS.
- `src/utils/calc.ts` contains severance calculation logic.
- `src/types/` stores shared TypeScript types.
- `public/` contains static assets such as `favicon.svg` and `icons.svg`.

## Build, Test, and Development Commands

Use the package scripts in `package.json`:

- `npm install` installs dependencies. The repo also has `pnpm-lock.yaml`; keep lockfile changes intentional.
- `npm run dev` starts the local Vite dev server.
- `npm run build` runs `tsc -b` and creates the production Vite build in `dist/`.
- `npm run lint` runs ESLint over the repository.
- `npm run preview` serves the built app locally for production checks.

## Coding Style & Naming Conventions

Write TypeScript and React components in `.tsx` files. Use PascalCase for components and pages, for example `DateSelect.tsx` or `SeverancePage.tsx`. Use camelCase for functions, variables, props, and utility exports. Keep CSS colocated with the component or page it styles.

The codebase uses ES modules, two-space indentation, and mostly single quotes. Follow nearby files. ESLint is configured via `eslint.config.js` with TypeScript, React Hooks, and React Refresh rules.

## Testing Guidelines

There is no dedicated test framework or `npm test` script yet. Verify changes with:

```bash
npm run lint
npm run build
```

For changes in `src/utils/calc.ts`, add focused tests if a test framework is introduced. Name future tests after the unit, for example `calc.test.ts`.

## Commit & Pull Request Guidelines

Recent history mixes Korean imperative summaries with conventional prefixes such as `feat:`, `fix:`, `seo:`, and `chore:`. Prefer a short, specific subject:

- `fix: sync lockfile for Vercel deployment`
- `feat: add under-1-year worker mode`
- `파비콘 변경, 검색어`

For pull requests, include a concise description, user-visible behavior changes, verification commands run, and screenshots or screen recordings for UI changes. Link related issues when available and note any deployment-sensitive dependency or lockfile updates.

## Agent-Specific Instructions

Keep changes scoped to the requested behavior. Do not regenerate lockfiles or reformat unrelated files unless the task requires it. When editing UI, preserve the page/component CSS organization already used in `src/pages/` and `src/components/`.
