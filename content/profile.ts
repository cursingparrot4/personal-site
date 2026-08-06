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
        "Developed RESTful API integrations to enable real-time auto-population of insurance quoting forms, orchestrating data retrieval across multiple internal services and third-party endpoints to eliminate manual entry.",
        "Built automation that generates reference documentation directly from OpenAPI specifications, keeping service contracts in sync without manual upkeep.",
      ],
    },
    {
      role: "Design Team Engineer",
      org: "QMIND",
      period: "Sep 2025–Apr 2026",
      start: "2025-09",
      end: "2026-04",
      note: [
        "Architected the vector storage and conversational memory infrastructure for an agentic RAG pipeline.",
        "Engineered a hybrid retrieval system using Pinecone to maximize context recall, and implemented a multi-hop failsafe mechanism that automatically breaks down complex queries when the initial retrieved evidence is weak.",
      ],
    },
    {
      role: "Machine Learning Co-op",
      org: "Acetech",
      period: "May 2025–Aug 2025",
      start: "2025-05",
      end: "2025-08",
      note: [
        "Developed PyTorch regression models to predict lab test durations, tuning hyperparameters to achieve a 12% error reduction against the previous baseline.",
        "Built automated data cleaning pipelines using Pandas and NumPy to process SQL datasets, impute missing values, and detect outliers.",
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
