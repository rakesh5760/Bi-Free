import { TrendingUp, Users, Briefcase, GraduationCap, Target, Award, BarChart3, Home, Settings, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const studentGrowthData = [
  { month: "Jan", students: 120, active: 95 },
  { month: "Feb", students: 145, active: 118 },
  { month: "Mar", students: 168, active: 142 },
  { month: "Apr", students: 192, active: 165 },
  { month: "May", students: 215, active: 188 },
];

const skillLevelData = [
  { level: "Level A", count: 45, color: "#3b82f6" },
  { level: "Level B", count: 78, color: "#8b5cf6" },
  { level: "Level C", count: 62, color: "#06b6d4" },
  { level: "Level D", count: 30, color: "#10b981" },
];

const projectCompletionData = [
  { month: "Jan", completed: 42, ongoing: 28 },
  { month: "Feb", completed: 55, ongoing: 32 },
  { month: "Mar", completed: 68, ongoing: 38 },
  { month: "Apr", completed: 72, ongoing: 42 },
  { month: "May", completed: 85, ongoing: 45 },
];

const mentorEffectivenessData = [
  { mentor: "Sarah K.", rating: 4.9, students: 25 },
  { mentor: "Vikram M.", rating: 4.8, students: 22 },
  { mentor: "Arjun N.", rating: 4.7, students: 18 },
  { mentor: "Priya S.", rating: 4.6, students: 20 },
  { mentor: "Rakesh T.", rating: 4.5, students: 15 },
];

const placementData = [
  { category: "Placement Ready", value: 65, color: "#10b981" },
  { category: "In Training", value: 105, color: "#3b82f6" },
  { category: "Early Stage", value: 45, color: "#8b5cf6" },
];

function Sidebar() {
  const menuItems = [
    { icon: Home, label: "Dashboard" },
    { icon: BarChart3, label: "Analytics", active: true },
    { icon: Users, label: "Reports" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-2">
          <BarChart3 className="h-6 w-6 text-white" />
        </div>
        <div className="font-semibold">SkillForge</div>
        <div className="text-xs text-muted-foreground">Analytics Portal</div>
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
    </div>
  );
}

export default function AnalyticsDashboard() {
  return (
    <DashboardLayout sidebar={<Sidebar />} title="Analytics & Reports">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Select defaultValue="30">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-muted-foreground">Total Students</div>
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-1">215</div>
              <div className="flex items-center gap-1 text-xs">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-500">+12%</span>
                <span className="text-muted-foreground">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-muted-foreground">Active Projects</div>
                <Briefcase className="h-5 w-5 text-secondary" />
              </div>
              <div className="text-3xl font-bold mb-1">127</div>
              <div className="flex items-center gap-1 text-xs">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-500">+8%</span>
                <span className="text-muted-foreground">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-muted-foreground">Completion Rate</div>
                <Target className="h-5 w-5 text-accent" />
              </div>
              <div className="text-3xl font-bold mb-1">87%</div>
              <div className="flex items-center gap-1 text-xs">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-500">+5%</span>
                <span className="text-muted-foreground">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-muted-foreground">Avg. Rating</div>
                <Award className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold mb-1">4.7</div>
              <div className="flex items-center gap-1 text-xs">
                <span className="text-green-500">Excellent</span>
                <span className="text-muted-foreground">platform rating</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Student Growth Trend</CardTitle>
              <CardDescription>Total and active students over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={studentGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Area type="monotone" dataKey="students" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="active" stackId="2" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skill Level Distribution</CardTitle>
              <CardDescription>Student distribution across certification levels</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={skillLevelData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ level, count }) => `${level}: ${count}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {skillLevelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project Completion Metrics</CardTitle>
            <CardDescription>Completed vs ongoing projects by month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectCompletionData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Bar dataKey="completed" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="ongoing" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Mentor Effectiveness</CardTitle>
              <CardDescription>Top performing mentors by rating and student count</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mentorEffectivenessData.map((mentor, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg bg-card/50">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-medium">
                        {i + 1}
                      </div>
                      <div>
                        <div className="font-medium">{mentor.mentor}</div>
                        <div className="text-sm text-muted-foreground">{mentor.students} students</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <span key={j} className={`text-xs ${j < Math.floor(mentor.rating) ? 'text-yellow-400' : 'text-muted'}`}>★</span>
                        ))}
                      </div>
                      <Badge variant="secondary">{mentor.rating}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Placement Readiness</CardTitle>
              <CardDescription>Student categorization by career readiness</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={placementData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, value }) => `${category}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {placementData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {placementData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{item.category}</span>
                    </div>
                    <span className="font-medium">{item.value} students</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Key Performance Indicators</CardTitle>
            <CardDescription>Platform-wide metrics and insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="p-4 border rounded-lg bg-muted/30">
                <div className="text-sm text-muted-foreground mb-2">Average Project Duration</div>
                <div className="text-2xl font-bold mb-1">6.2 weeks</div>
                <div className="text-xs text-muted-foreground">Within target range</div>
              </div>
              <div className="p-4 border rounded-lg bg-muted/30">
                <div className="text-sm text-muted-foreground mb-2">Student Retention Rate</div>
                <div className="text-2xl font-bold mb-1">94%</div>
                <div className="text-xs text-green-500">Above industry average</div>
              </div>
              <div className="p-4 border rounded-lg bg-muted/30">
                <div className="text-sm text-muted-foreground mb-2">Mentor-Student Ratio</div>
                <div className="text-2xl font-bold mb-1">1:5.7</div>
                <div className="text-xs text-muted-foreground">Optimal range</div>
              </div>
              <div className="p-4 border rounded-lg bg-muted/30">
                <div className="text-sm text-muted-foreground mb-2">Average Skill Progress</div>
                <div className="text-2xl font-bold mb-1">+2.3 levels</div>
                <div className="text-xs text-muted-foreground">Per 6 months</div>
              </div>
              <div className="p-4 border rounded-lg bg-muted/30">
                <div className="text-sm text-muted-foreground mb-2">Client Satisfaction</div>
                <div className="text-2xl font-bold mb-1">4.6/5.0</div>
                <div className="text-xs text-green-500">Excellent rating</div>
              </div>
              <div className="p-4 border rounded-lg bg-muted/30">
                <div className="text-sm text-muted-foreground mb-2">Revenue Growth</div>
                <div className="text-2xl font-bold mb-1">+24%</div>
                <div className="text-xs text-green-500">Quarter over quarter</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
