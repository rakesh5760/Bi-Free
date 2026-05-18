import { Users, UserCheck, FileText, Shield, CheckCircle, AlertTriangle, Briefcase, ArrowRight, UserPlus, Clock, Target } from "lucide-react";
import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
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

export function FacultyOverview() {
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
              <Users className="h-24 w-24" />
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total Students</div>
              <div className="h-8 w-8 rounded-full bg-indigo-500/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-indigo-500" />
              </div>
            </div>
            <div className="text-3xl font-extrabold mb-2 text-foreground tracking-tight">215</div>
            <div className="text-xs font-medium text-indigo-500 flex items-center gap-1">+23 this month</div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none">
              <UserCheck className="h-24 w-24" />
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Active Mentors</div>
              <div className="h-8 w-8 rounded-full bg-cyan-500/10 flex items-center justify-center">
                <UserCheck className="h-4 w-4 text-cyan-500" />
              </div>
            </div>
            <div className="text-3xl font-extrabold mb-2 text-foreground tracking-tight">38</div>
            <div className="text-xs font-medium text-cyan-500">2 pending approval</div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none">
              <FileText className="h-24 w-24" />
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Active Projects</div>
              <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                <FileText className="h-4 w-4 text-blue-500" />
              </div>
            </div>
            <div className="text-3xl font-extrabold mb-2 text-foreground tracking-tight">127</div>
            <div className="text-xs font-medium text-amber-500">15 need allocation</div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none">
              <CheckCircle className="h-24 w-24" />
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Completion Rate</div>
              <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
              </div>
            </div>
            <div className="text-3xl font-extrabold mb-2 text-foreground tracking-tight">87%</div>
            <div className="text-xs font-medium text-emerald-500 flex items-center gap-1">+5% from last month</div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={fadeIn} className="grid gap-6 lg:grid-cols-3">
        
        {/* Main Action Queue */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="bg-indigo-500/5 border-b border-indigo-500/10 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                    <Briefcase className="h-5 w-5" />
                    Pending Project Allocations
                  </CardTitle>
                  <CardDescription>Client projects awaiting Mentor and Team assignment</CardDescription>
                </div>
                <Badge className="bg-indigo-500 text-white hover:bg-indigo-600 shadow-sm px-3 py-1 text-xs">2 Action Required</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {[
                  { client: "TechStart Corp", project: "E-commerce Backend Refactor", requiredSkills: ["Node.js", "PostgreSQL"], budget: "$4,500", submitted: "2h ago", priority: "high" },
                  { client: "DesignHub Inc", project: "Dashboard UI Migration", requiredSkills: ["React", "Tailwind"], budget: "$3,200", submitted: "5h ago", priority: "medium" },
                ].map((project, i) => (
                  <div key={i} className="p-6 hover:bg-muted/30 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-bold bg-background shadow-sm border-border/50">{project.client}</Badge>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1"><Clock className="h-3 w-3" /> {project.submitted}</span>
                          {project.priority === 'high' && (
                            <Badge variant="outline" className="text-[10px] uppercase tracking-wider border-orange-500/30 text-orange-500 bg-orange-500/10">High Priority</Badge>
                          )}
                        </div>
                        <h3 className="text-xl font-extrabold text-foreground">{project.project}</h3>
                      </div>
                      <div className="sm:text-right">
                        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Project Budget</div>
                        <div className="font-bold text-lg text-emerald-500">{project.budget}</div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-3">Required Technical Stack</span>
                      <div className="inline-flex gap-2 mt-2 sm:mt-0">
                        {project.requiredSkills.map(skill => (
                          <Badge key={skill} variant="secondary" className="text-xs font-semibold bg-muted/50 border border-border/50">{skill}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="bg-background/80 border border-border/50 rounded-xl p-5 space-y-5 shadow-inner">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="text-sm font-bold flex items-center gap-3 text-foreground">
                          <div className="h-8 w-8 rounded bg-indigo-500/10 flex items-center justify-center">
                            <UserCheck className="h-4 w-4 text-indigo-500" />
                          </div>
                          Step 1: Assign Supervising Mentor
                        </div>
                        <Select defaultValue="unassigned">
                          <SelectTrigger className="w-full sm:w-[240px] h-10 font-medium bg-card">
                            <SelectValue placeholder="Select Mentor" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unassigned" disabled>Select Mentor...</SelectItem>
                            <SelectItem value="m1">Sarah Kumar (Backend Expert)</SelectItem>
                            <SelectItem value="m2">Rajesh Mehta (Fullstack)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5 border-t border-border/50">
                        <div className="text-sm font-bold flex items-center gap-3 text-foreground">
                          <div className="h-8 w-8 rounded bg-cyan-500/10 flex items-center justify-center">
                            <Users className="h-4 w-4 text-cyan-500" />
                          </div>
                          Step 2: Select Level A Students
                        </div>
                        <Button size="sm" variant="outline" className="h-10 font-semibold border-cyan-500/30 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500 hover:text-white transition-colors">
                          <UserPlus className="h-4 w-4 mr-2" /> Browse Eligible Pool
                        </Button>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 font-bold h-11 px-6">
                        Finalize Allocation & Deploy <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
            <CardHeader className="border-b border-border/50 pb-4">
              <CardTitle>Active Supervised Projects</CardTitle>
              <CardDescription>Monitor ongoing mentor-led client engagements</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <Tabs defaultValue="active">
                <TabsList className="mb-4 bg-muted/50 border border-border/50">
                  <TabsTrigger value="active">Active Execution (12)</TabsTrigger>
                  <TabsTrigger value="review">Final Review (3)</TabsTrigger>
                </TabsList>
                <TabsContent value="active" className="space-y-4">
                  {[
                    { project: "Mobile App Wireframes", mentor: "Sarah Kumar", students: 2, progress: 65, status: "On Track" },
                    { project: "Database Optimization", mentor: "Arjun Nair", students: 3, progress: 30, status: "At Risk" },
                  ].map((active, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-border/50 rounded-xl bg-background/50 hover:shadow-md transition-all gap-4">
                      <div className="flex-1">
                        <div className="font-bold text-foreground mb-2">{active.project}</div>
                        <div className="text-xs font-medium text-muted-foreground flex flex-wrap items-center gap-4">
                          <span className="flex items-center gap-1.5"><UserCheck className="h-3.5 w-3.5" /> {active.mentor}</span>
                          <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {active.students} Assigned</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={active.status === "On Track" ? "default" : "destructive"} className={`uppercase tracking-wider text-[10px] px-2 py-0.5 ${active.status === "On Track" ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20" : "bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20"} border`}>
                          {active.status}
                        </Badge>
                        <Button size="sm" variant="ghost" className="font-semibold text-muted-foreground hover:text-foreground">Manage</Button>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Escalations & Quick Filters */}
        <div className="space-y-6">
          <Card className="border-destructive/30 shadow-lg shadow-destructive/5 bg-destructive/5">
            <CardHeader className="border-b border-destructive/10 pb-4">
              <CardTitle className="text-destructive flex items-center gap-2 text-lg">
                <div className="relative flex h-3 w-3 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
                </div>
                Escalation Hub
              </CardTitle>
              <CardDescription className="text-destructive/80 font-medium">Requires immediate faculty intervention</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-destructive/10">
                {[
                  { type: "Mentor Alert", issue: "Student Sneha missing milestones", project: "DB Opt", time: "45m ago" },
                  { type: "Client Dispute", issue: "Scope change requested", project: "App Wireframes", time: "2h ago" },
                ].map((alert, i) => (
                  <div key={i} className="p-5 hover:bg-destructive/10 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="destructive" className="text-[10px] uppercase tracking-wider border-destructive/20 bg-destructive/10 text-destructive">{alert.type}</Badge>
                      <span className="text-[10px] font-bold text-destructive/70 flex items-center gap-1"><Clock className="h-3 w-3" /> {alert.time}</span>
                    </div>
                    <div className="text-sm font-bold text-foreground mb-1 leading-tight">{alert.issue}</div>
                    <div className="text-xs font-medium text-muted-foreground flex items-center gap-1.5"><Shield className="h-3 w-3" /> {alert.project}</div>
                    <Button size="sm" className="w-full mt-4 h-9 font-bold bg-destructive text-white hover:bg-destructive/90 shadow-md shadow-destructive/20">
                      Acknowledge & Resolve
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
            <CardHeader className="pb-4 border-b border-border/50">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-indigo-500" /> Administrative Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <Button variant="outline" className="w-full justify-start h-12 font-semibold">
                <UserPlus className="mr-3 h-4 w-4 text-muted-foreground" /> Invite New Mentor
              </Button>
              <Button variant="outline" className="w-full justify-start h-12 font-semibold">
                <Target className="mr-3 h-4 w-4 text-muted-foreground" /> Review Level A Candidates
              </Button>
              <Button variant="outline" className="w-full justify-start h-12 font-semibold">
                <FileText className="mr-3 h-4 w-4 text-muted-foreground" /> Generate Compliance Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
}
