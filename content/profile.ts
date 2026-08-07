import type { Profile } from "@/lib/types";

export const profile: Profile = {
  name: "Aryan Ahlawat",
  headline: "CS at Queen's, AI stream.", // tune to taste, keep it one honest line
  promptMeta: "CS · Economics",
  now: [
    "API integrations at Co-operators",
    "RL agent that plays Geometry Dash",
    "Kaggle competitions (kaggriculture)",
    "This site!",
  ],
  // Discord snowflake. The presence line stays hidden until this is filled in and
  // the account has joined discord.gg/lanyard.
  discordId: "364856465271422979",
  bio:
    "I'm a CS student at Queen's University on the AI stream, minoring in Economics. I work " +
    "across the stack, mostly on ML and retrieval systems plus the APIs and tooling that make " +
    "them usable. Right now I'm building API integrations as a Software Developer Co-op at " +
    "Co-operators.",
  location: "Toronto, ON",
  status: "Open to winter 2027 internships",
  links: {
    github: "https://github.com/cursingparrot4",
    email: "aryanahlawat2006@gmail.com",
    linkedin: "https://www.linkedin.com/in/aryan-ahlawat-82912b29a/",
  },
  experience: [
    {
      role: "Software Developer Co-op",
      org: "Co-operators",
      period: "May 2026–Aug 2026",
      start: "2026-05",
      end: "2026-08",
      note: [
        "Built the prefill APIs that fill in insurance quoting forms automatically, so customers stop retyping information the company already has. One call pulls from several internal services and outside providers.",
        "Redesigned the public developer portal and made it update itself. A GitHub Actions job pulls the Postman collection, converts it to OpenAPI, and regenerates every docs page and the site navigation, so the docs partners read never drift from the actual API. Nobody edits them by hand anymore.",
        "Wrote a static analyzer that finds dead code it's actually safe to delete. It reads 774 low-code modules, builds a reference graph across all of them, and narrows 41k components down to a 2% shortlist, behind a safety gate encoding every false positive I hit while calibrating it.",
        "Built the end-to-end test suite for the live chatbot widget in Playwright and TypeScript, driving a full conversation in English and French. Every test reaches the widget through one semantic driver layer, so a DOM change on their end means I fix one file.",
      ],
    },
    {
      role: "Design Team Engineer",
      org: "QMIND",
      period: "Sep 2025–Apr 2026",
      start: "2025-09",
      end: "2026-04",
      note: [
        "Built the memory layer that lets the RAG pipeline remember earlier turns instead of treating every question as the first. It stores past interactions as embeddings and drops near duplicates so the store doesn't bloat.",
        "Made retrieval catch what a single search method misses, running BM25 keyword search and dense semantic search side by side in Pinecone and merging the rankings with reciprocal rank fusion.",
        "Added a check that catches when retrieved evidence is too thin to answer on. When it fires, the system breaks the question into parts and runs another retrieval hop instead of answering anyway.",
      ],
    },
    {
      role: "Machine Learning Co-op",
      org: "Acetech",
      period: "May 2025–Aug 2025",
      start: "2025-05",
      end: "2025-08",
      note: [
        "Predicted how long lab tests would take with MLP regression models in PyTorch, tuning hyperparameters to cut mean squared error 12% below the previous baseline.",
        "Built the data pipeline feeding those models out of a large SQL dataset with Pandas and NumPy. Time of day and day of week go in as sine and cosine pairs so the model reads them as cyclical, categories as one-hot, plus outlier filtering and feature scaling.",
      ],
    },
    {
      role: "Drive Control Developer",
      org: "Queen's Knights Robotics",
      period: "Oct 2024–Mar 2025",
      start: "2024-10",
      end: "2025-03",
      note: [
        "Wrote the drive control firmware in C that keeps the robot accelerating smoothly and holding a target speed, using PID controllers.",
        "Tightened the autonomous driving so the robot strayed off its intended path almost 20% less on competition runs.",
      ],
    },
    {
      role: "Research Assistant",
      org: "University of Toronto",
      period: "Jun 2023–Feb 2024",
      start: "2023-06",
      end: "2024-02",
      note: [
        "Built economic simulations for the COBWEB project where every agent had its own OCEAN personality traits, memory of what happened before, and tolerance for risk.",
        "Forced these agents into small markets under Prisoner's Dilemma rules, and watched groups that only cared about their own payoff work out cooperation and migration on their own.",
      ],
    },
  ],
};

/**
 * "Aryan Ahlawat" → "aryan-ahlawat", the `~/` prompt row in the rail and in the
 * terminal view's header. Derived here so the two can't drift apart.
 */
export const profileHandle = profile.name.toLowerCase().replace(/\s+/g, "-");
