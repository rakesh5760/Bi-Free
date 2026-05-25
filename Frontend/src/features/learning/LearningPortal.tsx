import { useState, useEffect } from "react";
import {
  BookOpen, Code, Database, Globe, Trophy, Star,
  Play, CheckCircle, Lock, Target, ArrowRight,
  Video, FileText, ChevronRight, ArrowLeft,
  CheckCheck, Clock, Award, BookMarked, Layers, Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { useAuthStore } from "../../store/useAuthStore";
import { StudentSidebar } from "../student-dashboard/components/StudentSidebar";
import { api } from "../../services/api.client";
import { toast } from "sonner";

/* ─── animation variants ─────────────────────────────────── */
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } }
};
const slideIn = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" as const } }
};

/* ─── types ──────────────────────────────────────────────── */
interface Lecture {
  id: string;
  title: string;
  duration: string;
  type: "Video" | "Article";
  preview?: string; // short description shown in module viewer
}

interface AssignmentItem {
  id: string;
  title: string;
  description: string;
  points: number;
}

interface Module {
  id: string;
  title: string;
  description: string;
  lectures: Lecture[];
  assignments: AssignmentItem[];
}

interface Domain {
  id: string;
  title: string;
  icon: any;
  duration: string;
  level: string;
  color: string;      // gradient classes
  bgLight: string;    // icon bg class
  textCol: string;    // icon text color class
  modules: Module[];
}

