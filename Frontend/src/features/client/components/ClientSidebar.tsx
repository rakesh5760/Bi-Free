import { Briefcase, Plus, MessageSquare, FileCheck, Home, Settings, HelpCircle, FileText } from "lucide-react";
import { Link, useLocation } from "react-router";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";

export function ClientSidebar() {
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/client" },
    { icon: Briefcase, label: "My Projects", path: "/client/projects" },
    { icon: MessageSquare, label: "Messages", path: "/client/messages" },
    { icon: FileCheck, label: "Submissions", path: "/client/submissions" },
    { icon: FileText, label: "Invoices", path: "/client/invoices" },
  ];

  return (
    <div className="flex flex-col h-full bg-card/30">
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-500/20">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-bold tracking-tight text-foreground">SkillForge</div>
            <div className="text-xs font-medium text-emerald-500">Client Portal</div>
          </div>
        </div>
        <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-500/90 hover:to-teal-600/90 shadow-md font-bold h-11">
          <Plus className="mr-2 h-4 w-4" />
          Post New Project
        </Button>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 ml-2">Navigation</div>
        {menuItems.map((item, i) => {
          const isActive = location.pathname === item.path || (item.path !== '/client' && location.pathname.startsWith(item.path));
          return (
            <Link to={item.path} key={i} className="block">
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start transition-all duration-200 ${isActive ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/15 font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <item.icon className={`mr-3 h-4 w-4 ${isActive ? 'text-emerald-600' : ''}`} />
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
        <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20 shadow-none overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <HelpCircle className="h-16 w-16" />
          </div>
          <CardContent className="p-4 relative z-10">
            <div className="text-sm font-bold text-foreground mb-1">Need Assistance?</div>
            <div className="text-xs text-muted-foreground mb-4 leading-relaxed">Contact your dedicated account manager.</div>
            <Button size="sm" variant="outline" className="w-full border-emerald-500/30 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-colors shadow-sm font-semibold">
              Support Center
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
