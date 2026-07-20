import Application from "../models/Application.js";
import Job from "../models/Job.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

// @desc    Apply to a job (jobseeker)
// @route   POST /api/applications/:jobId
export const applyToJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job || job.status !== "active") {
      return res.status(404).json({ message: "Job not found or no longer active" });
    }

    const user = req.user;
    if (!user.canApplyToday()) {
      return res.status(403).json({
        message: "Daily application limit (5) reached for free users. Upgrade to Premium for unlimited applications.",
      });
    }

    const existing = await Application.findOne({ job: job._id, applicant: user._id });
    if (existing) {
      return res.status(400).json({ message: "You have already applied to this job" });
    }

    const application = await Application.create({
      job: job._id,
      applicant: user._id,
      company: job.company,
      resumeUrl: req.body.resumeUrl || user.resumeUrl,
      coverLetter: req.body.coverLetter,
      isPriority: user.isPremium && (user.premiumPlan === "pro" || user.premiumPlan === "elite"),
    });

    job.applicationsCount += 1;
    await job.save();

    const today = new Date().toDateString();
    const lastDate = user.dailyApplicationDate ? new Date(user.dailyApplicationDate).toDateString() : null;
    if (lastDate !== today) {
      user.dailyApplicationCount = 1;
      user.dailyApplicationDate = new Date();
    } else {
      user.dailyApplicationCount += 1;
    }
    await user.save();

    res.status(201).json(application);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in jobseeker's applications
// @route   GET /api/applications/mine
export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate({ path: "job", select: "title location jobType deadline status", populate: { path: "company", select: "name logo" } })
      .sort("-createdAt");
    res.json(applications);
  } catch (error) {
    next(error);
  }
};

// @desc    Get applicants for a specific job (recruiter)
// @route   GET /api/applications/job/:jobId
export const getApplicantsForJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { status, search } = req.query;
    const query = { job: job._id };
    if (status) query.status = status;

    let applications = await Application.find(query)
      .populate("applicant", "name email phone avatar headline skills resumeUrl location")
      .sort("-isPriority -createdAt");

    if (search) {
      const s = search.toLowerCase();
      applications = applications.filter(
        (a) =>
          a.applicant.name.toLowerCase().includes(s) ||
          (a.applicant.skills || []).some((sk) => sk.toLowerCase().includes(s))
      );
    }

    res.json(applications);
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (shortlist/reject/hire)
// @route   PUT /api/applications/:id/status
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id).populate("job");

    if (!application) return res.status(404).json({ message: "Application not found" });

    if (
      application.job.postedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    application.status = status;
    await application.save();

    await Notification.create({
      user: application.applicant,
      type: "application_status",
      title: "Application status updated",
      message: `Your application for "${application.job.title}" is now: ${status}`,
      link: `/dashboard/applications`,
    });

    res.json(application);
  } catch (error) {
    next(error);
  }
};
