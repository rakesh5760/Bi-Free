import { useState } from "react";
import { Plus, MessageSquare, Paperclip, MoreVertical, GitPullRequest, GitMerge, CheckCircle, Clock, CircleDot, AlertCircle, Play } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { ProjectSidebar } from "./components/ProjectSidebar";

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
  const [selectedProject] = useState("E-commerce Platform");

  const columns = [
    {
      title: "To Do",
      color: "border-blue-500",
      bg: "bg-blue-500/5",
      icon: CircleDot,
      iconColor: "text-blue-500",
      tasks: [
        { id: "ENG-101", title: "Design homepage mockup", assignee: "PS", priority: "high", comments: 3, attachments: 2, pr: null },
        { id: "ENG-102", title: "Set up database schema", assignee: "VR", priority: "high", comments: 1, attachments: 0, pr: null },
        { id: "ENG-103", title: "Create API documentation", assignee: "AP", priority: "medium", comments: 0, attachments: 1, pr: null },
      ]
    },
    {
      title: "In Progress",
      color: "border-yellow-500",
      bg: "bg-yellow-500/5",
      icon: Play,
      iconColor: "text-yellow-500",
      tasks: [
        { id: "ENG-98", title: "Implement user authentication", assignee: "RS", priority: "high", comments: 5, attachments: 1, pr: { status: "open", id: "#42" } },
        { id: "ENG-95", title: "Build product listing page", assignee: "PS", priority: "medium", comments: 2, attachments: 3, pr: { status: "draft", id: "#44" } },
      ]
    },
    {
      title: "Mentor Review",
      color: "border-purple-500",
      bg: "bg-purple-500/5",
      icon: AlertCircle,
      iconColor: "text-purple-500",
      tasks: [
        { id: "ENG-88", title: "Shopping cart functionality", assignee: "VR", priority: "high", comments: 4, attachments: 2, pr: { status: "review", id: "#38" } },
        { id: "ENG-85", title: "Payment gateway integration", assignee: "AP", priority: "high", comments: 6, attachments: 1, pr: { status: "review", id: "#39" } },
      ]
    },
    {
      title: "Done",
      color: "border-emerald-500",
      bg: "bg-emerald-500/5",
      icon: CheckCircle,
      iconColor: "text-emerald-500",
      tasks: [
        { id: "ENG-72", title: "Project setup & config", assignee: "RS", priority: "medium", comments: 2, attachments: 0, pr: { status: "merged", id: "#12" } },
        { id: "ENG-70", title: "Logo and branding assets", assignee: "PS", priority: "low", comments: 1, attachments: 5, pr: null },
      ]
    },
  ];

  const teamMembers = [
    { name: "Priya Sharma", initials: "PS", role: "Frontend Lead", active: true },
    { name: "Vikram Reddy", initials: "VR", role: "Backend Lead", active: true },
    { name: "Anjali Patel", initials: "AP", role: "Full Stack", active: false },
    { name: "Rahul Singh", initials: "RS", role: "DevOps", active: true },
  ];

  return (
    <DashboardLayout sidebar={<ProjectSidebar />} title="Project Execution">
      <motion.div 
        className="space-y-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeIn} className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border/50 shadow-sm">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-bold shadow-sm">TechStart Inc</Badge>
              <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1"><Clock className="h-3 w-3" /> Due May 18, 2026</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground">{selectedProject}</h2>
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
            <Button className="font-bold bg-foreground text-background hover:bg-foreground/90 shadow-md h-10 px-5">
              <Plus className="mr-2 h-4 w-4" />
              New Issue
            </Button>
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
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">{task.id}</span>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Edit Issue</DropdownMenuItem>
                                <DropdownMenuItem>Copy Link</DropdownMenuItem>
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
                                ${task.priority === "high" ? "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20" : ""}
                                ${task.priority === "medium" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" : ""}
                                ${task.priority === "low" ? "bg-muted/50 text-muted-foreground border-border/50" : ""}
                              `}
                            >
                              {task.priority} Priority
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
                
                <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:bg-muted/50 font-semibold text-sm border border-dashed border-border/50 bg-transparent" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Issue
                </Button>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
