export type Project = {
  /** stable id — the row's anchor (/projects#<slug>) and its timeline key */
  slug: string;
  name: string;
  tagline: string; // one honest line, sentence case
  description?: string; // shown when the row expands
  stack: string[]; // ["PyTorch", "LangChain"]
  year: number;
  award?: string; // e.g. "Mayor's Innovation Award"
  links: { repo?: string; demo?: string; devpost?: string };
  featured?: boolean; // shown on home
};

export type Experience = {
  role: string;
  org: string;
  /** display string shown in the list, e.g. "May–Aug 2026" */
  period: string;
  /** inclusive month bounds, "YYYY-MM". Drive the duration chart's axis —
   *  `period` stays separate so its wording is free to differ from the data. */
  start: string;
  end: string;
  /** short, scannable points — each one a distinct piece of the role */
  note?: string[];
};

export type Profile = {
  name: string;
  headline: string; // one line, what you do
  /** right side of the rail's terminal prompt row, e.g. "cs · systems" */
  promptMeta: string;
  /** what you're working on right now — the rail's "now" list. Keep it to 2–3
   *  short items and let them go stale on purpose; that's the point of a now list. */
  now: string[];
  bio: string;
  /** city shown in the rail's availability block */
  location: string;
  /** availability line in the rail; omit to hide the status block entirely */
  status?: string;
  /** Discord snowflake for the rail's live presence line (components/Presence.tsx).
   *  Requires joining discord.gg/lanyard. Omit and the line never renders. */
  discordId?: string;
  links: { github: string; email: string; linkedin?: string };
  experience: Experience[];
};
