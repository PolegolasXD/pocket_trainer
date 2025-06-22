import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import styles from './styles.module.css';
import axios from 'axios';
import { useTreinos } from '../../context/TreinoContext';

const dayTranslations = {
  monday: 'Segunda-feira',
  tuesday: 'Terça-feira',
  wednesday: 'Quarta-feira',
  thursday: 'Quinta-feira',
  friday: 'Sexta-feira',
  saturday: 'Sábado',
  sunday: 'Domingo',
};

const defaultExercises = [
  'Agachamento Livre', 'Agachamento Búlgaro', 'Afundo', 'Leg Press', 'Cadeira Extensora', 'Mesa Flexora',
  'Elevação Pélvica', 'Panturrilha Sentado', 'Panturrilha em Pé',
  'Supino Reto (Barra)', 'Supino Reto (Halteres)', 'Supino Inclinado (Barra)', 'Supino Inclinado (Halteres)',
  'Crucifixo', 'Flexão de Braço', 'Peck Deck (Voador)',
  'Puxada Frontal (Pulley)', 'Remada Curvada', 'Remada Cavalinho', 'Barra Fixa', 'Remada Unilateral (Serrote)',
  'Desenvolvimento Militar', 'Elevação Lateral', 'Elevação Frontal', 'Remada Alta',
  'Rosca Direta', 'Rosca Scott', 'Rosca Martelo',
  'Tríceps Pulley', 'Tríceps Testa', 'Mergulho no Banco',
  'Abdominal Supra', 'Prancha',
].sort();

