import { useState, useEffect } from "react";
import { UserCheck, CheckCircle, Briefcase, Calendar, RefreshCw, DollarSign, Users, History } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { api, facultyApi } from "../../../services/api.client";
import { toast } from "sonner";
import { ProjectTimeline } from "../../projects/components/ProjectTimeline";

export function FacultyApprovals() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApprovingP11, setIsApprovingP11] = useState(false);

  const fetchApprovals = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/mentors/projects/global");
      if (res.data.success) {
        setProjects(res.data.data.items || []);
      }
    } catch (err) {
      console.error("Failed to fetch approvals", err);
      toast.error("Failed to load approval data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleApproveP11 = async (projectId: number) => {
    if (!confirm("Are you sure you want to approve and mark this project as P11 (Completed)?")) return;
    setIsApprovingP11(true);
    try {
      const res = await facultyApi.approveProjectP11(projectId);
      if (res.success) {
        toast.success("Project marked as P11 completed.");
        fetchApprovals();
      } else {
        toast.error(res.message || "Failed to update project progress.");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "An error occurred.");
    } finally {
      setIsApprovingP11(false);
    }
  };

  // Filter ONLY projects that are at P10 and need P11 approval
  const approvalProjects = projects.filter(p => p.current_progress_level === "P10");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Project Approvals</h2>
          <p className="text-sm text-muted-foreground mt-1">Review projects that have completed Mentor QA and require final Faculty approval.</p>
        </div>
      </div>

      {isLoading ? (
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <RefreshCw className="h-10 w-10 animate-spin text-indigo-500 mb-4" />
            <p className="text-muted-foreground font-semibold">Loading approval requests...</p>
          </CardContent>
        </Card>
      ) : approvalProjects.length === 0 ? (
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <CheckCircle className="h-12 w-12 text-emerald-500 opacity-60 mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-1">All Caught Up!</h3>
            <p className="text-sm text-muted-foreground max-w-sm">There are no projects pending final P11 approval at this time.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {approvalProjects.map(project => {
            const teamSize = project.allocation?.team_members?.length || 0;
            const mentorName = project.allocation?.mentor_name || "Unassigned";
            const mentorEmail = project.allocation?.mentor_email || "NIL";
            const mentorPhone = project.allocation?.mentor_phone || "NIL";

            return (
              <Card key={project.project_id} className="bg-card/50 backdrop-blur-sm border-border/50 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden relative">
                {/* Accent Top Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500"></div>

                <CardHeader className="border-b border-border/40 pb-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider bg-background shadow-sm border-border/50">
                          {project.domain?.name || "General Client"}
                        </Badge>
                        <Badge className="text-[10px] uppercase font-bold tracking-wider bg-amber-500 text-white">
                          P10 Pending Approval
                        </Badge>
                      </div>
                      <CardTitle className="text-xl font-extrabold text-foreground">{project.title}</CardTitle>
                      <CardDescription className="text-sm font-medium mt-1">{project.description}</CardDescription>
                    </div>

                    <div className="flex sm:flex-col gap-4 sm:text-right shrink-0">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Budget</div>
                        <div className="font-extrabold text-lg text-emerald-500 flex items-center sm:justify-end"><DollarSign className="w-4 h-4 shrink-0" />{Number(project.budget).toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Deadline</div>
                        <div className="text-sm font-bold text-foreground flex items-center sm:justify-end gap-1.5 mt-0.5">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          {project.deadline ? new Date(project.deadline).toLocaleDateString() : "No Deadline"}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  {/* Supervisor & Team row */}
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Supervisor */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <UserCheck className="w-4 h-4 text-indigo-500" /> Supervising Mentor
                      </h4>
                      <Card className="bg-background/40 border-border/40 shadow-inner">
                        <CardContent className="p-4 space-y-2 text-sm">
                          <div className="font-bold text-foreground text-base">{mentorName}</div>
                          <div className="text-muted-foreground flex flex-col gap-1 text-xs">
                            <span>Email: <span className="font-semibold text-foreground">{mentorEmail}</span></span>
                            <span>Phone: <span className="font-semibold text-foreground">{mentorPhone}</span></span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Team Members */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-cyan-500" /> Assigned Student Team ({teamSize})
                        </h4>
                      </div>

                      <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
                        {teamSize === 0 ? (
                          <div className="text-xs text-muted-foreground p-4 bg-background/30 rounded-lg border border-border/40 border-dashed text-center">
                            No students allocated.
                          </div>
                        ) : (
                          project.allocation?.team_members?.map((tm: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center p-2 border border-border/40 rounded-xl bg-background/50 text-xs gap-3">
                              <div>
                                <div className="font-bold text-foreground">{tm.student_name}</div>
                                <div className="text-muted-foreground mt-0.5">{tm.student_email}</div>
                              </div>
                              {tm.role && <Badge variant="outline" className="text-[10px] font-semibold bg-background">{tm.role}</Badge>}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Progress Lifecycle Tracking */}
                  <div className="pt-4 border-t border-border/40">
                    <ProjectTimeline 
                      currentLevel={project.current_progress_level} 
                      history={project.progress_history || []} 
                      layout="vertical"
                    />
                    <div className="mt-4 flex justify-end">
                      <Button 
                        onClick={() => handleApproveP11(project.project_id)} 
                        disabled={isApprovingP11}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg transition-all"
                      >
                        {isApprovingP11 ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                        Approve & Mark as P11 (Completed)
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
