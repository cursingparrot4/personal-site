# Aryan Ahlawat — personal site spec

A personal portfolio + resume site for a Queen's Bachelor of Computing (AI stream) student.
This file is the source of intent. Read it before planning or generating code. Every
placeholder marked `TODO` needs a real value before launch; everything else is decided.

---

## 1. Positioning & voice

Aryan works across **applied ML/AI** (RAG systems, computer vision, regression) with a
**low-level/systems** streak (PID drive-control in C, robotics, API plumbing). The site's
job: make a recruiter or collaborator believe, in ~20 seconds, that this person *builds and
ships real systems* — backed by concrete numbers, not adjectives.

**Voice**
- Sentence case everywhere. Never Title Case, never ALL CAPS, never emoji.
- Concrete over adjectival: "0.82 F1 across 7,000+ users", not "highly skilled in ML".
- First person, terse. No "passionate", "results-driven", "leverage", "cutting-edge".
- The aesthetic is systems/terminal; the *content* is honest ML/AI. Never fake being a
  kernel hacker. The contrast (clean systems styling over ML work) is the point.

---

## 2. Aesthetic direction

Dark **"terminal / systems"** — monospace accents, index-numbered rows, hairline (0.5px)
borders, one accent color, generous whitespace. Inspired by the terminal/IDE world without
literally faking a terminal window.

**Deliberately avoid** (the tells that make a portfolio look auto-generated):
- Fake-terminal chrome (traffic-light dots, blinking prompt, `$` cursors, typewriter effects)
- Purple/indigo gradients, glassmorphism, mesh backgrounds, glow/neon
- "Hi, I'm X 👋" hero, emoji section headers
- Skill bars / "85% proficient in React" meters, tech-logo clouds
- Fade-in-on-scroll on every element
- Everything centered; identical drop-shadowed cards in a grid

Originality comes from intent: deliberate type, restrained motion, real spacing rhythm,
specific content.

---

## 3. Tech stack

- **Next.js (App Router) + TypeScript**, statically rendered (no server data needs).
- **CSS Modules + a `globals.css`** token layer. No Tailwind, no CSS-in-JS runtime.
- **`next/font`** self-hosting Space Grotesk + JetBrains Mono (both on Google Fonts) — no
  layout shift, no external font requests.
- Content is **data-driven** from typed TS files (`content/*.ts`) — a single source of truth.
- Deploy: **Vercel**. Everything static; no runtime backend.
- Lint/format: ESLint (next/core-web-vitals) + Prettier.

---

## 4. Palette — "Graphite Cyan" (dark only)

Graphite near-black base so the cyan accent reads as terminal phosphor. CSS custom
properties in `globals.css`:

```css
:root {
  --bg:         #0D1114;  /* page background */
  --surface:    #161B1F;  /* row hover, chrome */
  --surface-hi: #1E252B;  /* active state */
  --text:       #E2E8EC;  /* primary text */
  --muted:      #8B979E;  /* meta, secondary */
  --border:     #232B31;  /* hairline rules, inert glyphs */
  --accent:     #34C5DD;  /* cyan — links, tags, focus */
  --accent-dim: rgba(52,197,221,0.32); /* tag borders, subtle fills */
  --selection:  rgba(52,197,221,0.28); /* ::selection (text #fff) */
}
```

**Usage rules**
- Accent is used *sparingly*: links, hover/active states, focus rings, tag outlines, the
  index number on a hovered row. It must **never fill a large area**.
- Default link color is `--text` with an accent underline on hover — not accent-by-default,
  which turns prose into a rash of red.
- Elevation is conveyed by `--surface`/`--surface-hi` + `--border`, never by shadow.

**Contrast notes (WCAG)**
- `--text` on `--bg` ≈ 15:1 — excellent.
- `--muted` on `--bg` ≈ 6.5:1 — OK for meta at ≥14px; do **not** use `--muted` for long body
  copy or anything under 14px.
- `--accent` on `--bg` ≈ 9:1 — fine for links/UI and large text; pair with underline so
  color is never the only signal.

