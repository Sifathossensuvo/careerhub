import crypto from "crypto";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";

// @desc    Register new user (jobseeker or recruiter)
// @route   POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const verificationToken = crypto.randomBytes(20).toString("hex");

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role === "recruiter" ? "recruiter" : "jobseeker",
      verificationToken,
      referralCode: crypto.randomBytes(4).toString("hex"),
    });

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
    await sendEmail({
      to: user.email,
      subject: "Verify your CareerHub BD account",
      html: `<p>Hi ${user.name},</p><p>Please verify your email by clicking <a href="${verifyUrl}">this link</a>.</p>`,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.isBanned) {
      return res.status(403).json({ message: "Your account has been banned. Contact support." });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isPremium: user.isPremium,
      premiumPlan: user.premiumPlan,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("company", "name logo slug")
      .select("-password");
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
export const verifyEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired verification link" });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    res.json({ message: "Email verified successfully" });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password - send reset link
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      // Don't reveal whether the email exists
      return res.json({ message: "If that email exists, a reset link has been sent" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 mins
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: "Reset your CareerHub BD password",
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 30 minutes.</p>`,
    });

    res.json({ message: "If that email exists, a reset link has been sent" });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
export const resetPassword = async (req, res, next) => {
  try {
    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful. Please log in." });
  } catch (error) {
    next(error);
  }
};
