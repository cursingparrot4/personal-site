import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, getProject } from "@/content/projects";
import { Shell } from "@/components/Shell";
import { Tag } from "@/components/Tag";
import { InlineLink } from "@/components/links";
import styles from "./detail.module.css";

// Pre-render every project at build time.
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.tagline,
  };
}

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { name, tagline, description, stack, year, award, links } = project;

  return (
    <Shell>
      <article className={styles.article}>
        <p className={`${styles.back} mono`}>
          <Link href="/projects" className="link-muted">
            ← Projects
          </Link>
        </p>

        <header className={styles.header}>
          <h1 className="page-title">{name}</h1>
          <p className={styles.tagline}>{tagline}</p>
          <p className={`${styles.meta} mono`}>
            <span>{year}</span>
            {award ? (
              <>
                <span className="sep" aria-hidden="true">
                  ·
                </span>
                <span className={styles.award}>{award}</span>
              </>
            ) : null}
          </p>
        </header>

        <ul className={styles.stack}>
          {stack.map((tech) => (
            <li key={tech}>
              <Tag>{tech}</Tag>
            </li>
          ))}
        </ul>

        {description ? <p className={styles.body}>{description}</p> : null}

        {(links.repo || links.demo || links.writeup) && (
          <p className={`${styles.links} mono`}>
            {links.repo ? (
              <InlineLink href={links.repo} external>
                Repo
              </InlineLink>
            ) : null}
            {links.demo ? (
              <InlineLink href={links.demo} external>
                Demo
              </InlineLink>
            ) : null}
            {links.writeup ? (
              <InlineLink href={links.writeup} external>
                Writeup
              </InlineLink>
            ) : null}
          </p>
        )}
      </article>
    </Shell>
  );
}
