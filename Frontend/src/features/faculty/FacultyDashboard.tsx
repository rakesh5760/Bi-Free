import { Routes, Route } from "react-router";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { FacultySidebar } from "./components/FacultySidebar";
import { FacultyOverview } from "./components/FacultyOverview";
import { PlaceholderPage } from "../../components/PlaceholderPage";

export default function FacultyDashboard() {
  return (
    <DashboardLayout sidebar={<FacultySidebar />} title="Faculty Dashboard">
      <Routes>
        <Route index element={<FacultyOverview />} />
        
        <Route 
          path="students" 
          element={<PlaceholderPage title="Student Management" description="Manage student profiles and skill progression." />} 
        />
        <Route 
          path="mentors" 
          element={<PlaceholderPage title="Mentor Directory" description="View and assign mentors to projects." />} 
        />
        <Route 
          path="allocations" 
          element={<PlaceholderPage title="Project Allocations" description="Allocate students and mentors to client projects." />} 
        />
        <Route 
          path="reports" 
          element={<PlaceholderPage title="Faculty Reports" description="Generate and view institutional reports." />} 
        />
      </Routes>
    </DashboardLayout>
  );
}
