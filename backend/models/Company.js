import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    logo: {
      url: String,
      publicId: String,
    },
    coverImage: String,
    description: String,
    website: String,
    industry: String,
    size: {
      type: String,
      enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"],
    },
    location: String,
    email: String,
    phone: String,

    isApproved: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },

    plan: {
      type: String,
      enum: ["free", "business", "enterprise"],
      default: "free",
    },
    planExpiresAt: Date,
    jobPostLimit: { type: Number, default: 5 },
    jobPostsUsed: { type: Number, default: 0 },

    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model("Company", companySchema);
