/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const getTeams = async (token: string) => {
  const res = await axios.get(`${API_URL}/teams`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.teams;
};

export const createTeam = async (data: any, token: string) => {
  const res = await axios.post(`${API_URL}/teams`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.team;
};

export const updateTeam = async (id: number, data: any, token: string) => {
  const res = await axios.put(`${API_URL}/teams/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.team;
};

export const deleteTeam = async (id: number, token: string) => {
  const res = await axios.delete(`${API_URL}/teams/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getMembers = async (teamId: number, token: string) => {
  const res = await axios.get(`${API_URL}/teams/${teamId}/members`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.members;
};

export const createMember = async (
  teamId: number,
  data: any,
  token: string
) => {
  const res = await axios.post(`${API_URL}/teams/${teamId}/members`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.member;
};

export const updateMember = async (id: number, data: any, token: string) => {
  const res = await axios.put(`${API_URL}/members/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.member;
};

export const deleteMember = async (id: number, token: string) => {
  const res = await axios.delete(`${API_URL}/members/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
