import { Users, UserCheck, FileText, Home, Settings, Shield, AlertTriangle, HelpCircle } from "lucide-react";
import { Link, useLocation } from "react-router";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";

export function FacultySidebar() {
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/faculty" },
    { icon: Users, label: "Students", path: "/faculty/students" },
    { icon: UserCheck, label: "Mentors", path: "/faculty/mentors" },
    { icon: FileText, label: "Allocations", path: "/faculty/allocations" },
    { icon: AlertTriangle, label: "Escalations", path: "/faculty/escalations" },
    { icon: Shield, label: "Approvals", path: "/faculty/approvals" },
  ];

  return (
    <div className="flex flex-col h-full bg-card/30">
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-bold tracking-tight text-foreground">SkillForge</div>
            <div className="text-xs font-medium text-indigo-500">Faculty Admin</div>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 ml-2">Administration</div>
        {menuItems.map((item, i) => {
          const isActive = location.pathname === item.path || (item.path !== '/faculty' && location.pathname.startsWith(item.path));
          return (
            <Link to={item.path} key={i} className="block">
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start transition-all duration-200 ${isActive ? 'bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/15 font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <item.icon className={`mr-3 h-4 w-4 ${isActive ? 'text-indigo-600' : ''}`} />
                {item.label}
              </Button>
            </Link>
          );
        })}

        <div className="mt-8 mb-2 ml-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">System</div>
        <Link to="/faculty/settings" className="block">
          <Button
            variant={location.pathname === "/faculty/settings" ? "secondary" : "ghost"}
            className={`w-full justify-start transition-all duration-200 ${location.pathname === "/faculty/settings" ? 'bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/15 font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Settings className="mr-3 h-4 w-4" />
            Platform Settings
          </Button>
        </Link>
      </nav>

      <div className="p-4 border-t border-border/50">
        <Card className="bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 border-indigo-500/20 shadow-none overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <HelpCircle className="h-16 w-16" />
          </div>
          <CardContent className="p-4 relative z-10">
            <div className="text-sm font-bold text-foreground mb-1">Support Desk</div>
            <div className="text-xs text-muted-foreground mb-4 leading-relaxed">Need help with institutional tools?</div>
            <Button size="sm" variant="outline" className="w-full border-indigo-500/30 text-indigo-600 hover:bg-indigo-500 hover:text-white transition-colors shadow-sm">
              Contact Tech Support
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
