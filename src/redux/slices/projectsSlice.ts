/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "../../api/projects";

interface ProjectsState {
  projects: any[];
  loading: boolean;
}

const initialState: ProjectsState = {
  projects: [],
  loading: false,
};

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (token: string) => {
    const projects = await getProjects(token);
    return projects;
  }
);

export const addProject = createAsyncThunk(
  "projects/addProject",
  async ({ data, token }: { data: any; token: string }) => {
    const project = await createProject(data, token);
    return project;
  }
);

export const editProject = createAsyncThunk(
  "projects/editProject",
  async ({ id, data, token }: { id: number; data: any; token: string }) => {
    const project = await updateProject(id, data, token);
    return project;
  }
);

export const removeProject = createAsyncThunk(
  "projects/removeProject",
  async ({ id, token }: { id: number; token: string }) => {
    await deleteProject(id, token);
    return id;
  }
);

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
      })
      .addCase(editProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) state.projects[index] = action.payload;
      })
      .addCase(removeProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter((p) => p.id !== action.payload);
      });
  },
});

export default projectsSlice.reducer;
