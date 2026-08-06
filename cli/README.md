# aryanahlawat

Aryan Ahlawat's portfolio, as an interactive terminal app.

```bash
npx aryanahlawat
```

No install, no dependencies, ~20 KB. Works anywhere Node 18+ runs — Windows Terminal,
PowerShell, macOS, Linux, WSL.

```
↑ ↓       move between rows and links
⏎ / space expand the focused row — or open the focused link in your browser
← → tab   change section
1 – 4     jump straight to a section
q         quit
```

Expanding a project puts its repo / demo / devpost links directly under it, in the same
list the arrows are already walking, so ⏎ twice gets you from a project to its source. The
Contact section is links the whole way down; `email` opens a `mailto:`. Nothing is clicked
and nothing is copied out — the footer tells you what ⏎ will do to whatever is selected.

The window is the app's real layout constraint, so it reflows as you resize it, and the
alternate screen means quitting leaves your scrollback exactly as it was.

## Don't want to install anything?

The same content is served as plain text over HTTP:

```bash
curl -L aryanahlawat.dev
curl -L aryanahlawat.dev/projects
curl -L 'aryanahlawat.dev/?plain'      # no colour, safe to pipe
curl -L 'aryanahlawat.dev/?w=120'      # set the width
```

`-L` matters: a bare hostname means `http://`, which is force-upgraded to https with a 308,
and curl won't follow that on its own.

On Windows PowerShell, use `irm https://aryanahlawat.dev`. Bare `curl` there is an alias for
`Invoke-WebRequest`, which returns an object rather than the page — and PowerShell 5.1
refuses to follow a 308, so the scheme has to be spelled out.

## How it stays current

This package contains no content. Every run it fetches the words _and_ the colour palette
from `aryanahlawat.dev/api/content`, which is generated from the same TypeScript modules
that render the website. Update the site and this CLI updates with it — no republish, and
no version of it can quietly go stale.

That also means it needs a network connection. Piped or redirected (`npx aryanahlawat | cat`)
it skips the interface and prints everything at once, fully expanded.

## Source

[github.com/cursingparrot4/arna-site](https://github.com/cursingparrot4/arna-site) — the CLI
lives in `cli/`.

MIT.