**Atmosphere layer** — `components/NullscapeFilter.tsx` mounts two fixed, `aria-hidden`,
`pointer-events: none` stacks that sandwich the page: *atmosphere* at `z-index: 0` (haze,
cyan light beam, fog, vignette) and *texture* at `z-index: 30` (scanlines, dither, colour
bands, animated grain, colour grade). Every opacity is scaled by `--ns-k`, the strength
knob, at `0.2` by default — subtle enough that text stays fully legible. Page content sits
at `z-index: 1` between them (`main`, `footer` in `globals.css`). Animation is dropped
under `prefers-reduced-motion`; the layers stay.

---

## 5. Typography

Two families, self-hosted via `next/font`:

- **Space Grotesk** — name, headings, section titles, body prose. Weights 400/500/700.
- **JetBrains Mono** — metadata, nav, labels, index numbers (`01`), tags, years, footer.
  Weight 400/500.

**Type scale** (expose as CSS vars; base 16px):

| Token            | Family         | Size                          | Weight | Line-height | Tracking | Use                          |
|------------------|----------------|-------------------------------|--------|-------------|----------|------------------------------|
| `--fs-display`   | Space Grotesk  | `clamp(2.5rem, 6vw, 4rem)`    | 500    | 1.05        | -0.02em  | hero name                    |
| `--fs-h2`        | Space Grotesk  | `1.5rem`                      | 500    | 1.15        | -0.01em  | section headings             |
| `--fs-h3`        | Space Grotesk  | `1.125rem`                    | 500    | 1.25        | -0.005em | project name                 |
| `--fs-body`      | Space Grotesk  | `1rem`                        | 400    | 1.65        | 0        | bio, prose                   |
| `--fs-meta`      | JetBrains Mono | `0.8125rem`                   | 400    | 1.5         | 0        | nav, taglines, years         |
| `--fs-label`     | JetBrains Mono | `0.75rem`                     | 500    | 1.4         | 0.06em   | section labels, tags, index  |

**Rules**
- Section headers get a small mono **label + index** above the Space Grotesk title, e.g.
  `` `002 — selected work` `` in mono/`--muted`, then `Selected work` (sentence case) in
  Space Grotesk. This is the core "systems" tell, done tastefully.
- Body line-height generous (1.65). Measure capped at ~66ch.
- Never Title Case or ALL CAPS. Tracking on mono labels only; never letter-space Space Grotesk.

---

## 6. Layout & spacing

- **Two-column shell** (`components/Shell.tsx`): a sticky identity **rail** (left, ~17rem)
  + a scrolling **content** column, inside an `80rem` max-width centered wrapper with
  `--page-pad: clamp(1.25rem, 5vw, 2rem)` gutters. Collapses to a single column below
  **900px**, where the rail becomes a stacked header.
- The rail (`components/Rail.tsx`) holds a mono prompt row (`~/aryanahlawat2006@gmail.com` … `cs · systems`,
  hairline underneath, toggled by `showPrompt`), then name, headline, focus areas, navigation,
  and contact (pinned to the bottom on desktop via `margin-top:auto`). It replaces a top nav bar.
- Content column caps prose at ~62ch; `--container: 46rem` remains available for narrow
  article layouts (project detail).
- **Spacing scale** (4px base), as CSS vars `--space-1…9`:
  `4, 8, 12, 16, 24, 32, 48, 64, 96`.
- **Vertical rhythm between sections:** `clamp(4rem, 10vw, 6rem)` — generous whitespace is
  load-bearing here; do not compress it.
- Dividers are **0.5px** hairlines in `--border` (`border-top: 0.5px solid var(--border)` or
  a 1px rule at 50% opacity for crispness on non-retina). Rows separated by rules, never
  boxed in cards.

---

## 7. Motion & interaction (restrained, purposeful)

- **Expand-in-place:** project rows and experience rows are click-to-expand accordions
  (buttons with `aria-expanded`/`aria-controls`; panels `role="region"` + `inert` when
  closed). Height animates via the `grid-template-rows: 0fr → 1fr` trick, 400ms; the chevron
  rotates 180°. Collapsed shows the summary; expanded reveals the full description + links
  (projects) or the detail note (experience).
