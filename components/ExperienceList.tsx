"use client";

import { useId, useState } from "react";
import type { Experience } from "@/lib/types";
import styles from "./ExperienceList.module.css";

function ExperienceItem({ exp }: { exp: Experience }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const hasNote = Boolean(exp.note);

  return (
    <div className={styles.item} data-open={open}>
      <button
        type="button"
        className={styles.header}
        aria-expanded={hasNote ? open : undefined}
        aria-controls={hasNote ? panelId : undefined}
        onClick={() => hasNote && setOpen((o) => !o)}
        disabled={!hasNote}
      >
        <span className={styles.role}>{exp.role}</span>
        <span className={`${styles.org} mono`}>{exp.org}</span>
        {hasNote ? (
          <span className={styles.chevron} aria-hidden="true">
            ⌄
          </span>
        ) : null}
      </button>

      {/* Timeline gutter — spans the whole item, so it stretches as the panel opens. */}
      <div className={styles.rail}>
        <span className={styles.track} aria-hidden="true">
          <span className={styles.node} />
        </span>
        {/* The slot carries a strut matching .role, so the date sits on the
            same baseline as the role text regardless of font metrics. */}
        <span className={styles.dateSlot}>
          <span className={`${styles.period} mono`}>{exp.period}</span>
        </span>
      </div>

      {hasNote ? (
        <div id={panelId} className={styles.panel} role="region" inert={!open}>
          <div className={styles.panelInner}>
            <p className={styles.note}>{exp.note}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** Expandable role/org/period rows; click reveals the detail note. */
export function ExperienceList({ items }: { items: Experience[] }) {
  return (
    <div className={styles.list}>
      {items.map((exp) => (
        <ExperienceItem key={`${exp.org}-${exp.role}`} exp={exp} />
      ))}
    </div>
  );
}
