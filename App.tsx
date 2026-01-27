import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Layouts
import MobileLayout from './components/MobileLayout';
import AdminLayout from './components/admin/AdminLayout';

// Mobile Screens
import HomeScreen from './screens/HomeScreen';
import PetDetailScreen from './screens/PetDetailScreen';
import ApplicationStep1 from './screens/ApplicationStep1';
import ApplicationStep2 from './screens/ApplicationStep2';
import SuccessScreen from './screens/SuccessScreen';
import ChatListScreen from './screens/ChatListScreen';
import ChatDetailScreen from './screens/ChatDetailScreen';
import ProfileScreen from './screens/ProfileScreen';
import ApplicationHistoryScreen from './screens/ApplicationHistoryScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import LoginScreen from './screens/LoginScreen';

// Admin Screens
import DashboardScreen from './screens/admin/DashboardScreen';
import AdminLoginScreen from './screens/admin/AdminLoginScreen';
import UserListScreen from './screens/admin/UserListScreen';
import PetListScreen from './screens/admin/PetListScreen';
import PetEditScreen from './screens/admin/PetEditScreen';
import ApplicationListScreen from './screens/admin/ApplicationListScreen';

// Loading component
const LoadingScreen = () => (
  <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="size-16 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg animate-pulse">
        <span className="material-symbols-outlined text-[36px]">pets</span>
      </div>
      <p className="text-[#897561] dark:text-[#9e8c7a]">加载中...</p>
    </div>
  </div>
);

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route (redirect to home if already logged in)
const PublicRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Scroll to top on route change
const ScrollToTop = () => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
};

// Protected Route for Admin
const AdminRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

const AppRoutes: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <div className="font-display bg-background-light dark:bg-background-dark min-h-screen">
        <Routes>
          {/* Mobile Routes */}
          <Route element={<MobileLayout />}>
            {/* Public Route */}
            <Route path="/login" element={<PublicRoute><LoginScreen /></PublicRoute>} />

            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute><HomeScreen /></ProtectedRoute>} />
            <Route path="/pet/:id" element={<ProtectedRoute><PetDetailScreen /></ProtectedRoute>} />
            <Route path="/apply/step1" element={<ProtectedRoute><ApplicationStep1 /></ProtectedRoute>} />
            <Route path="/apply/step2" element={<ProtectedRoute><ApplicationStep2 /></ProtectedRoute>} />
            <Route path="/success" element={<ProtectedRoute><SuccessScreen /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><ChatListScreen /></ProtectedRoute>} />
            <Route path="/chat/:id" element={<ProtectedRoute><ChatDetailScreen /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
            <Route path="/profile/edit" element={<ProtectedRoute><EditProfileScreen /></ProtectedRoute>} />
            <Route path="/profile/applications" element={<ProtectedRoute><ApplicationHistoryScreen /></ProtectedRoute>} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginScreen />} />

          <Route path="/admin" element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardScreen />} />
            {/* Placeholder for other admin routes */}
            <Route path="users" element={<UserListScreen />} />
            <Route path="pets" element={<PetListScreen />} />
            <Route path="pets/new" element={<PetEditScreen />} />
            <Route path="pets/edit/:id" element={<PetEditScreen />} />
            <Route path="applications" element={<ApplicationListScreen />} />
          </Route>
        </Routes>
      </div>
    </>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  );
};

export default App;