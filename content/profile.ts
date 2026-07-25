import type { Profile } from "@/lib/types";

export const profile: Profile = {
  name: "Aryan Ahlawat",
  headline: "i build and ship machine-learning systems.", // tune to taste, keep it one honest line
  focus: ["machine learning", "retrieval / RAG", "computer vision", "low-level systems"],
  bio:
    "cs student at Queen's on the AI stream, minoring in economics. i work across applied " +
    "ML — RAG pipelines at QMIND, computer vision on VisualizeIt, regression models at " +
    "Acetech — and enjoy the low-level end too, from PID drive-control in C to API plumbing. " +
    "currently a software developer co-op at Co-operators.",
  links: {
    github: "https://github.com/TODO", // TODO: real handle
    email: "aryanahlawat2006@gmail.com", // TODO: confirm which email to show publicly
    linkedin: "https://www.linkedin.com/in/TODO", // TODO
  },
  experience: [
    {
      role: "Software Developer Co-op",
      org: "Co-operators",
      period: "May–Aug 2026",
      note: "RESTful Prefill API integrations for real-time quote auto-population (AWS Lambda, Lex, Python).",
    },
    {
      role: "Design Team Engineer",
      org: "QMIND",
      period: "Sep 2025–Apr 2026",
      note: "Cognitive RAG system — LangChain agents, hybrid BM25 + dense retrieval, RRF + cross-encoder re-ranking.",
    },
    {
      role: "Machine Learning Co-op",
      org: "Acetech",
      period: "May–Aug 2025",
      note: "PyTorch MLP regression for lab-test durations — 12% MSE reduction over baseline; automated data-cleaning pipelines.",
    },
    {
      role: "Drive Control Developer",
      org: "Queen's Knights Robotics",
      period: "Oct 2024–Mar 2025",
      note: "Low-level drive-control in C/FreeRTOS, PID controllers; motion algorithms cut path deviation ~20%.",
    },
    {
      role: "Research Assistant",
      org: "University of Toronto",
      period: "Jun 2023–Feb 2024",
      note: "Agent-based economic simulations (COBWEB) modeling cooperative vs. competitive behavior.",
    },
  ],
};
