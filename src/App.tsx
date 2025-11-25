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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/ProtectedRoute";
import ActivityLogsPage from "./pages/activity/ActivityLog";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import Layout from "./pages/Layout";
import ProjectsPage from "./pages/projects/Projects";
import ReassignPage from "./pages/reassign/ReassignTasks";
import TasksPage from "./pages/tasks/Tasks";
import TeamsPage from "./pages/teams/TeamsPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* Project Management */}
          <Route path="projects" element={<ProjectsPage />} />

          {/* Task Management */}
          <Route path="tasks" element={<TasksPage />} />

          {/* Teams */}
          <Route path="teams" element={<TeamsPage />} />

          {/* Auto-Reassign System */}
          <Route path="reassign" element={<ReassignPage />} />

          {/* Activity Logs */}
          <Route path="activity" element={<ActivityLogsPage />} />
        </Route>
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;

/*
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/teams"
          element={
            <ProtectedRoute>
              <Layout>
                <TeamsPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Layout>
                <ProjectsPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Layout>
                <TasksPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reassign"
          element={
            <ProtectedRoute>
              <Layout>
                <ReassignPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/activity"
          element={
            <ProtectedRoute>
              <Layout>
                <ActivityLogsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};
*/
