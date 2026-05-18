import { useState, useEffect } from "react";
import { Layout, Trophy, TrendingUp, Clock, CheckCircle, Target, Award, Star, Shield, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Progress } from "../../../components/ui/progress";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { JourneyTimeline } from "./JourneyTimeline";
import { useAuthStore } from "../../../store/useAuthStore";
import { api } from "../../../services/api.client";

const skillProgressData = [
  { name: "Week 1", progress: 20 },
  { name: "Week 2", progress: 35 },
  { name: "Week 3", progress: 52 },
  { name: "Week 4", progress: 68 },
  { name: "Week 5", progress: 75 },
  { name: "Week 6", progress: 85 },
];

const skillDistribution = [
  { name: "Frontend", value: 40, color: "#4f46e5" }, // indigo-600
  { name: "Backend", value: 30, color: "#8b5cf6" }, // violet-500
  { name: "Database", value: 20, color: "#0ea5e9" }, // sky-500
  { name: "DevOps", value: 10, color: "#10b981" }, // emerald-500
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
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export function StudentOverview() {
  const { user } = useAuthStore();
  const currentLevel = user?.studentLevel || 'D';
  
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await api.get('/analytics/student/me');
        if (res.data.success) {
          setAnalytics(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch student analytics", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  // Helper to determine badge color based on level
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'A': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'B': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'C': return 'text-violet-500 bg-violet-500/10 border-violet-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getLevelTitle = (level: string) => {
    switch (level) {
      case 'A': return 'Project Ready';
      case 'B': return 'Qualification Phase';
      case 'C': return 'Domain Specialization';
      default: return 'Foundation Phase';
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={fadeIn}>
        <JourneyTimeline currentLevel={currentLevel} />
      </motion.div>

      <motion.div variants={fadeIn} className="grid gap-6 md:grid-cols-4">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none">
              <Shield className="h-24 w-24" />
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Current Phase</div>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="text-3xl font-extrabold mb-2 text-foreground tracking-tight">Level {currentLevel}</div>
            <Badge className={`border px-2.5 py-0.5 rounded-full font-medium ${getLevelColor(currentLevel)} hover:${getLevelColor(currentLevel)}`}>
              {getLevelTitle(currentLevel)}
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none text-emerald-500">
              <Target className="h-24 w-24" />
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Trust Score</div>
              <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Target className="h-4 w-4 text-emerald-500" />
              </div>
            </div>
            <div className="text-3xl font-extrabold mb-2 text-foreground tracking-tight">
              {isLoading ? <Loader2 className="animate-spin h-6 w-6" /> : `${analytics?.current_trust_score || 0}/100`}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-500">
              <TrendingUp className="h-3.5 w-3.5" /> High Reliability
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none text-violet-500">
              <Layout className="h-24 w-24" />
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Active Projects</div>
              <div className="h-8 w-8 rounded-full bg-violet-500/10 flex items-center justify-center">
                <Layout className="h-4 w-4 text-violet-500" />
              </div>
            </div>
            <div className="text-3xl font-extrabold mb-2 text-foreground tracking-tight">2</div>
            <div className="text-xs font-medium text-muted-foreground">1 pending client review</div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none text-blue-500">
              <Award className="h-24 w-24" />
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Assignments</div>
              <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-blue-500" />
              </div>
            </div>
            <div className="text-3xl font-extrabold mb-2 text-foreground tracking-tight">
              {isLoading ? <Loader2 className="animate-spin h-6 w-6" /> : (analytics?.total_exams_taken || 0)}
            </div>
            <div className="text-xs font-medium text-muted-foreground">
              Avg Score: {isLoading ? '-' : (analytics?.average_exam_score || 0)}%
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={fadeIn} className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Skill Acquisition Rate</CardTitle>
            <CardDescription>Your technical progression over the past 6 weeks</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={skillProgressData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-xs font-medium fill-muted-foreground" dy={10} />
                <YAxis axisLine={false} tickLine={false} className="text-xs font-medium fill-muted-foreground" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="progress" 
                  stroke="#4f46e5" 
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 0 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Domain Specialization</CardTitle>
            <CardDescription>Your expertise distributed across core tracks</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={skillDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {skillDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              {skillDistribution.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name} ({item.value}%)
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={fadeIn} className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Active Client Projects</CardTitle>
                <CardDescription>Real-world projects under mentor supervision</CardDescription>
              </div>
              <Button variant="outline" size="sm">View All</Button>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {[
                { name: "SaaS Dashboard Redesign", client: "Acme Corp", progress: 75, status: "In Progress", deadline: "5 days", priority: "high" },
                { name: "Auth API Integration", client: "TechFlow", progress: 90, status: "Mentor Review", deadline: "2 days", priority: "medium" },
              ].map((project, i) => (
                <div key={i} className="p-5 border border-border/50 rounded-xl hover:bg-muted/30 transition-colors bg-background/50">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-4">
                    <div>
                      <div className="font-bold text-foreground text-lg">{project.name}</div>
                      <div className="text-sm font-medium text-muted-foreground flex items-center gap-2 mt-1">
                        {project.client}
                        <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold ${project.priority === 'high' ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'}`}>
                          {project.priority} priority
                        </span>
                      </div>
                    </div>
                    <Badge variant={project.status === "Mentor Review" ? "default" : "secondary"} className="w-max">
                      {project.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm font-medium">
                      <span className="text-foreground">Execution Progress</span>
                      <span className="text-primary">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2.5 bg-muted/50" />
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mt-2">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Deadline in {project.deadline}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Mentor Feedback</CardTitle>
              <CardDescription>Recent evaluations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { mentor: "Rajesh Kumar", role: "Senior Frontend", rating: 5, date: "2 days ago", comment: "Excellent component architecture. Clean code." },
                { mentor: "Sarah Chen", role: "Backend Lead", rating: 4, date: "1 week ago", comment: "Good API design, but remember to add rate limiting." },
              ].map((feedback, i) => (
                <div key={i} className="p-4 border border-border/50 rounded-xl bg-background/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-bold text-sm">{feedback.mentor}</div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className={`h-3 w-3 ${j < feedback.rating ? 'fill-yellow-500 text-yellow-500' : 'text-muted'}`} />
                      ))}
                    </div>
                  </div>
                  <div className="text-xs font-medium text-muted-foreground mb-2">{feedback.role} • {feedback.date}</div>
                  <p className="text-sm text-foreground/80 italic leading-relaxed">"{feedback.comment}"</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
}
