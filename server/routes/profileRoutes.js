import express from "express";
import { getMyProfile, upsertProfile } from "../controllers/profileController.js";
import protect from "../middlewares/authMiddleware.js";

const profileRouter = express.Router();

profileRouter.get("/me", protect, getMyProfile);
profileRouter.post("/", protect, upsertProfile);

export default profileRouter;

