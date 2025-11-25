/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const getProjects = async (token: string) => {
  const res = await axios.get(`${API_URL}/projects`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.projects;
};

export const createProject = async (data: any, token: string) => {
  const res = await axios.post(`${API_URL}/projects`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.project;
};

export const updateProject = async (id: number, data: any, token: string) => {
  const res = await axios.put(`${API_URL}/projects/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.project;
};

export const deleteProject = async (id: number, token: string) => {
  const res = await axios.delete(`${API_URL}/projects/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
