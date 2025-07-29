import React from 'react';
import './Auth.css';

const IMAGE_URL = 'https://plus.unsplash.com/premium_photo-1674115329436-5789e690dc32?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="auth-container">
      <div className="auth-form-section">
        {children}
      </div>
      <div 
        className="auth-image-section" 
        style={{ backgroundImage: `url(${IMAGE_URL})` }}
      />
    </div>
  );
};

export default AuthLayout;