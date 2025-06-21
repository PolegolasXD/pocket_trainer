import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';

const MapeamentoGruposMusculares = {
  // Peito
  'supino reto': 'Peito', 'supino inclinado': 'Peito', 'supino declinado': 'Peito', 'crucifixo': 'Peito',
  'flexão de braço': 'Peito', 'peck deck': 'Peito', 'voador': 'Peito',
  // Pernas
  'agachamento livre': 'Pernas', 'agachamento búlgaro': 'Pernas', 'leg press': 'Pernas', 'hack squat': 'Pernas',
  'afundo': 'Pernas', 'levantamento terra': 'Pernas', 'stiff': 'Pernas', 'cadeira extensora': 'Pernas',
  'mesa flexora': 'Pernas', 'panturrilha': 'Pernas',
  // Costas
  'remada curvada': 'Costas', 'puxada na frente': 'Costas', 'puxada frontal': 'Costas', 'remada cavalinho': 'Costas',
  'barra fixa': 'Costas', 'remada unilateral': 'Costas', 'serrote': 'Costas',
  // Braços
  'rosca direta': 'Braços', 'rosca scott': 'Braços', 'rosca martelo': 'Braços', 'tríceps testa': 'Braços',
  'tríceps pulley': 'Braços', 'mergulho no banco': 'Braços',
  // Ombros
  'desenvolvimento': 'Ombros', 'desenvolvimento militar': 'Ombros', 'elevação lateral': 'Ombros',
  'elevação frontal': 'Ombros', 'remada alta': 'Ombros',
  // Glúteos
  'elevação pélvica': 'Glúteos', 'abdutora': 'Glúteos', 'glúteos': 'Glúteos',
  // Abdômen
  'abdominal': 'Abdômen', 'abdominal supra': 'Abdômen', 'prancha': 'Abdômen'
};

const TreinoContext = createContext();

export const useTreinos = () => useContext(TreinoContext);

export const TreinoProvider = ({ children }) => {
  const [treinos, setTreinos] = useState([]);
  const [treinosPorData, setTreinosPorData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const processarTreinos = (treinosData) => {
    const treinosProcessados = treinosData.reduce((acc, treino) => {
      const dataTreino = new Date(treino.data).toDateString();
      const exercicioLower = treino.exercicio.toLowerCase().trim();
      const grupo = MapeamentoGruposMusculares[exercicioLower] || 'Outro';

      if (!acc[dataTreino]) {
        acc[dataTreino] = {
          grupos: new Set(),
          exercicios: [],
        };
      }
      acc[dataTreino].grupos.add(grupo);
      acc[dataTreino].exercicios.push(treino);
      return acc;
    }, {});

    Object.keys(treinosProcessados).forEach(key => {
      treinosProcessados[key].grupos = Array.from(treinosProcessados[key].grupos);
    });

    setTreinosPorData(treinosProcessados);
  };

  const buscarTreinos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token de autenticação não encontrado.');

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.get(`${apiUrl}/api/treinos`, config);

      setTreinos(res.data);
      processarTreinos(res.data);
    } catch (err) {
      console.error("Erro ao buscar treinos no contexto:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    treinos,
    treinosPorData,
    loading,
    error,
    buscarTreinos,
  };

  return (
    <TreinoContext.Provider value={value}>
      {children}
    </TreinoContext.Provider>
  );
}; 
