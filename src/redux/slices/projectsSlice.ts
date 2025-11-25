/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "../../api/projects";

interface ProjectsState {
  projects: Project[];
  loading: boolean;
  error?: string | null;
}

const initialState: ProjectsState = {
  projects: [],
  loading: false,
  error: null,
};

export interface Project {
  //   id: string;
  id: number;
  name: string;
  budget?: number;
}

// GET /projects
export const fetchProjects = createAsyncThunk<Project[], string>(
  "projects/fetchProjects",
  async (token: string) => {
    const projects = await getProjects(token);
    return projects as Project[];
  }
);

// POST /projects
export const addProject = createAsyncThunk<
  Project,
  { data: any; token: string }
>("projects/addProject", async ({ data, token }) => {
  const project = await createProject(data, token);
  return project as Project;
});

// PUT /projects/:id
export const editProject = createAsyncThunk<
  Project,
  { id: number; data: any; token: string }
>("projects/editProject", async ({ id, data, token }) => {
  const project = await updateProject(id, data, token);
  return project as Project;
});

// DELETE /projects/:id
export const removeProject = createAsyncThunk<
  number,
  { id: number; token: string }
>("projects/removeProject", async ({ id, token }) => {
  await deleteProject(id, token);
  return id;
});

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ---- FETCH ----
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProjects.fulfilled,
        (state, action: PayloadAction<Project[]>) => {
          state.loading = false;
          state.projects = action.payload;
        }
      )
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to load projects";
      })
      // ---- ADD ----
      .addCase(
        addProject.fulfilled,
        (state, action: PayloadAction<Project>) => {
          state.projects.push(action.payload);
        }
      )
      // ---- EDIT ----
      .addCase(
        editProject.fulfilled,
        (state, action: PayloadAction<Project>) => {
          const index = state.projects.findIndex(
            (p) => p.id === action.payload.id
          );
          if (index !== -1) {
            state.projects[index] = action.payload;
          }
        }
      )
      // ---- DELETE ----
      .addCase(
        removeProject.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.projects = state.projects.filter(
            (p) => p.id !== action.payload
          );
        }
      );
  },
});

export default projectsSlice.reducer;
