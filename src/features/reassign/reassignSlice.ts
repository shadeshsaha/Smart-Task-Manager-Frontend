import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../api/axios";

export interface ActivityLog {
  id: number;
  message: string;
  createdAt: string;
}

interface ReassignState {
  logs: ActivityLog[];
  loading: boolean;
  error: string | null;
}

const initialState: ReassignState = {
  logs: [],
  loading: false,
  error: null,
};

export const reassignTasks = createAsyncThunk(
  "reassign/reassignTasks",
  async (teamId: number) => {
    const response = await axios.post("/reassign", { teamId });
    return response.data;
  }
);

export const fetchActivityLogs = createAsyncThunk(
  "reassign/fetchActivityLogs",
  async () => {
    const response = await axios.get("/reassign/logs");
    return response.data.logs as ActivityLog[];
  }
);

const reassignSlice = createSlice({
  name: "reassign",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(reassignTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reassignTasks.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(reassignTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Reassignment failed";
      })
      .addCase(fetchActivityLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchActivityLogs.fulfilled,
        (state, action: PayloadAction<ActivityLog[]>) => {
          state.loading = false;
          state.logs = action.payload;
        }
      )
      .addCase(fetchActivityLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load logs";
      });
  },
});

export const { clearError } = reassignSlice.actions;
export default reassignSlice.reducer;
