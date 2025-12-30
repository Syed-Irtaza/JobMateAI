import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      // Only require a password for credential-based accounts
      required() {
        return this.provider === "credentials";
      },
    },
    provider: {
      type: String,
      enum: ["credentials", "google"],
      default: "credentials",
    },
    role: {
      type: String,
      enum: ["candidate", "recruiter", "admin"],
      default: "candidate",
    },
    companyName: { type: String },
    companyWebsite: { type: String },
    profileCompleted: {
      type: Boolean,
      default: false,
    },
    googleId: { type: String },
    picture: { type: String },
  },
  { timestamps: true }
);

UserSchema.methods.comparePassword = function (password) {
  if (!this.password) return false;
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model("User", UserSchema);

export default User;