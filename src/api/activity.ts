import api from "./axios";

export const fetchRecentLogs = (limit = 5) =>
  api.get("/reassign/logs", { params: { limit } });
export const fetchAllLogs = () => api.get("/reassign/logs/all");
