import { Routes, Route } from "react-router";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { StudentSidebar } from "./components/StudentSidebar";
import { StudentOverview } from "./components/StudentOverview";

export default function StudentDashboard() {
  return (
    <DashboardLayout sidebar={<StudentSidebar />} title="Student Dashboard">
      <Routes>
        <Route index element={<StudentOverview />} />
        {/* Add nested routes if more sidebar links point to /student/* paths */}
      </Routes>
    </DashboardLayout>
  );
}
