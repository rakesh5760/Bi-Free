import { useState, useEffect } from "react";
import { Briefcase, Loader2, Users, Search, FolderKanban } from "lucide-react";
import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { api } from "../../../services/api.client";
import { useNavigate } from "react-router";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export function MentorProjects() {
  const [allocations, setAllocations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAllocations() {
      try {
        const response = await api.get('/mentors/allocations/me');
        if (response.data.success) {
          setAllocations(response.data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch mentor projects", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAllocations();
  }, []);

  const filteredAllocations = allocations.filter((a) => {
    const q = searchQuery.toLowerCase();
    return (
      a.title?.toLowerCase().includes(q) ||
      a.allocation?.team_name?.toLowerCase().includes(q) ||
      a.allocation?.team_members?.some((m: any) => m.student_name?.toLowerCase().includes(q))
    );
  });

  return (
    <motion.div 
      className="space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Allocated Projects</h2>
          <p className="text-muted-foreground">Manage and track projects assigned to your student teams.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects or students..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredAllocations.length === 0 ? (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <FolderKanban className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">No Projects Found</h3>
            <p className="text-muted-foreground max-w-sm">
              {searchQuery ? "No projects match your search criteria." : "You have not been allocated any projects yet."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <motion.div variants={fadeIn} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAllocations.map((project, i) => (
            <Card key={i} className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                    {project.domain?.name || "Web Development"}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`uppercase text-[10px] tracking-wider
                      ${project.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                        project.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                        'bg-muted text-muted-foreground'}`}
                  >
                    {project.status || "Active"}
                  </Badge>
                </div>
                <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
                <CardDescription className="line-clamp-2 mt-2">{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="mb-4 flex-1">
                  <div className="text-sm font-semibold mb-2 flex items-center gap-2 text-foreground/80">
                    <Users className="h-4 w-4" /> Team: {project.allocation?.team_name || "Unknown Team"}
                  </div>
                  <div className="flex flex-col gap-2 mt-3">
                    {(project.allocation?.team_members || []).map((member: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3 p-2 rounded-md bg-muted/30">
                        <Avatar className="h-8 w-8 border border-border/50">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                            {member.student_name ? member.student_name.substring(0, 2).toUpperCase() : "S"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{member.student_name || "Unknown Student"}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{member.role_in_team || "Member"}</p>
                        </div>
                      </div>
                    ))}
                    {(!project.allocation?.team_members || project.allocation.team_members.length === 0) && (
                      <p className="text-sm text-muted-foreground italic">No students allocated yet.</p>
                    )}
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-4" 
                  onClick={() => navigate(`/projects?id=${project.project_id}`)}
                >
                  <Briefcase className="h-4 w-4 mr-2" /> View Project Workspace
                </Button>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
