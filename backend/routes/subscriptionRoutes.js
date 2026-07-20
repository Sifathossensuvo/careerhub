import express from "express";
import { getJobseekerPlans, getRecruiterPlans } from "../controllers/subscriptionController.js";

const router = express.Router();

router.get("/plans", getJobseekerPlans);
router.get("/recruiter-plans", getRecruiterPlans);

export default router;
