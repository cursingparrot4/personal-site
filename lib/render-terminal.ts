import { profile, profileHandle } from "@/content/profile";
import { featuredProjects, projects } from "@/content/projects";
import { site } from "@/lib/site";
import type { Experience, Project } from "@/lib/types";
import { padEnd, rule, strip, truncate, visibleWidth, wrap } from "@/lib/ansi";
import { createFormatter, type Formatter } from "@/lib/fmt";
import { placeProjects, toMonths } from "@/lib/timeline";

/**
 * The terminal rendering of the site, served from app/txt/. It reads the same
 * content modules the pages do — content/profile.ts, content/projects.ts — so
 * there is no second copy of anything to keep in step. Add a project and it
 * appears here for free.
 *
 * Section numbers and labels mirror app/page.tsx exactly; the colours are the
 * site's own tokens (lib/ansi.ts). Only chrome is written twice, and where it
 * is, there's a comment saying so.
 *
 * One deliberate departure from the stylesheet: body prose is left uncoloured
 * rather than painted `--text`. The site is dark-only and can guarantee its own
 * background; a terminal can't, and #e2e8ec on a light profile would be white
 * on white. Leaving it to the terminal's own foreground is what every
 * well-behaved CLI does. Accent, muted and border are all legible either way,
 * so those stay.
 */

export type RenderOptions = {
  /** printed columns; the route clamps this, 80 by default */
  width: number;
  color: boolean;
  hyperlinks: boolean;
};

const host = new URL(site.url).host;

/* ------------------------------------------------------------------ layout */

/**
 * One line with `left` flush and `right` hard against the margin, or null when
 * they can't both fit — every caller has a stacked fallback for narrow
 * terminals, since a server can't know how wide the window actually is.
 */
function twoCol(left: string, right: string, width: number): string | null {
  const used = visibleWidth(left) + visibleWidth(right);
  if (used + 2 > width) return null;
  return left + " ".repeat(width - used) + right;
}

/** Wrapped text at a fixed indent, first line included (wrap() skips it). */
function block(text: string, width: number, indent = ""): string[] {
  const lines = wrap(text, width, indent);
  return lines.map((l, i) => (i === 0 ? indent + l : l));
}

/** A hanging-indent bullet: accent marker, text aligned under itself. */
function bullet(f: Formatter, text: string, width: number, indent: number): string[] {
  const pad = " ".repeat(indent);
  const lines = wrap(text, width, " ".repeat(indent + 2));
  return [`${pad}${f.c("-", "accent")} ${lines[0]}`, ...lines.slice(1)];
}

/** `001 ── ~/.profile ───────────` + the title under it. Mirrors <Section>. */
function section(
  f: Formatter,
  width: number,
  index: string,
  label: string,
  title: string,
): string[] {
  const lead = `${index} ── ${label} `;
  return [
    "",
    "",
    f.c(index, "accent") +
      f.c(" ── ", "border") +
      f.c(label, "muted") +
      " " +
      f.c(rule(Math.max(0, width - lead.length)), "border"),
    f.bold(title),
    "",
  ];
}

/* ------------------------------------------------------------------ blocks */

/** The rail, flattened: prompt row, name, headline, availability, now list. */
function identity(f: Formatter, width: number): string[] {
  const out: string[] = [];

  const prompt = `~/${profileHandle}`;
  out.push(f.c(twoCol(prompt, profile.promptMeta, width) ?? prompt, "muted"));
  out.push(f.c(rule(width), "border"));
  out.push("");

  // Letter-spaced so the fade has room to read as a fade rather than as two
  // colours; collapses to the plain name if the terminal can't hold it.
  const spaced = [...profile.name.toUpperCase()].join(" ");
  out.push(f.grad(spaced.length <= width ? spaced : profile.name.toUpperCase()));
  out.push(...block(profile.headline, width).map((l) => f.c(l, "muted")));
  out.push("");

  const status = profile.status ? `${profile.status} · ${profile.location}` : profile.location;
  const statusLines = wrap(status, width, "  ");
  out.push(`${f.c("●", "accent")} ${f.c(statusLines[0], "muted")}`);
  out.push(...statusLines.slice(1).map((l) => f.c(l, "muted")));

  if (profile.now.length > 0) {
    out.push("");
    // Chrome, worded to match components/Rail.tsx. The list itself is content.
    out.push(f.c("Currently working on:", "muted"));
    for (const n of profile.now) out.push(...bullet(f, n, width, 2));
  }

  return out;
}

/**
 * The ASCII mirror of components/Timeline.tsx: a bar per role sized by its real
 * months, a lane of project dots, one shared axis. Both charts get their maths
 * from lib/timeline.ts, so they can't disagree about where a bar starts.
 */
