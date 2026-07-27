# arna-site

Personal portfolio + resume site for Aryan Ahlawat. Dark "terminal / systems" aesthetic —
sticky identity rail, index-numbered work, expand-in-place project/experience rows.

Next.js (App Router) + TypeScript + plain CSS Modules. Every page is statically rendered
at build time; deploys to Vercel. No database, no API, no CMS — **all content is TypeScript
files you edit by hand.**

```bash
npm install
npm run dev        # http://localhost:3000
```

|                  |                                    |
| ---------------- | ---------------------------------- |
| `npm run dev`    | local dev server, hot reload       |
| `npm run build`  | production build (also typechecks) |
| `npm run start`  | serve the production build         |
| `npm run lint`   | eslint                             |
| `npm run format` | prettier, writes in place          |

Run `npm run build` before you push — it fails on type errors that `dev` lets slide.

---

## Where everything lives

```
content/     ← the stuff you'll actually edit. Words, jobs, projects.
lib/         site constants + the TypeScript shapes content must match
app/         one folder = one URL. Pages, plus the global stylesheet.
components/  reusable UI
docs/        the design spec. Reading only.
public/      static files served as-is (resume.pdf lives here)
```

Two rules explain where any given style lives:

1. **A recipe used in three or more places is a utility class in `app/globals.css`.**
   There are nine, and between them they cover most of the site's surface:

   |                            |                                                              |
   | -------------------------- | ------------------------------------------------------------ |
   | `mono`                     | switch to JetBrains Mono (meta text, labels, nav)            |
   | `link-muted` / `link-text` | grey or body-coloured link, cyan on hover                    |
   | `link-underline`           | add the cyan underline on hover — combine with either colour |
   | `arrow`                    | the trailing `↗` on off-site links                          |
   | `eyebrow`                  | the small mono label above a title                           |
   | `page-title`               | the big display heading                                      |
   | `sep`                      | the inert `·` between meta items                             |
   | `tag`                      | the outlined pill used for stack items                       |

   So a footer link is `class="link-muted"` and a project-row link is
   `class="link-muted link-underline"` — neither redeclares the hover behaviour. Change the
   hover once in `globals.css` and every link follows.

2. **Everything used once or twice stays in the component's own `.module.css`**, scoped so
   it can't leak. `Footer.module.css` holds only the two rules that are genuinely the
   footer's own.

The upshot: **components outnumber stylesheets.** `Tag.tsx`, `links.tsx` and `RailNav.tsx`
have no stylesheet at all — the first two are built from utilities, and `RailNav` borrows
`Rail.module.css` because it renders inside the rail. That's intentional, not an oversight.

---

## How do I…

### …change my bio, headline, name, or social links?

`content/profile.ts`. That one file feeds the sidebar, the About section, the contact row
and the JSON-LD search metadata.

### …add or edit a job?

`content/profile.ts` → the `experience` array. Newest first — the page renders them in
array order. `note` is optional; a row without one simply isn't expandable.

```ts
{
  role: "Software Developer Co-op",
  org: "Co-operators",
  period: "May–Aug 2026",
  note: "What you actually did. One line.",   // optional
}
```

### …add a project?

`content/projects.ts` → one object in the `projects` array. That's the whole job. It
automatically gets a row on `/projects`, a detail page at `/projects/<slug>`, and a
sitemap entry.

```ts
{
  slug: "my-project",           // becomes /projects/my-project — lowercase, hyphens
  name: "My Project",
  tagline: "One honest line, sentence case.",
  description: "The longer version — shown when the row expands, and on the detail page.",
  stack: ["PyTorch", "FastAPI"],  // rendered as tags, in this order
  year: 2026,
  award: "Some Award",            // optional, shows in the accent colour
  links: { repo: "https://…", demo: "https://…", writeup: "https://…" },  // all optional
  featured: true,                 // optional — also show it on the home page
}
```

`lib/types.ts` defines the shape. If you get a red squiggle, that file is telling you
which field is wrong or missing.

### …choose what shows on the home page vs. the full list?

`featured: true` puts a project on the home page. `/projects` always shows everything.
Both render in array order, so reorder the array to reorder the site.

### …change the colours, fonts, or spacing?

`app/globals.css`, the `:root` block at the top. It's the design system — every component
reads from these variables, so changing `--accent` once recolours the whole site.

```css
--accent: #34c5dd; /* the cyan: links on hover, section numbers, awards */
--bg: #0d1114; /* page background */
--text: #e2e8ec; /* body copy */
--muted: #8b979e; /* secondary text, nav, meta */
```

Fonts are loaded in `app/layout.tsx` via `next/font` (Space Grotesk + JetBrains Mono) and
exposed as `--font-sans` / `--font-mono`.

