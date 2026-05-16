import { Users, Calendar, FileText, TrendingUp, Home, Settings, MessageSquare, Award, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const performanceData = [
  { name: "Jan", students: 8 },
  { name: "Feb", students: 12 },
  { name: "Mar", students: 15 },
  { name: "Apr", students: 18 },
  { name: "May", students: 22 },
];

function Sidebar() {
  const menuItems = [
    { icon: Home, label: "Dashboard", active: true },
    { icon: Users, label: "My Students" },
    { icon: FileText, label: "Submissions" },
    { icon: Calendar, label: "Schedule" },
    { icon: MessageSquare, label: "Messages" },
    { icon: Award, label: "Achievements" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="font-semibold">SkillForge</div>
            <div className="text-xs text-muted-foreground">Mentor Portal</div>
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
    </div>
  );
}

export default function MentorDashboard() {
  return (
    <DashboardLayout sidebar={<Sidebar />} title="Mentor Dashboard">
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-muted-foreground">Total Students</div>
                <Users className="h-5 w-5 text-secondary" />
              </div>
              <div className="text-3xl font-bold mb-1">22</div>
              <div className="text-xs text-muted-foreground">+3 this month</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-muted-foreground">Active Projects</div>
                <FileText className="h-5 w-5 text-accent" />
              </div>
              <div className="text-3xl font-bold mb-1">15</div>
              <div className="text-xs text-muted-foreground">8 need review</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-muted-foreground">Success Rate</div>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold mb-1">92%</div>
              <div className="text-xs text-muted-foreground">Above average</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-muted-foreground">Mentor Rating</div>
                <Award className="h-5 w-5 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-1">4.8</div>
              <div className="text-xs text-muted-foreground">Based on 45 reviews</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Student Growth</CardTitle>
                <CardDescription>Number of students mentored over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Bar dataKey="students" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Sessions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { student: "Priya Sharma", topic: "React Patterns", time: "2:00 PM Today" },
                { student: "Rahul Singh", topic: "Code Review", time: "4:30 PM Today" },
                { student: "Anjali Patel", topic: "Career Guidance", time: "10:00 AM Tomorrow" },
              ].map((session, i) => (
                <div key={i} className="p-3 border rounded-lg bg-muted/30">
                  <div className="font-medium text-sm mb-1">{session.student}</div>
                  <div className="text-xs text-muted-foreground mb-1">{session.topic}</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {session.time}
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full" size="sm">
                View Full Schedule
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Assigned Students</CardTitle>
                <CardDescription>Monitor your students' progress and performance</CardDescription>
              </div>
              <Button variant="outline" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All Students</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="review">Need Review</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-4 mt-4">
                {[
                  { name: "Priya Sharma", level: "B", progress: 85, projects: 3, status: "On Track", lastActive: "2 hours ago" },
                  { name: "Rahul Singh", level: "C", progress: 72, projects: 2, status: "On Track", lastActive: "5 hours ago" },
                  { name: "Anjali Patel", level: "B", progress: 68, projects: 4, status: "Needs Attention", lastActive: "1 day ago" },
                  { name: "Vikram Reddy", level: "A", progress: 92, projects: 5, status: "Excellent", lastActive: "30 min ago" },
                ].map((student, i) => (
                  <div key={i} className="p-4 border rounded-lg hover:shadow-md transition-all bg-card/50">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{student.name}</div>
                          <div className="text-sm text-muted-foreground">Level {student.level} • {student.projects} active projects</div>
                        </div>
                      </div>
                      <Badge
                        variant={student.status === "Excellent" ? "default" : student.status === "Needs Attention" ? "destructive" : "secondary"}
                      >
                        {student.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Overall Progress</span>
                        <span className="font-medium">{student.progress}%</span>
                      </div>
                      <Progress value={student.progress} className="h-2" />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Last active: {student.lastActive}</span>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Pending Reviews</CardTitle>
              <CardDescription>Project submissions awaiting your feedback</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { student: "Priya Sharma", project: "E-commerce Backend", submitted: "2 hours ago", priority: "High" },
                { student: "Vikram Reddy", project: "Mobile App UI", submitted: "5 hours ago", priority: "Medium" },
                { student: "Anjali Patel", project: "Data Visualization Dashboard", submitted: "1 day ago", priority: "High" },
              ].map((review, i) => (
                <div key={i} className="p-4 border rounded-lg hover:shadow-md transition-all bg-muted/30">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{review.project}</div>
                      <div className="text-xs text-muted-foreground">by {review.student}</div>
                    </div>
                    <Badge variant={review.priority === "High" ? "destructive" : "secondary"} className="text-xs">
                      {review.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">Submitted {review.submitted}</div>
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Feedback Given</CardTitle>
              <CardDescription>Your latest mentorship activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { student: "Rahul Singh", feedback: "Excellent code quality. Consider adding unit tests.", time: "3 hours ago", rating: 5 },
                { student: "Priya Sharma", feedback: "Good progress! Focus on optimization next.", time: "Yesterday", rating: 4 },
                { student: "Vikram Reddy", feedback: "Outstanding work on the architecture design.", time: "2 days ago", rating: 5 },
              ].map((item, i) => (
                <div key={i} className="p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-medium text-sm">{item.student}</div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <span key={i} className="text-yellow-400 text-xs">★</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">&quot;{item.feedback}&quot;</div>
                  <div className="text-xs text-muted-foreground">{item.time}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
