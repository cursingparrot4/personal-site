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
  children: React.ReactNode;
};

/**
 * A page section: mono "NNN path" eyebrow, Space Grotesk title, then content.
 * Owns the vertical rhythm so every section is spaced identically.
 */
export function Section({ index, label, title, id, children }: Props) {
  const headingId = `${id}-heading`;
  return (
    <section className={styles.section} id={id} aria-labelledby={headingId}>
      <p className={`eyebrow mono ${styles.eyebrowRow}`}>
        <span className={styles.index}>{index}</span>
        {label}
      </p>
      <h2 id={headingId} className={styles.title}>
        {title}
      </h2>
      <div>{children}</div>
    </section>
  );
}
