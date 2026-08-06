import type { Profile } from "@/lib/types";

export const profile: Profile = {
  name: "Aryan Ahlawat",
  headline: "CS at Queens, AI stream.", // tune to taste, keep it one honest line
  promptMeta: "CS · Economics",
  now: ["API integrations at Co-operators", "RL agent that plays Geometry Dash", "Kaggle competitions (kaggriculture)", "This site!"],
  // Discord snowflake. The presence line stays hidden until this is filled in and
  // the account has joined discord.gg/lanyard.
  discordId: "364856465271422979",
  bio:
    "I'm a CS student at Queen's University on the AI stream, minoring in Economics. I enjoy " +
    "working across the software stack, building everything from RAG pipelines to predictive " +
    "machine learning models. Currently, I'm developing API integrations as a Software " +
    "Developer Co-op at Co-operators.",
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
        "Developed RESTful prefill API integrations to enable real-time auto-population of insurance quoting forms, orchestrating data retrieval across multiple internal services and third-party endpoints to eliminate manual entry.",
        "Built the publishing pipeline behind the public developer portal: a GitHub Actions job that pulls the Postman collection, converts it to OpenAPI, generates every documentation page, and rewrites site navigation, keeping partner-facing docs in sync with the API contract with no hand editing.",
        "Wrote a static analyzer over 774 low-code modules (41k components, 176k extracted references) that builds a cross-module reference graph and narrows unused component deletion candidates to 2%, behind a safety gate encoding every false-positive class found during calibration.",
        "Built a Playwright and TypeScript end-to-end suite for the live chatbot widget embedded in customer journeys, driving the full flow through a semantic driver interface so widget DOM changes touch one file; runs in English and French.",
      ],
    },
    {
      role: "Design Team Engineer",
      org: "QMIND",
      period: "Sep 2025–Apr 2026",
      start: "2025-09",
      end: "2026-04",
      note: [
        "Architected the vector storage and conversational memory infrastructure for an agentic RAG pipeline, engineering an episodic memory layer that deduplicates semantically relevant queries while persisting context across multiple queries.",
        "Engineered a hybrid retrieval pipeline using Pinecone, merging BM25 sparse search and dense semantic embeddings with reciprocal rank fusion to maximize context recall.",
        "Implemented a defensive multi-hop failsafe that evaluates context sufficiency, automatically decomposing complex queries and executing secondary retrieval hops when the initial evidence is weak.",
      ],
    },
    {
      role: "Machine Learning Co-op",
      org: "Acetech",
      period: "May 2025–Aug 2025",
      start: "2025-05",
      end: "2025-08",
      note: [
        "Developed multi-layer perceptron regression models in PyTorch to predict lab test durations, tuning hyperparameters to achieve a 12% reduction in mean squared error loss against the previous baseline.",
        "Engineered an end-to-end pipeline from an extensive SQL dataset using Pandas and NumPy, combining cyclical sine/cosine encodings with one-hot encoding to capture the real-time lab state, while filtering statistical outliers and scaling numerical features.",
      ],
    },
    {
      role: "Drive Control Developer",
      org: "Queen's Knights Robotics",
      period: "Oct 2024–Mar 2025",
      start: "2024-10",
      end: "2025-03",
      note: [
        "Programmed low-level robotic drive-control systems in C, implementing PID controllers to ensure smooth acceleration and precise velocity control.",
        "Developed motion algorithms that improved autonomous navigation efficiency, reducing path deviations for competition tasks by almost 20%.",
      ],
    },
    {
      role: "Research Assistant",
      org: "University of Toronto",
      period: "Jun 2023–Feb 2024",
      start: "2023-06",
      end: "2024-02",
      note: [
        "Developed multi-agent economic simulations for the COBWEB project to model market behavior and survival strategies, giving agents specific OCEAN personality traits, historical memory, and risk tolerances.",
        "Forced these agents into small markets using Prisoner's Dilemma rules; the simulation showed how self-interested groups naturally develop adaptive strategies like cooperation and migration over time.",
      ],
    },
  ],
};
