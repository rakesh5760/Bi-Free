import { useState, useEffect } from "react";
import { Users, UserCheck, FileText, CheckCircle, AlertTriangle, Briefcase, Clock, Calendar, Search, UserPlus, RefreshCw, ChevronDown, ChevronUp, CheckSquare, ShieldAlert, DollarSign, X, History } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "../../../components/ui/dialog";
import { Checkbox } from "../../../components/ui/checkbox";
import { Progress } from "../../../components/ui/progress";
import { api, facultyApi } from "../../../services/api.client";
import { toast } from "sonner";
import { ProjectTimeline } from "../../projects/components/ProjectTimeline";

export function FacultyAllocations() {
  const [projects, setProjects] = useState<any[]>([]);
  const [levelAStudents, setLevelAStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [statusTab, setStatusTab] = useState("all");

  // Collapsed states for tasks lists per project ID
  const [expandedTasks, setExpandedTasks] = useState<Record<number, boolean>>({});

  // Add student dialog states
  const [currentAllocToModify, setCurrentAllocToModify] = useState<any | null>(null);
  const [selectedStudentsToAdd, setSelectedStudentsToAdd] = useState<number[]>([]);
  const [isSubmittingStudents, setIsSubmittingStudents] = useState(false);

  const fetchAllocations = async () => {
    try {
      setIsLoading(true);
      const [projectsRes, studentsRes] = await Promise.all([
        api.get("/mentors/projects/global"),
        api.get("/faculty/students/level-a")
      ]);

      if (projectsRes.data.success) {
        setProjects(projectsRes.data.data.items || []);
      }
      if (studentsRes.data.success) {
        setLevelAStudents(studentsRes.data.data.items || []);
      }
    } catch (err) {
      console.error("Failed to fetch allocations", err);
      toast.error("Failed to load allocations data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllocations();
  }, []);

  const toggleTasks = (projectId: number) => {
    setExpandedTasks(prev => ({ ...prev, [projectId]: !prev[projectId] }));
  };

  // Revoke individual student
  const handleRemoveStudent = async (allocationId: number, studentId: number) => {
    if (!confirm("Remove this student from the team?")) return;
    try {
      const res = await api.delete(`/faculty/allocations/${allocationId}/students/${studentId}`);
      if (res.data.success) {
        toast.success("Student removed successfully.");
        fetchAllocations();
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to remove student");
    }
  };

  // Revoke entire project allocation
  const handleRevokeAllocation = async (allocationId: number) => {
    if (!confirm("Are you sure you want to revoke this entire allocation? The project will return to Pending and all team members will be unassigned.")) return;
    try {
      const res = await api.delete(`/faculty/allocations/${allocationId}`);
      if (res.data.success) {
        toast.success("Allocation revoked successfully.");
        fetchAllocations();
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to revoke allocation");
    }
  };

  // Add students submit
  const handleAddStudentsSubmit = async () => {
    if (!currentAllocToModify || selectedStudentsToAdd.length === 0) return;

    setIsSubmittingStudents(true);
    try {
      const allocationId = currentAllocToModify.allocation.allocation_id;
      for (const studentId of selectedStudentsToAdd) {
        await api.post(`/faculty/allocations/${allocationId}/add-student`, { student_id: studentId });
      }
      toast.success(`Successfully added ${selectedStudentsToAdd.length} students to team.`);
      setCurrentAllocToModify(null);
      setSelectedStudentsToAdd([]);
      fetchAllocations();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add students to team");
    } finally {
      setIsSubmittingStudents(false);
    }
  };

  const handleStudentCheckboxToggle = (studentId: number) => {
    setSelectedStudentsToAdd(prev =>
      prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]
    );
  };

  // Filter projects to only show allocated ones
  const allocatedProjects = projects.filter(p => p.allocation);

  // Apply search & status tab filtering
  const filteredAllocations = allocatedProjects.filter(p => {
    const mentorName = p.allocation.mentor_name?.toLowerCase() || "";
    const projectTitle = p.title?.toLowerCase() || "";
    const description = p.description?.toLowerCase() || "";
    const searchLower = searchTerm.toLowerCase();

    // Check if team members match search
    const hasMatchingMember = p.allocation.team_members?.some((m: any) =>
      m.student_name?.toLowerCase().includes(searchLower)
    );

    const matchesSearch =
      projectTitle.includes(searchLower) ||
      description.includes(searchLower) ||
      mentorName.includes(searchLower) ||
      hasMatchingMember;

    if (!matchesSearch) return false;

    if (statusTab === "all") return p.status !== "Revoked";
    return p.status?.toLowerCase() === statusTab.toLowerCase();
  });

  // Calculate metrics
  const activeCount = allocatedProjects.filter(p => p.status === "Assigned" || p.status === "In Progress" || p.status === "Mentor QA").length;
  const completedCount = allocatedProjects.filter(p => p.status === "Completed").length;
  const revokedCount = allocatedProjects.filter(p => p.status === "Revoked").length;

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Active Allocations</div>
              <div className="text-3xl font-extrabold text-foreground mt-2">{isLoading ? <RefreshCw className="animate-spin h-6 w-6 text-muted-foreground" /> : activeCount}</div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-indigo-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Completed Projects</div>
              <div className="text-3xl font-extrabold text-foreground mt-2">{isLoading ? <RefreshCw className="animate-spin h-6 w-6 text-muted-foreground" /> : completedCount}</div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Revoked Allocations</div>
              <div className="text-3xl font-extrabold text-foreground mt-2">{isLoading ? <RefreshCw className="animate-spin h-6 w-6 text-muted-foreground" /> : revokedCount}</div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center">
              <ShieldAlert className="h-6 w-6 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
        <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by project, mentor, or student..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 bg-background/50 border-border/50 focus-visible:ring-indigo-500/30"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: "all", label: `All (${allocatedProjects.filter(p => p.status !== "Revoked").length})` },
              { id: "assigned", label: "Assigned" },
              { id: "in progress", label: "In Progress" },
              { id: "mentor qa", label: "Mentor QA" },
              { id: "completed", label: "Completed" },
              { id: "revoked", label: "Revoked" }
            ].map(tab => (
              <Button
                key={tab.id}
                variant={statusTab === tab.id ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setStatusTab(tab.id)}
                className={`text-xs font-semibold h-8 rounded-lg ${statusTab === tab.id
                    ? "bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/15"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Allocations List */}
      <div className="space-y-6">
        {isLoading ? (
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <RefreshCw className="h-10 w-10 animate-spin text-indigo-500 mb-4" />
              <p className="text-muted-foreground font-semibold">Loading allocations data...</p>
            </CardContent>
          </Card>
        ) : filteredAllocations.length === 0 ? (
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <Briefcase className="h-12 w-12 text-muted-foreground opacity-40 mb-4" />
              <h3 className="text-lg font-bold text-foreground mb-1">No Allocations Found</h3>
              <p className="text-sm text-muted-foreground max-w-sm">No project allocations match your current filters or search term.</p>
            </CardContent>
          </Card>
        ) : (
          filteredAllocations.map(project => {
            const teamSize = project.allocation?.team_members?.length || 0;
            const mentorName = project.allocation?.mentor_name || "Unassigned";
            const mentorEmail = project.allocation?.mentor_email || "NIL";
            const mentorPhone = project.allocation?.mentor_phone || "NIL";
            const tasks = project.tasks || [];
            const completedTasks = tasks.filter((t: any) => t.status === "Done").length;
            const totalTasks = tasks.length;
            const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
            const isTasksExpanded = !!expandedTasks[project.project_id];

            // Get eligible students who aren't already on this team and whose skills match this domain
            const eligibleStudents = levelAStudents.filter(student =>
              student.skills?.some((s: any) => s.domain_id === project.domain?.domain_id) &&
              !project.allocation?.team_members?.some((m: any) => m.student_id === student.profile_id)
            );

            return (
              <Card key={project.project_id} className="bg-card/50 backdrop-blur-sm border-border/50 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden relative">
                {/* Accent Top Bar based on status */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${project.status === "Completed" ? "bg-emerald-500" :
                    project.status === "Mentor QA" ? "bg-amber-500" :
                      project.status === "In Progress" ? "bg-indigo-500" :
                        project.status === "Revoked" ? "bg-red-500" : "bg-blue-500"
                  }`}></div>

                <CardHeader className="border-b border-border/40 pb-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider bg-background shadow-sm border-border/50">
                          {project.domain?.name || "General Client"}
                        </Badge>
                        <Badge className={`text-[10px] uppercase font-bold tracking-wider ${project.status === "Completed" ? "bg-emerald-500 text-white" :
                            project.status === "Mentor QA" ? "bg-amber-500 text-white" :
                              project.status === "In Progress" ? "bg-indigo-500 text-white" :
                                project.status === "Revoked" ? "bg-red-500 text-white" : "bg-blue-500 text-white"
                          }`}>
                          {project.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl font-extrabold text-foreground">{project.title}</CardTitle>
                      <CardDescription className="text-sm font-medium mt-1">{project.description}</CardDescription>
                    </div>

                    <div className="flex sm:flex-col gap-4 sm:text-right shrink-0">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Budget</div>
                        <div className="font-extrabold text-lg text-emerald-500 flex items-center sm:justify-end"><DollarSign className="w-4 h-4 shrink-0" />{Number(project.budget).toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Deadline</div>
                        <div className="text-sm font-bold text-foreground flex items-center sm:justify-end gap-1.5 mt-0.5">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          {project.deadline ? new Date(project.deadline).toLocaleDateString() : "No Deadline"}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  {/* Supervisor & Team row */}
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Supervisor */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <UserCheck className="w-4 h-4 text-indigo-500" /> Supervising Mentor
                      </h4>
                      <Card className="bg-background/40 border-border/40 shadow-inner">
                        <CardContent className="p-4 space-y-2 text-sm">
                          <div className="font-bold text-foreground text-base">{mentorName}</div>
                          <div className="text-muted-foreground flex flex-col gap-1 text-xs">
                            <span>Email: <span className="font-semibold text-foreground">{mentorEmail}</span></span>
                            <span>Phone: <span className="font-semibold text-foreground">{mentorPhone}</span></span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Team Members */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-cyan-500" /> Assigned Student Team ({teamSize})
                        </h4>
                        {project.status !== "Completed" && project.status !== "Revoked" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setCurrentAllocToModify(project);
                              setSelectedStudentsToAdd([]);
                            }}
                            className="h-7 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-500/10 flex items-center gap-1"
                          >
                            <UserPlus className="w-3.5 h-3.5" /> Add Student
                          </Button>
                        )}
                      </div>

                      <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                        {teamSize === 0 ? (
                          <div className="text-xs text-muted-foreground p-4 bg-background/30 rounded-lg border border-border/40 border-dashed text-center">
                            No students allocated to this project yet.
                          </div>
                        ) : (
                          project.allocation?.team_members?.map((tm: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center p-3 border border-border/40 rounded-xl bg-background/50 text-xs gap-3">
                              <div>
                                <div className="font-bold text-foreground">{tm.student_name}</div>
                                <div className="text-muted-foreground mt-0.5">{tm.student_email}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                {tm.role && <Badge variant="outline" className="text-[10px] font-semibold bg-background">{tm.role}</Badge>}
                                {project.status !== "Completed" && project.status !== "Revoked" && (
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleRemoveStudent(project.allocation?.allocation_id, tm.student_id)}
                                    className="h-7 w-7 text-red-500 hover:bg-red-500/10 hover:text-red-600 rounded-lg"
                                    title="Remove student from team"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Progress Lifecycle Tracking */}
                  <div className="pt-4 border-t border-border/40">
                    <ProjectTimeline 
                      currentLevel={project.current_progress_level} 
                      history={project.progress_history || []} 
                      layout="vertical"
                    />
                  </div>

                  {/* Task progress bar */}
                  <div className="space-y-2 pt-4 border-t border-border/40">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <CheckSquare className="w-4 h-4 text-emerald-500" /> Task Completion Progress
                      </span>
                      <span className="text-foreground">{completedTasks} / {totalTasks} Tasks ({progressPercent}%)</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Progress value={progressPercent} className="h-2 flex-1" />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleTasks(project.project_id)}
                        className="h-8 text-xs font-bold text-muted-foreground hover:text-foreground shrink-0 flex items-center gap-1"
                      >
                        {isTasksExpanded ? (
                          <>Hide Tasks <ChevronUp className="w-4 h-4" /></>
                        ) : (
                          <>Show Tasks ({totalTasks}) <ChevronDown className="w-4 h-4" /></>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Expandable Tasks Details */}
                  <AnimatePresence>
                    {isTasksExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 space-y-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Task Delegation Details</h4>
                          {totalTasks === 0 ? (
                            <p className="text-xs text-muted-foreground p-3 bg-muted/20 border border-border/40 rounded-lg text-center">
                              No tasks delegated yet on this project.
                            </p>
                          ) : (
                            <div className="grid gap-3 sm:grid-cols-2">
                              {tasks.map((task: any) => (
                                <div key={task.task_id} className="p-3.5 border border-border/40 rounded-xl bg-background/50 flex flex-col justify-between gap-2.5">
                                  <div className="space-y-1">
                                    <div className="flex justify-between items-start gap-2">
                                      <div className="font-bold text-foreground text-sm line-clamp-1">{task.title}</div>
                                      <Badge variant={
                                        task.status === "Done" ? "default" :
                                          task.status === "Review" ? "secondary" :
                                            task.status === "In Progress" ? "outline" : "secondary"
                                      } className={`text-[9px] uppercase font-bold shrink-0 ${task.status === "Done" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                                          task.status === "Review" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                                            task.status === "In Progress" ? "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" : ""
                                        }`}>
                                        {task.status}
                                      </Badge>
                                    </div>
                                    <p className="text-[11px] text-muted-foreground font-medium">
                                      Assignee: <span className="font-semibold text-foreground">
                                        {project.allocation.team_members?.find((tm: any) => tm.student_id === task.assigned_to)?.student_name || "Unknown student"}
                                      </span>
                                    </p>
                                  </div>
                                  <div className="flex justify-between items-center text-[10px] font-bold border-t border-border/30 pt-2">
                                    <span className="text-muted-foreground">Priority: <span className={`uppercase ${task.priority === "High" ? "text-red-500" :
                                        task.priority === "Medium" ? "text-amber-500" : "text-slate-500"
                                      }`}>{task.priority}</span></span>
                                    {task.github_pr_url && (
                                      <a href={task.github_pr_url} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                                        GitHub PR
                                      </a>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Allocation Management Button (Revoke Entire Allocation) */}
                  {project.status !== "Completed" && project.status !== "Revoked" && (
                    <div className="flex justify-end pt-4 border-t border-border/40">
                      <Button
                        variant="outline"
                        onClick={() => handleRevokeAllocation(project.allocation.allocation_id)}
                        className="font-bold border-red-500/30 text-red-500 hover:bg-red-500/10 h-10 px-5"
                      >
                        <ShieldAlert className="w-4 h-4 mr-2" /> Revoke Entire Allocation
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Add Student Pool Dialog */}
      <Dialog open={!!currentAllocToModify} onOpenChange={(open) => !open && setCurrentAllocToModify(null)}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Add Student to Team</DialogTitle>
            <DialogDescription>
              Assign eligible Level A students to "{currentAllocToModify?.title}"
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4 max-h-[300px] overflow-y-auto pr-1">
            {(() => {
              if (!currentAllocToModify) return null;

              // Filter Level A students to ones matching the project domain and NOT currently in team members
              const eligibleStudents = levelAStudents.filter(student =>
                student.skills?.some((s: any) => s.domain_id === currentAllocToModify.domain?.domain_id) &&
                !currentAllocToModify.allocation.team_members?.some((m: any) => m.student_id === student.profile_id)
              );

              if (eligibleStudents.length === 0) {
                return (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    No new eligible Level A students found in the {currentAllocToModify.domain?.name || ""} domain pool.
                  </p>
                );
              }

              return eligibleStudents.map(student => (
                <div key={student.user_id} className="flex items-center space-x-3 p-3 rounded-xl border border-border/40 hover:bg-muted/30 transition-colors">
                  <Checkbox
                    id={`student-add-${student.user_id}`}
                    checked={selectedStudentsToAdd.includes(student.profile_id)}
                    onCheckedChange={() => handleStudentCheckboxToggle(student.profile_id)}
                  />
                  <label
                    htmlFor={`student-add-${student.user_id}`}
                    className="flex-1 flex flex-col cursor-pointer text-xs"
                  >
                    <span className="text-sm font-bold text-foreground">{student.first_name} {student.last_name}</span>
                    <span className="text-muted-foreground">{student.email}</span>
                  </label>
                  <Badge variant="secondary" className="text-[10px] font-bold bg-muted/60">{student.trust_score}% Trust</Badge>
                </div>
              ));
            })()}
          </div>

          <DialogFooter className="mt-4">
            <Button variant="ghost" onClick={() => setCurrentAllocToModify(null)} disabled={isSubmittingStudents}>
              Cancel
            </Button>
            <Button
              onClick={handleAddStudentsSubmit}
              disabled={selectedStudentsToAdd.length === 0 || isSubmittingStudents}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
            >
              {isSubmittingStudents ? <RefreshCw className="animate-spin mr-2 h-4 w-4" /> : null}
              Add Selected ({selectedStudentsToAdd.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
