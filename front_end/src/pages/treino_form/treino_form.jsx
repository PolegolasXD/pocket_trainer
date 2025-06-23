import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import Sidebar from "../../components/sidebar/sidebar";

const exerciciosPadrao = [
  'Supino Reto',
  'Agachamento Livre',
  'Remada Curvada',
  'Desenvolvimento',
  'Puxada Frente',
  'Rosca Direta',
  'Tríceps Testa',
  'Outro'
];
const repeticoesPadrao = [6, 8, 10, 12, 15];
const cargasPadrao = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

function TreinoForm() {
  const [data, setData] = useState(() => new Date().toISOString().slice(0, 10));
  const [exercicio, setExercicio] = useState('Supino Reto');
  const [outroExercicio, setOutroExercicio] = useState('');
  const [repeticoes, setRepeticoes] = useState(10);
  const [carga, setCarga] = useState(20);
  const [duracao_min, setDuracaoMin] = useState(0);
  const [observacoes, setObservacoes] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [exercicios, setExercicios] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setSucesso(false);
    const body = {
      data,
      exercicio: exercicio === 'Outro' ? outroExercicio : exercicio,
      repeticoes,
      carga,
      duracao_min,
      observacoes
    };
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/treinos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(body)
      });
      if (res.ok) setSucesso(true);
    } catch {
      setSucesso(false);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className={styles.treinoFormPage}>
      <Sidebar />
      <div className={styles.treinoFormContainer}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h2>Registrar Novo Treino</h2>
          <div className={styles.formGrid}>
            <label>
              Data:
              <input type="date" value={data} onChange={e => setData(e.target.value)} required />
            </label>
            <label>Exercício:
              <select value={exercicio} onChange={e => setExercicio(e.target.value)}>
                {exerciciosPadrao.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              {exercicio === 'Outro' && (
                <input type="text" placeholder="Digite o exercício" value={outroExercicio} onChange={e => setOutroExercicio(e.target.value)} required />
              )}
            </label>
            <label>Repetições:
              <select value={repeticoes} onChange={e => setRepeticoes(Number(e.target.value))}>
                {repeticoesPadrao.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </label>
            <label>Carga (kg):
              <select value={carga} onChange={e => setCarga(Number(e.target.value))}>
                {cargasPadrao.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </label>
            <label>Duração (min):
              <input type="number" value={duracao_min} onChange={e => setDuracaoMin(Number(e.target.value))} placeholder="minutos" />
            </label>
            <label>Observações:
              <textarea value={observacoes} onChange={e => setObservacoes(e.target.value)} placeholder="Opcional" />
            </label>
          </div>
          {sucesso && <p className={styles.sucesso}>Treino registrado com sucesso!</p>}
          <button type="submit" disabled={enviando}>{enviando ? 'Enviando...' : 'Registrar'}</button>
        </form>
      </div>
    </div>
  );
}

export default TreinoForm; 
