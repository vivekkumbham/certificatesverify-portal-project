// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Registration from "./components/Registration";
import Dashboard from "./page/Dashboard";
import DocumentForm from "./page/DocumentForm"; // or DocumentForm if you renamed
import ProtectedRoute from "./components/ProtectedRoute";
import StudentUpdate from "./page/StudentUpdate";
import StudentEdit from "./page/StudentEdit";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
<Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/register" element={<Registration />} />
      <Route path="/StudentUpdate" element={<StudentUpdate />} />
      <Route path="/StudentEdit/:id" element={<StudentEdit />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/submit"
        element={
          <ProtectedRoute>
            <DocumentForm />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
