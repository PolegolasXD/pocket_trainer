import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/sidebar/sidebar';
import styles from './styles.module.css';

import glutesWorkout from '../../assets/img/glutes_workout.gif';
import chestWorkout from '../../assets/img/chest_workout.gif';
import backWorkout from '../../assets/img/back_workout.gif';
import bicepsWorkout from '../../assets/img/biceps_workout.gif';

const exerciseGifs = {
  'agachamento livre': glutesWorkout,
  'desenvolvimento com halteres': chestWorkout,
  'puxada na frente': backWorkout,
  'rosca direta': bicepsWorkout,
  'supino reto': chestWorkout,
  'remada curvada': backWorkout,
};

const Execucao = () => {
  const [exercises, setExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get('http://localhost:5000/api/treinos/exercises', config);
        setExercises(res.data);
      } catch (error) {
        console.error('Erro ao buscar exercícios:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, []);

  const filteredExercises = exercises.filter(exercise =>
    exercise.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.contentContainer}>
        <h1>Biblioteca de Exercícios</h1>
        <input
          type="text"
          placeholder="Buscar exercício..."
          className={styles.searchInput}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className={styles.exerciseGrid}>
          {loading ? (
            <p>Carregando exercícios...</p>
          ) : filteredExercises.length > 0 ? (
            filteredExercises.map(exercise => (
              <div key={exercise} className={styles.exerciseCard}>
                <img
                  src={exerciseGifs[exercise.toLowerCase()] || bicepsWorkout}
                  alt={exercise}
                  className={styles.exerciseGif}
                />
                <h3>{exercise}</h3>
              </div>
            ))
          ) : (
            <p>Nenhum exercício encontrado.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Execucao;
