import { useEffect, useState } from "react";
import { Briefcase, MessageSquare, Clock, DollarSign, Users, CheckCircle, ChevronRight, Activity, DownloadCloud, FileCheck, AlertCircle, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { formatDistanceToNow, format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Progress } from "../../../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { clientApi } from "../../../services/api.client";

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

export function ClientOverview() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabFilter, setTabFilter] = useState("all");

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await clientApi.getProjects({ size: 100 });
      setProjects(response.data?.items || []);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <RefreshCw className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="bg-red-500/10 border-red-500/50 text-red-600 dark:text-red-400">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <AlertCircle className="h-12 w-12 mb-4 text-red-500" />
            <h3 className="text-lg font-bold mb-2">Error Loading Dashboard</h3>
            <p className="mb-4 text-sm font-medium">{error}</p>
            <Button onClick={fetchDashboardData} variant="outline" className="border-red-500/50 hover:bg-red-500/20 text-red-600">
              <RefreshCw className="mr-2 h-4 w-4" /> Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Derived Metrics
  const activeProjects = projects.filter(p => p.status === "In Progress" || p.status === "Assigned" || p.status === "Mentor QA");
  const totalSpent = projects.reduce((sum, p) => sum + (Number(p.budget) || 0), 0);
  const completedProjects = projects.filter(p => p.status === "Completed");
  const activeTeamsSet = new Set(projects.filter(p => p.allocation).map(p => p.allocation.allocation_id));
  const activeTeamsCount = activeTeamsSet.size;

  const totalProjectsCount = projects.length;
  const successRate = totalProjectsCount > 0 ? Math.round((completedProjects.length / totalProjectsCount) * 100) : 0;

  // Filtered Projects for List
  const displayProjects = projects.filter(p => {
    if (tabFilter === "progress") return p.status === "In Progress";
    if (tabFilter === "review") return p.status === "Mentor QA";
    return true; // all
  });

  // Extract QA Deliverables
  const allQaSubmissions = projects.flatMap(p => 
    (p.qa_submissions || []).map((qa: any) => ({
      ...qa,
      projectName: p.title,
      teamName: p.allocation?.team_name || "Unknown Team",
      mentorName: p.allocation?.mentor_name || "Unassigned"
    }))
  ).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

  // Synthesize Recent Activity
  const activities = [];
  projects.forEach(p => {
    (p.tasks || []).forEach((t: any) => {
      activities.push({
        user: t.assigned_to ? `Student #${t.assigned_to}` : "A Team Member",
        action: `updated task '${t.title}' to ${t.status}`,
        project: p.title,
        time: t.updated_at,
        icon: Briefcase,
        color: "text-blue-500",
        bg: "bg-blue-500/10"
      });
    });
    (p.qa_submissions || []).forEach((qa: any) => {
      activities.push({
        user: qa.submitted_by ? `Student #${qa.submitted_by}` : "A Team Member",
        action: `submitted QA milestone '${qa.title}'`,
        project: p.title,
        time: qa.updated_at,
        icon: FileCheck,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10"
      });
    });
  });
  
  activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  const recentActivities = activities.slice(0, 5); // take top 5

  return (
    <motion.div 
      className="space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* KPI Cards */}
      <motion.div variants={fadeIn} className="grid gap-6 md:grid-cols-4">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none">
              <Briefcase className="h-24 w-24" />
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Active Projects</div>
              <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Briefcase className="h-4 w-4 text-emerald-500" />
              </div>
            </div>
            <div className="text-3xl font-extrabold mb-2 text-foreground tracking-tight">{projects.length}</div>
            <div className="text-xs font-medium text-emerald-500">{activeProjects.length} in progress</div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none">
              <DollarSign className="h-24 w-24" />
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total Spent</div>
              <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-blue-500" />
              </div>
            </div>
            <div className="text-3xl font-extrabold mb-2 text-foreground tracking-tight">${totalSpent.toLocaleString()}</div>
            <div className="text-xs font-medium text-muted-foreground">Lifetime</div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none">
              <CheckCircle className="h-24 w-24" />
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Completed</div>
              <div className="h-8 w-8 rounded-full bg-indigo-500/10 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-indigo-500" />
              </div>
            </div>
            <div className="text-3xl font-extrabold mb-2 text-foreground tracking-tight">{completedProjects.length}</div>
            <div className="text-xs font-medium text-indigo-500">{successRate}% success rate</div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none">
              <Users className="h-24 w-24" />
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Active Teams</div>
              <div className="h-8 w-8 rounded-full bg-cyan-500/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-cyan-500" />
              </div>
            </div>
            <div className="text-3xl font-extrabold mb-2 text-foreground tracking-tight">{activeTeamsCount}</div>
            <div className="text-xs font-medium text-muted-foreground">Currently allocated</div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={fadeIn} className="grid gap-6 lg:grid-cols-3">
        {/* Main Action Queue */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm h-full">
            <CardHeader className="border-b border-border/50 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">Supervised Projects</CardTitle>
                  <CardDescription>Track deliverables for your mentor-supervised teams</CardDescription>
                </div>
                <Tabs value={tabFilter} onValueChange={setTabFilter} className="w-auto">
                  <TabsList className="bg-muted/50 border border-border/50">
                    <TabsTrigger value="all">All Projects</TabsTrigger>
                    <TabsTrigger value="progress">In Execution</TabsTrigger>
                    <TabsTrigger value="review">Mentor QA</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {displayProjects.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground font-medium">No projects found for the selected filter.</div>
                ) : displayProjects.map((project, i) => {
                  const tasks = project.tasks || [];
                  const doneTasks = tasks.filter((t: any) => t.status === "Done");
                  const progress = tasks.length > 0 ? Math.round((doneTasks.length / tasks.length) * 100) : 0;
                  const membersCount = project.allocation?.team_members?.length || 0;
                  const mentorName = project.allocation?.mentor_name || "Unassigned";
                  const teamName = project.allocation?.team_name || "Pending Team";

                  return (
                  <div key={i} className="p-6 hover:bg-muted/30 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="outline" className="bg-background text-foreground text-[10px] uppercase tracking-wider font-bold shadow-sm">Supervised Build</Badge>
                          {mentorName !== "Unassigned" && (
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] uppercase tracking-wider border-emerald-500/20 flex items-center gap-1 font-bold">
                              <CheckCircle className="h-3 w-3" /> Mentor: {mentorName}
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-extrabold text-lg mb-2 text-foreground">{project.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
                          <span className="flex items-center gap-1.5">
                            <Users className="h-4 w-4" />
                            {teamName} ({membersCount} Students)
                          </span>
                          <span className="flex items-center gap-1.5 border-l border-border/50 pl-4 text-foreground">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            ${Number(project.budget).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="md:text-right flex flex-col md:items-end gap-2">
                        <Badge 
                          variant={project.status === "Mentor QA" ? "default" : "secondary"} 
                          className={`uppercase tracking-wider text-[10px] px-3 py-1 font-bold ${project.status === "Mentor QA" ? "bg-amber-500 text-white hover:bg-amber-600 shadow-sm" : "bg-muted/50 border border-border/50"}`}
                        >
                          {project.status}
                        </Badge>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground mt-2">
                          <Clock className="h-3.5 w-3.5" />
                          {project.deadline ? `Due ${format(new Date(project.deadline), 'MMM dd, yyyy')}` : 'No deadline'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-background border border-border/50 rounded-xl p-4 mt-6">
                      <div className="flex items-center justify-between text-xs font-bold mb-2">
                        <span className="text-muted-foreground uppercase tracking-wider">Milestone Completion</span>
                        <span className={progress === 100 ? "text-emerald-500" : "text-foreground"}>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2 bg-muted/50 mb-4" />
                      <div className="flex gap-3 justify-end border-t border-border/50 pt-4 mt-2">
                        <Button variant="outline" size="sm" className="font-semibold">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Message Team
                        </Button>
                        <Button size="sm" className="font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">View Workboard <ChevronRight className="ml-1 h-4 w-4" /></Button>
                      </div>
                    </div>
                  </div>
                )})}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: QA Submissions & Activity */}
        <div className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
            <CardHeader className="bg-blue-500/5 border-b border-blue-500/10 pb-4">
              <CardTitle className="text-blue-600 dark:text-blue-400 flex items-center gap-2">
                <FileCheck className="h-5 w-5" />
                Quality Assurance Deliverables
              </CardTitle>
              <CardDescription>Review milestones approved by Mentors</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {allQaSubmissions.length === 0 ? (
                  <div className="p-6 text-center text-sm text-muted-foreground font-medium">No QA submissions found.</div>
                ) : allQaSubmissions.slice(0, 5).map((submission: any, i: number) => (
                  <div key={i} className="p-5 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-bold bg-muted/50">{submission.status}</Badge>
                      <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {formatDistanceToNow(new Date(submission.updated_at), { addSuffix: true })}</span>
                    </div>
                    <div className="font-bold text-foreground text-sm mb-1">{submission.title}</div>
                    <div className="text-xs font-medium text-muted-foreground flex items-center gap-2 mb-4">
                      <span className="truncate max-w-[100px]">{submission.projectName}</span>
                      <span className="h-1 w-1 rounded-full bg-border" />
                      <span className="text-emerald-500 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> {submission.teamName}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="w-full text-xs font-semibold" onClick={() => submission.asset_url && window.open(submission.asset_url, '_blank')}>
                        <DownloadCloud className="mr-2 h-3.5 w-3.5" /> Fetch Assets
                      </Button>
                      <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm text-xs font-semibold">Client Review</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
            <CardHeader className="pb-4 border-b border-border/50">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-emerald-500" /> Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {recentActivities.length === 0 ? (
                <div className="text-center text-sm text-muted-foreground font-medium py-4">No recent activity.</div>
              ) : recentActivities.map((activity: any, i: number) => (
                <div key={i} className="flex gap-4">
                  <div className={`h-8 w-8 rounded-full ${activity.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <activity.icon className={`h-4 w-4 ${activity.color}`} />
                  </div>
                  <div>
                    <div className="text-sm">
                      <span className="font-semibold text-foreground">{activity.user}</span>{" "}
                      <span className="text-muted-foreground">{activity.action}</span>{" "}
                      <span className="font-medium text-foreground">{activity.project}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 font-medium">
                      {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
}