- **Scroll-spy rail nav** (`RailNav`, home only): the active section is the last one whose
  top has crossed a line 35% down the viewport — the active item's tick grows and turns
  `--accent`. Derived from scroll position (rAF-throttled `scroll`/`resize`, plus a
  `ResizeObserver` for accordion reflow) rather than raw `IntersectionObserver` callbacks,
  so it stays correct when sections straddle the line, when a section is shorter than the
  band, and when the page bottoms out before the last section reaches the line.
- **Hover:** 150ms ease. Row hover raises a `--surface` background and turns the index +
  chevron toward `--accent`. That's the whole hover vocabulary.
- **Focus:** `outline: 2px solid var(--accent)` via `:focus-visible` on every control.
- **`prefers-reduced-motion: reduce`** collapses all transition durations to ~0 (global
  rule), so accordions snap instead of sliding.

---

## 8. Responsive

- Mobile-first. One breakpoint that matters: **`640px`**.
- `< 640px`: `ProjectRow` stacks (index inline before name; year drops to the meta line);
  nav is a single inline row of links (no hamburger — there are ≤4 links).
- Tap targets ≥ 44px. Hero display size handled by the `clamp()` above.

---

## 9. Accessibility

- Semantic landmarks: `<header>`/`<nav>`, `<main>`, `<section>` with `aria-labelledby`,
  `<footer>`. One `<h1>` (the name).
- **Skip-to-content** link, visible on focus.
- `:focus-visible` rings on every interactive element (§7).
- Links carry a non-color signal (underline) in addition to accent.
- All images/screenshots need real `alt`. External links: `rel="noopener noreferrer"`,
  and mark new-tab links for AT.
- Honor `prefers-reduced-motion`. Test full keyboard traversal of home + projects.

---

## 10. Site map & composition

```
/                 home — about → experience → selected work → contact
/projects         full data-driven project index
/projects/[slug]  optional per-project writeup (screenshots, decisions, metrics)
public/resume.pdf linked from hero (copied from the repo's resume PDF)
```

### `/` home — wireframe (split rail + scrolling content)

```
┌─────────────────────┬────────────────────────────────────────────┐
│ ~/aryan-ahlawat     │  001 — about                               │
│         cs · systems│  About                                     │
│ ─────────────────── │  [bio, capped ~62ch]                       │
│ Aryan Ahlawat       │                                            │
│ i build and ship    │  002 — experience                          │
│ machine-learning …  │  Experience                                │
│                     │  ────────────────────────────────────────  │
│ — machine learning  │  Software Developer Co-op  Co-operators  ⌄ │  ← accordion
│ — retrieval / RAG   │  ────────────────────────────────────────  │
│ — computer vision   │  Design Team Engineer      QMIND         ⌄ │
│ — low-level systems │                                            │
│                     │  003 — projects                            │
│ ──  about           │  Selected work                             │
│ ▬▬▬ experience      │  ────────────────────────────────────────  │  ← scroll-spy
│ ──  projects        │  01  VisualizeIt   [award]          2025 ⌄ │     active tick
│ ──  contact         │      real-time CV + diffusion inpainting   │
│                     │      YOLOv8 · PyTorch · Stable Diffusion   │
│ projects            │  all projects →                            │
│ resume ↗            │                                            │
│                     │  004 — contact                             │
│ github ↗ (pinned    │  Contact                                   │
│ email ↗   to        │  [email] · [github] · [linkedin]           │
│ linkedin ↗ bottom)  │                                            │
└─────────────────────┴────────────────────────────────────────────┘
   sticky (100dvh)        scrolls · footer (© · location · src ↗) spans full width below
```
Below 900px the rail stacks on top as a header (name, tagline, focus, horizontal nav +
contact); the scroll-spy list is hidden.

### `/projects` — full index
Same `ProjectRow` component, all projects (no `featured` filter), optionally grouped by year.
Header: `Projects`. Rows link to `/projects/[slug]` when a writeup exists, else to the repo.

### `/projects/[slug]` — detail (optional, ship writeups incrementally)
`← projects` back-link · project name (h1) · year + stack (mono) · links (repo/demo) ·
2–4 short paragraphs: what it does, key decisions, what the numbers mean · screenshots with
real alt text. No comment sections, no share buttons.

---

## 11. Content (real — from résumé; verify `TODO`s before launch)

