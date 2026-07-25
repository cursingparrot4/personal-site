import { site } from "@/lib/site";
import { profile } from "@/content/profile";
import { featuredProjects } from "@/content/projects";
import { Shell } from "@/components/Shell";
import { Section } from "@/components/Section";
import { ProjectRow } from "@/components/ProjectRow";
import { ExperienceList } from "@/components/ExperienceList";
import { InlineLink } from "@/components/InlineLink";
import styles from "./page.module.css";

const sections = [
  { id: "work", label: "selected work" },
  { id: "about", label: "about" },
  { id: "contact", label: "contact" },
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

      <Section id="work" index="001" label="selected work" title="Selected work">
        <div className={styles.rows}>
          {featuredProjects.map((project, i) => (
            <ProjectRow key={project.slug} project={project} index={i + 1} />
          ))}
        </div>
        <p className={`${styles.more} mono`}>
          <InlineLink href="/projects">all projects →</InlineLink>
        </p>
      </Section>

      <Section id="about" index="002" label="about" title="About">
        <p className={styles.bio}>{profile.bio}</p>
        <h3 className={styles.subhead}>Experience</h3>
        <ExperienceList items={profile.experience} />
      </Section>

      <Section id="contact" index="003" label="contact" title="Contact">
        <p className={styles.contactLead}>
          Open to internships and interesting problems — reach out.
        </p>
        <p className={`${styles.contact} mono`}>
          <InlineLink href={`mailto:${profile.links.email}`}>{profile.links.email}</InlineLink>
          <span className={styles.sep} aria-hidden="true">
            ·
          </span>
          <InlineLink href={profile.links.github} external>
            github
          </InlineLink>
          {profile.links.linkedin ? (
            <>
              <span className={styles.sep} aria-hidden="true">
                ·
              </span>
              <InlineLink href={profile.links.linkedin} external>
                linkedin
              </InlineLink>
            </>
          ) : null}
        </p>
      </Section>
    </Shell>
  );
}
