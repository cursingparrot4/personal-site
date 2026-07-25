import type { Metadata } from "next";
import { Shell } from "@/components/Shell";
import { ProjectRow } from "@/components/ProjectRow";
import { projects } from "@/content/projects";
import styles from "./projects.module.css";

export const metadata: Metadata = {
  title: "Projects",
  description: "Full index of things Aryan Ahlawat has built.",
};

export default function ProjectsPage() {
  return (
    <Shell>
      <header className={styles.header}>
        <p className={`${styles.eyebrow} mono`}>index</p>
        <h1 className={styles.title}>Projects</h1>
      </header>
      <div>
        {projects.map((project, i) => (
          <ProjectRow key={project.slug} project={project} index={i + 1} />
        ))}
      </div>
    </Shell>
  );
}
