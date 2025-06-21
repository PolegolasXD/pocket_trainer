import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../sidebar/sidebar';
import Header from '../header/header';
import styles from './Layout.module.css';

const Layout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={styles.appContainer}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header onMenuClick={toggleSidebar} sidebarOpen={isSidebarOpen} />
      <main className={`${styles.mainContent} ${isSidebarOpen ? '' : styles.sidebarClosed}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout; 
