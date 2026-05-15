import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/sonner";
import { ProtectedRoute } from "../features/auth/components/ProtectedRoute";

import LandingPage from "./pages/landing";
import LoginPage from "../features/auth/pages/login";
import StudentDashboard from "../features/student-dashboard/StudentDashboard";
import MentorDashboard from "../features/mentor/MentorDashboard";
import FacultyDashboard from "../features/faculty/FacultyDashboard";
import ClientDashboard from "../features/client/ClientDashboard";
import ExamInterface from "./pages/exam-interface";
import LearningPortal from "../features/learning/LearningPortal";
import ProjectManagement from "../features/projects/ProjectManagement";
import AnalyticsDashboard from "./pages/analytics-dashboard";
import AdminPanel from "./pages/admin-panel";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/mentor" element={<ProtectedRoute allowedRoles={['mentor']}><MentorDashboard /></ProtectedRoute>} />
          <Route path="/faculty" element={<ProtectedRoute allowedRoles={['faculty']}><FacultyDashboard /></ProtectedRoute>} />
          <Route path="/client" element={<ProtectedRoute allowedRoles={['client']}><ClientDashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminPanel /></ProtectedRoute>} />
          
          <Route path="/exam" element={<ProtectedRoute allowedRoles={['student']}><ExamInterface /></ProtectedRoute>} />
          <Route path="/learning" element={<ProtectedRoute allowedRoles={['student']}><LearningPortal /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><ProjectManagement /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><AnalyticsDashboard /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </ThemeProvider>
  );
}