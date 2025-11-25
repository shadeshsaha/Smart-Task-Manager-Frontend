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

export interface Team {
  id: number;
  name: string;
}

export interface Member {
  id: number;
  name: string;
  email?: string;
  role?: string;
}

interface TeamsState {
  teams: Team[];
  members: Record<number, Member[]>; // teamId => members[]
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
    return teams as Team[];
  }
);

export const addTeam = createAsyncThunk(
  "teams/addTeam",
  async ({ data, token }: { data: Partial<Team>; token: string }) => {
    const team = await createTeam(data, token);
    return team as Team;
  }
);

export const editTeam = createAsyncThunk(
  "teams/editTeam",
  async ({
    id,
    data,
    token,
  }: {
    id: number;
    data: Partial<Team>;
    token: string;
  }) => {
    const team = await updateTeam(id, data, token);
    return team as Team;
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
    return { teamId, members: members as Member[] };
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
    data: Partial<Member>;
    token: string;
  }) => {
    const member = await createMember(teamId, data, token);
    return { teamId, member: member as Member };
  }
);

export const editMember = createAsyncThunk(
  "teams/editMember",
  async ({
    id,
    data,
    token,
  }: {
    id: number;
    data: Partial<Member>;
    token: string;
  }) => {
    const member = await updateMember(id, data, token);
    return member as Member;
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

      // members loaded
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.members[action.payload.teamId] = action.payload.members;
      })

      // new member
      .addCase(addMember.fulfilled, (state, action) => {
        const { teamId, member } = action.payload;
        if (!state.members[teamId]) state.members[teamId] = []; // FIX
        state.members[teamId].push(member);
      })

      // remove member
      .addCase(removeMember.fulfilled, (state, action) => {
        const { id, teamId } = action.payload;
        if (!state.members[teamId]) return;
        state.members[teamId] = state.members[teamId].filter(
          (m) => m.id !== id
        );
      });
  },
});

export default teamsSlice.reducer;
