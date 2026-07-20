/**
 * NOTE ON AI FEATURES
 * ---------------------------------------------------------
 * These endpoints use rule-based / heuristic logic so the platform
 * works out of the box with zero API cost. If you want genuinely
 * AI-generated text (e.g. via the Anthropic API), replace the logic
 * inside each function with a call to your model of choice using
 * your own API key - the request/response shape below will stay
 * the same, so the frontend won't need to change.
 * ---------------------------------------------------------
 */

const COMMON_ATS_KEYWORDS = [
  "managed", "led", "developed", "designed", "implemented", "improved",
  "analyzed", "created", "built", "coordinated", "achieved", "increased",
  "reduced", "optimized", "delivered",
];

// @desc    Score a resume based on completeness + keyword usage
// @route   POST /api/ai/resume-score
export const resumeScore = async (req, res, next) => {
  try {
    const { summary = "", skills = [], experience = [], education = [] } = req.body;

    let score = 0;
    const feedback = [];

    if (summary && summary.length > 50) {
      score += 20;
    } else {
      feedback.push("Add a stronger professional summary (at least 50 characters).");
    }

    if (skills.length >= 5) {
      score += 20;
    } else {
      feedback.push("List at least 5 relevant skills.");
    }

    if (experience.length >= 1) {
      score += 25;
    } else {
      feedback.push("Add at least one work experience entry.");
    }

    if (education.length >= 1) {
      score += 15;
    } else {
      feedback.push("Add your education details.");
    }

    const textBlob = (summary + " " + experience.map((e) => e.description || "").join(" ")).toLowerCase();
    const keywordHits = COMMON_ATS_KEYWORDS.filter((k) => textBlob.includes(k));
    score += Math.min(20, keywordHits.length * 4);

    if (keywordHits.length < 3) {
      feedback.push("Use more action verbs like 'led', 'developed', 'improved' to describe your work.");
    }

    res.json({ score: Math.min(100, score), feedback, keywordHits });
  } catch (error) {
    next(error);
  }
};

// @desc    Simple ATS compatibility checker for a job description match
// @route   POST /api/ai/ats-check
export const atsCheck = async (req, res, next) => {
  try {
    const { resumeText = "", jobDescription = "" } = req.body;

    const jdWords = Array.from(
      new Set(
        jobDescription
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, "")
          .split(/\s+/)
          .filter((w) => w.length > 3)
      )
    );

    const resumeLower = resumeText.toLowerCase();
    const matched = jdWords.filter((w) => resumeLower.includes(w));
    const missing = jdWords.filter((w) => !resumeLower.includes(w)).slice(0, 15);

    const matchPercent = jdWords.length ? Math.round((matched.length / jdWords.length) * 100) : 0;

    res.json({
      matchPercent,
      matchedKeywords: matched.slice(0, 25),
      missingKeywords: missing,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate a cover letter template filled with user + job info
// @route   POST /api/ai/cover-letter
export const generateCoverLetter = async (req, res, next) => {
  try {
    const { userName, jobTitle, companyName, topSkills = [] } = req.body;

    const skillsText = topSkills.length
      ? topSkills.slice(0, 3).join(", ")
      : "my relevant technical and professional skills";

    const letter = `Dear Hiring Manager,

I am writing to express my interest in the ${jobTitle || "advertised"} position at ${companyName || "your company"}. With a strong background in ${skillsText}, I am confident I can contribute meaningfully to your team.

Throughout my career, I have consistently focused on delivering results, collaborating effectively, and continuously improving my craft. I am particularly drawn to this opportunity because it aligns closely with my skills and long-term career goals.

I would welcome the chance to discuss how my background, skills, and enthusiasm can benefit ${companyName || "your organization"}. Thank you for considering my application.

Sincerely,
${userName || "Your Name"}`;

    res.json({ coverLetter: letter });
  } catch (error) {
    next(error);
  }
};

// @desc    Basic job match score between a user's skills and a job's required skills
// @route   POST /api/ai/job-match
export const jobMatchScore = async (req, res, next) => {
  try {
    const { userSkills = [], jobSkills = [] } = req.body;
    const userSet = new Set(userSkills.map((s) => s.toLowerCase().trim()));
    const jobSet = jobSkills.map((s) => s.toLowerCase().trim());

    const matched = jobSet.filter((s) => userSet.has(s));
    const score = jobSet.length ? Math.round((matched.length / jobSet.length) * 100) : 0;

    res.json({ score, matchedSkills: matched, missingSkills: jobSet.filter((s) => !userSet.has(s)) });
  } catch (error) {
    next(error);
  }
};

// @desc    Skill gap analysis for a target role (static role -> skills map)
// @route   POST /api/ai/skill-gap
export const skillGapAnalysis = async (req, res, next) => {
  try {
    const ROLE_SKILLS = {
      "frontend developer": ["html", "css", "javascript", "react", "git", "responsive design"],
      "backend developer": ["node.js", "express", "mongodb", "sql", "rest api", "git"],
      "data analyst": ["excel", "sql", "python", "power bi", "data visualization", "statistics"],
      "digital marketer": ["seo", "google ads", "facebook ads", "content writing", "analytics"],
      "graphic designer": ["photoshop", "illustrator", "figma", "typography", "branding"],
    };

    const { targetRole = "", currentSkills = [] } = req.body;
    const key = targetRole.toLowerCase().trim();
    const requiredSkills = ROLE_SKILLS[key] || [];
    const currentSet = new Set(currentSkills.map((s) => s.toLowerCase().trim()));

    const have = requiredSkills.filter((s) => currentSet.has(s));
    const missing = requiredSkills.filter((s) => !currentSet.has(s));

    res.json({
      targetRole,
      have,
      missing,
      readiness: requiredSkills.length ? Math.round((have.length / requiredSkills.length) * 100) : 0,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Return sample interview questions for a job title (static bank)
// @route   GET /api/ai/interview-questions?role=...
export const interviewQuestions = async (req, res, next) => {
  try {
    const generic = [
      "Tell me about yourself.",
      "Why do you want to work for this company?",
      "What are your greatest strengths and weaknesses?",
      "Describe a challenging situation at work and how you handled it.",
      "Where do you see yourself in 5 years?",
      "Why should we hire you?",
    ];
    res.json({ role: req.query.role || "General", questions: generic });
  } catch (error) {
    next(error);
  }
};
