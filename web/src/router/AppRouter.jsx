import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import TaskDetail from "../pages/TaskDetail";
import TaskForm from "../pages/TaskForm";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root - redirect to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/tasks/new" element={
          <ProtectedRoute>
            <TaskForm />
          </ProtectedRoute>
        } />

        <Route path="/tasks/:id" element={
          <ProtectedRoute>
            <TaskDetail />
          </ProtectedRoute>
        } />

        <Route path="/tasks/:id/edit" element={
          <ProtectedRoute>
            <TaskForm />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}
