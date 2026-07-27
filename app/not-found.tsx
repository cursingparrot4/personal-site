import Link from "next/link";
import { Shell } from "@/components/Shell";
import { PageHeader } from "@/components/PageHeader";

export default function NotFound() {
  return (
    <Shell>
      <PageHeader eyebrow="404" title="Page not found" accentEyebrow>
        <Link href="/" className="link-muted">
          ← Home
        </Link>
      </PageHeader>
    </Shell>
  );
}
