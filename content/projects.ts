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
      "A multi-card payment router built with integer programming and a fine-tuned language model.",
    description:
      "CardIQ solves the multi-card allocation problem by formulating monthly spending as a strict integer program. Using PuLP and a CBC backend, the engine handles constraints like utilization ceilings and sign-up bonuses using precise integer-cent arithmetic to avoid floating-point drift. Instead of building a rigid UI for goal setting, I trained a small language model on synthetic data to parse natural language requests into the exact mathematical weights the solver needs to compute the optimal route.",
    stack: ["Python", "FastAPI", "PuLP/CBC", "Pydantic", "Streamlit"],
    year: 2026,
    award: "Hack the 6ix",
    links: { devpost: "https://devpost.com/software/cardiq" },
    featured: true,
  },
  {
    slug: "cognitive-rag",
    name: "Cognitive RAG",
    tagline:
      "A document retrieval pipeline built with persistent conversation memory and hybrid search routing.",
    description:
      "As part of the QMIND design team, I architected the vector storage and conversational memory infrastructure for the CognitiveRAG system. To maximize retrieval accuracy, I engineered a Pinecone database layer that executes reciprocal rank fusion, combining dense semantic embeddings with sparse keyword vectors before running a secondary cross-encoder pass. To overcome the context limitations of stateless models, I built an episodic memory module that embeds past interactions into a dedicated namespace. This pipeline evaluates the quality of each generated response and filters out semantically identical records to prevent database bloat. Relevant historical context is then dynamically scored and injected into the active prompt without polluting the final user citations.",
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
      "A real-time augmented reality pipeline built with YOLOv8 object detection, pose tracking, and Stable Diffusion texture generation.",
    description:
      "VisualizeIt is a real-time augmented reality tool that dynamically warps and blends generated designs onto live video feeds. I engineered a dual-model computer vision pipeline that uses YOLOv8 for rapid target localization and Mask R-CNN for precise instance segmentation. To handle continuous motion, the system routes tracking through two separate algorithms: MediaPipe Holistic to compute 3D rigid transforms for human poses, and ORB feature matching to calculate 2D homographies for rigid objects. Finally, the pipeline uses Stable Diffusion to generate custom textures, which are perspective-warped and alpha-blended directly onto the detected masks using OpenCV.",
    stack: ["YOLOv8", "PyTorch", "Stable Diffusion", "OpenCV"],
    year: 2025,
    award: "QHacks winner · Mayor's Innovation Award",
    links: { devpost: "https://devpost.com/software/visualizeit" },
    featured: true,
  },
  {
    slug: "churn-classification-engine",
    name: "Churn Classification Engine",
    tagline: "A classification pipeline achieving a 0.82 F1 score across 7,000+ users.",
    description:
      "An end-to-end classification pipeline built in Python to predict telecommunications customer churn. Using a dataset of over 7,000 users, the workflow handles missing values and applies one-hot and ordinal encoding before training a Random Forest ensemble. The project includes a standalone grid search for hyperparameter tuning and uses seaborn to visualize feature importance and F1 scores.",
    stack: ["Python", "scikit-learn", "seaborn"],
    year: 2025,
    links: { repo: "https://github.com/cursingparrot4/Churn-engine/" },
    // not featured — shows on /projects only
  },
  {
    slug: "stubook",
    name: "Stubook",
    tagline: "A cross-platform, offline student productivity app built with Flutter and Dart.",
    description:
      "A cross-platform student productivity app I built using Flutter and Dart. It runs entirely on device without a backend server, relying on Hive as an embedded local database. This setup allows users to calculate weighted course grades, track calendar events, and manage swipeable to-do lists without needing a network connection.",
    stack: ["Flutter", "Dart", "Hive"],
    year: 2024,
    links: { repo: "https://github.com/joeyhlu/stubook_master" },
    // not featured — shows on /projects only
  },
];

/** Helper so pages don't re-implement filtering. */
export const featuredProjects = projects.filter((p) => p.featured);
