export type NavSection = { id: string; label: string };

/**
 * The home page's in-page sections, in document order.
 *
 * Shared rather than local to app/page.tsx because every rail renders them:
 * on `/` they are scroll-spy anchors, elsewhere they are `/#id` links back.
 * The ids must match the <Section id> values in app/page.tsx.
 */
export const homeSections: NavSection[] = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "work", label: "Projects" },
  { id: "contact", label: "Contact" },
];
