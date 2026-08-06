import { renderProjects } from "@/lib/render-terminal";
import { serveText } from "@/lib/txt-response";

/** The full project index as text. The rewrite target for "/projects". */
export function GET(request: Request) {
  return serveText(request, renderProjects);
}
