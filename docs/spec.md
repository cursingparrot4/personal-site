# Aryan Ahlawat — personal site spec

A personal portfolio + resume site for a Queen's Bachelor of Computing (AI stream) student.
This file is the source of intent. Read it before planning or generating code. Every
placeholder marked `TODO` needs a real value before launch; everything else is decided.

---

## 1. Positioning & voice

Aryan works across **applied ML/AI** (RAG systems, computer vision, regression) with a
**low-level/systems** streak (PID drive-control in C, robotics, API plumbing). The site's
job: make a recruiter or collaborator believe, in ~20 seconds, that this person _builds and
ships real systems_ — backed by concrete numbers, not adjectives.

**Voice**

- Sentence case everywhere. Never Title Case, never ALL CAPS, never emoji.
- Concrete over adjectival: "0.82 F1 across 7,000+ users", not "highly skilled in ML".
- First person, terse. No "passionate", "results-driven", "leverage", "cutting-edge".
- The aesthetic is systems/terminal; the _content_ is honest ML/AI. Never fake being a
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

- **Next.js (App Router) + TypeScript**, statically rendered (no server data needs). The one
  live value on the site — the rail's Discord presence line (§6a) — is subscribed to from the
  browser, so every route stays static and there is still no backend.
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
  --bg: #0d1114; /* page background */
  --surface: #161b1f; /* row hover, chrome */
  --surface-hi: #1e252b; /* active state */
  --text: #e2e8ec; /* primary text */
  --muted: #8b979e; /* meta, secondary */
  --border: #232b31; /* hairline rules, inert glyphs */
  --accent: #34c5dd; /* cyan — links, tags, focus */
  --accent-dim: rgba(52, 197, 221, 0.32); /* tag borders, subtle fills */
  --selection: rgba(52, 197, 221, 0.28); /* ::selection (text #fff) */
}
```

**Usage rules**

- Accent is used _sparingly_: links, hover/active states, focus rings, tag outlines, the
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
`pointer-events: none` stacks that sandwich the page: _atmosphere_ at `z-index: 0` (haze,
cyan light beam, fog, vignette) and _texture_ at `z-index: 30` (scanlines, dither, colour
bands, animated grain, colour grade). Every opacity is scaled by `--ns-k`, the strength
knob, at `0.2` by default — subtle enough that text stays fully legible. Page content sits
at `z-index: 1` between them (`main` in `globals.css`). Animation is dropped
under `prefers-reduced-motion`; the layers stay.

---

## 5. Typography

Two families, self-hosted via `next/font`:

- **Space Grotesk** — name, headings, section titles, body prose. Weights 400/500.
  (700 was loaded for a while but nothing ever used it — every heading is 500.)
- **JetBrains Mono** — metadata, nav, labels, index numbers (`01`), tags, years, timeline
  labels. Weight 400/500.

**Type scale** (expose as CSS vars; base 16px):

| Token          | Family         | Size                       | Weight | Line-height | Tracking | Use                         |
| -------------- | -------------- | -------------------------- | ------ | ----------- | -------- | --------------------------- |
| `--fs-display` | Space Grotesk  | `clamp(2.5rem, 6vw, 4rem)` | 500    | 1.05        | -0.02em  | hero name                   |
| `--fs-h2`      | Space Grotesk  | `1.5rem`                   | 500    | 1.15        | -0.01em  | section headings            |
| `--fs-h3`      | Space Grotesk  | `1.125rem`                 | 500    | 1.25        | -0.005em | project name                |
| `--fs-body`    | Space Grotesk  | `1rem`                     | 400    | 1.65        | 0        | bio, prose                  |
| `--fs-meta`    | JetBrains Mono | `0.8125rem`                | 400    | 1.5         | 0        | nav, taglines, years        |
| `--fs-label`   | JetBrains Mono | `0.75rem`                  | 500    | 1.4         | 0.06em   | section labels, tags, index |

**Rules**

- Section headers get a small mono **label + index** above the Space Grotesk title, e.g.
  `` `002 — selected work` `` in mono/`--muted`, then `Selected work` (sentence case) in
  Space Grotesk. This is the core "systems" tell, done tastefully.
- Body line-height generous (1.65). Measure capped at ~66ch.
- Never Title Case or ALL CAPS. Tracking on mono labels only; never letter-space Space Grotesk.

---

## 6. Layout & spacing

- **Two-column shell** (`components/Shell.tsx`): a sticky identity **rail** (left, ~17rem)
  - a scrolling **content** column, inside an `80rem` max-width centered wrapper with
    `--page-pad: clamp(1.25rem, 5vw, 2rem)` gutters. Collapses to a single column below
    **900px**, where the rail becomes a stacked header.
- The rail (`components/Rail.tsx`) holds a mono prompt row (`~/aryan-ahlawat` … `cs · systems`,
  hairline underneath, toggled by `showPrompt`), then name, headline, a **`now` list**,
  navigation, an availability block (the live presence line §6a, then `profile.status` and
  `profile.location`) and a contact block holding resume ↗, github ↗, email ↗ and linkedin ↗.
  It replaces a top nav bar.
- **The `now` list is labelled; the old focus list wasn't.** It used to be four domains
  (`machine learning`, `retrieval / RAG`, …), which announced themselves as a taxonomy on
  sight. Two lines of current work do not — `— API integrations at Co-operators` with nothing
  above it reads as an orphaned fragment — so a mono `currently working on` eyebrow sits over
  it. (The field is `profile.now`; the eyebrow is a literal in `Rail.tsx`, so the label can be
  reworded without touching the data.) The list is meant to go stale and be edited; that is
  what makes it worth reading.
- **The nav is one tree, identical on every page** (`RailNav`): `Home`, the home page's
  sections indented under it against a hairline, then `All projects` back at Home's level.
  A lone "Home" link on /projects read as a leftover next to the home page's section list;
  giving both rails the same shape fixes that and makes /projects reachable from anywhere,
  not only from the "All projects →" line at the end of the home page. Section links are
  in-page anchors with scroll-spy on `/` and `/#id` links elsewhere. Exactly one entry
  carries `--accent`: the section you're reading on the home page (its tick also grows), or
  the current page's top-level entry anywhere else.
