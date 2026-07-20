import api from "./api";

export const fetchCompanies = (params) => api.get("/companies", { params }).then((r) => r.data);
export const fetchCompanyById = (id) => api.get(`/companies/${id}`).then((r) => r.data);
export const createCompany = (data) => api.post("/companies", data).then((r) => r.data);
export const updateCompany = (id, data) => api.put(`/companies/${id}`, data).then((r) => r.data);
export const toggleFollowCompany = (id) => api.put(`/companies/${id}/follow`).then((r) => r.data);
