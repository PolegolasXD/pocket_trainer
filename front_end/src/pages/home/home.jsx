import React from "react";
import { useNavigate } from 'react-router-dom';
import styles from "./styles.module.css";
import Sidebar from "../../components/sidebar/sidebar";

// Importing icons we'll use
import iconDashboard from '../../assets/icons/iconDashboard.png';
import iconChat from '../../assets/icons/iconChat.png';
import iconExecucao from '../../assets/icons/iconExecucao.png';
import iconFicha from '../../assets/icons/iconFichaPessoal.png';

function Home() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <header className={styles.header}>
          <h1>Welcome to Pocket Trainer!</h1>
          <p className={styles.subtitle}>
            Your journey to a healthier life and smarter training starts here.
            Track your progress, analyze your results, and reach your goals with the help of our AI.
          </p>
        </header>

        <main className={styles.quickAccessGrid}>
          <div className={styles.card} onClick={() => navigate('/registrar_treino')}>
            <img src={iconExecucao} alt="Register Workout" className={styles.cardIcon} />
            <h2>Register a Workout</h2>
            <p>Add the details of today's workout to keep your history updated.</p>
          </div>
          <div className={styles.card} onClick={() => navigate('/dashboard')}>
            <img src={iconDashboard} alt="My Dashboard" className={styles.cardIcon} />
            <h2>My Dashboard</h2>
            <p>View your performance indicators, progress charts, and insights.</p>
          </div>
          <div className={styles.card} onClick={() => navigate('/chat')}>
            <img src={iconChat} alt="Chat with AI" className={styles.cardIcon} />
            <h2>Chat with AI</h2>
            <p>Ask questions, get tips, and receive motivation from your virtual personal trainer.</p>
          </div>
          <div className={styles.card} onClick={() => navigate('/ficha-pessoal')}>
            <img src={iconFicha} alt="Personal Sheet" className={styles.cardIcon} />
            <h2>Personal Sheet</h2>
            <p>Keep your data, goals, and body measurements always up to date.</p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Home;
