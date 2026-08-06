import { BOLD, RESET, fg, gradient, hyperlink, palette, type Token } from "./ansi";

export type FormatOptions = {
  /** false for `?plain` — every helper below returns its input untouched */
  color: boolean;
  /** false for `?plain` — URLs print bare instead of as OSC 8 links */
  hyperlinks: boolean;
};

export type Formatter = {
  /** paint with one of the site's design tokens */
  c(text: string, token: Token): string;
  bold(text: string): string;
  /** the header's name fade: accent on the left, body text on the right */
  grad(text: string): string;
  /** a URL, always printed in full and clickable where that's supported */
  link(url: string, label?: string): string;
};

/**
 * One switchboard for the whole terminal view, so lib/render-terminal.ts can be
 * written as if colour always exists and never carries an `if (color)` of its
 * own. `?plain` flips every method here to a passthrough at once.
 */
export function createFormatter({ color, hyperlinks }: FormatOptions): Formatter {
  return {
    c: (text, token) => (color ? `${fg(palette[token])}${text}${RESET}` : text),

    bold: (text) => (color ? `${BOLD}${text}${RESET}` : text),

    grad: (text) => (color ? gradient(text, palette.accent, palette.text) : text),

    /**
     * The label defaults to the URL itself, and that is the point: OSC 8 hides
     * whatever it wraps behind a click, so a terminal without support — or a
     * reader piping to a file — would be left holding a word with no address.
     * Printing the URL as the label costs nothing and keeps it copy-pasteable.
     */
    link: (url, label) => {
      const shown = label ?? url;
      const painted = color ? `${fg(palette.accent)}${shown}${RESET}` : shown;
      return hyperlinks ? hyperlink(url, painted) : painted;
    },
  };
}
