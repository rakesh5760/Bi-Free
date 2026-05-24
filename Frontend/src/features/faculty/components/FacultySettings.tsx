import { useState, useEffect } from "react";
import { User, Mail, Phone, Shield, Save, Loader2, CheckCircle2, AlertCircle, LogOut, Settings, Bell, Server, Database, Activity } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { useAuthStore } from "../../../store/useAuthStore";
import { api } from "../../../services/api.client";
import { toast } from "sonner";

interface FacultyProfileData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role: string;
  department?: string;
}

export function FacultySettings() {
  const { user, updateUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<FacultyProfileData>({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    role: "Faculty",
    department: "Computer Science & Engineering"
  });

  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // System settings
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoAllocation, setAutoAllocation] = useState(false);
  const [systemStats, setSystemStats] = useState<any>(null);

  useEffect(() => {
    const fetchProfileAndStats = async () => {
      try {
        setIsLoading(true);
        const [profileRes, statsRes] = await Promise.all([
          api.get("/users/me/profile"),
          api.get("/analytics/institutional")
        ]);

        if (profileRes.data.success) {
          const p = profileRes.data.data;
          setProfile(prev => ({
            ...prev,
            first_name: p.first_name ?? "",
            last_name: p.last_name ?? "",
            email: p.email ?? "",
            phone_number: p.phone_number ?? "",
            role: p.role ?? "Faculty"
          }));
        }

        if (statsRes.data.success) {
          setSystemStats(statsRes.data.data);
        }
      } catch (err) {
        console.error("Failed to load settings data", err);
        // Fallback to local store data
        if (user) {
          const [firstName, ...rest] = (user.name ?? "").split(" ");
          setProfile(prev => ({
            ...prev,
            first_name: firstName ?? "",
            last_name: rest.join(" ") ?? "",
            email: user.email ?? "",
            phone_number: user.phone_number ?? "",
            role: user.role ?? "Faculty"
          }));
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfileAndStats();
  }, [user]);

  const handleSave = async () => {
    setSaveStatus("saving");
    setErrorMsg("");
    try {
      const payload = {
        first_name: profile.first_name.trim() || undefined,
        last_name: profile.last_name.trim() || undefined,
        phone_number: profile.phone_number.trim() || undefined,
      };

      const { data } = await api.put("/users/me/profile", payload);
      const updated = data.data;

      // Sync with global auth store
      updateUser({
        name: `${updated.first_name} ${updated.last_name}`.trim(),
        phone_number: updated.phone_number,
      });

      setProfile(prev => ({
        ...prev,
        first_name: updated.first_name ?? "",
        last_name: updated.last_name ?? "",
        phone_number: updated.phone_number ?? ""
      }));
      setSaveStatus("success");
      toast.success("Settings saved successfully.");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.detail ?? "Failed to save profile.");
      setSaveStatus("error");
      toast.error("Failed to save settings.");
      setTimeout(() => setSaveStatus("idle"), 4000);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = `${profile.first_name?.[0] ?? ""}${profile.last_name?.[0] ?? ""}`.toUpperCase() || "FA";
  const fullName = `${profile.first_name} ${profile.last_name}`.trim() || "Faculty Admin";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Profile Header Card */}
      <Card className="border-0 bg-gradient-to-br from-indigo-500/10 via-cyan-500/5 to-transparent overflow-hidden shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <Avatar className="h-20 w-20 border-2 border-background shadow-lg">
              <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-cyan-500 text-white text-xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left space-y-1">
              <h2 className="text-2xl font-bold text-foreground">{fullName}</h2>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
              <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                <Badge className="bg-indigo-500/10 text-indigo-600 border-indigo-500/20 font-semibold text-xs">
                  <Shield className="h-3 w-3 mr-1 text-indigo-500" />
                  {profile.role}
                </Badge>
                <Badge variant="secondary" className="text-xs bg-muted border font-semibold">
                  Dept: {profile.department}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Side: Personal Info Form */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm">
            <CardHeader className="border-b border-border/40 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-indigo-500" /> Personal Information
              </CardTitle>
              <CardDescription>Update your admin profile details.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={profile.first_name}
                      onChange={e => setProfile(p => ({ ...p, first_name: e.target.value }))}
                      placeholder="First name"
                      className="pl-9 bg-background/50"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={profile.last_name}
                      onChange={e => setProfile(p => ({ ...p, last_name: e.target.value }))}
                      placeholder="Last name"
                      className="pl-9 bg-background/50"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Email Address (Read-only)</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={profile.email}
                    readOnly
                    disabled
                    className="pl-9 opacity-60 cursor-not-allowed bg-background/30"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={profile.phone_number}
                    onChange={e => setProfile(p => ({ ...p, phone_number: e.target.value }))}
                    placeholder="+1 (555) 019-2834"
                    className="pl-9 bg-background/50"
                    type="tel"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Department (Institutional)</label>
                <Input
                  value={profile.department}
                  onChange={e => setProfile(p => ({ ...p, department: e.target.value }))}
                  placeholder="Computer Science & Engineering"
                  className="bg-background/50"
                />
              </div>
            </CardContent>
          </Card>

          {/* Preferences Settings */}
          <Card className="border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm">
            <CardHeader className="border-b border-border/40 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Settings className="h-5 w-5 text-indigo-500" /> Platform Preferences
              </CardTitle>
              <CardDescription>Tailor dashboard operations and systems notifications.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-background/30">
                <div className="space-y-0.5">
                  <div className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-amber-500" /> Email Notifications
                  </div>
                  <p className="text-xs text-muted-foreground max-w-sm">Receive email digests for escalations and review submissions.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={emailAlerts} 
                  onChange={e => setEmailAlerts(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-background/30">
                <div className="space-y-0.5">
                  <div className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    <Server className="w-4 h-4 text-indigo-500" /> Automatic Smart Allocation
                  </div>
                  <p className="text-xs text-muted-foreground max-w-sm">Enable AI-assisted matching for student recruitment recommendations.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={autoAllocation} 
                  onChange={e => setAutoAllocation(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Institutional System Details */}
        <div className="space-y-6">
          <Card className="border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm">
            <CardHeader className="border-b border-border/40 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg text-indigo-600 dark:text-indigo-400">
                <Activity className="h-5 w-5" /> Institutional Stats
              </CardTitle>
              <CardDescription>Live operational parameters</CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-background/30 rounded-xl border text-center">
                  <div className="text-xs font-bold text-muted-foreground uppercase">Students</div>
                  <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">{systemStats?.total_students || 0}</div>
                </div>
                <div className="p-3 bg-background/30 rounded-xl border text-center">
                  <div className="text-xs font-bold text-muted-foreground uppercase">Mentors</div>
                  <div className="text-xl font-extrabold text-cyan-600 mt-1">{systemStats?.total_mentors || 0}</div>
                </div>
                <div className="p-3 bg-background/30 rounded-xl border text-center">
                  <div className="text-xs font-bold text-muted-foreground uppercase">Active Projs</div>
                  <div className="text-xl font-extrabold text-blue-600 mt-1">{systemStats?.active_projects || 0}</div>
                </div>
                <div className="p-3 bg-background/30 rounded-xl border text-center">
                  <div className="text-xs font-bold text-muted-foreground uppercase">Completed</div>
                  <div className="text-xl font-extrabold text-emerald-600 mt-1">{systemStats?.completed_projects || 0}</div>
                </div>
              </div>

              <div className="pt-2 space-y-2 border-t border-border/40 text-xs">
                <div className="flex justify-between font-medium">
                  <span className="text-muted-foreground flex items-center gap-1"><Database className="w-3.5 h-3.5" /> Database status:</span>
                  <span className="text-emerald-500 font-bold">CONNECTED</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-muted-foreground flex items-center gap-1"><Server className="w-3.5 h-3.5" /> API Gateway:</span>
                  <span className="text-foreground font-semibold">v1.0.0 (FastAPI)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logout Action Card */}
          <Card className="border border-red-500/20 bg-red-500/5 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-red-500 font-bold text-base flex items-center gap-2">
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Sign out of your institutional administrator session on this device.
              </p>
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="w-full font-bold shadow-md shadow-red-500/20"
              >
                <LogOut className="h-4 w-4 mr-2" /> Log Out Session
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Save Button Row */}
      <Card className="border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            {saveStatus === "success" && (
              <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-xs">
                <CheckCircle2 className="h-4 w-4" /> Personal settings saved successfully!
              </div>
            )}
            {saveStatus === "error" && (
              <div className="flex items-center gap-1.5 text-destructive font-bold text-xs">
                <AlertCircle className="h-4 w-4" /> {errorMsg}
              </div>
            )}
            {saveStatus === "idle" && (
              <p className="text-xs text-muted-foreground">Changes will modify your profile on all client communications.</p>
            )}
          </div>

          <Button
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className="min-w-[140px] font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            {saveStatus === "saving" ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</>
            ) : (
              <><Save className="h-4 w-4 mr-2" /> Save Settings</>
            )}
          </Button>
        </CardContent>
      </Card>

    </div>
  );
}
