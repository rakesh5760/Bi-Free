import { Briefcase, Plus, MessageSquare, FileCheck, Clock, Home, Settings, DollarSign, Users, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { DashboardLayout } from "../components/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

function Sidebar() {
  const menuItems = [
    { icon: Home, label: "Dashboard", active: true },
    { icon: Briefcase, label: "My Projects" },
    { icon: MessageSquare, label: "Messages" },
    { icon: FileCheck, label: "Submissions" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-accent to-secondary flex items-center justify-center mb-2">
          <Briefcase className="h-6 w-6 text-white" />
        </div>
        <div className="font-semibold">SkillForge</div>
        <div className="text-xs text-muted-foreground">Client Portal</div>
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
        <Button className="w-full bg-gradient-to-r from-primary to-secondary">
          <Plus className="mr-2 h-4 w-4" />
          Post New Project
        </Button>
      </div>
    </div>
  );
}

export default function ClientDashboard() {
  return (
    <DashboardLayout sidebar={<Sidebar />} title="Client Dashboard">
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-muted-foreground">Active Projects</div>
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-1">8</div>
              <div className="text-xs text-muted-foreground">3 in progress</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-muted-foreground">Total Spent</div>
                <DollarSign className="h-5 w-5 text-secondary" />
              </div>
              <div className="text-3xl font-bold mb-1">$12,450</div>
              <div className="text-xs text-muted-foreground">This quarter</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-muted-foreground">Completed</div>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold mb-1">24</div>
              <div className="text-xs text-muted-foreground">95% success rate</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-muted-foreground">Active Teams</div>
                <Users className="h-5 w-5 text-accent" />
              </div>
              <div className="text-3xl font-bold mb-1">5</div>
              <div className="text-xs text-muted-foreground">18 team members</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Active Projects</CardTitle>
            <CardDescription>Track your ongoing project deliverables</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All Projects</TabsTrigger>
                <TabsTrigger value="progress">In Progress</TabsTrigger>
                <TabsTrigger value="review">In Review</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-4 mt-4">
                {[
                  { title: "E-commerce Website Development", team: "Team Alpha", members: 3, progress: 75, status: "In Progress", deadline: "May 18, 2026", budget: "$3,500" },
                  { title: "Mobile App UI/UX Design", team: "Team Beta", members: 2, progress: 45, status: "In Progress", deadline: "May 25, 2026", budget: "$2,800" },
                  { title: "Database Migration & Optimization", team: "Team Gamma", members: 4, progress: 90, status: "In Review", deadline: "May 15, 2026", budget: "$4,200" },
                ].map((project, i) => (
                  <div key={i} className="p-6 border rounded-lg hover:shadow-lg transition-all bg-card/50">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{project.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {project.team}
                          </span>
                          <span>{project.members} members</span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {project.budget}
                          </span>
                        </div>
                      </div>
                      <Badge variant={project.status === "In Review" ? "default" : "secondary"}>
                        {project.status}
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>Deadline: {project.deadline}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Message Team
                          </Button>
                          <Button size="sm">View Details</Button>
                        </div>
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
              <CardTitle>Assigned Teams</CardTitle>
              <CardDescription>View team members working on your projects</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Team Alpha", lead: "Priya Sharma", members: ["PS", "RS", "AP"], project: "E-commerce Website", rating: 4.8 },
                { name: "Team Beta", lead: "Vikram Reddy", members: ["VR", "SD"], project: "Mobile App UI/UX", rating: 4.9 },
                { name: "Team Gamma", lead: "Anjali Patel", members: ["AP", "KP", "MI", "RK"], project: "Database Migration", rating: 4.7 },
              ].map((team, i) => (
                <div key={i} className="p-4 border rounded-lg hover:shadow-md transition-all bg-muted/30">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-semibold">{team.name}</div>
                      <div className="text-sm text-muted-foreground">Lead: {team.lead}</div>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={`text-xs ${i < Math.floor(team.rating) ? 'text-yellow-400' : 'text-muted'}`}>★</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    {team.members.map((member, j) => (
                      <Avatar key={j} className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xs">
                          {member}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    <span className="text-sm text-muted-foreground ml-2">{team.members.length} members</span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-3">Working on: {team.project}</div>
                  <Button variant="outline" size="sm" className="w-full">
                    View Team Profile
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
              <CardDescription>Review completed work from teams</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { project: "E-commerce Backend API", team: "Team Alpha", submitted: "2 hours ago", type: "Milestone 3" },
                { project: "Mobile Wireframes v2", team: "Team Beta", submitted: "5 hours ago", type: "Design Review" },
                { project: "Database Schema", team: "Team Gamma", submitted: "1 day ago", type: "Final Deliverable" },
              ].map((submission, i) => (
                <div key={i} className="p-4 border rounded-lg hover:shadow-md transition-all bg-muted/30">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{submission.project}</div>
                      <div className="text-xs text-muted-foreground">{submission.team}</div>
                    </div>
                    <Badge variant="outline" className="text-xs">{submission.type}</Badge>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-xs text-muted-foreground">Submitted {submission.submitted}</div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Download</Button>
                      <Button size="sm">Review</Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project Timeline</CardTitle>
            <CardDescription>Upcoming milestones and deadlines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { date: "May 15, 2026", milestone: "Database Migration - Final Review", project: "Database Optimization", status: "upcoming" },
                { date: "May 18, 2026", milestone: "E-commerce - Beta Launch", project: "E-commerce Website", status: "upcoming" },
                { date: "May 20, 2026", milestone: "UI/UX - Design Handoff", project: "Mobile App UI/UX", status: "scheduled" },
                { date: "May 25, 2026", milestone: "Final Presentation", project: "Mobile App UI/UX", status: "scheduled" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 border rounded-lg bg-muted/30">
                  <div className="flex flex-col items-center gap-1 min-w-[70px]">
                    <div className="text-2xl font-bold">{item.date.split(' ')[1].replace(',', '')}</div>
                    <div className="text-xs text-muted-foreground">{item.date.split(' ')[0]}</div>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold mb-1">{item.milestone}</div>
                    <div className="text-sm text-muted-foreground">{item.project}</div>
                  </div>
                  <Badge variant={item.status === "upcoming" ? "default" : "secondary"}>
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
