import User from "../models/User.js";
import Company from "../models/Company.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import Payment from "../models/Payment.js";
import Notification from "../models/Notification.js";

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalJobseekers,
      totalRecruiters,
      premiumUsers,
      totalJobs,
      activeJobs,
      totalCompanies,
      totalApplications,
      pendingPayments,
      approvedPayments,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "jobseeker" }),
      User.countDocuments({ role: "recruiter" }),
      User.countDocuments({ isPremium: true }),
      Job.countDocuments(),
      Job.countDocuments({ status: "active" }),
      Company.countDocuments(),
      Application.countDocuments(),
      Payment.countDocuments({ status: "pending" }),
      Payment.find({ status: "approved" }),
    ]);

    const totalRevenue = approvedPayments.reduce((sum, p) => sum + p.amount, 0);

    res.json({
      totalUsers,
      totalJobseekers,
      totalRecruiters,
      premiumUsers,
      totalJobs,
      activeJobs,
      totalCompanies,
      totalApplications,
      pendingPayments,
      totalRevenue,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (with filters)
// @route   GET /api/admin/users
export const getAllUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(query).select("-password").sort("-createdAt").skip(skip).limit(Number(limit)),
      User.countDocuments(query),
    ]);
    res.json({ users, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    next(error);
  }
};

// @desc    Ban / unban a user
// @route   PUT /api/admin/users/:id/ban
export const toggleBanUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBanned = !user.isBanned;
    user.banReason = user.isBanned ? req.body.reason : undefined;
    await user.save();

    res.json({ message: user.isBanned ? "User banned" : "User unbanned", user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all companies for admin (incl. unapproved)
// @route   GET /api/admin/companies
export const getAllCompanies = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status === "pending") query.isApproved = false;
    if (status === "approved") query.isApproved = true;

    const skip = (Number(page) - 1) * Number(limit);
    const [companies, total] = await Promise.all([
      Company.find(query).populate("owner", "name email").sort("-createdAt").skip(skip).limit(Number(limit)),
      Company.countDocuments(query),
    ]);
    res.json({ companies, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve a company
// @route   PUT /api/admin/companies/:id/approve
export const approveCompany = async (req, res, next) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    if (!company) return res.status(404).json({ message: "Company not found" });

    await Notification.create({
      user: company.owner,
      type: "system",
      title: "Company approved",
      message: `Your company "${company.name}" has been approved and is now live.`,
    });

    res.json(company);
  } catch (error) {
    next(error);
  }
};

// @desc    Ban / unban a company
// @route   PUT /api/admin/companies/:id/ban
export const toggleBanCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });
    company.isBanned = !company.isBanned;
    await company.save();
    res.json(company);
  } catch (error) {
    next(error);
  }
};

// @desc    Feature / unfeature a company
// @route   PUT /api/admin/companies/:id/feature
export const toggleFeatureCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });
    company.isFeatured = !company.isFeatured;
    await company.save();
    res.json(company);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs for admin moderation
// @route   GET /api/admin/jobs
export const getAllJobsAdmin = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [jobs, total] = await Promise.all([
      Job.find(query).populate("company", "name").sort("-createdAt").skip(skip).limit(Number(limit)),
      Job.countDocuments(query),
    ]);
    res.json({ jobs, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    next(error);
  }
};

// @desc    Feature / unfeature a job
// @route   PUT /api/admin/jobs/:id/feature
export const toggleFeatureJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    job.isFeatured = !job.isFeatured;
    await job.save();
    res.json(job);
  } catch (error) {
    next(error);
  }
};

// @desc    Force close a job
// @route   PUT /api/admin/jobs/:id/close
export const closeJobAdmin = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, { status: "closed" }, { new: true });
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (error) {
    next(error);
  }
};

// @desc    Send a broadcast email/notification to all users or a role group
// @route   POST /api/admin/broadcast
export const broadcastNotification = async (req, res, next) => {
  try {
    const { role, title, message } = req.body;
    const query = role && role !== "all" ? { role } : {};
    const users = await User.find(query).select("_id");

    const notifications = users.map((u) => ({
      user: u._id,
      type: "system",
      title,
      message,
    }));

    await Notification.insertMany(notifications);

    res.json({ message: `Broadcast sent to ${users.length} users` });
  } catch (error) {
    next(error);
  }
};
