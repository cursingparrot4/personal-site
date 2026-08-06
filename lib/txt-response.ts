import type { RenderOptions } from "@/lib/render-terminal";

/**
 * The plumbing behind app/txt/ — option parsing and the response headers, kept
 * in one place so the two route handlers are three lines each and can't drift
 * on something as easy to get wrong as `Vary`.
 */

/** A server can't ask how wide the window is, so 80 is the safe floor and
 *  `?w=` is the escape hatch for anyone running wider. */
const DEFAULT_WIDTH = 80;
const MIN_WIDTH = 40;
const MAX_WIDTH = 200;

export function readOptions(url: URL): RenderOptions {
  const q = url.searchParams;
  // `?T` is wttr.in's spelling; accepted so muscle memory works.
  const plain = q.has("plain") || q.has("nocolor") || q.has("T");

  const asked = Number(q.get("w") ?? q.get("cols"));
  const width =
    Number.isFinite(asked) && asked > 0
      ? Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, Math.trunc(asked)))
      : DEFAULT_WIDTH;

  return { width, color: !plain, hyperlinks: !plain };
}

export function serveText(request: Request, render: (options: RenderOptions) => string): Response {
  return new Response(render(readOptions(new URL(request.url))), {
    headers: {
      // Without this a browser hitting /txt tries to parse the escapes as HTML.
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
      // Required. proxy.ts serves this body at "/" for CLI agents, so a
      // shared cache that ignored the UA could hand the ANSI to a browser —
      // or the HTML to curl.
      Vary: "User-Agent",
      // The HTML pages are the canonical ones; this is the same content in
      // another dress and shouldn't compete with them in search results.
      "X-Robots-Tag": "noindex",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
