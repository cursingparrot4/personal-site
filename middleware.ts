import { NextResponse, type NextRequest } from "next/server";

/**
 * Serves the terminal rendering (app/txt/) to command-line clients asking for a
 * normal page, so `curl aryanahlawat.dev` prints something worth reading
 * instead of a screenful of React hydration markup.
 *
 * It rewrites rather than redirects: the URL the user typed is the URL they
 * keep. Everything else — every browser, and every crawler — falls through to
 * the real HTML untouched.
 */

/**
 * Checked first, and the check that matters most. Googlebot needs the HTML to
 * index the site, and Discord/Slack/Twitter need it to unfurl a link — the OG
 * card is only discoverable through the <head>. A crawler that got plain text
 * here would quietly cost the site its search listing and its previews.
 */
const BOTS =
  /bot\b|bot\/|spider|crawl|facebookexternalhit|slack|discord|twitter|linkedin|whatsapp|telegram|embedly|quora|pinterest|lighthouse|headless|preview/i;

/**
 * Deliberately a short list of user agents that are unambiguously a terminal.
 * Anything vaguer — `python-requests`, `Go-http-client` — is as likely to be a
 * scraper that wants the markup, and can still ask for /txt by name.
 */
const CLI = /^curl\/|^Wget\/|^HTTPie\/|^xh\/|^aria2\/|^fetch\/|libcurl|PowerShell\//i;

/** The only two pages with a text twin. */
const TEXT_ROUTE: Record<string, string> = {
  "/": "/txt",
  "/projects": "/txt/projects",
};

export function middleware(request: NextRequest) {
  const ua = request.headers.get("user-agent") ?? "";
  if (!ua || BOTS.test(ua) || !CLI.test(ua)) return NextResponse.next();

  // An explicit `curl -H "Accept: text/html"` is someone asking for the markup
  // on purpose. Honour it — it's the standard way to say so, and it doubles as
  // the escape hatch for anyone scripting against the real page.
  if (request.headers.get("accept")?.includes("text/html")) return NextResponse.next();

  const target = TEXT_ROUTE[request.nextUrl.pathname];
  if (!target) return NextResponse.next();

  // clone() carries the query string over, so `curl 'site.dev/?plain'` works.
  const url = request.nextUrl.clone();
  url.pathname = target;
  return NextResponse.rewrite(url);
}

/**
 * Only the two paths that have a text twin. Nothing else wakes the middleware —
 * no asset, no /_next request — which keeps Edge invocations near zero.
 */
export const config = { matcher: ["/", "/projects"] };
