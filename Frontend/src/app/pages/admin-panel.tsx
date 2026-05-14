import { Shield, Users, UserCheck, FileText, Settings, Database, Activity, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { DashboardLayout } from "../components/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";

function Sidebar() {
  const menuItems = [
    { icon: Activity, label: "Overview", active: true },
    { icon: Users, label: "User Management" },
    { icon: UserCheck, label: "Mentor Approval" },
    { icon: FileText, label: "Content Management" },
    { icon: Database, label: "System Logs" },
    { icon: Settings, label: "Platform Settings" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-destructive to-primary flex items-center justify-center mb-2">
          <Shield className="h-6 w-6 text-white" />
        </div>
        <div className="font-semibold">SkillForge</div>
        <div className="text-xs text-muted-foreground">Admin Panel</div>
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
        <Card className="bg-destructive/5 border-destructive/20">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-xs">
              <Shield className="h-4 w-4 text-destructive" />
              <span className="text-muted-foreground">Admin Access Active</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  return (
    <DashboardLayout sidebar={<Sidebar />} title="Admin Panel">
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-muted-foreground">Total Users</div>
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-1">285</div>
              <div className="text-xs text-muted-foreground">+18 this week</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-muted-foreground">Active Sessions</div>
                <Activity className="h-5 w-5 text-secondary" />
              </div>
              <div className="text-3xl font-bold mb-1">142</div>
              <div className="text-xs text-muted-foreground">Live now</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-muted-foreground">Pending Approvals</div>
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="text-3xl font-bold mb-1">12</div>
              <div className="text-xs text-muted-foreground">Requires action</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-muted-foreground">System Health</div>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold mb-1">99.8%</div>
              <div className="text-xs text-green-500">All systems operational</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage platform users and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="students">
              <TabsList>
                <TabsTrigger value="students">Students (215)</TabsTrigger>
                <TabsTrigger value="mentors">Mentors (38)</TabsTrigger>
                <TabsTrigger value="faculty">Faculty (8)</TabsTrigger>
                <TabsTrigger value="clients">Clients (24)</TabsTrigger>
              </TabsList>
              <TabsContent value="students" className="space-y-4 mt-4">
                {[
                  { name: "Priya Sharma", email: "priya.sharma@university.edu", level: "B", status: "Active", joined: "Jan 2026" },
                  { name: "Rahul Singh", email: "rahul.singh@university.edu", level: "C", status: "Active", joined: "Feb 2026" },
                  { name: "Anjali Patel", email: "anjali.patel@university.edu", level: "B", status: "Active", joined: "Mar 2026" },
                  { name: "Vikram Reddy", email: "vikram.reddy@university.edu", level: "A", status: "Active", joined: "Dec 2025" },
                ].map((user, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all bg-card/50">
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                      <div className="text-sm">
                        <Badge variant="outline">Level {user.level}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground min-w-[100px]">{user.joined}</div>
                      <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                        {user.status}
                      </Badge>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Suspend</Button>
                    </div>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="mentors" className="space-y-4 mt-4">
                {[
                  { name: "Sarah Kumar", email: "sarah.kumar@mentors.com", students: 25, rating: 4.9, status: "Active" },
                  { name: "Vikram Mehta", email: "vikram.mehta@mentors.com", students: 22, rating: 4.8, status: "Active" },
                ].map((mentor, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all bg-card/50">
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-br from-secondary to-accent text-white">
                          {mentor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">{mentor.name}</div>
                        <div className="text-sm text-muted-foreground">{mentor.email}</div>
                      </div>
                      <div className="text-sm text-muted-foreground">{mentor.students} students</div>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400 text-sm">★</span>
                        <span className="text-sm font-medium">{mentor.rating}</span>
                      </div>
                      <Badge variant="default">{mentor.status}</Badge>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm">View</Button>
                      <Button variant="outline" size="sm">Edit</Button>
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
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>Items requiring administrative review</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { type: "Mentor Application", user: "Rakesh Sharma", submitted: "2 hours ago", priority: "High" },
                { type: "Project Proposal", user: "TechCorp Solutions", submitted: "5 hours ago", priority: "Medium" },
                { type: "Content Upload", user: "Sarah Kumar", submitted: "1 day ago", priority: "Low" },
                { type: "Mentor Application", user: "Maya Iyer", submitted: "1 day ago", priority: "High" },
              ].map((item, i) => (
                <div key={i} className="p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{item.type}</Badge>
                        <Badge variant={item.priority === "High" ? "destructive" : item.priority === "Medium" ? "default" : "secondary"}>
                          {item.priority}
                        </Badge>
                      </div>
                      <div className="font-medium text-sm">{item.user}</div>
                      <div className="text-xs text-muted-foreground">Submitted {item.submitted}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <XCircle className="mr-2 h-3 w-3" />
                      Reject
                    </Button>
                    <Button size="sm" className="flex-1">
                      <CheckCircle className="mr-2 h-3 w-3" />
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>Configure system-wide preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <Label htmlFor="registrations" className="font-medium">Student Registrations</Label>
                  <div className="text-sm text-muted-foreground">Allow new student sign-ups</div>
                </div>
                <Switch id="registrations" defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <Label htmlFor="mentor-apps" className="font-medium">Mentor Applications</Label>
                  <div className="text-sm text-muted-foreground">Accept new mentor applications</div>
                </div>
                <Switch id="mentor-apps" defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <Label htmlFor="maintenance" className="font-medium">Maintenance Mode</Label>
                  <div className="text-sm text-muted-foreground">Disable platform for maintenance</div>
                </div>
                <Switch id="maintenance" />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <Label htmlFor="notifications" className="font-medium">Email Notifications</Label>
                  <div className="text-sm text-muted-foreground">Send automated email updates</div>
                </div>
                <Switch id="notifications" defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <Label htmlFor="analytics" className="font-medium">Analytics Tracking</Label>
                  <div className="text-sm text-muted-foreground">Collect usage analytics</div>
                </div>
                <Switch id="analytics" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>System Activity Log</CardTitle>
            <CardDescription>Recent administrative actions and system events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { action: "User approved", user: "Admin", details: "Mentor application approved for Sarah Kumar", time: "5 minutes ago", type: "success" },
                { action: "Settings changed", user: "Admin", details: "Email notifications enabled", time: "1 hour ago", type: "info" },
                { action: "User suspended", user: "Admin", details: "Account suspended for policy violation", time: "3 hours ago", type: "warning" },
                { action: "Project approved", user: "Faculty", details: "E-commerce project approved", time: "5 hours ago", type: "success" },
                { action: "System backup", user: "System", details: "Automated database backup completed", time: "12 hours ago", type: "info" },
              ].map((log, i) => (
                <div key={i} className="flex items-start gap-3 p-3 border rounded-lg bg-muted/30">
                  <div className={`h-2 w-2 rounded-full mt-2 flex-shrink-0 ${
                    log.type === 'success' ? 'bg-green-500' :
                    log.type === 'warning' ? 'bg-yellow-500' :
                    'bg-primary'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <div className="font-medium text-sm">{log.action}</div>
                      <div className="text-xs text-muted-foreground">{log.time}</div>
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">{log.details}</div>
                    <div className="text-xs text-muted-foreground">by {log.user}</div>
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
