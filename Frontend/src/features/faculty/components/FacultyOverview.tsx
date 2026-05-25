import { useState, useEffect } from "react";
import { Users, UserCheck, FileText, Shield, CheckCircle, AlertTriangle, Briefcase, ArrowRight, UserPlus, Clock, Target, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter, DialogClose } from "../../../components/ui/dialog";
import { Checkbox } from "../../../components/ui/checkbox";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { api } from "../../../services/api.client";
import { toast } from "sonner";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
};

export function FacultyOverview() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Dynamic data states
  const [projects, setProjects] = useState<any[]>([]);
  const [mentors, setMentors] = useState<any[]>([]);
  const [levelAStudents, setLevelAStudents] = useState<any[]>([]);
  
  // Allocation states
  const [selectedMentors, setSelectedMentors] = useState<Record<number, string>>({});
  const [selectedStudents, setSelectedStudents] = useState<Record<number, number[]>>({});
  const [isAllocating, setIsAllocating] = useState<Record<number, boolean>>({});

  // Invite Mentor states
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ first_name: '', last_name: '', email: '', password: '', domain: '' });

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const [analyticsRes, projectsRes, usersRes, studentsRes] = await Promise.all([
          api.get('/analytics/institutional'),
          api.get('/mentors/projects/global'),
          api.get('/users/admin/users'),
          api.get('/faculty/students/level-a')
        ]);

        if (analyticsRes.data.success) setAnalytics(analyticsRes.data.data);
        if (projectsRes.data.success) setProjects(projectsRes.data.data.items || []);
        if (usersRes.data.success) setMentors(usersRes.data.data.mentors || []);
        if (studentsRes.data.success) setLevelAStudents(studentsRes.data.data.items || []);

      } catch (err) {
        console.error("Failed to fetch faculty overview data", err);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleMentorSelect = (projectId: number, mentorId: string) => {
    setSelectedMentors(prev => ({ ...prev, [projectId]: mentorId }));
  };

  const toggleStudent = (projectId: number, studentId: number) => {
    setSelectedStudents(prev => {
      const current = prev[projectId] || [];
      if (current.includes(studentId)) {
        return { ...prev, [projectId]: current.filter(id => id !== studentId) };
      } else {
        return { ...prev, [projectId]: [...current, studentId] };
      }
    });
  };

  const handleFinalizeAllocation = async (projectId: number) => {
    const mentorId = selectedMentors[projectId];
    if (!mentorId) {
      toast.error("Please select a mentor first.");
      return;
    }

    setIsAllocating(prev => ({ ...prev, [projectId]: true }));
    try {
      const res = await api.post(`/faculty/projects/${projectId}/allocate-mentor`, { mentor_id: parseInt(mentorId) });
      if (res.data.success) {
        toast.success("Mentor allocated successfully.");
        const allocationId = res.data.data.allocation_id;
        
        // Assign students
        const students = selectedStudents[projectId] || [];
        if (students.length > 0) {
          for (const studentId of students) {
             await api.post(`/faculty/allocations/${allocationId}/add-student`, { student_id: studentId });
          }
          toast.success(`${students.length} students added to team.`);
        }
        
        // Re-fetch projects to update UI
        const projectsRes = await api.get('/mentors/projects/global');
        if (projectsRes.data.success) setProjects(projectsRes.data.data.items || []);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to allocate mentor");
    } finally {
      setIsAllocating(prev => ({ ...prev, [projectId]: false }));
    }
  };

  const handleInviteMentor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...inviteForm,
        role: "Mentor"
      };
      const res = await api.post('/auth/register', payload);
      if (res.data.access_token) {
        toast.success("Mentor invited successfully!");
        setIsInviteOpen(false);
        setInviteForm({ first_name: '', last_name: '', email: '', password: '', domain: '' });
        // Refresh mentors
        const usersRes = await api.get('/users/admin/users');
        if (usersRes.data.success) setMentors(usersRes.data.data.mentors || []);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to invite mentor");
    }
  };

  const handleRevokeAllocation = async (allocationId: number) => {
    if (!confirm("Are you sure you want to revoke this entire allocation? The project will return to Pending.")) return;
    try {
      const res = await api.delete(`/faculty/allocations/${allocationId}`);
      if (res.data.success) {
        toast.success("Allocation revoked successfully.");
        const projectsRes = await api.get('/mentors/projects/global');
        if (projectsRes.data.success) setProjects(projectsRes.data.data.items || []);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to revoke allocation");
    }
  };

  const handleRemoveStudent = async (allocationId: number, studentId: number) => {
    if (!confirm("Remove this student from the team?")) return;
    try {
      const res = await api.delete(`/faculty/allocations/${allocationId}/students/${studentId}`);
      if (res.data.success) {
        toast.success("Student removed successfully.");
        const projectsRes = await api.get('/mentors/projects/global');
        if (projectsRes.data.success) setProjects(projectsRes.data.data.items || []);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to remove student");
    }
  };

  const totalProjects = (analytics?.active_projects || 0) + (analytics?.completed_projects || 0);
  const completionRate = totalProjects > 0 ? Math.round((analytics.completed_projects / totalProjects) * 100) : 100;

  const pendingProjects = projects.filter(p => !p.allocation && p.status === 'Pending');
  const activeProjects = projects.filter(p => p.allocation);

  return (
    <motion.div 
      className="space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* KPI Cards */}
      <motion.div variants={fadeIn} className="grid gap-6 md:grid-cols-4">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none">
              <Users className="h-24 w-24" />
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total Students</div>
              <div className="h-8 w-8 rounded-full bg-indigo-500/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-indigo-500" />
              </div>
            </div>
            <div className="text-3xl font-extrabold mb-2 text-foreground tracking-tight">
              {isLoading ? <Loader2 className="animate-spin h-6 w-6" /> : (analytics?.total_students || 0)}
            </div>
            <div className="text-xs font-medium text-indigo-500 flex items-center gap-1">+5 this month</div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none">
              <UserCheck className="h-24 w-24" />
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Active Mentors</div>
              <div className="h-8 w-8 rounded-full bg-cyan-500/10 flex items-center justify-center">
                <UserCheck className="h-4 w-4 text-cyan-500" />
              </div>
            </div>
            <div className="text-3xl font-extrabold mb-2 text-foreground tracking-tight">
              {isLoading ? <Loader2 className="animate-spin h-6 w-6" /> : (analytics?.total_mentors || 0)}
            </div>
            <div className="text-xs font-medium text-cyan-500">2 pending approval</div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none">
              <FileText className="h-24 w-24" />
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Active Projects</div>
              <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                <FileText className="h-4 w-4 text-blue-500" />
              </div>
            </div>
            <div className="text-3xl font-extrabold mb-2 text-foreground tracking-tight">
              {isLoading ? <Loader2 className="animate-spin h-6 w-6" /> : (analytics?.active_projects || 0)}
            </div>
            <div className="text-xs font-medium text-amber-500">15 need allocation</div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none">
              <CheckCircle className="h-24 w-24" />
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Completion Rate</div>
              <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
              </div>
            </div>
            <div className="text-3xl font-extrabold mb-2 text-foreground tracking-tight">
              {isLoading ? <Loader2 className="animate-spin h-6 w-6" /> : `${completionRate}%`}
            </div>
            <div className="text-xs font-medium text-emerald-500 flex items-center gap-1">+5% from last month</div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={fadeIn} className="grid gap-6 lg:grid-cols-3">
        
        {/* Main Action Queue */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="bg-indigo-500/5 border-b border-indigo-500/10 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                    <Briefcase className="h-5 w-5" />
                    Pending Project Allocations
                  </CardTitle>
                  <CardDescription>Client projects awaiting Mentor and Team assignment</CardDescription>
                </div>
                <Badge className="bg-indigo-500 text-white hover:bg-indigo-600 shadow-sm px-3 py-1 text-xs">
                  {pendingProjects.length} Action Required
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {isLoading ? (
                  <div className="p-6 flex justify-center"><Loader2 className="animate-spin h-6 w-6 text-indigo-500" /></div>
                ) : pendingProjects.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground font-medium">No pending allocations.</div>
                ) : pendingProjects.map((project) => {
                  
                  // Filter students whose skills match the project's domain
                  const eligibleStudents = levelAStudents.filter(student => 
                    student.skills?.some((s: any) => s.domain_id === project.domain?.domain_id)
                  );

                  return (
                  <div key={project.project_id} className="p-6 hover:bg-muted/30 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-bold bg-background shadow-sm border-border/50">
                            {project.domain?.name || "General Client"}
                          </Badge>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {new Date(project.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-xl font-extrabold text-foreground">{project.title}</h3>
                      </div>
                      <div className="sm:text-right">
                        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Project Budget</div>
                        <div className="font-bold text-lg text-emerald-500">${project.budget}</div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-3">Required Technical Stack</span>
                      <div className="inline-flex gap-2 mt-2 sm:mt-0">
                        {project.required_skills?.map((skill: any) => (
                          <Badge key={skill.skill_id} variant="secondary" className="text-xs font-semibold bg-muted/50 border border-border/50">
                            {skill.name}
                          </Badge>
                        ))}
                        {(!project.required_skills || project.required_skills.length === 0) && (
                          <span className="text-xs text-muted-foreground">Not specified</span>
                        )}
                      </div>
                    </div>

                    <div className="bg-background/80 border border-border/50 rounded-xl p-5 space-y-5 shadow-inner">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="text-sm font-bold flex items-center gap-3 text-foreground">
                          <div className="h-8 w-8 rounded bg-indigo-500/10 flex items-center justify-center">
                            <UserCheck className="h-4 w-4 text-indigo-500" />
                          </div>
                          Step 1: Assign Supervising Mentor
                        </div>
                        <Select 
                          value={selectedMentors[project.project_id] || ""} 
                          onValueChange={(val) => handleMentorSelect(project.project_id, val)}
                        >
                          <SelectTrigger className="w-full sm:w-[240px] h-10 font-medium bg-card">
                            <SelectValue placeholder="Select Mentor" />
                          </SelectTrigger>
                          <SelectContent>
                            {mentors.map(m => (
                              <SelectItem key={m.user_id} value={m.user_id.toString()}>
                                {m.first_name} {m.last_name} ({m.details?.domain})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5 border-t border-border/50">
                        <div className="text-sm font-bold flex items-center gap-3 text-foreground">
                          <div className="h-8 w-8 rounded bg-cyan-500/10 flex items-center justify-center">
                            <Users className="h-4 w-4 text-cyan-500" />
                          </div>
                          Step 2: Select Level A Students
                        </div>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="h-10 font-semibold border-cyan-500/30 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500 hover:text-white transition-colors">
                              <UserPlus className="h-4 w-4 mr-2" /> Browse Eligible Pool ({eligibleStudents.length})
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Select Level A Students</DialogTitle>
                              <DialogDescription>
                                These students have verified skills in {project.domain?.name}.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4 max-h-[300px] overflow-y-auto">
                              {eligibleStudents.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center">No eligible students found in this domain.</p>
                              ) : eligibleStudents.map(student => (
                                <div key={student.user_id} className="flex items-center space-x-3 p-3 rounded-md border border-border/50 hover:bg-muted/30">
                                  <Checkbox 
                                    id={`student-${student.user_id}`} 
                                    checked={(selectedStudents[project.project_id] || []).includes(student.profile_id)}
                                    onCheckedChange={() => toggleStudent(project.project_id, student.profile_id)}
                                  />
                                  <label 
                                    htmlFor={`student-${student.user_id}`} 
                                    className="flex-1 flex flex-col cursor-pointer"
                                  >
                                    <span className="text-sm font-bold">{student.first_name} {student.last_name}</span>
                                    <span className="text-xs text-muted-foreground">{student.email}</span>
                                  </label>
                                  <Badge variant="secondary" className="text-[10px]">{student.trust_score}% Trust</Badge>
                                </div>
                              ))}
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="default">Done</Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <Button 
                        onClick={() => handleFinalizeAllocation(project.project_id)}
                        disabled={isAllocating[project.project_id]}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 font-bold h-11 px-6"
                      >
                        {isAllocating[project.project_id] ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : null}
                        Finalize Allocation & Deploy <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                )})}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
            <CardHeader className="border-b border-border/50 pb-4">
              <CardTitle>Active Supervised Projects</CardTitle>
              <CardDescription>Monitor ongoing mentor-led client engagements</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <Tabs defaultValue="active">
                <TabsList className="mb-4 bg-muted/50 border border-border/50">
                  <TabsTrigger value="active">All Active ({activeProjects.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="active" className="space-y-4">
                  {isLoading ? (
                    <div className="p-4 flex justify-center"><Loader2 className="animate-spin h-6 w-6 text-indigo-500" /></div>
                  ) : activeProjects.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground font-medium">No active supervised projects.</div>
                  ) : activeProjects.map((active, i) => {
                    const totalTasks = active.tasks?.length || 0;
                    const completedTasks = active.tasks?.filter((t: any) => t.status === "Done").length || 0;
                    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
                    
                    return (
                      <div key={active.project_id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-border/50 rounded-xl bg-background/50 hover:shadow-md transition-all gap-4">
                        <div className="flex-1">
                          <div className="font-bold text-foreground mb-2">{active.title}</div>
                          <div className="text-xs font-medium text-muted-foreground flex flex-wrap items-center gap-4">
                            <span className="flex items-center gap-1.5"><UserCheck className="h-3.5 w-3.5" /> Mentor: {active.allocation?.mentor_name || "Unknown"}</span>
                            <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {active.allocation?.team_members?.length || 0} Assigned</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant={active.status === "Mentor QA" ? "default" : "secondary"} className={`uppercase tracking-wider text-[10px] px-2 py-0.5 border`}>
                            {active.status}
                          </Badge>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="ghost" className="font-semibold text-muted-foreground hover:text-foreground">Manage</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Manage Project: {active.title}</DialogTitle>
                                <DialogDescription>Supervising Mentor: {active.allocation?.mentor_name}</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <h4 className="font-semibold text-sm">Assigned Students</h4>
                                {active.allocation?.team_members?.length === 0 ? (
                                  <p className="text-sm text-muted-foreground">No students assigned to this team yet.</p>
                                ) : (
                                  active.allocation?.team_members?.map((tm: any) => (
                                    <div key={tm.student_id} className="flex justify-between items-center bg-muted/30 p-2 rounded border">
                                      <span className="text-sm font-medium">{tm.student_name}</span>
                                      <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => handleRemoveStudent(active.allocation.allocation_id, tm.student_id)}>Remove</Button>
                                    </div>
                                  ))
                                )}
                              </div>
                              <DialogFooter>
                                <Button variant="destructive" onClick={() => handleRevokeAllocation(active.allocation.allocation_id)}>Revoke Entire Allocation</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    );
                  })}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Escalations & Quick Filters */}
        <div className="space-y-6">
          <Card className="border-destructive/30 shadow-lg shadow-destructive/5 bg-destructive/5">
            <CardHeader className="border-b border-destructive/10 pb-4">
              <CardTitle className="text-destructive flex items-center gap-2 text-lg">
                <div className="relative flex h-3 w-3 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
                </div>
                Escalation Hub
              </CardTitle>
              <CardDescription className="text-destructive/80 font-medium">Requires immediate faculty intervention</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-destructive/10">
                {[
                  { type: "Mentor Alert", issue: "Student Sneha missing milestones", project: "DB Opt", time: "45m ago" },
                ].map((alert, i) => (
                  <div key={i} className="p-5 hover:bg-destructive/10 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="destructive" className="text-[10px] uppercase tracking-wider border-destructive/20 bg-destructive/10 text-destructive">{alert.type}</Badge>
                      <span className="text-[10px] font-bold text-destructive/70 flex items-center gap-1"><Clock className="h-3 w-3" /> {alert.time}</span>
                    </div>
                    <div className="text-sm font-bold text-foreground mb-1 leading-tight">{alert.issue}</div>
                    <div className="text-xs font-medium text-muted-foreground flex items-center gap-1.5"><Shield className="h-3 w-3" /> {alert.project}</div>
                    <Button size="sm" className="w-full mt-4 h-9 font-bold bg-destructive text-white hover:bg-destructive/90 shadow-md shadow-destructive/20">
                      Acknowledge & Resolve
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
            <CardHeader className="pb-4 border-b border-border/50">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-indigo-500" /> Administrative Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              
              <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start h-12 font-semibold">
                    <UserPlus className="mr-3 h-4 w-4 text-muted-foreground" /> Invite New Mentor
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite New Mentor</DialogTitle>
                    <DialogDescription>
                      Create a new mentor account and assign them to a domain.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleInviteMentor} className="space-y-4 mt-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>First Name</Label>
                        <Input required value={inviteForm.first_name} onChange={e => setInviteForm({...inviteForm, first_name: e.target.value})} placeholder="John" />
                      </div>
                      <div className="space-y-2">
                        <Label>Last Name</Label>
                        <Input required value={inviteForm.last_name} onChange={e => setInviteForm({...inviteForm, last_name: e.target.value})} placeholder="Doe" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input required type="email" value={inviteForm.email} onChange={e => setInviteForm({...inviteForm, email: e.target.value})} placeholder="mentor@skillforge.edu" />
                    </div>
                    <div className="space-y-2">
                      <Label>Temporary Password</Label>
                      <Input required type="password" value={inviteForm.password} onChange={e => setInviteForm({...inviteForm, password: e.target.value})} placeholder="••••••••" />
                    </div>
                    <div className="space-y-2">
                      <Label>Domain Specialization</Label>
                      <Select required value={inviteForm.domain} onValueChange={val => setInviteForm({...inviteForm, domain: val})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a domain" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Web Development">Web Development</SelectItem>
                          <SelectItem value="Artificial Intelligence">Artificial Intelligence</SelectItem>
                          <SelectItem value="Cyber Security">Cyber Security</SelectItem>
                          <SelectItem value="Data Science">Data Science</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <DialogFooter className="mt-6">
                      <Button type="button" variant="ghost" onClick={() => setIsInviteOpen(false)}>Cancel</Button>
                      <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">Send Invite</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <Button variant="outline" className="w-full justify-start h-12 font-semibold">
                <Target className="mr-3 h-4 w-4 text-muted-foreground" /> Review Level A Candidates
              </Button>
              <Button variant="outline" className="w-full justify-start h-12 font-semibold">
                <FileText className="mr-3 h-4 w-4 text-muted-foreground" /> Generate Compliance Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
}
