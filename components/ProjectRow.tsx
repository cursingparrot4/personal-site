"use client";

import { useEffect, useId, useState } from "react";
import type { Project } from "@/lib/types";
import { ExternalLink } from "./links";
import { Tag } from "./Tag";
import { projKey, useTimelineSignal } from "./TimelineContext";
import styles from "./ProjectRow.module.css";

type Props = {
  project: Project;
  /** 1-based position; rendered zero-padded as the row index */
  index: number;
};

/**
 * Expandable project row. Collapsed: index, name, tagline, stack, year.
 * Click to reveal the full description + repo/demo/devpost links in place.
 */
export function ProjectRow({ project, index }: Props) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const num = String(index).padStart(2, "0");
  const { name, tagline, description, stack, year, award, links, slug } = project;
  const hasLinks = Boolean(links.repo || links.demo || links.devpost);
  // Lights this project's dot in the timeline. A no-op on /projects, which has
  // no timeline and so no provider.
  const { handlers, peeked } = useTimelineSignal(projKey(slug), open);

  // Deep link: /projects#<slug> lands on this row already expanded. That's what
  // the timeline dots point at, since a project has no page of its own.
  useEffect(() => {
    const sync = () => {
      if (decodeURIComponent(window.location.hash.slice(1)) === slug) setOpen(true);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [slug]);

  return (
    <div id={slug} className={styles.row} data-open={open} data-peek={peeked}>
      <button
        type="button"
        className={styles.header}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        {...handlers}
      >
        <span className={`${styles.index} mono`} aria-hidden="true">
          {num}
        </span>

        <span className={styles.main}>
          <span className={styles.heading}>
            <span className={styles.name}>{name}</span>
            {award ? <span className={`${styles.award} mono`}>{award}</span> : null}
          </span>
          <span className={styles.tagline}>{tagline}</span>
          <span className={styles.stack}>
            {stack.map((tech) => (
              <Tag key={tech}>{tech}</Tag>
            ))}
          </span>
        </span>

        {/* Right-aligned on the title's baseline, matching how the experience
            list places its period. */}
        <span className={`${styles.year} mono`}>{year}</span>

        <span className={styles.chevron} aria-hidden="true">
          ⌄
        </span>
      </button>

      <div id={panelId} className={styles.panel} role="region" inert={!open}>
        <div className={styles.panelInner}>
          {description ? (
            <p className={styles.desc} data-last={!hasLinks}>
              {description}
            </p>
          ) : null}
          {hasLinks ? (
            <p className={`${styles.links} mono`}>
              {links.repo ? (
                <ExternalLink href={links.repo} className="link-muted link-underline">
                  Repo
                </ExternalLink>
              ) : null}
              {links.demo ? (
                <ExternalLink href={links.demo} className="link-muted link-underline">
                  Demo
                </ExternalLink>
              ) : null}
              {links.devpost ? (
                <ExternalLink href={links.devpost} className="link-muted link-underline">
                  Devpost
                </ExternalLink>
              ) : null}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
