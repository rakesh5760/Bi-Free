import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Briefcase, Clock, DollarSign, Users, RefreshCw, AlertCircle, Calendar, XCircle, Mail, Phone, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { clientApi } from "../../../services/api.client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "../../../components/ui/dialog";
import { Textarea } from "../../../components/ui/textarea";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { PlusCircle } from "lucide-react";

export function ClientProjects() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRevoked, setShowRevoked] = useState(false);

  const [selectedProjectToView, setSelectedProjectToView] = useState<any | null>(null);
  const [selectedProjectToRevoke, setSelectedProjectToRevoke] = useState<any | null>(null);
  const [revokeReason, setRevokeReason] = useState("");
  const [isRevoking, setIsRevoking] = useState(false);

  const [isPostOpen, setIsPostOpen] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '', budget: '', deadline: '' });

  useEffect(() => {
    if (searchParams.get("post") === "true") {
      setIsPostOpen(true);
    }
  }, [searchParams]);

  const setPostOpenState = (open: boolean) => {
    setIsPostOpen(open);
    if (!open && searchParams.get("post") === "true") {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("post");
      setSearchParams(newParams, { replace: true });
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await clientApi.getProjects({ size: 100 });
      setProjects(response.data?.items || []);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleRevokeSubmit = async () => {
    if (!selectedProjectToRevoke || !revokeReason.trim()) return;
    
    setIsRevoking(true);
    try {
      await clientApi.revokeProject(selectedProjectToRevoke.project_id, revokeReason);
      setProjects(projects.map(p => 
        p.project_id === selectedProjectToRevoke.project_id 
          ? { ...p, status: "Revoked", revocation_reason: revokeReason } 
          : p
      ));
      setSelectedProjectToRevoke(null);
      setRevokeReason("");
      toast.success("Project has been revoked successfully.");
    } catch (err: any) {
      console.error("Revoke project error:", err);
      let errorMsg = "Failed to revoke project.";
      if (err.response?.data?.detail) {
        if (typeof err.response.data.detail === 'string') {
          errorMsg = err.response.data.detail;
        } else if (Array.isArray(err.response.data.detail)) {
          errorMsg = err.response.data.detail.map((e: any) => e.msg).join(', ');
        }
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.message) {
        errorMsg = err.message;
      }
      toast.error(errorMsg, {
        description: "If the project is active or completed, it may not be revokable."
      });
    } finally {
      setIsRevoking(false);
    }
  };

  const handlePostProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title.trim() || !newProject.budget) return;
    
    setIsPosting(true);
    try {
      const payload = {
        title: newProject.title,
        description: newProject.description,
        budget: parseFloat(newProject.budget),
        deadline: newProject.deadline || null
      };
      await clientApi.createProject(payload);
      toast.success("Project posted successfully! It has been sent to the Faculty Dashboard.");
      setPostOpenState(false);
      setNewProject({ title: '', description: '', budget: '', deadline: '' });
      fetchProjects();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || err.response?.data?.detail || "Failed to post project.");
    } finally {
      setIsPosting(false);
    }
  };

  if (loading && projects.length === 0) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <RefreshCw className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (error && projects.length === 0) {
    return (
      <div className="p-6">
        <Card className="bg-red-500/10 border-red-500/50 text-red-600 dark:text-red-400">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <AlertCircle className="h-12 w-12 mb-4 text-red-500" />
            <h3 className="text-lg font-bold mb-2">Error Loading Projects</h3>
            <p className="mb-4 text-sm font-medium">{error}</p>
            <Button onClick={fetchProjects} variant="outline" className="border-red-500/50 hover:bg-red-500/20 text-red-600">
              <RefreshCw className="mr-2 h-4 w-4" /> Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">My Projects</h2>
          <p className="text-muted-foreground">Manage and track all your posted projects.</p>
          <div className="flex gap-2 mt-4">
            <Button size="sm" variant={!showRevoked ? "default" : "outline"} onClick={() => setShowRevoked(false)} className={!showRevoked ? "bg-emerald-600 hover:bg-emerald-700" : ""}>
              All Active
            </Button>
            <Button size="sm" variant={showRevoked ? "default" : "outline"} onClick={() => setShowRevoked(true)} className={showRevoked ? "bg-red-500 hover:bg-red-600 text-white" : ""}>
              Revoked
            </Button>
          </div>
        </div>
        <Dialog open={isPostOpen} onOpenChange={setPostOpenState}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-500/20">
              <PlusCircle className="mr-2 h-5 w-5" /> Post New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Post a New Project</DialogTitle>
              <DialogDescription>
                Provide the details of your project. Once posted, faculty will review it and allocate a team.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handlePostProject} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title <span className="text-red-500">*</span></Label>
                <Input 
                  id="title" 
                  required 
                  placeholder="E.g. E-commerce Mobile App"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Briefly describe your idea, features needed, etc."
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget (₹) <span className="text-red-500">*</span></Label>
                  <Input 
                    id="budget" 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    required 
                    placeholder="E.g. 5000"
                    value={newProject.budget}
                    onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input 
                    id="deadline" 
                    type="date" 
                    value={newProject.deadline}
                    onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setPostOpenState(false)} disabled={isPosting}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white" disabled={!newProject.title.trim() || !newProject.budget || isPosting}>
                  {isPosting ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Submit Project
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {projects.filter(p => showRevoked ? p.status === "Revoked" : p.status !== "Revoked").length === 0 ? (
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <Briefcase className="h-12 w-12 mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-bold mb-2">No Projects Found</h3>
            <p className="text-muted-foreground max-w-sm mb-6">There are no {showRevoked ? "revoked" : "active"} projects to display.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.filter(p => showRevoked ? p.status === "Revoked" : p.status !== "Revoked").map((project, i) => {
            const membersCount = project.allocation?.team_members?.length || 0;
            const teamName = project.allocation?.team_name || "Unassigned";

            return (
              <Card key={i} className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 flex flex-col relative overflow-hidden">
                {project.status === "Revoked" && (
                  <div className="absolute top-0 right-0 left-0 h-1 bg-red-500"></div>
                )}
                <CardHeader className="pb-4 border-b border-border/50">
                  <div className="flex justify-between items-start mb-2">
                    <Badge 
                      variant={project.status === "Completed" || project.status === "Revoked" ? "default" : "secondary"} 
                      className={`text-[10px] uppercase tracking-wider font-bold ${
                        project.status === "Completed" ? "bg-indigo-500" : 
                        project.status === "Mentor QA" ? "bg-amber-500 text-white" : 
                        project.status === "In Progress" ? "bg-emerald-500 text-white" :
                        project.status === "Revoked" ? "bg-red-500 text-white" : ""
                      }`}
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-bold line-clamp-2" title={project.title}>
                    {project.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 mt-2 text-sm" title={project.description}>
                    {project.description || "No description provided."}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4 text-emerald-500" />
                      <span className="font-semibold text-foreground">₹{Number(project.budget).toLocaleString()}</span> Budget
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      {project.deadline ? (
                        <span><span className="font-semibold text-foreground">{format(new Date(project.deadline), 'MMM dd, yyyy')}</span> Deadline</span>
                      ) : (
                        <span>No deadline set</span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Users className="h-4 w-4 text-amber-500" />
                      <span><span className="font-semibold text-foreground">{teamName}</span> ({membersCount} members)</span>
                    </div>
                  </div>

                    <div className="flex flex-col gap-2 mt-auto">
                      <Button onClick={() => setSelectedProjectToView(project)} variant="outline" className="w-full font-semibold">View Details</Button>
                      {project.status !== "Completed" && project.status !== "Revoked" && (
                        <Button onClick={() => setSelectedProjectToRevoke(project)} variant="outline" className="w-full font-semibold border-red-500/30 text-red-500 hover:bg-red-500/10">
                          <XCircle className="w-4 h-4 mr-2" /> Revoke Project
                        </Button>
                      )}
                    </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Revoke Project Modal */}
      <Dialog open={!!selectedProjectToRevoke} onOpenChange={(open) => !open && setSelectedProjectToRevoke(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-500 flex items-center gap-2"><XCircle className="w-5 h-5" /> Revoke Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to revoke "{selectedProjectToRevoke?.title}"? Please provide a reason below. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              placeholder="E.g., Business requirements changed, no longer needed..."
              value={revokeReason}
              onChange={(e) => setRevokeReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedProjectToRevoke(null)} disabled={isRevoking}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRevokeSubmit} disabled={!revokeReason.trim() || isRevoking}>
              {isRevoking ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : null}
              Confirm Revocation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Modal */}
      <Dialog open={!!selectedProjectToView} onOpenChange={(open) => !open && setSelectedProjectToView(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedProjectToView?.title}</DialogTitle>
            <DialogDescription>Project Allocation Details</DialogDescription>
          </DialogHeader>
          
          {selectedProjectToView?.status === "Revoked" && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-600 rounded-lg p-4 my-4 text-sm">
              <span className="font-bold block mb-1">Revocation Reason:</span>
              {selectedProjectToView.revocation_reason || "No reason provided."}
            </div>
          )}

          <div className="grid gap-6 py-4">
            {/* Mentor Details */}
            <div>
              <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" /> Assigned Mentor
              </h4>
              {selectedProjectToView?.allocation?.mentor_id ? (
                <Card className="bg-muted/30 border-border/50">
                  <CardContent className="p-4 flex flex-col gap-1">
                    <span className="font-semibold text-lg">{selectedProjectToView.allocation.mentor_name}</span>
                    <span className="flex items-center gap-2 text-sm text-muted-foreground"><Mail className="w-3.5 h-3.5" /> {selectedProjectToView.allocation.mentor_email || "N/A"}</span>
                    <span className="flex items-center gap-2 text-sm text-muted-foreground"><Phone className="w-3.5 h-3.5" /> {selectedProjectToView.allocation.mentor_phone || "N/A"}</span>
                  </CardContent>
                </Card>
              ) : (
                <div className="text-sm text-muted-foreground p-4 bg-muted/20 rounded-lg border border-border/50">No mentor assigned yet.</div>
              )}
            </div>

            {/* Students Details */}
            <div>
              <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" /> Assigned Students ({selectedProjectToView?.allocation?.team_members?.length || 0})
              </h4>
              
              {selectedProjectToView?.allocation?.team_members?.length > 0 ? (
                <div className="space-y-3">
                  {selectedProjectToView.allocation.team_members.map((member: any, idx: number) => (
                    <Card key={idx} className="bg-muted/30 border-border/50">
                      <CardContent className="p-4 flex justify-between items-center">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold">{member.student_name}</span>
                          <span className="flex items-center gap-2 text-xs text-muted-foreground"><Mail className="w-3 h-3" /> {member.student_email || "N/A"}</span>
                        </div>
                        {member.role && (
                          <Badge variant="outline" className="text-xs bg-background">{member.role}</Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground p-4 bg-muted/20 rounded-lg border border-border/50">No students assigned yet.</div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setSelectedProjectToView(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
