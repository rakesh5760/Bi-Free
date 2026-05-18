import { Briefcase, MessageSquare, Clock, DollarSign, Users, CheckCircle, ChevronRight, Activity, DownloadCloud, FileCheck } from "lucide-react";
import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Progress } from "../../../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";

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
            <div className="text-3xl font-extrabold mb-2 text-foreground tracking-tight">8</div>
            <div className="text-xs font-medium text-emerald-500">3 in progress</div>
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
            <div className="text-3xl font-extrabold mb-2 text-foreground tracking-tight">$12,450</div>
            <div className="text-xs font-medium text-muted-foreground">This quarter</div>
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
            <div className="text-3xl font-extrabold mb-2 text-foreground tracking-tight">24</div>
            <div className="text-xs font-medium text-indigo-500">95% success rate</div>
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
            <div className="text-3xl font-extrabold mb-2 text-foreground tracking-tight">5</div>
            <div className="text-xs font-medium text-muted-foreground">18 team members</div>
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
                  <CardTitle className="text-xl">Active Supervised Projects</CardTitle>
                  <CardDescription>Track deliverables for your mentor-supervised teams</CardDescription>
                </div>
                <Tabs defaultValue="all" className="w-auto">
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
                {[
                  { title: "E-commerce Website Development", team: "Team Alpha", mentor: "Sarah Kumar", members: 3, progress: 75, status: "In Execution", deadline: "May 18, 2026", budget: "$3,500" },
                  { title: "Mobile App UI/UX Design", team: "Team Beta", mentor: "Vikram Mehta", members: 2, progress: 45, status: "In Execution", deadline: "May 25, 2026", budget: "$2,800" },
                  { title: "Database Migration & Optimization", team: "Team Gamma", mentor: "Priya Sharma", members: 4, progress: 90, status: "Mentor QA", deadline: "May 15, 2026", budget: "$4,200" },
                ].map((project, i) => (
                  <div key={i} className="p-6 hover:bg-muted/30 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="outline" className="bg-background text-foreground text-[10px] uppercase tracking-wider font-bold shadow-sm">Supervised Build</Badge>
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] uppercase tracking-wider border-emerald-500/20 flex items-center gap-1 font-bold">
                            <CheckCircle className="h-3 w-3" /> Mentor: {project.mentor}
                          </Badge>
                        </div>
                        <h3 className="font-extrabold text-lg mb-2 text-foreground">{project.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
                          <span className="flex items-center gap-1.5">
                            <Users className="h-4 w-4" />
                            {project.team} ({project.members} Students)
                          </span>
                          <span className="flex items-center gap-1.5 border-l border-border/50 pl-4 text-foreground">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            {project.budget}
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
                          Due {project.deadline}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-background border border-border/50 rounded-xl p-4 mt-6">
                      <div className="flex items-center justify-between text-xs font-bold mb-2">
                        <span className="text-muted-foreground uppercase tracking-wider">Milestone Completion</span>
                        <span className={project.progress === 100 ? "text-emerald-500" : "text-foreground"}>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2 bg-muted/50 mb-4" />
                      <div className="flex gap-3 justify-end border-t border-border/50 pt-4 mt-2">
                        <Button variant="outline" size="sm" className="font-semibold">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Message Team
                        </Button>
                        <Button size="sm" className="font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">View Workboard <ChevronRight className="ml-1 h-4 w-4" /></Button>
                      </div>
                    </div>
                  </div>
                ))}
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
                {[
                  { project: "E-commerce Backend API", team: "Team Alpha", mentor: "Sarah Kumar", submitted: "2h ago", type: "Milestone 3" },
                  { project: "Mobile Wireframes v2", team: "Team Beta", mentor: "Vikram Mehta", submitted: "5h ago", type: "Design Review" },
                ].map((submission, i) => (
                  <div key={i} className="p-5 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-bold bg-muted/50">{submission.type}</Badge>
                      <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {submission.submitted}</span>
                    </div>
                    <div className="font-bold text-foreground text-sm mb-1">{submission.project}</div>
                    <div className="text-xs font-medium text-muted-foreground flex items-center gap-2 mb-4">
                      <span>{submission.team}</span>
                      <span className="h-1 w-1 rounded-full bg-border" />
                      <span className="text-emerald-500 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> QA Passed</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="w-full text-xs font-semibold">
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
              {[
                { user: "Sarah Kumar", action: "approved a pull request for", project: "Database Migration", time: "1 hour ago", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                { user: "Team Alpha", action: "completed task 'Authentication'", project: "E-commerce Website", time: "3 hours ago", icon: Briefcase, color: "text-blue-500", bg: "bg-blue-500/10" },
                { user: "Vikram Mehta", action: "left feedback on", project: "Mobile App UI", time: "Yesterday", icon: MessageSquare, color: "text-amber-500", bg: "bg-amber-500/10" },
              ].map((activity, i) => (
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
                    <div className="text-xs text-muted-foreground mt-1 font-medium">{activity.time}</div>
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
