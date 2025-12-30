import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../app/features/authSlice";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin">
              <img src="/logo.png" alt="JobMate AI Admin" className="h-14" />
            </Link>
            <span className="text-sm text-slate-500">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">Admin User</span>
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
          <p className="text-sm text-slate-500">JobMate AI</p>
          <h2 className="text-2xl font-semibold text-slate-800">System Overview</h2>
          <p className="text-sm text-slate-500 mt-1">
            Monitor and manage your JobMate AI platform.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Users", value: "2,847", delta: "+127 this month", color: "#1568ab", icon: "👥" },
            { label: "Total Recruiters", value: "342", delta: "+23 this month", color: "#9333ea", icon: "🏢" },
            { label: "Active Jobs", value: "1,294", delta: "+89 this week", color: "#16a34a", icon: "💼" },
            { label: "Reports Flagged", value: "18", delta: "5 pending review", color: "#dc2626", icon: "⚠️" },
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-2 text-lg"
                style={{ backgroundColor: `${item.color}20` }}
              >
                {item.icon}
              </div>
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="text-2xl font-semibold text-slate-800 mt-1">{item.value}</p>
              <p className="text-xs mt-1" style={{ color: item.color }}>{item.delta}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="font-semibold text-slate-800 mb-3">Recent Recruiter Approvals</h3>
            {[
              { name: "Acme Corporation", email: "hr@acme.com", time: "2 hours ago" },
              { name: "TechStart Inc", email: "jobs@techstart.io", time: "5 hours ago" },
              { name: "Design Studio Pro", email: "recruit@designstudio.com", time: "1 day ago" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between border border-slate-100 rounded-lg px-3 py-3 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1568ab]/30 to-purple-500/30 flex items-center justify-center text-sm font-medium text-slate-600">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.email} • {item.time}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 rounded-full bg-emerald-500 text-white text-sm hover:bg-emerald-600">
                    Approve
                  </button>
                  <button className="px-3 py-1 rounded-full bg-red-500 text-white text-sm hover:bg-red-600">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="font-semibold text-slate-800 mb-3">System Notifications</h3>
            {[
              { text: "System backup completed successfully", type: "success", time: "10 min ago" },
              { text: "High server load detected on DB-02", type: "warning", time: "1 hour ago" },
              { text: "New recruiter verified: CloudTech Ltd", type: "info", time: "2 hours ago" },
              { text: "Failed payment attempt detected", type: "error", time: "3 hours ago" },
            ].map((note, idx) => (
              <div key={idx} className="flex items-center gap-3 border-b last:border-0 border-slate-100 py-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    note.type === "success" ? "bg-emerald-500" :
                    note.type === "warning" ? "bg-amber-500" :
                    note.type === "error" ? "bg-red-500" : "bg-[#1568ab]"
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm text-slate-700">{note.text}</p>
                  <p className="text-xs text-slate-400">{note.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Latest Jobs Posted</h3>
            <button className="text-sm text-[#1568ab] hover:underline">View All</button>
          </div>
          {[
            { title: "Senior React Developer", company: "TechCorp", location: "Remote", status: "Active" },
            { title: "Product Designer", company: "DesignHub", location: "New York", status: "Active" },
            { title: "Data Engineer", company: "DataFlow", location: "San Francisco", status: "Pending" },
          ].map((job, idx) => (
            <div key={idx} className="flex items-center justify-between border-b last:border-0 border-slate-100 py-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1568ab]/20 to-[#1568ab]/40 flex items-center justify-center text-sm">
                  💼
                </div>
                <div>
                  <p className="font-medium text-slate-800">{job.title}</p>
                  <p className="text-xs text-slate-500">{job.company} • {job.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    job.status === "Active"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  {job.status}
                </span>
                <button className="px-3 py-1 rounded-full bg-[#1568ab] text-white text-sm hover:bg-[#0d4f82]">
                  View
                </button>
                <button className="px-3 py-1 rounded-full border border-slate-200 text-sm hover:bg-slate-50">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
