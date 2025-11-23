/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "./axios";

export const fetchProjects = () => api.get("/projects");
export const fetchProject = (id: number) => api.get(`/projects/${id}`);
export const createProject = (payload: any) => api.post("/projects", payload);
export const updateProject = (id: number, payload: any) =>
  api.put(`/projects/${id}`, payload);
export const deleteProject = (id: number) => api.delete(`/projects/${id}`);
