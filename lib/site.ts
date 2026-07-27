/**
 * Site-wide configuration — the single place to edit global constants.
 * URLs, metadata, and footer/nav text all read from here.
 */
export const site = {
  name: "Aryan Ahlawat",
  // Public-facing URL, per the resume header (used for metadata + sitemap).
  url: "https://aryanahlawat.dev",
  location: "Kingston, ON",
  description:
    "Aryan Ahlawat — CS student at Queen's building and shipping machine-learning systems.",
  // Link shown in the footer as "src". Must be public for the link to work.
  sourceUrl: "https://github.com/cursingparrot4/arna-site",
} as const;

export type Site = typeof site;