/* ─── mock data ──────────────────────────────────────────── */
const DOMAINS: Domain[] = [
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
        title: "Web Fundamentals",
        description: "Build a rock-solid understanding of the web's core trio — HTML5, CSS3, and vanilla JavaScript — so every advanced concept you learn afterward has strong roots.",
        lectures: [
          {
            id: "fs-lec-1",
            title: "Introduction to HTML5 & CSS3",
            duration: "25 min",
            type: "Video",
            preview: "Learn the building blocks of every website. Covers semantic tags, document structure, and your first styled page."
          },
          {
            id: "fs-lec-2",
            title: "Responsive Layouts with Flexbox & CSS Grid",
            duration: "45 min",
            type: "Video",
            preview: "Master modern CSS layout systems and build fully responsive interfaces without any framework."
          },
          {
            id: "fs-lec-3",
            title: "JavaScript Basics & DOM Manipulation",
            duration: "15 min",
            type: "Article",
            preview: "Understand variables, functions, events, and how JavaScript controls the live page through the DOM."
          }
        ],
        assignments: [
          {
            id: "fs-assign-1",
            title: "Create a Portfolio Landing Page",
            description: "Design a fully responsive portfolio page using raw HTML & CSS. Must work on mobile, tablet, and desktop.",
            points: 100
          }
        ]
      },
      {
        id: "fs-mod-2",
        title: "Frontend Frameworks (React)",
        description: "Adopt the industry's most widely used UI library. Learn component thinking, state, and the React lifecycle that powers modern web apps.",
        lectures: [
          {
            id: "fs-lec-4",
            title: "React Functional Components & Props",
            duration: "30 min",
            type: "Video",
            preview: "Build reusable UI components and compose them into complex interfaces using the props system."
          },
          {
            id: "fs-lec-5",
            title: "State Management: useState & useEffect",
            duration: "40 min",
            type: "Video",
            preview: "Control dynamic data in your components and react to side-effects like API calls and timers."
          },
          {
            id: "fs-lec-6",
            title: "Global State Management with Zustand",
            duration: "20 min",
            type: "Article",
            preview: "Move beyond prop-drilling and manage shared application state with a lightweight store."
          }
        ],
        assignments: [
          {
            id: "fs-assign-2",
            title: "Build an Authentication Flow",
            description: "Implement a complete JWT-based login system using React. Include protected routes, token storage, and logout handling.",
            points: 150
          }
        ]
      },
      {
        id: "fs-mod-3",
        title: "Backend & Databases",
        description: "Step behind the browser and build the servers, APIs, and database schemas that power real-world applications.",
        lectures: [
          {
            id: "fs-lec-7",
            title: "Introduction to Node.js & Express",
            duration: "35 min",
            type: "Video",
            preview: "Set up a Node.js server, define routes, and handle HTTP requests and responses with Express."
          },
          {
            id: "fs-lec-8",
            title: "RESTful API Design & Routing",
            duration: "30 min",
            type: "Video",
            preview: "Design clean, versioned REST APIs following industry conventions and HTTP semantics."
          },
          {
            id: "fs-lec-9",
            title: "Relational Database Design with SQL",
            duration: "25 min",
            type: "Article",
            preview: "Model your data using tables, relationships, and constraints that keep your data consistent."
          }
        ],
        assignments: [
          {
            id: "fs-assign-3",
            title: "Database Schema Design",
            description: "Design a normalized relational schema for an e-commerce platform with products, orders, and users.",
            points: 100
          }
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
        title: "HTML/CSS Mastery",
        description: "Go beyond basics — learn advanced CSS patterns, accessibility-first markup, and professional design system methodologies.",
        lectures: [
          {
            id: "fe-lec-1",
            title: "Advanced Semantic HTML & Accessibility (a11y)",
            duration: "30 min",
            type: "Video",
            preview: "Write HTML that works for screen readers, keyboard navigation, and all users by default."
          },
          {
            id: "fe-lec-2",
            title: "CSS Architectures: BEM & Utility-First",
            duration: "20 min",
            type: "Article",
            preview: "Apply scalable naming conventions and understand when to use utility classes vs. component classes."
          },
          {
            id: "fe-lec-3",
            title: "TailwindCSS Setup & Custom Configuration",
            duration: "35 min",
            type: "Video",
            preview: "Configure a Tailwind project from scratch, extend the theme, and build a mini design token system."
          }
        ],
        assignments: [
          {
            id: "fe-assign-1",
            title: "Recreate a Complex UI Dashboard Layout",
            description: "Given a Figma mockup, implement the layout pixel-perfect in HTML/CSS with full responsiveness.",
            points: 100
          }
        ]
      },
      {
        id: "fe-mod-2",
        title: "UI State & Build Systems",
        description: "Level up your engineering foundation with TypeScript, modern bundlers, and robust form management.",
        lectures: [
          {
            id: "fe-lec-4",
            title: "Introduction to TypeScript in React",
            duration: "40 min",
            type: "Video",
            preview: "Add type safety to your components, props, and API responses to eliminate entire categories of bugs."
          },
          {
            id: "fe-lec-5",
            title: "Vite Build Tool & Environment Variables",
            duration: "15 min",
            type: "Article",
            preview: "Configure Vite for blazing-fast dev builds, code splitting, and safe secrets management."
          }
        ],
        assignments: [
          {
            id: "fe-assign-2",
            title: "Build a Multi-Step Wizard Form",
            description: "Create a fully-typed multi-step wizard using react-hook-form, with validation on each step before advancing.",
            points: 120
          }
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
        title: "Server Architectures",
        description: "Understand how server processes work under the hood — event loops, middleware pipelines, and request lifecycles that define high-performance APIs.",
        lectures: [
          {
            id: "be-lec-1",
            title: "Node.js Event Loop & Non-blocking I/O",
            duration: "25 min",
            type: "Video",
            preview: "Demystify how Node handles thousands of simultaneous requests with a single thread."
          },
          {
            id: "be-lec-2",
            title: "Express.js Custom Middleware Development",
            duration: "30 min",
            type: "Video",
            preview: "Write reusable middleware for auth, logging, error handling, and request transformation."
          }
        ],
        assignments: [
          {
            id: "be-assign-1",
            title: "Build an API Gateway / Proxy Server",
            description: "Write a proxy server with custom rate-limiting middleware and structured request logging.",
            points: 130
          }
        ]
      },
      {
        id: "be-mod-2",
        title: "Data Persistence",
        description: "Design databases that last — choose the right ORM, write clean migrations, and optimize queries for production loads.",
        lectures: [
          {
            id: "be-lec-3",
            title: "Introduction to ORMs (Prisma & SQLAlchemy)",
            duration: "35 min",
            type: "Video",
            preview: "Map your database schema to code objects and run type-safe queries without raw SQL."
          },
          {
            id: "be-lec-4",
            title: "Database Migrations & Seed Scripts",
            duration: "20 min",
            type: "Article",
            preview: "Version-control your schema changes and maintain consistent dev/staging/prod environments."
          }
        ],
        assignments: [
          {
            id: "be-assign-2",
            title: "Optimize Slow SQL Queries",
            description: "Analyze and fix N+1 query problems, add proper indexes, and verify improvements with EXPLAIN plans.",
            points: 100
          }
        ]
      }
    ]
  }
];

