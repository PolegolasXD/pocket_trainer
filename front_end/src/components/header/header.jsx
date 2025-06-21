import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './header.module.css';
import menuIcon from '../../assets/icons/Menu.png';

const Header = ({ onMenuClick, sidebarOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  return (
    <header className={`${styles.header} ${!sidebarOpen ? styles.sidebarClosed : ''}`}>
      <button onClick={onMenuClick} className={styles.menuButton}>
        <img src={menuIcon} alt="Menu" className={styles.menuIcon} />
      </button>
      <div className={styles.headerRight}>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Sair
        </button>
      </div>
    </header>
  );
};

export default Header; 
