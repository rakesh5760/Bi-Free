import { Layout, Calendar, Users, Home, Settings, Code, GitPullRequest, GitMerge } from "lucide-react";
import { Link, useLocation } from "react-router";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";

export function ProjectSidebar() {
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/projects" },
    { icon: Layout, label: "Kanban Board", path: "/projects/board" },
    { icon: Calendar, label: "Timeline", path: "/projects/timeline" },
    { icon: Users, label: "Team Directory", path: "/projects/team" },
  ];

  return (
    <div className="flex flex-col h-full bg-card/30">
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Layout className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-bold tracking-tight text-foreground">SkillForge</div>
            <div className="text-xs font-medium text-indigo-500">Project Management</div>
          </div>
        </div>
        <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-500/90 hover:to-purple-600/90 shadow-md font-bold h-11">
          <Code className="mr-2 h-4 w-4" />
          New Ticket
        </Button>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 ml-2">Workspace</div>
        {menuItems.map((item, i) => {
          const isActive = location.pathname === item.path || (item.path !== '/projects' && location.pathname.startsWith(item.path));
          return (
            <Link to={item.path} key={i} className="block">
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start transition-all duration-200 ${isActive ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/15 font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <item.icon className={`mr-3 h-4 w-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                {item.label}
              </Button>
            </Link>
          );
        })}

        <div className="mt-8 mb-2 ml-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Configuration</div>
        <Link to="/settings" className="block">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground transition-all duration-200">
            <Settings className="mr-3 h-4 w-4" />
            Project Settings
          </Button>
        </Link>
      </nav>

      <div className="p-4 border-t border-border/50">
        <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20 shadow-none overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <GitPullRequest className="h-16 w-16" />
          </div>
          <CardContent className="p-4 relative z-10">
            <div className="text-sm font-bold text-foreground mb-1">GitHub Integration</div>
            <div className="text-xs text-muted-foreground mb-4 leading-relaxed">2 PRs awaiting mentor review.</div>
            <Button size="sm" variant="outline" className="w-full border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500 hover:text-white transition-colors shadow-sm font-semibold">
              <GitMerge className="mr-2 h-3.5 w-3.5" />
              View Pull Requests
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
