/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "./axios";

export const fetchTasks = (params?: Record<string, any>) =>
  api.get("/tasks", { params });

export const fetchTask = (id: number) => api.get(`/tasks/${id}`);

export const createTask = (formData: FormData) =>
  api.post("/tasks", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateTask = (id: number, payload: any) =>
  api.put(`/tasks/${id}`, payload);

export const deleteTask = (id: number) => api.delete(`/tasks/${id}`);

export const autoAssignTask = (payload: {
  projectId: number;
  taskId: number;
}) => api.post("/tasks/auto-assign", payload);
