// Static plan catalogue - manual payment system (no payment gateway)
export const JOBSEEKER_PLANS = [
  {
    key: "free",
    name: "Free",
    price: 0,
    features: ["Browse all jobs", "Basic profile", "Save jobs", "5 applications/day", "Basic search"],
  },
  {
    key: "basic",
    name: "Basic",
    price: 199,
    features: [
      "Unlimited Apply",
      "Email Notifications",
      "Save Unlimited Jobs",
      "Apply History",
      "Company Follow",
      "Salary Filter",
      "Hide Applied Jobs",
      "Premium Badge",
      "3 Premium CV Templates",
    ],
  },
  {
    key: "pro",
    name: "Pro",
    price: 399,
    features: [
      "Everything in Basic",
      "Early Job Access",
      "AI Resume Review",
      "AI Cover Letter Generator",
      "Resume Score",
      "ATS Resume Checker",
      "Priority Apply Badge",
      "Interview Questions",
      "Unlimited CV Download",
    ],
  },
  {
    key: "elite",
    name: "Elite",
    price: 699,
    features: [
      "Everything in Pro",
      "Featured Candidate",
      "Top Search Ranking",
      "Verified Premium Badge",
      "AI Interview Practice",
      "Career Roadmap",
      "Skill Gap Analysis",
      "Resume Expert Review",
      "Unlimited AI Career Tools",
      "Priority Support",
    ],
  },
];

export const RECRUITER_PLANS = [
  { key: "free", name: "Free", price: 0, jobPosts: 5, features: ["5 Job Posts"] },
  {
    key: "business",
    name: "Business",
    price: 999,
    jobPosts: 20,
    features: ["20 Job Posts"],
  },
  {
    key: "enterprise",
    name: "Enterprise",
    price: 2999,
    jobPosts: "Unlimited",
    features: ["Unlimited Jobs", "Featured Company", "Analytics", "Priority Listing"],
  },
];

// @desc    Get job seeker premium plans
// @route   GET /api/subscriptions/plans
export const getJobseekerPlans = async (req, res) => {
  res.json(JOBSEEKER_PLANS);
};

// @desc    Get recruiter plans
// @route   GET /api/subscriptions/recruiter-plans
export const getRecruiterPlans = async (req, res) => {
  res.json(RECRUITER_PLANS);
};
