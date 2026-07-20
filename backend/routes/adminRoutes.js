import express from "express";
import {
  getDashboardStats,
  getAllUsers,
  toggleBanUser,
  getAllCompanies,
  approveCompany,
  toggleBanCompany,
  toggleFeatureCompany,
  getAllJobsAdmin,
  toggleFeatureJob,
  closeJobAdmin,
  broadcastNotification,
} from "../controllers/adminController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Every route here is admin-only
router.use(protect, authorize("admin"));

router.get("/stats", getDashboardStats);

router.get("/users", getAllUsers);
router.put("/users/:id/ban", toggleBanUser);

router.get("/companies", getAllCompanies);
router.put("/companies/:id/approve", approveCompany);
router.put("/companies/:id/ban", toggleBanCompany);
router.put("/companies/:id/feature", toggleFeatureCompany);

router.get("/jobs", getAllJobsAdmin);
router.put("/jobs/:id/feature", toggleFeatureJob);
router.put("/jobs/:id/close", closeJobAdmin);

router.post("/broadcast", broadcastNotification);

export default router;
