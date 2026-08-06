/**
 * Terminal primitives for the CLI.
 *
 * These mirror lib/ansi.ts in the site repo. They are reimplemented here rather
 * than imported because this package ships with no build step — it is published
 * exactly as written, so it can't reach across into the site's TypeScript.
 *
 * The duplication is deliberately limited to *mechanism* (wrapping, measuring,
 * escape codes), which is stable. Everything that can actually go stale — the
 * words and the colours — is fetched from the site at runtime instead. See
 * app/api/content/route.ts.
 */

const ESC = String.fromCharCode(27);

export const RESET = `${ESC}[0m`;
export const BOLD = `${ESC}[1m`;
export const DIM = `${ESC}[2m`;

const SGR_RE = new RegExp(`${ESC}\\[[0-9;]*m`, "g");
const OSC8_RE = new RegExp(`${ESC}\\]8;;.*?${ESC}\\\\`, "g");

/* screen control */
export const ALT_SCREEN_ON = `${ESC}[?1049h`;
export const ALT_SCREEN_OFF = `${ESC}[?1049l`;
export const CURSOR_HIDE = `${ESC}[?25l`;
export const CURSOR_SHOW = `${ESC}[?25h`;
export const CLEAR = `${ESC}[2J${ESC}[H`;
export const HOME = `${ESC}[H`;
/** Erase from the cursor to the end of the line — stops stale glyphs from a
 *  longer previous frame surviving under a shorter new one. */
export const CLEAR_EOL = `${ESC}[K`;

function rgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function fg(hex) {
  const [r, g, b] = rgb(hex);
  return `${ESC}[38;2;${r};${g};${b}m`;
}

export function paint(text, hex) {
  return `${fg(hex)}${text}${RESET}`;
}

export function bold(text) {
  return `${BOLD}${text}${RESET}`;
}

/** Per-character fade, used on the name in the header. */
export function gradient(text, fromHex, toHex) {
  const from = rgb(fromHex);
  const to = rgb(toHex);
  const chars = [...text];
  const span = Math.max(chars.length - 1, 1);

  let out = "";
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    if (/\s/.test(ch)) {
      out += ch;
      continue;
    }
    const t = i / span;
    const r = Math.round(from[0] + (to[0] - from[0]) * t);
    const g = Math.round(from[1] + (to[1] - from[1]) * t);
    const b = Math.round(from[2] + (to[2] - from[2]) * t);
    out += `${ESC}[38;2;${r};${g};${b}m${ch}`;
  }
  return out + RESET;
}

export function strip(s) {
  return s.replace(OSC8_RE, "").replace(SGR_RE, "");
}

/** Printed columns. Anything that aligns or clips must use this, not .length. */
export function visibleWidth(s) {
  return [...strip(s)].length;
}

export function padEnd(text, width) {
  return text + " ".repeat(Math.max(0, width - visibleWidth(text)));
}

export function truncate(text, width) {
  const chars = [...strip(text)];
  if (chars.length <= width) return text;
  return (
    chars
      .slice(0, Math.max(0, width - 1))
      .join("")
      .trimEnd() + "…"
  );
}

/**
 * Hard clip to `width` printed columns, escapes preserved. Used on every line
 * before it's drawn: a line wider than the window would wrap and push the whole
 * frame down, which in a full-screen redraw looks like the app tearing.
 */
export function clip(line, width) {
  if (visibleWidth(line) <= width) return line;

  let out = "";
  let shown = 0;
  let i = 0;
  while (i < line.length && shown < width) {
    if (line[i] === ESC) {
      // Copy the whole escape sequence through; it costs no columns.
      const rest = line.slice(i);
      const m = rest.match(/^\[[0-9;]*m/) || rest.match(/^\]8;;.*?\\/);
      if (m) {
        out += m[0];
        i += m[0].length;
        continue;
      }
    }
    out += line[i];
    shown++;
    i++;
  }
  return out + RESET;
}

/** Word wrap to `width` columns, continuation lines prefixed with `indent`. */
export function wrap(text, width, indent = "") {
  const room = Math.max(1, width - visibleWidth(indent));
  const lines = [];
  let line = "";

  const push = () => {
    if (line) lines.push(lines.length === 0 ? line : indent + line);
    line = "";
  };

  for (const word of String(text).split(/\s+/).filter(Boolean)) {
    const w = visibleWidth(word);
    if (line && visibleWidth(line) + 1 + w > room) push();

    if (w > room) {
      push();
      let rest = word;
      while (visibleWidth(rest) > room) {
        lines.push((lines.length === 0 ? "" : indent) + rest.slice(0, room));
        rest = rest.slice(room);
      }
      line = rest;
      continue;
    }
    line = line ? `${line} ${word}` : word;
  }

  push();
  return lines.length > 0 ? lines : [""];
}

/** Wrapped text at a fixed indent, first line included. */
export function block(text, width, indent = "") {
  return wrap(text, width, indent).map((l, i) => (i === 0 ? indent + l : l));
}

export function rule(width, char = "─") {
  return char.repeat(Math.max(0, width));
}
