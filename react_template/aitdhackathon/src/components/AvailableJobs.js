import React from 'react';
import Sidebar from './Sidebar';
import './AvailableJobs.css';

const AvailableJobs = () => {
  return (
    <div className="available-jobs-container">
      <Sidebar />
      <div className="available-jobs-content">
        <h1>Available Jobs</h1>
        <div className="jobs-grid">
          <div className="no-jobs">No available jobs at the moment.</div>
        </div>
      </div>
    </div>
  );
};

export default AvailableJobs; 