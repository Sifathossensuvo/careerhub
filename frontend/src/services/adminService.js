import api from "./api";

export const fetchAdminStats = () => api.get("/admin/stats").then((r) => r.data);
export const fetchAllUsers = (params) => api.get("/admin/users", { params }).then((r) => r.data);
export const toggleBanUser = (id, reason) => api.put(`/admin/users/${id}/ban`, { reason }).then((r) => r.data);
export const fetchAllCompaniesAdmin = (params) => api.get("/admin/companies", { params }).then((r) => r.data);
export const approveCompanyAdmin = (id) => api.put(`/admin/companies/${id}/approve`).then((r) => r.data);
export const toggleBanCompanyAdmin = (id) => api.put(`/admin/companies/${id}/ban`).then((r) => r.data);
export const toggleFeatureCompanyAdmin = (id) => api.put(`/admin/companies/${id}/feature`).then((r) => r.data);
export const fetchAllJobsAdmin = (params) => api.get("/admin/jobs", { params }).then((r) => r.data);
export const toggleFeatureJobAdmin = (id) => api.put(`/admin/jobs/${id}/feature`).then((r) => r.data);
export const closeJobAdmin = (id) => api.put(`/admin/jobs/${id}/close`).then((r) => r.data);
export const fetchPendingPayments = () => api.get("/payments/pending").then((r) => r.data);
export const approvePaymentAdmin = (id) => api.put(`/payments/${id}/approve`).then((r) => r.data);
export const rejectPaymentAdmin = (id, adminNote) => api.put(`/payments/${id}/reject`, { adminNote }).then((r) => r.data);
export const sendBroadcast = (data) => api.post("/admin/broadcast", data).then((r) => r.data);
