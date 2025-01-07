import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Ensure styles are encapsulated
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Password visibility toggle
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate mobile and password
    if (!/^\d{10}$/.test(mobile)) {
      setError('Mobile number must be 10 digits.');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobileNumber: mobile,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Handle successful login
        setError('');
        // Save token in localStorage (or sessionStorage)
        localStorage.setItem('admintoken', data.token); // Save token
        localStorage.setItem('role', data.role); // Save role if needed
        navigate('/admin/dashboard'); // Navigate to dashboard
      } else {
        // Handle error response
        setError(data.message || 'Invalid mobile number or password.');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
      console.error(error);
    }
  };

  const handleMobileChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setMobile(value);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-container">
        <img src="/logo_2.jpg" alt="Logo" className="admin-logo" />
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <div className="admin-form-group">
            <label htmlFor="mobile">Mobile Number:</label>
            <input
              type="tel"
              id="mobile"
              value={mobile}
              onChange={handleMobileChange}
              placeholder="Enter your mobile number"
              maxLength="10"
              inputMode="numeric"
              required
            />
          </div>
          <div className="admin-form-group">
            <label htmlFor="password">Password:</label>
            <div className="admin-password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="admin-eye-button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          {error && <p className="admin-error">{error}</p>}
          <button type="submit" className="admin-login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