- **The rail's lower half is one unit.** `margin-top: auto` goes on the _availability_ block,
  with contact directly beneath it under a hairline. Pinning only the links left a few
  hundred px of dead space between the nav and the bottom of the rail on tall viewports.
- **No footer.** The page ends with the contact section. A closing rule carrying the year,
  name, location and a link to the repo was built and then removed: every value in it
  already appears in the rail, which is on screen the whole time, so it amounted to a second
  copy of the identity block wearing a horizontal rule. Nothing needs a site-wide bottom
  edge. `lib/site.ts` lost its `repo` field with it.
- Content column caps prose at ~62ch; `--container: 46rem` remains available for narrow
  article layouts.
- **Spacing scale** (4px base), as CSS vars `--space-1…9`:
  `4, 8, 12, 16, 24, 32, 48, 64, 96`.
- **Vertical rhythm between sections:** `clamp(4rem, 10vw, 6rem)` — generous whitespace is
  load-bearing here; do not compress it.
- Dividers are **0.5px** hairlines in `--border` (`border-top: 0.5px solid var(--border)` or
  a 1px rule at 50% opacity for crispness on non-retina). Rows separated by rules, never
  boxed in cards.

---

## 6a. The presence line

The availability block **leads** with a live line, when there is one: `Playing Geometry Dash`
or `Listening to <song> — <artist>`. Sentence case, matching the two fixed lines under it;
only the verb is capitalised, since the subject is a game or track title that carries its own
casing. It goes first because it is the only line in the rail that changes — putting the two
fixed lines above it made the one moving thing the easiest to miss. It comes from
**[Lanyard](https://github.com/Phineas/lanyard)** over `wss://api.lanyard.rest/socket` —
subscribe with op 2 (`subscribe_to_id`, which returns the presence object _bare_, not keyed by
id), heartbeat with op 3 on the interval op 1 hands you, read op 0 `INIT_STATE` /
`PRESENCE_UPDATE`. It requires the Discord account to have joined `discord.gg/lanyard`, and
`profile.discordId` ships in the client bundle — both are inherent to the service.

**Only an activity earns the line.** A bare status — `online`, `idle`, `dnd`, `offline` —
renders _nothing at all_, and so do no id, no socket, and too many reconnects. "He has Discord
open" is not news, and the availability line directly below already states whether he's
reachable; what he's *doing* is the only part that justifies a row. Collapsing the empty and
the unknown cases into the same blank also means an outage is indistinguishable from a quiet
evening — the two lines below (availability and location) are the ones that always have to be
there, so a failure costs the rail a line it can spare rather than showing a broken one.
Reconnects back off (2s, 4s, 8s…) and stop after five consecutive failures; any presence
message resets the count.

**It carries the same dot as the availability line.** Accent and pulsing while he is
reachable, `--muted` and still once he isn't — one mark with two states, so colour does the
work rather than a second visual idiom. `dnd` counts as unreachable, so an activity reported
while busy keeps the line but takes the grey dot: the dot answers "can you reach him", not "is
the client open". Discord's own green/amber/red stays out of it: three
new colours in a palette that allows one (§4). The grey is `--muted` rather than the `--border`
that §4 reserves for inert glyphs, because `--border` at 6px on `--bg` is effectively
invisible, and a state you cannot see is not a state.

Within the line, the verb is `--muted` and the subject is `--text`: the game or the track is
the information. A long track title truncates with an ellipsis and keeps the full string in
`title` — wrapping to three lines would push the contact block off the bottom of a `100dvh`
rail. Below 900px it wraps instead, since a stacked header has no such ceiling. That is
load-bearing rather than cosmetic: the rail is a grid item at `min-width: auto`, so one
unbreakable line sets the whole rail's min-content width and scrolls the page sideways —
633px of it, at a 375px viewport.

**Only activity type 0 (playing) and Spotify are surfaced** — which is to say, the two that
are genuinely activities. A custom status is text the user wrote rather than something they're
doing, and rich-presence `details` ("Editing README.md") is more than a sidebar should leak.

---

## 7. Motion & interaction (restrained, purposeful)

- **Expand-in-place:** project rows and experience rows are click-to-expand accordions
  (buttons with `aria-expanded`/`aria-controls`; panels `role="region"`, labelled by the
  row's title via `aria-labelledby`, and `inert` when closed). Height animates via the
  `grid-template-rows: 0fr → 1fr` trick, 400ms; the chevron rotates 180°. Collapsed shows
  the summary; expanded reveals the full description + links (projects) or the detail note
  (experience) — panel text is `--text` in both, since the panel is what you opened the row
  to read. Open state moves one colour in the header, the same in both: the date/period and
  the chevron go `--accent` while the title holds `--text`, so the accent marks the row
  rather than restating its name. An experience row without a note renders its header as a
  plain div, not a disabled button — a disabled button would leave the tab order anyway and
  would also swallow the hover that lights the row's bar in the timeline (§7a).
- **Scroll-spy rail nav** (`RailNav`, home only): the active section is the last one whose
  top has crossed a line 35% down the viewport — the active item's tick grows and turns
  `--accent`. Derived from scroll position (rAF-throttled `scroll`/`resize`, plus a
  `ResizeObserver` for accordion reflow) rather than raw `IntersectionObserver` callbacks,
  so it stays correct when sections straddle the line, when a section is shorter than the
  band, and when the page bottoms out before the last section reaches the line.
- **The line eases in at the top.** There is no scroll room above the first section, so a
  line fixed at 35% gives that section only (its top − the line) pixels of scroll before the
  second one crosses: About was lit for 17px of an 1100px page, and on a viewport past
  ~950px tall it never lit at all. So the line starts on the first section's own top and
  slides down with the page until it reaches its resting height — each section then gets a
  share of the scroll close to its share of the page. Below the fold the behaviour is
  unchanged. Note the consequence at the other end: a short last section at the document
  edge can't reach the line either, so Contact lights via the bottom-of-page snap alone.
- **A click beats the inference.** Clicking a nav link lights that section immediately and
  suspends the spy until you scroll again yourself. Geometry alone can't honour the click:
  a section shorter than the 35% band leaves the _next_ one already past the line once the
  anchor lands, so the wrong entry lit until you nudged the page back up. The lock records
  where the smooth scroll came to rest (the last `scroll` event plus 140ms of quiet) and
  releases as soon as the page moves off it.
- **Entrance:** one staggered reveal on load — opacity 0 → 1 with an 8px rise, 400ms, the
  rail's four blocks at 0/60/120/160ms and the content column at 60ms. Never scroll-driven
  (§2 rules that out) and never re-run. Lives in `globals.css` as the `rise` / `rise-1..3`
  utilities: CSS Modules hashes both `@keyframes` names and the `animation-name` pointing at
  them, so a module-local declaration silently animates nothing. The hidden state exists
  only inside the keyframe (`animation-fill-mode: backwards`, no resting `opacity: 0`), so
  content that never animates is visible rather than invisible.
- **Hover:** 150ms ease. Row hover raises a `--surface` background and turns the index +
  chevron toward `--accent`. Link underlines grow from the left (an animated
  `background-size`, not a border colour swap). That's the whole hover vocabulary.
- **Focus:** `outline: 2px solid var(--accent)` via `:focus-visible` on every control.
- **`prefers-reduced-motion: reduce`** collapses all transition durations to ~0 (global
  rule), so accordions snap instead of sliding.

---

## 7a. The timeline

The experience section leads with a **timeline** (`components/Timeline.tsx`), then the
expandable rows.

Each role carries `start` / `end` as `"YYYY-MM"` alongside its display `period`. The
timeline maps them onto one axis — a label column of orgs, a plot with a January gridline
per year, and one bar per role placed by start and sized by duration. Below the roles, a
**projects lane** puts a dot per project on the same axis.

The point is that it encodes something the lists cannot: how long each role actually ran,
where they overlap, where the gaps are, and what got built in between. The earlier version —
a static spine with an evenly spaced node per row — was decorative by construction, giving a
four-month co-op and a nine-month term identical weight.

It also paid for itself structurally. That spine lived in a fixed right gutter whose width
was set by the longest period string (`"Sep 2025–Apr 2026"`), and the project rows were
pinned to the same width so the two lists' dates aligned. On a 390px screen that gutter left
~190px of text column: five-line taglines, two-line roles. With the temporal reading moved
into the timeline, both lists just push their date to the end of the row, the shared
`--rail-w` / `--track-w` tokens are gone, and the mobile special-cases went with them.

**Projects have a year, not a month.** Projects sharing a year are spread evenly across it
(two 2026 projects land in April and August) purely so they don't stack. That offset is
spacing, not data — which is why each dot names its project and its year to assistive tech
instead of leaving position to do the talking, and why the lane shows every project rather
than only the featured ones.

**Nothing is labelled until it's the one you mean.** Five project names along one lane would
be unreadable, so a dot's name is painted only while that dot is lit, positioned above it and
hanging inward at the ends of the plot so a long name can't run off the edge. The role bars
need no such treatment — their org already sits in the label column.

**Lighting.** Marks rest at `--accent-dim`. Two lit states, distinct because they mean
different things:

- `peek` — pointer or keyboard focus, on the mark _or_ on its row: full `--accent`, and the
  matching row raises its `--surface` hover background. A momentary "this one".
- `lit` — the row is expanded: full `--accent` plus an `--accent-dim` halo, and dots grow.
  A state you left behind and can scroll back to.

The wiring is `components/TimelineContext.tsx`: rows keep owning their own open state and
merely announce it, and the timeline renders as a pure mirror with no state of its own.
Without a provider — `/projects`, which has rows but no timeline — every signal is a no-op.
Nothing lights up by default; there is no "most recent" bar that stays on.

**Accessibility.** The role lanes are one `role="img"` with a summary label: every bar
restates a period the list spells out in text directly below, so exposing the lanes
individually would only duplicate it. The project dots sit outside that group, because they
are real links to `/projects#<slug>` and each carries its own accessible name.

---

## 8. Responsive

- Mobile-first. Two breakpoints: **`900px`** (rail → stacked header) and **`640px`**
  (tighter gutters), plus a narrow **`34rem`** step described below.
- One local step at **`760px`**, in `Section.module.css`: a section with an `aside` goes
  single-column and the panel moves from column 2 to row 1, above the eyebrow (§13, §14c).
- `< 640px`: nav is a single inline row of links (no hamburger — there are ≤4 links).
- Neither list reserves a fixed date gutter any more (§7a). Both push their date to the end
  of the row with `margin-left: auto`, so the two right-align on the same edge at every
  width and the layout has nothing to special-case. Below `34rem` the experience period
  drops onto its own line rather than competing with the role for one flex row, and the
  timeline's label column narrows to `5.5rem`.
- Tap targets ≥ 44px. The timeline's dots are the one exception: a transparent
  pseudo-element widens each from 10px to ~26px, but going further would make neighbouring
  dots overlap on a narrow plot. They're a shortcut, not a route — every project is still
  reachable from the rows below and from `/projects`. Hero display size handled by the
  `clamp()` above.

---

## 9. Accessibility

- Semantic landmarks: `<header>`/`<nav>`, `<main>`, `<section>` with `aria-labelledby`.
  One `<h1>` (the name).
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
/projects         full data-driven project index; #<slug> opens a row
public/resume.pdf linked from the rail's contact block
```

### `/` home — wireframe (split rail + scrolling content)

```
┌─────────────────────┬────────────────────────────────────────────┐
│ ~/aryan-ahlawat     │  001 — about                               │
│         cs · systems│  About                                     │
│ ─────────────────── │  [bio, ~54ch]      ┌──────────────────┐    │
│ Aryan Ahlawat       │                    │ GET / cURL⌄    ⧉ │    │  ← §14c
│                     │                    │ $ curl arya….dev │    │
│                     │                    │ 200 · text/plain │    │
│                     │                    └──────────────────┘    │
│ cs at queen's, ai   │  002 — experience                          │
│ stream.             │  Experience                                │
│                     │  Co-operators │           ▬▬▬              │  ← timeline
│ currently working on│  QMIND        │      ▬▬▬▬▬▬                │
│ — api integrations  │  Acetech      │   ▬▬▬                      │
│   at co-operators   │  Projects     │    ●    ●  ●     ●   ●     │
│ — rl agent that     │  ────────────────────────────────────────  │
│   plays geo dash    │  Software Dev Co-op  Co-operators  May–Aug⌄│  ← accordion
│                     │  ────────────────────────────────────────  │
│                     │  003 — projects                            │
│ ▬▬  home            │  Selected work                             │  ← current page
│   │ ──  about       │  ────────────────────────────────────────  │
│   │ ▬▬▬ experience  │  01  VisualizeIt   [award]          2025 ⌄ │  ← scroll-spy
│   │ ──  projects    │      real-time CV + diffusion inpainting   │     active tick
│   │ ──  contact     │      YOLOv8 · PyTorch · Stable Diffusion   │
│ ──  all projects    │  All projects →                            │
│                     │                                            │
│ ● Playing geo dash  │  004 — contact                             │  ← live (§6a); the row
│ ● Open to winter    │  Contact                                   │    is gone when he's
│   2027 internships  │  one line · mailto on "reach out"          │    playing nothing
│   Toronto, ON       │                                            │
│ ─────────────────── │                                            │
│ resume ↗  (this     │                                            │
│ github ↗   half     │                                            │
│ email ↗    pinned   │                                            │
│ linkedin ↗ to base) │                                            │
└─────────────────────┴────────────────────────────────────────────┘
   sticky (100dvh)        scrolls · no footer; the page ends with the content
```

Below 900px the rail stacks on top as a header (name, tagline, the `now` list, horizontal
nav, availability + contact). The nav tree flattens to the pages you aren't on: the section
list is hidden (you just scroll) and so is the entry for the current page, which on the
home page leaves a lone "all projects". The availability block turns into one inline meta
row; the presence line keeps its dot there and so takes no `·` separator, unlike the location.

**Contact carries no link list.** Resume/GitHub/email/LinkedIn are in the rail on every
page; repeating them below only splits the target. The section is one sentence with the
mailto on "reach out" — enough that the page ends on something clickable without duplicating
the rail.

### `/projects` — full index

Same `ProjectRow` component, all projects (no `featured` filter), optionally grouped by year.
Header: `Projects`. Rows expand in place; each carries `id={slug}`, so `/projects#<slug>`
lands on a row already open — which is where the timeline dots point.

**No per-project detail pages.** A `/projects/[slug]` route was built and then removed: its
page was the expanded row again — tagline, stack, description, the same repo/demo/devpost
links — one navigation further away, and there is no second tier of writeup content coming
to fill it. The index plus an anchor says everything the route said.

---

## 11. Content

Content is **not specified here** — it lives in the repo and changes independently of
this document:

- `content/profile.ts` — name, headline, bio, focus list, links, experience.
- `content/projects.ts` — the project list. `featured: true` puts one on the home page.
- `lib/site.ts` — name, domain, description. Feeds metadata, sitemap and robots.
- `lib/types.ts` — the shapes those files must satisfy (see also §12 below).

This section used to inline a full copy of both content files. It drifted out of date the
first time the résumé changed, so the copy was removed rather than maintained twice. Read
the actual files; they are short and commented.

---

## 12. Data model

```ts
export type Project = {
  slug: string; // the row's anchor (/projects#<slug>) and its timeline key
  name: string;
  tagline: string; // one honest line, sentence case
  description?: string; // shown when the row expands
  stack: string[]; // ["PyTorch", "LangChain"]
  year: number;
  award?: string; // e.g. "Mayor's Innovation Award"
  links: { repo?: string; demo?: string; devpost?: string };
  featured?: boolean; // shown on home
};

export type Experience = {
  role: string;
  org: string;
  period: string; // display string, e.g. "May–Aug 2026" — word it however you like
  start: string; // "YYYY-MM", inclusive. Places and sizes the timeline bar (§7a)
  end: string; // "YYYY-MM", inclusive
  note?: string[]; // one string per bullet; omit and the row simply isn't expandable
};

export type Profile = {
  name: string;
  headline: string; // one line, what you do
  promptMeta: string; // right side of the rail's prompt row, e.g. "cs · systems"
  now: string[]; // the rail's "now" list — 2–3 items, meant to be edited (§6)
  bio: string;
  location: string; // rail availability block + footer
  status?: string; // availability line; omit to hide the block entirely
  discordId?: string; // Discord snowflake for the presence line (§6a); omit to hide it
  links: { github: string; email: string; linkedin?: string };
  experience: Experience[];
};
```

`start`/`end` are separate from `period` deliberately: the timeline needs real months, while
`period` stays free to read however it wants. The array is **newest-first** and every list
renders in array order.

---

## 13. Components (contracts)

```
components/
  Shell.tsx        two-column layout: <Rail> + scrolling content. Optional `page` prop
                   ("home" | "projects") — which nav entry is current.
  Rail.tsx         sticky identity rail: name (→ /), headline, "now" list, nav,
                   availability, contact.
  Presence.tsx     (client) the live Discord presence line (§6a), first row of the
                   status block. Props: { userId? }. Owns the Lanyard socket, the
                   heartbeat and the backoff; renders null unless there's an activity
                   to name, and a grey-dotted line when that activity is reported
                   while he's on do-not-disturb. Styles live in
                   Rail.module.css — it renders inside the rail's status block.
  RailNav.tsx      (client) the nav tree (§6); scroll-spy + click lock on the home page.
                   Section list lives in lib/nav.ts, shared with app/page.tsx.
  PageHeader.tsx   eyebrow + big title, shared by /projects and 404.
  Section.tsx      props: { id; index; label; title; tight?; aside?; children }. Mono
                   "NNN — label" eyebrow + Space Grotesk title + rhythm; id doubles as the
                   scroll-spy anchor. `tight` pulls the section up toward a prose-ended one
                   above. `aside` is a side panel rendered as a *sibling* of the eyebrow /
                   title / body rows — the section becomes the grid and places all four, so
                   the panel can sit in column 2 on desktop and take row 1, above the
                   eyebrow, once the columns collapse. Last in the DOM either way, so the
                   prose keeps the reading and tab order.
  EndpointCard.tsx (client) the API-reference panel beside the bio (§14c): a url bar
                   (method + host), a tablist of clients (cURL / PowerShell / npx) over the
                   command, and a response row. Commands derive from lib/site.ts, never a
                   typed-in domain.
  ProjectRow.tsx   (client) expandable row, id={slug}. Collapsed: index |
                   name/tagline/stack | year | chevron. Expanded: description +
                   repo/demo/devpost links. Opens itself when the hash names it.
                   Reports open/hover to the timeline (§7a).
  ExperienceList.tsx (client) <ol> of expandable role/org rows; expand reveals the note.
                   Period is inline at the end of the header row, not in a gutter.
                   Open state = accent period/chevron. Also reports to the timeline.
  Timeline.tsx     (client) role bars + project dots on one month axis (§7a). Pure mirror
                   of the two lists — props in, no state of its own.
  TimelineContext.tsx  (client) the open/peek channel between the rows and the timeline,
                   plus the provider that wraps the experience + projects sections. Renders
                   no DOM; absent provider = every signal is a no-op.
  links.tsx        InlineLink (prose links) + ExternalLink (new tab, safe rel, trailing ↗).
                   Colour/underline come from the link-* utilities, not from this file.
  Tag.tsx          mono pill, --accent-dim border, no fill. Used for stack items.
  NullscapeFilter.tsx  decorative overlay, mounted once in the root layout.
```

Server components by default; `RailNav`, `ProjectRow`, `ExperienceList`, `Timeline`,
`TimelineProvider`, `Presence` and `EndpointCard` are client components (local expand state,
scroll position, shared highlight state, a live socket, a tablist + clipboard).

---

## 14. SEO & metadata

- Next Metadata API in `app/layout.tsx`: title template `"%s — Aryan Ahlawat"`, description,
  canonical, Open Graph + Twitter card. **Canonical is per route:** metadata merges
  shallowly, so a page that doesn't set `alternates.canonical` inherits the root layout's
  `"/"` and declares itself a duplicate of the home page (this shipped for a while on
  `/projects`). Every new page must set its own.
- **Static OG image** — `app/opengraph-image.png`, committed, with its alt text in
  `app/opengraph-image.alt.txt`. Name + a one-line summary on `--bg`, Space Grotesk, no
  stock art. Rendered from `docs/opengraph-image.source.html` by screenshotting it at
  1200×630 rather than generated by `next/og`: `@vercel/og` fails to prerender on Windows
  (`fileURLToPath` on a bundled font path), and shooting real HTML gets the actual Space
  Grotesk / JetBrains Mono instead of the fallback face. Regeneration steps are in the
  comment at the top of that file. It deliberately does **not** use `profile.headline` — a
  placeholder there would become the preview text on every share.
- `app/sitemap.ts`, `app/robots.ts`, `app/icon.svg`.
- **JSON-LD `Person`** in the home page (name, url, sameAs: github/linkedin, alumniOf Queen's).
- `lang="en"`, sensible `<title>` per route.

---

## 14a. The terminal view

The site's whole aesthetic is a terminal — `~/.profile` section labels, a monospace rail, a
`~/` prompt row. So a request from an actual terminal should get an actual terminal page.
`curl -L aryanahlawat.dev` prints the site as coloured text; a browser is untouched.

The `-L` is not incidental and every example in the repo carries it. A bare hostname means
`http://`, which the host force-upgrades to https with a `308`; curl does not follow that
unless asked, so the command without it returns fourteen bytes reading `Redirecting...`.
Windows PowerShell has the sharper version of the same edge — 5.1 refuses to follow a 308 at
all — which is why its listed command spells out `https://` rather than relying on a flag.

**It is a rendering of the site, not a second site.** It reads the same `content/` modules
the pages do, mirrors their section numbers and labels, and adds nothing of its own. This is
the property the whole thing is for: there is no copy to update, so there is nothing to
forget. Adding a project gives it a row in both places or neither.

Consequently it **declines to invent content the HTML site doesn't have.** No education
block, no skills list — neither exists as structured data, and a terminal-only version of
either would be the one thing here that can drift. If they're wanted, they get added to the
`Profile` type first and both surfaces render them.

**Colour is the same four tokens (§4) and no others.** Accent for the things accent already
owns — section numbers, awards, tags, links, timeline bars — muted for meta, border for
rules. One flourish: the name fades accent → text across its characters.

Body prose is the single deliberate departure from the stylesheet: it is left **uncoloured**,
taking the terminal's own foreground. The site is dark-only because it controls its own
background; a terminal doesn't, and `--text` on a light profile would be white on white.
Accent, muted and border stay because all three are legible on either.

**Who gets it.** Crawlers are checked first and always get the HTML — Googlebot needs it to
index the site and Discord/Slack/Twitter need it to unfurl, and the OG card (§14) is only
reachable through the `<head>`. Only user agents that are unambiguously a terminal are
diverted; anything vaguer is as likely to be a scraper that wants markup. `/txt` is always
reachable by name, so nothing depends on the sniff being clever.

Requests are **rewritten, not redirected**: the URL you typed is the URL you keep.

Width can't be detected over HTTP, so it renders to 80 columns and takes `?w=` to change it.
Nothing but a long URL is ever allowed past the margin — breaking one would cost the reader
both the click and the copy-paste.

---

## 14b. The terminal app (`npx aryanahlawat`)

The `curl` view is a document: one response, printed, done. It cannot answer a keypress or
notice the window changing, because by then nothing of ours is still running. Interaction
needs code on the reader's machine, which is what `cli/` is — a dependency-free Node package
that draws the same portfolio as a real application.

**What it adds over the text view, and nothing more:** rows that expand in place, section
navigation, links that open, and a layout that refits when the window does. These are
precisely the things the website already does that a static response can't. It is not a
second design.

**Links are reached by the same arrows as everything else.** A printed URL in a terminal is
either clickable, which depends on the terminal, or it's a thing to select with a mouse —
and an app you're already driving from the keyboard shouldn't hand you back to the pointer.
So focus is a single list per section (`view.targets()`): rows, and the links a project
reveals once it's open, in visual order. ⏎ acts on whatever is under the caret — expand a
row, open a link — and the footer names which, because one key doing two things is only
honest if the app says so. The two never compete: a link is focusable only while its row is
open.

The opener is `cli/lib/open.js`, ~50 lines and no dependency. The URL is passed as one argv
entry on every platform, so it's never parsed as a command line; Windows therefore goes
through `rundll32 url.dll,FileProtocolHandler`, not `cmd /c start`, where `&` in a query
string separates commands before it is a character. `http:`, `https:` and `mailto:` are the
only schemes opened. Exit codes are ignored — several openers return non-zero having worked
perfectly — so the failure reported is the one that matters: no opener on this machine, over
SSH or in a container. That answer lands in the footer for a couple of seconds, since
otherwise a keypress that raised no window would look like a keypress that did nothing.

**It ships no content.** Every run it fetches the words *and* the palette from
`/api/content`, generated from the same `content/` modules as everything else. A published
version can therefore never go stale, and editing a job updates the site, `curl`, and every
installed copy at once. The tradeoff is accepted deliberately: it needs a connection, and
there is no bundled snapshot, because a snapshot is the stale copy this arrangement exists
to prevent.

**Constraints that shape it.** The alternate screen is non-negotiable — the app must leave
scrollback exactly as it found it. A frame is always exactly the window: `frame()` clips
every line itself rather than trusting its caller, because one line too wide wraps, pushes
the rest down, and a full-screen redraw then reads as tearing. Below ~22 rows the header
gives up its optional lines; the body is what the reader came for.

Contact details and project links are the one thing never clipped — they wrap onto a second
line instead. Losing the tail of a sentence costs nothing; half a URL is unusable.

Piped or redirected it prints everything at once, fully expanded, and exits. A program that
blocks waiting for a terminal that isn't there is a bug.

---

## 14c. The endpoint card

§14a and §14b are invisible from the website itself — nobody types `curl` at a page that
never mentions it. The card beside the bio is the one place that says so, borrowing the
shape of an API reference panel: a url bar, the command, and what comes back.

**It is the only boxed element on the site.** Everywhere else structure comes from hairline
rules and whitespace (§2). The border is affordable here because the box is a *quotation* —
it reads as a docs panel embedded in a page, not as the page growing a card. Inside it,
nothing new: the same four tokens, JetBrains Mono, `--surface` behind it.

**Three bands, and the middle one inverts.** The url bar and the response row sit on
`--surface` with the card's chrome; the snippet between them drops to `--bg`. That inversion
is the whole reason the band exists — on one plane the command is another row of the panel,
a shade darker it reads as output.

**The clients are tabs, not a `<select>`.** Three ways in is the card's argument, and a
closed dropdown makes two of them disappear; the tab row states the count without being
opened. The cost is the keyboard, which the select gave away free — so the tablist earns it
back by hand: `role="tablist"`/`tab`/`tabpanel`, roving `tabIndex`, and Left/Right wrapping
and carrying focus with the selection.

**The response row wraps rather than ellipsises.** The aside is `minmax(15rem, 19rem)`, and
at the narrow end the row is some twenty pixels short of `200 · text/plain; charset=utf-8`.
The part that gets cut is the content type, which is the part worth reading — a wrapped
second line is correct, a truncated `charset=utf…` is not.

**PowerShell gets a listed client rather than a footnote.** There, `curl` is an alias for
`Invoke-WebRequest`, which returns an object instead of the page — so the obvious command is
the one that fails. `irm` is offered directly, which is cheaper than explaining the trap.

Commands are built from `lib/site.ts`, never typed in. The domain appears once in the repo.

The bio gives up measure for it — ~54ch rather than 62ch — and below 760px the card stops
pretending to be a sidebar and goes full width **above the section's eyebrow**, where it
leads About rather than trailing it. It reaches that position by being the section's `aside`
(§13) instead of part of its content: dropped underneath the prose it ends up at the foot of
About, hard against the Experience eyebrow with nothing holding it, which reads as a stray
block rather than an aside to anything.

**Under the card, one line of shell comment.** `# npx is interactive` on the HTTP clients;
`# yippee!! (still a wip)` once you're on npx. It's the only joke on the site, and it's
carrying real information — nothing else says the npx build is a program rather than another
dump of text. A comment is the one register a terminal has for an aside, which is why it
sits outside the border rather than in the response.

**The nudge is declarative, and briefly wasn't.** It trailed into `...if you trust me` for a
while, which was the wrong move in a small way: `npx`-ing a stranger's package is exactly
the doubt the reader already has, and naming it hands them a reason to hesitate rather than
an answer. The clause read as self-aware and worked as a hedge. Stating the fact and
stopping is the stronger version — and the tone the reader needs before running it lives in
the npx line, not in a disclaimer on the two lines before it.

**The npx line is not a keymap**, and briefly was one — it drifted into
`arrows move, ⏎ expands or opens` while the CLI was gaining the ability to open links.
Two things are wrong with that. The app names its own keys in its footer, per focused
target, which a static line here can't do and shouldn't duplicate; and enumerating branches
is the one register this line doesn't have. What the reader needs before they run it is that
it's a program with someone behind it, which is a matter of tone, not of documentation.

Each hint is written to fit the column on **one line** (40 characters at the side-by-side
width). A two-line aside stops being an aside and starts arguing with the card.

---

## 15. File structure

```
app/
  layout.tsx            root layout, fonts, metadata, skip-link
  page.tsx              home
  globals.css           tokens, base element styles, shared utilities
  not-found.tsx         404
  icon.svg              favicon
  opengraph-image.png   + .alt.txt — the social card (§14)
  sitemap.ts robots.ts
  projects/
    page.tsx            full index
  txt/                  the terminal view (§14a) — route.ts and projects/route.ts
  api/content/          the JSON the npx app reads (§14b)
proxy.ts                serves app/txt/ to CLI user agents asking for a page (§14a).
                        Was middleware.ts; Next 16 renamed the convention.
cli/                    the `npx aryanahlawat` app (§14b). Its own npm package —
                        no dependencies, no build step, publishes as-is.
components/             see §13. A component has a .module.css only when it needs styles
                        that aren't already a utility — several have none.
content/
  projects.ts           typed project data (single source of truth)
  profile.ts            name, headline, bio, links, experience
lib/
  types.ts              Project, Profile, Experience
  site.ts               name, domain, description
  nav.ts                homeSections — the rail's section list, in document order
  timeline.ts           the month maths, shared by both timelines (§7a, §14a)
  ansi.ts fmt.ts        terminal colour primitives + the ?plain switch (§14a)
  render-terminal.ts    the text rendering itself
  txt-response.ts       its query options and response headers
public/
  resume.pdf            served at /resume.pdf; the rail links to it
docs/
  spec.md               this file — the only spec. There is no second copy.
  opengraph-image.source.html  the OG card's source (§14)
```

**Styling rule.** A recipe used by three or more components is a utility class in
`globals.css` (`mono`, `arrow`, `link-muted`, `link-text`, `link-underline`, `eyebrow`,
`page-title`, `sep`, `tag`, `rise` + `rise-1..3`). Anything used once or twice stays in the
component's own module. This is why there are fewer `.module.css` files than components.
`rise` is the one utility that _has_ to be global — see §7.

---

## 16. Build order

1. Scaffold Next.js + TS; wire `globals.css` tokens (§4–6) and `next/font` (§5).
2. Primitives: `Section`, `Rail` — lock the rhythm first.
3. Home: about → experience (`Timeline` + `ExperienceList`) → featured `ProjectRow` list
   from `content/projects.ts` → contact.
4. `/projects` full index reusing `ProjectRow`.
5. `resume.pdf`, OG image, sitemap/robots, JSON-LD, Vercel deploy.

---

## 17. Definition of done / verification

- `next build` clean; no console warnings; no CLS from fonts.
- Lighthouse ≥ 95 perf/a11y/best-practices/SEO on `/`.
- Full keyboard traversal of `/` and `/projects`; visible focus rings; skip-link works.
- `prefers-reduced-motion` disables the entrance (verify in devtools).
- 375px and 1440px both correct; no horizontal scroll.
- Every `TODO` resolved before launch — `grep -rn TODO content lib`. Repo links,
  `profile.headline` and `profile.discordId` are all filled in; nothing is outstanding.
- Terminal view (§14a): `curl` on `/` gets text, a browser gets HTML, and Googlebot,
  Discordbot, Slackbot and Twitterbot all still get HTML. `?plain` emits no escape at all.
  Nothing but a long URL exceeds the column width at 40, 80 or 120.
- Terminal app (§14b): a frame is exactly the window at every size tried, focusing any row
  scrolls it into view, `q` restores the screen and the cursor, and a resize repaints at the
  new size. Piped, it prints and exits rather than waiting.
