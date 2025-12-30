import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";
import Login from "./Login";

const Layout = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect users to their correct dashboard based on role
  React.useEffect(() => {
    if (user) {
      // Recruiter trying to access candidate area - redirect to recruiter dashboard
      if (user.role === "recruiter" && location.pathname.startsWith("/app")) {
        navigate("/recruiter", { replace: true });
        return;
      }
      // Admin trying to access candidate area - redirect to admin dashboard
      if (user.role === "admin" && location.pathname.startsWith("/app")) {
        navigate("/admin", { replace: true });
        return;
      }
      // Candidate without profile completion - force profile page
      if (user.role === "candidate" && !user.profileCompleted) {
        if (!location.pathname.includes("/app/profile")) {
          navigate("/app/profile", { replace: true });
        }
      }
    }
  }, [user, location.pathname, navigate]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      {user ? (
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Outlet />
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default Layout;
