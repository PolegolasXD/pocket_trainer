import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import styles from './styles.module.css';
import iconMenuBar from '../../assets/icons/Menu.png';
import iconSizeBar from '../../assets/icons/iconSizeBar.png';
import iconCalendarioDiasDeTreino from '../../assets/icons/iconCalendarioDiasDeTreino.png';
import iconCalendarioTreinoDeHoje from '../../assets/icons/iconCalendarioTreinoDeHoje.png';
import iconFichaPessoal from '../../assets/icons/iconFichaPessoal.png';
import iconExecucao from '../../assets/icons/iconExecucao.png';
import iconClose from '../../assets/icons/iconClose.png';
import sizeBarStyles from './sizeBarStyles.module.css';
import './styles.module.css';

function Dias_de_treinoHTML() {
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

  const handleDateChange = (date) => {
    // Lógica para lidar com a seleção de datas no calendário
    console.log(date);
  };

  return (
    <div className={styles.container}>
      <div className={styles.menuOpenSizeBar} onClick={handleOpenSizeBar}>
        <img className={styles.iconMenuBar} src={iconMenuBar} alt="iconMenuBar" />
      </div>
      <div className={styles.descriptionContainer}>
        {/* <div className={styles.forceCenter}>
          <h1 className={styles.description} style={{ textAlign: 'center', marginTop: '50px' }}>
            Sejam Bem-vindos ao pocketTrainer, o site que chegou para auxiliar os esportistas nas execuções dos treinos,
            fazendo com que não sofram lesões.
          </h1>
        </div> */}
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.calendarContainer}>
          <Calendar
            onChange={handleDateChange}
            className={`${styles.customCalendar} custom-calendar`}
            dayClassName={(date) => {
              // Lógica para aplicar classes CSS aos dias do calendário
              // Por exemplo, para destacar o dia atual
              return date.toDateString() === new Date().toDateString() ? "today" : "";
            }}
          />
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
        <div className={sizeBarStyles.closeIconContainer} onClick={handleCloseSizeBar}>
          <img className={`${sizeBarStyles.iconClose}`} src={iconClose} alt="iconClose" />
        </div>
      </div>
    </div>
  );
}

export default Dias_de_treinoHTML;
