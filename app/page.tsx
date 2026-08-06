import { site } from "@/lib/site";
import { profile } from "@/content/profile";
import { featuredProjects, projects } from "@/content/projects";
import { Shell } from "@/components/Shell";
import { Section } from "@/components/Section";
import { ProjectRow } from "@/components/ProjectRow";
import { Timeline } from "@/components/Timeline";
import { TimelineProvider } from "@/components/TimelineContext";
import { ExperienceList } from "@/components/ExperienceList";
import { EndpointCard } from "@/components/EndpointCard";
import { InlineLink } from "@/components/links";
import styles from "./page.module.css";

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
    <Shell page="home">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      <Section id="about" index="001" label="~/.profile" title="About">
        {/* The bio gives up some measure so the endpoint card can sit beside it
            rather than under it — the one place on the page that says the site
            is also readable from a terminal. */}
        <div className={styles.aboutRow}>
          <p className={styles.bio}>{profile.bio}</p>
          <EndpointCard />
        </div>
      </Section>

      {/* Spans both sections: the timeline lives at the top of Experience but
          mirrors the project rows further down as well. Renders no DOM of its
          own. */}
      <TimelineProvider>
        <Section id="experience" index="002" label="~/.history" title="Experience" tight>
          <Timeline items={profile.experience} projects={projects} />
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
      </TimelineProvider>

      <Section id="contact" index="004" label="~/.forward" title="Contact">
        <p className={styles.contactLead}>
          Open to internships and interesting problems —{" "}
          <a href={`mailto:${profile.links.email}`} className={`link-text ${styles.cta}`}>
            reach out
          </a>
          .
        </p>
      </Section>
    </Shell>
  );
}
