import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

// Protected Pages
import DashboardPage from './pages/dashboard/DashboardPage';
import FindMatchesPage from './pages/dashboard/FindMatchesPage';
import UserProfilePage from './pages/dashboard/UserProfilePage';
import MySkillsPage from './pages/dashboard/MySkillsPage';
import MyProfilePage from './pages/dashboard/MyProfilePage';
import SessionsPage from './pages/dashboard/SessionsPage';
import MessagesPage from './pages/dashboard/MessagesPage';
import SettingsPage from './pages/dashboard/SettingsPage';
import NotFoundPage from './pages/dashboard/NotFoundPage';

// Guards
import ProtectedRoute from './components/common/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';

// Route wrapper that redirects authenticated users away from Login/Register
const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner message="Checking session..." size="lg" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      {/* Public Pages Layout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          }
        />
      </Route>

      {/* Protected Dashboard Layout */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/matches" element={<FindMatchesPage />} />
        <Route path="/skills" element={<MySkillsPage />} />
        <Route path="/sessions" element={<SessionsPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/profile" element={<MyProfilePage />} />
        <Route path="/users/:id" element={<UserProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
