import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

import iconCadastro from '../../assets/icons/IconesCadastro.png';
import iconUser from '../../assets/icons/IconesUsuario.png';

function LoginHTML() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/home');
      } else {
        alert(data.error || 'Credenciais inválidas');
      }
    } catch (err) {
      alert('Erro ao conectar com o servidor');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.centerModal}>
        {/* Lado esquerdo - Apresentação */}
        <section className={styles.leftSection}>
          <div className={styles.iconCadastroWrapper}>
            <p className={styles.iconCadastroTextTop}>
              Conheça o pocket Trainer, o seu treinador de bolso, auxiliando no seu treino.
            </p>
            <img src={iconCadastro} alt="Logo Pocket Trainer" className={styles.iconCadastro} />
            <p className={styles.iconCadastroTextBottom}>
              E melhorando exponencialmente a sua experiência com musculação.
            </p>
          </div>
        </section>

        {/* Linha divisória */}
        <div className={styles.line}></div>

        {/* Lado direito - Login */}
        <section className={styles.rightSection}>
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
            <img src={iconUser} alt="Usuário" className={styles.iconUser} />
          </div>

          <form className={styles.inputsContainer} onSubmit={handleLogin}>
            <div className={styles.inputContainer}>
              <input
                className={styles.input}
                type="email"
                placeholder="Email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputContainer}>
              <input
                className={styles.input}
                type="password"
                placeholder="Senha"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <button type="submit" className={styles.loginButton}>
                Logar
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default LoginHTML;
