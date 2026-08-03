"use client";

import { useId, useState } from "react";
import type { Experience } from "@/lib/types";
import { expKey, useTimelineSignal } from "./TimelineContext";
import styles from "./ExperienceList.module.css";

function ExperienceItem({ exp }: { exp: Experience }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const titleId = useId();
  const hasNote = Boolean(exp.note?.length);
  // Lights this role's bar in the timeline above, and picks the highlight back
  // up when the bar itself is hovered.
  const { handlers, peeked } = useTimelineSignal(expKey(exp.org, exp.role), open);

  const headerContent = (
    <>
      <span id={titleId} className={styles.role}>
        {exp.role}
      </span>
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
    </>
  );

  return (
    <li className={styles.item} data-open={open} data-peek={peeked}>
      {hasNote ? (
        <button
          type="button"
          className={styles.header}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
          {...handlers}
        >
          {headerContent}
        </button>
      ) : (
        /* Not a disabled button: that would drop it from the tab order *and*
           swallow the hover that lights this role's bar in the timeline. */
        <div className={`${styles.header} ${styles.headerStatic}`} {...handlers}>
          {headerContent}
        </div>
      )}

      {hasNote ? (
        <div
          id={panelId}
          className={styles.panel}
          role="region"
          aria-labelledby={titleId}
          inert={!open}
        >
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
