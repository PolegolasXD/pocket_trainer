import React, { useState } from 'react';
import styles from './styles.module.css';
import iconMenuBar from '../../assets/icons/Menu.png';
import iconClose from '../../assets/icons/Menu.png'; // Substitua pelo ícone de fechar desejado
import iconSizeBar from '../../assets/icons/iconSizeBar.png';
import iconCalendarioDiasDeTreino from '../../assets/icons/iconCalendarioDiasDeTreino.png';
import iconCalendarioTreinoDeHoje from '../../assets/icons/iconCalendarioTreinoDeHoje.png';
import iconFichaPessoal from '../../assets/icons/iconFichaPessoal.png';
import iconExecucao from '../../assets/icons/iconExecucao.png';
import iconUser from '../../assets/icons/IconesUsuario.png';

function HomeHTML() {
  const [isSizeBarOpen, setIsSizeBarOpen] = useState(false);

  const handleOpenSizeBar = () => {
    setIsSizeBarOpen(true);
  };

  const handleCloseSizeBar = () => {
    setIsSizeBarOpen(false);
  };

  return (
    <div className={styles.container}>
      <img className={styles.iconMenuBar} src={iconMenuBar} alt="iconMenuBar" onClick={handleOpenSizeBar} />
      <div className={`${styles.sizeBar} ${isSizeBarOpen ? styles.open : ''}`}>
        <div className={styles.sizeBarContent}>
          <div className={styles.iconSizeBarContainer}>
            <img className={styles.iconSizeBar} src={iconSizeBar} alt="iconSizeBar" />
          </div>
          <div className={styles.itemContainer}>
            <div className={styles.squareIcon}>
              <img className={styles.innerIcon} src={iconCalendarioDiasDeTreino} alt="iconCalendarioDiasDeTreino" />
            </div>
            <div className={styles.itemDescription}>Dias de treino</div>
          </div>
          <div className={styles.itemContainer}>
            <div className={styles.squareIcon}>
              <img className={styles.innerIcon} src={iconCalendarioTreinoDeHoje} alt="iconCalendarioTreinoDeHoje" />
            </div>
            <div className={styles.itemDescription}>Treino de hoje</div>
          </div>
          <div className={styles.itemContainer}>
            <div className={styles.squareIcon}>
              <img className={styles.innerIcon} src={iconFichaPessoal} alt="iconFichaPessoal" />
            </div>
            <div className={styles.itemDescription}>Ficha pessoal</div>
          </div>
          <div className={styles.itemContainer}>
            <div className={styles.squareIcon}>
              <img className={styles.innerIcon} src={iconExecucao} alt="iconExecucao" />
            </div>
            <div className={styles.itemDescription}>Execução</div>
          </div>
          <div className={styles.closeIconContainer} onClick={handleCloseSizeBar}>
            <img className={styles.iconClose} src={iconClose} alt="iconClose" />
          </div>
        </div>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.itemContainer}>
          <div className={styles.squareIcon}>
            <img className={styles.innerIcon} src={iconUser} alt="iconUser" />
          </div>
          <div className={styles.itemDescription}>Icon1</div>
        </div>
        <div className={styles.itemContainer}>
          <div className={styles.squareIcon}>
            <img className={styles.innerIcon} src={iconUser} alt="iconUser" />
          </div>
          <div className={styles.itemDescription}>Icon2</div>
        </div>
        <div className={styles.itemContainer}>
          <div className={styles.squareIcon}>
            <img className={styles.innerIcon} src={iconUser} alt="iconUser" />
          </div>
          <div className={styles.itemDescription}>Icon3</div>
        </div>
        <div className={styles.itemContainer}>
          <div className={styles.squareIcon}>
            <img className={styles.innerIcon} src={iconUser} alt="iconUser" />
          </div>
          <div className={styles.itemDescription}>Icon4</div>
        </div>
      </div>
    </div>
  );
}

export default HomeHTML;
