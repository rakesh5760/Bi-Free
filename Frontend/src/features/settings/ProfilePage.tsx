import { useState, useEffect } from "react";
import {
  User, Mail, Phone, Github, Globe,
  Save, Loader2, CheckCircle2, AlertCircle,
  GraduationCap, Star, Camera
} from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Progress } from "../../components/ui/progress";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { StudentSidebar } from "../student-dashboard/components/StudentSidebar";
import { MentorSidebar } from "../mentor/components/MentorSidebar";
import { FacultySidebar } from "../faculty/components/FacultySidebar";
import { ClientSidebar } from "../client/components/ClientSidebar";
import { useAuthStore } from "../../store/useAuthStore";
import { api } from "../../services/api.client";

/* ── animation helpers ─────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const, delay: i * 0.07 }
  })
};

interface ProfileData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  github_handle: string;
  portfolio_url: string;
  trust_score: number | null;
  student_level: string | null;
  role: string;
}

type SaveStatus = "idle" | "saving" | "success" | "error";

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuthStore();
  const navigate = useNavigate();

  let Sidebar = StudentSidebar;
  if (user?.role?.toLowerCase() === 'mentor') Sidebar = MentorSidebar;
  if (user?.role?.toLowerCase() === 'faculty') Sidebar = FacultySidebar;
  if (user?.role?.toLowerCase() === 'client') Sidebar = ClientSidebar;

  const [profile, setProfile] = useState<ProfileData>({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    github_handle: "",
    portfolio_url: "",
    trust_score: null,
    student_level: null,
    role: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  /* ── Fetch full profile on mount ─────────────────────── */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/users/me/profile");
        const p = data.data as ProfileData;
        setProfile({
          first_name: p.first_name ?? "",
          last_name: p.last_name ?? "",
          email: p.email ?? "",
          phone_number: p.phone_number ?? "",
          github_handle: p.github_handle ?? "",
          portfolio_url: p.portfolio_url ?? "",
          trust_score: p.trust_score,
          student_level: p.student_level,
          role: p.role ?? "",
        });
      } catch (err) {
        // Fallback to store data if API fails
        if (user) {
          const [firstName, ...rest] = (user.name ?? "").split(" ");
          setProfile(prev => ({
            ...prev,
            first_name: firstName ?? "",
            last_name: rest.join(" ") ?? "",
            email: user.email ?? "",
            phone_number: user.phone_number ?? "",
            role: user.role ?? "",
          }));
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  /* ── Save handler ─────────────────────────────────────── */
  const handleSave = async () => {
    setSaveStatus("saving");
    setErrorMsg("");
    try {
      const payload = {
        first_name: profile.first_name.trim() || undefined,
        last_name: profile.last_name.trim() || undefined,
        phone_number: profile.phone_number.trim() || undefined,
        github_handle: profile.github_handle.trim() || undefined,
        portfolio_url: profile.portfolio_url.trim() || undefined,
      };

      const { data } = await api.put("/users/me/profile", payload);
      const updated = data.data as ProfileData;

      // Sync auth store so navbar name updates instantly
      updateUser({
        name: `${updated.first_name} ${updated.last_name}`.trim(),
        phone_number: updated.phone_number,
      });

      setProfile(prev => ({ ...prev, ...updated }));
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.detail ?? "Failed to save profile. Please try again.");
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 4000);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  /* ── Derived ─────────────────────────────────────────── */
  const initials = `${profile.first_name?.[0] ?? ""}${profile.last_name?.[0] ?? ""}`.toUpperCase() || "U";
  const fullName = `${profile.first_name} ${profile.last_name}`.trim() || "Student";
  const levelLetter = profile.student_level?.replace("Level ", "") ?? null;
  const trustProgress = profile.trust_score ?? 0;

  /* ── Sidebar selection ───────────────────────────────── */
  const isStudent = profile.role?.toLowerCase() === "student";

  if (isLoading) {
    return (
      <DashboardLayout sidebar={<Sidebar />} title="My Profile">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebar={<Sidebar />} title="My Profile">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* ── Profile hero card ─────────────────────────── */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
          <Card className="border-0 bg-gradient-to-br from-primary/10 via-violet-500/5 to-transparent overflow-hidden shadow-lg">
            <CardContent className="p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-violet-600 text-white text-2xl font-extrabold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>

                {/* Info */}
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-2xl font-extrabold text-foreground tracking-tight">{fullName}</h2>
                  <p className="text-muted-foreground font-medium mt-0.5">{profile.email}</p>
                  <div className="flex items-center gap-2 mt-3 flex-wrap justify-center sm:justify-start">
                    <Badge className="bg-primary/10 text-primary border-primary/20 font-semibold">
                      <GraduationCap className="h-3 w-3 mr-1" />
                      {profile.role || "Student"}
                    </Badge>
                    {levelLetter && (
                      <Badge className="bg-violet-500/10 text-violet-500 border-violet-500/20 font-semibold">
                        Level {levelLetter}
                      </Badge>
                    )}
                  </div>

                  {/* Trust score bar (students only) */}
                  {isStudent && profile.trust_score !== null && (
                    <div className="mt-4 max-w-xs mx-auto sm:mx-0">
                      <div className="flex justify-between text-xs font-bold mb-1.5">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Star className="h-3 w-3 text-yellow-500" /> Trust Score
                        </span>
                        <span className="text-foreground">{trustProgress.toFixed(1)}</span>
                      </div>
                      <Progress value={trustProgress} className="h-2" />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Personal Info form ────────────────────────── */}
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
          <Card className="border border-border/50 bg-card/60 shadow-md">
            <CardHeader className="border-b border-border/40 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-primary" /> Personal Information
              </CardTitle>
              <CardDescription>Update your basic details — changes save immediately.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              {/* Name row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={profile.first_name}
                      onChange={e => setProfile(p => ({ ...p, first_name: e.target.value }))}
                      placeholder="First name"
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={profile.last_name}
                      onChange={e => setProfile(p => ({ ...p, last_name: e.target.value }))}
                      placeholder="Last name"
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>

              {/* Email (read-only) */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={profile.email}
                    readOnly
                    disabled
                    className="pl-9 opacity-60 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Email cannot be changed. Contact support if needed.</p>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={profile.phone_number}
                    onChange={e => setProfile(p => ({ ...p, phone_number: e.target.value }))}
                    placeholder="+91 98765 43210"
                    className="pl-9"
                    type="tel"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Student-specific fields ───────────────────── */}
        {isStudent && (
          <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
            <Card className="border border-border/50 bg-card/60 shadow-md">
              <CardHeader className="border-b border-border/40 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <GraduationCap className="h-5 w-5 text-violet-500" /> Student Details
                </CardTitle>
                <CardDescription>Your professional presence and portfolio links.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">GitHub Handle</label>
                  <div className="relative">
                    <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={profile.github_handle}
                      onChange={e => setProfile(p => ({ ...p, github_handle: e.target.value }))}
                      placeholder="your-github-username"
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">Portfolio URL</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={profile.portfolio_url}
                      onChange={e => setProfile(p => ({ ...p, portfolio_url: e.target.value }))}
                      placeholder="https://yourportfolio.dev"
                      className="pl-9"
                      type="url"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ── Save button + status ──────────────────────── */}
        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
          <Card className="border border-border/50 bg-card/40 shadow-sm">
            <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                {saveStatus === "success" && (
                  <div className="flex items-center gap-2 text-emerald-500 font-semibold text-sm">
                    <CheckCircle2 className="h-4 w-4" /> Profile saved successfully!
                  </div>
                )}
                {saveStatus === "error" && (
                  <div className="flex items-center gap-2 text-destructive font-semibold text-sm">
                    <AlertCircle className="h-4 w-4" /> {errorMsg}
                  </div>
                )}
                {saveStatus === "idle" && (
                  <p className="text-sm text-muted-foreground">Changes are not auto-saved — click Save when ready.</p>
                )}
              </div>
              <Button
                onClick={handleSave}
                disabled={saveStatus === "saving"}
                className="min-w-[140px] font-bold bg-gradient-to-r from-primary to-violet-600 text-white border-0 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                {saveStatus === "saving" ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</>
                ) : saveStatus === "success" ? (
                  <><CheckCircle2 className="h-4 w-4 mr-2" /> Saved!</>
                ) : (
                  <><Save className="h-4 w-4 mr-2" /> Save Changes</>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </DashboardLayout>
  );
}
