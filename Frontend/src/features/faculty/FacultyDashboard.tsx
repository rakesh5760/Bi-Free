import { Routes, Route } from "react-router";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { FacultySidebar } from "./components/FacultySidebar";
import { FacultyOverview } from "./components/FacultyOverview";
import { FacultyStudentManagement } from "./components/FacultyStudentManagement";
import { FacultyMentorDirectory } from "./components/FacultyMentorDirectory";
import { FacultyAllocations } from "./components/FacultyAllocations";
import { FacultySettings } from "./components/FacultySettings";
import { PlaceholderPage } from "../../components/PlaceholderPage";

export default function FacultyDashboard() {
  return (
    <DashboardLayout sidebar={<FacultySidebar />} title="Faculty Dashboard">
      <Routes>
        <Route index element={<FacultyOverview />} />
        
        <Route 
          path="students" 
          element={<FacultyStudentManagement />} 
        />
        <Route 
          path="mentors" 
          element={<FacultyMentorDirectory />} 
        />
        <Route 
          path="allocations" 
          element={<FacultyAllocations />} 
        />
        <Route 
          path="settings" 
          element={<FacultySettings />} 
        />
        <Route 
          path="reports" 
          element={<PlaceholderPage title="Faculty Reports" description="Generate and view institutional reports." />} 
        />
      </Routes>
    </DashboardLayout>
  );
}
