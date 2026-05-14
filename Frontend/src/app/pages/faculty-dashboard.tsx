import { Users, UserCheck, FileText, BarChart3, Home, Settings, Shield, CheckCircle, AlertTriangle, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { DashboardLayout } from "../components/dashboard-layout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const studentGrowthData = [
  { month: "Jan", students: 120 },
  { month: "Feb", students: 145 },
  { month: "Mar", students: 168 },
  { month: "Apr", students: 192 },
  { month: "May", students: 215 },
];

const performanceData = [
  { category: "Level A", count: 45 },
  { category: "Level B", count: 78 },
  { category: "Level C", count: 62 },
  { category: "Level D", count: 30 },
];

function Sidebar() {
  const menuItems = [
    { icon: Home, label: "Dashboard", active: true },
    { icon: Users, label: "Students" },
    { icon: UserCheck, label: "Mentors" },
    { icon: FileText, label: "Projects" },
    { icon: BarChart3, label: "Analytics" },
    { icon: Shield, label: "Approvals" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-2">
          <Shield className="h-6 w-6 text-white" />
        </div>
        <div className="font-semibold">SkillForge</div>
        <div className="text-xs text-muted-foreground">Faculty Portal</div>
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

export default function FacultyDashboard() {
  return (
    <DashboardLayout sidebar={<Sidebar />} title="Faculty Dashboard">
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-muted-foreground">Total Students</div>
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-1">215</div>
              <div className="text-xs text-muted-foreground">+23 this month</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-muted-foreground">Active Mentors</div>
                <UserCheck className="h-5 w-5 text-secondary" />
              </div>
              <div className="text-3xl font-bold mb-1">38</div>
              <div className="text-xs text-muted-foreground">2 pending approval</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-muted-foreground">Active Projects</div>
                <FileText className="h-5 w-5 text-accent" />
              </div>
              <div className="text-3xl font-bold mb-1">127</div>
              <div className="text-xs text-muted-foreground">15 need approval</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-muted-foreground">Completion Rate</div>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold mb-1">87%</div>
              <div className="text-xs text-muted-foreground">+5% from last month</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Student Growth Trend</CardTitle>
              <CardDescription>Monthly enrollment statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={studentGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Line type="monotone" dataKey="students" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skill Level Distribution</CardTitle>
              <CardDescription>Student distribution across skill levels</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="category" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Student Management</CardTitle>
                <CardDescription>Filter and manage student accounts</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="a">Level A</SelectItem>
                    <SelectItem value="b">Level B</SelectItem>
                    <SelectItem value="c">Level C</SelectItem>
                    <SelectItem value="d">Level D</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Priya Sharma", email: "priya.sharma@university.edu", level: "B", mentor: "Sarah Kumar", projects: 3, status: "Active", performance: 85 },
                { name: "Rahul Singh", email: "rahul.singh@university.edu", level: "C", mentor: "Vikram Mehta", projects: 2, status: "Active", performance: 72 },
                { name: "Anjali Patel", email: "anjali.patel@university.edu", level: "B", mentor: "Sarah Kumar", projects: 4, status: "Active", performance: 78 },
                { name: "Vikram Reddy", email: "vikram.reddy@university.edu", level: "A", mentor: "Arjun Nair", projects: 5, status: "Active", performance: 92 },
                { name: "Sneha Desai", email: "sneha.desai@university.edu", level: "D", mentor: "Unassigned", projects: 1, status: "Pending", performance: 45 },
              ].map((student, i) => (
                <div key={i} className="p-4 border rounded-lg hover:shadow-md transition-all bg-card/50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-semibold">{student.name}</div>
                        <div className="text-sm text-muted-foreground">{student.email}</div>
                      </div>
                    </div>
                    <Badge variant={student.status === "Active" ? "default" : "secondary"}>
                      {student.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground text-xs mb-1">Skill Level</div>
                      <div className="font-medium">Level {student.level}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs mb-1">Mentor</div>
                      <div className="font-medium">{student.mentor}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs mb-1">Projects</div>
                      <div className="font-medium">{student.projects}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs mb-1">Performance</div>
                      <div className="font-medium">{student.performance}%</div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button variant="outline" size="sm">View Details</Button>
                    {student.mentor === "Unassigned" && (
                      <Button size="sm">Assign Mentor</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>Projects and requests requiring approval</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { type: "Project", title: "E-commerce Platform Development", student: "Priya Sharma", submitted: "2 hours ago" },
                { type: "Mentor", title: "New Mentor Application", student: "Rakesh Sharma", submitted: "5 hours ago" },
                { type: "Project", title: "Mobile App Redesign", student: "Vikram Reddy", submitted: "1 day ago" },
              ].map((item, i) => (
                <div key={i} className="p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">{item.type}</Badge>
                      </div>
                      <div className="font-medium text-sm">{item.title}</div>
                      <div className="text-xs text-muted-foreground">{item.student}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-xs text-muted-foreground">Submitted {item.submitted}</div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Reject</Button>
                      <Button size="sm">Approve</Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Alerts</CardTitle>
              <CardDescription>Students requiring attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { student: "Sneha Desai", issue: "No project submissions in 2 weeks", severity: "high" },
                { student: "Karan Patel", issue: "Low exam scores (below 60%)", severity: "high" },
                { student: "Maya Iyer", issue: "Mentor reported minimal engagement", severity: "medium" },
              ].map((alert, i) => (
                <div key={i} className="p-4 border rounded-lg bg-destructive/5 border-destructive/20">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${alert.severity === 'high' ? 'text-destructive' : 'text-yellow-500'}`} />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{alert.student}</div>
                      <div className="text-sm text-muted-foreground">{alert.issue}</div>
                      <Button size="sm" variant="outline" className="mt-2">
                        Take Action
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
