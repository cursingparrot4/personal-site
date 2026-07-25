import Link from "next/link";
import { Shell } from "@/components/Shell";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <Shell>
      <div className={styles.wrap}>
        <p className={`${styles.code} mono`}>404</p>
        <h1 className={styles.title}>Page not found</h1>
        <p className={`${styles.back} mono`}>
          <Link href="/" className={styles.link}>
            ← home
          </Link>
        </p>
      </div>
    </Shell>
  );
}
