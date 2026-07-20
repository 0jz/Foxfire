# Studio Foxfire - a Vessel-inspired agency landing page

A dark, editorial one-pager built with React, Three.js (via `@react-three/fiber`
+ `@react-three/drei`), GSAP (scroll/timeline choreography), and Motion
(pointer-driven micro-interactions and the custom cursor).

## The hero creature

`src/components/FoxCreature.jsx` is a low-poly fox built entirely from Three.js
primitives (cones + spheres, no external model). Its head turns toward the
cursor, its pupils dart ahead of the head for a layered "alive" feel, and it
has a subtle idle sway/ear-twitch so it never looks frozen. See
`src/components/HeroScene.jsx` for how it's mounted in the hero's `<Canvas>`.

## Stack split

- **GSAP** (`src/sections/*.jsx`) — sequenced entrance timelines and
  `ScrollTrigger` reveals for headings, stats, and the work list.
- **Motion** (`src/components/CustomCursor.jsx`, `Nav.jsx`, `Hero.jsx`,
  `Work.jsx`) — the spring-driven custom cursor, nav underline, button
  hover/tap states, and the work-row arrow reveal.

## Getting started

```bash
npm install --legacy-peer-deps
npm run dev      # local dev server
npm run build    # production build → dist/
```

The `--legacy-peer-deps` flag is needed because a couple of sub-dependencies
haven't widened their peer range to React 19 yet; it doesn't affect runtime
behavior.

## Structure

```
src/
  components/
    FoxCreature.jsx   — the 3D creature, mouse-tracking logic
    HeroScene.jsx      — <Canvas>, lighting, camera
    CustomCursor.jsx   — Motion-driven cursor dot
    Nav.jsx
  sections/
    Hero.jsx
    Work.jsx
    About.jsx
    Contact.jsx
  App.jsx / App.css / index.css
```

Swap in real project data in `src/sections/Work.jsx` (`PROJECTS` array) and
`src/sections/About.jsx` (`STATS` array) — everything else is ready to go.
