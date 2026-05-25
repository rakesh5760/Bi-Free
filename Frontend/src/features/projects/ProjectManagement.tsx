import { useState } from "react";
import { Plus, MessageSquare, Paperclip, GitPullRequest, GitMerge, CheckCircle, Clock, CircleDot, AlertCircle, Play, Edit2, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { StudentSidebar } from "../student-dashboard/components/StudentSidebar";
import { MentorSidebar } from "../mentor/components/MentorSidebar";
import { NewIssueModal } from "./components/NewIssueModal";
import { EditIssueModal } from "./components/EditIssueModal";
import { api } from "../../services/api.client";
import { useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useSearchParams } from "react-router";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
};

export default function ProjectManagement() {
  const { user } = useAuthStore();
  const Sidebar = user?.role === 'mentor' ? MentorSidebar : StudentSidebar;

  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [projectDetails, setProjectDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [showRevoked, setShowRevoked] = useState(false);
  const [searchParams] = useSearchParams();
  const queryProjectId = searchParams.get('id');

  const displayProjects = projects.filter(p => showRevoked ? p.status === "Revoked" : p.status !== "Revoked");

  useEffect(() => {
    if (displayProjects.length > 0 && !displayProjects.some(p => p.project_id === selectedProjectId)) {
      setSelectedProjectId(displayProjects[0].project_id);
    } else if (displayProjects.length === 0) {
      setSelectedProjectId(null);
      setProjectDetails(null);
    }
  }, [showRevoked, projects]);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects/assigned');
      if (res.data.success && res.data.data.length > 0) {
        setProjects(res.data.data);
        
        // If a specific project ID is requested via query param, select it
        if (queryProjectId) {
          const match = res.data.data.find((p: any) => p.project_id === Number(queryProjectId));
          if (match) {
            setSelectedProjectId(match.project_id);
            if (match.status === "Revoked") {
              setShowRevoked(true); // Automatically switch to revoked view if needed
            }
            return;
          }
        }
        
        // Otherwise default to first project
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

  const deleteTask = async (taskId: number) => {
    try {
      await api.delete(`/projects/tasks/${taskId}`);
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

  const teamMembers = projectDetails?.allocation?.team_members?.map((m: any) => ({
    name: m.student_name,
    email: m.student_email,
    phone: m.student_phone,
    initials: m.student_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2),
    role: "Member",
    active: true
  })) || [];

  return (
    <DashboardLayout sidebar={<Sidebar />} title="Project Execution">
      {!loading && displayProjects.length === 0 ? (
        <motion.div variants={fadeIn} className="flex flex-col items-center justify-center py-24 px-4 text-center">
          <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <CircleDot className="h-10 w-10 text-primary opacity-50" />
          </div>
          <h3 className="text-2xl font-extrabold tracking-tight mb-2">No {showRevoked ? "Revoked" : "Active"} Projects</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            {showRevoked ? "There are no revoked projects to display." : "You haven't been assigned to any active projects yet."}
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
              {displayProjects.length > 0 && (
                <select 
                  className="bg-background border rounded px-2 py-1 text-sm font-medium"
                  value={selectedProjectId || ""}
                  onChange={(e) => setSelectedProjectId(Number(e.target.value))}
                >
                  {displayProjects.map(p => <option key={p.project_id} value={p.project_id}>{p.title}</option>)}
                </select>
              )}
              <div className="flex gap-1">
                <Button size="sm" variant={!showRevoked ? "secondary" : "ghost"} onClick={() => setShowRevoked(false)} className="h-7 px-2 text-[10px] uppercase font-bold tracking-wider">Active</Button>
                <Button size="sm" variant={showRevoked ? "secondary" : "ghost"} onClick={() => setShowRevoked(true)} className={`h-7 px-2 text-[10px] uppercase font-bold tracking-wider ${showRevoked ? "text-red-500 hover:text-red-600" : ""}`}>Revoked</Button>
              </div>
              {projectDetails?.domain && <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-bold shadow-sm">{projectDetails.domain.name}</Badge>}
              {projectDetails?.deadline && <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1"><Clock className="h-3 w-3" /> Due {new Date(projectDetails.deadline).toLocaleDateString()}</span>}
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground">{projectDetails?.title || "Loading Project..."}</h2>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {projectDetails?.allocation?.mentor_name && (
              <div className="flex items-center gap-2 mr-2 pr-4 border-r border-border/50">
                <div className="text-right hidden sm:block">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Mentor</div>
                  <div className="text-sm font-semibold">{projectDetails.allocation.mentor_name}</div>
                </div>
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Avatar 
                        className="h-10 w-10 border-2 border-background shadow-sm cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
                        onClick={() => setSelectedUser({
                          name: projectDetails.allocation.mentor_name,
                          email: projectDetails.allocation.mentor_email,
                          phone: projectDetails.allocation.mentor_phone,
                          role: "Mentor Supervisor",
                          initials: projectDetails.allocation.mentor_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2),
                          isMentor: true
                        })}
                      >
                        <AvatarFallback className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white font-bold text-xs">
                          {projectDetails.allocation.mentor_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-semibold">{projectDetails.allocation.mentor_name}</p>
                      <p className="text-[10px] text-muted-foreground">Mentor Supervisor</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
            <div className="flex -space-x-3">
              <TooltipProvider delayDuration={100}>
                {teamMembers.map((member: any, i: number) => (
                  <Tooltip key={i}>
                    <TooltipTrigger asChild>
                      <Avatar 
                        className="h-10 w-10 border-2 border-background shadow-sm transition-transform hover:-translate-y-1 cursor-pointer hover:ring-2 hover:ring-primary/50"
                        onClick={() => setSelectedUser({
                          name: member.name || "Unknown Member",
                          email: member.email,
                          phone: member.phone,
                          role: member.role || "Team Member",
                          initials: member.initials,
                          isMentor: false
                        })}
                      >
                        <AvatarFallback className={`bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold text-xs ${member.active ? '' : 'opacity-50 grayscale'}`}>
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-semibold">{member.name || "Unknown Member"}</p>
                      <p className="text-[10px] text-muted-foreground">{member.role}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
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
                            <div className="flex items-center gap-1">
                              <TooltipProvider delayDuration={200}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={() => setEditingTask(task)} className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors">
                                      <Edit2 className="h-3.5 w-3.5" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Edit Task</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              
                              <TooltipProvider delayDuration={200}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={() => deleteTask(task.task_id)} className="h-6 w-6 text-muted-foreground hover:text-destructive transition-colors">
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Delete Task</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
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
                  <NewIssueModal projectId={selectedProjectId} onIssueCreated={() => fetchProjectDetails(selectedProjectId)} status={column.statusKey}>
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

      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{selectedUser.isMentor ? "Mentor Details" : "Team Member Details"}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 shadow-md">
                  <AvatarFallback className={`bg-gradient-to-br ${selectedUser.isMentor ? 'from-violet-500 to-fuchsia-500' : 'from-indigo-500 to-purple-500'} text-white font-bold text-xl`}>
                    {selectedUser.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                  <Badge variant="outline" className={`mt-1 ${selectedUser.isMentor ? 'text-violet-500 border-violet-500/30 bg-violet-500/10' : 'text-indigo-500 border-indigo-500/30 bg-indigo-500/10'}`}>
                    {selectedUser.role}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-3 mt-4">
                <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg border border-border/50">
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Email</span>
                  <span className="text-sm font-medium">{selectedUser.email || "NIL"}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg border border-border/50">
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Phone</span>
                  <span className="text-sm font-medium">{selectedUser.phone || "NIL"}</span>
                </div>
                
                <div className="flex flex-col gap-1 p-3 bg-muted/20 rounded-lg border border-border/50">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Project Role</span>
                  <span className="text-sm font-medium">{selectedUser.isMentor ? "Supervises project execution, reviews pull requests, and provides QA feedback." : "Executes assigned tasks, submits pull requests, and collaborates with the team."}</span>
                </div>
                
                {!selectedUser.isMentor && (
                  <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg border border-border/50">
                    <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Status</span>
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Active
                    </span>
                  </div>
                )}
              </div>
              
              <Button className="w-full mt-2" onClick={() => setSelectedUser(null)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {editingTask && (
        <EditIssueModal 
          task={editingTask} 
          open={!!editingTask}
          onOpenChange={(open) => !open && setEditingTask(null)}
          onIssueUpdated={() => {
            setEditingTask(null);
            if (selectedProjectId) fetchProjectDetails(selectedProjectId);
          }} 
        />
      )}
    </DashboardLayout>
  );
}
