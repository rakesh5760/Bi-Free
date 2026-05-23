import { useEffect, useState } from "react";
import { Briefcase, Clock, DollarSign, Users, RefreshCw, AlertCircle, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { clientApi } from "../../../services/api.client";

export function ClientProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <RefreshCw className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (error) {
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
        </div>
      </div>

      {projects.length === 0 ? (
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <Briefcase className="h-12 w-12 mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-bold mb-2">No Projects Found</h3>
            <p className="text-muted-foreground max-w-sm mb-6">You haven't posted any projects yet. Click the "Post New Project" button to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => {
            const membersCount = project.allocation?.team_members?.length || 0;
            const teamName = project.allocation?.team_name || "Unassigned";

            return (
              <Card key={i} className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 flex flex-col">
                <CardHeader className="pb-4 border-b border-border/50">
                  <div className="flex justify-between items-start mb-2">
                    <Badge 
                      variant={project.status === "Completed" ? "default" : "secondary"} 
                      className={`text-[10px] uppercase tracking-wider font-bold ${
                        project.status === "Completed" ? "bg-indigo-500" : 
                        project.status === "Mentor QA" ? "bg-amber-500 text-white" : 
                        project.status === "In Progress" ? "bg-emerald-500 text-white" : ""
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
                      <span className="font-semibold text-foreground">${Number(project.budget).toLocaleString()}</span> Budget
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

                  <div className="flex gap-2 mt-auto">
                    <Button variant="outline" className="w-full font-semibold">View Details</Button>
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
