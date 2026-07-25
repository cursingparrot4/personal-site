"use client";

import { useEffect, useState } from "react";
import styles from "./Rail.module.css";

/**
 * In-page section nav with scroll-spy. Highlights the section currently in view
 * and smooth-scrolls to a section on click (native, via the # anchor).
 */
export function RailNav({ sections }: { sections: { id: string; label: string }[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      // trigger when a section sits in the upper-middle band of the viewport
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 },
    );

    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [sections]);

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
