import Link from "next/link";
import styles from "./InlineLink.module.css";

type Props = {
  href: string;
  children: React.ReactNode;
  /** external links open in a new tab and show a trailing ↗ */
  external?: boolean;
  className?: string;
};

/**
 * The one link style used site-wide: text-colored, accent underline on hover,
 * optional external ↗. Keeps link behavior + a11y consistent everywhere.
 */
export function InlineLink({ href, children, external, className }: Props) {
  const cls = [styles.link, className].filter(Boolean).join(" ");

  if (external) {
    return (
      <a
        href={href}
        className={cls}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
        <span aria-hidden="true" className={styles.arrow}>
          ↗
        </span>
      </a>
    );
  }

  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
