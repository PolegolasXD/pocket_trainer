import React, { useState } from 'react';
import styles from './styles.module.css';
import iconMenuBar from '../../assets/icons/Menu.png';
import iconClose from '../../assets/icons/Menu.png';
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
      {!isSizeBarOpen && (
        <div className={styles.menuIconsContainer}>
          <div className={`${styles.menuIcon} ${styles.openIcon}`} onClick={handleOpenSizeBar}>
            <img className={styles.iconMenuBar} src={iconMenuBar} alt="iconMenuBar" />
          </div>
        </div>
      )}
      {isSizeBarOpen && (
        <div className={styles.sizeBar}>
          <div className={styles.closeIconContainer} onClick={handleCloseSizeBar}>
            <img className={styles.iconClose} src={iconClose} alt="iconClose" />
          </div>
          {/* Conteúdo da size bar */}
        </div>
      )}
      <div className={styles.contentContainer}>
        <div className={`${styles.itemContainer} ${styles.column}`}>
          <div className={styles.squareIcon}>
            <img className={styles.innerIcon} src={iconUser} alt="iconUser" />
          </div>
          <p className={styles.itemDescription}>Icon1</p>
        </div>
        <div className={`${styles.itemContainer} ${styles.column}`}>
          <div className={styles.squareIcon}>
            <img className={styles.innerIcon} src={iconUser} alt="iconUser" />
          </div>
          <p className={styles.itemDescription}>Icon2</p>
        </div>
        <div className={`${styles.itemContainer} ${styles.column}`}>
          <div className={styles.squareIcon}>
            <img className={styles.innerIcon} src={iconUser} alt="iconUser" />
          </div>
          <p className={styles.itemDescription}>Icon3</p>
        </div>
        <div className={`${styles.itemContainer} ${styles.column}`}>
          <div className={styles.squareIcon}>
            <img className={styles.innerIcon} src={iconUser} alt="iconUser" />
          </div>
          <p className={styles.itemDescription}>Icon4</p>
        </div>
      </div>
    </div>
  );
}

export default HomeHTML;
