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
content/       ← the stuff you'll actually edit. Words, jobs, projects.
lib/           site constants + the TypeScript shapes content must match
app/           one folder = one URL. Pages, plus the global stylesheet.
components/    reusable UI
middleware.ts  hands CLI clients the text version of a page
cli/           the `npx aryanahlawat` app — its own npm package
docs/          the design spec. Reading only.
public/        static files served as-is (resume.pdf lives here)
```

Two rules explain where any given style lives:

1. **A recipe used in three or more places is a utility class in `app/globals.css`.**
   There are ten, and between them they cover most of the site's surface:

   |                            |                                                                   |
   | -------------------------- | ----------------------------------------------------------------- |
   | `mono`                     | switch to JetBrains Mono (meta text, labels, nav)                 |
   | `link-muted` / `link-text` | grey or body-coloured link, cyan on hover                         |
   | `link-underline`           | the cyan rule that grows in on hover — combine with either colour |
   | `arrow`                    | the trailing `↗` on off-site links                               |
   | `eyebrow`                  | the small mono label above a title                                |
   | `page-title`               | the big display heading                                           |
   | `sep`                      | the inert `·` between meta items                                  |
   | `tag`                      | the outlined pill used for stack items                            |
   | `rise` + `rise-1..3`       | the load entrance; the numbered class picks the stagger delay     |

   `rise` is the one utility that _has_ to be global. CSS Modules hashes `@keyframes`
   names and the `animation-name` that points at them, so a module declaring
   `animation: rise-in …` compiles to a name matching no keyframe — no error, no
   animation. Keep both the keyframe and the class in `globals.css`.

   So a rail link is `class="link-muted"` and a project-row link is
   `class="link-muted link-underline"` — neither redeclares the hover behaviour. Change the
   hover once in `globals.css` and every link follows.

2. **Everything used once or twice stays in the component's own `.module.css`**, scoped so
   it can't leak. `Shell.module.css` holds only the grid that is genuinely the shell's
   own.

The upshot: **components outnumber stylesheets.** `Tag.tsx`, `links.tsx`, `RailNav.tsx` and
`Presence.tsx` have no stylesheet at all — the first two are built from utilities, and the
last two borrow `Rail.module.css` because they render inside the rail. That's intentional,
not an oversight.

---

## How do I…

### …change my bio, headline, name, or social links?

`content/profile.ts`. That one file feeds the sidebar, the About section and the JSON-LD
search metadata. `status` is the availability line in the rail — drop the field and the line
disappears; `location` sits under it.

### …add or edit a job?

`content/profile.ts` → the `experience` array. Newest first — the page renders them in
array order. `note` is optional; a row without one simply isn't expandable.

```ts
{
  role: "Software Developer Co-op",
  org: "Co-operators",
  period: "May–Aug 2026",   // the string shown in the list — word it however you like
  start: "2026-05",         // YYYY-MM, drives the duration chart's axis
  end: "2026-08",
  note: [                   // optional — one string per bullet point
    "What you actually did. One line per point.",
    "A second, distinct piece of the role.",
  ],
}
```

`start`/`end` are separate from `period` on purpose: the timeline needs real months to place
and size the bar, while `period` stays free to read however you want. Get them wrong and
the bar is wrong — the timeline is only as honest as those two fields.

### …add a project?

`content/projects.ts` → one object in the `projects` array. That's the whole job. It
automatically gets a row on `/projects`, a dot on the timeline, and an anchor at
`/projects#<slug>` that lands on the row already expanded.

```ts
{
  slug: "my-project",           // the row's anchor: /projects#my-project — lowercase, hyphens
  name: "My Project",
  tagline: "One honest line, sentence case.",
  description: "The longer version — shown when the row expands.",
  stack: ["PyTorch", "FastAPI"],  // rendered as tags, in this order
  year: 2026,
  award: "Some Award",            // optional, shows in the accent colour
  links: { repo: "https://…", demo: "https://…", devpost: "https://…" },  // all optional
  featured: true,                 // optional — also show it on the home page
}
```

`lib/types.ts` defines the shape. If you get a red squiggle, that file is telling you
which field is wrong or missing.

