# JODLXVERSE — Frontier Frontend

> Premium cinematic digital portfolio. Interactive, motion-first, WebGL-powered.

Live → [frontier-frontend.vercel.app](https://frontier-frontend.vercel.app) *(Vercel, auto-deploy on push)*

---

## What It Is

Agency/portfolio site for the **JODLX** brand. Not a template — every screen is interactive. Built around three ideas:

- **Cinema-first**: hero videos, VHS intros, project reels, audio layers
- **Physics UI**: orbital gravity particles, cursor-proximity gradients, neon shockwave canvas
- **CHLOE**: a live cybernetic AI android assistant embedded in the Work page — 3D parallax body, browser voice synthesis, horizontal video loop

---

## Stack

| Layer | Tech |
|-------|------|
| Framework | React 19 + TypeScript 6 |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 |
| Motion | GSAP 3 + Framer Motion 12 + Lenis 1.3 |
| 3D / WebGL | React Three Fiber v9 + Three.js r184 + Drei |
| Audio | Tone.js 15 |
| Routing | React Router v7 |
| Syntax highlight | Shiki v4 |
| Deploy | Vercel (SPA rewrites via `vercel.json`) |

---

## Pages

### `/` — Home
- Cinematic video hero (`hero_digital_agency.mp4`)
- VHS-style intro sequence (8 clips, randomized)
- Reel section — Namma reels (webm + mp4 fallback)

### `/work` — Work
- Project showcase grid: Neoleaf, Holocene, Dark Portal, Kinetic Identity, Create Studio, Jen OGDL, Git City
- Each project: video, audio layer, case study depth
- **CHLOE Case Study** — centerpiece of the Work page:
  - Cybernetic android in 3D parallax (React Three Fiber)
  - Browser Web Speech API voice synthesis
  - WhatsApp campaign horizontal scroll loop video
  - Fallback to video when audio unavailable

### `/contact` — Contact
- "Say Hello" RGB border gradient CTA
- ContactHero: orbital gravity + neon shockwave particle canvas (WebGL)
- SocialGrid: cursor-proximity gradient reveal effects
- Navbar: JODLX. wordmark + logo image side by side

---

## Key Features

### CHLOE — Cybernetic Assistant
Interactive android built in Three.js. Responds to scroll and cursor position, plays audio. CaseStudy page uses her as the narrative device for the WhatsApp Namma campaign.

### Particle Canvas Systems
- **ContactHero**: orbital gravity simulation + neon shockwave on hover — vanilla Canvas API, no library
- **Social grid**: cursor-proximity gradient — each card warps toward the cursor independently

### VHS Intro Engine
8 VHS clips in `public/media/videos/vhs/`. Sequence randomized on load. Simulates analog channel switching before main content appears.

### Audio Layer
- `audio_neoleaf.mp3` — plays on Neoleaf project hover/open
- `music_git_city.mp3` — background for Git City project
- Tone.js handles scheduling, cross-fade, and playback state

---

## Media Structure

```
public/media/
  videos/
    hero/           ← hero_digital_agency.mp4
    vhs/            ← vhs_intro_1..8.mp4
    reel/           ← reel_namma_1..6 (webm + mp4)
    projects/       ← neoleaf, holocene, dark_portal, kinetic_identity, cursor_reel
    showcase/       ← project_9_1..6, lab_video_showcase
  images/
    projects/       ← create_studio.png, jen_ogdl.png
    whatsapp/       ← whatsapp_1..9.jpeg (Namma campaign)
  audio/            ← audio_neoleaf.mp3, music_git_city.mp3
  logos/            ← jodl_logo.png, icons.svg, favicon.svg
  gifs/             ← statue_artwork.gif
```

---

## Dev

```bash
pnpm install
pnpm dev          # localhost:5173
pnpm build        # tsc -b && vite build
pnpm preview      # preview built dist/
```

TypeScript strict mode. `noUnusedLocals` + `noUnusedParameters` enforced — fix before build.

---

## Deploy

Vercel. `vercel.json` rewrites all routes to `index.html` for SPA client-side routing.

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Push to `main` → auto-deploy. No env vars required.

---

## Commit History (feature map)

| Commit | What shipped |
|--------|-------------|
| `240ffb9` | Base: premium cinematic portfolio |
| `d44679d` | Vercel SPA routing |
| `53764f5..4762b46` | Navbar: JODLX. text + logo image |
| `6e06544` | Cursor-proximity gradients on Contact |
| `89a4a4c` | Orbital gravity + neon shockwave particle canvas |
| `b6be516` | CHLOE: 3D-parallax cybernetic android |
| `3d09c31` | CHLOE moved to Work > CaseStudy |
| `ebc42d6` | Voice synthesis + video fallback on CHLOE |
| `fa76c1b` | WhatsApp campaign horizontal scroll loop |

---

## Project Context

Part of the **jodl-workspace** monorepo ecosystem. Components proven here (CHLOE, VHS engine, particle canvas) are candidates for promotion to `@jodl/patterns` after quality gate.

Related: [SARTA](https://github.com/JodLHarDxD) (luxury fashion ecom) · creat-studio (in dev)
