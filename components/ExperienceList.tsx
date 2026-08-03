"use client";

import { useId, useState } from "react";
import type { Experience } from "@/lib/types";
import { expKey, useTimelineSignal } from "./TimelineContext";
import styles from "./ExperienceList.module.css";

function ExperienceItem({ exp }: { exp: Experience }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const hasNote = Boolean(exp.note?.length);
  // Lights this role's bar in the timeline above, and picks the highlight back
  // up when the bar itself is hovered.
  const { handlers, peeked } = useTimelineSignal(expKey(exp.org, exp.role), open);

  return (
    <li className={styles.item} data-open={open} data-peek={peeked}>
      <button
        type="button"
        className={styles.header}
        aria-expanded={hasNote ? open : undefined}
        aria-controls={hasNote ? panelId : undefined}
        onClick={() => hasNote && setOpen((o) => !o)}
        disabled={!hasNote}
        {...handlers}
      >
        <span className={styles.role}>{exp.role}</span>
        <span className={`${styles.org} mono`}>{exp.org}</span>
        {/* Inline now that the chart above carries the temporal reading — the
            fixed gutter this used to live in was what forced the list and the
            project rows to share a width. */}
        <span className={`${styles.period} mono`}>{exp.period}</span>
        {hasNote ? (
          <span className={styles.chevron} aria-hidden="true">
            ⌄
          </span>
        ) : null}
      </button>

      {hasNote ? (
        <div id={panelId} className={styles.panel} role="region" inert={!open}>
          <div className={styles.panelInner}>
            <ul className={styles.note}>
              {exp.note!.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </li>
  );
}

/** Expandable role/org/period rows; click reveals the note. */
export function ExperienceList({ items }: { items: Experience[] }) {
  return (
    <ol className={styles.list}>
      {items.map((exp) => (
        <ExperienceItem key={`${exp.org}-${exp.role}`} exp={exp} />
      ))}
    </ol>
  );
}
