import { useState, useEffect } from "react";
import { Search, Loader2, UserCheck, Star, Users, Briefcase } from "lucide-react";
import { motion } from "motion/react";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
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
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } }
};

export function FacultyMentorDirectory() {
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let active = true;
    const fetchMentors = async () => {
      try {
        setLoading(true);
        const response = await api.get("/users/admin/users");
        if (active) {
          setMentors(response.data.data.mentors || []);
          setError(null);
        }
      } catch (err: any) {
        console.error("Error loading mentors:", err);
        if (active) {
          setError("Failed to load mentor directories. Please try again.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    fetchMentors();
    return () => {
      active = false;
    };
  }, []);

  const filteredMentors = mentors.filter((mentor) => {
    return (
      `${mentor.first_name} ${mentor.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.details.domain.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="flex h-[55vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-cyan-500" />
        <p className="text-muted-foreground font-medium animate-pulse">Retrieving mentor directories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[55vh] flex-col items-center justify-center gap-4">
        <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-2">
          <span className="font-bold text-lg">!</span>
        </div>
        <p className="text-destructive font-medium">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
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
      {/* Counters Grid */}
      <motion.div variants={fadeIn} className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm border-l-4 border-l-cyan-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Mentors</div>
              <div className="text-2xl font-bold mt-1 text-cyan-500">{mentors.length}</div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <UserCheck className="h-5 w-5 text-cyan-500" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filter and Search controls */}
      <motion.div variants={fadeIn} className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card/30 backdrop-blur-sm p-4 rounded-xl border border-border/50">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search mentors by name, email or domain..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </motion.div>

      {/* Mentors Directory List */}
      <motion.div variants={fadeIn} className="space-y-3">
        {filteredMentors.length === 0 ? (
          <div className="text-center py-12 bg-card/25 rounded-xl border border-dashed border-border/50">
            <UserCheck className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
            <h3 className="text-lg font-bold text-foreground mb-1">No Mentors Found</h3>
            <p className="text-sm text-muted-foreground">Adjust filters or refine your search query.</p>
          </div>
        ) : (
          <>
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-muted/10 border border-border/50 rounded-xl text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <div className="col-span-4">Mentor Profile</div>
              <div className="col-span-3">Domain Specialization</div>
              <div className="col-span-2 text-center">Avg Rating</div>
              <div className="col-span-2 text-center">Assigned Students</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {filteredMentors.map((mentor) => (
              <div
                key={mentor.user_id}
                className="bg-card/40 hover:bg-card/80 backdrop-blur-sm border border-border/50 hover:border-cyan-500/30 transition-all duration-350 rounded-xl overflow-hidden group shadow-sm px-6 py-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
              >
                <div className="col-span-1 md:col-span-4 flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-border/50 shadow-sm flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white font-extrabold text-xs uppercase">
                      {mentor.first_name[0] || ""}{mentor.last_name[0] || ""}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-foreground text-sm group-hover:text-cyan-500 transition-colors leading-snug truncate">
                      {mentor.first_name} {mentor.last_name}
                    </h4>
                    <p className="text-xs font-medium text-muted-foreground truncate">{mentor.email}</p>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-3 flex items-center">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-semibold">{mentor.details.domain}</span>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 flex md:justify-center items-center">
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span className="font-extrabold text-sm">{mentor.details.rating}</span>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 flex md:justify-center items-center">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-extrabold text-sm">{mentor.details.students}</span>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-1 flex items-center justify-end">
                  <Button variant="ghost" size="sm" className="h-8 font-bold text-xs text-cyan-500 hover:text-cyan-600 hover:bg-cyan-500/10 px-2.5">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
