import { BookOpen, Code, Layout, FileText, Users, Settings, Home, Trophy, TrendingUp, Clock, CheckCircle, AlertCircle, Github, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { DashboardLayout } from "../components/dashboard-layout";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const skillProgressData = [
  { name: "Week 1", progress: 20 },
  { name: "Week 2", progress: 35 },
  { name: "Week 3", progress: 52 },
  { name: "Week 4", progress: 68 },
  { name: "Week 5", progress: 75 },
  { name: "Week 6", progress: 85 },
];

const skillDistribution = [
  { name: "Frontend", value: 40, color: "#3b82f6" },
  { name: "Backend", value: 30, color: "#8b5cf6" },
  { name: "Database", value: 20, color: "#06b6d4" },
  { name: "DevOps", value: 10, color: "#10b981" },
];

function Sidebar() {
  const menuItems = [
    { icon: Home, label: "Dashboard", active: true },
    { icon: BookOpen, label: "Learning Portal" },
    { icon: FileText, label: "Exams" },
    { icon: Layout, label: "Projects" },
    { icon: Users, label: "Mentors" },
    { icon: Trophy, label: "Achievements" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Code className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="font-semibold">SkillForge</div>
            <div className="text-xs text-muted-foreground">Student Portal</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item, i) => (
          <Button
            key={i}
            variant={item.active ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <item.icon className="mr-3 h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>
      <div className="p-4 border-t">
        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-4">
            <div className="text-sm font-medium mb-1">Upgrade to Pro</div>
            <div className="text-xs text-muted-foreground mb-3">Get unlimited access to all features</div>
            <Button size="sm" className="w-full bg-gradient-to-r from-primary to-secondary">
              Upgrade Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  return (
    <DashboardLayout sidebar={<Sidebar />} title="Student Dashboard">
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-muted-foreground">Skill Level</div>
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-1">Level B</div>
              <Badge className="bg-primary/20 text-primary border-0 hover:bg-primary/30">
                Intermediate
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-muted-foreground">Reputation Score</div>
                <TrendingUp className="h-5 w-5 text-secondary" />
              </div>
              <div className="text-3xl font-bold mb-1">8.7</div>
              <div className="text-xs text-muted-foreground">Top 15% this month</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-muted-foreground">Active Projects</div>
                <Layout className="h-5 w-5 text-accent" />
              </div>
              <div className="text-3xl font-bold mb-1">3</div>
              <div className="text-xs text-muted-foreground">2 pending submission</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-muted-foreground">Completed Courses</div>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold mb-1">12</div>
              <div className="text-xs text-muted-foreground">85% completion rate</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
              <CardDescription>Your skill development over the past 6 weeks</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={skillProgressData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Line type="monotone" dataKey="progress" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skill Distribution</CardTitle>
              <CardDescription>Your expertise across different domains</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={skillDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {skillDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Active Projects</CardTitle>
                <CardDescription>Projects you're currently working on</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "E-commerce Website", client: "TechStart Inc.", progress: 75, status: "In Progress", deadline: "5 days" },
                  { name: "Mobile App UI/UX", client: "DesignHub", progress: 45, status: "In Progress", deadline: "12 days" },
                  { name: "Database Migration", client: "DataCorp", progress: 90, status: "Review", deadline: "2 days" },
                ].map((project, i) => (
                  <div key={i} className="p-4 border rounded-lg hover:shadow-md transition-all bg-card/50">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-semibold">{project.name}</div>
                        <div className="text-sm text-muted-foreground">{project.client}</div>
                      </div>
                      <Badge variant={project.status === "Review" ? "default" : "secondary"}>
                        {project.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Deadline in {project.deadline}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Exams</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { subject: "Advanced JavaScript", date: "May 15, 2026", time: "10:00 AM" },
                  { subject: "React Architecture", date: "May 20, 2026", time: "2:00 PM" },
                ].map((exam, i) => (
                  <div key={i} className="p-3 border rounded-lg bg-muted/30">
                    <div className="font-medium text-sm mb-1">{exam.subject}</div>
                    <div className="text-xs text-muted-foreground">{exam.date}</div>
                    <div className="text-xs text-muted-foreground">{exam.time}</div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" size="sm">
                  View All Exams
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mentor Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary">SK</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Sarah Kumar</div>
                    <div className="text-xs text-muted-foreground mb-1">Senior Mentor</div>
                    <div className="text-sm bg-muted/50 p-2 rounded">
                      Great work on the API integration! Focus on error handling next.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Github className="h-5 w-5 text-primary mt-1" />
                  <div className="flex-1">
                    <div className="font-medium mb-1">Portfolio Integration</div>
                    <div className="text-sm text-muted-foreground mb-3">
                      Connect your GitHub to showcase your work
                    </div>
                    <Button size="sm" className="w-full">
                      <ExternalLink className="mr-2 h-3 w-3" />
                      Connect GitHub
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
