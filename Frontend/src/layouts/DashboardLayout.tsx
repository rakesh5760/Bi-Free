import React, { ReactNode } from "react";
import { Bell, GraduationCap, Search, User, Menu, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { ThemeToggle } from "../components/theme-toggle";
import { motion } from "motion/react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate, useLocation, Link } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup
} from "../components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../components/ui/sheet";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";

interface DashboardLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
  title: string;
}

export function DashboardLayout({ children, sidebar, title }: DashboardLayoutProps) {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Generate breadcrumbs from current path
  const paths = location.pathname.split('/').filter(Boolean);
  
  // Helper to format role text
  const formatRole = (role?: string) => {
    if (!role) return '';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-64 flex-col border-r border-border/50 bg-sidebar/50 backdrop-blur-sm z-20">
          {sidebar}
        </aside>

        <div className="flex-1 flex flex-col overflow-hidden relative">
          <header className="h-16 border-b border-border/40 bg-background/60 backdrop-blur-xl flex items-center justify-between px-4 md:px-6 sticky top-0 z-30 shadow-sm">
            <div className="flex items-center gap-4 flex-1">
              
              {/* Mobile Hamburger & Logo */}
              <div className="flex items-center gap-3 md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="-ml-2">
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="p-0 w-72">
                    {sidebar}
                  </SheetContent>
                </Sheet>
                
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-md">
                  <GraduationCap className="h-4 w-4 text-white" />
                </div>
              </div>

              {/* Search Bar */}
              <div className="hidden sm:flex relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects, resources..."
                  className="pl-9 bg-background/50 border-border/50 focus-visible:ring-primary/30"
                />
              </div>
            </div>

            {/* Topbar Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              <ThemeToggle />
              
              {/* Notifications Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive border-2 border-background" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 p-0">
                  <div className="p-4 border-b border-border/50">
                    <h4 className="font-semibold text-sm">Notifications</h4>
                  </div>
                  <div className="max-h-[300px] overflow-auto p-2">
                    {/* Mock Notifications */}
                    <div className="flex gap-3 p-3 hover:bg-muted/50 rounded-md cursor-pointer transition-colors">
                      <div className="h-2 w-2 mt-1.5 rounded-full bg-primary flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">New assignment posted</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Faculty has posted a new milestone for your project.</p>
                        <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex gap-3 p-3 hover:bg-muted/50 rounded-md cursor-pointer transition-colors">
                      <div className="h-2 w-2 mt-1.5 rounded-full bg-transparent flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground/80">Code Review Completed</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Your mentor has approved your latest pull request.</p>
                        <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 border-t border-border/50 text-center">
                    <Button variant="ghost" size="sm" className="w-full text-xs text-primary">Mark all as read</Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9 border border-border/50">
                      {user?.avatarUrl ? (
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-primary to-violet-600 text-white text-xs font-medium">
                          {user?.name ? user.name.substring(0, 2).toUpperCase() : <User className="h-4 w-4" />}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <div className="flex items-center gap-3 p-3 border-b border-border/50">
                    <Avatar className="h-10 w-10 border border-border/50">
                      {user?.avatarUrl ? (
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-primary to-violet-600 text-white font-medium">
                          {user?.name ? user.name.substring(0, 2).toUpperCase() : ''}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex flex-col space-y-0.5">
                      <p className="text-sm font-semibold text-foreground leading-none">{user?.name || 'User'}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[150px]">{user?.email}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                          {formatRole(user?.role)}
                        </span>
                        {user?.role === 'student' && user?.studentLevel && (
                          <span className="inline-flex items-center rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold text-violet-500">
                            Level {user.studentLevel}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <DropdownMenuGroup className="p-1">
                    <DropdownMenuItem className="cursor-pointer">Profile Settings</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">Billing & Subscriptions</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">Security</DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer m-1">
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 overflow-auto bg-muted/20 relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
            
            <div className="p-4 md:p-8 max-w-7xl mx-auto w-full relative z-10">
              {/* Breadcrumbs */}
              <div className="mb-6">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link to="/">Home</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {paths.map((path, index) => {
                      const isLast = index === paths.length - 1;
                      const title = path.charAt(0).toUpperCase() + path.slice(1);
                      const to = `/${paths.slice(0, index + 1).join('/')}`;

                      return (
                        <React.Fragment key={path}>
                          <BreadcrumbSeparator>
                            <ChevronRight className="h-4 w-4" />
                          </BreadcrumbSeparator>
                          <BreadcrumbItem>
                            {isLast ? (
                              <BreadcrumbPage>{title}</BreadcrumbPage>
                            ) : (
                              <BreadcrumbLink asChild>
                                <Link to={to}>{title}</Link>
                              </BreadcrumbLink>
                            )}
                          </BreadcrumbItem>
                        </React.Fragment>
                      );
                    })}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div className="mb-8">
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">{title}</h1>
                </div>
                {children}
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
