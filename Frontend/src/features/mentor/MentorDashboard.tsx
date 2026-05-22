import { Routes, Route } from "react-router";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { MentorSidebar } from "./components/MentorSidebar";
import { MentorOverview } from "./components/MentorOverview";
import { MentorStudentsList } from "./components/MentorStudentsList";
import { PlaceholderPage } from "../../components/PlaceholderPage";

export default function MentorDashboard() {
  return (
    <DashboardLayout sidebar={<MentorSidebar />} title="Mentor Dashboard">
      <Routes>
        {/* Index route for /mentor */}
        <Route index element={<MentorOverview />} />

        {/* Nested routes mapped to sidebar links */}
        <Route
          path="students"
          element={<MentorStudentsList />}
        />
        <Route
          path="submissions"
          element={<PlaceholderPage title="Submissions" description="Review code and provide feedback on student project submissions." />}
        />
        <Route
          path="schedule"
          element={<PlaceholderPage title="Schedule" description="Manage your availability and upcoming mentorship sessions." />}
        />
        <Route
          path="messages"
          element={<PlaceholderPage title="Messages" description="Communicate with your assigned students." />}
        />
        <Route
          path="achievements"
          element={<PlaceholderPage title="Achievements" description="View your mentor rating, success rate, and platform milestones." />}
        />
      </Routes>
    </DashboardLayout>
  );
}
