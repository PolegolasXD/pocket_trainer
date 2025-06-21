import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../../context/ChatContext';
import styles from './Sidebar.module.css';
import iconSizeBar from '../../assets/icons/iconSizeBar.png';
import iconCalendarioDiasDeTreino from '../../assets/icons/iconCalendarioDiasDeTreino.png';
import iconCalendarioTreinoDeHoje from '../../assets/icons/iconCalendarioTreinoDeHoje.png';
import iconFichaPessoal from '../../assets/icons/iconFichaPessoal.png';
import iconExecucao from '../../assets/icons/iconExecucao.png';
import iconDashboard from '../../assets/icons/iconDashboard.png';
import iconChatBot from '../../assets/icons/iconChatBot.png';
import iconClose from '../../assets/icons/iconClose.png';
import iconHistorico from '../../assets/icons/iconHistorico.png';
import iconWorkOut from '../../assets/icons/iconRegisterWorkout.png';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { setSelectedConversation } = useChat();

  const handleRedirect = (route) => {
    if (route === '/chat') {
      setSelectedConversation(null);
    }
    navigate(route);
  };

  return (
    <div className={`${styles.sizeBar} ${isOpen ? styles.open : styles.closed}`}>
      <div className={styles.iconSizeBarContainer} onClick={() => handleRedirect('/home')}>
        <img className={`${styles.iconSizeBar} ${styles.largeIcon}`} src={iconSizeBar} alt="Home" />
      </div>
      <div className={styles.iconContainer} onClick={() => handleRedirect('/dias-de-treino')}>
        <img className={styles.icon} src={iconCalendarioDiasDeTreino} alt="Dias de Treino" />
        <span className={styles.itemDescriptionSizeBar}>Dias de Treino</span>
      </div>
      <div className={styles.iconContainer} onClick={() => handleRedirect('/treino-da-semana')}>
        <img className={styles.icon} src={iconCalendarioTreinoDeHoje} alt="Treino da Semana" />
        <span className={styles.itemDescriptionSizeBar}>Treino da Semana</span>
      </div>
      <div className={styles.iconContainer} onClick={() => handleRedirect('/ficha-pessoal')}>
        <img className={styles.icon} src={iconFichaPessoal} alt="Ficha Pessoal" />
        <span className={styles.itemDescriptionSizeBar}>Ficha Pessoal</span>
      </div>
      <div className={styles.iconContainer} onClick={() => handleRedirect('/execucao')}>
        <img className={styles.icon} src={iconExecucao} alt="Execução" />
        <span className={styles.itemDescriptionSizeBar}>Execução</span>
      </div>
      <div className={styles.iconContainer} onClick={() => handleRedirect('/dashboard')}>
        <img className={styles.icon} src={iconDashboard} alt="Painel" />
        <span className={styles.itemDescriptionSizeBar}>Painel</span>
      </div>
      <div className={styles.iconContainer} onClick={() => handleRedirect('/chat')}>
        <img className={styles.icon} src={iconChatBot} alt="Bater papo" />
        <span className={styles.itemDescriptionSizeBar}>Bater papo</span>
      </div>
      <div className={styles.iconContainer} onClick={() => handleRedirect('/historico')}>
        <img className={styles.icon} src={iconHistorico} alt="Histórico" />
        <span className={styles.itemDescriptionSizeBar}>Histórico</span>
      </div>
      <div className={styles.iconContainer} onClick={() => handleRedirect('/registrar_treino')}>
        <img className={styles.icon} src={iconWorkOut} alt="Registrar Treino" />
        <span className={styles.itemDescriptionSizeBar}>Registrar Treino</span>
      </div>

      <div className={styles.closeIconContainer} onClick={onClose}>
        <img className={`${styles.iconClose}`} src={iconClose} alt="Fechar" title="Fechar" />
      </div>
    </div>
  );
};

export default Sidebar;
