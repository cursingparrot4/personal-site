/**
 * Handing a URL to the desktop, with no dependency and no shell.
 *
 * Every opener below takes the URL as a single argv entry, so it is never
 * parsed as a command line. That's the reason Windows doesn't go through
 * `cmd /c start`: cmd reads `&` as a command separator before it reads it as a
 * character, and `&` is what query strings are made of. `url.dll`'s protocol
 * handler is the same thing the shell uses when you click a link, minus the
 * parser.
 */

import { spawn } from "node:child_process";

/**
 * Schemes worth handing to a browser or a mail client. The URLs come from our
 * own /api/content, so this isn't defending against an attacker so much as
 * against a typo — but `file:` and friends reach a lot of handlers, and there's
 * no version of this app that needs to open one.
 */
const ALLOWED = new Set(["http:", "https:", "mailto:"]);

export function isOpenable(url) {
  try {
    return ALLOWED.has(new URL(url).protocol);
  } catch {
    return false;
  }
}

function opener(url) {
  switch (process.platform) {
    case "darwin":
      return ["open", [url]];
    case "win32":
      return ["rundll32", ["url.dll,FileProtocolHandler", url]];
    default:
      return ["xdg-open", [url]];
  }
}

/**
 * Resolves once the opener has been spawned — not once the page has loaded,
 * which we have no way to know.
 *
 * Exit codes are ignored on purpose: several of these return non-zero in
 * situations where the link opened perfectly well. The failure actually worth
 * reporting is "there is no opener on this machine" (a bare container, an SSH
 * session with no desktop), and that arrives as an `error` event instead.
 */
export function openUrl(url) {
  return new Promise((resolve, reject) => {
    if (!isOpenable(url)) {
      reject(new Error(`refused to open ${url}`));
      return;
    }

    const [cmd, args] = opener(url);
    let child;
    try {
      child = spawn(cmd, args, { stdio: "ignore", detached: true });
    } catch (err) {
      reject(err);
      return;
    }

    child.once("error", reject);
    child.once("spawn", () => {
      // Detached and unreferenced: the browser outlives us, and a still-open
      // link doesn't hold the event loop after the reader quits.
      child.unref();
      resolve();
    });
  });
}
