/**
 * Site-wide configuration — the single place to edit global constants.
 * Read by the metadata in app/layout.tsx, the sitemap and robots.txt.
 */
export const site = {
  name: "Aryan Ahlawat",
  // Public-facing URL, per the resume header (used for metadata + sitemap).
  url: "https://aryanahlawat.dev",
  // Says the same thing as the OG card (docs/opengraph-image.source.html) and
  // content/profile.ts on purpose: this is the <meta description>, the OG and
  // Twitter description, and the line search results show. If one of the three
  // changes, change all three.
  description:
    "Aryan Ahlawat — CS at Queen's on the AI stream, SWE @ Co-operators. RAG pipelines and applied ML.",
} as const;

export type Site = typeof site;
