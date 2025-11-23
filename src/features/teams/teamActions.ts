/* eslint-disable @typescript-eslint/no-explicit-any */
import API from "../../api/axios";
import { AppDispatch } from "../../utils/store";
import { setMembers, setTeams } from "./teamsSlice";

export const fetchTeams = () => async (dispatch: AppDispatch) => {
  const { data } = await API.get("/teams");
  dispatch(setTeams(data));
};

export const createTeam = (payload: any) => async () => {
  await API.post("/teams", payload);
};

export const updateTeam = (id: number, payload: any) => async () => {
  await API.put(`/teams/${id}`, payload);
};

export const deleteTeam = (id: number) => async () => {
  await API.delete(`/teams/${id}`);
};

export const fetchMembers =
  (teamId: number) => async (dispatch: AppDispatch) => {
    const { data } = await API.get(`/teams/${teamId}/members`);
    dispatch(setMembers(data));
  };

export const createMember = (teamId: number, payload: any) => async () => {
  await API.post(`/teams/${teamId}/members`, payload);
};

export const updateMember =
  (teamId: number, memberId: number, payload: any) => async () => {
    await API.put(`/teams/${teamId}/members/${memberId}`, payload);
  };

export const deleteMember = (teamId: number, memberId: number) => async () => {
  await API.delete(`/teams/${teamId}/members/${memberId}`);
};
