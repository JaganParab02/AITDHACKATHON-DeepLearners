import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import Sidebar from './Sidebar';
import './Dashboard.css';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Welcome to Your Dashboard</h1>
          
        </div>

        <div className="cards-container">
          {/* Applied Jobs Card */}
          <Link to="/applied-jobs" className="dashboard-card applied-jobs">
            <div className="card-content">
              <h2>Applied Jobs</h2>
              <p>View jobs you've applied for based on your preferences</p>
              <div className="card-stats">
                <span className="stat-number">12</span>
                <span className="stat-label">Active Applications</span>
              </div>
            </div>
          </Link>

          {/* Available Jobs Card */}
          <Link to="/available-jobs" className="dashboard-card available-jobs">
            <div className="card-content">
              <h2>Available Jobs</h2>
              <p>Discover jobs matching your skill set</p>
              <div className="card-stats">
                <span className="stat-number">24</span>
                <span className="stat-label">Matching Jobs</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 