const Feedback = require('../models/feedbackModel');
const db = require('../db');

/**
 * Cria um feedback
 * (aluno_id vem do token JWT)
 */
exports.createFeedback = async (req, res) => {
  try {
    const { treino_id, texto_feedback, nota, carga, repeticoes, duracao } = req.body;
    const aluno_id = req.user.id;

    if (!treino_id || !texto_feedback) {
      return res.status(400).json({ error: 'treino_id e texto_feedback são obrigatórios' });
    }

    const [novoFeedback] = await Feedback.createFeedback({
      aluno_id,
      treino_id,
      resposta: texto_feedback,
      nota,
      carga,
      repeticoes,
      duracao
    });

    res.status(201).json(novoFeedback);
  } catch (err) {
    console.error('Erro ao criar feedback:', err.message);
    res.status(500).json({ error: 'Erro ao criar feedback' });
  }
};

/** Lista feedbacks do aluno autenticado */
exports.getFeedbacksDoAluno = async (req, res) => {
  try {
    const feedbacks = await Feedback.getFeedbacksByAlunoId(req.user.id);
    res.json(feedbacks);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar feedbacks do aluno' });
  }
};

/** Lista feedbacks de um treino específico */
exports.getFeedbacksDoTreino = async (req, res) => {
  try {
    const { treino_id } = req.params;
    const feedbacks = await Feedback.getFeedbacksByTreinoId(treino_id);
    res.json(feedbacks);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar feedbacks do treino' });
  }
};

/** Atualiza feedback */
exports.updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Feedback.updateFeedback(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Feedback não encontrado' });
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Erro ao atualizar feedback' });
  }
};

/** Deleta feedback */
exports.deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Feedback.deleteFeedback(id);
    if (!deleted) return res.status(404).json({ error: 'Feedback não encontrado' });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Erro ao deletar feedback' });
  }
};

exports.getTodosFeedbacks = async (_req, res) => {
  try {
    const feedbacks = await Feedback.getAllFeedbacks();
    res.json(feedbacks);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar feedbacks' });
  }
};

exports.getHistoricoDoAluno = async (req, res) => {
  const { aluno_id } = req.params;

  try {
    const historico = await Feedback.getFeedbacksByAlunoId(aluno_id);
    res.json(historico.filter(fb => fb.origem === 'ia'));
  } catch (error) {
    console.error("Erro ao buscar histórico:", error.message);
    res.status(500).json({ error: "Erro ao buscar histórico do aluno." });
  }
};

exports.getFeedbacksByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;
    const feedbacks = await Feedback.getFeedbacksByAlunoId(studentId);
    res.json(feedbacks);
  } catch (error) {
    console.error("Erro ao buscar feedbacks do aluno:", error.message);
    res.status(500).json({ error: "Erro ao buscar feedbacks do aluno." });
  }
};

