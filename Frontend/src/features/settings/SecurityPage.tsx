import { useState } from "react";
import { Shield, Save, Loader2, CheckCircle2, AlertCircle, LogOut } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { StudentSidebar } from "../student-dashboard/components/StudentSidebar";
import { MentorSidebar } from "../mentor/components/MentorSidebar";
import { FacultySidebar } from "../faculty/components/FacultySidebar";
import { ClientSidebar } from "../client/components/ClientSidebar";
import { useAuthStore } from "../../store/useAuthStore";
import { api } from "../../services/api.client";

type SaveStatus = "idle" | "saving" | "success" | "error";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const }
  }
};

export default function SecurityPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  let Sidebar = StudentSidebar;
  if (user?.role?.toLowerCase() === 'mentor') Sidebar = MentorSidebar;
  if (user?.role?.toLowerCase() === 'faculty') Sidebar = FacultySidebar;
  if (user?.role?.toLowerCase() === 'client') Sidebar = ClientSidebar;

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaveStatus, setPasswordSaveStatus] = useState<SaveStatus>("idle");
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordErrorMsg("New passwords do not match.");
      setPasswordSaveStatus("error");
      setTimeout(() => setPasswordSaveStatus("idle"), 4000);
      return;
    }

    if (oldPassword === newPassword) {
      setPasswordErrorMsg("New password cannot be the same as the old password.");
      setPasswordSaveStatus("error");
      setTimeout(() => setPasswordSaveStatus("idle"), 4000);
      return;
    }
    
    setPasswordSaveStatus("saving");
    setPasswordErrorMsg("");
    try {
      await api.post("/users/me/password", {
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordSaveStatus("success");
      setTimeout(() => setPasswordSaveStatus("idle"), 3000);
    } catch (err: any) {
      setPasswordErrorMsg(err?.response?.data?.detail ?? "Failed to update password.");
      setPasswordSaveStatus("error");
      setTimeout(() => setPasswordSaveStatus("idle"), 4000);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <DashboardLayout sidebar={<Sidebar />} title="Security Settings">
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <Card className="border border-border/50 bg-card/40 shadow-sm">
            <CardHeader className="border-b border-border/40 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg text-muted-foreground">
                <Shield className="h-5 w-5" /> Account & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              <form onSubmit={handlePasswordSave} className="space-y-4">
                <h4 className="font-bold text-foreground">Change Password</h4>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">Old Password</label>
                  <Input
                    type="password"
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                    placeholder="Enter current password"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-foreground">New Password</label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-foreground">Confirm Password</label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Retype new password"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div>
                    {passwordSaveStatus === "success" && (
                      <div className="flex items-center gap-2 text-emerald-500 font-semibold text-sm">
                        <CheckCircle2 className="h-4 w-4" /> Password updated!
                      </div>
                    )}
                    {passwordSaveStatus === "error" && (
                      <div className="flex items-center gap-2 text-destructive font-semibold text-sm">
                        <AlertCircle className="h-4 w-4" /> {passwordErrorMsg}
                      </div>
                    )}
                  </div>
                  <Button
                    type="submit"
                    disabled={passwordSaveStatus === "saving" || !oldPassword || !newPassword || !confirmPassword}
                    className="min-w-[140px]"
                  >
                    {passwordSaveStatus === "saving" ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Updating...</>
                    ) : (
                      <><Save className="h-4 w-4 mr-2" /> Update Password</>
                    )}
                  </Button>
                </div>
              </form>

              <hr className="border-border/50" />

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-destructive/20 bg-destructive/5">
                <div>
                  <h4 className="font-bold text-foreground">Log Out</h4>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    You will be signed out and redirected to the login page.
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  className="shrink-0 font-bold"
                >
                  <LogOut className="h-4 w-4 mr-2" /> Log Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
