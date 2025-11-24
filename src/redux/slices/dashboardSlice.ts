/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getActivityLogs, getDashboardStats } from "../../api/dashboard";

interface DashboardState {
  totalProjects: number;
  totalTasks: number;
  teamSummary: any[];
  logs: any[];
  loading: boolean;
}

const initialState: DashboardState = {
  totalProjects: 0,
  totalTasks: 0,
  teamSummary: [],
  logs: [],
  loading: false,
};

export const fetchDashboard = createAsyncThunk(
  "dashboard/fetchDashboard",
  async (token: string) => {
    const stats = await getDashboardStats(token);
    const logs = await getActivityLogs(token);
    return { ...stats, logs };
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchDashboard.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchDashboard.fulfilled, (state, action) => {
      state.loading = false;
      state.totalProjects = action.payload.totalProjects;
      state.totalTasks = action.payload.totalTasks;
      state.teamSummary = action.payload.teamSummary;
      state.logs = action.payload.logs;
    });
    builder.addCase(fetchDashboard.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default dashboardSlice.reducer;
