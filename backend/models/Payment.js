import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    purpose: {
      type: String,
      enum: ["premium_subscription", "recruiter_plan", "wallet_deposit"],
      required: true,
    },
    // What is being purchased, e.g. "basic" | "pro" | "elite" | "business" | "enterprise"
    planName: String,

    amount: { type: Number, required: true },
    method: { type: String, enum: ["bkash", "nagad"], required: true },

    senderNumber: { type: String, required: true },
    transactionId: { type: String, required: true },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    adminNote: String,
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
