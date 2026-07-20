import api from "./api";

export const applyToJob = (jobId, data) => api.post(`/applications/${jobId}`, data).then((r) => r.data);
export const fetchMyApplications = () => api.get("/applications/mine").then((r) => r.data);
export const fetchApplicantsForJob = (jobId, params) =>
  api.get(`/applications/job/${jobId}`, { params }).then((r) => r.data);
export const updateApplicationStatus = (id, status) =>
  api.put(`/applications/${id}/status`, { status }).then((r) => r.data);
