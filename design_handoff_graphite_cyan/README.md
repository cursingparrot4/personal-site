# Handoff: Graphite Cyan portfolio + Nullscape filter (0.2)

## Overview
A redesign of `cursingparrot4/arna-site` (Next.js App Router, CSS Modules) in a
"graphite cyan" terminal palette, with an atmospheric **Nullscape filter** overlay —
dithering, scanlines, animated grain, a slow cyan light beam, fog and a color grade —
running at **strength 0.2** (subtle; text stays fully legible).

Scope: sitewide theme tokens + one new overlay component. Page structure, routing and
content stay as they are today. The rail/sidebar gains an optional monospace prompt row.

## About the Design Files
The files in this bundle are **design references created in HTML** — a prototype of the
intended look and behavior, not production code to paste in.

`Graphite Cyan.dc.html` is a single-file prototype: it uses a small custom runtime
(`<x-dc>` template + a logic class) and **inline styles only**, because the prototyping
environment requires that. Do **not** port that structure. Recreate the design in the
repo's existing environment — React Server/Client Components, CSS Modules, the
`app/globals.css` token layer — following the patterns already in the codebase.

The `reference/` folder contains a hand-written, repo-idiomatic starting point
(`NullscapeFilter.tsx` + `NullscapeFilter.module.css` + `tokens.css`). Those are meant to
be dropped in and adjusted, and they encode the exact numbers from the prototype.

## Fidelity
**High-fidelity.** Colors, type sizes, spacing, easing and opacities below are final and
exact. Recreate them precisely. The one deliberately loose part is the atmosphere layer's
visual "feel" — it is procedural; match the listed values and the result will match.

## What changes vs. today's site

| Area | Change |
| --- | --- |
| `app/globals.css` | Replace theme tokens with the graphite-cyan palette (below). Add `@keyframes` for the filter. |
| `app/layout.tsx` | Mount `<NullscapeFilter />` once, inside `<body>`, before/around the shell. |
| `components/NullscapeFilter.tsx` | **New.** Two fixed, `pointer-events:none`, `aria-hidden` layer stacks. |
| `components/Rail.tsx` | Add the optional prompt row above the name (see "Rail"). |
| `components/Shell.tsx` | Ensure the content wrapper sits at `z-index: 1` with `position: relative` so it renders above the atmosphere layer (z 0) and below the texture layer (z 30). |
| Everything else | Restyled by tokens only — no structural change. |

## Design Tokens

### Color
| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#0d1114` | page background |
| `--surface` | `#161b1f` | row hover, switcher/chrome background |
| `--surface-2` | `#1e252b` | active tab background |
| `--line` | `#232b31` | hairlines, em-dashes, inert separators |
| `--text` | `#e2e8ec` | primary text |
| `--muted` | `#8b979e` | secondary text, nav links, meta |
| `--accent` | `#34c5dd` | cyan: links on hover, section numbers, org names, awards, active bullet |
| `--accent-dim` | `rgba(52,197,221,0.32)` | tag borders |
| `--selection` | `rgba(52,197,221,0.28)` | `::selection` background (text `#fff`) |

Alternate accents supported by the prototype (theme prop, not required):
`#4ade9b`, `#e8b34a`, `#8ea2ff`.

### Typography
- Display / body: **Space Grotesk** — weights 400, 500, 700.
- Mono / UI meta: **JetBrains Mono** — weights 400, 500.
- Base: `16px` / `line-height: 1.65`, antialiased.

| Role | Size | Weight | Tracking | Family |
| --- | --- | --- | --- | --- |
| Page title (`h1`) | `clamp(2.5rem, 6vw, 4rem)` | 500 | `-0.02em` | Space Grotesk |
| Rail name | `clamp(1.75rem, 2.4vw, 2.25rem)` | 500 | `-0.02em`, `line-height 1.05` | Space Grotesk |
| Section heading (`h2`) | `1.5rem` | 500 | `-0.01em`, `line-height 1.1` | Space Grotesk |
| Sub-heading (`h3`) | `1.125rem` | 500 | — | Space Grotesk |
| Row title | `1.125rem` | 500 | `-0.005em` | Space Grotesk |
| Body | `16px` | 400 | `line-height 1.65` | Space Grotesk |
| Section eyebrow | `12px` | 500 | `0.06em` | JetBrains Mono |
| Nav / meta / links | `13px` | 400 | — | JetBrains Mono |
| Tags, prompt row, switcher | `12px` | 400 | — | JetBrains Mono |

