import { renderHome } from "@/lib/render-terminal";
import { serveText } from "@/lib/txt-response";

/**
 * The home page as text. Reached directly (`curl aryanahlawat.dev/txt`) or by
 * rewrite from "/" when middleware.ts recognises a CLI user agent.
 *
 * Reading the query string is what marks this dynamic — `?plain` and `?w=`
 * have to be honoured per request, so there's nothing to prerender.
 */
export function GET(request: Request) {
  return serveText(request, renderHome);
}
