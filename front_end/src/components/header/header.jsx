import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './header.module.css';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <h1 className={styles.logo}>Pocket Trainer</h1>
      </div>
      <div className={styles.userSection}>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Sair
        </button>
      </div>
    </header>
  );
};

export default Header; 