### Space, radius, motion
- Rhythm: `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64px`; section gaps `clamp(4rem, 10vw, 6rem)`.
- Page: `max-width: 80rem`, `padding-inline: clamp(1.25rem, 5vw, 2rem)`; footer inner `max-width: 46rem`.
- Grid: `grid-template-columns: 17rem minmax(0, 1fr)`, `gap: clamp(2.5rem, 6vw, 5rem)`, `align-items: start`.
- Radius: `3px` on tags only. No shadows anywhere except the vignette `inset` shadow.
- Hairlines: `0.5px solid var(--line)`.
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)`. Hover/color transitions `150ms`; disclosure `400ms`.

## The Nullscape filter

Two sibling stacks, both `position: fixed; inset: 0; pointer-events: none; overflow: hidden;
aria-hidden="true"`. Strength `k = 0.2` multiplies every opacity/alpha. Expose `k` as a CSS
custom property (`--ns-k`) so it stays tunable; hide both stacks when `k === 0`.

**Stack A — atmosphere, `z-index: 0` (behind content)**
1. Haze: `inset: -20%`, two radial gradients —
   `radial-gradient(58% 48% at 20% 10%, #0f2c3a 0%, rgba(15,44,58,0) 62%)`,
   `radial-gradient(45% 42% at 88% 74%, #10303d 0%, rgba(16,48,61,0) 60%)`;
   `animation: ns-haze 28s ease-in-out infinite`.
2. Beam: `left:-10%; bottom:-30%; width:90%; height:120%`,
   `conic-gradient(from 200deg at 20% 100%, transparent 0deg, rgb(52 197 221 / .27) 18deg, rgb(52 197 221 / .13) 30deg, transparent 46deg)`,
   `filter: blur(26px)`, `opacity: 0.8k` (= 0.16), `animation: ns-beam 20s ease-in-out infinite`.
3. Fog: `radial-gradient(120% 90% at 50% 120%, rgba(8,20,28,0) 30%, rgba(9,24,33,0.5k) 70%, rgba(5,12,17,0.78k) 100%)`.
4. Vignette: `box-shadow: inset 0 0 260px 70px rgba(4,8,11,.9), inset 0 0 70px 0 rgba(4,8,11,.55)` (not scaled by k).

**Stack B — texture, `z-index: 30` (above content, very low opacity)**
1. Scanlines: `repeating-linear-gradient(0deg, rgba(6,12,16,.28) 0 1px, transparent 1px 3px)`, `opacity: .5`.
2. Dither: `repeating-conic-gradient(rgba(255,255,255,.10) 0% 25%, rgba(0,0,0,.10) 0% 50%)`, `background-size: 4px 4px`, `mix-blend-mode: overlay`, `opacity: 0.24k` (= 0.048).
3. Color bands: `repeating-linear-gradient(158deg, transparent 0 26px, rgb(52 197 221 / .19) 26px 34px, rgba(10,40,55,.35) 34px 44px)`, `mix-blend-mode: hard-light`, `opacity: 0.07k` (= 0.014).
4. Grain: `inset: -8%`, an inline SVG `feTurbulence` noise tile (`baseFrequency 0.9`, `numOctaves 2`, `stitchTiles stitch`, 140×140) at `background-size: 420px 420px`, `image-rendering: pixelated`, `mix-blend-mode: overlay`, `opacity: 0.14k` (= 0.028), `animation: ns-grain .55s steps(1,end) infinite`.
5. Grade: `linear-gradient(160deg, rgba(20,70,95,0.5k) 0%, rgba(15,50,72,0.32k) 55%, rgba(8,20,32,0.45k) 100%)`, `mix-blend-mode: color`.

Dither (2+3) and grain (4) are independently switchable; keep them as props/flags.

Keyframes and the exact noise data-URI are in `reference/NullscapeFilter.module.css`.
Respect `prefers-reduced-motion: reduce` (the prototype collapses all animation to `.01ms`,
one iteration — the layers stay, they just stop moving).

## Screens / Views
Routes are unchanged. Prototype screens map 1:1 to today's routes:

**Rail (persistent, all routes)** — `components/Rail.tsx`
`position: sticky; top: 0; height: 100dvh`, flex column, `padding-block: clamp(3rem,8vh,6rem) 48px`.
- **New:** prompt row — mono 12px, `#8b979e`, `~/` in accent then `aryan-ahlawat`, right-aligned `cs · systems`, `border-bottom: 0.5px solid var(--line)`, `padding-bottom: 14px`, `margin-bottom: 20px`. Gate behind a `showPrompt` flag (default on).
- Name link → home; hover `--accent`.
- Tagline: mono 13px muted, `max-width: 24ch` — "i build and ship machine-learning systems."
- Focus list: mono 12px muted, `gap: 4px`, each line prefixed by an em-dash in `--line`:
  machine learning / retrieval / RAG / computer vision / low-level systems.
- Nav, `margin-top: 64px`, groups separated by `gap: 32px`. On home: the three in-page
  sections; elsewhere a single `home` link. Always: `projects`, `resume ↗`.
- Active section link: text `--text` and a leading rule that grows `1.25rem → 2.25rem`
  and turns `--accent`; `height: 1px`, `150ms`. Driven by `IntersectionObserver`
  (`rootMargin: "-35% 0px -55% 0px"`) over `#work`, `#about`, `#contact`.
- Bottom (`margin-top: auto`, `padding-top: 32px`): `github ↗`, `email ↗`, `linkedin ↗`, mono 13px.

**Home** — `app/page.tsx`
Sections `001 — selected work`, `002 — about`, `003 — contact`; eyebrow is
`<num in accent> <em-dash in --line> <label>`, `h2` under it, `margin-bottom: 32px`,
`scroll-margin-top: 32px`.
- **Work rows** (`components/ProjectRow.tsx`): a full-width `<button>` per project,
  `grid-template-columns: auto 1fr auto auto`, `align-items: baseline`, `column-gap: 16px`,
  `padding: 24px 8px`, hairline top (and bottom on the last row), hover `background: var(--surface)`.
  Columns: zero-padded index (mono 13px; accent when open) · title + optional award (mono
  12px accent) + tagline (muted) + tag row · year (mono 13px muted) · chevron `⌄`
  (rotates 180° when open, accent when open).
  Disclosure uses `display: grid; grid-template-rows: 0fr → 1fr` with a `400ms` transition
  and an `overflow: hidden` inner wrapper. Panel body: description `max-width: 60ch`,
  indented `calc(16px + 1.5em)`; then `repo ↗` and `details →` links, mono 13px,
  `gap: 24px`, hover accent + accent underline.
  Below the rows: `all projects →`, mono 13px.
- **About**: one paragraph, `max-width: 62ch`. Then `h3 Experience` (`margin: 48px 0 16px`)
  and the experience list — same disclosure pattern, `padding: 16px 8px`, role (1.125rem/500),
  org (mono 13px accent), period (mono 13px muted, pushed right with `margin-left: auto`),
  chevron; note paragraph muted, `max-width: 62ch`.
- **Contact**: lead paragraph `max-width: 50ch`, then email · github ↗ · linkedin ↗ inline,
  mono 13px, `·` separators in `--line`.

**Projects index** — `app/projects/page.tsx`
Eyebrow `index`, `h1 Projects`, then the same project rows over the full list.

**Project detail** — `app/projects/[slug]/page.tsx`
`article`, `max-width: 60ch`. `← projects` (mono 13px muted, `margin-bottom: 48px`), `h1`
title, tagline muted, meta row `year · award` (award in accent), tag list
(`margin-bottom: 32px`), description, then `repo ↗` at `margin-top: 48px`.

**404** — `app/not-found.tsx`
`404` in accent mono 13px, `h1 Page not found`, `← home` at `margin-top: 32px`.

**Footer** — `components/Footer.tsx`
`border-top: 0.5px solid var(--line)`, `margin-top: clamp(4rem,10vw,6rem)`, inner
`max-width: 46rem`, `padding: 32px clamp(1.25rem,5vw,2rem)`, mono 13px muted:
`© 2026 aryan ahlawat · kingston, on · src ↗`.

> The four-tab switcher pinned top-right in the prototype is a **prototype-only** device for
> flipping between screens. Do not ship it.

## Interactions & Behavior
- Project rows and experience items are independently expandable; multiple can be open at once. State is per-list, keyed by slug / org.
- Row click toggles; `repo` opens the external URL; `details` navigates to the detail route.
- Scroll-spy sets the active rail section (see Rail). Sections use `scroll-margin-top: 32px` for anchor jumps.
- Every hover on a link or muted element goes to `--accent` over `150ms`; text links additionally take an accent bottom border.
- No loading, empty, or error states in this design. No form validation.
- Responsive: the prototype is desktop-first (single `17rem + 1fr` grid). Below the rail's
  breakpoint, follow whatever the repo does today — collapse to one column, rail content
  first, `position: static`, and drop `height: 100dvh`.

## State Management
Client state only, no data fetching:
- `openRows: Record<slug, boolean>` — project disclosures.
- `openExp: Record<org, boolean>` — experience disclosures.
- `activeSection: "work" | "about" | "contact"` — from `IntersectionObserver`; observer attached on mount, disconnected on unmount.
- Filter config: `{ atmosphere: number = 0.2, dither: boolean = true, grain: boolean = true, beamColor: string = "#34c5dd" }`. Hard-code the defaults unless you want them adjustable.

Content stays in `content/profile.ts`, `content/projects.ts`, `content/experience.ts` —
the prototype's copy mirrors those files. Only the two `TODO` URLs below need real values.

## Assets
No images or icons. Glyphs are literal characters: `↗ → ← ⌄ · —`.
Fonts from Google Fonts — Space Grotesk (400/500/700) and JetBrains Mono (400/500);
prefer `next/font` in the repo. The only generated asset is the inline SVG noise tile in
`NullscapeFilter.module.css`.

**Open items:** `https://github.com/TODO` and `https://www.linkedin.com/in/TODO` are
placeholders in the prototype (5 and 2 occurrences). Use the repo's existing values from
`content/profile.ts` / `lib/site.ts`.

## Files
- `Graphite Cyan.dc.html` — the full prototype (open in a browser; all four screens via the top-right switcher).
- `reference/NullscapeFilter.tsx` — drop-in client component for the overlay.
- `reference/NullscapeFilter.module.css` — its styles, keyframes, and the noise tile.
- `reference/tokens.css` — the token block to merge into `app/globals.css`.
