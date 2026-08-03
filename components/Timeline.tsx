"use client";

import Link from "next/link";
import type { Experience, Project } from "@/lib/types";
import { expKey, projKey, useTimeline } from "./TimelineContext";
import styles from "./Timeline.module.css";

/** "2025-09" → absolute month index, so the axis is plain arithmetic. */
function toMonths(ym: string): number {
  const [y, m] = ym.split("-").map(Number);
  return y * 12 + (m - 1);
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function spell(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  return `${MONTHS[m - 1]} ${y}`;
}

/**
 * Projects carry a year, not a month. Spread the ones sharing a year evenly
 * across it: two 2026 projects land in April and August rather than on top of
 * each other. That horizontal offset is spacing, not data — the axis is only
 * honest to the year, which is why each dot names its project and its year to
 * assistive tech rather than leaving position to do the talking.
 */
function placeProjects(projects: Project[]): { project: Project; month: number }[] {
  const byYear = new Map<number, Project[]>();
  for (const p of projects) {
    const bucket = byYear.get(p.year);
    if (bucket) bucket.push(p);
    else byYear.set(p.year, [p]);
  }

  const placed: { project: Project; month: number }[] = [];
  for (const [year, bucket] of byYear) {
    const n = bucket.length;
    bucket.forEach((project, j) => {
      // The array is newest-first, so the first of a year sits latest in it.
      placed.push({ project, month: year * 12 + ((n - j) / (n + 1)) * 12 });
    });
  }
  // Left-to-right DOM order, so tab order follows the axis.
  return placed.sort((a, b) => a.month - b.month);
}

type Props = {
  items: Experience[];
  /** every project, not just the featured ones — the timeline is the full history */
  projects?: Project[];
};

/**
 * The career timeline: one bar per role, placed and sized by its real start/end
 * months, plus a dot per project on a lane of its own. Reading it gives what the
 * lists alone can't — how long each role ran, where they overlap, where the gaps
 * are, and what got built in between.
 *
 * It is a mirror of the lists below, not a control surface: marks light up when
 * their row is expanded or hovered (see `TimelineContext`). Nothing here holds
 * state of its own.
 *
 * The role lanes are one `role="img"`: every bar restates a period the list
 * spells out in text directly below, so exposing the lanes individually to a
 * screen reader would only duplicate it. The project dots sit outside that
 * group because they're real links, each with its own accessible name.
 */
export function Timeline({ items, projects = [] }: Props) {
  const { open, peek, setPeek } = useTimeline();

  if (items.length === 0) return null;

  const dots = placeProjects(projects);

  const starts = items.map((it) => toMonths(it.start));
  const ends = items.map((it) => toMonths(it.end));
  // A month of air at each end, so the oldest and newest marks read as marks
  // rather than as something clipped by the container.
  const min = Math.min(...starts, ...dots.map((d) => d.month)) - 1;
  const max = Math.max(...ends, ...dots.map((d) => d.month)) + 1;
  const span = max - min;
  // A single-month history has no axis to draw; the lists still say everything.
  if (span <= 0) return null;

  const pct = (month: number) => ((month - min) / span) * 100;

  // One gridline per January inside the domain — the left edge is already the
  // earliest month, so a tick there would sit on top of it.
  const ticks: number[] = [];
  for (let y = Math.floor(min / 12) + 1; y <= Math.floor(max / 12); y++) ticks.push(y);

  const earliest = items.reduce((a, b) => (toMonths(a.start) < toMonths(b.start) ? a : b));
  const latest = items.reduce((a, b) => (toMonths(a.end) > toMonths(b.end) ? a : b));

  return (
    <div className={styles.chart}>
      <div className={`${styles.axis} mono`} aria-hidden="true">
        {ticks.map((year) => (
          <span key={year} className={styles.tick} style={{ left: `${pct(year * 12)}%` }}>
            {year}
          </span>
        ))}
      </div>

      <div
        className={styles.lanes}
        role="img"
        aria-label={`Duration chart: ${items.length} roles spanning ${spell(earliest.start)} to ${spell(latest.end)}.`}
      >
        {items.map((it) => {
          const key = expKey(it.org, it.role);
          return (
            <div key={key} className={styles.lane}>
              <span className={`${styles.label} mono`}>{it.org}</span>
              <span className={styles.track}>
                <span
                  className={styles.bar}
                  data-lit={open.has(key)}
                  data-peek={peek === key}
                  onMouseEnter={() => setPeek(key, true)}
                  onMouseLeave={() => setPeek(key, false)}
                  style={{
                    left: `${pct(toMonths(it.start))}%`,
                    width: `${pct(toMonths(it.end)) - pct(toMonths(it.start))}%`,
                  }}
                />
              </span>
            </div>
          );
        })}
      </div>

      {dots.length > 0 ? (
        <div className={`${styles.lane} ${styles.projectLane}`}>
          <span className={`${styles.label} mono`} aria-hidden="true">
            Projects
          </span>
          <span className={styles.track}>
            {dots.map(({ project, month }) => {
              const key = projKey(project.slug);
              const x = pct(month);
              // Names are nowrap and can outrun the plot at either end, so the
              // outermost dots hang their label inward instead of centring it.
              const align = x < 22 ? "start" : x > 78 ? "end" : "center";
              return (
                <Link
                  key={project.slug}
                  href={`/projects#${project.slug}`}
                  className={styles.dot}
                  style={{ left: `${x}%` }}
                  data-lit={open.has(key)}
                  data-peek={peek === key}
                  data-align={align}
                  aria-label={`${project.name}, ${project.year}`}
                  onMouseEnter={() => setPeek(key, true)}
                  onMouseLeave={() => setPeek(key, false)}
                  onFocus={() => setPeek(key, true)}
                  onBlur={() => setPeek(key, false)}
                >
                  <span className={`${styles.dotLabel} mono`} aria-hidden="true">
                    {project.name}
                  </span>
                </Link>
              );
            })}
          </span>
        </div>
      ) : null}
    </div>
  );
}
