#!/usr/bin/env node
import {
  ALT_SCREEN_OFF,
  ALT_SCREEN_ON,
  CLEAR,
  CLEAR_EOL,
  CURSOR_HIDE,
  CURSOR_SHOW,
  HOME,
  clip,
} from "./lib/ansi.js";
import { OPEN, QUIT, REDRAW, handleKey } from "./lib/keys.js";
import { openUrl } from "./lib/open.js";
import { ROW, SECTIONS, body, frame, header, targets, theme } from "./lib/view.js";

const SITE = process.env.ARNA_SITE ?? "https://aryanahlawat.dev";
const MIN_WIDTH = 40;
const MAX_WIDTH = 200;
/** How long the footer holds the result of opening a link. */
const NOTICE_MS = 2500;

/* ----------------------------------------------------------------- content */

/**
 * The words and the colours both come from the site, every run. That's what
 * lets this package sit on npm untouched while the portfolio keeps changing —
 * there is no copy of anything here, so a published version can't drift.
 */
async function fetchContent() {
  const url = `${SITE}/api/content`;
  const res = await fetch(url, {
    headers: { "user-agent": "aryanahlawat-cli" },
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`${url} responded ${res.status}`);
  return res.json();
}

/* ------------------------------------------------------------------- state */

const state = { section: 0, focus: 0, scroll: 0, expanded: new Set(), notice: null };

/* ------------------------------------------------------------------ render */

function dimensions() {
  const width = Math.max(MIN_WIDTH, Math.min(process.stdout.columns || 80, MAX_WIDTH));
  const height = Math.max(10, process.stdout.rows || 24);
  return { width, height };
}

function draw(data, t) {
  const { width, height } = dimensions();
  // Every line is clipped to the window and then erased to the right margin:
  // without the erase, a shorter line leaves the tail of the previous frame
  // sitting behind it.
  const lines = frame(data, t, state, width, height);
  process.stdout.write(HOME + lines.map((l) => clip(l, width) + CLEAR_EOL).join("\n") + CLEAR_EOL);
}

/* ------------------------------------------------------------------- input */

let noticeTimer;

/**
 * A line in the footer for a moment. Opening a link usually announces itself by
 * raising a browser window, but not always — over SSH, or with no opener
 * installed, this line is the only thing that happens.
 */
function notify(data, t, text) {
  state.notice = text;
  clearTimeout(noticeTimer);
  noticeTimer = setTimeout(() => {
    state.notice = null;
    draw(data, t);
  }, NOTICE_MS);
  // A pending notice must not be the thing keeping the process alive.
  noticeTimer.unref?.();
  draw(data, t);
}

function open(target, data, t) {
  openUrl(target.url).then(
    () => notify(data, t, `opened ${target.text}`),
    (err) => notify(data, t, `couldn't open it — ${err.message}`),
  );
}

function onKey(raw, data, t, quit) {
  const { height } = dimensions();
  // Recomputed per keystroke: expanding a project adds its links to the list.
  const list = targets(data, state);
  const result = handleKey(raw, state, {
    sectionCount: SECTIONS.length,
    targets: list,
    pageSize: Math.max(1, height - 10),
  });

  if (result === QUIT) return quit();
  if (result === OPEN) return open(list[state.focus], data, t);
  if (result === REDRAW) draw(data, t);
}

/* -------------------------------------------------------------------- main */

/** Not a terminal — `| cat`, a CI log, a pipe. Print everything once and exit. */
function printStatic(data, t) {
  const width = Math.max(MIN_WIDTH, Math.min(process.stdout.columns || 80, MAX_WIDTH));
  const out = [...header(data, t, width, false), ""];

  SECTIONS.forEach((section, i) => {
    // No keys to press in a pipe, so everything arrives open and nothing is
    // focused. focus: -1 matches no target, which is what draws no caret.
    const view = { section: i, focus: -1, scroll: 0, expanded: new Set() };
    for (const target of targets(data, view)) {
      if (target.kind === ROW) view.expanded.add(target.id);
    }

    const { lines } = body(data, t, view, width);
    out.push(t.accent(section.index) + t.muted(` ── ${section.label}`), t.bold(section.title), "");
    out.push(...lines, "");
  });

  process.stdout.write(out.join("\n") + "\n");
}

async function main() {
  const arg = process.argv[2];
  if (arg === "--help" || arg === "-h") {
    process.stdout.write(
      "aryanahlawat — Aryan Ahlawat's portfolio in your terminal\n\n" +
        "  npx aryanahlawat            interactive\n" +
        "  npx aryanahlawat | cat      plain, non-interactive\n" +
        "  curl -L aryanahlawat.dev    the same content, nothing to install\n\n" +
        "keys: up/down move · enter expand a row, open a focused link\n" +
        "      left/right or tab section · 1-4 jump · q quit\n",
    );
    return;
  }

  let data;
  try {
    data = await fetchContent();
  } catch (err) {
    process.stderr.write(
      `Couldn't reach ${SITE}: ${err.message}\n` +
        "This CLI reads its content from the site, so it needs a connection.\n",
    );
    process.exitCode = 1;
    return;
  }

  const t = theme(data.palette);

  if (!process.stdout.isTTY || !process.stdin.isTTY) {
    printStatic(data, t);
    return;
  }

  let closed = false;
  const cleanup = () => {
    if (closed) return;
    closed = true;
    process.stdout.write(CURSOR_SHOW + ALT_SCREEN_OFF);
    if (process.stdin.isTTY) process.stdin.setRawMode(false);
    process.stdin.pause();
  };
  const quit = () => {
    cleanup();
    process.exit(0);
  };

  // The alternate screen means this never touches the user's scrollback: quit
  // and the terminal looks exactly as it did before the app launched.
  process.stdout.write(ALT_SCREEN_ON + CURSOR_HIDE + CLEAR);
  process.on("exit", cleanup);
  process.on("SIGINT", quit);
  process.on("SIGTERM", quit);

  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (key) => onKey(key, data, t, quit));

  // The whole reason this is a program and not a page: it refits itself.
  process.stdout.on("resize", () => {
    process.stdout.write(CLEAR);
    draw(data, t);
  });

  draw(data, t);
}

main();
