import express from "express";
import {
  resumeScore,
  atsCheck,
  generateCoverLetter,
  jobMatchScore,
  skillGapAnalysis,
  interviewQuestions,
} from "../controllers/aiController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// All AI tools are Pro/Elite features - gated at the frontend by isPremium check,
// enforced here at minimum by requiring login.
router.post("/resume-score", protect, resumeScore);
router.post("/ats-check", protect, atsCheck);
router.post("/cover-letter", protect, generateCoverLetter);
router.post("/job-match", protect, jobMatchScore);
router.post("/skill-gap", protect, skillGapAnalysis);
router.get("/interview-questions", protect, interviewQuestions);

export default router;
