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
        <div className={styles.squareIcon} onClick={handleOpenSizeBar}>
          <img className={styles.iconMenuBar} src={iconMenuBar} alt="iconMenuBar" />
        </div>
        <div className={styles.itemDescription}>Top Left</div>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.itemContainer}>
          <div className={styles.squareIcon}>
            <img className={styles.innerIcon} src={imgBumbum} alt="imgBumbum" />
          </div>
          <div className={styles.itemDescription}>Bumbum</div>
        </div>
        <div className={styles.itemContainer}>
          <div className={styles.squareIcon}>
            <img className={styles.innerIcon} src={imgBiceps} alt="imgBiceps" />
          </div>
          <div className={styles.itemDescription}>Bíceps</div>
        </div>
        <div className={styles.itemContainer}>
          <div className={styles.squareIcon}>
            <img className={styles.innerIcon} src={imgPerna} alt="imgPerna" />
          </div>
          <div className={styles.itemDescription}>Perna</div>
        </div>
        <div className={styles.itemContainer}>
          <div className={styles.squareIcon}>
            <img className={styles.innerIcon} src={imgPeito} alt="imgPeito" />
          </div>
          <div className={styles.itemDescription}>Peito</div>
        </div>
      </div>
      <div className={`${styles.sizeBar} ${isSizeBarOpen ? styles.open : ''}`}>
        <div className={styles.sizeBarContent}>
          <div className={styles.iconSizeBarContainer}>
            <img className={styles.iconSizeBar} src={iconSizeBar} alt="iconSizeBar" />
          </div>
          <div className={styles.menuItemsContainer}>
            <div className={styles.itemContainer}>
              <div className={styles.itemContent}>
                <img
                  className={styles.innerIcon}
                  src={iconCalendarioDiasDeTreino}
                  alt="iconCalendarioDiasDeTreino"
                />
                <div className={styles.itemDescriptionSizeBar}>Dias de treino</div>
              </div>
            </div>
            <div className={styles.itemContainer}>
              <div className={styles.itemContent}>
                <img
                  className={styles.innerIcon}
                  src={iconCalendarioTreinoDeHoje}
                  alt="iconCalendarioTreinoDeHoje"
                />
                <div className={styles.itemDescriptionSizeBar}>Treino de hoje</div>
              </div>
            </div>
            <div className={styles.itemContainer}>
              <div className={styles.itemContent}>
                <img className={styles.innerIcon} src={iconFichaPessoal} alt="iconFichaPessoal" />
                <div className={styles.itemDescriptionSizeBar}>Ficha pessoal</div>
              </div>
            </div>
            <div className={styles.itemContainer}>
              <div className={styles.itemContent}>
                <img className={styles.innerIcon} src={iconExecucao} alt="iconExecucao" />
                <div className={styles.itemDescriptionSizeBar}>Execução</div>
              </div>
            </div>
          </div>
          <div className={styles.closeIconContainer} onClick={handleCloseSizeBar}>
            <img className={styles.iconClose} src={iconClose} alt="iconClose" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeHTML;
