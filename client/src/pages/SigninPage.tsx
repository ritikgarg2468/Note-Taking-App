import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthLayout from './AuthLayout'; // <-- Make sure this import is present

const API_URL = `${process.env.REACT_APP_API_URL}/auth`;

const SigninPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');
    try {
      const { data } = await axios.post(`${API_URL}/generate-otp`, { email });
      // Check if the user exists before showing the OTP field
      if (data.isNewUser) {
        setError('No account found with this email. Please create one.');
        return;
      }
      setMessage(data.message);
      setShowOtpField(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      // The verify-otp endpoint handles sign-in for existing users
      const { data } = await axios.post(`${API_URL}/verify-otp`, { email, otp });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Sign in failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // This is the crucial fix: wrapping everything in AuthLayout
    <AuthLayout>
      <form className="auth-form" onSubmit={showOtpField ? handleSignin : handleGetOtp}>
        <h1>Sign in</h1>
        <p className="subtitle">Please login to continue to your account.</p>

        {error && <p style={{color: 'red', marginBottom: '1rem'}}>{error}</p>}
        {message && <p style={{color: 'green', marginBottom: '1rem'}}>{message}</p>}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input 
            id="email" 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            disabled={showOtpField} 
          />
        </div>

        {showOtpField && (
          <div className="form-group">
            <label htmlFor="otp">OTP</label>
            <input 
              id="otp" 
              type="text" 
              value={otp} 
              onChange={e => setOtp(e.target.value)} 
              required 
              placeholder="Enter 6-digit code"
            />
          </div>
        )}
        
        <button type="submit" className="auth-button" disabled={isLoading}>
          {isLoading ? 'Processing...' : (showOtpField ? 'Sign in' : 'Continue')}
        </button>
        
        <p className="auth-link">
          Need an account? <Link to="/signup">Create one</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SigninPage;