import { site } from "@/lib/site";
import { profile } from "@/content/profile";
import { ExternalLink } from "./links";
import styles from "./Footer.module.css";

/**
 * Full-width closing rule: © year · name · location · src ↗.
 * Spans below the shell's two columns so the page ends on a line rather than
 * trailing off after the last section.
 */
export function Footer() {
  return (
    <footer className={`${styles.footer} mono`}>
      <div className={styles.inner}>
        <p className={styles.meta}>
          <span>© {new Date().getFullYear()}</span>
          <span className="sep" aria-hidden="true">
            ·
          </span>
          <span>{profile.name}</span>
          <span className="sep" aria-hidden="true">
            ·
          </span>
          <span>{profile.location}</span>
        </p>

        <ExternalLink href={site.repo} className="link-muted link-underline">
          src
        </ExternalLink>
      </div>
    </footer>
  );
}
