import React from 'react';
import styles from './styles.module.css';

function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.centerModal}>
        <div className={styles.leftSection}>
          <div className={styles.iconCadastroWrapper}>
            <p className={styles.iconCadastroTextTop}>
              Conheça o pocket Trainer, o seu treinador de bolso, auxiliando no seu treino.
            </p>
            <p className={styles.iconCadastroTextBottom}>
              E melhorando exponencialmente a sua experiência com musculação.
            </p>
          </div>
        </div>
        <div className={styles.line}></div>
        <div className={styles.rightSection}>
          <div className={styles.topRightSection}>
            <p className={styles.loginText}>Home</p>
          </div>
          <div className={styles.iconUserContainer}>
            <img className={styles.iconUser} src={iconUser} alt="iconUser" />
          </div>
          <div className={styles.inputsContainer}>
            <div className={styles.inputContainer}>
              <input
                className={styles.input}
                type="text"
                placeholder="Email"
                value=""
                onChange={() => {}}
              />
            </div>
            <div className={styles.inputContainer}>
              <input
                className={styles.input}
                type="password"
                placeholder="Senha"
                value=""
                onChange={() => {}}
              />
            </div>
          </div>
          <button className={styles.loginButton}>Home</button>
          <div className={styles.bottomLeftSection}>
            <div className={styles.esqueciSenhaContainer}>
              <button className={styles.esqueciSenhaText}>Home</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeHTML;
