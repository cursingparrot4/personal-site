import {
  BOLD,
  RESET,
  block,
  bold,
  clip,
  fg,
  gradient,
  padEnd,
  rule,
  truncate,
  visibleWidth,
  wrap,
} from "./ansi.js";

/**
 * Builds the frame, one array of lines at a time. Nothing here touches the
 * screen or the keyboard — index.js owns both — so a view is a pure function of
 * (content, state, width) and can be reasoned about on its own.
 */

/** Mirrors app/page.tsx: same numbers, same labels, same order. */
export const SECTIONS = [
  { id: "about", index: "001", label: "~/.profile", title: "About" },
  { id: "experience", index: "002", label: "~/.history", title: "Experience" },
  { id: "work", index: "003", label: "~/bin/builds", title: "Work" },
  { id: "contact", index: "004", label: "~/.forward", title: "Contact" },
];

/** What the arrows are moving between. A row expands; a link opens. */
export const ROW = "row";
export const LINK = "link";

/** The links a project reveals when it opens, in the order they're drawn. */
function projectLinks(project) {
  return [
    ["repo", project.links.repo],
    ["demo", project.links.demo],
    ["devpost", project.links.devpost],
  ]
    .filter(([, url]) => url)
    .map(([label, url]) => ({ kind: LINK, label, text: url, url }));
}

/**
 * `text` is what's printed, `url` is what opens — they differ for the email,
 * which reads as an address and opens as a mailto.
 */
function contactLinks(data) {
  const { profile, site } = data;
  const resume = `${site.url}/resume.pdf`;
  const links = [
    { kind: LINK, label: "email", text: profile.links.email, url: `mailto:${profile.links.email}` },
    { kind: LINK, label: "resume", text: resume, url: resume },
    { kind: LINK, label: "github", text: profile.links.github, url: profile.links.github },
  ];
  if (profile.links.linkedin) {
    links.push({
      kind: LINK,
      label: "linkedin",
      text: profile.links.linkedin,
      url: profile.links.linkedin,
    });
  }
  return links;
}

/**
 * Everything the arrows can land on in the current section, in visual order.
 *
 * This is the single enumeration of focusable things: `body()` draws straight
 * from it, so what's on screen and what a keypress acts on can't drift apart.
 * A project's links sit immediately after it and only while it's open, which is
 * what makes ⏎-to-expand and then ⏎-to-open one continuous gesture rather than
 * two modes.
 */
export function targets(data, state) {
  const section = SECTIONS[state.section].id;

  if (section === "experience") {
    return data.profile.experience.map((item, i) => ({ kind: ROW, id: `exp:${i}`, item }));
  }

  if (section === "work") {
    return data.projects.flatMap((item, i) => {
      const id = `proj:${i}`;
      const row = { kind: ROW, id, item, number: i + 1 };
      return state.expanded.has(id) ? [row, ...projectLinks(item)] : [row];
    });
  }

  if (section === "contact") return contactLinks(data);

  return [];
}

/** Colour helpers bound to the palette the site handed us. */
export function theme(palette) {
  return {
    accent: (s) => `${fg(palette.accent)}${s}${RESET}`,
    muted: (s) => `${fg(palette.muted)}${s}${RESET}`,
    border: (s) => `${fg(palette.border)}${s}${RESET}`,
    bold,
    grad: (s) => gradient(s, palette.accent, palette.text),
  };
}

function twoCol(left, right, width) {
  const used = visibleWidth(left) + visibleWidth(right);
  if (used + 2 > width) return null;
  return left + " ".repeat(width - used) + right;
}

/**
 * `label    value` on one line, or the label with the value wrapped underneath
 * when the window is too narrow to hold both.
 *
 * Contact details and project links are the two things on screen worth keeping
 * whole. Everywhere else a clipped line just loses some prose; here it would
 * hand the reader half an address, which is worse than making them read two
 * lines for it.
 *
 * The focus marker is written *into* the indent rather than added in front of
 * it, so the label sits in the same column whether or not it's the one selected
 * — a list that shifts sideways as you arrow down it is unreadable.
 */
function labelled(t, indent, label, labelW, value, width, focused) {
  const gutter = (focused ? `${t.accent("❯")} ` : "  ") + indent.slice(2);
  const head = `${gutter}${t.muted(padEnd(label, labelW))}`;
  const shown = focused ? t.accent(BOLD + value + RESET) : t.accent(value);

  if (visibleWidth(head) + visibleWidth(value) <= width) return [head + shown];
  return [
    `${gutter}${t.muted(label)}`,
    ...block(value, width, `${indent}  `).map((l) => (focused ? t.accent(bold(l)) : t.accent(l))),
  ];
}

