import React, { useState } from 'react';
import styles from './styles.module.css';
import iconMenuBar from '../../assets/icons/Menu.png';
import imgBumbum from '../../assets/img/imgBumbum.png';
import imgBiceps from '../../assets/img/imgBiceps.png';
import imgPerna from '../../assets/img/imgPerna.png';
import imgPeito from '../../assets/img/imgPeito.png';
import iconSizeBar from '../../assets/icons/iconSizeBar.png';
import iconCalendarioDiasDeTreino from '../../assets/icons/iconCalendarioDiasDeTreino.png';
import iconCalendarioTreinoDeHoje from '../../assets/icons/iconCalendarioTreinoDeHoje.png';
import iconFichaPessoal from '../../assets/icons/iconFichaPessoal.png';
import iconExecucao from '../../assets/icons/iconExecucao.png';
import iconClose from '../../assets/icons/iconClose.png';
import sizeBarStyles from './sizeBarStyles.module.css';

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
      <div className={styles.topLeftItem}>
        <div className={styles.menuOpenSizeBar} onClick={handleOpenSizeBar}>
          <img className={styles.iconMenuBar} src={iconMenuBar} alt="iconMenuBar" />
        </div>
        <div className={styles.itemDescription}></div>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.itemContainer}>
          <div className={`${styles.squareIcon} ${styles.whiteBackground}`}>
            <img className={styles.innerIcon} src={imgBumbum} alt="imgBumbum" />
          </div>
          <div className={styles.itemDescription}>
            <img className={styles.itemImage} src={imgBumbum} alt="imgBumbum" />
            <span className={styles.itemText}>Bumbum</span>
          </div>
        </div>
        <div className={styles.itemContainer}>
          <div className={`${styles.squareIcon} ${styles.whiteBackground}`}>
            <img className={styles.innerIcon} src={imgBiceps} alt="imgBiceps" />
          </div>
          <div className={styles.itemDescription}>
            <img className={styles.itemImage} src={imgBiceps} alt="imgBiceps" />
            <span className={styles.itemText}>Bíceps</span>
          </div>
        </div>
        <div className={styles.itemContainer}>
          <div className={`${styles.squareIcon} ${styles.whiteBackground}`}>
            <img className={styles.innerIcon} src={imgPerna} alt="imgPerna" />
          </div>
          <div className={styles.itemDescription}>
            <img className={styles.itemImage} src={imgPerna} alt="imgPerna" />
            <span className={styles.itemText}>Perna</span>
          </div>
        </div>
        <div className={styles.itemContainer}>
          <div className={`${styles.squareIcon} ${styles.whiteBackground}`}>
            <img className={styles.innerIcon} src={imgPeito} alt="imgPeito" />
          </div>
          <div className={styles.itemDescription}>
            <img className={styles.itemImage} src={imgPeito} alt="imgPeito" />
            <span className={styles.itemText}>Peito</span>
          </div>
        </div>
      </div>
      <div className={`${sizeBarStyles.sizeBar} ${isSizeBarOpen ? sizeBarStyles.open : ''}`}>
        <div className={sizeBarStyles.iconSizeBarContainer}>
          <img className={`${sizeBarStyles.iconSizeBar} ${sizeBarStyles.largeIcon}`} src={iconSizeBar} alt="iconSizeBar" />
        </div>
        <div className={sizeBarStyles.iconContainer}>
          <img className={`${sizeBarStyles.icon} ${sizeBarStyles.goldIcon}`} src={iconCalendarioDiasDeTreino} alt="iconCalendarioDiasDeTreino" />
          <span className={sizeBarStyles.iconDescription}>Descrição ao lado do item</span>
        </div>
        <div className={sizeBarStyles.iconContainer}>
          <img className={`${sizeBarStyles.icon} ${sizeBarStyles.goldIcon}`} src={iconCalendarioTreinoDeHoje} alt="iconCalendarioTreinoDeHoje" />
          <span className={sizeBarStyles.iconDescription}>Descrição ao lado do item</span>
        </div>
        <div className={sizeBarStyles.iconContainer}>
          <img className={`${sizeBarStyles.icon} ${sizeBarStyles.goldIcon}`} src={iconFichaPessoal} alt="iconFichaPessoal" />
          <span className={sizeBarStyles.iconDescription}>Descrição ao lado do item</span>
        </div>
        <div className={sizeBarStyles.iconContainer}>
          <img className={`${sizeBarStyles.icon} ${sizeBarStyles.goldIcon}`} src={iconExecucao} alt="iconExecucao" />
          <span className={sizeBarStyles.iconDescription}>Descrição ao lado do item</span>
        </div>
        <div className={sizeBarStyles.closeIconContainer} onClick={handleCloseSizeBar}>
          <img className={`${sizeBarStyles.iconClose}`} src={iconClose} alt="iconClose" />
        </div>
      </div>
    </div>
  );
}

export default HomeHTML;
