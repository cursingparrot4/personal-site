/**
 * Truecolor ANSI primitives for the terminal rendering of the site (app/txt/).
 *
 * Nothing in here knows anything about the site's content — lib/render-terminal.ts
 * owns that, and lib/fmt.ts wraps these in the mode switches (`?plain`) so the
 * renderer never writes a conditional of its own.
 */

/**
 * The palette, mirrored from the `:root` block at the top of app/globals.css.
 *
 * CSS custom properties can't be imported into TypeScript, so this is the one
 * place in the codebase a design token is written twice. Change a colour in
 * globals.css and change it here in the same commit — nothing will fail loudly
 * if you don't, the terminal view will just quietly be the old colour.
 */
export const palette = {
  text: "#e2e8ec", // --text
  muted: "#8b979e", // --muted
  border: "#232b31", // --border
  accent: "#34c5dd", // --accent
} as const;

export type Token = keyof typeof palette;

/**
 * The escape character, built from its code point rather than written as a
 * literal: a raw 0x1B in the source is invisible in most editors and survives
 * copy-paste badly, and the backslash-u spelling would put a control character
 * inside the regexes below, which `no-control-regex` flags.
 */
const ESC = String.fromCharCode(27);

export const RESET = `${ESC}[0m`;
export const BOLD = `${ESC}[1m`;

/** SGR colour/style sequences. */
const SGR_RE = new RegExp(`${ESC}\\[[0-9;]*m`, "g");
/** OSC 8 hyperlink open/close, ST-terminated — the form hyperlink() emits. */
const OSC8_RE = new RegExp(`${ESC}\\]8;;.*?${ESC}\\\\`, "g");

function rgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/**
 * Foreground colour. 24-bit truecolor rather than the 256-colour cube, so
 * `#34c5dd` arrives as exactly `#34c5dd` instead of the nearest neighbour.
 * Every terminal worth targeting has supported this for a decade.
 */
export function fg(hex: string): string {
  const [r, g, b] = rgb(hex);
  return `${ESC}[38;2;${r};${g};${b}m`;
}

export function paint(text: string, hex: string): string {
  return `${fg(hex)}${text}${RESET}`;
}

export function bold(text: string): string {
  return `${BOLD}${text}${RESET}`;
}

/**
 * Per-character interpolation between two colours — the fade on the name in the
 * header. Whitespace is emitted bare: a space has no glyph to colour, and each
 * skipped escape is 19 bytes off the response.
 */
export function gradient(text: string, fromHex: string, toHex: string): string {
  const from = rgb(fromHex);
  const to = rgb(toHex);
  const chars = [...text];
  // A one-character string has no distance to travel; give it the start colour
  // rather than dividing by zero.
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

/**
 * OSC 8 hyperlink: the label is clickable, the URL never printed. Terminals
 * that don't implement it ignore the sequence and show the label alone, which
 * is why lib/fmt.ts prints the raw URL instead whenever links are switched off
 * — a bare label with no address is worse than no link at all.
 */
export function hyperlink(url: string, label: string): string {
  return `${ESC}]8;;${url}${ESC}\\${label}${ESC}]8;;${ESC}\\`;
}

/** Every escape removed — SGR *and* OSC 8. The `?plain` safety net. */
export function strip(s: string): string {
  return s.replace(OSC8_RE, "").replace(SGR_RE, "");
}

/**
 * Printed width. Escapes occupy bytes but no columns, so anything that aligns
 * or wraps must measure with this and never with `.length`.
 */
export function visibleWidth(s: string): number {
  return [...strip(s)].length;
}

/** `text` padded with spaces to `width` printed columns. Never truncates. */
export function padEnd(text: string, width: number): string {
  return text + " ".repeat(Math.max(0, width - visibleWidth(text)));
}

/**
 * Shorten to `width` printed columns, ellipsis included. Escape-unaware — for
 * plain strings only (org names, project names), which is all it is used on.
 */
export function truncate(text: string, width: number): string {
  const chars = [...text];
  if (chars.length <= width) return text;
  return (
    chars
      .slice(0, Math.max(0, width - 1))
      .join("")
      .trimEnd() + "…"
  );
}

/**
 * Word wrap to `width` printed columns, every line after the first prefixed
 * with `indent`. Words carrying escapes wrap correctly because the escapes
 * measure as zero — a coloured word is just a wide-looking word that isn't.
 * A single word longer than the line (a long URL) is hard-broken rather than
 * allowed to run off the edge.
 */
export function wrap(text: string, width: number, indent = ""): string[] {
  const room = Math.max(1, width - visibleWidth(indent));
  const lines: string[] = [];
  let line = "";

  const push = () => {
    if (line) lines.push(lines.length === 0 ? line : indent + line);
    line = "";
  };

  for (const word of text.split(/\s+/).filter(Boolean)) {
    const w = visibleWidth(word);

    if (line && visibleWidth(line) + 1 + w > room) push();

    if (w > room) {
      // Doesn't fit on a line of its own either. Break it across as many as it
      // takes; only bare words (URLs) ever land here, so slicing by character
      // can't cut an escape sequence in half.
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

/** A horizontal rule of `width` columns. */
export function rule(width: number, char = "─"): string {
  return char.repeat(Math.max(0, width));
}
