export type Project = {
  slug: string;
  name: string;
  tagline: string; // one honest line, sentence case
  description?: string; // detail page
  stack: string[]; // ["PyTorch", "LangChain"]
  year: number;
  award?: string; // e.g. "Mayor's Innovation Award"
  links: { repo?: string; demo?: string; writeup?: string };
  featured?: boolean; // shown on home
};

export type Experience = {
  role: string;
  org: string;
  period: string;
  note?: string;
};

export type Profile = {
  name: string;
  headline: string; // one line, what you do
  /** right side of the rail's terminal prompt row, e.g. "cs · systems" */
  promptMeta: string;
  focus: string[]; // ["Machine learning", ...]
  bio: string;
  links: { github: string; email: string; linkedin?: string };
  experience: Experience[];
};