### …work on the timeline above the job list?

`components/Timeline.tsx`. It draws both lists on one month axis: a bar per role, sized by
`start`/`end`, and below them a dot per project, placed by `year`. It shows **every**
project, not just the featured ones, and each dot links to `/projects#<slug>` — the index
row for that project, opened on arrival.

The month arithmetic behind it lives in `lib/timeline.ts`, not in the component, because the
terminal version draws the same chart in ASCII. Both import it, so the two can't disagree
about where a bar starts.

Projects only have a year, so projects sharing one are spread evenly across it (the two 2026
entries land in April and August) purely so they don't stack — that horizontal offset is
spacing, not data. A dot shows its name only while it's lit, since five names along one lane
would be unreadable.

The lighting is `components/TimelineContext.tsx`. Rows still own their own open state and
just announce it; the timeline is a mirror with no state of its own:

- hover or focus a row **or** its mark → both light up (`peek`)
- expand a row → its mark stays lit with a halo until you collapse it (`lit`)

`TimelineProvider` wraps the experience and projects sections in `app/page.tsx` and renders
no DOM. Without it — `/projects`, which has rows but no timeline — every signal is a no-op,
so you can drop `ProjectRow` anywhere without wiring anything up.

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

**One catch.** The terminal version (below) needs these as TypeScript, and CSS custom
properties can't be imported into TS — so `lib/ansi.ts` holds a copy of four of them. It's
the only place in the repo a design token is written twice. Change a colour here and change
it there in the same commit; nothing will fail loudly if you don't, `curl` will just quietly
be the old colour.

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

Two files: `lib/nav.ts` holds the `homeSections` array that drives the sidebar nav, and
`app/page.tsx` renders the matching `<Section>` components. Keep the two in sync — the
`id` is what links them. The index (`"001"`) is written by hand, so you control the
numbering.

### …change the sidebar?

`components/Rail.tsx` for the structure, `content/profile.ts` for the words (name,
headline, `now` list, prompt row).

`now` is the short list under your headline — what you're working on at the moment, two or
three items. It replaced a fixed list of four focus areas (`Machine learning`,
`Retrieval / RAG`, …). It is supposed to go stale; edit it when the answer changes.

The heading above that list reads **currently working on**. That text is a literal in
`components/Rail.tsx`, not a field — reword it there. The data key stays `now` because it's
part of the `Profile` type in `lib/types.ts`; renaming the key means renaming it in both
files, and it can't contain spaces.

The rail has two link groups. The **nav** (`RailNav`) is one tree on every page — `Home`
with the home page's sections indented under it, then `All projects` back at the top
level. On the home page the sections are live anchors with scroll-spy; elsewhere they
point at `/#id`. Exactly one entry carries the accent dash: the section you're reading on
the home page, or the page you're on anywhere else. The **pinned bottom block** holds the
off-site links: resume, GitHub, email, LinkedIn.

### …turn on the live "playing …" line?

Three steps:

