import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate(); // Hook to navigate programmatically

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('admintoken'); // Retrieve the token from localStorage (if stored)

      if (!token) {
        console.error('No token found in localStorage');
        return;
      }

      // Call the logout API to invalidate the session
      const response = await fetch('http://localhost:5000/admin/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }), // Pass the token to the backend
      });

      const data = await response.json();

      if (data.success) {
        // Clear the token from localStorage
        localStorage.removeItem('admintoken');
        navigate('/admin/login'); // Redirect to login page after successful logout
      } else {
        console.error('Logout failed:', data.message);
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="admin-sidebar">
      <div className="admin-logo-container">
        <img src="/logo.png" alt="Logo" className="admin-logo" />
      </div>
      <nav className="sidebar-nav">
      <ul>
          <li><Link to="/admin/">Dashboard</Link></li>
          <li><Link to="/admin/products">Products</Link></li>
          <li><Link to="/admin/add-product">Add Product</Link></li>
          <li><Link to="/admin/orders">Orders</Link></li>
        </ul>
      </nav>
      <div className="admin-logout-container">
        <button onClick={handleLogout} className="admin-logout-button">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
