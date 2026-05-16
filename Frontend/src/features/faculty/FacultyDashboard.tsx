import { Users, UserCheck, FileText, Home, Settings, Shield, CheckCircle, AlertTriangle, Filter, Plus, Briefcase, ArrowRight, UserPlus, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

function Sidebar() {
  const menuItems = [
    { icon: Home, label: "Dashboard", active: true },
    { icon: Users, label: "Students" },
    { icon: UserCheck, label: "Mentors" },
    { icon: FileText, label: "Project Allocations" },
    { icon: AlertTriangle, label: "Escalations" },
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

        {/* OPERATIONAL WORKFLOW AREA */}
        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* Main Action Queue */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-primary/20 shadow-lg">
              <CardHeader className="bg-primary/5 border-b border-primary/10">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-primary">
                      <Briefcase className="h-5 w-5" />
                      Pending Project Allocations
                    </CardTitle>
                    <CardDescription>Client projects awaiting Mentor and Team assignment</CardDescription>
                  </div>
                  <Badge className="bg-primary hover:bg-primary">2 Action Required</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {[
                    { client: "TechStart Corp", project: "E-commerce Backend Refactor", requiredSkills: ["Node.js", "PostgreSQL"], budget: "$4,500", submitted: "2 hours ago" },
                    { client: "DesignHub Inc", project: "Dashboard UI Migration", requiredSkills: ["React", "Tailwind"], budget: "$3,200", submitted: "5 hours ago" },
                  ].map((project, i) => (
                    <div key={i} className="p-6 hover:bg-muted/30 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs font-normal">{project.client}</Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {project.submitted}</span>
                          </div>
                          <h3 className="text-lg font-semibold">{project.project}</h3>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-green-600 dark:text-green-400">{project.budget}</div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <span className="text-xs text-muted-foreground mr-2">Required Skills:</span>
                        <div className="inline-flex gap-1">
                          {project.requiredSkills.map(skill => (
                            <Badge key={skill} variant="secondary" className="text-[10px] h-5">{skill}</Badge>
                          ))}
                        </div>
                      </div>

                      <div className="bg-card border rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium flex items-center gap-2">
                            <UserCheck className="h-4 w-4 text-muted-foreground" /> Step 1: Assign Supervising Mentor
                          </div>
                          <Select defaultValue="unassigned">
                            <SelectTrigger className="w-[200px] h-8 text-xs">
                              <SelectValue placeholder="Select Mentor" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="unassigned" disabled>Select Mentor...</SelectItem>
                              <SelectItem value="m1">Sarah Kumar (Backend Expert)</SelectItem>
                              <SelectItem value="m2">Rajesh Mehta (Fullstack)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" /> Step 2: Select Level A Students
                          </div>
                          <Button size="sm" variant="outline" className="h-8 text-xs">
                            <UserPlus className="h-3 w-3 mr-2" /> Browse Eligible Students
                          </Button>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md">
                          Finalize Allocation & Launch Project <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Supervised Projects</CardTitle>
                <CardDescription>Monitor ongoing mentor-led client engagements</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="active">
                  <TabsList className="mb-4">
                    <TabsTrigger value="active">Active Execution (12)</TabsTrigger>
                    <TabsTrigger value="review">Final Review (3)</TabsTrigger>
                  </TabsList>
                  <TabsContent value="active" className="space-y-4">
                    {[
                      { project: "Mobile App Wireframes", mentor: "Sarah Kumar", students: 2, progress: 65, status: "On Track" },
                      { project: "Database Optimization", mentor: "Arjun Nair", students: 3, progress: 30, status: "At Risk" },
                    ].map((active, i) => (
                      <div key={i} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:shadow-sm transition-all">
                        <div className="flex-1">
                          <div className="font-medium">{active.project}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1"><UserCheck className="h-3 w-3" /> {active.mentor}</span>
                            <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {active.students} Students</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant={active.status === "On Track" ? "default" : "destructive"} className={active.status === "On Track" ? "bg-green-500 hover:bg-green-600" : ""}>
                            {active.status}
                          </Badge>
                          <Button size="sm" variant="ghost">Manage</Button>
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
            <Card className="border-destructive/30 shadow-md">
              <CardHeader className="bg-destructive/5 border-b border-destructive/10 pb-4">
                <CardTitle className="text-destructive flex items-center gap-2 text-lg">
                  <AlertTriangle className="h-5 w-5" />
                  Escalations
                </CardTitle>
                <CardDescription>Requires immediate faculty intervention</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {[
                    { type: "Mentor Alert", issue: "Student Sneha missing milestones", project: "DB Opt" },
                    { type: "Client Dispute", issue: "Scope change requested", project: "App Wireframes" },
                  ].map((alert, i) => (
                    <div key={i} className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="destructive" className="text-[10px] uppercase tracking-wider">{alert.type}</Badge>
                      </div>
                      <div className="text-sm font-medium mt-1">{alert.issue}</div>
                      <div className="text-xs text-muted-foreground mt-1">Project: {alert.project}</div>
                      <Button size="sm" variant="outline" className="w-full mt-3 h-7 text-xs border-destructive/30 text-destructive hover:bg-destructive hover:text-white">
                        Review & Resolve
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Student Roster Query</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Filter by Qualification Level</label>
                  <Select defaultValue="a">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a">Level A (Project Ready)</SelectItem>
                      <SelectItem value="b">Level B (Incubating)</SelectItem>
                      <SelectItem value="c">Level C (Incubating)</SelectItem>
                      <SelectItem value="d">Level D (Novice)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Filter by Trust Score</label>
                  <Select defaultValue="high">
                    <SelectTrigger>
                      <SelectValue placeholder="Professionalism Score" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High Professionalism (&gt;90)</SelectItem>
                      <SelectItem value="med">Average (70-90)</SelectItem>
                      <SelectItem value="low">At Risk (&lt;70)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full mt-2">Filter Students</Button>
              </CardContent>
            </Card>
          </div>
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
      </div>
    </DashboardLayout>
  );
}
