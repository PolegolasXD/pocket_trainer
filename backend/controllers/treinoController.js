const Treino = require('../models/treinoModel');
const dayjs = require('dayjs');

exports.createTreino = async (req, res) => {
  try {
    const { data, exercicio, repeticoes, carga, duracao_min } = req.body;
    const aluno_id = req.user.id;

    if (!data || !exercicio || !repeticoes || !carga) {
      return res.status(400).json({ error: 'Preencha os campos obrigatórios' });
    }

    const [novoTreino] = await Treino.createTreino({
      aluno_id,
      data,
      exercicio,
      repeticoes,
      carga,
      duracao_min
    });

    res.status(201).json(novoTreino);
  } catch (err) {
    console.error('Erro ao cadastrar treino:', err.message);
    res.status(500).json({ error: 'Erro ao cadastrar treino' });
  }
};

exports.getTreinosDoAluno = async (req, res) => {
  try {
    const aluno_id = req.user.id;
    const treinos = await Treino.getTreinosByAlunoId(aluno_id);
    res.json(treinos);
  } catch (err) {
    console.error('Erro ao buscar treinos:', err.message);
    res.status(500).json({ error: 'Erro ao buscar treinos' });
  }
};

exports.updateTreino = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const [updated] = await Treino.updateTreino(id, updates);

    if (!updated) {
      return res.status(404).json({ error: 'Treino não encontrado' });
    }

    res.json(updated);
  } catch (err) {
    console.error('Erro ao atualizar treino:', err.message);
    res.status(500).json({ error: 'Erro ao atualizar treino' });
  }
};

exports.deleteTreino = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Treino.deleteTreinoById(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Treino não encontrado' });
    }

    res.json({ message: 'Treino deletado com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar treino:', err.message);
    res.status(500).json({ error: 'Erro ao deletar treino' });
  }
};

exports.getUniqueExercises = async (_req, res) => {
  try {
    const exercicios = await Treino.getUniqueExercises();
    res.json(exercicios.map(e => e.exercicio));
  } catch (err) {
    console.error('Erro ao buscar exercícios únicos:', err.message);
    res.status(500).json({ error: 'Erro ao buscar exercícios' });
  }
};

exports.getTreinosByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;
    const treinos = await Treino.getTreinosByAlunoId(studentId);
    res.json(treinos);
  } catch (err) {
    console.error('Erro ao buscar treinos do aluno:', err.message);
    res.status(500).json({ error: 'Erro ao buscar treinos do aluno' });
  }
};

exports.createBulkTreinos = async (req, res) => {
  const { treinos, data } = req.body;
  const aluno_id = req.user.id;

  if (!treinos || !Array.isArray(treinos) || treinos.length === 0) {
    return res.status(400).json({ error: 'Formato de treinos inválido.' });
  }

  try {
    const treinosParaInserir = treinos.map(treino => {
      if (!treino.exercicio || !treino.repeticoes) {
        throw new Error('Cada treino deve ter exercício e repetições.');
      }
      return {
        aluno_id,
        data,
        exercicio: treino.exercicio,
        repeticoes: treino.repeticoes,
        carga: treino.peso || 0, // Mapeia 'peso' do plano para 'carga'
      };
    });

    const novosTreinos = await Treino.createTreinos(treinosParaInserir);
    res.status(201).json(novosTreinos);
  } catch (err) {
    console.error('Erro ao cadastrar treinos em massa:', err.message);
    res.status(500).json({ error: 'Erro interno ao cadastrar treinos.' });
  }
};
