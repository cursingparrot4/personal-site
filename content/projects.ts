import type { Project } from "@/lib/types";

/**
 * Single source of truth for projects. Adding a project = one object here.
 * `featured: true` surfaces it on the home page (in array order); the full list
 * at /projects renders every entry, also in array order.
 */
export const projects: Project[] = [
  {
    slug: "cardiq",
    name: "CardIQ",
    tagline: "Integer programming for multi-card spend allocation.",
    description:
      "A deterministic multi-card payment router built on integer-cent arithmetic: a month of spend is formulated as an integer program (PuLP/CBC) under hard credit-limit, utilization-ceiling and sign-up-bonus constraints, with a greedy solver as a verified fallback. A small language model, fine-tuned on synthetically generated data, parses natural-language financial goals into a validated weight-and-constraint schema — with the solver acting as a downstream verifier to score decision-match accuracy against a prompted large model.",
    stack: ["Python", "FastAPI", "PuLP/CBC", "Pydantic", "Streamlit"],
    year: 2026,
    award: "Hack the 6ix",
    links: { writeup: "https://devpost.com/software/cardiq" },
    featured: true,
  },
  {
    slug: "cognitive-rag",
    name: "Cognitive RAG",
    tagline: "Hybrid retrieval for multi-hop question answering.",
    description:
      "LangChain agents over a hybrid retrieval pipeline (BM25 sparse + bi-encoder dense), fused with reciprocal rank fusion and a Hugging Face cross-encoder re-ranker for precision on multi-hop QA. (QMIND design-team work.)",
    stack: ["LangChain", "BM25", "cross-encoder", "Python"],
    year: 2026,
    links: {}, // TODO: repo — confirm shareable (QMIND client work)
    featured: true,
  },
  {
    slug: "visualizeit",
    name: "VisualizeIt",
    tagline: "Real-time computer vision + diffusion inpainting.",
    description:
      "YOLOv8 (Nano) for millisecond-latency object detection, serving as the initialization anchor for robust OpenCV CSRT tracking, with Stable Diffusion inpainting generating context-aware texture overlays that map stylized graphics onto detected regions with high geometric consistency.",
    stack: ["YOLOv8", "PyTorch", "Stable Diffusion", "OpenCV"],
    year: 2025,
    award: "QHacks winner · Mayor's Innovation Award",
    links: { writeup: "https://devpost.com/software/visualizeit" },
    featured: true,
  },
  {
    slug: "churn-classification-engine",
    name: "Churn Classification Engine",
    tagline: "0.82 F1 across 7,000+ users.",
    description:
      "End-to-end classification pipeline (logistic regression + random-forest ensembles) segmenting 7,000+ users by churn probability.",
    stack: ["Python", "scikit-learn", "seaborn"],
    year: 2025,
    links: {}, // TODO: repo URL
    // not featured — shows on /projects only
  },
  {
    slug: "stubook",
    name: "Stubook",
    tagline: "Offline-first Flutter app for daily study planning.",
    description:
      "A cross-platform study-planning app built with Flutter, shipped to the iOS App Store. Hive provides an offline-first local NoSQL store for tasks and schedules, with a table-calendar view for planning study sessions and swipeable list actions for quick task management. Built as core developer.",
    stack: ["Flutter", "Dart", "Hive"],
    year: 2024,
    links: { repo: "https://github.com/joeyhlu/stubook_master" },
    // not featured — shows on /projects only
  },
];

/** Helpers so pages don't re-implement filtering. */
export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
