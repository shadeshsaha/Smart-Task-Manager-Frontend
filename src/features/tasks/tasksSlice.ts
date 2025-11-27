import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../api/axios";

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  projectId: number;
  assignedToId: number | null;
  attachment?: string;
  createdAt?: string;
}

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
};

interface TaskFilter {
  status?: string;
  priority?: string;
  projectId?: number;
  assignedToId?: number;
}

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (filters: TaskFilter) => {
    const params = Object.entries(filters)
      .filter(([, value]) => value !== undefined && value !== null)
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as Record<string, string | number>);
    const response = await axios.get("/tasks", { params });
    return response.data.tasks as Task[];
  }
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (formData: FormData) => {
    const response = await axios.post("/tasks", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.task as Task;
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load tasks";
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks.push(action.payload);
      });
  },
});

export const { clearError } = tasksSlice.actions;
export default tasksSlice.reducer;
