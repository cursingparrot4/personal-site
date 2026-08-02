import type { Profile } from "@/lib/types";

export const profile: Profile = {
  name: "Aryan Ahlawat",
  headline: "SITE STILL A WIP.", // tune to taste, keep it one honest line
  promptMeta: "CS · Data Science",
  focus: ["Machine learning", "Retrieval / RAG", "Computer vision", "Low-level systems"],
  bio:
    "CS student at Queen's on the AI stream, minoring in economics. I work across applied " +
    "ML — RAG pipelines at QMIND, computer vision on VisualizeIt, regression models at " +
    "Acetech — and enjoy the low-level end too, from PID drive-control in C to API development. " +
    "Currently a software developer co-op at Co-operators.",
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
      period: "May–Aug 2026",
      start: "2026-05",
      end: "2026-08",
      note: "RESTful Prefill API integrations that auto-populate insurance quoting forms in real time, orchestrating retrieval across internal services and third-party endpoints. Spec-driven docs generated straight from OpenAPI, so published references stay in sync with the contracts.",
    },
    {
      role: "Design Team Engineer",
      org: "QMIND",
      period: "Sep 2025–Apr 2026",
      start: "2025-09",
      end: "2026-04",
      note: "Cognitive RAG system — LangChain agents, hybrid BM25 + dense retrieval, RRF + cross-encoder re-ranking.",
    },
    {
      role: "Machine Learning Co-op",
      org: "Acetech",
      period: "May–Aug 2025",
      start: "2025-05",
      end: "2025-08",
      note: "PyTorch MLP regression for lab-test durations — 12% MSE reduction over baseline; automated data-cleaning pipelines.",
    },
    {
      role: "Drive Control Developer",
      org: "Queen's Knights Robotics",
      period: "Oct 2024–Mar 2025",
      start: "2024-10",
      end: "2025-03",
      note: "Low-level drive-control in C/FreeRTOS, PID controllers; motion algorithms cut path deviation ~20%.",
    },
    {
      role: "Research Assistant",
      org: "University of Toronto",
      period: "Jun 2023–Feb 2024",
      start: "2023-06",
      end: "2024-02",
      note: "Agent-based economic simulations (COBWEB) modeling cooperative vs. competitive behavior.",
    },
  ],
};
