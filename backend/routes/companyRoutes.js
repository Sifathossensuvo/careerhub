import express from "express";
import {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  toggleFollowCompany,
} from "../controllers/companyController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getCompanies);
router.get("/:id", getCompanyById);
router.post("/", protect, authorize("recruiter", "admin"), createCompany);
router.put("/:id", protect, authorize("recruiter", "admin"), updateCompany);
router.put("/:id/follow", protect, authorize("jobseeker"), toggleFollowCompany);

export default router;
