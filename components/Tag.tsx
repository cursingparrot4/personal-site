import styles from "./Tag.module.css";

/** Mono pill with a dim accent outline, no fill. Used for stack items. */
export function Tag({ children }: { children: React.ReactNode }) {
  return <span className={`${styles.tag} mono`}>{children}</span>;
}
