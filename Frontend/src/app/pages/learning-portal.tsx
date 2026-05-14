import { BookOpen, Code, Database, Globe, Trophy, Star, Clock, Play, CheckCircle, Lock, Home, FileText, Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { DashboardLayout } from "../components/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

function Sidebar() {
  const menuItems = [
    { icon: Home, label: "Dashboard" },
    { icon: BookOpen, label: "Learning Paths", active: true },
    { icon: Trophy, label: "Achievements" },
    { icon: FileText, label: "Certificates" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-2">
          <BookOpen className="h-6 w-6 text-white" />
        </div>
        <div className="font-semibold">SkillForge</div>
        <div className="text-xs text-muted-foreground">Learning Portal</div>
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
    </div>
  );
}

export default function LearningPortal() {
  const learningPaths = [
    {
      title: "Full Stack Web Development",
      icon: Globe,
      courses: 12,
      duration: "6 months",
      progress: 65,
      level: "Intermediate",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Frontend Engineering",
      icon: Code,
      courses: 8,
      duration: "4 months",
      progress: 45,
      level: "Beginner",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Backend & APIs",
      icon: Database,
      courses: 10,
      duration: "5 months",
      progress: 30,
      level: "Intermediate",
      color: "from-green-500 to-emerald-500"
    },
  ];

  const courses = [
    { title: "Advanced React Patterns", instructor: "Sarah Kumar", duration: "4.5 hours", progress: 75, enrolled: true, rating: 4.8 },
    { title: "Node.js & Express Mastery", instructor: "Vikram Mehta", duration: "6 hours", progress: 45, enrolled: true, rating: 4.9 },
    { title: "Database Design & SQL", instructor: "Priya Sharma", duration: "5 hours", progress: 0, enrolled: false, rating: 4.7 },
    { title: "TypeScript Fundamentals", instructor: "Arjun Nair", duration: "3 hours", progress: 100, enrolled: true, rating: 4.6 },
  ];

  const achievements = [
    { title: "First Course Completed", icon: Trophy, earned: true, date: "Mar 15, 2026" },
    { title: "5 Day Streak", icon: Star, earned: true, date: "Apr 02, 2026" },
    { title: "Perfect Score", icon: CheckCircle, earned: false, date: null },
    { title: "10 Courses Completed", icon: Trophy, earned: false, date: null },
  ];

  return (
    <DashboardLayout sidebar={<Sidebar />} title="Learning Portal">
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-muted-foreground">Courses Enrolled</div>
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-1">8</div>
              <div className="text-xs text-muted-foreground">3 completed</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-muted-foreground">Learning Hours</div>
                <Clock className="h-5 w-5 text-secondary" />
              </div>
              <div className="text-3xl font-bold mb-1">42.5</div>
              <div className="text-xs text-muted-foreground">This month</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-muted-foreground">Achievements</div>
                <Trophy className="h-5 w-5 text-accent" />
              </div>
              <div className="text-3xl font-bold mb-1">12</div>
              <div className="text-xs text-muted-foreground">8 more to unlock</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Learning Paths</CardTitle>
            <CardDescription>Structured journeys to master different domains</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              {learningPaths.map((path, i) => (
                <Card key={i} className="hover:shadow-lg transition-all border-border/50 overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${path.color}`} />
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${path.color} flex items-center justify-center`}>
                        <path.icon className="h-6 w-6 text-white" />
                      </div>
                      <Badge variant="outline">{path.level}</Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{path.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span>{path.courses} courses</span>
                      <span>{path.duration}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{path.progress}%</span>
                      </div>
                      <Progress value={path.progress} className="h-2" />
                    </div>
                    <Button className="w-full mt-4" variant={path.progress > 0 ? "default" : "outline"}>
                      {path.progress > 0 ? "Continue Learning" : "Start Path"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Courses</CardTitle>
            <CardDescription>Track your course progress</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="enrolled">
              <TabsList>
                <TabsTrigger value="enrolled">Enrolled</TabsTrigger>
                <TabsTrigger value="recommended">Recommended</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              <TabsContent value="enrolled" className="space-y-4 mt-4">
                {courses.filter(c => c.enrolled && c.progress < 100).map((course, i) => (
                  <div key={i} className="p-4 border rounded-lg hover:shadow-md transition-all bg-card/50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{course.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>by {course.instructor}</span>
                          <span>{course.duration}</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{course.rating}</span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm">
                        <Play className="mr-2 h-4 w-4" />
                        Continue
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="recommended" className="space-y-4 mt-4">
                {courses.filter(c => !c.enrolled).map((course, i) => (
                  <div key={i} className="p-4 border rounded-lg hover:shadow-md transition-all bg-muted/30">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{course.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>by {course.instructor}</span>
                          <span>{course.duration}</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{course.rating}</span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Enroll Now
                      </Button>
                    </div>
                    <Badge variant="secondary" className="mt-2">
                      Recommended for Level B students
                    </Badge>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="completed" className="space-y-4 mt-4">
                {courses.filter(c => c.progress === 100).map((course, i) => (
                  <div key={i} className="p-4 border rounded-lg bg-green-500/5 border-green-500/20">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{course.title}</h3>
                          <div className="text-sm text-muted-foreground">by {course.instructor}</div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        View Certificate
                      </Button>
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
              <CardTitle>Achievements</CardTitle>
              <CardDescription>Badges and milestones you've earned</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {achievements.map((achievement, i) => (
                <div
                  key={i}
                  className={`p-4 border rounded-lg text-center transition-all ${
                    achievement.earned
                      ? 'bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20 hover:shadow-md'
                      : 'bg-muted/30 opacity-50'
                  }`}
                >
                  <achievement.icon className={`h-8 w-8 mx-auto mb-2 ${achievement.earned ? 'text-primary' : 'text-muted-foreground'}`} />
                  <div className="font-medium text-sm mb-1">{achievement.title}</div>
                  {achievement.earned ? (
                    <div className="text-xs text-muted-foreground">{achievement.date}</div>
                  ) : (
                    <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                      <Lock className="h-3 w-3" />
                      <span>Locked</span>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Recommendations</CardTitle>
              <CardDescription>Personalized course suggestions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { title: "GraphQL for Modern APIs", reason: "Based on your interest in backend development", match: 92 },
                { title: "Advanced CSS & Animations", reason: "Complements your frontend skills", match: 88 },
                { title: "System Design Fundamentals", reason: "Next step for Level B students", match: 85 },
              ].map((rec, i) => (
                <div key={i} className="p-4 border rounded-lg hover:shadow-md transition-all bg-card/50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-medium text-sm mb-1">{rec.title}</div>
                      <div className="text-xs text-muted-foreground">{rec.reason}</div>
                    </div>
                    <Badge variant="secondary" className="text-xs">{rec.match}% match</Badge>
                  </div>
                  <Button size="sm" variant="outline" className="w-full mt-2">
                    View Course
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
