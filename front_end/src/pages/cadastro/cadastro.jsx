import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import iconCadastro from '../../assets/icons/IconesCadastro.png';
import iconUser from '../../assets/icons/IconesUsuario.png';

function CadastroHTML() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleNomeChange = (event) => {
    setNome(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleCadastro = () => {
    const storedUsers = localStorage.getItem('users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    const userExists = users.some((user) => user.email === email);
    if (userExists) {
      alert('E-mail já cadastrado');
      return;
    }

    const newUser = { nome, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    alert('Usuário cadastrado com sucesso');
    navigate('/login');
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
                  placeholder="Nome"
                  value={nome}
                  onChange={handleNomeChange}
                />
              </div>
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
            <button className={styles.loginButton} onClick={handleCadastro}>
              Cadastrar
            </button>
            <div className={styles.bottomLeftSection}>
              <div className={styles.cadastrarContainer}>
                <Link to="/login" className={styles.cadastrarText}>
                  Já tem uma conta? Faça login!
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CadastroHTML;
