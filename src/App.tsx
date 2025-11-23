// import { Provider } from "react-redux";
// import {
//   Navigate,
//   Route,
//   BrowserRouter as Router,
//   Routes,
// } from "react-router-dom";
// import { store } from "./redux/store";

// import { Toaster } from "@/components/ui/toaster";
// import ProtectedRoute from "./components/auth/ProtectedRoute";
// import SidebarLayout from "./layouts/SidebarLayout";

// // Auth Pages
// import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
// import LoginPage from "./pages/auth/LoginPage";
// import OTPPage from "./pages/auth/OTPPage";
// import RegisterPage from "./pages/auth/RegisterPage";
// import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

// // Dashboard
// import DashboardPage from "./pages/dashboard/DashboardPage";

// // Projects
// import CreateProjectPage from "./pages/projects/CreateProjectPage";
// import EditProjectPage from "./pages/projects/EditProjectPage";
// import ProjectsPage from "./pages/projects/ProjectsPage";

// // Teams
// import CreateTeamPage from "./pages/teams/CreateTeamPage";
// import EditTeamPage from "./pages/teams/EditTeamPage";
// import TeamsPage from "./pages/teams/TeamsPage";

// // Members
// import CreateMemberPage from "./pages/members/CreateMemberPage";
// import EditMemberPage from "./pages/members/EditMemberPage";
// import MembersPage from "./pages/members/MembersPage";

// // Tasks
// import CreateTaskPage from "./pages/tasks/CreateTaskPage";
// import EditTaskPage from "./pages/tasks/EditTaskPage";
// import TasksPage from "./pages/tasks/TasksPage";

// // Reassign
// import ReassignTasksPage from "./pages/reassign/ReassignTasksPage";

// // Activity Logs
// import ActivityLogPage from "./pages/activity/ActivityLogPage";

// function App() {
//   return (
//     <Provider store={store}>
//       <Router>
//         <Toaster />

//         <Routes>
//           {/* -------------------- PUBLIC ROUTES -------------------- */}
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/register" element={<RegisterPage />} />
//           <Route path="/verify-otp" element={<OTPPage />} />
//           <Route path="/forgot-password" element={<ForgotPasswordPage />} />
//           <Route path="/reset-password" element={<ResetPasswordPage />} />

//           {/* -------------------- PROTECTED ROUTES -------------------- */}
//           <Route
//             path="/"
//             element={
//               <ProtectedRoute>
//                 <SidebarLayout />
//               </ProtectedRoute>
//             }
//           >
//             <Route index element={<DashboardPage />} />

//             {/* Projects */}
//             <Route path="projects" element={<ProjectsPage />} />
//             <Route path="projects/create" element={<CreateProjectPage />} />
//             <Route path="projects/edit/:id" element={<EditProjectPage />} />

//             {/* Teams */}
//             <Route path="teams" element={<TeamsPage />} />
//             <Route path="teams/create" element={<CreateTeamPage />} />
//             <Route path="teams/edit/:id" element={<EditTeamPage />} />

//             {/* Members */}
//             <Route path="members" element={<MembersPage />} />
//             <Route path="members/create" element={<CreateMemberPage />} />
//             <Route path="members/edit/:id" element={<EditMemberPage />} />

//             {/* Tasks */}
//             <Route path="tasks" element={<TasksPage />} />
//             <Route path="tasks/create" element={<CreateTaskPage />} />
//             <Route path="tasks/edit/:id" element={<EditTaskPage />} />

//             {/* Reassign */}
//             <Route path="reassign" element={<ReassignTasksPage />} />

//             {/* Activity Logs */}
//             <Route path="activity-logs" element={<ActivityLogPage />} />
//           </Route>

//           {/* Fallback */}
//           <Route path="*" element={<Navigate to="/" />} />
//         </Routes>
//       </Router>
//     </Provider>
//   );
// }

// export default App;

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Sidebar } from "./components/sidebar/Sidebar";
import ToastContainer from "./components/toast/ToastContainer";
import ActivityLog from "./pages/activity/ActivityLog";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import ProjectList from "./pages/projects/ProjectList";
import ReassignTasks from "./pages/reassign/ReassignTasks";
import TaskCreate from "./pages/tasks/CreateTask";
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <ProjectList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <TaskCreate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reassign"
              element={
                <ProtectedRoute>
                  <ReassignTasks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/activity"
              element={
                <ProtectedRoute>
                  <ActivityLog />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
      <ToastContainer />
    </Router>
  );
}
