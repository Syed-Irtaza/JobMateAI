import Profile from "../models/Profile.js";
import User from "../models/User.js";

// GET /api/profile/me
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const profile = await Profile.findOne({ userId });
    return res.status(200).json({ profile });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// POST /api/profile
// Upsert profile for the logged-in user
export const upsertProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const payload = req.body || {};

    const requiredFields = ["fullName", "title", "location"];
    for (const field of requiredFields) {
      if (!payload[field]) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }

    const profile = await Profile.findOneAndUpdate(
      { userId },
      { ...payload, userId },
      { new: true, upsert: true }
    );

    await User.findByIdAndUpdate(userId, { profileCompleted: true });

    return res.status(200).json({ message: "Profile saved", profile });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

