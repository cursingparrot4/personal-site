"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { NavSection } from "@/lib/nav";
import styles from "./Rail.module.css";

type Props = {
  sections: NavSection[];
  /** which top-level entry is the current page; also switches scroll-spy on */
  page?: "home" | "projects";
};

/** Fraction of the viewport height that acts as the "you are here" line. */
const ACTIVE_LINE = 0.35;
/** Quiet time after the last scroll event that counts as "the page has stopped". */
const SETTLE_MS = 140;

/**
 * The rail's navigation tree:
 *
 *     Home
 *       — About / Experience / Projects / Contact
 *     All projects
 *
 * On the home page the section links are in-page anchors with scroll-spy; on
 * every other page they point back at `/#id` and only the current page's
 * top-level entry is marked.
 *
 * The active section is derived from scroll position rather than raw
 * IntersectionObserver callbacks: the last section whose top has crossed the
 * active line wins. That stays deterministic when several sections straddle the
 * line at once, when a section is shorter than the observer band, and when the
 * page bottoms out before the final section ever reaches the line.
 */
export function RailNav({ sections, page }: Props) {
  const spy = page === "home";
  const [active, setActive] = useState(sections[0]?.id ?? "");
  // The prop is a fresh array on every render; key off the ids so the effect is stable.
  const key = sections.map((s) => s.id).join("|");

  /**
   * Set while a nav click owns the highlight. Clicking a link is a statement of
   * intent, so the clicked section stays lit regardless of where the scroll
   * actually lands — a short section can leave the *next* one already past the
   * active line, which otherwise lit the wrong entry until you nudged the page
   * back up. `y` is the resting scroll position, filled in once the smooth
   * scroll stops; scrolling away from it hands control back to the spy.
   */
  const lock = useRef<{ id: string; y: number | null } | null>(null);
  const settle = useRef(0);

  /** Record where a click parked the page, so we can tell when the user leaves. */
  const markResting = () => {
    if (lock.current && lock.current.y === null) lock.current.y = window.scrollY;
  };

  const armLock = (id: string) => {
    lock.current = { id, y: null };
    setActive(id);
    // Also armed here in case the click doesn't move the page at all, which
    // would leave no scroll event to settle on.
    window.clearTimeout(settle.current);
    settle.current = window.setTimeout(markResting, SETTLE_MS);
  };

  useEffect(() => {
    if (!spy) return;
    const ids = key.split("|");
    let frame = 0;

    const pick = () => {
      frame = 0;

      if (lock.current) {
        // Still travelling to the target, or parked on it — keep the click's choice.
        if (lock.current.y === null || Math.abs(window.scrollY - lock.current.y) <= 4) return;
        lock.current = null;
      }

      const doc = document.documentElement;

      // At the very bottom the last section may never cross the line — snap to it.
      if (window.scrollY + window.innerHeight >= doc.scrollHeight - 2) {
        setActive(ids[ids.length - 1]);
        return;
      }

      const rects = ids.map((id) => document.getElementById(id)?.getBoundingClientRect() ?? null);

      // The line rests ACTIVE_LINE down the viewport, but it can't start there:
      // there is no scroll room above the first section, so a fixed line hands
      // that section only (its top − the line) pixels of scroll before the
      // second one crosses — a first section near the top of the document is
      // barely lit at all. So the line starts on the first section's own top
      // and slides down with the page until it reaches its resting height,
      // which gives each section a share of the scroll close to its share of
      // the page.
      const first = rects[0];
      const rest = window.innerHeight * ACTIVE_LINE;
      const line = first ? Math.min(rest, first.top + 2 * window.scrollY) : rest;

      let current = ids[0];
      rects.forEach((rect, i) => {
        if (rect && rect.top <= line) current = ids[i];
      });
      setActive(current);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(pick);
      // Smooth scrolling fires continuously; the last event to land is the one
      // that marks the resting position.
      if (lock.current && lock.current.y === null) {
        window.clearTimeout(settle.current);
        settle.current = window.setTimeout(markResting, SETTLE_MS);
      }
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
      window.clearTimeout(settle.current);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [key, spy]);

  return (
    <ul className={styles.navTree}>
      <li>
        <Link
          href="/"
          className={styles.rootLink}
          data-active={spy}
          aria-current={spy ? "page" : undefined}
        >
          <span className={styles.bullet} aria-hidden="true" />
          Home
        </Link>

        <ul className={styles.sectionNav}>
          {sections.map((s) => {
            const isActive = spy && active === s.id;
            return (
              <li key={s.id}>
                <a
                  href={spy ? `#${s.id}` : `/#${s.id}`}
                  className={styles.sectionLink}
                  data-active={isActive}
                  aria-current={isActive ? "true" : undefined}
                  onClick={spy ? () => armLock(s.id) : undefined}
                >
                  <span className={styles.bullet} aria-hidden="true" />
                  {s.label}
                </a>
              </li>
            );
          })}
        </ul>
      </li>

      <li>
        <Link
          href="/projects"
          className={styles.rootLink}
          data-active={page === "projects"}
          aria-current={page === "projects" ? "page" : undefined}
        >
          <span className={styles.bullet} aria-hidden="true" />
          All projects
        </Link>
      </li>
    </ul>
  );
}
