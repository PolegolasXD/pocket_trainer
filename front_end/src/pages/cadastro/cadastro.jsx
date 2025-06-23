import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./styles.module.css";
import iconCadastro from "../../assets/icons/IconesCadastro.png";
import iconUser from "../../assets/icons/IconesUsuario.png";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Usuário cadastrado com sucesso!");
        navigate("/login");
      } else {
        alert(data.error || "Falha ao cadastrar.");
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.centerModal}>
        <section className={styles.leftSection}>
          <div className={styles.iconCadastroWrapper}>
            <p className={styles.iconCadastroTextTop}>
              Conheça o Pocket Trainer, seu coach de bolso, te auxiliando no seu treino.
            </p>
            <img src={iconCadastro} alt="Pocket Trainer Logo" className={styles.iconCadastro} />
            <p className={styles.iconCadastroTextBottom}>
              E melhorando exponencialmente sua experiência com o treino de musculação.
            </p>
          </div>
        </section>

        <div className={styles.line} />

        <section className={styles.rightSection}>
          <div className={styles.topRightSection}>
            <Link
              to="/login"
              className={`${styles.loginText} ${location.pathname === "/login" ? styles.activeLink : ""}`}
            >
              Entrar
            </Link>
            <div className={styles.spaceLink} />
            <Link
              to="/cadastro"
              className={`${styles.cadastrarText} ${location.pathname === "/cadastro" ? styles.activeLink : ""}`}
            >
              Cadastrar
            </Link>
          </div>

          <div className={styles.iconUserContainer}>
            <img src={iconUser} alt="Usuário" className={styles.iconUser} />
          </div>

          <form className={styles.inputsContainer} onSubmit={handleSignUp}>
            <div className={styles.inputContainer}>
              <input
                className={styles.input}
                type="text"
                placeholder="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className={styles.inputContainer}>
              <input
                className={styles.input}
                type="email"
                placeholder="Email"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className={styles.inputContainer}>
              <input
                className={styles.input}
                type="password"
                placeholder="Confirmar Senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
              <button type="submit" className={styles.loginButton}>
                Cadastrar
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default SignUp;
