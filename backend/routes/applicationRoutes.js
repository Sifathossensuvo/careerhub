import express from "express";
import {
  applyToJob,
  getMyApplications,
  getApplicantsForJob,
  updateApplicationStatus,
} from "../controllers/applicationController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/:jobId", protect, authorize("jobseeker"), applyToJob);
router.get("/mine", protect, authorize("jobseeker"), getMyApplications);
router.get("/job/:jobId", protect, authorize("recruiter", "admin"), getApplicantsForJob);
router.put("/:id/status", protect, authorize("recruiter", "admin"), updateApplicationStatus);

export default router;
