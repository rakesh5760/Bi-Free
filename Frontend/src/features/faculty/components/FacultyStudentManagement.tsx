import { useState, useEffect } from "react";
import { GraduationCap, Search, ExternalLink, Github, Globe, Award, Loader2, Sparkles, SlidersHorizontal, UserCheck } from "lucide-react";
import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { api } from "../../../services/api.client";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const fadeIn = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export function FacultyStudentManagement() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");

  useEffect(() => {
    let active = true;
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await api.get("/users/admin/users");
        if (active) {
          setStudents(response.data.data.students || []);
          setError(null);
        }
      } catch (err: any) {
        console.error("Error loading students:", err);
        if (active) {
          setError("Failed to load student directories. Please try again.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    fetchStudents();
    return () => {
      active = false;
    };
  }, []);

  // Filter students based on search and level selection
  const filteredStudents = students.filter((student) => {
    const matchesSearch = 
      `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLevel = 
      selectedLevel === "all" || 
      student.details.level.toLowerCase() === selectedLevel.toLowerCase();

    return matchesSearch && matchesLevel;
  });

  // Calculate Level Counts
  const countByLevel = (level: string) => {
    return students.filter((s) => s.details.level.toLowerCase() === level.toLowerCase()).length;
  };

  if (loading) {
    return (
      <div className="flex h-[55vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
        <p className="text-muted-foreground font-medium animate-pulse">Retrieving student directories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[55vh] flex-col items-center justify-center gap-4">
        <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-2">
          <span className="font-bold text-lg">!</span>
        </div>
        <p className="text-destructive font-medium">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Counters Grid */}
      <motion.div variants={fadeIn} className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Enrolled</div>
              <div className="text-2xl font-bold mt-1">{students.length}</div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-indigo-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm border-l-4 border-l-emerald-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Level A (Elite)</div>
              <div className="text-2xl font-bold mt-1 text-emerald-500">{countByLevel("a")}</div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm border-l-4 border-l-indigo-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Level B & C</div>
              <div className="text-2xl font-bold mt-1 text-indigo-500">{countByLevel("b") + countByLevel("c")}</div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <Award className="h-5 w-5 text-indigo-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm border-l-4 border-l-purple-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Level D (Novice)</div>
              <div className="text-2xl font-bold mt-1 text-purple-500">{countByLevel("d")}</div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <SlidersHorizontal className="h-5 w-5 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filter and Search controls */}
      <motion.div variants={fadeIn} className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card/30 backdrop-blur-sm p-4 rounded-xl border border-border/50">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search student directories by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          {["all", "A", "B", "C", "D"].map((level) => (
            <Button
              key={level}
              variant={selectedLevel === level ? "default" : "outline"}
              onClick={() => setSelectedLevel(level)}
              size="sm"
              className="flex-1 md:flex-initial h-9 font-semibold text-xs"
            >
              {level === "all" ? "All Levels" : `Level ${level}`}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Students Directory List */}
      <motion.div variants={fadeIn} className="space-y-3">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-12 bg-card/25 rounded-xl border border-dashed border-border/50">
            <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
            <h3 className="text-lg font-bold text-foreground mb-1">No Students Found</h3>
            <p className="text-sm text-muted-foreground">Adjust filters or refine your search query.</p>
          </div>
        ) : (
          <>
            {/* Header Row for desktop screens */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-muted/10 border border-border/50 rounded-xl text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <div className="col-span-4">Student Profile</div>
              <div className="col-span-2 text-center">Current Level</div>
              <div className="col-span-3">Trust Score (Reputation)</div>
              <div className="col-span-1 text-center">Status</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* List Row Items */}
            {filteredStudents.map((student) => (
              <div
                key={student.user_id}
                className="bg-card/40 hover:bg-card/80 backdrop-blur-sm border border-border/50 hover:border-indigo-500/30 transition-all duration-350 rounded-xl overflow-hidden group shadow-sm px-6 py-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
              >
                {/* Student Profile (Avatar, Name, Email) */}
                <div className="col-span-1 md:col-span-4 flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-border/50 shadow-sm flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-cyan-500 text-white font-extrabold text-xs uppercase">
                      {student.first_name[0] || ""}{student.last_name[0] || ""}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-foreground text-sm group-hover:text-indigo-500 transition-colors leading-snug truncate">
                      {student.first_name} {student.last_name}
                    </h4>
                    <p className="text-xs font-medium text-muted-foreground truncate">{student.email}</p>
                  </div>
                </div>

                {/* Level Badge */}
                <div className="col-span-1 md:col-span-2 flex md:justify-center items-center">
                  <Badge className={`px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-extrabold shadow-sm ${
                    student.details.level === "A" ? "bg-emerald-500 text-white" :
                    student.details.level === "B" ? "bg-indigo-500 text-white" :
                    student.details.level === "C" ? "bg-cyan-500 text-white" :
                    "bg-purple-500 text-white"
                  }`}>
                    Level {student.details.level}
                  </Badge>
                </div>

                {/* Trust Score & Progress Bar */}
                <div className="col-span-1 md:col-span-3 space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-muted-foreground md:hidden">Trust Profile</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`font-extrabold ${student.details.trust_score >= 75 ? 'text-emerald-500' : 'text-foreground'}`}>
                        {student.details.trust_score}%
                      </span>
                      {student.details.trust_score >= 75 && (
                        <Badge variant="outline" className="text-[8px] uppercase tracking-wider border-emerald-500/30 text-emerald-500 bg-emerald-500/10 px-1 py-0 font-extrabold scale-90 origin-left">
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        student.details.trust_score >= 75 ? "bg-emerald-500" :
                        student.details.trust_score >= 50 ? "bg-indigo-500" :
                        "bg-amber-500"
                      }`}
                      style={{ width: `${student.details.trust_score}%` }}
                    />
                  </div>
                </div>

                {/* Platform Access Status */}
                <div className="col-span-1 md:col-span-1 flex md:justify-center items-center">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${student.is_active ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-muted'}`} />
                    <span className="text-xs font-semibold md:hidden">{student.is_active ? "Active" : "Suspended"}</span>
                  </div>
                </div>

                {/* Quick Links & Actions */}
                <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-end gap-3">
                  <div className="flex items-center gap-1.5">
                    {student.details.github_handle ? (
                      <a
                        href={`https://github.com/${student.details.github_handle}`}
                        target="_blank"
                        rel="noreferrer"
                        className="h-8 w-8 rounded-lg border border-border/50 hover:bg-muted hover:text-foreground transition-all flex items-center justify-center text-muted-foreground shadow-sm bg-card"
                        title={`Github: ${student.details.github_handle}`}
                      >
                        <Github className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      <span className="h-8 w-8 rounded-lg border border-border/50 flex items-center justify-center text-muted-foreground/30 bg-muted/10 opacity-50 shadow-inner">
                        <Github className="h-3.5 w-3.5" />
                      </span>
                    )}

                    {student.details.portfolio_url ? (
                      <a
                        href={student.details.portfolio_url}
                        target="_blank"
                        rel="noreferrer"
                        className="h-8 w-8 rounded-lg border border-border/50 hover:bg-muted hover:text-foreground transition-all flex items-center justify-center text-muted-foreground shadow-sm bg-card"
                        title="Website Portfolio"
                      >
                        <Globe className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      <span className="h-8 w-8 rounded-lg border border-border/50 flex items-center justify-center text-muted-foreground/30 bg-muted/10 opacity-50 shadow-inner">
                        <Globe className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </div>

                  <Button variant="ghost" size="sm" className="h-8 font-bold text-xs text-indigo-500 hover:text-indigo-600 hover:bg-indigo-500/10 px-2.5">
                    Audit
                  </Button>
                </div>
              </div>
            ))}
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
