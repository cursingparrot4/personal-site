import { site } from "@/lib/site";
import { ExternalLink } from "./links";
import styles from "./Footer.module.css";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={`${styles.inner} mono`}>
        <span>
          © {year} {site.name}
        </span>
        <span className="sep" aria-hidden="true">
          ·
        </span>
        <span>{site.location}</span>
        <span className="sep" aria-hidden="true">
          ·
        </span>
        <ExternalLink href={site.sourceUrl} className="link-muted">
          Source
        </ExternalLink>
      </div>
    </footer>
  );
}
