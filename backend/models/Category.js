import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: String,
    icon: String,
    jobCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
