# jodlxverse

Personal portfolio site. Cinematic, motion-heavy, custom cursor, 3D scenes.

## Stack

- React 19 + TypeScript 6 + Vite 8
- React Router v7 (BrowserRouter, lazy routes in `src/App.tsx`)
- Tailwind CSS v4 (via `@tailwindcss/vite` plugin — no `tailwind.config.js`, theme lives in `src/index.css` `@theme` block)
- framer-motion 12 (page transitions via `AnimatePresence mode="wait"`)
- gsap 3 (timeline-driven scroll animations)
- lenis 1.3 (smooth scroll — `scroll-behavior: initial` in CSS, lenis owns it)
- @react-three/fiber + drei + three 0.184 (3D scenes: `TerminalScene`, `TechSwarm`)
- tone 15 (audio)
- shiki 4 (code syntax highlighting)
- lucide-react (icons)

## Commands

```bash
npm run dev      # vite dev server
npm run build    # tsc -b && vite build (typecheck gates build)
npm run lint     # eslint flat config
npm run preview  # preview built dist
```

No test runner configured.

## Layout

```
src/
  main.tsx            # StrictMode + BrowserRouter root
  App.tsx             # Preloader (2200ms) → Layout + lazy routes
  index.css           # Tailwind v4 theme tokens, cursor CSS, page-transition keyframes
  components/         # All reusable UI (Hero, Layout, Preloader, PageTransition, Cursor, etc.)
  pages/              # Home, Work, Lab, Motion, Contact (route components)
  assets/             # static images
```

Routes: `/`, `/work`, `/lab`, `/motion`, `/contact`.

## Conventions

- **Named exports** from page modules — lazy imports unwrap via `.then(m => ({ default: m.X }))`. Match this pattern when adding pages.
- **Theme tokens** live in `@theme` block (`src/index.css`). Add CSS vars there, not in a JS config.
- **Dark mode** via `.dark` class on root, not media query. CSS vars swap inside `.dark { ... }`.
- **Custom cursor is global**: `* { cursor: none !important }`. Never set `cursor:` on elements — extend `Cursor.tsx` / `CustomCursor.tsx` instead.
- **Smooth scroll owned by lenis** (`SmoothScroll.tsx`). Don't use `scroll-behavior: smooth` or native `scrollIntoView({behavior:'smooth'})` — they fight lenis.
- **Page transitions** use `AnimatePresence mode="wait"` keyed on `location.pathname`. `PageTransition.tsx` runs the clip-path wipe defined in `index.css`.
- **gsap + lenis sync**: when adding ScrollTrigger, register lenis's scroll proxy or animations desync from smooth scroll.
- **R3F scenes** wrapped in `<Suspense fallback={null}>` already at route level — heavy 3D OK to lazy-load further inside scene components.
- **Fonts** loaded via `<link>` in `index.html` (Bebas Neue, Instrument Serif, IBM Plex Mono, Space Grotesk). CSS vars in `@theme` reference them.

## Gotchas

- TypeScript is **6.0.2** + `"verbatimModuleSyntax": true` → type-only imports must use `import type`.
- `"erasableSyntaxOnly": true` → no enums, no `namespace`, no parameter properties in classes.
- `noUnusedLocals` + `noUnusedParameters` enabled → underscore-prefix unused args (`_arg`) or remove.
- Tailwind v4: utility classes only, **no `@apply` in component files unless wrapped in `@layer`**.
- StrictMode is on → effects run twice in dev. Preloader timer is fine because cleanup clears it; mind this for any new effect with side effects.
- `cursor: none !important` blanks pointer site-wide — test new components for cursor visibility regressions.

## Build behavior

`npm run build` runs `tsc -b` first; TS errors fail the build before vite bundles. Keep types clean.

## When making changes

- Match existing component naming (PascalCase files, default-or-named export consistent with siblings).
- Animations: prefer **framer-motion for component-level / mount transitions**, **gsap for scroll-tied timelines**, **CSS keyframes for ambient loops** (marquee, dot pulse).
- Heavy assets in `public/` (served as-is), source-controlled images in `src/assets/`.
