import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./styles.module.css";
import iconCadastro from "../../assets/icons/IconesCadastro.png";
import iconUser from "../../assets/icons/IconesUsuario.png";

function CadastroHTML() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/users", {
        name,
        email,
        password,
        role: "aluno"
      });

      alert("Usuário cadastrado com sucesso");
      navigate("/login");
    } catch (err) {
      console.error("Erro ao cadastrar:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Erro ao cadastrar");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.centerModal}>
        <div className={styles.leftSection}>
          <div className={styles.iconCadastroWrapper}>
            <p className={styles.iconCadastroTextTop}>
              Conheça o pocket Trainer, o seu treinador de bolso, auxiliando no seu treino.
            </p>
            <img src={iconCadastro} alt="Logo Pocket Trainer" className={styles.iconCadastro} />
            <p className={styles.iconCadastroTextBottom}>
              E melhorando exponencialmente a sua experiência com musculação.
            </p>
          </div>
        </div>

        <div className={styles.line} />

        <div className={styles.rightSection}>
          <div className={styles.topRightSection}>
            <Link
              to="/login"
              className={`${styles.loginText} ${location.pathname === "/login" ? styles.activeLink : ""}`}
            >
              Login
            </Link>
            <div className={styles.spaceLink} />
            <Link
              to="/cadastro"
              className={`${styles.cadastrarText} ${location.pathname === "/cadastro" ? styles.activeLink : ""}`}
            >
              Cadastro
            </Link>
          </div>

          <div className={styles.iconUserContainer}>
            <img src={iconUser} alt="Ícone de usuário" className={styles.iconUser} />
          </div>

          <form className={styles.inputsContainer} onSubmit={handleSubmit}>
            <input
              className={styles.input}
              type="text"
              placeholder="Nome"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              className={styles.input}
              type="email"
              placeholder="Email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className={styles.input}
              type="password"
              placeholder="Senha"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className={styles.loginButton}>
              Cadastrar
            </button>
          </form>

          <div className={styles.bottomLeftSection}>
            <Link to="/login" className={styles.cadastrarText}>
              Já tem uma conta? Faça login!
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CadastroHTML;