function chart(f: Formatter, width: number): string[] {
  const items = profile.experience;
  if (items.length === 0) return [];

  const dots = placeProjects(projects);
  // Give the labels whatever they need up to a third of the line — enough for
  // "Queen's Knights Robotics" at 80 columns — and ellipsize past that rather
  // than starve the track.
  const longest = Math.max(8, ...items.map((it) => it.org.length));
  const labelW = Math.min(longest, Math.max(8, Math.floor(width * 0.3)));
  const track = width - labelW - 1;
  // Below this the bars are too short to say anything true about duration, and
  // a misleading chart is worse than none — the list below carries the dates.
  if (track < 16) return [];

  const min = Math.min(...items.map((it) => toMonths(it.start)), ...dots.map((d) => d.month)) - 1;
  const max = Math.max(...items.map((it) => toMonths(it.end)), ...dots.map((d) => d.month)) + 1;
  const span = max - min;
  if (span <= 0) return [];

  const col = (month: number) =>
    Math.max(0, Math.min(track - 1, Math.round(((month - min) / span) * (track - 1))));

  const gutter = " ".repeat(labelW + 1);
  const out: string[] = [];

  // Year ticks — one per January inside the domain, dropped where it would
  // collide with the year before it.
  const ticks: string[] = new Array(track).fill(" ");
  for (let y = Math.floor(min / 12) + 1; y <= Math.floor(max / 12); y++) {
    const label = String(y);
    const at = Math.max(0, Math.min(track - label.length, col(y * 12)));
    const from = Math.max(0, at - 1);
    if (ticks.slice(from, at + label.length + 1).every((c) => c === " ")) {
      for (let k = 0; k < label.length; k++) ticks[at + k] = label[k];
    }
  }
  out.push(gutter + f.c(ticks.join("").trimEnd(), "muted"));

  for (const it of items) {
    const a = col(toMonths(it.start));
    const b = Math.max(a, col(toMonths(it.end)));
    out.push(
      f.c(padEnd(truncate(it.org, labelW), labelW), "muted") +
        " " +
        " ".repeat(a) +
        f.c("█".repeat(b - a + 1), "accent"),
    );
  }

  if (dots.length > 0) {
    const lane: string[] = new Array(track).fill(" ");
    for (const d of dots) {
      // Nudge right off an occupied column so two projects in one year still
      // read as two marks rather than silently becoming one.
      let at = col(d.month);
      while (at < track && lane[at] !== " ") at++;
      if (at < track) lane[at] = "·";
    }
    out.push(
      f.c(padEnd("Projects", labelW), "muted") + " " + f.c(lane.join("").trimEnd(), "accent"),
    );

    // Five names strung along one lane would be unreadable — the same reason
    // the browser chart only shows a dot's name while it's lit. Name them in a
    // legend underneath instead, grouped by year.
    const byYear = new Map<number, string[]>();
    for (const p of projects) {
      const bucket = byYear.get(p.year);
      if (bucket) bucket.push(p.name);
      else byYear.set(p.year, [p.name]);
    }
    const legend = [...byYear.entries()]
      .sort((a, b) => b[0] - a[0])
      .map(([year, names]) => `${year} ${names.join(", ")}`)
      .join("   ·   ");
    out.push(...block(legend, width, gutter).map((l) => f.c(l, "muted")));
  }

  return out;
}

/** Mirrors an ExperienceList row, expanded — curl has no click. */
function experienceBlock(f: Formatter, exp: Experience, width: number): string[] {
  const out: string[] = [];
  const inline = twoCol(`  ${f.bold(exp.role)}`, f.c(exp.period, "muted"), width);

  if (inline) {
    out.push(inline);
    out.push(...block(exp.org, width, "  ").map((l) => f.c(l, "muted")));
  } else {
    // Too narrow to hang the period off the right margin, so it joins the org
    // line instead — and both wrap, because at this width they have to.
    out.push(...block(exp.role, width, "  ").map((l) => f.bold(l)));
    out.push(...block(`${exp.org} · ${exp.period}`, width, "  ").map((l) => f.c(l, "muted")));
  }

  for (const note of exp.note ?? []) out.push(...bullet(f, note, width, 4));
  out.push("");
  return out;
}

