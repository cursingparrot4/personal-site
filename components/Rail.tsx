import Link from "next/link";
import { profile } from "@/content/profile";
import { RailNav } from "./RailNav";
import styles from "./Rail.module.css";

type Props = {
  /** when present, renders in-page scroll-spy nav (home) instead of a home link */
  sections?: { id: string; label: string }[];
  /** terminal prompt row above the name */
  showPrompt?: boolean;
};

/** "Aryan Ahlawat" → "aryan-ahlawat" for the prompt row. */
const handle = profile.name.toLowerCase().replace(/\s+/g, "-");

/**
 * Sticky identity rail: prompt row, name, tagline, focus areas, navigation, contact.
 * On desktop it stays pinned; on mobile it stacks above the content as a header.
 */
export function Rail({ sections, showPrompt = true }: Props) {
  return (
    <aside className={styles.rail}>
      <div className={styles.top}>
        {showPrompt ? (
          <p className={`${styles.prompt} mono`}>
            <span>
              <span className={styles.promptPath} aria-hidden="true">
                ~/
              </span>
              {handle}
            </span>
            <span className={styles.promptMeta}>{profile.promptMeta}</span>
          </p>
        ) : null}

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
