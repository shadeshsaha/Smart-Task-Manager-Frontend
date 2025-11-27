import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../api/axios";

export interface ActivityLogEntry {
  id: number;
  message: string;
  createdAt: string;
  user?: string;
  actionType?: string;
}

interface ActivityLogState {
  logs: ActivityLogEntry[];
  loading: boolean;
  error: string | null;
}

const initialState: ActivityLogState = {
  logs: [],
  loading: false,
  error: null,
};

export const fetchActivityLogs = createAsyncThunk(
  "activityLog/fetchActivityLogs",
  async () => {
    const response = await axios.get("/activity/logs");
    return response.data.logs as ActivityLogEntry[];
  }
);

const activityLogSlice = createSlice({
  name: "activityLog",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivityLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchActivityLogs.fulfilled,
        (state, action: PayloadAction<ActivityLogEntry[]>) => {
          state.loading = false;
          state.logs = action.payload;
        }
      )
      .addCase(fetchActivityLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load activity logs";
      });
  },
});

export const { clearError } = activityLogSlice.actions;
export default activityLogSlice.reducer;
