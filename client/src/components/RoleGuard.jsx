import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const RoleGuard = ({ allowed = [], children }) => {
  const { user, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) return null;
  if (!user) return <Navigate to="/?state=login" replace />;

  if (allowed.length && !allowed.includes(user.role)) {
    // Redirect to the user's appropriate dashboard based on their role
    const redirectPath = user.role === "admin" 
      ? "/admin" 
      : user.role === "recruiter" 
        ? "/recruiter" 
        : "/app";
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return children;
};

export default RoleGuard;