1. Join **[discord.gg/lanyard](https://discord.gg/lanyard)** with the Discord account you
   want read. Lanyard is a bot that can only see presence for users in that server — there's
   nothing to configure once you're in, and you can leave any time to switch it off.
2. Copy your user id: Discord → Settings → Advanced → **Developer Mode** on, then right-click
   your name → **Copy User ID**. It's an 18–19 digit number.
3. Paste it into `discordId` in `content/profile.ts`.

The line then leads the availability block, above "Open to winter 2027 internships":
`Playing Geometry Dash` or `Listening to <song> — <artist>`. It carries the same dot as the
availability line below it — accent and pulsing when you're reachable, grey and still when
you're on do-not-disturb.

**It only ever names an activity.** Being merely online, away, busy, or offline renders
nothing at all — the row simply isn't there. Neither is it there when the state is unknown: an
empty `discordId`, a Lanyard outage, or a blocked WebSocket. Both cases collapse to the same
blank, so an outage looks like an evening off rather than a broken row, and the two lines
below it always stand on their own. Delete the field to remove the feature entirely.

Two things to know before you turn it on: the id is in the public JS bundle (it's a public
identifier — it isn't a token, and it can't be used to act on your account), and anyone on
the site can see what you're playing. `components/Presence.tsx` deliberately does **not**
surface your custom status or rich-presence details like `Editing README.md`; if you want
those, that's the file.

### …read the site in a terminal?

Two ways in. The static one, which needs nothing installed:

```bash
curl aryanahlawat.dev              # the home page, in colour
curl aryanahlawat.dev/projects     # the full index, descriptions included
curl aryanahlawat.dev/txt          # the same thing by name, from any client
```

**On Windows PowerShell, use `curl.exe` or `irm` instead.** Bare `curl` there is an alias
for `Invoke-WebRequest`, which returns a response _object_ rather than the page — in PS 5.1
it can fail outright on the Internet Explorer parsing path. `curl.exe aryanahlawat.dev` and
`irm aryanahlawat.dev` both work. (Note `irm` also won't follow the `www` → apex 308, so
give it the bare domain.)

And the interactive one — see "…the `npx` app?" below.

`middleware.ts` looks at the user agent. A terminal (`curl`, `wget`, `httpie`, `xh`,
PowerShell) gets rewritten to the matching route under `app/txt/`; **everything else falls
through to the real HTML.** It rewrites rather than redirects, so the URL doesn't change.

Two query options, and they work on the bare domain too (`curl 'aryanahlawat.dev/?plain'`):

|          |                                                                     |
| -------- | ------------------------------------------------------------------- |
| `?plain` | no colour and no escapes at all — for piping into a file or a pager |
| `?w=100` | render to 100 columns instead of 80 (clamped to 40–200)             |

**You don't have to maintain it.** `lib/render-terminal.ts` imports `content/profile.ts` and
`content/projects.ts` — the same files the pages read. Add a job or a project and it appears
in both, or in neither. The only things written twice are two lines of chrome (the "currently
working on" heading and the contact sentence), and both carry a comment saying so.

What it deliberately leaves out: education and a skills list. Neither exists as structured
data — education is prose inside `profile.bio`, skills are only implied by each project's
`stack`. Inventing them for the terminal alone would create the one thing that can go stale.
Add them to `lib/types.ts` first and both versions get them.

Two things to be careful of if you touch `middleware.ts`:

- **The crawler check runs first, and must stay first.** Googlebot needs the HTML to index
  the site; Discord, Slack and Twitter need it to unfurl a link, since the OG card is only
  discoverable through the `<head>`. A crawler served plain text costs you the search
  listing and the previews.
- **`Vary: User-Agent` on the response is load-bearing** (`lib/txt-response.ts`). The same
  URL now has two representations; without that header a shared cache can hand the escape
  codes to a browser, or the markup to `curl`.

### …work on the `npx` app?

`cli/` is a separate npm package, published as **`aryanahlawat`**, so `npx aryanahlawat`
opens the portfolio as a real terminal app: arrow keys to move, ⏎ to expand a job or
project, ←/→ or `1`–`4` for sections, and it reflows when you resize the window.

```
cli/
  index.js       fetch, TTY setup, the input loop — all the I/O
  lib/view.js    every frame, as pure functions of (content, state, width)
  lib/keys.js    keystroke → state change, as a pure reducer
  lib/ansi.js    colour and text primitives
```

It has **no dependencies and no build step** — what's in the folder is what gets published.
Publish with:

```bash
cd cli && npm publish
```

**It carries no content.** Every run it fetches the words and the palette from
`/api/content` (`app/api/content/route.ts`), which is built from `content/profile.ts` and
`content/projects.ts` — the same files everything else reads. So editing a job updates the
website, `curl`, and everyone's already-installed CLI at once, with no republish. You only
need to publish again when the app's _behaviour_ changes.

Two consequences worth knowing:

- **It needs a network connection**, by design. There's no bundled snapshot to fall back on,
  because a snapshot is exactly the stale copy this arrangement exists to avoid.
- `lib/ansi.js` restates the wrapping and measuring helpers from `lib/ansi.ts`. That's the
  price of having no build step. It's deliberately limited to _mechanism_, which doesn't
  change; anything that can actually go stale comes down the wire.

To point it at a local build while you work on it:

```bash
ARNA_SITE=http://localhost:3000 node cli/index.js
```

Piped or redirected, it skips the interface and prints everything expanded — so
`npx aryanahlawat | cat` behaves like `curl` rather than hanging on a terminal that isn't
there.

### …change the page title, description, or social preview?

`app/layout.tsx` → `metadata`, which reads from `lib/site.ts`. Per-page overrides live in
each page's own exported `metadata` (see `app/projects/page.tsx`). One trap: a page that
doesn't set `alternates.canonical` inherits the root layout's `"/"` and tells search
engines it's a duplicate of the home page — every new page needs its own.

### …change the domain?

`lib/site.ts`. It feeds page metadata, the sitemap and `robots.txt`. It holds only three
values — name, url, description — because nothing else needs a site-wide constant.

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

|                   |                                                                                    |
| ----------------- | ---------------------------------------------------------------------------------- |
| `Shell`           | two-column page frame: sticky rail + content. Collapses to one column under 900px. |
| `Rail`            | the left sidebar — identity, nav, availability, contact. Stacked header on mobile. |
| `RailNav`         | the rail's nav tree; on the home page it scroll-spies the section you're reading.  |
| `Presence`        | the live "playing …" line atop the availability block; gone with no activity.      |
| `Section`         | `001 — label` eyebrow + title + content. Owns the vertical rhythm.                 |
| `PageHeader`      | eyebrow + big title. Used by `/projects` and the 404 page.                         |
| `ProjectRow`      | one expandable project row. Shared by the home page and `/projects`.               |
| `Timeline`        | the chart above the job list — a bar per role, a dot per project, one axis.        |
| `ExperienceList`  | the list of jobs; each row expands to show its note.                               |
| `links`           | two exports: `InlineLink` for prose, `ExternalLink` for anything off-site.         |
| `Tag`             | the outlined mono pill used for stack items.                                       |
| `NullscapeFilter` | the decorative grain/scanline overlay. Mounted once in `app/layout.tsx`.           |

Most components are server components. `"use client"` appears only where there's real
browser state — `ProjectRow`, `ExperienceList` (expand/collapse), `RailNav` (scroll
position), `Timeline` + `TimelineContext` (the shared highlight), and `Presence` (a live
socket). Add it only when you need `useState` or an event handler.

**Every link goes through `components/links.tsx`.** `ExternalLink` is the only place
`target="_blank" rel="noopener noreferrer"` is written, so a new off-site link can't
accidentally ship without the security `rel`. It carries no colours — pass the `link-*`
utilities you want.

---

## Still to fill in

Every project now has links (`grep -rn TODO content lib` comes back empty). One note:
**Cognitive RAG** points at a gitfront mirror rather than GitHub, on purpose — that repo
stays private. A project with an empty `links: {}` just renders without link buttons, so
adding one without a URL breaks nothing.

The `SITE STILL A WIP.` headline is gone — `content/profile.ts` now carries a real one. The
OG card deliberately does not use `headline`, so it needs no regeneration for that; see
`docs/opengraph-image.source.html` if you change the card itself.

`profile.discordId` is set and the rail's presence line is live — so it appears whenever
you're playing something or on Spotify, and the rail is a line shorter the rest of the time.
Clearing the field turns the feature off; see "…turn on the live 'playing …' line?" above for
what it needs.

## docs/

**[`docs/spec.md`](./docs/spec.md)** — the design spec: layout, type scale, motion,
component contracts. The reference for _why_ something looks the way it does. It describes
intent only; it deliberately does **not** restate content or code, so it can't drift.

There used to be a second copy at the repo root. The two had diverged in both directions —
each held edits the other was missing — so they were merged back into this one. **There is
one spec, and it lives in `docs/`.**

The old `docs/design-handoff/` bundle (design brief + HTML prototype + its runtime, 114 KB)
was deleted — it had been fully implemented, its values duplicated §4–7 of the spec, and
the Nullscape numbers live in `components/NullscapeFilter.module.css`. Recover it with:

```bash
git show 7f334a8 -- design_handoff_graphite_cyan
```
