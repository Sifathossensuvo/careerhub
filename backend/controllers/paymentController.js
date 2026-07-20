import Payment from "../models/Payment.js";
import User from "../models/User.js";
import Company from "../models/Company.js";
import Notification from "../models/Notification.js";

const PLAN_PRICES = {
  basic: 199,
  pro: 399,
  elite: 699,
  business: 999,
  enterprise: 2999,
};

const RECRUITER_JOB_LIMITS = {
  business: 20,
  enterprise: 999999,
};

// @desc    Get manual payment instructions (bKash/Nagad numbers)
// @route   GET /api/payments/instructions
export const getPaymentInstructions = async (req, res, next) => {
  res.json({
    bkash: process.env.BKASH_NUMBER,
    nagad: process.env.NAGAD_NUMBER,
    plans: PLAN_PRICES,
  });
};

// @desc    Submit a manual payment for verification
// @route   POST /api/payments/submit
export const submitPayment = async (req, res, next) => {
  try {
    const { purpose, planName, method, senderNumber, transactionId } = req.body;

    if (!purpose || !planName || !method || !senderNumber || !transactionId) {
      return res.status(400).json({ message: "All payment fields are required" });
    }

    const amount = PLAN_PRICES[planName];
    if (!amount) return res.status(400).json({ message: "Invalid plan selected" });

    const duplicate = await Payment.findOne({ transactionId, method });
    if (duplicate) {
      return res.status(400).json({ message: "This transaction ID has already been submitted" });
    }

    const payment = await Payment.create({
      user: req.user._id,
      purpose,
      planName,
      amount,
      method,
      senderNumber,
      transactionId,
    });

    res.status(201).json({
      message: "Payment submitted. It is now pending admin verification.",
      payment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's payment history
// @route   GET /api/payments/mine
export const getMyPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ user: req.user._id }).sort("-createdAt");
    res.json(payments);
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: get all pending payments
// @route   GET /api/payments/pending
export const getPendingPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ status: "pending" })
      .populate("user", "name email role")
      .sort("createdAt");
    res.json(payments);
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: approve a payment (activates premium / recruiter plan)
// @route   PUT /api/payments/:id/approve
export const approvePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    if (payment.status !== "pending") {
      return res.status(400).json({ message: "Payment already processed" });
    }

    payment.status = "approved";
    payment.reviewedBy = req.user._id;
    payment.reviewedAt = new Date();
    await payment.save();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    if (payment.purpose === "premium_subscription") {
      await User.findByIdAndUpdate(payment.user, {
        isPremium: true,
        premiumPlan: payment.planName,
        premiumExpiresAt: expiresAt,
      });
    }

    if (payment.purpose === "recruiter_plan") {
      const company = await Company.findOne({ owner: payment.user });
      if (company) {
        company.plan = payment.planName;
        company.planExpiresAt = expiresAt;
        company.jobPostLimit = RECRUITER_JOB_LIMITS[payment.planName] || company.jobPostLimit;
        await company.save();
      }
    }

    await Notification.create({
      user: payment.user,
      type: "premium_approved",
      title: "Payment approved!",
      message: `Your ${payment.planName} plan (৳${payment.amount}) has been activated.`,
    });

    res.json({ message: "Payment approved and plan activated", payment });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: reject a payment
// @route   PUT /api/payments/:id/reject
export const rejectPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.status = "rejected";
    payment.adminNote = req.body.adminNote;
    payment.reviewedBy = req.user._id;
    payment.reviewedAt = new Date();
    await payment.save();

    await Notification.create({
      user: payment.user,
      type: "premium_rejected",
      title: "Payment rejected",
      message: req.body.adminNote || "Your payment could not be verified. Please contact support.",
    });

    res.json({ message: "Payment rejected", payment });
  } catch (error) {
    next(error);
  }
};
