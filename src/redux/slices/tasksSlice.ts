/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/tasks";

interface Task {
  id: number;
  title: string;
  description?: string;
  priority: string;
  status: string;
  projectId: number;
  assignedToId?: number;
  assignedTo?: any;
  attachment?: string;
}

interface TasksState {
  tasks: Task[];
  loading: boolean;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
};

// Fetch all tasks (with optional filters)
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async ({ token, projectId, memberId }: any) => {
    const res = await axios.get(API_URL, {
      params: { projectId, memberId },
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.tasks;
  }
);

// Create task
export const createTask = createAsyncThunk(
  "tasks/createTask",
  async ({ data, token }: any) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined && data[key] !== null)
        formData.append(key, data[key]);
    });

    const res = await axios.post(API_URL, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data.task;
  }
);

// Update task
export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, data, token }: any) => {
    const res = await axios.put(`${API_URL}/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.task;
  }
);

// Delete task
export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async ({ id, token }: any) => {
    await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return id;
  }
);

// Auto-assign
export const autoAssignTask = createAsyncThunk(
  "tasks/autoAssignTask",
  async ({ taskId, projectId, token }: any) => {
    const res = await axios.post(
      `${API_URL}/auto-assign`,
      { taskId, projectId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data.task;
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.loading = false;
      })
      .addCase(fetchTasks.rejected, (state) => {
        state.loading = false;
      })

      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.map((t) =>
          t.id === action.payload.id ? action.payload : t
        );
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      })
      .addCase(autoAssignTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.map((t) =>
          t.id === action.payload.id ? action.payload : t
        );
      });
  },
});

export default tasksSlice.reducer;
