import api from "./api";

export const getResumeScore = (data) => api.post("/ai/resume-score", data).then((r) => r.data);
export const getAtsCheck = (data) => api.post("/ai/ats-check", data).then((r) => r.data);
export const getCoverLetter = (data) => api.post("/ai/cover-letter", data).then((r) => r.data);
export const getJobMatchScore = (data) => api.post("/ai/job-match", data).then((r) => r.data);
export const getSkillGap = (data) => api.post("/ai/skill-gap", data).then((r) => r.data);
export const getInterviewQuestions = (role) => api.get("/ai/interview-questions", { params: { role } }).then((r) => r.data);
