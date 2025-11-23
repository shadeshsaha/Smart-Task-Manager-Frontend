/* eslint-disable @typescript-eslint/no-explicit-any */
import API from "../../api/axios";
import { AppDispatch } from "../../utils/hooks";
import { setProjects } from "./projectsSlice";

export const fetchProjects = () => async (dispatch: AppDispatch) => {
  const { data } = await API.get("/projects");
  dispatch(setProjects(data));
};

export const createProject = (payload: any) => async () => {
  await API.post("/projects", payload);
};

export const deleteProject = (id: number) => async () => {
  await API.delete(`/projects/${id}`);
};
