import api from "./api";

export const fetchPaymentInstructions = () => api.get("/payments/instructions").then((r) => r.data);
export const submitPayment = (data) => api.post("/payments/submit", data).then((r) => r.data);
export const fetchMyPayments = () => api.get("/payments/mine").then((r) => r.data);
export const fetchJobseekerPlans = () => api.get("/subscriptions/plans").then((r) => r.data);
export const fetchRecruiterPlans = () => api.get("/subscriptions/recruiter-plans").then((r) => r.data);