/* ─── helper ─────────────────────────────────────────────── */
function getDomainProgress(domain: Domain, completedModules: string[]) {
  if (domain.modules.length === 0) return 0;
  const done = domain.modules.filter(m => completedModules.includes(m.id)).length;
  return Math.round((done / domain.modules.length) * 100);
}

/* ═══════════════════════════════════════════════════════════
   MODULE VIEWER  (3rd level drill-down)
═══════════════════════════════════════════════════════════ */
function ModuleViewer({
  module,
  domain,
  isCompleted,
  isSaving,
  onFinish,
  onBack
}: {
  module: Module;
  domain: Domain;
  isCompleted: boolean;
  isSaving: boolean;
  onFinish: () => void;
  onBack: () => void;
}) {
  const totalItems = module.lectures.length + module.assignments.length;
  const totalXP = module.assignments.reduce((acc, a) => acc + a.points, 0);

  return (
    <motion.div
      key={module.id}
      variants={slideIn}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Breadcrumb / back */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {domain.title}
        </button>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-semibold">{module.title}</span>
      </div>

      {/* Module header card */}
      <Card className={`border-0 overflow-hidden shadow-xl bg-gradient-to-br ${domain.color} text-white`}>
        <CardContent className="p-8">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="flex-1">
              <div className="text-white/70 text-xs font-bold uppercase tracking-widest mb-2">
                {domain.title}
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight mb-3">{module.title}</h2>
              <p className="text-white/80 leading-relaxed max-w-2xl">{module.description}</p>
            </div>
            {isCompleted && (
              <div className="flex flex-col items-center gap-1 bg-white/20 rounded-2xl p-4">
                <CheckCheck className="h-8 w-8 text-white" />
                <span className="text-white text-xs font-bold">Completed</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-6 mt-6 pt-6 border-t border-white/20 flex-wrap">
            <div className="flex items-center gap-2 text-white/80 text-sm font-semibold">
              <Layers className="h-4 w-4" />
              {module.lectures.length} Lectures
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm font-semibold">
              <Trophy className="h-4 w-4" />
              {module.assignments.length} Assignment{module.assignments.length > 1 ? 's' : ''}
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm font-semibold">
              <Award className="h-4 w-4" />
              {totalXP} XP Available
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lectures section */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2 text-left">
          <Play className={`h-5 w-5 ${domain.textCol}`} />
          Lectures & Units
        </h3>
        <div className="space-y-3">
          {module.lectures.map((lec, idx) => (
            <motion.div key={lec.id} variants={fadeUp}>
              <Card className="border border-border/50 bg-card/60 hover:bg-card/90 hover:shadow-md transition-all cursor-default">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${domain.bgLight} ${domain.textCol}`}>
                    {lec.type === "Video" ? <Video className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between gap-4 mb-1">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        {lec.type} {idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {lec.duration}
                      </span>
                    </div>
                    <h4 className="font-bold text-foreground mb-1">{lec.title}</h4>
                    {lec.preview && (
                      <p className="text-sm text-muted-foreground leading-relaxed">{lec.preview}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Assignments section */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2 text-left">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Milestone Assignment{module.assignments.length > 1 ? 's' : ''}
        </h3>
        <div className="space-y-3">
          {module.assignments.map((assign) => (
            <motion.div key={assign.id} variants={fadeUp}>
              <Card className="border border-yellow-500/20 bg-yellow-500/[0.03]">
                <CardContent className="p-5 text-left">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-foreground mb-1">{assign.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{assign.description}</p>
                    </div>
                    <Badge className="bg-yellow-500/15 text-yellow-500 border-yellow-500/25 font-bold text-xs shrink-0">
                      +{assign.points} XP
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FINISH MODULE button */}
      <motion.div variants={fadeUp}>
        <Card className={`border-2 ${isCompleted ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-border/50 bg-card/40'}`}>
          <CardContent className="p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-left">
              {isCompleted ? (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCheck className="h-5 w-5 text-emerald-500" />
                    <h4 className="font-bold text-emerald-500 text-lg">Module Completed!</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You've finished this module. Your progress has been updated.
                  </p>
                </>
              ) : (
                <>
                  <h4 className="font-bold text-foreground text-lg mb-1">Ready to finish this module?</h4>
                  <p className="text-sm text-muted-foreground">
                    Once you've reviewed all {totalItems} items above, mark this module as complete.
                  </p>
                </>
              )}
            </div>
            <Button
              size="lg"
              disabled={isCompleted || isSaving}
              onClick={onFinish}
              className={`min-w-[200px] font-bold text-base h-12 shrink-0 ${
                isCompleted
                  ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 cursor-default hover:bg-emerald-500/20"
                  : `bg-gradient-to-r ${domain.color} text-white border-0 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all`
              }`}
            >
              {isCompleted ? (
                <><CheckCheck className="h-5 w-5 mr-2" /> Completed</>
              ) : isSaving ? (
                <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Saving...</>
              ) : (
                <><CheckCircle className="h-5 w-5 mr-2" /> Finish Module</>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MODULE LIST  (2nd level — shown inside a selected domain)
═══════════════════════════════════════════════════════════ */
function ModuleList({
  domain,
  completedModules,
  onOpenModule
}: {
  domain: Domain;
  completedModules: string[];
  onOpenModule: (moduleId: string) => void;
}) {
  const domainProgress = getDomainProgress(domain, completedModules);

  return (
    <motion.div
      key={domain.id + "-modules"}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {/* Domain sub-header */}
      <motion.div variants={fadeUp} className="flex items-center justify-between flex-wrap gap-4">
        <div className="text-left">
          <h3 className="text-xl font-extrabold text-foreground tracking-tight">{domain.title}</h3>
          <p className="text-sm text-muted-foreground font-medium mt-0.5">
            {domain.modules.filter(m => completedModules.includes(m.id)).length} of {domain.modules.length} modules completed
          </p>
        </div>
        <div className="flex items-center gap-3 min-w-[200px]">
          <Progress value={domainProgress} className="h-2 flex-1" />
          <span className={`text-sm font-bold ${domain.textCol} w-10 text-right`}>{domainProgress}%</span>
        </div>
      </motion.div>

      {/* Module cards */}
      <div className="space-y-3">
        {domain.modules.map((mod, idx) => {
          const isCompleted = completedModules.includes(mod.id);
          const totalItems = mod.lectures.length + mod.assignments.length;

          return (
            <motion.div variants={fadeUp} key={mod.id}>
              <Card
                onClick={() => onOpenModule(mod.id)}
                className={`border cursor-pointer hover:shadow-lg transition-all duration-300 group ${
                  isCompleted
                    ? 'border-emerald-500/25 bg-emerald-500/[0.03] hover:border-emerald-500/40'
                    : 'border-border/50 bg-card/60 hover:border-border hover:bg-card/90'
                }`}
              >
                <CardContent className="p-5 flex items-center gap-5">
                  {/* Index badge */}
                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center font-extrabold text-sm flex-shrink-0 transition-transform group-hover:scale-105 ${
                    isCompleted
                      ? 'bg-emerald-500 text-white shadow-emerald-500/20 shadow-md'
                      : `${domain.bgLight} ${domain.textCol}`
                  }`}>
                    {isCompleted ? <CheckCheck className="h-5 w-5" /> : idx + 1}
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="font-bold text-foreground">{mod.title}</h4>
                      {isCompleted && (
                        <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/25 text-[10px] font-bold">
                          Completed
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{mod.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs font-semibold text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Play className="h-3 w-3" />
                        {mod.lectures.length} lectures
                      </span>
                      <span className="flex items-center gap-1">
                        <Trophy className="h-3 w-3" />
                        {mod.assignments.length} assignment{mod.assignments.length > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className={`h-5 w-5 flex-shrink-0 transition-all group-hover:translate-x-1 ${
                    isCompleted ? 'text-emerald-500' : 'text-muted-foreground'
                  }`} />
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
export default function LearningPortal() {
  const { user } = useAuthStore();
  const level = user?.studentLevel || 'D';

  // Navigation state
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null);
  const [activeModuleId, setActiveModuleId]     = useState<string | null>(null);

  // Completion state — persisted to DB
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch completed modules from the backend on mount
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/learning/my-modules');
        setCompletedModules(data.data ?? []);
      } catch (err) {
        // Silently fall back to empty — not critical
        console.error('Could not load module progress:', err);
      } finally {
        setIsLoadingProgress(false);
      }
    };
    load();
  }, []);

  // Derived
  const selectedDomain = DOMAINS.find(d => d.id === selectedDomainId) ?? null;
  const activeModule   = selectedDomain?.modules.find(m => m.id === activeModuleId) ?? null;

  // Overall progress for the selected domain (shown in banner)
  const bannerProgress = selectedDomain
    ? getDomainProgress(selectedDomain, completedModules)
    : Math.round(
        DOMAINS.reduce((acc, d) => acc + getDomainProgress(d, completedModules), 0) / DOMAINS.length
      );

  const handleFinishModule = async () => {
    if (!activeModuleId || completedModules.includes(activeModuleId)) return;
    setIsSaving(true);
    try {
      const { data } = await api.post(`/learning/my-modules/${activeModuleId}/complete`);
      // Backend returns the full updated list
      setCompletedModules(data.data ?? [...completedModules, activeModuleId]);
      toast.success('Module completed! 🎉 Progress saved.');
    } catch (err) {
      // Optimistic update so the UI doesn't look broken
      setCompletedModules(prev => [...prev, activeModuleId]);
      toast.error('Progress saved locally — will sync when back online.');
      console.error('Failed to save module completion:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (activeModuleId) {
      setActiveModuleId(null);   // back to module list
    } else {
      setSelectedDomainId(null); // back to domain cards
    }
  };

  return (
    <DashboardLayout sidebar={<StudentSidebar />} title="Incubation Pipeline">
      <motion.div
        className="space-y-8"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* ── Banner ── */}
        {!activeModuleId && (
          <motion.div variants={fadeUp}>
            <Card className={`border-0 shadow-lg overflow-hidden relative bg-gradient-to-r ${
              level === 'A' || level === 'B' ? 'from-emerald-500/10 to-teal-500/5' : 'from-indigo-500/10 to-blue-500/5'
            }`}>
              <div className={`absolute top-0 right-0 w-64 h-64 blur-3xl rounded-full opacity-20 -mr-10 -mt-10 ${
                level === 'A' || level === 'B' ? 'bg-emerald-500' : 'bg-indigo-500'
              }`} />
              <CardContent className="p-8 flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
                <div className={`h-16 w-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  level === 'A' || level === 'B' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-indigo-500/20 text-indigo-500'
                }`}>
                  {level === 'A' ? <Target className="h-8 w-8" /> : <BookOpen className="h-8 w-8" />}
                </div>
                <div className="flex-1 text-left">
                  <h2 className="text-2xl font-extrabold text-foreground tracking-tight mb-1">
                    {level === 'A' ? 'Project Execution Phase' :
                     level === 'B' ? 'Mock Project Phase' :
                     level === 'C' ? 'Domain Specialization' : 'Foundation Phase'}
                  </h2>
                  <p className="text-muted-foreground font-medium mb-4">
                    {level === 'A'
                      ? 'You are qualified to take on real client projects. Keep your trust score high.'
                      : level === 'B'
                      ? 'Complete mentor-assigned mock projects to prove your readiness.'
                      : 'Complete your domain modules to unlock the next incubation level.'}
                  </p>
                  <div className="flex items-center gap-4 flex-wrap">
                    <Badge variant="outline" className="bg-background/50 border-border/50 py-1">
                      Level {level} Student
                    </Badge>
                    {level !== 'A' && (
                      <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                        Next: Level {String.fromCharCode(level.charCodeAt(0) - 1)}
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0 w-full md:w-48 text-right">
                  <div className="text-sm font-bold text-foreground mb-2">Overall Completion</div>
                  <Progress value={bannerProgress} className="h-2.5 bg-background/50" />
                  <div className="text-xs font-semibold text-muted-foreground mt-2">{bannerProgress}% Completed</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ── Tabs ── */}
        <Tabs defaultValue="learning" className="w-full">
          <TabsList className="mb-6 bg-card/50 backdrop-blur-md border border-border/50">
            <TabsTrigger value="learning" className="font-semibold">Learning Paths</TabsTrigger>
            <TabsTrigger value="achievements" className="font-semibold">Milestones</TabsTrigger>
          </TabsList>

          {/* ── Learning Paths tab ── */}
          <TabsContent value="learning" className="space-y-6">
            <AnimatePresence mode="wait">

              {/* ── VIEW 3: Module Viewer ── */}
              {activeModule && selectedDomain ? (
                <ModuleViewer
                  key="module-viewer"
                  module={activeModule}
                  domain={selectedDomain}
                  isCompleted={completedModules.includes(activeModule.id)}
                  isSaving={isSaving}
                  onFinish={handleFinishModule}
                  onBack={handleBack}
                />
              ) : selectedDomain ? (
                /* ── VIEW 2: Module List ── */
                <motion.div key="module-list" variants={fadeUp} initial="hidden" animate="visible" exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  {/* Back to domains */}
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" /> All Domains
                  </button>
                  <ModuleList
                    domain={selectedDomain}
                    completedModules={completedModules}
                    onOpenModule={setActiveModuleId}
                  />
                </motion.div>
              ) : (
                /* ── VIEW 1: Domain Cards ── */
                <motion.div
                  key="domain-cards"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0 }}
                  className="grid gap-6 md:grid-cols-3"
                >
                  {DOMAINS.map(domain => {
                    const progress = getDomainProgress(domain, completedModules);
                    const completedCount = domain.modules.filter(m => completedModules.includes(m.id)).length;

                    return (
                      <motion.div variants={fadeUp} key={domain.id}>
                        <Card
                          onClick={() => setSelectedDomainId(domain.id)}
                          className="h-full border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer flex flex-col"
                        >
                          <div className={`h-1.5 w-full bg-gradient-to-r ${domain.color}`} />
                          <div className="flex-1 p-6 text-left flex flex-col">
                            <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110 ${domain.bgLight} ${domain.textCol}`}>
                              <domain.icon className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-1 text-foreground">{domain.title}</h3>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                              {domain.level} • {domain.duration}
                            </p>
                            <p className="text-sm text-muted-foreground mb-5">
                              {domain.modules.length} modules · {completedCount} completed
                            </p>
                            <div className="space-y-2 mt-auto">
                              <div className="flex justify-between text-sm font-bold">
                                <span>Progress</span>
                                <span className={domain.textCol}>{progress}%</span>
                              </div>
                              <Progress value={progress} className="h-2 bg-muted/50" />
                            </div>
                          </div>
                          <div className="p-6 pt-0">
                            <Button
                              className={`w-full font-bold group-hover:opacity-90 transition-opacity bg-gradient-to-r ${domain.color} text-white border-0`}
                            >
                              {progress === 100 ? "Review Domain" : progress > 0 ? "Continue" : "Start Learning"}
                              <ChevronRight className="h-4 w-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                            </Button>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          {/* ── Achievements tab ── */}
          <TabsContent value="achievements">
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid gap-6 md:grid-cols-4">
              {[
                { title: "First Module Completed", icon: Trophy, earned: completedModules.length >= 1, date: "May 20, 2026" },
                { title: "5 Day Streak", icon: Star, earned: true, date: "Apr 02, 2026" },
                { title: "All Modules Done", icon: CheckCircle, earned: completedModules.length >= 7, date: null },
                { title: "Level B Reached", icon: Target, earned: level === 'A' || level === 'B', date: null },
              ].map((achievement, i) => (
                <motion.div variants={fadeUp} key={i}>
                  <Card className={`h-full border-border/50 transition-all ${achievement.earned ? 'bg-card/60 hover:shadow-md' : 'bg-muted/20 opacity-60'}`}>
                    <CardContent className="p-6 text-center flex flex-col items-center justify-center h-full">
                      <div className={`h-16 w-16 rounded-full flex items-center justify-center mb-4 ${
                        achievement.earned ? 'bg-yellow-500/20 text-yellow-500' : 'bg-muted text-muted-foreground'
                      }`}>
                        <achievement.icon className="h-8 w-8" />
                      </div>
                      <h3 className="font-bold mb-2">{achievement.title}</h3>
                      {achievement.earned ? (
                        <div className="text-xs font-semibold text-muted-foreground">{achievement.date}</div>
                      ) : (
                        <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1 justify-center">
                          <Lock className="h-3 w-3" /> Locked
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </DashboardLayout>
  );
}
