import api from "./api";

export const fetchSavedJobsList = () => api.get("/users/saved-jobs").then((r) => r.data);
