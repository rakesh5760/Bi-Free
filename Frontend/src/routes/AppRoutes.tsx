import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router";
import { ProtectedRoute } from "../features/auth/components/ProtectedRoute";
import { Loader2 } from "lucide-react";
import { PlaceholderPage } from "../components/PlaceholderPage";

import LandingPage from "../pages/landing";
import LoginPage from "../features/auth/pages/login";
import SignupPage from "../features/auth/pages/signup";
import OnboardingPage from "../features/auth/pages/onboarding";
import ExamInterface from "../pages/exam-interface";
import LearningPortal from "../features/learning/LearningPortal";
import ProjectManagement from "../features/projects/ProjectManagement";
import AnalyticsDashboard from "../pages/analytics-dashboard";
import AdminPanel from "../pages/admin-panel";
import ProfilePage from "../features/settings/ProfilePage";
import SecurityPage from "../features/settings/SecurityPage";

// Lazy load large role-based dashboards to improve performance
const StudentDashboard = lazy(() => import("../features/student-dashboard/StudentDashboard"));
const MentorDashboard = lazy(() => import("../features/mentor/MentorDashboard"));
const FacultyDashboard = lazy(() => import("../features/faculty/FacultyDashboard"));
const ClientDashboard = lazy(() => import("../features/client/ClientDashboard"));

function SuspenseLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

export function AppRoutes() {
  return (
    <Suspense fallback={<SuspenseLoader />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        
        {/* Dashboards with nested route support /* */}
        <Route path="/student/*" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/mentor/*" element={<ProtectedRoute allowedRoles={['mentor']}><MentorDashboard /></ProtectedRoute>} />
        <Route path="/faculty/*" element={<ProtectedRoute allowedRoles={['faculty']}><FacultyDashboard /></ProtectedRoute>} />
        <Route path="/client/*" element={<ProtectedRoute allowedRoles={['client']}><ClientDashboard /></ProtectedRoute>} />
        <Route path="/admin/*" element={<ProtectedRoute allowedRoles={['admin']}><AdminPanel /></ProtectedRoute>} />
        
        <Route path="/exam" element={<ProtectedRoute allowedRoles={['student']}><ExamInterface /></ProtectedRoute>} />
        <Route path="/learning" element={<ProtectedRoute allowedRoles={['student']}><LearningPortal /></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><ProjectManagement /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><AnalyticsDashboard /></ProtectedRoute>} />
        
        {/* Unimplemented / Placeholder Global Routes */}
        <Route path="/achievements" element={
          <ProtectedRoute>
            <div className="pt-16"><PlaceholderPage title="Achievements" description="View badges, certificates, and milestones." /></div>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={<Navigate to="/settings/profile" replace />} />
        <Route path="/settings/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/settings/security" element={
          <ProtectedRoute>
            <SecurityPage />
          </ProtectedRoute>
        } />
        <Route path="/settings/*" element={
          <ProtectedRoute>
            <div className="pt-16"><PlaceholderPage title="Settings" description="Manage your account preferences." /></div>
          </ProtectedRoute>
        } />
        
        {/* Global Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
