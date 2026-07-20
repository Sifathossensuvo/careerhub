import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },

    resumeUrl: String,
    coverLetter: String,

    status: {
      type: String,
      enum: ["applied", "viewed", "shortlisted", "rejected", "hired"],
      default: "applied",
    },
    isPriority: { type: Boolean, default: false }, // Pro/Elite priority badge

    matchScore: Number, // AI job match score (0-100)

    notes: String, // recruiter's private notes
  },
  { timestamps: true }
);

applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);
