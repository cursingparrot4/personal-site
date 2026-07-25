/**
 * Site-wide configuration — the single place to edit global constants.
 * URLs, metadata, and footer/nav text all read from here.
 */
export const site = {
  name: "Aryan Ahlawat",
  // Public-facing URL. Update when the domain is finalized (used for metadata + sitemap).
  url: "https://aryanahlawat.com", // TODO: confirm final domain
  location: "Kingston, ON",
  description:
    "Aryan Ahlawat — CS student at Queen's building and shipping machine-learning systems.",
  // Link shown in the footer as "src". Point at this repo once it's public.
  sourceUrl: "https://github.com/TODO", // TODO: repo URL
} as const;

export type Site = typeof site;
