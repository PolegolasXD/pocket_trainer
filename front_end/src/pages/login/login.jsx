import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';
import iconCadastro from '../../assets/icons/IconesCadastro.png';
import iconUser from '../../assets/icons/IconesUsuario.png';

function LoginHTML() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.centerModal}>
          <div className={styles.leftSection}>
            <div className={styles.iconCadastroWrapper}>
              <p className={styles.iconCadastroTextTop}>
                Conheça o pocket Trainer, o seu treinador de bolso, auxiliando no seu treino.
              </p>
              <img className={styles.iconCadastro} src={iconCadastro} alt="iconCadastro" />
              <p className={styles.iconCadastroTextBottom}>
                E melhorando exponencialmente a sua experiência com musculação.
              </p>
            </div>
          </div>
          <div className={styles.line}></div>
          <div className={styles.rightSection}>
            <div className={styles.topRightSection}>
              <button className={styles.loginText}>Login</button>
              <Link to="/cadastro" className={styles.cadastrarText}>Cadastro</Link>
            </div>
            <div className={styles.iconUserContainer}>
              <img className={styles.iconUser} src={iconUser} alt="iconUser" />
            </div>
            <div className={styles.inputsContainer}>
              <div className={styles.inputContainer}>
                <input className={styles.input} type="text" placeholder="Email" />
              </div>
              <div className={styles.inputContainer}>
                <input className={styles.input} type="password" placeholder="Senha" />
              </div>
            </div>
            <div className={styles.bottomRightSection}>
              <button className={styles.loginButton}>Logar</button>
            </div>
            <div className={styles.bottomLeftSection}>
              <div className={styles.esqueciSenhaContainer}>
                <button className={styles.esqueciSenhaText}>Esqueci minha senha</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginHTML;
