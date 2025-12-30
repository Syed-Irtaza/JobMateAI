import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../app/features/authSlice";

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/recruiter">
              <img src="/logo.png" alt="JobMate AI" className="h-14" />
            </Link>
            <span className="text-sm text-slate-500">Recruiter Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">Hi, {user?.name || "Recruiter"}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 rounded-full border border-slate-200 text-sm hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Welcome back</p>
              <h2 className="text-2xl font-semibold text-slate-800">{user?.companyName || "Recruiter Dashboard"}</h2>
              <p className="text-sm text-slate-500 mt-1">
                Manage your job postings and find the best candidates.
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-full bg-[#1568ab] text-white hover:bg-[#0d4f82] transition">
                Post a Job
              </button>
              <button
                className="px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-50"
                onClick={() => navigate("/app")}
              >
                Candidate View
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: "Jobs Posted", value: "12", delta: "+2 this week", color: "#1568ab" },
            { label: "Applications Received", value: "348", delta: "+45 this week", color: "#9333ea" },
            { label: "Active Listings", value: "8", delta: "4 expiring soon", color: "#d97706" },
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-2"
                style={{ backgroundColor: `${item.color}20` }}
              >
                <span style={{ color: item.color }}>📊</span>
              </div>
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="text-2xl font-semibold text-slate-800 mt-1">{item.value}</p>
              <p className="text-xs text-[#1568ab] mt-1">{item.delta}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Recent Candidates</h3>
            <button className="text-sm text-[#1568ab] hover:underline">View All</button>
          </div>
          {[
            { name: "Sarah Johnson", role: "Senior Frontend Developer", match: "95%", time: "2 hours ago" },
            { name: "Michael Chen", role: "UX/UI Designer", match: "92%", time: "5 hours ago" },
            { name: "Emily Rodriguez", role: "Product Manager", match: "88%", time: "1 day ago" },
            { name: "David Kim", role: "Backend Engineer", match: "90%", time: "1 day ago" },
            { name: "Jessica Taylor", role: "Data Scientist", match: "87%", time: "2 days ago" },
          ].map((candidate, idx) => (
            <div key={idx} className="flex items-center justify-between border-b last:border-0 border-slate-100 py-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1568ab]/30 to-[#1568ab]/60 flex items-center justify-center text-white font-medium">
                  {candidate.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-slate-800">{candidate.name}</p>
                  <p className="text-xs text-slate-500">{candidate.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-[#1568ab] font-medium">{candidate.match} Match</p>
                  <p className="text-xs text-slate-400">{candidate.time}</p>
                </div>
                <button className="px-4 py-1.5 rounded-full bg-[#1568ab] text-white text-sm hover:bg-[#0d4f82]">
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