const WeeklyWorkout = () => {
  const { selectedStudent } = useAdmin();
  const [weeklyWorkout, setWeeklyWorkout] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [exerciseName, setExerciseName] = useState('');
  const [series, setSeries] = useState('');
  const [reps, setReps] = useState('');
  const [peso, setPeso] = useState('');
  const [editingExercise, setEditingExercise] = useState(null);
  const [isRegistering, setIsRegistering] = useState(null);

  const { buscarTreinos } = useTreinos();

  const currentUser = JSON.parse(localStorage.getItem('usuario') || '{}');
  let targetId = null;

  if (currentUser.role === 'admin') {
    targetId = selectedStudent?.id;
  } else {
    // Garante que pegamos apenas o ID numérico do usuário logado.
    targetId = parseInt(currentUser.id, 10);
  }

  const fetchWorkout = async () => {
    if (!targetId) {
      if (currentUser.role === 'admin') {
        setLoading(false);
        setWeeklyWorkout({});
      }
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const url = `http://localhost:5000/api/treino-semanal/aluno/${targetId}`;

      const res = await axios.get(url, config);

      // Verifica se a resposta é válida
      if (res.data && Array.isArray(res.data)) {
        const formattedWorkout = res.data.reduce((acc, ex) => {
          const day = ex.dia_da_semana?.toLowerCase();
          if (day && !acc[day]) acc[day] = [];
          if (day) acc[day].push(ex);
          return acc;
        }, {});

        setWeeklyWorkout(formattedWorkout);
      } else {
        setWeeklyWorkout({});
      }
    } catch (error) {
      console.error('Erro ao buscar treino semanal:', error);
      setError('Erro ao carregar o treino semanal. Tente novamente.');
      setWeeklyWorkout({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkout();
  }, [targetId]);

  const openModal = (day) => {
    setSelectedDay(day);
    setEditingExercise(null);
    setExerciseName('');
    setSeries('');
    setReps('');
    setPeso('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingExercise(null);
    setExerciseName('');
    setSeries('');
    setReps('');
    setPeso('');
  };

  const handleEditClick = (exercise) => {
    if (!exercise) return;

    setEditingExercise(exercise);
    setExerciseName(exercise.exercicio || '');
    setSeries(exercise.series?.toString() || '');
    setReps(exercise.repeticoes?.toString() || '');
    setPeso(exercise.peso?.toString() || '');
  };

  const handleDelete = async (exerciseId) => {
    if (!exerciseId || !window.confirm('Tem certeza que deseja excluir este exercício?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/treino-semanal/${exerciseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchWorkout(); // Re-fetch to update UI
    } catch (error) {
      console.error('Erro ao excluir exercício:', error);
      alert('Falha ao excluir o exercício.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!exerciseName || !series || !reps || !selectedDay) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const payload = {
      aluno_id: targetId,
      dia_da_semana: selectedDay,
      exercicio: exerciseName,
      series: parseInt(series),
      repeticoes: parseInt(reps),
      peso: parseFloat(peso) || 0,
    };

    try {
      if (editingExercise) {
        await axios.put(`http://localhost:5000/api/treino-semanal/${editingExercise.id}`, payload, config);
      } else {
        await axios.post('http://localhost:5000/api/treino-semanal/', payload, config);
      }
      await fetchWorkout();
      closeModal();
    } catch (error) {
      console.error('Erro ao salvar exercício:', error);
      alert('Falha ao salvar o exercício.');
    }
  };

  const handleRegisterDay = async (day) => {
    if (!day || !weeklyWorkout[day]) {
      alert("Não há exercícios para registrar neste dia.");
      return;
    }

    const exercisesToRegister = weeklyWorkout[day];
    if (!exercisesToRegister || exercisesToRegister.length === 0) {
      alert("Não há exercícios para registrar neste dia.");
      return;
    }

    setIsRegistering(day);

    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      const body = { treinos: exercisesToRegister };
      await axios.post(`${apiUrl}/api/treinos/bulk`, body, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await buscarTreinos();
      alert('Treino do dia registrado com sucesso!');

    } catch (error) {
      console.error("Erro ao registrar treino do dia:", error);
      alert('Falha ao registrar o treino.');
    } finally {
      setIsRegistering(null);
    }
  };

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const exerciseOptions = [...defaultExercises];
  if (editingExercise && editingExercise.exercicio && !defaultExercises.includes(editingExercise.exercicio)) {
    exerciseOptions.push(editingExercise.exercicio);
    exerciseOptions.sort();
  }

  // Estados de loading e erro
  if (loading) {
    return (
      <div className={styles.container}>
        <h1>Carregando Treino...</h1>
        <div className={styles.infoText}>Aguarde enquanto carregamos seu treino semanal.</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h1>Erro ao Carregar Treino</h1>
        <div className={styles.infoText}>{error}</div>
        <button
          onClick={fetchWorkout}
          style={{
            background: '#f5c518',
            color: '#1e1e1e',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (currentUser.role === 'admin' && !selectedStudent) {
    return (
      <div className={styles.container}>
        <h1>Gerenciar Treino Semanal</h1>
        <p className={styles.infoText}>Por favor, selecione um aluno no painel de administrador para visualizar ou editar seu treino.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {currentUser.role === 'admin' && selectedStudent ? (
        <h1>Gerenciando Treino de: {selectedStudent.name}</h1>
      ) : (
        <h1>Seu Treino da Semana</h1>
      )}

      <div className={styles.grid}>
        {daysOfWeek.map(day => {
          const dayExercises = weeklyWorkout[day] || [];
          const hasExercises = dayExercises.length > 0;

          return (
            <div
              key={day}
              className={`${styles.dayColumn} ${currentUser.role === 'admin' ? styles.adminClickable : ''}`}
              onClick={() => currentUser.role === 'admin' && openModal(day)}
            >
              <h2>{dayTranslations[day]}</h2>
              <div className={styles.exerciseList}>
                {hasExercises ? (
                  dayExercises.map(ex => (
                    <div key={ex.id} className={styles.exerciseCard}>
                      <h3>{ex.exercicio || 'Exercício'}</h3>
                      <p>
                        {ex.series || 0} sets x {ex.repeticoes || 0} reps
                        {ex.peso && ex.peso > 0 ? ` @ ${ex.peso}kg` : ''}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className={styles.exerciseCard}>
                    <p className={styles.restDay}>Descanso</p>
                  </div>
                )}
              </div>
              {currentUser.role !== 'admin' && hasExercises && (
                <div className={styles.dayActions}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRegisterDay(day);
                    }}
                    className={styles.registerButton}
                    disabled={isRegistering === day}
                  >
                    {isRegistering === day ? 'Registrando...' : 'Registrar Treino de Hoje'}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isModalOpen && selectedDay && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeModal}>&times;</button>
            <h2>{editingExercise ? 'Editar Exercício' : `Adicionar Exercício - ${dayTranslations[selectedDay]}`}</h2>

            <form onSubmit={handleSubmit} className={styles.form}>
              <select
                value={exerciseName}
                onChange={e => setExerciseName(e.target.value)}
                required
              >
                <option value="" disabled>Selecione um exercício</option>
                {exerciseOptions.map(ex => (
                  <option key={ex} value={ex}>{ex}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Séries"
                value={series}
                onChange={e => setSeries(e.target.value)}
                required
                min="1"
              />
              <input
                type="number"
                placeholder="Repetições"
                value={reps}
                onChange={e => setReps(e.target.value)}
                required
                min="1"
              />
              <input
                type="number"
                placeholder="Peso (kg, opcional)"
                value={peso}
                onChange={e => setPeso(e.target.value)}
                min="0"
                step="0.5"
              />
              <div className={styles.formButtonContainer}>
                <button type="submit">
                  {editingExercise ? 'Atualizar' : 'Adicionar'}
                </button>
              </div>
            </form>

            <div className={styles.modalExerciseList}>
              <h3>Exercícios de {dayTranslations[selectedDay]}</h3>
              {weeklyWorkout[selectedDay] && weeklyWorkout[selectedDay].length > 0 ? (
                <ul>
                  {weeklyWorkout[selectedDay].map(ex => (
                    <li key={ex.id}>
                      <span>
                        {ex.exercicio || 'Exercício'} ({ex.series || 0}x{ex.repeticoes || 0}
                        {ex.peso && ex.peso > 0 ? ` @ ${ex.peso}kg` : ''})
                      </span>
                      <div>
                        <button
                          className={styles.editButton}
                          onClick={() => handleEditClick(ex)}
                        >
                          Editar
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDelete(ex.id)}
                        >
                          Excluir
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Nenhum exercício para este dia.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyWorkout; 
