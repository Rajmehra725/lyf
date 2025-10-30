import React from "react";
import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute wraps a page. If role prop is provided,
 * it also checks logged-in user's role (from localStorage user object).
 *
 * Usage:
 * <ProtectedRoute role="admin"><AdminDashboard/></ProtectedRoute>
 */
export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;

  if (role) {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || user.role !== role) return <Navigate to="/login" replace />;
    } catch {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
}
