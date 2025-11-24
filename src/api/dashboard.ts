import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const getDashboardStats = async (token: string) => {
  const res = await axios.get(`${API_URL}/projects/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getActivityLogs = async (token: string) => {
  const res = await axios.get(`${API_URL}/reassign/logs`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.logs;
};
