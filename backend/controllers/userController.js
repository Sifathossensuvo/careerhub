import User from "../models/User.js";
import Notification from "../models/Notification.js";

// @desc    Update own profile
// @route   PUT /api/users/profile
export const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      "name",
      "phone",
      "headline",
      "bio",
      "location",
      "skills",
      "education",
      "experience",
      "certificates",
      "languages",
      "resumeUrl",
      "avatar",
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Get public profile of a job seeker (for recruiters viewing applicants)
// @route   GET /api/users/:id
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(
      "name headline bio location skills education experience certificates languages avatar resumeUrl isPremium premiumPlan"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's saved jobs
// @route   GET /api/users/saved-jobs
export const getSavedJobs = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "savedJobs",
      populate: { path: "company", select: "name logo location" },
    });
    res.json(user.savedJobs);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's notifications
// @route   GET /api/users/notifications
export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort("-createdAt").limit(50);
    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/users/notifications/:id/read
export const markNotificationRead = async (req, res, next) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isRead: true }
    );
    res.json({ message: "Marked as read" });
  } catch (error) {
    next(error);
  }
};
