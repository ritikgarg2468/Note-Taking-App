import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SigninPage from './pages/SigninPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';

const isAuthenticated = (): boolean => !!localStorage.getItem('userInfo');

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
};

const PublicRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  return isAuthenticated() ? <Navigate to="/dashboard" replace /> : children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><SigninPage /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <div className="container">
              <DashboardPage />
            </div>
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;