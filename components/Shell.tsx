import { Rail } from "./Rail";
import styles from "./Shell.module.css";

type Props = {
  /** which rail nav entry is the current page; on "home" the sections scroll-spy */
  page?: "home" | "projects";
  children: React.ReactNode;
};

/**
 * Two-column page shell: sticky identity rail (left) + scrolling content (right).
 * Collapses to a single column below 900px.
 */
export function Shell({ page, children }: Props) {
  return (
    <div className={styles.shell}>
      <Rail page={page} />
      {/* Enters as one block just behind the rail; animating each section
          instead would be the fade-in-on-scroll pattern spec §2 rules out. */}
      <div className={`${styles.content} rise rise-1`}>{children}</div>
    </div>
  );
}
