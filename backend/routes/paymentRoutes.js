import express from "express";
import {
  getPaymentInstructions,
  submitPayment,
  getMyPayments,
  getPendingPayments,
  approvePayment,
  rejectPayment,
} from "../controllers/paymentController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/instructions", getPaymentInstructions);
router.post("/submit", protect, submitPayment);
router.get("/mine", protect, getMyPayments);

router.get("/pending", protect, authorize("admin"), getPendingPayments);
router.put("/:id/approve", protect, authorize("admin"), approvePayment);
router.put("/:id/reject", protect, authorize("admin"), rejectPayment);

export default router;
