import styles from "./PageHeader.module.css";

type Props = {
  /** small mono line above the title, e.g. "Index" or "404" */
  eyebrow: string;
  title: string;
  /** render the eyebrow in the accent colour (the 404 code) rather than muted */
  accentEyebrow?: boolean;
  /** a back link or similar, rendered under the title */
  children?: React.ReactNode;
};

/**
 * The eyebrow + big-title header shared by /projects and the 404 page.
 * Project detail pages have their own header (title + tagline + meta), so they
 * don't use this.
 */
export function PageHeader({ eyebrow, title, accentEyebrow, children }: Props) {
  return (
    <header className={styles.header}>
      <p className={`eyebrow mono ${accentEyebrow ? styles.accent : ""}`}>{eyebrow}</p>
      <h1 className="page-title">{title}</h1>
      {children ? <div className={`${styles.sub} mono`}>{children}</div> : null}
    </header>
  );
}
