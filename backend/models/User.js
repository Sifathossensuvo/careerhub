import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const educationSchema = new mongoose.Schema(
  {
    institute: String,
    degree: String,
    field: String,
    startYear: Number,
    endYear: Number,
  },
  { _id: false }
);

const experienceSchema = new mongoose.Schema(
  {
    company: String,
    title: String,
    startDate: Date,
    endDate: Date,
    current: { type: Boolean, default: false },
    description: String,
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6, select: false },
    phone: { type: String, trim: true },
    role: {
      type: String,
      enum: ["jobseeker", "recruiter", "admin"],
      default: "jobseeker",
    },
    avatar: {
      url: String,
      publicId: String,
    },

    // Job seeker profile
    headline: String,
    bio: String,
    location: String,
    skills: [String],
    education: [educationSchema],
    experience: [experienceSchema],
    certificates: [String],
    languages: [String],
    resumeUrl: String,

    // Recruiter link
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },

    // Premium subscription
    isPremium: { type: Boolean, default: false },
    premiumPlan: {
      type: String,
      enum: ["free", "basic", "pro", "elite"],
      default: "free",
    },
    premiumExpiresAt: Date,

    // Usage limits
    dailyApplicationCount: { type: Number, default: 0 },
    dailyApplicationDate: Date,

    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    followedCompanies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company" }],

    // Wallet
    walletBalance: { type: Number, default: 0 },
    referralCode: String,
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // Account status
    isVerified: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
    banReason: String,

    // Email verification / password reset
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Free tier daily application limit
userSchema.methods.canApplyToday = function () {
  if (this.isPremium) return true;
  const today = new Date().toDateString();
  const lastDate = this.dailyApplicationDate
    ? new Date(this.dailyApplicationDate).toDateString()
    : null;
  if (lastDate !== today) return true;
  return this.dailyApplicationCount < 5;
};

export default mongoose.model("User", userSchema);
