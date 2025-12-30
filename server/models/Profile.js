import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    fullName: { type: String, required: true },
    title: { type: String, required: true },
    location: { type: String, required: true },
    about: { type: String },
    experienceYears: { type: Number, default: 0 },
    skills: [{ type: String }],
    phone: { type: String },
    linkedin: { type: String },
    github: { type: String },
    portfolio: { type: String },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", ProfileSchema);

export default Profile;

