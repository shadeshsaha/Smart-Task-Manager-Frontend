/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import api from "./axios";

// export const fetchTasks = (params?: Record<string, any>) =>
//   api.get("/tasks", { params });

// export const fetchTask = (id: number) => api.get(`/tasks/${id}`);

// export const createTask = (formData: FormData) =>
//   api.post("/tasks", formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });

// export const updateTask = (id: number, payload: any) =>
//   api.put(`/tasks/${id}`, payload);

// export const deleteTask = (id: number) => api.delete(`/tasks/${id}`);

// export const autoAssignTask = (payload: {
//   projectId: number;
//   taskId: number;
// }) => api.post("/tasks/auto-assign", payload);

import API from "../api/axios";

export const fetchTasksApi = async (params?: {
  projectId?: number | string;
  status?: string;
  priority?: string;
}) => {
  const res = await API.get("/tasks", { params });
  return res.data.tasks;
};

export const createTaskApi = async (formData: FormData) => {
  const res = await API.post("/tasks", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.task;
};

export const updateTaskApi = async (id: number, data: any) => {
  // backend may expect JSON for PUT; if updating attachment, use multipart
  const res = await API.put(`/tasks/${id}`, data);
  return res.data.task;
};

export const deleteTaskApi = async (id: number) => {
  const res = await API.delete(`/tasks/${id}`);
  return res.data;
};

export const autoAssignApi = async (payload: {
  projectId: number;
  taskId: number;
}) => {
  const res = await API.post("/tasks/auto-assign", payload);
  return res.data.task;
};

// Get project details (use to get team members)
export const getProjectDetails = async (projectId: number) => {
  const res = await API.get(`/projects/${projectId}`);
  return res.data; // expect project + team.members
};
