import api from "./api";

export const fetchJobs = (params) => api.get("/jobs", { params }).then((r) => r.data);
export const fetchLatestJobs = () => api.get("/jobs/latest").then((r) => r.data);
export const fetchFeaturedJobs = () => api.get("/jobs/featured").then((r) => r.data);
export const fetchJobById = (id) => api.get(`/jobs/${id}`).then((r) => r.data);
export const fetchMyJobs = () => api.get("/jobs/recruiter/mine").then((r) => r.data);
export const createJob = (data) => api.post("/jobs", data).then((r) => r.data);
export const updateJob = (id, data) => api.put(`/jobs/${id}`, data).then((r) => r.data);
export const deleteJob = (id) => api.delete(`/jobs/${id}`).then((r) => r.data);
export const toggleSaveJob = (id) => api.put(`/jobs/${id}/save`).then((r) => r.data);
export const fetchCategories = () => api.get("/categories").then((r) => r.data);
