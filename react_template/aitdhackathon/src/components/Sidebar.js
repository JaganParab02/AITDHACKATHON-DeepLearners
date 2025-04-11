import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaBriefcase, FaSearch, FaCog, FaSignOutAlt, FaUserEdit } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Clear any stored user data or tokens
    localStorage.clear();
    // Redirect to the registration page
    navigate('/');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Menu</h2>
      </div>
      
      <div className="sidebar-menu">
        <Link 
          to="/dashboard" 
          className={location.pathname === '/dashboard' ? 'active' : ''}
        >
          <FaHome className="nav-icon" /> Dashboard
        </Link>
        
        <Link 
          to="/applied-jobs" 
          className={location.pathname === '/applied-jobs' ? 'active' : ''}
        >
          <FaBriefcase className="nav-icon" /> Applied Jobs
        </Link>
        
        <Link 
          to="/available-jobs" 
          className={location.pathname === '/available-jobs' ? 'active' : ''}
        >
          <FaSearch className="nav-icon" /> Available Jobs
        </Link>
        
        <Link 
          to="/edit-profile" 
          className={location.pathname === '/edit-profile' ? 'active' : ''}
        >
          <FaUserEdit className="nav-icon" /> Edit Profile
        </Link>
        
        <Link 
          to="/settings" 
          className={location.pathname === '/settings' ? 'active' : ''}
        >
          <FaCog className="nav-icon" /> Settings
        </Link>
      </div>
      
      <div className="sidebar-footer">
        <button onClick={handleSignOut} className="sign-out-btn">
          <FaSignOutAlt className="nav-icon" /> Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 