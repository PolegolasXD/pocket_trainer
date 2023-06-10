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

function Dias_de_treinoHTML() {
  const [isSizeBarOpen, setIsSizeBarOpen] = useState(false);

  const handleOpenSizeBar = () => {
    setIsSizeBarOpen(true);
  };

  const handleCloseSizeBar = () => {
    setIsSizeBarOpen(false);
  };

  const handleItemClick = () => {
    null;
  };

  return (
    <div className={styles.container}>
      <div className={styles.topLeftItem}>
        <div className={styles.squareIcon}>
          <img className={styles.innerIcon} src={iconUser} alt="iconUser" />
        </div>
        <div className={styles.itemDescription}>Top Left</div>
      </div>
      <div className={styles.topRightItem}>
        <div className={styles.squareIcon}>
          <img className={styles.innerIcon} src={iconUser} alt="iconUser" />
        </div>
        <div className={styles.itemDescription}>Top Right</div>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.itemContainer}>
          <div className={styles.squareIcon}>
            <img className={styles.innerIcon} src={iconUser} alt="iconUser" />
          </div>
          <div className={styles.itemDescription}>DiasDeTreino</div>
        </div>
        <div className={styles.itemContainer}>
          <div className={styles.squareIcon}>
            <img className={styles.innerIcon} src={iconUser} alt="iconUser" />
          </div>
          <div className={styles.itemDescription}>DiasDeTreino</div>
        </div>
        <div className={styles.itemContainer}>
          <div className={styles.squareIcon}>
            <img className={styles.innerIcon} src={iconUser} alt="iconUser" />
          </div>
          <div className={styles.itemDescription}>DiasDeTreino</div>
        </div>
        <div className={styles.itemContainer}>
          <div className={styles.squareIcon}>
            <img className={styles.innerIcon} src={iconUser} alt="iconUser" />
          </div>
          <div className={styles.itemDescription}>DiasDeTreino</div>
        </div>
      </div>
      <div className={styles.bottomLeftItem}>
        <div className={styles.squareIcon}>
          <img className={styles.innerIcon} src={iconUser} alt="iconUser" />
        </div>
        <div className={styles.itemDescription}>Bottom Left</div>
      </div>
      <div className={styles.bottomRightItem}>
        <div className={styles.squareIcon} onClick={handleOpenSizeBar}>
          <img className={styles.innerIcon} src={iconMenuBar} alt="iconMenuBar" />
        </div>
        <div className={styles.itemDescription}>Bottom Right</div>
      </div>
      <div className={`${styles.sizeBar} ${isSizeBarOpen ? styles.open : ''}`}>
        <div className={styles.sizeBarContent}>
          <div className={styles.iconSizeBarContainer}>
            <img className={styles.iconSizeBar} src={iconSizeBar} alt="iconSizeBar" />
          </div>
          <div className={styles.menuItemsContainer}>
            <div className={styles.itemContainer}>
              <div className={styles.itemContent}>
                <img className={styles.innerIcon} src={iconCalendarioDiasDeTreino} alt="iconCalendarioDiasDeTreino" />
                <div className={styles.itemDescriptionSizeBar}>Dias de treino</div>
              </div>
            </div>
            <div className={styles.itemContainer}>
              <div className={styles.itemContent}>
                <img className={styles.innerIcon} src={iconCalendarioTreinoDeHoje} alt="iconCalendarioTreinoDeHoje" />
                <div className={styles.itemDescriptionSizeBar}>Treino de hoje</div>
              </div>
            </div>
            <div className={styles.itemContainer}>
              <div className={styles.itemContent}>
                <img className={styles.innerIcon} src={iconFichaPessoal} alt="iconFichaPessoal" />
                <div className={styles.itemDescriptionSizeBar}>Ficha pessoal</div>
              </div>
            </div>
            <div className={styles.itemContainer }>
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

export default Dias_de_treinoHTML;
