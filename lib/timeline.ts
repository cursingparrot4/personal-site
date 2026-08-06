import type { Project } from "@/lib/types";

/**
 * The month arithmetic behind the career chart, shared by the two things that
 * draw it: components/Timeline.tsx (the SVG-less DOM chart in the browser) and
 * lib/render-terminal.ts (the ASCII one served to curl). Both have to agree on
 * where a bar starts, so the maths lives here rather than in either of them.
 */

/** "2025-09" → absolute month index, so the axis is plain arithmetic. */
export function toMonths(ym: string): number {
  const [y, m] = ym.split("-").map(Number);
  return y * 12 + (m - 1);
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function spell(ym: string): string {
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
export function placeProjects(projects: Project[]): { project: Project; month: number }[] {
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
  // Left-to-right order, so tab order (and the ASCII lane) follows the axis.
  return placed.sort((a, b) => a.month - b.month);
}