### `content/profile.ts`
```ts
export const profile: Profile = {
  name: "Aryan Ahlawat",
  headline: "i build and ship machine-learning systems.", // tune to taste, keep it one honest line
  promptMeta: "cs · systems",                    // right side of the rail's prompt row
  focus: ["machine learning", "retrieval / RAG", "computer vision", "low-level systems"],
  bio:
    "cs student at Queen's on the AI stream, minoring in economics. i work across applied " +
    "ML — RAG pipelines at QMIND, computer vision on VisualizeIt, regression models at " +
    "Acetech — and enjoy the low-level end too, from PID drive-control in C to API plumbing. " +
    "currently a software developer co-op at Co-operators.",
  links: {
    github: "https://github.com/TODO",            // TODO: real handle
    email:  "aryanahlawat2006@gmail.com",         // résumé contact (session email 23tj56@queensu.ca — confirm which to show)
    linkedin: "https://www.linkedin.com/in/TODO", // TODO
  },
  experience: [
    { role: "Software Developer Co-op", org: "Co-operators",         period: "May–Aug 2026", note: "RESTful Prefill API integrations for real-time quote auto-population (AWS Lambda, Lex, Python)." },
    { role: "Design Team Engineer",     org: "QMIND",                period: "Sep 2025–Apr 2026", note: "Cognitive RAG system — LangChain agents, hybrid BM25 + dense retrieval, RRF + cross-encoder re-ranking." },
    { role: "Machine Learning Co-op",   org: "Acetech",              period: "May–Aug 2025", note: "PyTorch MLP regression for lab-test durations — 12% MSE reduction over baseline; automated data-cleaning pipelines." },
    { role: "Drive Control Developer",  org: "Queen's Knights Robotics", period: "Oct 2024–Mar 2025", note: "Low-level drive-control in C/FreeRTOS, PID controllers; motion algorithms cut path deviation ~20%." },
    { role: "Research Assistant",       org: "University of Toronto", period: "Jun 2023–Feb 2024", note: "Agent-based economic simulations (COBWEB) modeling cooperative vs. competitive behavior." },
  ],
};
```

### `content/projects.ts`
```ts
export const projects: Project[] = [
  {
    slug: "visualizeit",
    name: "VisualizeIt",
    tagline: "real-time computer vision + diffusion inpainting.",
    description: "YOLOv8 (Nano) for millisecond object detection anchoring OpenCV CSRT tracking, with Stable Diffusion inpainting to map context-aware texture overlays onto tracked regions.",
    stack: ["YOLOv8", "PyTorch", "Stable Diffusion", "OpenCV"],
    year: 2025,
    award: "Mayor's Innovation Award",
    links: { repo: "https://github.com/TODO", demo: undefined }, // TODO
    featured: true,
  },
  {
    slug: "cognitive-rag",
    name: "Cognitive RAG",
    tagline: "hybrid retrieval for multi-hop question answering.",
    description: "LangChain agents over a hybrid retrieval pipeline (BM25 sparse + bi-encoder dense), fused with reciprocal rank fusion and a Hugging Face cross-encoder re-ranker for precision on multi-hop QA. (QMIND design-team work.)",
    stack: ["LangChain", "BM25", "cross-encoder", "Python"],
    year: 2026,
    links: { repo: "https://github.com/TODO" }, // TODO — confirm shareable
    featured: true,
  },
  {
    slug: "churn-classification-engine",
    name: "Churn Classification Engine",
    tagline: "0.82 F1 across 7,000+ users.",
    description: "End-to-end classification pipeline (logistic regression + random-forest ensembles) segmenting 7,000+ users by churn probability.",
    stack: ["Python", "scikit-learn", "seaborn"],
    year: 2025,
    links: { repo: "https://github.com/TODO" }, // TODO
    featured: true,
  },
];
```
> Featured seeds 3 rows for the home page. Add/prune freely; adding a project is one object.
> The `Cognitive RAG` entry is derived from QMIND experience — drop it if you'd rather keep
> `projects` to standalone builds only.

---

## 12. Data model

