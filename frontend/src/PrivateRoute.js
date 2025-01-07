import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useInactivityTimer from './useInactivityTimer'; // Import the hook

const PrivateRoute = ({ children }) => {
    useInactivityTimer(60000); // 1 minute timeout (60000 ms)

  // Check if the admin has a valid session token (e.g., stored in localStorage)
  const token = localStorage.getItem('admintoken');

  if (!token) {
    // If there's no token, redirect to login page
    return <Navigate to="/admin/login" replace />;
  }

  // If token exists, render the child components (protected route)
  return children ? children : <Outlet />;
};

export default PrivateRoute;
