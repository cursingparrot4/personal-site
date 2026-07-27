import { site } from "@/lib/site";
import { profile } from "@/content/profile";
import { featuredProjects } from "@/content/projects";
import { Shell } from "@/components/Shell";
import { Section } from "@/components/Section";
import { ProjectRow } from "@/components/ProjectRow";
import { ExperienceList } from "@/components/ExperienceList";
import { InlineLink } from "@/components/links";
import styles from "./page.module.css";

const sections = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "work", label: "Projects" },
  { id: "contact", label: "Contact" },
];

// JSON-LD Person schema for richer search results.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: site.url,
  jobTitle: "Software developer",
  alumniOf: { "@type": "CollegeOrUniversity", name: "Queen's University" },
  sameAs: [profile.links.github, profile.links.linkedin].filter(Boolean),
};

export default function Home() {
  return (
    <Shell sections={sections}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      <Section id="about" index="001" label="~/.profile" title="About">
        <p className={styles.bio}>{profile.bio}</p>
      </Section>

      <Section id="experience" index="002" label="~/.history" title="Experience">
        <ExperienceList items={profile.experience} />
      </Section>

      <Section id="work" index="003" label="~/bin/builds" title="Recent Projects">
        <div>
          {featuredProjects.map((project, i) => (
            <ProjectRow key={project.slug} project={project} index={i + 1} />
          ))}
        </div>
        <p className={`${styles.more} mono`}>
          <InlineLink href="/projects">All projects →</InlineLink>
        </p>
      </Section>

      <Section id="contact" index="004" label="~/.forward" title="Contact">
        <p className={styles.contactLead}>
          Open to internships and interesting problems — reach out.
        </p>
      </Section>
    </Shell>
  );
}
