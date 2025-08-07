import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    // Check if there's a redirect path stored
    const redirectPath = sessionStorage.getItem("redirectAfterLogin");
    if (redirectPath) {
      sessionStorage.removeItem("redirectAfterLogin");
      return <Navigate to={redirectPath} replace />;
    }

    // Temporarily redirect to maintenance page instead of app
    return <Navigate to="/maintenance" replace />;
  }

  return children;
};

export default PublicRoute;
