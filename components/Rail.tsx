import Link from "next/link";
import { profile } from "@/content/profile";
import { ExternalLink } from "./links";
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
      <div>
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
              <Link href="/" className="link-muted">
                Home
              </Link>
            </li>
          </ul>
        )}
        <ul className={styles.pageNav}>
          <li>
            <Link href="/projects" className="link-muted">
              Projects
            </Link>
          </li>
          <li>
            <ExternalLink href="/resume.pdf" className="link-muted">
              Resume
            </ExternalLink>
          </li>
        </ul>
      </nav>

      <div className={`${styles.contact} mono`}>
        <ExternalLink href={profile.links.github} className={`link-muted ${styles.contactLink}`}>
          GitHub
        </ExternalLink>
        <a href={`mailto:${profile.links.email}`} className={`link-muted ${styles.contactLink}`}>
          Email
          <span className="arrow" aria-hidden="true">
            ↗
          </span>
        </a>
        {profile.links.linkedin ? (
          <ExternalLink
            href={profile.links.linkedin}
            className={`link-muted ${styles.contactLink}`}
          >
            LinkedIn
          </ExternalLink>
        ) : null}
      </div>
    </aside>
  );
}
