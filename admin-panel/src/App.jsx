import React from "react";
import { Routes, Route } from "react-router-dom";

import SuperAdminRegister from "./pages/SuperAdminRegister";
import AdminRegisterRequest from "./pages/AdminRegister";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/Dashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard"; // <-- IMPORTANT FIX
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import HistoryPage from "./pages/HistoryPage";
import GraphsDashboard from "./pages/GraphsDashboard";
//import Notifications from "./pages/Notifications";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminLogin />} />
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/admin-register" element={<AdminRegisterRequest />} />
      <Route path="/superadmin-register" element={<SuperAdminRegister />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        }
      />

      <Route
        path="/superadmin-dashboard"
        element={
          <ProtectedAdminRoute>
            <SuperAdminDashboard />
          </ProtectedAdminRoute>
        }
      />

      <Route
        path="/history"
        element={
          <ProtectedAdminRoute>
            <HistoryPage />
          </ProtectedAdminRoute>
        }
      />

      <Route path="/graphs" element={<GraphsDashboard />} />
    </Routes>
  );
}
