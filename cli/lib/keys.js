/**
 * Keyboard handling, as a pure function of (state, key).
 *
 * It lives apart from index.js so it can be exercised without a terminal: a
 * TTY is the one thing a test can't conjure, and escape-sequence parsing is
 * exactly the sort of thing that is wrong in a way you only notice by pressing
 * the key. Give it a keystroke and a state object and it tells you what to do.
 */

import { LINK } from "./view.js";

const ESC = String.fromCharCode(27);
const CTRL_C = String.fromCharCode(3);

/** What index.js should do next. */
export const QUIT = "quit";
export const REDRAW = "redraw";
/** Open the focused target's URL. The reducer can't do it — it's I/O. */
export const OPEN = "open";
export const IGNORED = null;

/**
 * Arrows and friends arrive as ESC + "[A". Dropping the prefix lets the cases
 * below read as the sequences they are; a bare ESC keypress is length 1 and
 * falls through unmatched, which is what we want — it isn't a command.
 */
function normalize(raw) {
  return raw.startsWith(ESC) && raw.length > 1 ? raw.slice(1) : raw;
}

/**
 * Applies `raw` to `state` in place. `ctx` supplies what the reducer can't know
 * on its own: the focusable things in the current section (see view.targets),
 * how many sections exist, and how far a page-scroll should travel.
 */
export function handleKey(raw, state, ctx) {
  const key = normalize(raw);
  const { sectionCount, targets, pageSize } = ctx;
  const rowCount = targets.length;

  const setSection = (next) => {
    state.section = (next + sectionCount) % sectionCount;
    state.focus = 0;
    state.scroll = 0;
  };

  switch (key) {
    case CTRL_C:
    case "q":
      return QUIT;

    case "[A": // up
    case "k":
      if (rowCount > 0) state.focus = Math.max(0, state.focus - 1);
      else state.scroll = Math.max(0, state.scroll - 1);
      break;

    case "[B": // down
    case "j":
      if (rowCount > 0) state.focus = Math.min(rowCount - 1, state.focus + 1);
      else state.scroll += 1;
      break;

    case "[C": // right
    case "l":
    case "\t":
      setSection(state.section + 1);
      break;

    case "[Z": // shift+tab
    case "[D": // left
    case "h":
      setSection(state.section - 1);
      break;

    // One key, whatever is under it: expand a row, open a link. The two never
    // compete for it because a link is only focusable once its row is open.
    case "\r":
    case "\n":
    case " ": {
      const target = targets[state.focus];
      if (!target) break;
      if (target.kind === LINK) return OPEN;
      if (state.expanded.has(target.id)) state.expanded.delete(target.id);
      else state.expanded.add(target.id);
      break;
    }

    case "[5~": // page up
      state.scroll = Math.max(0, state.scroll - pageSize);
      break;

    case "[6~": // page down
      state.scroll += pageSize;
      break;

    case "[H": // home
    case "g":
      state.focus = 0;
      state.scroll = 0;
      break;

    case "[F": // end
    case "G":
      if (rowCount > 0) state.focus = rowCount - 1;
      break;

    default:
      // A digit jumps straight to that section, matching the 001..004 labels.
      if (new RegExp(`^[1-${sectionCount}]$`).test(key)) setSection(Number(key) - 1);
      else return IGNORED;
  }

  return REDRAW;
}
