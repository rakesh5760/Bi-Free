import { useState, useEffect } from "react";
import { Users, Loader2, Award, Briefcase, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import { api } from "../../../services/api.client";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const fadeIn = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export function MentorStudentsList() {
  const [allocations, setAllocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllocations() {
      try {
        const res = await api.get('/mentors/allocations/me');
        if (res.data.success) {
          setAllocations(res.data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch mentor allocations", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAllocations();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[55vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-violet-500" />
        <p className="text-muted-foreground font-medium animate-pulse">Loading assigned students...</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-6 w-6 text-violet-500" />
        <h2 className="text-2xl font-bold">My Students</h2>
      </div>

      {allocations.length === 0 ? (
        <Card className="bg-card/25 border-dashed border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <h3 className="text-lg font-bold text-foreground mb-1">No Students Assigned</h3>
            <p className="text-sm text-muted-foreground">You have not been assigned to any project allocations yet.</p>
          </CardContent>
        </Card>
      ) : (
        allocations.map((allocation) => (
          <motion.div key={allocation.allocation_id} variants={fadeIn}>
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm overflow-hidden mb-6">
              <div className="bg-muted/20 px-6 py-4 border-b border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-violet-500" />
                  <h3 className="font-bold text-lg">Project #{allocation.project_id}</h3>
                  <Badge variant="outline" className="text-[10px] uppercase tracking-wider border-violet-500/30 text-violet-500 bg-violet-500/10">
                    Active Allocation
                  </Badge>
                </div>
              </div>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  {(!allocation.team_members || allocation.team_members.length === 0) ? (
                    <div className="p-6 text-center text-muted-foreground font-medium text-sm">
                      No students have been added to this project team yet.
                    </div>
                  ) : (
                    allocation.team_members.map((member: any) => (
                      <div key={member.team_member_id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/10 transition-colors">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12 border border-border/50 shadow-sm">
                            <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-500 text-white font-bold text-sm">
                              {member.student_name ? member.student_name.split(' ').map((n: string) => n[0]).join('') : "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-bold text-foreground text-base">
                              {member.student_name || "Unknown Student"}
                            </div>
                            <div className="text-xs font-medium text-muted-foreground flex items-center gap-2 mt-1">
                              Added {new Date(member.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button variant="outline" size="sm" className="h-9">
                            View Progress
                          </Button>
                          <Button size="icon" variant="ghost" className="h-9 w-9 text-muted-foreground hover:text-foreground">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))
      )}
    </motion.div>
  );
}
