import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/sonner";

import LandingPage from "./pages/landing";
import StudentDashboard from "./pages/student-dashboard";
import MentorDashboard from "./pages/mentor-dashboard";
import FacultyDashboard from "./pages/faculty-dashboard";
import ClientDashboard from "./pages/client-dashboard";
import ExamInterface from "./pages/exam-interface";
import LearningPortal from "./pages/learning-portal";
import ProjectManagement from "./pages/project-management";
import AnalyticsDashboard from "./pages/analytics-dashboard";
import AdminPanel from "./pages/admin-panel";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/mentor" element={<MentorDashboard />} />
          <Route path="/faculty" element={<FacultyDashboard />} />
          <Route path="/client" element={<ClientDashboard />} />
          <Route path="/exam" element={<ExamInterface />} />
          <Route path="/learning" element={<LearningPortal />} />
          <Route path="/projects" element={<ProjectManagement />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </ThemeProvider>
  );
}