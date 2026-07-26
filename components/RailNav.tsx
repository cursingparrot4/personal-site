"use client";

import { useEffect, useState } from "react";
import styles from "./Rail.module.css";

type Section = { id: string; label: string };

/** Fraction of the viewport height that acts as the "you are here" line. */
const ACTIVE_LINE = 0.35;

/**
 * In-page section nav with scroll-spy. Highlights the section currently in view
 * and smooth-scrolls to a section on click (native, via the # anchor).
 *
 * The active section is derived from scroll position rather than raw
 * IntersectionObserver callbacks: the last section whose top has crossed the
 * active line wins. That stays deterministic when several sections straddle the
 * line at once, when a section is shorter than the observer band, and when the
 * page bottoms out before the final section ever reaches the line.
 */
export function RailNav({ sections }: { sections: Section[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  // The prop is a fresh array on every render; key off the ids so the effect is stable.
  const key = sections.map((s) => s.id).join("|");

  useEffect(() => {
    const ids = key.split("|");
    let frame = 0;

    const pick = () => {
      frame = 0;
      const doc = document.documentElement;

      // At the very bottom the last section may never cross the line — snap to it.
      if (window.scrollY + window.innerHeight >= doc.scrollHeight - 2) {
        setActive(ids[ids.length - 1]);
        return;
      }

      const line = window.innerHeight * ACTIVE_LINE;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(pick);
    };

    pick();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // Expanding a project/experience row reflows the page without a scroll event.
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [key]);

  return (
    <ul className={styles.sectionNav}>
      {sections.map((s) => {
        const isActive = active === s.id;
        return (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={styles.sectionLink}
              data-active={isActive}
              aria-current={isActive ? "true" : undefined}
            >
              <span className={styles.bullet} aria-hidden="true" />
              {s.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
