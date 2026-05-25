import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Users, FileText, TrendingUp, Award, ArrowRight, Activity, CalendarCheck, CheckCircle2, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Progress } from "../../../components/ui/progress";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { api } from "../../../services/api.client";

const performanceData = [
  { name: "Jan", students: 8 },
  { name: "Feb", students: 12 },
  { name: "Mar", students: 15 },
  { name: "Apr", students: 18 },
  { name: "May", students: 22 },
];

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

export function MentorOverview() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<any>(null);
  const [allocations, setAllocations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [analyticsRes, allocationsRes] = await Promise.all([
          api.get('/analytics/mentor/me'),
          api.get('/mentors/allocations/me')
        ]);
        if (analyticsRes.data.success) {
          setAnalytics(analyticsRes.data.data);
        }
        if (allocationsRes.data.success) {
          setAllocations(allocationsRes.data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch mentor data", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const total = (analytics?.total_active_allocations || 0) + (analytics?.total_completed_allocations || 0);
  const successRate = total > 0 ? Math.round((analytics.total_completed_allocations / total) * 100) : 100;

  // Extract assigned students from allocations
  const assignedStudents = allocations.flatMap(a => 
    (a.allocation?.team_members || []).map((m: any) => ({
      name: m.student_name || "Unknown Student",
      project_id: a.project_id,
      created_at: m.created_at,
      progress: Math.floor(Math.random() * 50) + 40, // Mock progress for visual
      status: "On Track"
    }))
  );

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
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total Active Allocations</div>
              <div className="h-8 w-8 rounded-full bg-violet-500/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-violet-500" />
              </div>
            </div>
            <div className="text-3xl font-extrabold mb-2 text-foreground tracking-tight">
              {isLoading ? <Loader2 className="animate-spin h-6 w-6" /> : (analytics?.total_active_allocations || 0)}
            </div>
            <div className="text-xs font-medium text-violet-500 flex items-center gap-1"><TrendingUp className="h-3 w-3" /> +1 this month</div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none">
              <FileText className="h-24 w-24" />
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Completed Allocations</div>
              <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                <FileText className="h-4 w-4 text-blue-500" />
              </div>
            </div>
            <div className="text-3xl font-extrabold mb-2 text-foreground tracking-tight">
              {isLoading ? <Loader2 className="animate-spin h-6 w-6" /> : (analytics?.total_completed_allocations || 0)}
            </div>
            <div className="text-xs font-medium text-blue-500">Graduated Teams</div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none">
              <CheckCircle2 className="h-24 w-24" />
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Success Rate</div>
              <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
            </div>
            <div className="text-3xl font-extrabold mb-2 text-foreground tracking-tight">
              {isLoading ? <Loader2 className="animate-spin h-6 w-6" /> : `${successRate}%`}
            </div>
            <div className="text-xs font-medium text-emerald-500">Based on completions</div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none">
              <Award className="h-24 w-24" />
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Tasks Reviewed</div>
              <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Award className="h-4 w-4 text-amber-500" />
              </div>
            </div>
            <div className="text-3xl font-extrabold mb-2 text-foreground tracking-tight">
              {isLoading ? <Loader2 className="animate-spin h-6 w-6" /> : (analytics?.total_tasks_reviewed || 0)}
            </div>
            <div className="text-xs font-medium text-amber-500">Feedback delivered</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts and Schedule */}
      <motion.div variants={fadeIn} className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Mentorship Capacity</CardTitle>
              <CardDescription>Active student load over the last 5 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-xs font-medium fill-muted-foreground" dy={10} />
                  <YAxis axisLine={false} tickLine={false} className="text-xs font-medium fill-muted-foreground" />
                  <Tooltip 
                    cursor={{ fill: 'hsl(var(--muted)/0.3)' }}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                  />
                  <Bar dataKey="students" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-3 border-b border-border/50">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalendarCheck className="h-5 w-5 text-violet-500" /> Today's Schedule
              </CardTitle>
              <Badge className="bg-violet-500 hover:bg-violet-600">3 Sessions</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {[
                { student: "Priya Sharma", topic: "React Architecture Patterns", time: "2:00 PM", duration: "45m", status: "next" },
                { student: "Rahul Singh", topic: "Backend API Code Review", time: "4:30 PM", duration: "30m", status: "upcoming" },
                { student: "Anjali Patel", project: "Career & Portfolio Guidance", time: "5:15 PM", duration: "60m", status: "upcoming" },
              ].map((session, i) => (
                <div key={i} className={`p-4 hover:bg-muted/30 transition-colors ${session.status === 'next' ? 'bg-violet-500/5' : ''}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-bold text-foreground text-sm">{session.student}</div>
                    <Badge variant="outline" className={`text-[10px] uppercase tracking-wider ${session.status === 'next' ? 'border-violet-500/30 text-violet-500 bg-violet-500/10' : 'text-muted-foreground'}`}>
                      {session.time}
                    </Badge>
                  </div>
                  <div className="text-xs font-medium text-muted-foreground line-clamp-1">{session.topic || session.project}</div>
                  {session.status === 'next' && (
                    <Button size="sm" className="w-full mt-3 bg-violet-500 hover:bg-violet-600 text-white shadow-sm h-8 text-xs">
                      Join Call Room
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Student Data Table & Reviews */}
      <motion.div variants={fadeIn} className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm h-full">
            <CardHeader className="border-b border-border/50 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Assigned Cohort</CardTitle>
                  <CardDescription>Operational view of your active students</CardDescription>
                </div>
                <Tabs defaultValue="all" className="w-auto">
                  <TabsList className="bg-muted/50 border border-border/50">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="review">Needs Review</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {isLoading ? (
                  <div className="p-8 flex justify-center"><Loader2 className="animate-spin h-6 w-6 text-violet-500" /></div>
                ) : assignedStudents.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground font-medium">No students assigned yet.</div>
                ) : assignedStudents.map((student: any, i: number) => (
                  <div key={i} className="p-4 hover:bg-muted/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-[200px]">
                      <Avatar className="h-10 w-10 border border-border/50 shadow-sm">
                        <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-500 text-white font-bold text-xs">
                          {student.name.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-bold text-sm text-foreground">{student.name}</div>
                        <div className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                          Project #{student.project_id}
                          <span className="h-1 w-1 rounded-full bg-border" />
                          Joined {new Date(student.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 w-full sm:w-auto px-0 sm:px-4">
                      <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                        <span className="text-muted-foreground uppercase tracking-wider text-[10px]">Incubation Progress</span>
                        <span className="text-foreground">{student.progress}%</span>
                      </div>
                      <Progress value={student.progress} className="h-2 bg-muted/50" />
                    </div>

                    <div className="flex items-center gap-4 min-w-[140px] justify-end">
                      <Badge
                        variant={student.status === "Excellent" ? "default" : student.status === "At Risk" ? "destructive" : "secondary"}
                        className={`
                          ${student.status === 'Excellent' ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20' : ''}
                          ${student.status === 'At Risk' ? 'bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20' : ''}
                          border uppercase tracking-wider text-[10px]
                        `}
                      >
                        {student.status}
                      </Badge>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm h-full">
            <CardHeader className="bg-muted/20 border-b border-border/50 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" /> Allocated Projects
              </CardTitle>
              <CardDescription>Your currently supervised projects</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {isLoading ? (
                  <div className="p-8 flex justify-center"><Loader2 className="animate-spin h-6 w-6 text-blue-500" /></div>
                ) : allocations.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground font-medium">No allocated projects.</div>
                ) : allocations.map((project: any, i: number) => (
                  <div key={i} className="p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline" className="text-[10px] uppercase tracking-wider border-0 px-2 py-0.5 bg-blue-500/10 text-blue-500">
                        {project.domain?.name || "Web Dev"}
                      </Badge>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">{project.status}</span>
                    </div>
                    <div className="font-bold text-sm text-foreground mb-1">{project.title}</div>
                    <div className="text-xs font-medium text-muted-foreground mb-4">Team Name: {project.allocation?.team_name || "Unknown"}</div>
                    <Button 
                      size="sm" 
                      className="w-full h-8 text-xs font-bold shadow-sm" 
                      variant="default"
                      onClick={() => navigate(`/projects?id=${project.project_id}`)}
                    >
                      Manage Project
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
}
