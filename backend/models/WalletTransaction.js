import mongoose from "mongoose";

const walletTransactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["deposit", "withdraw", "referral_bonus", "spend"], required: true },
    amount: { type: Number, required: true },
    description: String,
    status: { type: String, enum: ["pending", "completed", "failed"], default: "completed" },
  },
  { timestamps: true }
);

export default mongoose.model("WalletTransaction", walletTransactionSchema);
