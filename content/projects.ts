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
    tagline:
      "Tells you which credit cards to spend on, and how much on each, to get the most back.",
    description:
      "CardIQ takes a month of spending and works out how to split it across your cards for the best return. Underneath it's a strict integer program solved with PuLP and CBC, handling constraints like utilization ceilings and signup bonuses in integer cents so nothing drifts the way floats do. Rather than build a rigid UI full of sliders for goal setting, I fine tuned a small language model on synthetic data, so you say what you want in plain English and it produces the exact solver weights.",
    stack: ["Python", "FastAPI", "PuLP/CBC", "Pydantic", "Streamlit"],
    year: 2026,
    award: "Hack the 6ix",
    links: { devpost: "https://devpost.com/software/cardiq" },
    featured: true,
  },
  {
    slug: "cognitive-rag",
    name: "Cognitive RAG",
    tagline: "Document Q&A that remembers what you asked earlier in the conversation.",
    description:
      "Most RAG pipelines are stateless, so every question starts cold and you keep repeating context you already gave. On the QMIND design team I built the parts that fix that. Retrieval runs keyword and semantic search together in Pinecone and merges the two rankings with reciprocal rank fusion, then a cross encoder reranks the top results. An episodic memory module embeds past interactions into their own namespace, scores which ones matter to the current question, and injects them into the prompt without polluting the citations the user sees. It also filters out near identical records so the store doesn't fill up with the same thing.",
    stack: ["LangChain", "BM25", "cross-encoder", "Python"],
    year: 2026,
    // gitfront serves a read-only mirror so the GitHub repo can stay private.
    links: { repo: "https://gitfront.io/r/cursingparrot4/b8mnnxDNjLC2/Cognitive-rag/" },
    featured: true,
  },
  {
    slug: "visualizeit",
    name: "VisualizeIt",
    tagline:
      "Point a camera at someone and watch a generated design get painted onto them live, as they move.",
    description:
      "VisualizeIt generates a texture and blends it onto whatever the camera is looking at, keeping it stuck in place while the subject moves. YOLOv8 finds the target fast and Mask R-CNN cuts out its exact shape. Tracking then splits in two depending on what it found: MediaPipe Holistic computes 3D rigid transforms for people, ORB feature matching computes 2D homographies for solid objects. Stable Diffusion makes the texture, and OpenCV warps it to the right perspective and alpha blends it onto the mask.",
    stack: ["YOLOv8", "PyTorch", "Stable Diffusion", "OpenCV"],
    year: 2025,
    award: "QHacks winner · Mayor's Innovation Award",
    links: { devpost: "https://devpost.com/software/visualizeit" },
    featured: true,
  },
  {
    slug: "churn-classification-engine",
    name: "Churn Classification Engine",
    tagline: "Predicts which telecom customers are about to leave, at 0.82 F1 across 7,000 users.",
    description:
      "An end to end classification pipeline in Python for predicting telecom customer churn. It cleans missing values, applies one-hot and ordinal encoding, and trains a Random Forest ensemble over a dataset of more than 7,000 users. A standalone grid search handles hyperparameter tuning, and seaborn plots feature importance and F1 so you can see what's actually driving the prediction.",
    stack: ["Python", "scikit-learn", "seaborn"],
    year: 2025,
    links: { repo: "https://github.com/cursingparrot4/Churn-engine/" },
    // not featured — shows on /projects only
  },
  {
    slug: "stubook",
    name: "Stubook",
    tagline: "Grade calculator, calendar and to do lists for students, working fully offline.",
    description:
      "A student productivity app in Flutter and Dart that runs on iOS and Android. There's no backend server at all, everything sits in Hive as an embedded local database, so weighted grade calculations, calendar events and swipeable to do lists all keep working with no connection.",
    stack: ["Flutter", "Dart", "Hive"],
    year: 2024,
    links: { repo: "https://github.com/joeyhlu/stubook_master" },
    // not featured — shows on /projects only
  },
];

/** Helper so pages don't re-implement filtering. */
export const featuredProjects = projects.filter((p) => p.featured);
