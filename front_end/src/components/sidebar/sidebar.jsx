import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css';
import iconSizeBar from '../../assets/icons/iconSizeBar.png';
import iconCalendarioDiasDeTreino from '../../assets/icons/iconCalendarioDiasDeTreino.png';
import iconCalendarioTreinoDeHoje from '../../assets/icons/iconCalendarioTreinoDeHoje.png';
import iconFichaPessoal from '../../assets/icons/iconFichaPessoal.png';
import iconExecucao from '../../assets/icons/iconExecucao.png';
import iconDashboard from '../../assets/icons/iconDashboard.png';
import iconChat from '../../assets/icons/iconChat.png';
import iconClose from '../../assets/icons/iconClose.png';
import iconHistorico from '../../assets/icons/iconHistorico.png';


const Sidebar = ({ onClose }) => {
  const navigate = useNavigate();

  const handleRedirect = (route) => {
    navigate(route);
    if (onClose) onClose();
  };

  return (
    <div className={`${styles.sizeBar} ${styles.open}`}>
      <div className={styles.iconSizeBarContainer} onClick={() => handleRedirect('/home')}>
        <img className={`${styles.iconSizeBar} ${styles.largeIcon}`} src={iconSizeBar} alt="Início" />
      </div>
      <div className={styles.iconContainer} onClick={() => handleRedirect('/dias_de_treino')}>
        <img className={`${styles.icon} ${styles.goldIcon}`} src={iconCalendarioDiasDeTreino} alt="Dias de treino" />
        <span className={styles.itemDescriptionSizeBar}>Dias de treino</span>
      </div>
      <div className={styles.iconContainer} onClick={() => handleRedirect('/treino_de_hoje')}>
        <img className={`${styles.icon} ${styles.goldIcon}`} src={iconCalendarioTreinoDeHoje} alt="Treino de hoje" />
        <span className={styles.itemDescriptionSizeBar}>Treino de hoje</span>
      </div>
      <div className={styles.iconContainer} onClick={() => handleRedirect('/ficha_pessoal')}>
        <img className={`${styles.icon} ${styles.goldIcon}`} src={iconFichaPessoal} alt="Ficha pessoal" />
        <span className={styles.itemDescriptionSizeBar}>Ficha pessoal</span>
      </div>
      <div className={styles.iconContainer} onClick={() => handleRedirect('/execucao')}>
        <img className={`${styles.icon} ${styles.goldIcon}`} src={iconExecucao} alt="Execução" />
        <span className={styles.itemDescriptionSizeBar}>Execução</span>
      </div>
      <div className={styles.iconContainer} onClick={() => handleRedirect('/dashboard')}>
        <img className={`${styles.icon} ${styles.goldIcon}`} src={iconDashboard} alt="Dashboard" />
        <span className={styles.itemDescriptionSizeBar}>Dashboard</span>
      </div>
      <div className={styles.iconContainer} onClick={() => handleRedirect('/chat_bot')}>
        <img className={`${styles.icon} ${styles.goldIcon}`} src={iconChat} alt="Chat" />
        <span className={styles.itemDescriptionSizeBar}>Chat</span>
      </div>
      <div className={styles.iconContainer} onClick={() => handleRedirect('/historico')}>
        <img className={`${styles.icon} ${styles.goldIcon}`} src={iconHistorico} alt="Histórico" />
        <span className={styles.itemDescriptionSizeBar}>Histórico</span>
      </div>
      <div className={styles.iconContainer} onClick={() => handleRedirect('/registrar_treino')}>
        <img className={`${styles.icon} ${styles.goldIcon}`} src={iconExecucao} alt="Registrar Treino" />
        <span className={styles.itemDescriptionSizeBar}>Registrar Treino</span>
      </div>

      <div
        className={styles.closeIconContainer}
        onClick={() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }}
      >
        <img className={`${styles.iconClose}`} src={iconClose} alt="Sair" title="Sair" />
      </div>
    </div>
  );
};

export default Sidebar;
