# aryanahlawat

Aryan Ahlawat's portfolio, as an interactive terminal app.

```bash
npx aryanahlawat
```

No install, no dependencies, ~20 KB. Works anywhere Node 18+ runs — Windows Terminal,
PowerShell, macOS, Linux, WSL.

```
↑ ↓      move between rows
⏎ / space expand or collapse the focused row
← → tab  change section
1 – 4    jump straight to a section
q        quit
```

The window is the app's real layout constraint, so it reflows as you resize it, and the
alternate screen means quitting leaves your scrollback exactly as it was.

## Don't want to install anything?

The same content is served as plain text over HTTP:

```bash
curl aryanahlawat.dev
curl aryanahlawat.dev/projects
curl 'aryanahlawat.dev/?plain'      # no colour, safe to pipe
curl 'aryanahlawat.dev/?w=120'      # set the width
```

On Windows PowerShell use `curl.exe` or `irm` — bare `curl` there is an alias for
`Invoke-WebRequest`, which returns an object rather than the page.

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
