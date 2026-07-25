"use client";

import { useId, useState } from "react";
import Link from "next/link";
import type { Project } from "@/lib/types";
import { Tag } from "./Tag";
import styles from "./ProjectRow.module.css";

type Props = {
  project: Project;
  /** 1-based position; rendered zero-padded as the row index */
  index: number;
};

/**
 * Expandable project row. Collapsed: index, name, tagline, stack, year.
 * Click to reveal the full description + repo/demo/detail links in place.
 */
export function ProjectRow({ project, index }: Props) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const num = String(index).padStart(2, "0");
  const { name, tagline, description, stack, year, award, links, slug } = project;

  return (
    <div className={styles.row} data-open={open}>
      <button
        type="button"
        className={styles.header}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
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

        <span className={`${styles.year} mono`}>{year}</span>
        <span className={styles.chevron} aria-hidden="true">
          ⌄
        </span>
      </button>

      <div id={panelId} className={styles.panel} role="region" inert={!open}>
        <div className={styles.panelInner}>
          {description ? <p className={styles.desc}>{description}</p> : null}
          <p className={`${styles.links} mono`}>
            {links.repo ? (
              <a href={links.repo} target="_blank" rel="noopener noreferrer" className={styles.link}>
                repo <span aria-hidden="true">↗</span>
              </a>
            ) : null}
            {links.demo ? (
              <a href={links.demo} target="_blank" rel="noopener noreferrer" className={styles.link}>
                demo <span aria-hidden="true">↗</span>
              </a>
            ) : null}
            <Link href={`/projects/${slug}`} className={styles.link}>
              details <span aria-hidden="true">→</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
