import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthLayout from './AuthLayout';

const API_URL = 'http://localhost:5001/api/auth';

const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !dob || !email) { setError('All fields are required.'); return; }
    setIsLoading(true);
    setError('');
    setMessage('');
    try {
      const { data } = await axios.post(`${API_URL}/generate-otp`, { email });
      setMessage(data.message);
      setShowOtpField(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const payload = { email, otp, name, dob };
      const { data } = await axios.post(`${API_URL}/verify-otp`, payload);
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed.');
      setShowOtpField(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <form className="auth-form" onSubmit={showOtpField ? handleSignup : handleGetOtp}>
        <h1>Sign up</h1>
        <p className="subtitle">Sign up to enjoy the feature of HD</p>

        {error && <p style={{color: 'red'}}>{error}</p>}
        {message && <p style={{color: 'green'}}>{message}</p>}

        {!showOtpField && (
          <>
            <div className="form-group"><label htmlFor="name">Your Name</label><input id="name" type="text" value={name} onChange={e => setName(e.target.value)} required /></div>
            <div className="form-group"><label htmlFor="dob">Date of Birth</label><input id="dob" type="date" value={dob} onChange={e => setDob(e.target.value)} required /></div>
          </>
        )}

        <div className="form-group"><label htmlFor="email">Email</label><input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required disabled={showOtpField} /></div>

        {showOtpField && (<div className="form-group"><label htmlFor="otp">OTP</label><input id="otp" type="text" value={otp} onChange={e => setOtp(e.target.value)} required /></div>)}

        <button type="submit" className="auth-button" disabled={isLoading}>{isLoading ? 'Processing...' : (showOtpField ? 'Sign up' : 'Get OTP')}</button>
        <p className="auth-link">Already have an account?? <Link to="/">Sign in</Link></p>
      </form>
    </AuthLayout>
  );
};

export default SignupPage;