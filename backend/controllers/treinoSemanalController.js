const TreinoSemanal = require('../models/treinoSemanalModel');

exports.getTreino = async (req, res) => {
  try {
    const alunoIdParam = parseInt(req.params.aluno_id, 10);
    const { id: userId, role } = req.user;

    if (role !== 'admin' && parseInt(userId, 10) !== alunoIdParam) {
      return res.status(403).json({ error: 'Acesso negado. Você só pode ver seu próprio treino.' });
    }

    const treinos = await TreinoSemanal.getTreinoByAlunoId(alunoIdParam);
    res.json(treinos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar treino semanal.' });
  }
};

exports.addExercicio = async (req, res) => {
  try {
    const { aluno_id, dia_da_semana, exercicio, series, repeticoes, peso } = req.body;

    if (req.user.role !== 'admin' && req.user.id !== aluno_id) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    const novoExercicio = await TreinoSemanal.addExercicio({ aluno_id, dia_da_semana, exercicio, series, repeticoes, peso });
    res.status(201).json(novoExercicio);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao adicionar exercício.' });
  }
};

exports.updateExercicio = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const exercicio = await TreinoSemanal.getExercicioById(id);
    if (!exercicio) {
      return res.status(404).json({ error: 'Exercício não encontrado.' });
    }

    if (req.user.role !== 'admin' && req.user.id !== exercicio.aluno_id) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    const exercicioAtualizado = await TreinoSemanal.updateExercicio(id, updates);
    res.json(exercicioAtualizado);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar exercício.' });
  }
};

exports.deleteExercicio = async (req, res) => {
  try {
    const { id } = req.params;

    const exercicio = await TreinoSemanal.getExercicioById(id);
    if (!exercicio) {
      return res.status(404).json({ error: 'Exercício não encontrado.' });
    }

    if (req.user.role !== 'admin' && req.user.id !== exercicio.aluno_id) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    await TreinoSemanal.deleteExercicio(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar exercício.' });
  }
}; 
