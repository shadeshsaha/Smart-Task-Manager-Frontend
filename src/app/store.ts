import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import projectsReducer from "../features/projects/projectsSlice";
import reassignReducer from "../features/reassign/reassignSlice";
import tasksReducer from "../features/tasks/tasksSlice";
import teamsReducer from "../features/teams/teamsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    teams: teamsReducer,
    projects: projectsReducer,
    tasks: tasksReducer,
    reassign: reassignReducer,
    // Add other reducers later: teams, projects, tasks, reassign, activityLog
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
