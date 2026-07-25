# arna-site

Personal portfolio + resume site for Aryan Ahlawat. Dark "terminal / systems" aesthetic —
sticky identity rail, index-numbered work, expand-in-place project/experience rows.

Built with **Next.js (App Router) + TypeScript** and plain **CSS Modules**. Statically
rendered, deploys to Vercel. Design intent lives in [`spec.md`](./spec.md).

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build      # production build (static)
npm run start      # serve the production build
npm run lint       # eslint (next/core-web-vitals)
npm run format     # prettier
```

## Editing content

All content is data-driven — no need to touch components:

- **`content/profile.ts`** — name, headline, bio, links, experience.
- **`content/projects.ts`** — projects (single source of truth). Adding a project is one
  object; `featured: true` surfaces it on the home page. Each project auto-gets a detail
  page at `/projects/[slug]` and a sitemap entry.
- **`lib/site.ts`** — site-wide constants (URL, location, repo link) used by metadata.
- **`app/globals.css`** — design tokens (palette, type scale, spacing, motion). Change the
  look here.

## Structure

```
app/            routes (home, /projects, /projects/[slug]), layout, sitemap, robots
components/     Shell, Rail, Section, ProjectRow, ExperienceList, Tag, ...
content/        profile.ts, projects.ts   (edit these)
lib/            types.ts, site.ts
public/         resume.pdf  (add this — see below)
```

## Before launch

Search the repo for `TODO` and fill in:

- GitHub / LinkedIn handles and project repo URLs (`content/*.ts`)
- Final domain and repo link (`lib/site.ts`)
- Which email to show publicly (`content/profile.ts`)
- Add `public/resume.pdf` (the hero + nav link to it)
