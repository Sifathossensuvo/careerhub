import express from "express";
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs,
  toggleSaveJob,
  getLatestJobs,
  getFeaturedJobs,
} from "../controllers/jobController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/latest", getLatestJobs);
router.get("/featured", getFeaturedJobs);
router.get("/recruiter/mine", protect, authorize("recruiter", "admin"), getMyJobs);
router.get("/", getJobs);
router.get("/:id", getJobById);

router.post("/", protect, authorize("recruiter", "admin"), createJob);
router.put("/:id", protect, authorize("recruiter", "admin"), updateJob);
router.delete("/:id", protect, authorize("recruiter", "admin"), deleteJob);
router.put("/:id/save", protect, authorize("jobseeker"), toggleSaveJob);

export default router;
