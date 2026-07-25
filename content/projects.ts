import type { Project } from "@/lib/types";

/**
 * Single source of truth for projects. Adding a project = one object here.
 * `featured: true` surfaces it on the home page (in array order).
 */
export const projects: Project[] = [
  {
    slug: "visualizeit",
    name: "VisualizeIt",
    tagline: "real-time computer vision + diffusion inpainting.",
    description:
      "YOLOv8 (Nano) for millisecond object detection anchoring OpenCV CSRT tracking, with Stable Diffusion inpainting to map context-aware texture overlays onto tracked regions.",
    stack: ["YOLOv8", "PyTorch", "Stable Diffusion", "OpenCV"],
    year: 2025,
    award: "Mayor's Innovation Award",
    links: { repo: "https://github.com/TODO" }, // TODO
    featured: true,
  },
  {
    slug: "cognitive-rag",
    name: "Cognitive RAG",
    tagline: "hybrid retrieval for multi-hop question answering.",
    description:
      "LangChain agents over a hybrid retrieval pipeline (BM25 sparse + bi-encoder dense), fused with reciprocal rank fusion and a Hugging Face cross-encoder re-ranker for precision on multi-hop QA. (QMIND design-team work.)",
    stack: ["LangChain", "BM25", "cross-encoder", "Python"],
    year: 2026,
    links: { repo: "https://github.com/TODO" }, // TODO — confirm shareable
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
    links: { repo: "https://github.com/TODO" }, // TODO
    featured: true,
  },
];

/** Helpers so pages don't re-implement filtering. */
export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
