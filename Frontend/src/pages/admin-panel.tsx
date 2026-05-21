import { useState, useEffect } from "react";
import { api } from "../services/api.client";
import { Shield, Users, UserCheck, FileText, Settings, Database, Activity, AlertCircle, CheckCircle, XCircle, Search, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { DashboardLayout } from "../layouts/DashboardLayout";
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
  const [users, setUsers] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let active = true;
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get("/users/admin/users");
        if (active) {
          setUsers(response.data.data);
          setError(null);
        }
      } catch (err: any) {
        console.error("Error fetching users:", err);
        if (active) {
          setError("Failed to load user directories. Please try again.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    fetchUsers();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <DashboardLayout sidebar={<Sidebar />} title="Admin Panel">
        <div className="flex h-[65vh] flex-col items-center justify-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium animate-pulse">Loading administrative directories...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !users) {
    return (
      <DashboardLayout sidebar={<Sidebar />} title="Admin Panel">
        <div className="flex h-[65vh] flex-col items-center justify-center gap-4">
          <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-2">
            <span className="font-bold text-lg">!</span>
          </div>
          <p className="text-destructive font-medium">{error || "No data available."}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </DashboardLayout>
    );
  }

  const students = users.students || [];
  const mentors = users.mentors || [];
  const faculty = users.faculty || [];
  const clients = users.clients || [];

  const totalUsers = students.length + mentors.length + faculty.length + clients.length;
  const activeUsers = 
    students.filter((u: any) => u.is_active).length +
    mentors.filter((u: any) => u.is_active).length +
    faculty.filter((u: any) => u.is_active).length +
    clients.filter((u: any) => u.is_active).length;

  const filterUsersList = (list: any[]) => {
    if (!searchQuery) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (u: any) =>
        `${u.first_name} ${u.last_name}`.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    );
  };

  const filteredStudents = filterUsersList(students);
  const filteredMentors = filterUsersList(mentors);
  const filteredFaculty = filterUsersList(faculty);
  const filteredClients = filterUsersList(clients);

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
              <div className="text-3xl font-bold mb-1">{totalUsers}</div>
              <div className="text-xs text-muted-foreground">Registered on platform</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-muted-foreground">Active Users</div>
                <Activity className="h-5 w-5 text-secondary" />
              </div>
              <div className="text-3xl font-bold mb-1">{activeUsers}</div>
              <div className="text-xs text-muted-foreground">Currently enabled accounts</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-muted-foreground">Pending Approvals</div>
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="text-3xl font-bold mb-1">4</div>
              <div className="text-xs text-muted-foreground">Requires action</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-muted-foreground">System Health</div>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold mb-1">99.9%</div>
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
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <TabsList className="grid grid-cols-4 w-full md:w-[540px]">
                  <TabsTrigger value="students">Students ({filteredStudents.length})</TabsTrigger>
                  <TabsTrigger value="mentors">Mentors ({filteredMentors.length})</TabsTrigger>
                  <TabsTrigger value="faculty">Faculty ({filteredFaculty.length})</TabsTrigger>
                  <TabsTrigger value="clients">Clients ({filteredClients.length})</TabsTrigger>
                </TabsList>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
              </div>

              <TabsContent value="students" className="space-y-4">
                {filteredStudents.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No students found matching search.</div>
                ) : (
                  filteredStudents.map((user: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all bg-card/50">
                      <div className="flex items-center gap-3 flex-1">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-semibold">
                            {user.first_name[0]}{user.last_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-semibold">{user.first_name} {user.last_name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                        <div className="text-sm hidden sm:block">
                          <Badge variant="outline" className="border-primary/30 text-primary">Level {user.details.level || "Unknown"}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground min-w-[100px] hidden md:block">Joined {user.details.joined}</div>
                        <Badge variant={user.is_active ? "default" : "secondary"}>
                          {user.is_active ? "Active" : "Suspended"}
                        </Badge>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/5">
                          {user.is_active ? "Suspend" : "Activate"}
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="mentors" className="space-y-4">
                {filteredMentors.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No mentors found matching search.</div>
                ) : (
                  filteredMentors.map((user: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all bg-card/50">
                      <div className="flex items-center gap-3 flex-1">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-br from-secondary to-accent text-white font-semibold">
                            {user.first_name[0]}{user.last_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-semibold">{user.first_name} {user.last_name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                        <div className="text-sm text-muted-foreground hidden sm:block">{user.details.students} students</div>
                        <div className="flex items-center gap-1 min-w-[60px]">
                          <span className="text-yellow-400 text-sm">★</span>
                          <span className="text-sm font-semibold">{user.details.rating ? user.details.rating.toFixed(1) : "0.0"}</span>
                        </div>
                        <Badge variant={user.is_active ? "default" : "secondary"}>
                          {user.is_active ? "Active" : "Suspended"}
                        </Badge>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/5">
                          {user.is_active ? "Suspend" : "Activate"}
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="faculty" className="space-y-4">
                {filteredFaculty.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No faculty members found matching search.</div>
                ) : (
                  filteredFaculty.map((user: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all bg-card/50">
                      <div className="flex items-center gap-3 flex-1">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white font-semibold">
                            {user.first_name[0]}{user.last_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-semibold">{user.first_name} {user.last_name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                        <div className="text-sm text-muted-foreground hidden sm:block">Dept: {user.details.department || "General"}</div>
                        <Badge variant={user.is_active ? "default" : "secondary"}>
                          {user.is_active ? "Active" : "Suspended"}
                        </Badge>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/5">
                          {user.is_active ? "Suspend" : "Activate"}
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="clients" className="space-y-4">
                {filteredClients.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No clients found matching search.</div>
                ) : (
                  filteredClients.map((user: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all bg-card/50">
                      <div className="flex items-center gap-3 flex-1">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white font-semibold">
                            {user.first_name[0]}{user.last_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-semibold">{user.first_name} {user.last_name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                        <div className="text-sm text-muted-foreground hidden sm:block">{user.details.company_name}</div>
                        <div className="text-sm font-semibold hidden md:block">Spent: ${user.details.total_spent ? user.details.total_spent.toLocaleString() : "0"}</div>
                        <Badge variant={user.is_active ? "default" : "secondary"}>
                          {user.is_active ? "Active" : "Suspended"}
                        </Badge>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm">Projects</Button>
                        <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/5">
                          {user.is_active ? "Suspend" : "Activate"}
                        </Button>
                      </div>
                    </div>
                  ))
                )}
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

