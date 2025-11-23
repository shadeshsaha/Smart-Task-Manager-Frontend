/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";

interface TeamState {
  teams: any[];
  members: any[];
}

const initialState: TeamState = {
  teams: [],
  members: [],
};

const teamsSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {
    setTeams: (state, action) => {
      state.teams = action.payload;
    },
    setMembers: (state, action) => {
      state.members = action.payload;
    },
  },
});

export const { setTeams, setMembers } = teamsSlice.actions;
export default teamsSlice.reducer;
