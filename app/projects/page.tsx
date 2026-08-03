import type { Metadata } from "next";
import { Shell } from "@/components/Shell";
import { PageHeader } from "@/components/PageHeader";
import { ProjectRow } from "@/components/ProjectRow";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Full index of things Aryan Ahlawat has built.",
};

export default function ProjectsPage() {
  return (
    <Shell page="projects">
      <PageHeader eyebrow="Index" title="Projects" />
      <div>
        {projects.map((project, i) => (
          <ProjectRow key={project.slug} project={project} index={i + 1} />
        ))}
      </div>
    </Shell>
  );
}
