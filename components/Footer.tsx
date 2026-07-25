import { site } from "@/lib/site";
import styles from "./Footer.module.css";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={`${styles.inner} mono`}>
        <span>
          © {year} {site.name.toLowerCase()}
        </span>
        <span className={styles.sep} aria-hidden="true">
          ·
        </span>
        <span>{site.location.toLowerCase()}</span>
        <span className={styles.sep} aria-hidden="true">
          ·
        </span>
        <a href={site.sourceUrl} className={styles.link} target="_blank" rel="noopener noreferrer">
          src
          <span aria-hidden="true" className={styles.arrow}>
            ↗
          </span>
        </a>
      </div>
    </footer>
  );
}
