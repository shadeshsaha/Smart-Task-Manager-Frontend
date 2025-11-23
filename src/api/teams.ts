/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "./axios";

export const fetchTeams = () => api.get("/teams"); // expects members included
export const fetchTeam = (id: number) => api.get(`/teams/${id}`);
export const createTeam = (payload: any) => api.post("/teams", payload);
export const updateTeam = (id: number, payload: any) =>
  api.put(`/teams/${id}`, payload);
export const deleteTeam = (id: number) => api.delete(`/teams/${id}`);

export const addTeamMember = (teamId: number, payload: any) =>
  api.post(`/teams/${teamId}/members`, payload);
export const updateTeamMember = (
  teamId: number,
  memberId: number,
  payload: any
) => api.put(`/teams/${teamId}/members/${memberId}`, payload);
export const deleteTeamMember = (teamId: number, memberId: number) =>
  api.delete(`/teams/${teamId}/members/${memberId}`);