/** Mirrors a ProjectRow. `expanded` adds the description, as clicking does. */
function projectBlock(
  f: Formatter,
  project: Project,
  index: number,
  width: number,
  expanded: boolean,
): string[] {
  const { name, tagline, description, stack, year, award, links } = project;
  const out: string[] = [];
  const indent = "      ";

  const head = `  ${f.c(String(index).padStart(2, "0"), "accent")}  ${f.bold(name)}`;
  out.push(twoCol(head, f.c(String(year), "muted"), width) ?? head);
  out.push(...block(tagline, width, indent));
  if (award) out.push(...block(`★ ${award}`, width, indent).map((l) => f.c(l, "accent")));

  if (expanded && description) {
    out.push("");
    out.push(...block(description, width, indent));
  }

  if (stack.length > 0) {
    out.push("");
    out.push(
      ...block(stack.map((tech) => `[${tech}]`).join(" "), width, indent).map((l) =>
        f.c(l, "accent"),
      ),
    );
  }

  for (const [label, url] of [
    ["repo", links.repo],
    ["demo", links.demo],
    ["devpost", links.devpost],
  ] as const) {
    if (url) out.push(`${indent}${f.c(padEnd(label, 9), "muted")}${f.link(url)}`);
  }

  out.push("");
  return out;
}

function contact(f: Formatter, width: number): string[] {
  const out: string[] = [];
  // Chrome, worded to match app/page.tsx.
  out.push(...block("Open to internships and interesting problems — reach out.", width));
  out.push("");

  const rows: [string, string, string?][] = [
    ["email", `mailto:${profile.links.email}`, profile.links.email],
    ["resume", `${site.url}/resume.pdf`],
    ["github", profile.links.github],
  ];
  if (profile.links.linkedin) rows.push(["linkedin", profile.links.linkedin]);

  for (const [label, url, shown] of rows) {
    out.push(`  ${f.c(padEnd(label, 10), "muted")}${f.link(url, shown)}`);
  }
  return out;
}

function footer(f: Formatter, width: number): string[] {
  const hints: [string, string][] = [
    [`curl ${host}/projects`, "the full index"],
    ["?plain", "no colour, no escapes"],
    ["?w=100", "set the width"],
    [`${host}/resume.pdf`, "the PDF"],
  ];

  const col = Math.max(...hints.map(([left]) => left.length)) + 3;
  const lines =
    // Two columns need room for both halves; below that the gloss is what goes.
    width >= col + 22
      ? hints.map(([left, right]) => padEnd(left, col) + right)
      : hints.map(([left]) => left);

  return ["", "", f.c(rule(width), "border"), ...lines.map((l) => f.c(l, "muted")), ""];
}

/**
 * Every block closes with its own breathing room and every section opens with
 * its own, so the seams between them stack up three and four blank lines deep.
 * Capping the run at two keeps the deliberate gap between sections without
 * making each block reason about whatever happens to follow it.
 */
function tidy(lines: string[]): string {
  const isBlank = (line: string) => strip(line).trim() === "";
  const out: string[] = [];
  let blanks = 0;

  for (const line of lines) {
    if (isBlank(line)) {
      if (++blanks > 2) continue;
    } else {
      blanks = 0;
    }
    out.push(line);
  }

  while (out.length > 0 && isBlank(out[0])) out.shift();
  while (out.length > 0 && isBlank(out[out.length - 1])) out.pop();
  return out.join("\n") + "\n";
}

/* ------------------------------------------------------------------- pages */

/** The home page: about, experience + chart, featured work, contact. */
export function renderHome(opts: RenderOptions): string {
  const f = createFormatter(opts);
  const w = opts.width;
  const out: string[] = [...identity(f, w)];

  out.push(...section(f, w, "001", "~/.profile", "About"));
  out.push(...block(profile.bio, w));

  out.push(...section(f, w, "002", "~/.history", "Experience"));
  const bars = chart(f, w);
  if (bars.length > 0) out.push(...bars, "");
  for (const exp of profile.experience) out.push(...experienceBlock(f, exp, w));

  out.push(...section(f, w, "003", "~/bin/builds", "Recent Projects"));
  featuredProjects.forEach((project, i) => out.push(...projectBlock(f, project, i + 1, w, false)));
  out.push(
    `  ${f.c("All projects", "muted")} ${f.c("→", "accent")} ${f.link(`${site.url}/projects`)}`,
  );

  out.push(...section(f, w, "004", "~/.forward", "Contact"));
  out.push(...contact(f, w));

  out.push(...footer(f, w));
  return tidy(out);
}

/** The full index — every project, descriptions included. */
export function renderProjects(opts: RenderOptions): string {
  const f = createFormatter(opts);
  const w = opts.width;
  const out: string[] = [...identity(f, w)];

  out.push(...section(f, w, "idx", "~/bin/builds", "Projects"));
  projects.forEach((project, i) => out.push(...projectBlock(f, project, i + 1, w, true)));

  out.push(...footer(f, w));
  return tidy(out);
}
