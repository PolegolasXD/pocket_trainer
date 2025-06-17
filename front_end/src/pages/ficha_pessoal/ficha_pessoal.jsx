import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';
import iconUser from '../../assets/icons/IconesUsuario.png';
import Sidebar from '../../components/sidebar/sidebar';

function Ficha_pessoalHTML() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const { nome } = JSON.parse(storedUser);
      setUserName(nome);
    }
  }, []);

  return (
    <div className={styles.container}>
      <Sidebar />

      <div className={styles.descriptionContainer}>
        <div className={styles.userNameContainer}>
          <img className={styles.iconUser} src={iconUser} alt="iconUser" />
          <span className={styles.userName}>{userName}</span>
        </div>
      </div>

      <div className={styles.contentContainer}>
        {/* Conteúdo da página */}
      </div>
    </div>
  );
}

export default Ficha_pessoalHTML;
