import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import iconMenuBar from '../../assets/icons/Menu.png';
import iconSizeBar from '../../assets/icons/iconSizeBar.png';
import iconChat from '../../assets/icons/iconChat.png';
import iconDashboard from '../../assets/icons/iconDashboard.png';
import iconCalendarioDiasDeTreino from '../../assets/icons/iconCalendarioDiasDeTreino.png';
import iconCalendarioTreinoDeHoje from '../../assets/icons/iconCalendarioTreinoDeHoje.png';
import iconFichaPessoal from '../../assets/icons/iconFichaPessoal.png';
import iconExecucao from '../../assets/icons/iconExecucao.png';
import iconClose from '../../assets/icons/iconClose.png';
import sizeBarStyles from './sizeBarStyles.module.css';
import gifBumbum from '../../assets/img/gifBumbum.gif';
import gifBiceps from '../../assets/img/gifBiceps.gif';
import gifCostas from '../../assets/img/gifCostas.gif';
import gifPeito from '../../assets/img/gifPeito.gif';

function HomeHTML() {
  const [isSizeBarOpen, setIsSizeBarOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpenSizeBar = () => {
    setIsSizeBarOpen(true);
  };

  const handleCloseSizeBar = () => {
    setIsSizeBarOpen(false);
  };

  const handleRedirect = (route) => {
    navigate(route);
  };

  return (
    <div className={styles.container}>
      <div className={styles.menuOpenSizeBar} onClick={handleOpenSizeBar}>
        <img className={styles.iconMenuBar} src={iconMenuBar} alt="iconMenuBar" />
      </div>
      <div className={styles.descriptionContainer}>
        {/* <div className={styles.forceCenter}>
        <h1 className={styles.description} style={{ textAlign: 'center', marginTop: '50px' }}>
          Sejam Bem-vindos ao pocketTrainer, o site que chegou para auxiliar os esportistas nas execuções dos treinos, fazendo com que não sofram lesões.
        </h1>
      </div> */}
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.itemContainer}>
          <h2 className={styles.executionName}>Treino de Perna</h2>
          <div className={`${styles.squareIcon} ${styles.whiteBackground}`}>
            <img className={`${styles.gifIcon} ${styles.enlargedGif}`} src={gifBumbum} alt="gifBumbum" />
          </div>
        </div>
        <div className={styles.itemContainer}>
          <h2 className={styles.executionName}>Treino de Bíceps</h2>
          <div className={`${styles.squareIcon} ${styles.whiteBackground}`}>
            <img className={`${styles.gifIcon} ${styles.enlargedGif}`} src={gifBiceps} alt="gifBiceps" />
          </div>
        </div>
        <div className={styles.itemContainer}>
          <h2 className={styles.executionName}>Treino de Costas</h2>
          <div className={`${styles.squareIcon} ${styles.whiteBackground}`}>
            <img className={`${styles.gifIcon} ${styles.enlargedGif}`} src={gifCostas} alt="gifCostas" />
          </div>
        </div>
        <div className={styles.itemContainer}>
          <h2 className={styles.executionName}>Treino de Peito</h2>
          <div className={`${styles.squareIcon} ${styles.whiteBackground}`}>
            <img className={`${styles.gifIcon} ${styles.enlargedGif}`} src={gifPeito} alt="gifPeito" />
          </div>
        </div>
      </div>
      <div className={`${sizeBarStyles.sizeBar} ${isSizeBarOpen ? sizeBarStyles.open : ''}`}>
        <div className={sizeBarStyles.iconSizeBarContainer} onClick={() => handleRedirect('/home')}>
          <img className={`${sizeBarStyles.iconSizeBar} ${sizeBarStyles.largeIcon}`} src={iconSizeBar} alt="iconSizeBar" />
        </div>
        <div className={sizeBarStyles.iconContainer} onClick={() => handleRedirect('/dias_de_treino')}>
          <img className={`${sizeBarStyles.icon} ${sizeBarStyles.goldIcon}`} src={iconCalendarioDiasDeTreino} alt="iconCalendarioDiasDeTreino" />
          <span className={sizeBarStyles.itemDescriptionSizeBar}>Dias de treino</span>
        </div>
        <div className={sizeBarStyles.iconContainer} onClick={() => handleRedirect('/treino_de_hoje')}>
          <img className={`${sizeBarStyles.icon} ${sizeBarStyles.goldIcon}`} src={iconCalendarioTreinoDeHoje} alt="iconCalendarioTreinoDeHoje" />
          <span className={sizeBarStyles.itemDescriptionSizeBar}>Treino de hoje</span>
        </div>
        <div className={sizeBarStyles.iconContainer} onClick={() => handleRedirect('/ficha_pessoal')}>
          <img className={`${sizeBarStyles.icon} ${sizeBarStyles.goldIcon}`} src={iconFichaPessoal} alt="iconFichaPessoal" />
          <span className={sizeBarStyles.itemDescriptionSizeBar}>Ficha pessoal</span>
        </div>
        <div className={sizeBarStyles.iconContainer} onClick={() => handleRedirect('/execucao')}>
          <img className={`${sizeBarStyles.icon} ${sizeBarStyles.goldIcon}`} src={iconExecucao} alt="iconExecucao" />
          <span className={sizeBarStyles.itemDescriptionSizeBar}>Execução</span>
        </div>
        <div className={sizeBarStyles.iconContainer} onClick={() => handleRedirect('/dashboard')}>
          <img className={`${sizeBarStyles.icon} ${sizeBarStyles.goldIcon}`} src={iconDashboard} alt="Dashboard" />
          <span className={sizeBarStyles.itemDescriptionSizeBar}>Dashboard</span>
        </div>

        <div className={sizeBarStyles.iconContainer} onClick={() => handleRedirect('/chat_bot')}>
          <img className={`${sizeBarStyles.icon} ${sizeBarStyles.goldIcon}`} src={iconChat} alt="Chat" />
          <span className={sizeBarStyles.itemDescriptionSizeBar}>Chat</span>
        </div>
        <div
          className={sizeBarStyles.closeIconContainer}
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
          }}
        >
          <img className={`${sizeBarStyles.iconClose}`} src={iconClose} alt="Sair" title="Sair" />
        </div>
      </div>
    </div>
  );
}

export default HomeHTML;
