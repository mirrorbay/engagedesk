import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Store the attempted location for redirect after login
    const redirectPath = location.pathname + location.search;
    sessionStorage.setItem("redirectAfterLogin", redirectPath);

    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
