/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createMember,
  createTeam,
  deleteMember,
  deleteTeam,
  getMembers,
  getTeams,
  updateMember,
  updateTeam,
} from "../../api/teams";

interface TeamsState {
  teams: any[];
  members: Record<number, any[]>; // key: teamId
  loading: boolean;
}

const initialState: TeamsState = {
  teams: [],
  members: {},
  loading: false,
};

export const fetchTeams = createAsyncThunk(
  "teams/fetchTeams",
  async (token: string) => {
    const teams = await getTeams(token);
    return teams;
  }
);

export const addTeam = createAsyncThunk(
  "teams/addTeam",
  async ({ data, token }: { data: any; token: string }) => {
    const team = await createTeam(data, token);
    return team;
  }
);

export const editTeam = createAsyncThunk(
  "teams/editTeam",
  async ({ id, data, token }: { id: number; data: any; token: string }) => {
    const team = await updateTeam(id, data, token);
    return team;
  }
);

export const removeTeam = createAsyncThunk(
  "teams/removeTeam",
  async ({ id, token }: { id: number; token: string }) => {
    await deleteTeam(id, token);
    return id;
  }
);

export const fetchMembers = createAsyncThunk(
  "teams/fetchMembers",
  async ({ teamId, token }: { teamId: number; token: string }) => {
    const members = await getMembers(teamId, token);
    return { teamId, members };
  }
);

export const addMember = createAsyncThunk(
  "teams/addMember",
  async ({
    teamId,
    data,
    token,
  }: {
    teamId: number;
    data: any;
    token: string;
  }) => {
    const member = await createMember(teamId, data, token);
    return { teamId, member };
  }
);

export const editMember = createAsyncThunk(
  "teams/editMember",
  async ({ id, data, token }: { id: number; data: any; token: string }) => {
    const member = await updateMember(id, data, token);
    return member;
  }
);

export const removeMember = createAsyncThunk(
  "teams/removeMember",
  async ({
    id,
    teamId,
    token,
  }: {
    id: number;
    teamId: number;
    token: string;
  }) => {
    await deleteMember(id, token);
    return { id, teamId };
  }
);

const teamsSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeams.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = action.payload;
      })
      .addCase(fetchTeams.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.members[action.payload.teamId] = action.payload.members;
      })
      .addCase(addMember.fulfilled, (state, action) => {
        state.members[action.payload.teamId].push(action.payload.member);
      })
      .addCase(removeMember.fulfilled, (state, action) => {
        state.members[action.payload.teamId] = state.members[
          action.payload.teamId
        ].filter((m) => m.id !== action.payload.id);
      });
  },
});

export default teamsSlice.reducer;
