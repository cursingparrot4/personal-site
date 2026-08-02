import type { Experience } from "@/lib/types";
import styles from "./ExperienceChart.module.css";

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
 * Duration chart for the experience list: one lane per role, each bar placed
 * and sized by its real start/end months against a shared axis. Reading it
 * gives what the list alone can't — how long each role ran, where they overlap
 * and where the gaps are.
 *
 * `role="img"` with a summary label: every bar restates a period that the list
 * below already spells out in text, so exposing the lanes individually to a
 * screen reader would just duplicate it.
 */
export function ExperienceChart({ items }: { items: Experience[] }) {
  if (items.length === 0) return null;

  const starts = items.map((it) => toMonths(it.start));
  const ends = items.map((it) => toMonths(it.end));
  // A month of air at each end, so the oldest and newest bars read as bars
  // rather than as something clipped by the container.
  const min = Math.min(...starts) - 1;
  const max = Math.max(...ends) + 1;
  const span = max - min;
  // A single-month history has no axis to draw; the list still says everything.
  if (span <= 0) return null;

  const pct = (month: number) => ((month - min) / span) * 100;

  // One gridline per January inside the domain — the left edge is already the
  // earliest month, so a tick there would sit on top of it.
  const ticks: number[] = [];
  for (let y = Math.floor(min / 12) + 1; y <= Math.floor(max / 12); y++) ticks.push(y);

  const earliest = items.reduce((a, b) => (toMonths(a.start) < toMonths(b.start) ? a : b));
  const latest = items.reduce((a, b) => (toMonths(a.end) > toMonths(b.end) ? a : b));

  return (
    <div
      className={styles.chart}
      role="img"
      aria-label={`Duration chart: ${items.length} roles spanning ${spell(earliest.start)} to ${spell(latest.end)}.`}
    >
      <div className={`${styles.axis} mono`}>
        {ticks.map((year) => (
          <span key={year} className={styles.tick} style={{ left: `${pct(year * 12)}%` }}>
            {year}
          </span>
        ))}
      </div>

      {items.map((it, i) => (
        <div key={`${it.org}-${it.role}`} className={styles.lane}>
          <span className={`${styles.label} mono`}>{it.org}</span>
          <span className={styles.track}>
            <span
              className={styles.bar}
              /* Newest first is the array's contract (see README), so index 0 is
                 the most recent role rather than a date comparison that would
                 bake "current" into a static build and quietly go stale. */
              data-recent={i === 0}
              style={{
                left: `${pct(toMonths(it.start))}%`,
                width: `${pct(toMonths(it.end)) - pct(toMonths(it.start))}%`,
              }}
            />
          </span>
        </div>
      ))}
    </div>
  );
}
