import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UserForm from './components/UserForm';
import AppliedJobs from './components/AppliedJobs';
import AvailableJobs from './components/AvailableJobs';
import EditProfile from './components/EditProfile';
import Layout from './components/Layout';
import { createClient } from '@supabase/supabase-js';
import './App.css';

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const App = () => {
  const isAuthenticated = () => {
    const user = localStorage.getItem('user');
    return user !== null && user !== undefined;
  };

  return (
    <Router>
      <Routes>
        {/* Public routes without Layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<UserForm supabase={supabase} />} />

        {/* Protected routes with Layout */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated() ? (
              <Layout>
                <Dashboard />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/applied-jobs"
          element={
            isAuthenticated() ? (
              <Layout>
                <AppliedJobs />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/available-jobs"
          element={
            isAuthenticated() ? (
              <Layout>
                <AvailableJobs />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/edit-profile"
          element={
            isAuthenticated() ? (
              <Layout>
                <EditProfile />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Default route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
