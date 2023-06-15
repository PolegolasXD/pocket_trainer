import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import iconCadastro from '../../assets/icons/IconesCadastro.png';
import iconUser from '../../assets/icons/IconesUsuario.png';

function LoginHTML() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = () => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const user = storedUsers.find((user) => user.email === email && user.password === password);

    if (user) {
      navigate('/home');
    } else {
      alert('Credenciais inválidas');
    }
  };

  
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
              <Link
                to="/login"
                className={`${styles.loginText} ${location.pathname === '/login' ? styles.activeLink : ''}`}
              >
                Login
              </Link>
              <div className={styles.spaceLink}></div>
              <Link
                to="/cadastro"
                className={`${styles.cadastrarText} ${location.pathname === '/cadastro' ? styles.activeLink : ''}`}
              >
                Cadastro
              </Link>
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
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
              <div className={styles.inputContainer}>
                <input
                  className={styles.input}
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>
            </div>
            <button className={styles.loginButton} onClick={handleLogin}>
              Logar
            </button>
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
