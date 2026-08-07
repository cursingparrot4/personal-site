# arna-site

My portfolio, at **[aryanahlawat.dev](https://aryanahlawat.dev)** (now also in your terminal)

```bash
curl -L aryanahlawat.dev      # the site, as coloured plain text
npx aryanahlawat              # the site, as an interactive terminal app
```

<sub>On Windows PowerShell, use: `irm https://aryanahlawat.dev`.</sub>

## What it is

A personal portfolio (obviously) that I use to update my experiences and projects, but it's also a playground where I add stuff that seems cool, such as the Lanyard integration (you might see me listening to music or playing League), a CLI site implementation, and more.

## How it works

The content lives in `content/profile.ts` and `content/projects.ts`. Everything else renders
from it, the website, the `curl` output, and the JSON the `npx` app fetches on each run. So
editing one file updates all three, and none of them can go stale on their own (less work for me).

`proxy.ts` reads the user agent and hands terminals the text version at the same URL;
browsers and crawlers get the HTML. `?plain` drops the colour, `?w=120` sets the width.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · CSS Modules · Vercel. Statically rendered,
no database, three runtime dependencies.

```
content/      profile, jobs, projects
lib/          terminal renderer, timeline math, site constants
app/          pages, /txt routes, /api/content
components/   the UI
proxy.ts      the user-agent switch
cli/          the npx app — its own package
docs/spec.md  the design spec
```

---

The `cli/` package is MIT. The written content, résumé and imagery are mine. Please don't
redeploy the site as your own, but take any of the features that are useful to you :)
