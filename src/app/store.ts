import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import projectsReducer from "../features/projects/projectsSlice";
import tasksReducer from "../features/tasks/tasksSlice";
import teamsReducer from "../features/teams/teamsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    teams: teamsReducer,
    projects: projectsReducer,
    tasks: tasksReducer,
    // Add other reducers later: teams, projects, tasks, reassign, activityLog
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
