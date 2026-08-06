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
 */
function labelled(t, indent, label, labelW, value, width) {
  const head = `${indent}${t.muted(padEnd(label, labelW))}`;
  if (visibleWidth(head) + visibleWidth(value) <= width) return [head + t.accent(value)];
  return [
    `${indent}${t.muted(label)}`,
    ...block(value, width, `${indent}  `).map((l) => t.accent(l)),
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

export function footer(t, width, section, scroll = { up: false, down: false }) {
  const keys =
    SECTIONS[section].id === "experience" || SECTIONS[section].id === "work"
      ? [
          ["↑↓", "move"],
          ["⏎", "expand"],
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
  const startRow = () => lines.length;
  const endRow = (start) => rows.push({ start, height: lines.length - start });

  const section = SECTIONS[state.section].id;
  const { profile, projects, site } = data;

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

  if (section === "experience") {
    profile.experience.forEach((exp, i) => {
      const start = startRow();
      const open = state.expanded.has(`exp:${i}`);
      const focused = state.focus === i;
      const marker = `${focused ? t.accent("❯") : " "} ${t.accent(open ? "▾" : "▸")} `;
      const title = focused ? t.accent(BOLD + exp.role + RESET) : bold(exp.role);

      push(twoCol(marker + title, t.muted(exp.period), width) ?? marker + title);
      push(...block(exp.org, width, "    ").map((l) => t.muted(l)));

      if (open) {
        for (const note of exp.note ?? []) {
          const w = wrap(note, width, "        ");
          push(`      ${t.accent("-")} ${w[0]}`, ...w.slice(1));
        }
      }
      push("");
      endRow(start);
    });
  }

  if (section === "work") {
    projects.forEach((p, i) => {
      const start = startRow();
      const open = state.expanded.has(`proj:${i}`);
      const focused = state.focus === i;
      const marker = `${focused ? t.accent("❯") : " "} ${t.accent(open ? "▾" : "▸")} `;
      const num = t.accent(String(i + 1).padStart(2, "0"));
      const name = focused ? t.accent(BOLD + p.name + RESET) : bold(p.name);

      const head = `${marker}${num}  ${name}`;
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
        for (const [label, url] of [
          ["repo", p.links.repo],
          ["demo", p.links.demo],
          ["devpost", p.links.devpost],
        ]) {
          if (url) push(...labelled(t, "    ", label, 9, url, width));
        }
      }
      push("");
      endRow(start);
    });
  }

  if (section === "contact") {
    push(...block("Open to internships and interesting problems — reach out.", width), "");
    const links = [
      ["email", profile.links.email],
      ["resume", `${site.url}/resume.pdf`],
      ["github", profile.links.github],
    ];
    if (profile.links.linkedin) links.push(["linkedin", profile.links.linkedin]);
    for (const [label, value] of links) {
      push(...labelled(t, "  ", label, 10, value, width));
    }
  }

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

  const foot = footer(t, width, state.section, {
    up: state.scroll > 0,
    down: state.scroll + viewport < lines.length,
  });

  return [...head, "", ...navLines, ...visible, ...foot].map((l) => clip(l, width));
}
