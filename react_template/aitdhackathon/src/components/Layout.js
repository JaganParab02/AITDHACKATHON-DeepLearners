import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const location = useLocation();
  const isRegistrationPage = location.pathname === '/';

  return (
    <div className="app-layout">
      {!isRegistrationPage && <Sidebar />}
      <main className={`main-content ${isRegistrationPage ? 'full-width' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout; 