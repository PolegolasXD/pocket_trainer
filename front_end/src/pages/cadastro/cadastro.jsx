import React, { useState } from 'react';
import styles from './styles.module.css';
import iconCadastro from '../../assets/icons/IconesCadastro.png';
import iconUser from '../../assets/icons/IconesUsuario.png';

function CadastroHTML() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleCadastro = () => {
    // Aqui você pode fazer alguma lógica de validação ou enviar os dados para um servidor
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Confirm Password:', confirmPassword);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.centerModal}>
          <div className={styles.leftSection}>
            <div className={styles.iconCadastroWrapper}>
              <p className={styles.iconCadastroTextTop}>Conheça o pocket Trainer, o seu treinador de bolso, auxiliando no seu treino.</p>
              <img className={styles.iconCadastro} src={iconCadastro} alt="iconCadastro" />
              <p className={styles.iconCadastroTextBottom}>e melhorando exponencialmente a sua experiencia com musculação.</p>
            </div>
          </div>

          <div className={styles.line}></div>

          <div className={styles.rightSection}>
            <div className={styles.topRightSection}>
              <button className={styles.loginText}>Login</button>
              <button className={styles.cadastroText}>Cadastro</button>
            </div>

            <div className={styles.iconUserContainer}>
              <img className={styles.iconUser} src={iconUser} alt="iconUser" />
            </div>

            <div className={styles.inputsContainer}>
              <div className={styles.inputContainer}>
                <input className={styles.input} type="text" placeholder="Email" value={email} onChange={handleEmailChange} />
              </div>

              <div className={styles.inputContainer}>
                <input className={styles.input} type="password" placeholder="Senha" value={password} onChange={handlePasswordChange} />
              </div>

              <div className={styles.inputContainer}>
                <input className={styles.input} type="password" placeholder="Confirme a senha" value={confirmPassword} onChange={handleConfirmPasswordChange} />
              </div>
            </div>

            <button className={styles.cadastrarButton} onClick={handleCadastro}>Cadastrar</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CadastroHTML;
