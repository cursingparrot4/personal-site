import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { site } from "@/lib/site";
import { palette } from "@/lib/ansi";

/**
 * The content, as JSON, for the `npx aryanahlawat` CLI (cli/).
 *
 * The CLI is published to npm and updates on its own schedule, so it must not
 * carry a copy of the words — it fetches them from here every run. That keeps
 * the same guarantee the rest of the site has: editing content/profile.ts
 * updates the browser, `curl`, and everyone's installed CLI at once, with no
 * republish.
 *
 * The palette rides along for the same reason: change `--accent` (and its twin
 * in lib/ansi.ts) and the CLI recolours itself without shipping a new version.
 */

// discordId is deliberately not forwarded. It's public and harmless — it's in
// the client bundle already — but the CLI has no presence line, so sending it
// would just be payload nobody reads.
const { discordId: _discordId, ...publicProfile } = profile;

export function GET() {
  const body = JSON.stringify({
    site: { name: site.name, url: site.url, description: site.description },
    profile: publicProfile,
    projects,
    palette,
  });

  return new Response(body, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
      // Public data, and a browser-side reader costs nothing to allow.
      "Access-Control-Allow-Origin": "*",
      "X-Robots-Tag": "noindex",
    },
  });
}
