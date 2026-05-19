import { useState } from "react";
import { Plus, MessageSquare, Paperclip, MoreVertical, GitPullRequest, GitMerge, CheckCircle, Clock, CircleDot, AlertCircle, Play } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { StudentSidebar } from "../student-dashboard/components/StudentSidebar";
import { MentorSidebar } from "../mentor/components/MentorSidebar";
import { NewIssueModal } from "./components/NewIssueModal";
import { api } from "../../services/api.client";
import { useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function ProjectManagement() {
  const { user } = useAuthStore();
  const Sidebar = user?.role === 'mentor' ? MentorSidebar : StudentSidebar;

  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [projectDetails, setProjectDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects/assigned');
      if (res.data.success && res.data.data.length > 0) {
        setProjects(res.data.data);
        setSelectedProjectId(res.data.data[0].project_id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectDetails = async (id: number) => {
    try {
      const res = await api.get(`/projects/${id}`);
      if (res.data.success) {
        setProjectDetails(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      fetchProjectDetails(selectedProjectId);
    }
  }, [selectedProjectId]);

  const updateTaskStatus = async (taskId: number, status: string) => {
    try {
      await api.patch(`/projects/tasks/${taskId}/status`, { status });
      if (selectedProjectId) fetchProjectDetails(selectedProjectId);
    } catch (err) {
      console.error(err);
    }
  };

  const getColumns = () => {
    const tasks = projectDetails?.tasks || [];
    return [
      {
        title: "To Do",
        statusKey: "To Do",
        color: "border-blue-500",
        bg: "bg-blue-500/5",
        icon: CircleDot,
        iconColor: "text-blue-500",
        tasks: tasks.filter((t: any) => t.status === "To Do")
      },
      {
        title: "In Progress",
        statusKey: "In Progress",
        color: "border-yellow-500",
        bg: "bg-yellow-500/5",
        icon: Play,
        iconColor: "text-yellow-500",
        tasks: tasks.filter((t: any) => t.status === "In Progress")
      },
      {
        title: "Review",
        statusKey: "Review",
        color: "border-purple-500",
        bg: "bg-purple-500/5",
        icon: AlertCircle,
        iconColor: "text-purple-500",
        tasks: tasks.filter((t: any) => t.status === "Review")
      },
      {
        title: "Done",
        statusKey: "Done",
        color: "border-emerald-500",
        bg: "bg-emerald-500/5",
        icon: CheckCircle,
        iconColor: "text-emerald-500",
        tasks: tasks.filter((t: any) => t.status === "Done")
      },
    ];
  };

  const columns = getColumns();

  const teamMembers = [
    { name: "Priya Sharma", initials: "PS", role: "Frontend Lead", active: true },
    { name: "Vikram Reddy", initials: "VR", role: "Backend Lead", active: true },
    { name: "Anjali Patel", initials: "AP", role: "Full Stack", active: false },
    { name: "Rahul Singh", initials: "RS", role: "DevOps", active: true },
  ];

  return (
    <DashboardLayout sidebar={<Sidebar />} title="Project Execution">
      {!loading && projects.length === 0 ? (
        <motion.div variants={fadeIn} className="flex flex-col items-center justify-center py-24 px-4 text-center">
          <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <CircleDot className="h-10 w-10 text-primary opacity-50" />
          </div>
          <h3 className="text-2xl font-extrabold tracking-tight mb-2">No Projects Assigned</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            You haven't been assigned to any projects yet. Please wait for a mentor to allocate you to a team, or complete your prerequisite learning modules.
          </p>
        </motion.div>
      ) : (
        <motion.div 
          className="space-y-6"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeIn} className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border/50 shadow-sm">
          <div>
            <div className="flex items-center gap-3 mb-1">
              {projects.length > 1 && (
                <select 
                  className="bg-background border rounded px-2 py-1 text-sm font-medium"
                  value={selectedProjectId || ""}
                  onChange={(e) => setSelectedProjectId(Number(e.target.value))}
                >
                  {projects.map(p => <option key={p.project_id} value={p.project_id}>{p.title}</option>)}
                </select>
              )}
              {projectDetails?.domain && <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-bold shadow-sm">{projectDetails.domain.name}</Badge>}
              {projectDetails?.deadline && <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1"><Clock className="h-3 w-3" /> Due {new Date(projectDetails.deadline).toLocaleDateString()}</span>}
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground">{projectDetails?.title || "Loading Project..."}</h2>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex -space-x-3">
              {teamMembers.map((member, i) => (
                <Avatar key={i} className="h-10 w-10 border-2 border-background shadow-sm transition-transform hover:-translate-y-1">
                  <AvatarFallback className={`bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold text-xs ${member.active ? '' : 'opacity-50 grayscale'}`}>
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <div className="h-8 w-px bg-border/50 hidden md:block" />
            {selectedProjectId && (
              <NewIssueModal projectId={selectedProjectId} onIssueCreated={() => fetchProjectDetails(selectedProjectId)} />
            )}
          </div>
        </motion.div>

        {/* Kanban Board */}
        <motion.div variants={fadeIn} className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
          {columns.map((column, i) => (
            <div key={i} className="flex-shrink-0 w-80 flex flex-col h-[calc(100vh-280px)] min-h-[500px]">
              <div className={`flex items-center justify-between p-3 rounded-t-xl border-t-2 border-l border-r border-border/50 ${column.color} ${column.bg}`}>
                <div className="flex items-center gap-2">
                  <column.icon className={`h-4 w-4 ${column.iconColor}`} />
                  <span className="font-bold text-sm text-foreground">{column.title}</span>
                </div>
                <Badge variant="secondary" className="bg-background text-foreground shadow-sm">{column.tasks.length}</Badge>
              </div>
              
              <div className="flex-1 bg-muted/20 border-l border-r border-b border-border/50 rounded-b-xl p-3 space-y-3 overflow-y-auto">
                <AnimatePresence>
                  {column.tasks.map((task, j) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2, delay: j * 0.05 }}
                    >
                      <Card className="hover:border-foreground/30 hover:shadow-md transition-all cursor-pointer bg-card/80 backdrop-blur-sm border-border/50 group">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">TASK-{task.task_id}</span>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => updateTaskStatus(task.task_id, 'To Do')} disabled={task.status === 'To Do'}>Move to To Do</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateTaskStatus(task.task_id, 'In Progress')} disabled={task.status === 'In Progress'}>Move to In Progress</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateTaskStatus(task.task_id, 'Review')} disabled={task.status === 'Review'}>Move to Review</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateTaskStatus(task.task_id, 'Done')} disabled={task.status === 'Done'}>Move to Done</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          
                          <div className="font-semibold text-sm mb-4 leading-tight text-foreground">{task.title}</div>
                          
                          <div className="flex flex-wrap items-center gap-2 mb-4">
                            <Badge
                              variant="outline"
                              className={`
                                text-[9px] uppercase tracking-wider font-bold border
                                ${task.priority?.toLowerCase() === "high" ? "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20" : ""}
                                ${task.priority?.toLowerCase() === "medium" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" : ""}
                                ${task.priority?.toLowerCase() === "low" ? "bg-muted/50 text-muted-foreground border-border/50" : ""}
                              `}
                            >
                              {task.priority || 'Medium'} Priority
                            </Badge>

                            {task.pr && (
                              <Badge variant="outline" className={`text-[9px] flex items-center gap-1 font-bold border ${task.pr.status === 'merged' ? 'bg-purple-500/10 text-purple-600 border-purple-500/20' : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'}`}>
                                {task.pr.status === 'merged' ? <GitMerge className="h-2.5 w-2.5" /> : <GitPullRequest className="h-2.5 w-2.5" />}
                                PR {task.pr.id}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between border-t border-border/50 pt-3">
                            <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
                              {task.comments > 0 && (
                                <div className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                                  <MessageSquare className="h-3.5 w-3.5" />
                                  <span>{task.comments}</span>
                                </div>
                              )}
                              {task.attachments > 0 && (
                                <div className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                                  <Paperclip className="h-3.5 w-3.5" />
                                  <span>{task.attachments}</span>
                                </div>
                              )}
                            </div>
                            <Avatar className="h-6 w-6 ring-2 ring-background">
                              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-[10px] font-bold">
                                {task.assignee}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {selectedProjectId && (
                  <NewIssueModal projectId={selectedProjectId} onIssueCreated={() => fetchProjectDetails(selectedProjectId)}>
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:bg-muted/50 font-semibold text-sm border border-dashed border-border/50 bg-transparent" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Issue
                    </Button>
                  </NewIssueModal>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
      )}
    </DashboardLayout>
  );
}
