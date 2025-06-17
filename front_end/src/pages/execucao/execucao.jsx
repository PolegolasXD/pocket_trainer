import React from 'react';
import styles from './styles.module.css';
import Sidebar from '../../components/sidebar/sidebar';
import gifBumbum from '../../assets/img/gifBumbum.gif';
import gifBiceps from '../../assets/img/gifBiceps.gif';
import gifCostas from '../../assets/img/gifCostas.gif';
import gifPeito from '../../assets/img/gifPeito.gif';

function ExecucaoHTML() {
  return (
    <div className={styles.container}>
      <Sidebar />

      <div className={styles.descriptionContainer}>
        {/* Texto opcional para descrição aqui */}
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
    </div>
  );
}

export default ExecucaoHTML;
