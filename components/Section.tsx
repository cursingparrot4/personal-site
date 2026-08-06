import styles from "./Section.module.css";

type Props = {
  /** zero-padded index, e.g. "001" */
  index: string;
  /** mono eyebrow label — a terminal path standing in for the section, e.g. "~/bin/builds".
   *  Decorative: the section's accessible name comes from `title` via aria-labelledby. */
  label: string;
  /** Space Grotesk section title, e.g. "Selected work" */
  title: string;
  /** stable id for aria-labelledby + anchor links */
  id: string;
  /** Pulls this section closer to the one above — for when the preceding
   *  section ends in plain prose with no border or list to anchor the eye,
   *  which reads as a bigger gap than the same margin does elsewhere. */
  tight?: boolean;
  /** Side panel: sits beside the content on desktop, and above the eyebrow once
   *  the columns collapse. It's a sibling of the heading rows rather than part
   *  of `children` precisely so it can make that move — see Section.module.css. */
  aside?: React.ReactNode;
  children: React.ReactNode;
};

/**
 * A page section: mono "NNN path" eyebrow, Space Grotesk title, then content.
 * Owns the vertical rhythm so every section is spaced identically.
 */
export function Section({ index, label, title, id, tight, aside, children }: Props) {
  const headingId = `${id}-heading`;
  return (
    <section
      className={`${styles.section} ${tight ? styles.tight : ""} ${aside ? styles.hasAside : ""}`}
      id={id}
      aria-labelledby={headingId}
    >
      <p className={`eyebrow mono ${styles.eyebrowRow}`}>
        <span className={styles.index}>{index}</span>
        {label}
      </p>
      <h2 id={headingId} className={styles.title}>
        {title}
      </h2>
      <div className={styles.body}>{children}</div>
      {/* Last in the DOM, first in the mobile layout: the prose still leads for
          a screen reader and for tab order. */}
      {aside ? <div className={styles.aside}>{aside}</div> : null}
    </section>
  );
}
