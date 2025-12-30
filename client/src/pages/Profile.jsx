import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../configs/api";
import toast from "react-hot-toast";
import { login } from "../app/features/authSlice";

const initialState = {
  fullName: "",
  title: "",
  location: "",
  about: "",
  experienceYears: "",
  skills: "",
  phone: "",
  linkedin: "",
  github: "",
  portfolio: "",
};

const Profile = () => {
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const loadProfile = async () => {
    try {
      const { data } = await api.get("/api/profile/me", {
        headers: { Authorization: token },
      });
      if (data.profile) {
        const profile = data.profile;
        setForm({
          fullName: profile.fullName || "",
          title: profile.title || "",
          location: profile.location || "",
          about: profile.about || "",
          experienceYears: profile.experienceYears ?? "",
          skills: (profile.skills || []).join(", "),
          phone: profile.phone || "",
          linkedin: profile.linkedin || "",
          github: profile.github || "",
          portfolio: profile.portfolio || "",
        });
      }
    } catch (error) {
      // ignore if not found
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const payload = {
        ...form,
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        experienceYears: form.experienceYears
          ? Number(form.experienceYears)
          : 0,
      };
      const { data } = await api.post("/api/profile", payload, {
        headers: { Authorization: token },
      });
      toast.success(data.message || "Profile saved");
      if (user) {
        dispatch(login({ token, user: { ...user, profileCompleted: true } }));
      }
      navigate("/app", { replace: true });
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-slate-500">JobMate AI</p>
            <h2 className="text-2xl font-semibold text-slate-800">
              Complete Your Profile
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Help us personalize your career tools and job recommendations.
            </p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-[#1568ab]/10 text-[#1568ab] border border-[#1568ab]/20">
            Required
          </span>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1">
            <label className="text-sm text-slate-600 font-medium">Full Name *</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-lg px-3 py-2 mt-1 focus:border-[#1568ab] focus:ring-[#1568ab] focus:outline-none"
              placeholder="Jane Doe"
            />
          </div>
          <div className="col-span-1">
            <label className="text-sm text-slate-600 font-medium">Professional Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-lg px-3 py-2 mt-1 focus:border-[#1568ab] focus:ring-[#1568ab] focus:outline-none"
              placeholder="Frontend Engineer"
            />
          </div>
          <div className="col-span-1">
            <label className="text-sm text-slate-600 font-medium">Location *</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-lg px-3 py-2 mt-1 focus:border-[#1568ab] focus:ring-[#1568ab] focus:outline-none"
              placeholder="London, UK"
            />
          </div>
          <div className="col-span-1">
            <label className="text-sm text-slate-600 font-medium">Years of Experience</label>
            <input
              name="experienceYears"
              type="number"
              min="0"
              value={form.experienceYears}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 mt-1 focus:border-[#1568ab] focus:ring-[#1568ab] focus:outline-none"
              placeholder="3"
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm text-slate-600 font-medium">About</label>
            <textarea
              name="about"
              value={form.about}
              onChange={handleChange}
              rows={3}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 mt-1 focus:border-[#1568ab] focus:ring-[#1568ab] focus:outline-none"
              placeholder="Tell us about your career goals and expertise"
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm text-slate-600 font-medium">Skills (comma separated)</label>
            <input
              name="skills"
              value={form.skills}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 mt-1 focus:border-[#1568ab] focus:ring-[#1568ab] focus:outline-none"
              placeholder="React, Node.js, SQL, Python"
            />
          </div>
          <div className="col-span-1">
            <label className="text-sm text-slate-600 font-medium">Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 mt-1 focus:border-[#1568ab] focus:ring-[#1568ab] focus:outline-none"
              placeholder="+92 300 1234567"
            />
          </div>
          <div className="col-span-1">
            <label className="text-sm text-slate-600 font-medium">LinkedIn</label>
            <input
              name="linkedin"
              value={form.linkedin}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 mt-1 focus:border-[#1568ab] focus:ring-[#1568ab] focus:outline-none"
              placeholder="https://linkedin.com/in/you"
            />
          </div>
          <div className="col-span-1">
            <label className="text-sm text-slate-600 font-medium">GitHub</label>
            <input
              name="github"
              value={form.github}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 mt-1 focus:border-[#1568ab] focus:ring-[#1568ab] focus:outline-none"
              placeholder="https://github.com/you"
            />
          </div>
          <div className="col-span-1">
            <label className="text-sm text-slate-600 font-medium">Portfolio / Website</label>
            <input
              name="portfolio"
              value={form.portfolio}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 mt-1 focus:border-[#1568ab] focus:ring-[#1568ab] focus:outline-none"
              placeholder="https://yourportfolio.com"
            />
          </div>

          <div className="col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-full bg-[#1568ab] text-white hover:bg-[#0d4f82] transition disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
