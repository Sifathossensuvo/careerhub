import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: String,
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    description: { type: String, required: true },
    requirements: [String],
    responsibilities: [String],
    benefits: [String],

    location: { type: String, required: true },
    isRemote: { type: Boolean, default: false },

    jobType: {
      type: String,
      enum: ["full-time", "part-time", "internship", "contract", "temporary"],
      required: true,
    },
    experienceLevel: {
      type: String,
      enum: ["entry", "mid", "senior", "lead", "no-experience"],
      default: "entry",
    },
    education: String,

    salaryMin: Number,
    salaryMax: Number,
    salaryNegotiable: { type: Boolean, default: false },
    currency: { type: String, default: "BDT" },

    skills: [String],
    vacancies: { type: Number, default: 1 },
    deadline: { type: Date, required: true },

    status: {
      type: String,
      enum: ["active", "closed", "draft", "pending"],
      default: "active",
    },
    isFeatured: { type: Boolean, default: false },
    isEarlyAccess: { type: Boolean, default: false }, // Pro+ users see it X hours early

    views: { type: Number, default: 0 },
    applicationsCount: { type: Number, default: 0 },
    savedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

jobSchema.index({ title: "text", description: "text", skills: "text" });
jobSchema.index({ location: 1, jobType: 1, category: 1 });

export default mongoose.model("Job", jobSchema);
