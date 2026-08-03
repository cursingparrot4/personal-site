import Link from "next/link";
import { profile } from "@/content/profile";
import { homeSections } from "@/lib/nav";
import { ExternalLink } from "./links";
import { RailNav } from "./RailNav";
import styles from "./Rail.module.css";

type Props = {
  /** which nav entry is the current page; on "home" the section links scroll-spy */
  page?: "home" | "projects";
  /** terminal prompt row above the name */
  showPrompt?: boolean;
};

/** "Aryan Ahlawat" → "aryan-ahlawat" for the prompt row. */
const handle = profile.name.toLowerCase().replace(/\s+/g, "-");

/**
 * Sticky identity rail: prompt row, name, tagline, focus areas, nav tree, contact.
 * On desktop it stays pinned; on mobile it stacks above the content as a header.
 */
export function Rail({ page, showPrompt = true }: Props) {
  return (
    <aside className={styles.rail}>
      {/* `rise*` are the global entrance utilities — see globals.css. */}
      <div className="rise">
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

      <nav className={`${styles.nav} rise rise-1`} aria-label="Primary">
        <RailNav sections={homeSections} page={page} />
      </nav>

      {/* Availability — sits above the pinned contact block, so the rail's lower
          half reads as one unit instead of leaving a void under the nav. */}
      <div className={`${styles.status} mono rise rise-2`}>
        {profile.status ? (
          <p className={styles.statusLine}>
            <span className={styles.dot} aria-hidden="true" />
            {profile.status}
          </p>
        ) : null}
        <p className={styles.location}>{profile.location}</p>
      </div>

      <div className={`${styles.contact} mono rise rise-3`}>
        <ExternalLink href="/resume.pdf" className={`link-muted ${styles.contactLink}`}>
          Resume
        </ExternalLink>
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