/* ------------------------------------------------------------------ header */

/**
 * The identity block. `compact` drops the two optional lines when the window is
 * too short to spend five rows on a header — the body is what the reader came
 * for, and on a 24-row terminal it needs every line it can get.
 */
export function header(data, t, width, compact) {
  const { profile } = data;
  const handle = profile.name.toLowerCase().replace(/\s+/g, "-");
  const out = [];

  const prompt = `~/${handle}`;
  out.push(t.muted(twoCol(prompt, profile.promptMeta, width) ?? prompt));

  const spaced = [...profile.name.toUpperCase()].join(" ");
  out.push(t.grad(spaced.length <= width ? spaced : profile.name.toUpperCase()));

  if (!compact) {
    out.push(t.muted(wrap(profile.headline, width)[0]));
    const status = profile.status ? `${profile.status} · ${profile.location}` : profile.location;
    out.push(`${t.accent("●")} ${t.muted(wrap(status, width, "  ")[0])}`);
  }

  return out;
}

/** The section strip. The current one carries the accent, like the rail's nav. */
export function nav(t, current, width) {
  const parts = SECTIONS.map((s, i) =>
    i === current
      ? `${t.accent(s.index)} ${BOLD}${s.title}${RESET}`
      : t.muted(`${s.index} ${s.title}`),
  );

  let line = parts.join("   ");
  // Numbers first, then titles: on a narrow window the labels are what goes,
  // because the highlight still says where you are.
  if (visibleWidth(line) > width) {
    line = SECTIONS.map((s, i) => (i === current ? t.accent(s.index) : t.muted(s.index))).join(
      "  ",
    );
  }
  return [line, t.border(rule(width))];
}

/**
 * The rule above the keys doubles as the scroll indicator: ▲/▼ hang off its
 * right end when there's more of the section above or below the window. It's
 * the only affordance telling you the viewport isn't the whole story.
 */
function scrollRule(t, width, { up, down }) {
  const marks = `${up ? "▲" : ""}${down ? "▼" : ""}`;
  if (!marks) return t.border(rule(width));
  return t.border(rule(Math.max(0, width - marks.length - 1))) + " " + t.muted(marks);
}

/**
 * The key hints, and what ⏎ does is read off whatever is focused rather than
 * off the section: in Work the same key expands a project and then opens the
 * links it just revealed, and the footer is the only thing that can say so.
 *
 * `notice` takes the line over when there is one — the result of opening a link
 * is the one message this app has to deliver, and it belongs where the reader
 * is already looking for what the keys do.
 */
export function footer(t, width, focused, scroll = { up: false, down: false }, notice = null) {
  if (notice) return [scrollRule(t, width, scroll), t.muted(truncate(notice, width))];

  const keys = focused
    ? [
        ["↑↓", "move"],
        ["⏎", focused.kind === LINK ? "open" : "expand"],
        ["←→", "section"],
        ["q", "quit"],
      ]
    : [
        ["←→", "section"],
        ["q", "quit"],
      ];

  const full = keys.map(([k, v]) => `${t.accent(k)} ${t.muted(v)}`).join(t.border("   ·   "));
  const line =
    visibleWidth(full) <= width ? full : keys.map(([k]) => t.accent(k)).join(t.border(" · "));

  return [scrollRule(t, width, scroll), line];
}

/* -------------------------------------------------------------------- body */

/**
 * Returns the section's lines plus, for each focusable row, the line it starts
 * on and how tall it is. index.js needs both to keep the focused row inside the
 * viewport when it scrolls.
 */
