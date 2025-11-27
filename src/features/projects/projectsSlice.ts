import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../api/axios";

interface Project {
  id: number;
  name: string;
  teamId: number;
  team?: { id: number; name: string };
  tasksCount?: number;
}

interface TeamOption {
  id: number;
  name: string;
}

interface ProjectsState {
  projects: Project[];
  teams: TeamOption[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  projects: [],
  teams: [],
  loading: false,
  error: null,
};

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async () => {
    const response = await axios.get("/projects");
    return response.data.projects as Project[];
  }
);

export const fetchTeamsForProjects = createAsyncThunk(
  "projects/fetchTeams",
  async () => {
    const response = await axios.get("/teams");
    return response.data.teams as TeamOption[];
  }
);

export const createProject = createAsyncThunk(
  "projects/createProject",
  async (projectData: { name: string; teamId: number }) => {
    const response = await axios.post("/projects", projectData);
    return response.data.project as Project;
  }
);

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
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
        state.error = action.error.message || "Failed to load projects";
      })
      .addCase(
        fetchTeamsForProjects.fulfilled,
        (state, action: PayloadAction<TeamOption[]>) => {
          state.teams = action.payload;
        }
      )
      .addCase(
        createProject.fulfilled,
        (state, action: PayloadAction<Project>) => {
          state.projects.push(action.payload);
        }
      );
  },
});

export const { clearError } = projectsSlice.actions;
export default projectsSlice.reducer;
