import { BookOpen, Code, Database, Globe, Trophy, Star, Play, CheckCircle, Lock, Target, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { useAuthStore } from "../../store/useAuthStore";
import { StudentSidebar } from "../student-dashboard/components/StudentSidebar";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function LearningPortal() {
  const { user } = useAuthStore();
  const level = user?.studentLevel || 'D';

  const learningPaths = [
    {
      title: "Full Stack Web Development",
      icon: Globe,
      courses: 12,
      duration: "6 months",
      progress: 65,
      level: "Intermediate",
      color: "from-blue-500 to-cyan-500",
      bgLight: "bg-blue-500/10",
      textCol: "text-blue-500"
    },
    {
      title: "Frontend Engineering",
      icon: Code,
      courses: 8,
      duration: "4 months",
      progress: 45,
      level: "Beginner",
      color: "from-purple-500 to-pink-500",
      bgLight: "bg-purple-500/10",
      textCol: "text-purple-500"
    },
    {
      title: "Backend & APIs",
      icon: Database,
      courses: 10,
      duration: "5 months",
      progress: 30,
      level: "Intermediate",
      color: "from-emerald-500 to-teal-500",
      bgLight: "bg-emerald-500/10",
      textCol: "text-emerald-500"
    },
  ];

  const courses = [
    { title: "Advanced React Patterns", instructor: "Sarah Kumar", duration: "4.5 hours", progress: 75, enrolled: true, rating: 4.8 },
    { title: "Node.js & Express Mastery", instructor: "Vikram Mehta", duration: "6 hours", progress: 45, enrolled: true, rating: 4.9 },
    { title: "Database Design & SQL", instructor: "Priya Sharma", duration: "5 hours", progress: 0, enrolled: false, rating: 4.7 },
  ];

  return (
    <DashboardLayout sidebar={<StudentSidebar />} title="Incubation Pipeline">
      <motion.div 
        className="space-y-8"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Dynamic Pipeline Status Banner */}
        <motion.div variants={fadeIn}>
          <Card className={`border-0 shadow-lg overflow-hidden relative bg-gradient-to-r ${level === 'A' || level === 'B' ? 'from-emerald-500/10 to-teal-500/5' : 'from-indigo-500/10 to-blue-500/5'}`}>
            <div className={`absolute top-0 right-0 w-64 h-64 blur-3xl rounded-full opacity-20 -mr-10 -mt-10 ${level === 'A' || level === 'B' ? 'bg-emerald-500' : 'bg-indigo-500'}`} />
            <CardContent className="p-8 flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
              <div className={`h-16 w-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner ${level === 'A' || level === 'B' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-indigo-500/20 text-indigo-500'}`}>
                {level === 'A' ? <Target className="h-8 w-8" /> : <BookOpen className="h-8 w-8" />}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-extrabold text-foreground tracking-tight mb-1">
                  {level === 'A' ? 'Project Execution Phase' : 
                   level === 'B' ? 'Mock Project Phase' : 
                   level === 'C' ? 'Domain Specialization' : 'Foundation Phase'}
                </h2>
                <p className="text-muted-foreground font-medium mb-4">
                  {level === 'A' ? 'You are qualified to take on real client projects. Keep your trust score high.' : 
                   level === 'B' ? 'Complete mentor-assigned mock projects to prove your readiness.' : 
                   'Complete your fundamental courses to unlock the next incubation level.'}
                </p>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="bg-background/50 border-border/50 py-1">
                    Level {level} Student
                  </Badge>
                  {level !== 'A' && (
                    <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                      Next: Level {String.fromCharCode(level.charCodeAt(0) - 1)} <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-shrink-0 w-full md:w-48 text-right">
                <div className="text-sm font-bold text-foreground mb-2">Phase Completion</div>
                <Progress value={level === 'A' ? 100 : level === 'B' ? 65 : 30} className="h-2.5 bg-background/50" />
                <div className="text-xs font-semibold text-muted-foreground mt-2 text-right">{level === 'A' ? '100' : level === 'B' ? '65' : '30'}% Completed</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Tabs defaultValue={level === 'A' || level === 'B' ? "assignments" : "learning"} className="w-full">
          <TabsList className="mb-6 bg-card/50 backdrop-blur-md border border-border/50">
            <TabsTrigger value="learning" className="font-semibold">Learning Paths</TabsTrigger>
            <TabsTrigger value="assignments" className="font-semibold">Assignments</TabsTrigger>
            <TabsTrigger value="achievements" className="font-semibold">Milestones</TabsTrigger>
          </TabsList>

          <TabsContent value="learning" className="space-y-6">
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid gap-6 md:grid-cols-3">
              {learningPaths.map((path, i) => (
                <motion.div variants={fadeIn} key={i}>
                  <Card className="h-full border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
                    <div className={`h-2 w-full bg-gradient-to-r ${path.color}`} />
                    <CardContent className="p-6">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-6 ${path.bgLight} ${path.textCol}`}>
                        <path.icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-foreground">{path.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium mb-6">
                        <span>{path.courses} Modules</span>
                        <span>•</span>
                        <span>{path.duration}</span>
                      </div>
                      <div className="space-y-2 mb-6">
                        <div className="flex justify-between text-sm font-bold">
                          <span>Progress</span>
                          <span className={path.textCol}>{path.progress}%</span>
                        </div>
                        <Progress value={path.progress} className="h-2" />
                      </div>
                      <Button className="w-full font-semibold" variant={path.progress > 0 ? "default" : "outline"}>
                        {path.progress > 0 ? "Continue Learning" : "Start Path"}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-6">
            {level === 'D' || level === 'C' ? (
              <motion.div variants={fadeIn}>
                <Card className="bg-muted/30 border-dashed border-border/60">
                  <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <Lock className="h-16 w-16 text-muted-foreground/50 mb-4" />
                    <h3 className="text-xl font-bold mb-2">Assignments Locked</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      You must reach Level B (Mock Project Phase) to unlock mentor-assigned tasks. Focus on completing your learning paths first.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid gap-6 md:grid-cols-2">
                {[
                  { title: "Build an Authentication Flow", desc: "Implement JWT login using React and Node.js", deadline: "Tomorrow", status: "Active" },
                  { title: "Database Schema Design", desc: "Design a relational schema for an e-commerce platform", deadline: "In 3 days", status: "Active" }
                ].map((assignment, i) => (
                  <motion.div variants={fadeIn} key={i}>
                    <Card className="hover:shadow-md transition-shadow bg-card/60 border-border/50">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-bold text-lg">{assignment.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{assignment.desc}</p>
                          </div>
                          <Badge>{assignment.status}</Badge>
                        </div>
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
                          <div className="text-sm font-semibold text-orange-500">Due: {assignment.deadline}</div>
                          <Button size="sm">Submit Work</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid gap-6 md:grid-cols-4">
               {[
                  { title: "First Course Completed", icon: Trophy, earned: true, date: "Mar 15, 2026" },
                  { title: "5 Day Streak", icon: Star, earned: true, date: "Apr 02, 2026" },
                  { title: "Perfect Score", icon: CheckCircle, earned: false, date: null },
                  { title: "Level B Reached", icon: Target, earned: level === 'A' || level === 'B', date: null },
                ].map((achievement, i) => (
                <motion.div variants={fadeIn} key={i}>
                  <Card className={`h-full border-border/50 transition-all ${achievement.earned ? 'bg-card/60 hover:shadow-md' : 'bg-muted/20 opacity-70'}`}>
                    <CardContent className="p-6 text-center flex flex-col items-center justify-center h-full">
                      <div className={`h-16 w-16 rounded-full flex items-center justify-center mb-4 ${achievement.earned ? 'bg-yellow-500/20 text-yellow-500' : 'bg-muted text-muted-foreground'}`}>
                        <achievement.icon className="h-8 w-8" />
                      </div>
                      <h3 className="font-bold mb-2">{achievement.title}</h3>
                      {achievement.earned ? (
                        <div className="text-xs font-semibold text-muted-foreground">{achievement.date}</div>
                      ) : (
                        <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                          <Lock className="h-3 w-3" /> Locked
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </DashboardLayout>
  );
}
