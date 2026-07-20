import express from "express";
import {
  updateProfile,
  getUserById,
  getSavedJobs,
  getNotifications,
  markNotificationRead,
} from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.put("/profile", protect, updateProfile);
router.get("/saved-jobs", protect, getSavedJobs);
router.get("/notifications", protect, getNotifications);
router.put("/notifications/:id/read", protect, markNotificationRead);
router.get("/:id", getUserById);

export default router;
