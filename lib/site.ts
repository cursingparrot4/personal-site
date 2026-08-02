/**
 * Site-wide configuration — the single place to edit global constants.
 * Read by the metadata in app/layout.tsx, the sitemap and robots.txt.
 */
export const site = {
  name: "Aryan Ahlawat",
  // Public-facing URL, per the resume header (used for metadata + sitemap).
  url: "https://aryanahlawat.dev",
  description:
    "Aryan Ahlawat — CS student at Queen's building and shipping machine-learning systems.",
  // Source of this site — the footer's "src ↗" link.
  repo: "https://github.com/cursingparrot4/arna-site",
} as const;

export type Site = typeof site;
