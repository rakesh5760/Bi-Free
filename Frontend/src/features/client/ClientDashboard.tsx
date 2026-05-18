import { Routes, Route } from "react-router";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { ClientSidebar } from "./components/ClientSidebar";
import { ClientOverview } from "./components/ClientOverview";
import { PlaceholderPage } from "../../components/PlaceholderPage";

export default function ClientDashboard() {
  return (
    <DashboardLayout sidebar={<ClientSidebar />} title="Client Dashboard">
      <Routes>
        <Route index element={<ClientOverview />} />
        
        <Route 
          path="projects" 
          element={<PlaceholderPage title="My Projects" description="View and manage all your active and past projects." />} 
        />
        <Route 
          path="teams" 
          element={<PlaceholderPage title="Assigned Teams" description="View details about the student teams working on your projects." />} 
        />
        <Route 
          path="invoices" 
          element={<PlaceholderPage title="Billing & Invoices" description="Manage your billing, payments, and financial history." />} 
        />
        <Route 
          path="reports" 
          element={<PlaceholderPage title="Client Reports" description="Generate performance and milestone reports for your projects." />} 
        />
      </Routes>
    </DashboardLayout>
  );
}
