import Link from "next/link";
import { profile } from "@/content/profile";
import { RailNav } from "./RailNav";
import styles from "./Rail.module.css";

type Props = {
  /** when present, renders in-page scroll-spy nav (home) instead of a home link */
  sections?: { id: string; label: string }[];
};

/**
 * Sticky identity rail: name, tagline, focus areas, navigation, and contact.
 * On desktop it stays pinned; on mobile it stacks above the content as a header.
 */
export function Rail({ sections }: Props) {
  return (
    <aside className={styles.rail}>
      <div className={styles.top}>
        <Link href="/" className={styles.brand}>
          {profile.name}
        </Link>
        <p className={`${styles.tagline} mono`}>{profile.headline}</p>
        <ul className={`${styles.focus} mono`}>
          {profile.focus.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>

      <nav className={styles.nav} aria-label="Primary">
        {sections ? (
          <RailNav sections={sections} />
        ) : (
          <ul className={styles.pageNav}>
            <li>
              <Link href="/" className={styles.pageLink}>
                home
              </Link>
            </li>
          </ul>
        )}
        <ul className={styles.pageNav}>
          <li>
            <Link href="/projects" className={styles.pageLink}>
              projects
            </Link>
          </li>
          <li>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.pageLink}
            >
              resume <span aria-hidden="true">↗</span>
            </a>
          </li>
        </ul>
      </nav>

      <div className={`${styles.contact} mono`}>
        <a
          href={profile.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.contactLink}
        >
          github <span aria-hidden="true">↗</span>
        </a>
        <a href={`mailto:${profile.links.email}`} className={styles.contactLink}>
          email <span aria-hidden="true">↗</span>
        </a>
        {profile.links.linkedin ? (
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.contactLink}
          >
            linkedin <span aria-hidden="true">↗</span>
          </a>
        ) : null}
      </div>
    </aside>
  );
}
