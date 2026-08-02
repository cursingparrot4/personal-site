import { Rail } from "./Rail";
import styles from "./Shell.module.css";

type Props = {
  /** in-page sections for the rail's scroll-spy nav (home only) */
  sections?: { id: string; label: string }[];
  children: React.ReactNode;
};

/**
 * Two-column page shell: sticky identity rail (left) + scrolling content (right).
 * Collapses to a single column below 900px.
 */
export function Shell({ sections, children }: Props) {
  return (
    <div className={styles.shell}>
      <Rail sections={sections} />
      {/* Enters as one block just behind the rail; animating each section
          instead would be the fade-in-on-scroll pattern spec §2 rules out. */}
      <div className={`${styles.content} rise rise-1`}>{children}</div>
    </div>
  );
}
