

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import LoginPage from './pages/Auth/LoginPage';
import AdminLoginPage from './pages/Auth/AdminLoginPage';

// Student
import StudentLayout from './pages/Student/StudentLayout';
import StudentNotifications from './pages/Student/StudentNotifications';
import StudentProfile from './pages/Student/StudentProfile';
import StudentProjectRegistration from './pages/Student/StudentProjectRegistration';
import StudentProjectOverview from './pages/Student/StudentProjectOverview';
import StudentChangePassword from './pages/Student/StudentChangePassword';

// Professor
import ProfessorLayout from './pages/Professor/ProfessorLayout';
import ProfessorDashboard from './pages/Professor/ProfessorDashboard';
import ProfessorProfile from './pages/Professor/ProfessorProfile';
import ProfessorGroupsOverview from './pages/Professor/ProfessorGroupsOverview';
import ProfessorManageGroups from './pages/Professor/ProfessorManageGroups';
import ProfessorChangePassword from './pages/Professor/ProfessorChangePassword';
import ProfessorPublications from './pages/Professor/ProfessorPublications';

// Admin
import AdminLayout from './pages/Admin/AdminLayout';
import AdminSettingsHome from './pages/Admin/AdminSettingsHome';
import CreateSessionPage from './pages/Admin/CreateSessionPage';
import BtpConfigPage from './pages/Admin/BtpConfigPage';
import AdminAccountsPage from './pages/Admin/AdminAccountsPage';
import AdminUploadStudents from './pages/Admin/AdminUploadStudents';
import AdminUploadFaculty from './pages/Admin/AdminUploadFaculty';
import AdminManageAccounts from './pages/Admin/AdminManageAccounts';
import AdminNotifications from './pages/Admin/AdminNotifications';
import StudentGroupInvitations from './pages/Student/StudentGroupInvitations';
const PrivateRoute = ({ children, roles }) => {
  const { user } = useAuth();
  const path = window.location.pathname;

  if (!user) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  // Force change password for professors
  if (
    user.mustChangePassword &&
    user.role === 'professor' &&
    !path.startsWith('/professor/change-password')
  ) {
    return <Navigate to="/professor/change-password" replace />;
  }

  // Force change password for students
  if (
    user.mustChangePassword &&
    user.role === 'student' &&
    !path.startsWith('/student/change-password')
  ) {
    return <Navigate to="/student/change-password" replace />;
  }

  return children;
};

const AppRoutes = () => (
  <Routes>
    {/* Public logins */}
    <Route path="/login" element={<LoginPage />} />
    <Route path="/admin123" element={<AdminLoginPage />} />

    {/* Admin nested routes */}
    <Route
      path="/admin/*"
      element={
        <PrivateRoute roles={['admin']}>
          <AdminLayout />
        </PrivateRoute>
      }
    >
      <Route index element={<AdminAccountsPage />} />
      <Route path="notifications" element={<AdminNotifications />} />
      <Route path="accounts" element={<AdminAccountsPage />} />
      <Route path="accounts/upload-students" element={<AdminUploadStudents />} />
      <Route path="accounts/upload-faculty" element={<AdminUploadFaculty />} />
      <Route path="accounts/manage" element={<AdminManageAccounts />} />
      <Route path="settings" element={<AdminSettingsHome />} />
      <Route path="settings/create-session" element={<CreateSessionPage />} />
      <Route path="settings/btp-config" element={<BtpConfigPage />} />
    </Route>

    {/* Student nested routes */}
    <Route
      path="/student/*"
      element={
        <PrivateRoute roles={['student']}>
          <StudentLayout />
        </PrivateRoute>
      }
    >
      <Route index element={<StudentNotifications />} />
      <Route path="profile" element={<StudentProfile />} />
      <Route path="project/registration" element={<StudentProjectRegistration />} />
      <Route path="project/overview" element={<StudentProjectOverview />} />
      <Route path="change-password" element={<StudentChangePassword />} />
      <Route path="project/invitations" element={<StudentGroupInvitations />} />
    </Route>

    {/* Professor nested routes */}
    <Route
      path="/professor/*"
      element={
        <PrivateRoute roles={['professor']}>
          <ProfessorLayout />
        </PrivateRoute>
      }
    >
      <Route index element={<ProfessorDashboard />} />
      <Route path="profile" element={<ProfessorProfile />} />
      <Route path="publications" element={<ProfessorPublications />} />
      <Route path="project" element={<ProfessorGroupsOverview />} />
      <Route path="project/manage-groups" element={<ProfessorManageGroups />} />
      <Route path="change-password" element={<ProfessorChangePassword />} />
    </Route>

    {/* Fallback */}
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

const App = () => (
  <AuthProvider>
    <Router>
      <AppRoutes />
    </Router>
  </AuthProvider>
);

export default App;