export function body(data, t, state, width) {
  const lines = [];
  const rows = [];
  const push = (...ls) => lines.push(...ls);

  const section = SECTIONS[state.section].id;
  const { profile } = data;

  /** The expand/collapse chevron plus the focus caret, as one fixed-width gutter. */
  const marker = (open, focused) =>
    `${focused ? t.accent("❯") : " "} ${t.accent(open ? "▾" : "▸")} `;

  if (section === "about") {
    push(...block(profile.bio, width));
    if (profile.now.length > 0) {
      push("", t.muted("Currently working on:"));
      for (const n of profile.now) {
        const w = wrap(n, width, "    ");
        push(`  ${t.accent("-")} ${w[0]}`, ...w.slice(1));
      }
    }
  }

  if (section === "contact") {
    push(...block("Open to internships and interesting problems — reach out.", width), "");
  }

  // Rows and links are drawn from the one target list, in its order, so a row's
  // position on screen and its position under the arrows are the same fact.
  targets(data, state).forEach((target, n) => {
    const focused = state.focus === n;

    // Blank line between entries, not after them: a project's links belong to
    // the project above them, so the gap goes before the next one starts.
    if (target.kind === ROW && lines.length > 0) push("");
    const start = lines.length;

    if (target.kind === LINK) {
      const inProject = section === "work";
      push(
        ...labelled(
          t,
          inProject ? "    " : "  ",
          target.label,
          inProject ? 9 : 10,
          target.text,
          width,
          focused,
        ),
      );
    } else if (section === "experience") {
      const exp = target.item;
      const open = state.expanded.has(target.id);
      const gutter = marker(open, focused);
      const title = focused ? t.accent(BOLD + exp.role + RESET) : bold(exp.role);

      push(twoCol(gutter + title, t.muted(exp.period), width) ?? gutter + title);
      push(...block(exp.org, width, "    ").map((l) => t.muted(l)));

      if (open) {
        for (const note of exp.note ?? []) {
          const w = wrap(note, width, "        ");
          push(`      ${t.accent("-")} ${w[0]}`, ...w.slice(1));
        }
      }
    } else {
      const p = target.item;
      const open = state.expanded.has(target.id);
      const num = t.accent(String(target.number).padStart(2, "0"));
      const name = focused ? t.accent(BOLD + p.name + RESET) : bold(p.name);

      const head = `${marker(open, focused)}${num}  ${name}`;
      push(twoCol(head, t.muted(String(p.year)), width) ?? head);
      push(...block(p.tagline, width, "    "));
      if (p.award) push(...block(`★ ${p.award}`, width, "    ").map((l) => t.accent(l)));

      if (open) {
        if (p.description) push("", ...block(p.description, width, "    "));
        if (p.stack.length > 0) {
          push(
            "",
            ...block(p.stack.map((s) => `[${s}]`).join(" "), width, "    ").map((l) => t.accent(l)),
          );
        }
      }
    }

    rows.push({ ...target, start, height: lines.length - start });
  });

  return { lines, rows };
}

/* ------------------------------------------------------------------- frame */

/** Scroll the minimum distance that brings the focused row back into view. */
function keepFocusVisible(state, rows, total, viewport) {
  if (rows.length > 0 && state.focus >= 0 && state.focus < rows.length) {
    const { start, height } = rows[state.focus];
    if (start < state.scroll) {
      state.scroll = start;
    } else if (start + height > state.scroll + viewport) {
      // A row taller than the window can't fit either way; show its head, since
      // that's where the title is.
      state.scroll = Math.min(start, start + height - viewport);
    }
  }
  state.scroll = Math.max(0, Math.min(state.scroll, Math.max(0, total - viewport)));
}

/**
 * The whole window: exactly `height` lines, none of them wider than `width`.
 * Everything above is a piece of it; this is where they're stacked and the body
 * is cut to whatever room the chrome left over.
 *
 * The clip at the end is what makes that a guarantee rather than a hope. One
 * line too wide would wrap, push everything below it down, and make a
 * full-screen redraw look like the app is tearing — so the promise belongs to
 * the function that assembles the frame, not to whoever draws it.
 *
 * It adjusts `state.scroll` as a side effect: how far to scroll isn't knowable
 * until the body has been laid out at this particular width, which is the same
 * pass that produces the lines.
 */
export function frame(data, t, state, width, height) {
  // Under ~22 rows the header gives up its two optional lines; the body is what
  // the reader actually came for.
  const head = header(data, t, width, height < 22);
  const navLines = nav(t, state.section, width);

  // head + blank + nav + viewport + footer(2) == height exactly, so the frame
  // fills the window without spilling over and scrolling it.
  const viewport = Math.max(3, height - (head.length + 1 + navLines.length + 2));
  const { lines, rows } = body(data, t, state, width);

  keepFocusVisible(state, rows, lines.length, viewport);

  const visible = lines.slice(state.scroll, state.scroll + viewport);
  while (visible.length < viewport) visible.push("");

  const foot = footer(
    t,
    width,
    rows[state.focus],
    { up: state.scroll > 0, down: state.scroll + viewport < lines.length },
    state.notice,
  );

  return [...head, "", ...navLines, ...visible, ...foot].map((l) => clip(l, width));
}
