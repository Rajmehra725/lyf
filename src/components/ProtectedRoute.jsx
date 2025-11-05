// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute ensures a page is accessible only to logged-in users.
 * If `role` prop is provided, it also restricts access based on the user's role.
 *
 * Usage:
 * <ProtectedRoute role="admin">
 *   <AdminDashboard />
 * </ProtectedRoute>
 */
export default function ProtectedRoute({ children, role }) {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthorized(false);
        return;
      }

      if (role) {
        try {
          const user = JSON.parse(localStorage.getItem("user"));
          if (!user || !user.role || user.role.toLowerCase() !== role.toLowerCase()) {
            setIsAuthorized(false);
            return;
          }
        } catch (err) {
          setIsAuthorized(false);
          return;
        }
      }

      setIsAuthorized(true);
    };

    checkAuth();
  }, [role]);

  // While checking, don't render anything (optional: show loader)
  if (isAuthorized === null) return null;

  if (!isAuthorized) return <Navigate to="/login" replace />;

  return children;
}
