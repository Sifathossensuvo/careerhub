import Job from "../models/Job.js";
import Company from "../models/Company.js";
import Category from "../models/Category.js";
import slugify from "slugify";

// @desc    Get all jobs with filters, search, pagination
// @route   GET /api/jobs
export const getJobs = async (req, res, next) => {
  try {
    const {
      search,
      category,
      location,
      jobType,
      experienceLevel,
      isRemote,
      salaryMin,
      education,
      page = 1,
      limit = 12,
      sort = "-createdAt",
    } = req.query;

    const query = { status: "active" };

    if (search) {
      query.$text = { $search: search };
    }
    if (category) query.category = category;
    if (location) query.location = { $regex: location, $options: "i" };
    if (jobType) query.jobType = jobType;
    if (experienceLevel) query.experienceLevel = experienceLevel;
    if (isRemote === "true") query.isRemote = true;
    if (education) query.education = { $regex: education, $options: "i" };
    if (salaryMin) query.salaryMax = { $gte: Number(salaryMin) };

    const skip = (Number(page) - 1) * Number(limit);

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate("company", "name logo location isFeatured")
        .populate("category", "name")
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      Job.countDocuments(query),
    ]);

    res.json({
      jobs,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job details
// @route   GET /api/jobs/:id
export const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("company", "name logo description website location industry size")
      .populate("category", "name");

    if (!job) return res.status(404).json({ message: "Job not found" });

    job.views += 1;
    await job.save();

    res.json(job);
  } catch (error) {
    next(error);
  }
};

// @desc    Create job (recruiter)
// @route   POST /api/jobs
export const createJob = async (req, res, next) => {
  try {
    const company = await Company.findOne({ owner: req.user._id });
    if (!company) {
      return res.status(400).json({ message: "Please create your company profile first" });
    }

    if (company.jobPostsUsed >= company.jobPostLimit) {
      return res.status(403).json({
        message: `Job post limit reached for your ${company.plan} plan. Please upgrade.`,
      });
    }

    const job = await Job.create({
      ...req.body,
      company: company._id,
      postedBy: req.user._id,
      slug: slugify(`${req.body.title}-${Date.now()}`, { lower: true }),
    });

    company.jobPostsUsed += 1;
    await company.save();

    if (job.category) {
      await Category.findByIdAndUpdate(job.category, { $inc: { jobCount: 1 } });
    }

    res.status(201).json(job);
  } catch (error) {
    next(error);
  }
};

// @desc    Update job (recruiter - owner only)
// @route   PUT /api/jobs/:id
export const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to edit this job" });
    }

    Object.assign(job, req.body);
    await job.save();
    res.json(job);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this job" });
    }

    await job.deleteOne();
    res.json({ message: "Job removed" });
  } catch (error) {
    next(error);
  }
};

// @desc    Get jobs posted by logged in recruiter
// @route   GET /api/jobs/recruiter/mine
export const getMyJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort("-createdAt");
    res.json(jobs);
  } catch (error) {
    next(error);
  }
};

// @desc    Save / unsave a job (jobseeker)
// @route   PUT /api/jobs/:id/save
export const toggleSaveJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const user = req.user;
    const idx = user.savedJobs.findIndex((j) => j.toString() === job._id.toString());

    if (idx > -1) {
      user.savedJobs.splice(idx, 1);
      job.savedCount = Math.max(0, job.savedCount - 1);
    } else {
      user.savedJobs.push(job._id);
      job.savedCount += 1;
    }

    await user.save();
    await job.save();

    res.json({ saved: idx === -1, savedJobs: user.savedJobs });
  } catch (error) {
    next(error);
  }
};

// @desc    Get latest jobs for landing page
// @route   GET /api/jobs/latest
export const getLatestJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ status: "active" })
      .populate("company", "name logo location")
      .sort("-createdAt")
      .limit(8);
    res.json(jobs);
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured jobs
// @route   GET /api/jobs/featured
export const getFeaturedJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ status: "active", isFeatured: true })
      .populate("company", "name logo location")
      .sort("-createdAt")
      .limit(6);
    res.json(jobs);
  } catch (error) {
    next(error);
  }
};
