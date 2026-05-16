import { Home, BookOpen, FileText, Layout, Users, Trophy, Settings, Code } from "lucide-react";
import { Link, useLocation } from "react-router";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";

export function StudentSidebar() {
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/student" },
    { icon: BookOpen, label: "Learning Portal", path: "/learning" },
    { icon: FileText, label: "Exams", path: "/exam" },
    { icon: Layout, label: "Projects", path: "/projects" },
    { icon: Trophy, label: "Achievements", path: "/achievements" },
  ];

  return (
    <div className="flex flex-col h-full bg-card/30">
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-md shadow-primary/20">
            <Code className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-bold tracking-tight text-foreground">SkillForge</div>
            <div className="text-xs font-medium text-primary">Student Portal</div>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 ml-2">Navigation</div>
        {menuItems.map((item, i) => {
          const isActive = location.pathname === item.path;
          return (
            <Link to={item.path} key={i} className="block">
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start transition-all duration-200 ${isActive ? 'bg-primary/10 text-primary hover:bg-primary/15 font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <item.icon className={`mr-3 h-4 w-4 ${isActive ? 'text-primary' : ''}`} />
                {item.label}
              </Button>
            </Link>
          );
        })}

        <div className="mt-8 mb-2 ml-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account</div>
        <Link to="/settings" className="block">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground transition-all duration-200">
            <Settings className="mr-3 h-4 w-4" />
            Settings
          </Button>
        </Link>
      </nav>

      <div className="p-4 border-t border-border/50">
        <Card className="bg-gradient-to-br from-primary/10 to-indigo-500/10 border-primary/20 shadow-none overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Trophy className="h-16 w-16" />
          </div>
          <CardContent className="p-4 relative z-10">
            <div className="text-sm font-bold text-foreground mb-1">Upgrade to Pro</div>
            <div className="text-xs text-muted-foreground mb-4 leading-relaxed">Get unlimited access to advanced mentorship.</div>
            <Button size="sm" className="w-full bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 shadow-md">
              Upgrade Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
