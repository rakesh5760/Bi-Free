import { useState } from "react";
import { Layout, Plus, Calendar, Users, MessageSquare, Paperclip, MoreVertical, Home, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../app/components/ui/card";
import { Badge } from "../../app/components/ui/badge";
import { Button } from "../../app/components/ui/button";
import { Avatar, AvatarFallback } from "../../app/components/ui/avatar";
import { DashboardLayout } from "../../app/components/dashboard-layout";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../app/components/ui/dropdown-menu";

function Sidebar() {
  const menuItems = [
    { icon: Home, label: "Dashboard" },
    { icon: Layout, label: "Projects", active: true },
    { icon: Calendar, label: "Calendar" },
    { icon: Users, label: "Team" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center mb-2">
          <Layout className="h-6 w-6 text-white" />
        </div>
        <div className="font-semibold">SkillForge</div>
        <div className="text-xs text-muted-foreground">Project Management</div>
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

export default function ProjectManagement() {
  const [selectedProject] = useState("E-commerce Platform");

  const columns = [
    {
      title: "To Do",
      color: "border-blue-500",
      tasks: [
        { title: "Design homepage mockup", assignee: "PS", priority: "high", comments: 3, attachments: 2 },
        { title: "Set up database schema", assignee: "VR", priority: "high", comments: 1, attachments: 0 },
        { title: "Create API documentation", assignee: "AP", priority: "medium", comments: 0, attachments: 1 },
      ]
    },
    {
      title: "In Progress",
      color: "border-yellow-500",
      tasks: [
        { title: "Implement user authentication", assignee: "RS", priority: "high", comments: 5, attachments: 1 },
        { title: "Build product listing page", assignee: "PS", priority: "medium", comments: 2, attachments: 3 },
      ]
    },
    {
      title: "Review",
      color: "border-purple-500",
      tasks: [
        { title: "Shopping cart functionality", assignee: "VR", priority: "high", comments: 4, attachments: 2 },
        { title: "Payment gateway integration", assignee: "AP", priority: "high", comments: 6, attachments: 1 },
      ]
    },
    {
      title: "Done",
      color: "border-green-500",
      tasks: [
        { title: "Project setup & config", assignee: "RS", priority: "medium", comments: 2, attachments: 0 },
        { title: "Logo and branding assets", assignee: "PS", priority: "low", comments: 1, attachments: 5 },
      ]
    },
  ];

  const teamMembers = [
    { name: "Priya Sharma", initials: "PS", role: "Frontend Lead", active: true },
    { name: "Vikram Reddy", initials: "VR", role: "Backend Lead", active: true },
    { name: "Anjali Patel", initials: "AP", role: "Full Stack", active: false },
    { name: "Rahul Singh", initials: "RS", role: "DevOps", active: true },
  ];

  return (
    <DashboardLayout sidebar={<Sidebar />} title="Project Management">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">{selectedProject}</h2>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Client: TechStart Inc.</span>
              <span>•</span>
              <span>Deadline: May 18, 2026</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {teamMembers.map((member, i) => (
                <Avatar key={i} className="h-8 w-8 border-2 border-background">
                  <AvatarFallback className={`bg-gradient-to-br from-primary to-secondary text-white text-xs ${member.active ? '' : 'opacity-50'}`}>
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <CardContent className="p-6">
              <div className="text-sm font-medium text-muted-foreground mb-2">Total Tasks</div>
              <div className="text-3xl font-bold">12</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/20">
            <CardContent className="p-6">
              <div className="text-sm font-medium text-muted-foreground mb-2">In Progress</div>
              <div className="text-3xl font-bold">2</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
            <CardContent className="p-6">
              <div className="text-sm font-medium text-muted-foreground mb-2">In Review</div>
              <div className="text-3xl font-bold">2</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardContent className="p-6">
              <div className="text-sm font-medium text-muted-foreground mb-2">Completed</div>
              <div className="text-3xl font-bold">2</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4">
          {columns.map((column, i) => (
            <div key={i} className="flex-shrink-0 w-80">
              <Card>
                <CardHeader className={`border-l-4 ${column.color}`}>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{column.title}</CardTitle>
                    <Badge variant="secondary">{column.tasks.length}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {column.tasks.map((task, j) => (
                    <Card key={j} className="hover:shadow-md transition-all cursor-pointer bg-card/50">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="font-medium text-sm mb-2">{task.title}</div>
                            <Badge
                              variant={task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {task.priority}
                            </Badge>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>Move</DropdownMenuItem>
                              <DropdownMenuItem>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="flex items-center justify-between">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xs">
                              {task.assignee}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            {task.comments > 0 && (
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                <span>{task.comments}</span>
                              </div>
                            )}
                            {task.attachments > 0 && (
                              <div className="flex items-center gap-1">
                                <Paperclip className="h-3 w-3" />
                                <span>{task.attachments}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button variant="ghost" className="w-full justify-start text-muted-foreground" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add task
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {teamMembers.map((member, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg bg-card/50">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">{member.name}</div>
                      <div className="text-xs text-muted-foreground">{member.role}</div>
                    </div>
                  </div>
                  <Badge variant={member.active ? "default" : "secondary"}>
                    {member.active ? "Active" : "Away"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { user: "Priya Sharma", action: "completed", task: "Homepage mockup", time: "2 hours ago" },
                { user: "Vikram Reddy", action: "commented on", task: "Shopping cart functionality", time: "4 hours ago" },
                { user: "Rahul Singh", action: "uploaded files to", task: "Project setup & config", time: "Yesterday" },
                { user: "Anjali Patel", action: "moved", task: "Payment gateway integration", time: "Yesterday" },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-3 p-3 border rounded-lg bg-muted/30">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xs">
                      {activity.user.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-sm">
                      <span className="font-medium">{activity.user}</span>
                      {' '}{activity.action}{' '}
                      <span className="font-medium">{activity.task}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{activity.time}</div>
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
