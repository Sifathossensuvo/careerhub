import Company from "../models/Company.js";
import User from "../models/User.js";
import slugify from "slugify";

// @desc    Create company profile (recruiter)
// @route   POST /api/companies
export const createCompany = async (req, res, next) => {
  try {
    const existing = await Company.findOne({ owner: req.user._id });
    if (existing) {
      return res.status(400).json({ message: "You already have a company profile" });
    }

    const company = await Company.create({
      ...req.body,
      owner: req.user._id,
      slug: slugify(`${req.body.name}-${Date.now()}`, { lower: true }),
    });

    await User.findByIdAndUpdate(req.user._id, { company: company._id });

    res.status(201).json(company);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all companies (public directory)
// @route   GET /api/companies
export const getCompanies = async (req, res, next) => {
  try {
    const { search, industry, page = 1, limit = 12 } = req.query;
    const query = { isApproved: true, isBanned: false };

    if (search) query.name = { $regex: search, $options: "i" };
    if (industry) query.industry = industry;

    const skip = (Number(page) - 1) * Number(limit);
    const [companies, total] = await Promise.all([
      Company.find(query).sort("-isFeatured -createdAt").skip(skip).limit(Number(limit)),
      Company.countDocuments(query),
    ]);

    res.json({ companies, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    next(error);
  }
};

// @desc    Get company by slug/id + open jobs
// @route   GET /api/companies/:id
export const getCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json(company);
  } catch (error) {
    next(error);
  }
};

// @desc    Update own company profile
// @route   PUT /api/companies/:id
export const updateCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });

    if (company.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    Object.assign(company, req.body);
    await company.save();
    res.json(company);
  } catch (error) {
    next(error);
  }
};

// @desc    Follow / unfollow a company
// @route   PUT /api/companies/:id/follow
export const toggleFollowCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });

    const user = req.user;
    const idx = company.followers.findIndex((f) => f.toString() === user._id.toString());

    if (idx > -1) {
      company.followers.splice(idx, 1);
      user.followedCompanies.pull(company._id);
    } else {
      company.followers.push(user._id);
      user.followedCompanies.push(company._id);
    }

    await company.save();
    await user.save();

    res.json({ following: idx === -1 });
  } catch (error) {
    next(error);
  }
};