```ts
export type Project = {
  slug: string;
  name: string;
  tagline: string;       // one honest line, sentence case
  description?: string;  // detail page
  stack: string[];       // ["PyTorch", "LangChain"]
  year: number;
  award?: string;        // e.g. "Mayor's Innovation Award"
  links: { repo?: string; demo?: string; writeup?: string };
  featured?: boolean;    // shown on home
};

export type Profile = {
  name: string;
  headline: string;      // one line, what you do
  focus: string[];       // ["machine learning", ...]
  bio: string;
  links: { github: string; email: string; linkedin?: string };
  experience: { role: string; org: string; period: string; note?: string }[];
};
```

---

## 13. Components (contracts)

```
components/
  Shell.tsx        two-column layout: <Rail> + scrolling content. Optional `sections` prop.
  Rail.tsx         sticky identity rail: name (→ /), headline, focus list, nav, contact.
  RailNav.tsx      (client) in-page scroll-spy nav for the home sections.
  Footer.tsx       mono: © year · name · location · "src ↗" link to the repo.
  Section.tsx      props: { id; index; label; title; children }. Mono "NNN — label" eyebrow
                   + Space Grotesk title + rhythm; id doubles as the scroll-spy anchor.
  ProjectRow.tsx   (client) expandable row. Collapsed: index | name/tagline/stack | year |
                   chevron. Expanded: description + repo/demo/details links.
  ExperienceList.tsx (client) <ol> of expandable role/org rows; expand reveals the note.
                   Right gutter is a timeline: one static spine capped on the first and
                   last node, each row's node + date centred on the row box so they glide
                   down as it expands. Open state = accent node/date/title, never the line.
  InlineLink.tsx   the one link style: text color, accent underline on hover, optional ↗.
  Tag.tsx          mono pill, --accent-dim border, no fill. Used for stack items.
```
Server components by default; `RailNav`, `ProjectRow`, and `ExperienceList` are client
components (local expand state / IntersectionObserver).

---

## 14. SEO & metadata

- Next Metadata API in `app/layout.tsx`: title template `"%s — Aryan Ahlawat"`, description,
  canonical, Open Graph + Twitter card.
- **Static OG image** (`app/opengraph-image.tsx` via `next/og`) — name + headline on `--bg`,
  Space Grotesk. No stock art.
- `app/sitemap.ts`, `app/robots.ts`, favicon/apple-icon.
- **JSON-LD `Person`** in the home page (name, url, sameAs: github/linkedin, alumniOf Queen's).
- `lang="en"`, sensible `<title>` per route.

---

## 15. File structure

```
app/
  layout.tsx            root layout, fonts, metadata, theme tokens, skip-link
  page.tsx              home
  globals.css           palette + spacing + type tokens, base element styles
  opengraph-image.tsx   generated OG card
  sitemap.ts robots.ts
  projects/
    page.tsx            full index
    [slug]/page.tsx     detail (optional per project)
components/             Nav, Footer, Section, Hero, ProjectRow, Tag  (+ .module.css each)
content/
  projects.ts           typed project data (single source of truth)
  profile.ts            name, headline, bio, links, experience
lib/
  types.ts              Project, Profile
public/
  resume.pdf            copied from "Aryan Ahlawat Resume-6.pdf"
```

---

## 16. Build order

1. Scaffold Next.js + TS; wire `globals.css` tokens (§4–6) and `next/font` (§5).
2. Primitives: `Section`, `Nav`, `Footer` — lock the rhythm first.
3. Home: `Hero` → featured `ProjectRow` list from `content/projects.ts` → about/experience
   → contact.
4. `/projects` full index reusing `ProjectRow`.
5. Optional `/projects/[slug]` writeups.
6. `resume.pdf`, OG image, sitemap/robots, JSON-LD, Vercel deploy.

---

## 17. Definition of done / verification

- `next build` clean; no console warnings; no CLS from fonts.
- Lighthouse ≥ 95 perf/a11y/best-practices/SEO on `/`.
- Full keyboard traversal of `/` and `/projects`; visible focus rings; skip-link works.
- `prefers-reduced-motion` disables the entrance (verify in devtools).
- 375px and 1440px both correct; no horizontal scroll.
- Every `TODO` (github, linkedin, repo links, which email) resolved before launch.