### …turn the film-grain / scanline overlay down or off?

`components/NullscapeFilter.tsx` is mounted once in `app/layout.tsx`. Pass it a strength:

```tsx
<NullscapeFilter atmosphere={0.2} />   {/* default. 0 disables it entirely */}
```

It also takes `dither`, `grain` and `beamRgb`. It's purely decorative — `aria-hidden`,
`pointer-events: none`, and it respects `prefers-reduced-motion`.

### …rename, reorder, or add a home-page section?

`app/page.tsx`. The `sections` array at the top drives the sidebar nav; the `<Section>`
components below render the content. Keep the two in sync — the `id` is what links them.
The index (`"001"`) is written by hand, so you control the numbering.

### …change the sidebar?

`components/Rail.tsx` for the structure (nav links, resume link, contact links),
`content/profile.ts` for the words (name, headline, focus list, prompt row).

### …change the page title, description, or social preview?

`app/layout.tsx` → `metadata`, which reads from `lib/site.ts`. Per-page overrides live in
each page's own exported `metadata` (see `app/projects/page.tsx`).

### …change the domain or the footer's "Source" link?

`lib/site.ts`. It feeds metadata, the sitemap, `robots.txt` and the footer.

### …update the resume?

Overwrite `public/resume.pdf`. Anything in `public/` is served from the site root, so
`public/resume.pdf` → `/resume.pdf`, which is what the sidebar's `Resume ↗` links to.
Keep the filename — the link is hard-coded in `components/Rail.tsx`.

When the resume changes, the site's content doesn't follow automatically. Re-check
`content/profile.ts` (jobs, links) and `content/projects.ts` (projects) by hand.

### …add a whole new page?

Make a folder under `app/` with a `page.tsx` in it — `app/writing/page.tsx` serves
`/writing`. Wrap the content in `<Shell>` so it gets the sidebar and layout:

```tsx
import { Shell } from "@/components/Shell";

export const metadata = { title: "Writing" };

export default function Writing() {
  return <Shell>{/* … */}</Shell>;
}
```

---

## The components, briefly

|                             |                                                                                    |
| --------------------------- | ---------------------------------------------------------------------------------- |
| `Shell`                     | two-column page frame: sticky rail + content. Collapses to one column under 900px. |
| `Rail`                      | the left sidebar — identity, nav, contact. On mobile it becomes a stacked header.  |
| `RailNav`                   | the scroll-spy nav that highlights the section you're looking at (home only).      |
| `Section`                   | `001 — label` eyebrow + title + content. Owns the vertical rhythm.                 |
| `PageHeader`                | eyebrow + big title. Used by `/projects` and the 404 page.                         |
| `ProjectRow`                | one expandable project row. Shared by the home page and `/projects`.               |
| `ExperienceList`            | the timeline of jobs; each row expands to show its note.                           |
| `links`                     | two exports: `InlineLink` for prose, `ExternalLink` for anything off-site.         |
| `Tag`                       | the outlined mono pill used for stack items.                                       |
| `Footer`, `NullscapeFilter` | mounted once each in `app/layout.tsx`.                                             |

Most components are server components. `"use client"` appears only where there's real
browser state — `ProjectRow`, `ExperienceList` (expand/collapse) and `RailNav` (scroll
position). Add it only when you need `useState` or an event handler.

**Every link goes through `components/links.tsx`.** `ExternalLink` is the only place
`target="_blank" rel="noopener noreferrer"` is written, so a new off-site link can't
accidentally ship without the security `rel`. It carries no colours — pass the `link-*`
utilities you want.

---

## Still to fill in

Two placeholders remain — `grep -rn TODO content lib` to see them live. Both are repo
URLs in `content/projects.ts`:

- **Cognitive RAG** — QMIND client work; confirm it's shareable before linking it.
- **Churn Classification Engine** — no public link yet.

A project with an empty `links: {}` just renders without link buttons, so neither one
breaks anything as-is.

One thing worth a second look: `lib/site.ts` points `sourceUrl` at
`github.com/cursingparrot4/arna-site`. The footer's `Source ↗` link 404s for visitors
while that repo is private.

## docs/

**[`docs/spec.md`](./docs/spec.md)** — the design spec: layout, type scale, motion,
component contracts. The reference for _why_ something looks the way it does. It describes
intent only; it deliberately does **not** restate content or code, so it can't drift.

The old `docs/design-handoff/` bundle (design brief + HTML prototype + its runtime, 114 KB)
was deleted — it had been fully implemented, its values duplicated §4–7 of the spec, and
the Nullscape numbers live in `components/NullscapeFilter.module.css`. Recover it with:

```bash
git show 7f334a8 -- design_handoff_graphite_cyan
```
