# AGENTS.md — Studio Foxfire

Static React 19 + Vite agency landing page (template/showcase): a Three.js fox hero, pixel-art forest backdrops, GSAP scroll reveals and Motion micro-interactions.

## Commands
- Install: `npm install --legacy-peer-deps` (required; some deps' peer ranges don't include React 19 yet)
- Dev: `npm run dev` (Vite, default port 5173)
- Build: `npm run build` → `dist/`
- Preview: `npm run preview`
- Lint: `npm run lint` (oxlint, config in `.oxlintrc.json`: `react/rules-of-hooks` is an error)
- Test: none configured

## Where logic lives
- `src/App.jsx`: page composition (LoadingScreen → Nav, cursor, Hero, Work, About, Journal, Contact)
- `src/components/FoxCreature.jsx` + `HeroScene.jsx`: 3D fox (primitives only, no model files), `<Canvas>`, lights, camera
- `src/components/Forest*.jsx`, `forestBiomes.js`: procedural pixel-art backdrops; biomes `evergreen`, `autumn`, `snowbound`, `midnight`
- `src/components/ornaments/`: pixel sprites, palette, shading, paw print, treeline divider
- Content data: `PROJECTS` (`src/sections/Work.jsx`), `STATS` (`src/sections/About.jsx`), `LINKS` (`src/components/Nav.jsx`)

## Conventions
- JSX (no TypeScript), ESM, function components.
- GSAP animation lives in `src/sections/*.jsx` via `useGSAP` from `@gsap/react` (scoped to a container ref, so cleanup is automatic).
- Motion (`motion/react`) handles pointer-driven and hover/tap interactions. Don't move these to GSAP or vice versa without reason.
- Plain CSS in `App.css` / `index.css`; no CSS framework.

## Do not commit / touch
- `node_modules/`, `dist/`, `*.local` (gitignored).
- `src/assets/hero.png`, `react.svg` and `vite.svg` are unused Vite-template leftovers.

## Gotchas
- Plain `npm install` without `--legacy-peer-deps` may fail with ERESOLVE.
- `index.html` `<title>` reads "Studio Foxfire -npm Digital &amp; Motion" (stray "npm" typo).
- The hero needs WebGL; test changes on a low-end device or with throttling.

Humans: see README.md
