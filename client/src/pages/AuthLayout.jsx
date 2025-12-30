import React from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";
import Login from "./Login";

// Minimal layout without Navbar - used for recruiter/admin dashboards that have their own navbars
const AuthLayout = () => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      {user ? (
        <div className="min-h-screen bg-gray-50">
          <Outlet />
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default AuthLayout;

