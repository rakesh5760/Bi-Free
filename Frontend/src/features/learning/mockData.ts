import { BookOpen, Code, Database, Globe, Trophy, Star, Shield, Brain, LineChart } from "lucide-react";

export interface Lecture {
  id: string;
  title: string;
  duration: string;
  type: "Video" | "Article";
  preview?: string;
}

export interface AssignmentItem {
  id: string;
  title: string;
  description: string;
  points: number;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lectures: Lecture[];
  assignments: AssignmentItem[];
}

export interface Domain {
  id: string;
  title: string;
  icon: any;
  duration: string;
  level: string;
  color: string;
  bgLight: string;
  textCol: string;
  modules: Module[];
}

export const DOMAINS: Domain[] = [
  {
    id: "fullstack",
    title: "Full Stack Web Development",
    icon: Globe,
    duration: "6 months",
    level: "Intermediate",
    color: "from-blue-500 to-cyan-500",
    bgLight: "bg-blue-500/10",
    textCol: "text-blue-500",
    modules: [
      {
        id: "fs-mod-1",
        title: "Web Architecture & Principles",
        description: "Understand the core concepts of how the web works, networking basics, and overarching system design.",
        lectures: [
          { id: "fs-lec-1", title: "Web Architecture", duration: "30 min", type: "Video", preview: "Client-server model, DNS, HTTP/HTTPS." },
          { id: "fs-lec-2", title: "Security", duration: "45 min", type: "Video", preview: "CORS, XSS, CSRF, and general web security." },
          { id: "fs-lec-3", title: "System Design", duration: "50 min", type: "Article", preview: "Designing scalable full-stack applications." }
        ],
        assignments: [
          { id: "fs-assign-1", title: "Design a Scalable System Architecture", description: "Create an architecture diagram for a scalable e-commerce platform.", points: 100 }
        ]
      },
      {
        id: "fs-mod-2",
        title: "Frontend & Backend Integration",
        description: "Bring the front and back together by learning how modern JS frameworks communicate with robust APIs.",
        lectures: [
          { id: "fs-lec-4", title: "React Basics", duration: "60 min", type: "Video", preview: "Component lifecycle and state management." },
          { id: "fs-lec-5", title: "FastAPI / Node.js", duration: "50 min", type: "Video", preview: "Building RESTful endpoints." }
        ],
        assignments: [
          { id: "fs-assign-2", title: "React + FastAPI/Node.js Integration", description: "Build a frontend that consumes your backend REST API.", points: 150 }
        ]
      },
      {
        id: "fs-mod-3",
        title: "Database & Cloud Deployment",
        description: "Persist your data securely and deploy your application to the cloud using industry-standard tools.",
        lectures: [
          { id: "fs-lec-6", title: "PostgreSQL Fundamentals", duration: "45 min", type: "Video", preview: "Relational database concepts and SQL." },
          { id: "fs-lec-7", title: "Docker & Containerization", duration: "40 min", type: "Video", preview: "Containerizing both frontend and backend." },
          { id: "fs-lec-8", title: "Cloud Deployment", duration: "45 min", type: "Article", preview: "Deploying to AWS/GCP and CI/CD basics." }
        ],
        assignments: [
          { id: "fs-assign-3", title: "PostgreSQL Setup & Queries", description: "Design schema and write complex queries.", points: 100 },
          { id: "fs-assign-4", title: "Dockerize Your App", description: "Create a docker-compose file to run the full stack.", points: 100 },
          { id: "fs-assign-5", title: "Cloud Deployment", description: "Deploy your dockerized app to a cloud provider.", points: 150 }
        ]
      }
    ]
  },
  {
    id: "frontend",
    title: "Frontend Engineering",
    icon: Code,
    duration: "4 months",
    level: "Beginner",
    color: "from-purple-500 to-pink-500",
    bgLight: "bg-purple-500/10",
    textCol: "text-purple-500",
    modules: [
      {
        id: "fe-mod-1",
        title: "Design & User Experience",
        description: "Focus on how applications look and feel for end users, mastering UI/UX and accessibility.",
        lectures: [
          { id: "fe-lec-1", title: "UI/UX Principles", duration: "40 min", type: "Video", preview: "Color theory, typography, and wireframing." },
          { id: "fe-lec-2", title: "Accessibility (a11y)", duration: "35 min", type: "Video", preview: "Screen readers, ARIA roles, and keyboard navigation." }
        ],
        assignments: [
          { id: "fe-assign-1", title: "Accessible UI Implementation", description: "Build an accessible, WCAG-compliant form.", points: 100 }
        ]
      },
      {
        id: "fe-mod-2",
        title: "Core Engineering Tools",
        description: "Understand the inner workings of the browser and robust tooling.",
        lectures: [
          { id: "fe-lec-3", title: "Browser Internals", duration: "30 min", type: "Article", preview: "Rendering engine, event loop, and DOM." },
          { id: "fe-lec-4", title: "TypeScript Fundamentals", duration: "50 min", type: "Video", preview: "Type safety, interfaces, and generics." }
        ],
        assignments: [
          { id: "fe-assign-2", title: "TypeScript Integration", description: "Refactor a JS application to TypeScript.", points: 100 }
        ]
      },
      {
        id: "fe-mod-3",
        title: "Modern UI Development",
        description: "Master React, Next.js, and modern styling solutions like Tailwind.",
        lectures: [
          { id: "fe-lec-5", title: "React Deep Dive", duration: "60 min", type: "Video", preview: "Hooks, Context API, and performance optimization." },
          { id: "fe-lec-6", title: "Next.js & SSR", duration: "45 min", type: "Video", preview: "Server-side rendering and static site generation." },
          { id: "fe-lec-7", title: "Tailwind CSS", duration: "30 min", type: "Video", preview: "Utility-first styling." }
        ],
        assignments: [
          { id: "fe-assign-3", title: "React Architecture", description: "Build a highly componentized React view.", points: 120 },
          { id: "fe-assign-4", title: "Next.js Routing", description: "Implement a multi-page app with Next.js.", points: 150 },
          { id: "fe-assign-5", title: "Tailwind Styling", description: "Style a complex layout entirely with Tailwind CSS.", points: 100 }
        ]
      }
    ]
  },
  {
    id: "backend",
    title: "Backend & APIs",
    icon: Database,
    duration: "5 months",
    level: "Intermediate",
    color: "from-emerald-500 to-teal-500",
    bgLight: "bg-emerald-500/10",
    textCol: "text-emerald-500",
    modules: [
      {
        id: "be-mod-1",
        title: "Database Architecture",
        description: "Design and implement robust data persistence layers.",
        lectures: [
          { id: "be-lec-1", title: "Databases (SQL vs NoSQL)", duration: "45 min", type: "Video", preview: "Choosing the right DB for your data." },
          { id: "be-lec-2", title: "Database Optimization", duration: "40 min", type: "Article", preview: "Indexing, query plans, and caching." }
        ],
        assignments: [
          { id: "be-assign-1", title: "PostgreSQL Modeling", description: "Create a robust relational schema for an API.", points: 120 },
          { id: "be-assign-2", title: "Redis Caching", description: "Implement a caching layer with Redis to speed up queries.", points: 110 }
        ]
      },
      {
        id: "be-mod-2",
        title: "API Frameworks",
        description: "Build robust, scalable APIs using industry-standard frameworks.",
        lectures: [
          { id: "be-lec-3", title: "Networking & HTTP", duration: "35 min", type: "Video", preview: "TCP/IP, HTTP methods, and status codes." },
          { id: "be-lec-4", title: "Building APIs with FastAPI", duration: "50 min", type: "Video", preview: "Python endpoints, Pydantic, and Swagger." },
          { id: "be-lec-5", title: "Building APIs with Django", duration: "50 min", type: "Video", preview: "Django REST Framework and ORM." }
        ],
        assignments: [
          { id: "be-assign-3", title: "FastAPI Implementation", description: "Build a high-performance REST API with FastAPI.", points: 150 },
          { id: "be-assign-4", title: "Django Application", description: "Build a CMS backend using Django.", points: 150 }
        ]
      },
      {
        id: "be-mod-3",
        title: "Systems at Scale",
        description: "Learn how to orchestrate and scale backend systems.",
        lectures: [
          { id: "be-lec-6", title: "System Design", duration: "60 min", type: "Video", preview: "Load balancing, microservices, and message queues." },
          { id: "be-lec-7", title: "Distributed Systems", duration: "45 min", type: "Article", preview: "CAP theorem, consensus, and eventual consistency." }
        ],
        assignments: [
          { id: "be-assign-5", title: "Docker Orchestration", description: "Containerize a microservices architecture using Docker.", points: 130 }
        ]
      }
    ]
  },
  {
    id: "cybersecurity",
    title: "Cyber Security",
    icon: Shield,
    duration: "6 months",
    level: "Advanced",
    color: "from-red-500 to-orange-500",
    bgLight: "bg-red-500/10",
    textCol: "text-red-500",
    modules: [
      {
        id: "cs-mod-1",
        title: "Foundations & Cryptography",
        description: "Understand the mathematical and conceptual foundations of security.",
        lectures: [
          { id: "cs-lec-1", title: "Cryptography", duration: "60 min", type: "Video", preview: "Symmetric/Asymmetric encryption, Hash functions." },
          { id: "cs-lec-2", title: "Security Architecture", duration: "50 min", type: "Video", preview: "Zero trust, defense in depth, and secure design principles." }
        ],
        assignments: [
          { id: "cs-assign-1", title: "Implement Encryption", description: "Write scripts to encrypt and decrypt sensitive data.", points: 100 }
        ]
      },
      {
        id: "cs-mod-2",
        title: "Network & Defensive Security",
        description: "Learn how to monitor, defend, and analyze networks.",
        lectures: [
          { id: "cs-lec-3", title: "Network Security", duration: "45 min", type: "Video", preview: "Firewalls, IDS/IPS, and VPNs." }
        ],
        assignments: [
          { id: "cs-assign-2", title: "Wireshark Packet Analysis", description: "Analyze network traffic dumps to find anomalies.", points: 120 }
        ]
      },
      {
        id: "cs-mod-3",
        title: "Offensive Security & Tooling",
        description: "Think like a hacker to secure your systems using industry tools.",
        lectures: [
          { id: "cs-lec-4", title: "Ethical Hacking Fundamentals", duration: "40 min", type: "Article", preview: "Reconnaissance, enumeration, and exploitation." }
        ],
        assignments: [
          { id: "cs-assign-3", title: "Kali Linux Mastery", description: "Complete a capture-the-flag exercise using Kali tools.", points: 150 },
          { id: "cs-assign-4", title: "Burp Suite Web Assessment", description: "Find vulnerabilities in a test web app using Burp Suite.", points: 140 },
          { id: "cs-assign-5", title: "Metasploit Exploitation", description: "Use Metasploit to exploit a vulnerable virtual machine.", points: 150 }
        ]
      }
    ]
  },
  {
    id: "datascience",
    title: "Data Science",
    icon: LineChart,
    duration: "6 months",
    level: "Intermediate",
    color: "from-blue-500 to-cyan-500",
    bgLight: "bg-blue-500/10",
    textCol: "text-blue-500",
    modules: [
      {
        id: "ds-mod-1",
        title: "Mathematical Foundations",
        description: "The core statistical knowledge required for rigorous data analysis.",
        lectures: [
          { id: "ds-lec-1", title: "Statistics", duration: "60 min", type: "Video", preview: "Probability, distributions, hypothesis testing." }
        ],
        assignments: [
          { id: "ds-assign-1", title: "Statistical Inference", description: "Perform A/B testing analysis on a provided dataset.", points: 100 }
        ]
      },
      {
        id: "ds-mod-2",
        title: "Data Processing & Visualization",
        description: "Tools for cleaning, manipulating, and visualizing large datasets.",
        lectures: [
          { id: "ds-lec-2", title: "Data Mining", duration: "45 min", type: "Article", preview: "Extracting anomalies, patterns, and correlations." }
        ],
        assignments: [
          { id: "ds-assign-2", title: "Data Wrangling with Pandas", description: "Clean and aggregate a messy real-world dataset.", points: 120 },
          { id: "ds-assign-3", title: "Numerical Analysis with NumPy", description: "Optimize mathematical operations on large matrices.", points: 110 },
          { id: "ds-assign-4", title: "Visualization with Matplotlib", description: "Create compelling charts and dashboards.", points: 100 }
        ]
      },
      {
        id: "ds-mod-3",
        title: "Machine Learning Integration",
        description: "Apply machine learning algorithms to solve predictive problems.",
        lectures: [
          { id: "ds-lec-3", title: "Machine Learning Basics", duration: "50 min", type: "Video", preview: "Supervised and unsupervised models." }
        ],
        assignments: [
          { id: "ds-assign-5", title: "Model Building with Scikit-learn", description: "Train and evaluate models for classification tasks.", points: 150 }
        ]
      }
    ]
  },
  {
    id: "ai",
    title: "AI & Agents",
    icon: Brain,
    duration: "8 months",
    level: "Advanced",
    color: "from-indigo-500 to-purple-500",
    bgLight: "bg-indigo-500/10",
    textCol: "text-indigo-500",
    modules: [
      {
        id: "ai-mod-1",
        title: "AI Mathematics & Fundamentals",
        description: "The mathematical backbone of artificial intelligence and machine learning.",
        lectures: [
          { id: "ai-lec-1", title: "Mathematics for ML", duration: "60 min", type: "Video", preview: "Linear algebra, calculus, and probability." },
          { id: "ai-lec-2", title: "Machine Learning", duration: "50 min", type: "Video", preview: "Core ML concepts and model evaluation." }
        ],
        assignments: [
          { id: "ai-assign-1", title: "Python for AI", description: "Implement vector operations and gradient descent from scratch.", points: 100 },
          { id: "ai-assign-2", title: "ML with Scikit-learn", description: "Build baseline models using Scikit-learn.", points: 110 }
        ]
      },
      {
        id: "ai-mod-2",
        title: "Deep Learning & NLP",
        description: "Dive into neural networks, natural language processing, and deep architectures.",
        lectures: [
          { id: "ai-lec-3", title: "Deep Learning", duration: "60 min", type: "Video", preview: "Neural networks, CNNs, and backpropagation." },
          { id: "ai-lec-4", title: "NLP", duration: "55 min", type: "Video", preview: "Transformers, tokenization, and language modeling." }
        ],
        assignments: [
          { id: "ai-assign-3", title: "Deep Learning with PyTorch", description: "Build and train a neural network using PyTorch.", points: 150 },
          { id: "ai-assign-4", title: "Working with LLM APIs", description: "Integrate OpenAI/Anthropic APIs into an application.", points: 120 }
        ]
      },
      {
        id: "ai-mod-3",
        title: "Advanced Agents & Systems",
        description: "Build autonomous agents and Retrieval-Augmented Generation systems.",
        lectures: [
          { id: "ai-lec-5", title: "Reinforcement Learning", duration: "50 min", type: "Article", preview: "Q-learning and agent environments." }
        ],
        assignments: [
          { id: "ai-assign-5", title: "Agent Workflows with LangGraph/CrewAI", description: "Orchestrate multi-agent tasks.", points: 160 },
          { id: "ai-assign-6", title: "Build a RAG System", description: "Implement document retrieval and vector embeddings.", points: 150 }
        ]
      }
    ]
  }
];
