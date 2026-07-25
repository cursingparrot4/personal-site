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
      <div className={styles.content}>{children}</div>
    </div>
  );
}
