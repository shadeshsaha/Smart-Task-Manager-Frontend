/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../api/axios";

interface TeamMember {
  id: number;
  userId: number;
  role: string;
  capacity: number;
  user: { name: string };
  tasks: any[];
}

interface Team {
  id: number;
  name: string;
  members: TeamMember[];
}

interface TeamsState {
  teams: Team[];
  members: TeamMember[];
  loading: boolean;
  error: string | null;
}

const initialState: TeamsState = {
  teams: [],
  members: [],
  loading: false,
  error: null,
};

export const fetchTeams = createAsyncThunk("teams/fetchTeams", async () => {
  const response = await axios.get("/teams");
  return response.data.teams as Team[];
});

export const fetchTeamMembers = createAsyncThunk(
  "teams/fetchTeamMembers",
  async (teamId: number) => {
    const response = await axios.get(`/teams/${teamId}/members`);
    return response.data.members as TeamMember[];
  }
);

export const addTeam = createAsyncThunk(
  "teams/addTeam",
  async (name: string) => {
    const response = await axios.post("/teams", { name });
    return response.data.team as Team;
  }
);

export const addTeamMember = createAsyncThunk(
  "teams/addTeamMember",
  async (payload: {
    teamId: number;
    userId: number;
    role: string;
    capacity: number;
  }) => {
    const response = await axios.post("/teams/member", payload);
    return response.data.member as TeamMember;
  }
);

const teamsSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeams.fulfilled, (state, action: PayloadAction<Team[]>) => {
        state.loading = false;
        state.teams = action.payload;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load teams";
      })
      .addCase(fetchTeamMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTeamMembers.fulfilled,
        (state, action: PayloadAction<TeamMember[]>) => {
          state.loading = false;
          state.members = action.payload;
        }
      )
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load team members";
      })
      .addCase(addTeam.fulfilled, (state, action: PayloadAction<Team>) => {
        state.teams.push(action.payload);
      })
      .addCase(
        addTeamMember.fulfilled,
        (state, action: PayloadAction<TeamMember>) => {
          state.members.push(action.payload);
        }
      );
  },
});

export const { clearError } = teamsSlice.actions;

export default teamsSlice.reducer;
