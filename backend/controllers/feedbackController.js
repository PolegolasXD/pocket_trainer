// backend/controllers/feedbackController.js
const Feedback = require('../models/feedbackModel');

/**
 * Cria um feedback gerado pela IA
 * (aluno_id é extraído do token; não vem no corpo)
 */
exports.createFeedback = async (req, res) => {
  try {
    const { treino_id, texto_feedback, nota } = req.body;
    const aluno_id = req.user.id; // usuário autenticado

    if (!treino_id || !texto_feedback) {
      return res.status(400).json({ error: 'treino_id e texto_feedback são obrigatórios' });
    }

    const [novoFeedback] = await Feedback.createFeedback({
      aluno_id,
      treino_id,
      texto_feedback,
      nota
    });

    res.status(201).json(novoFeedback);
  } catch (err) {
    console.error('Erro ao criar feedback:', err.message);
    res.status(500).json({ error: 'Erro ao criar feedback' });
  }
};

/**
 * Lista feedbacks do aluno autenticado
 */
exports.getFeedbacksDoAluno = async (req, res) => {
  try {
    const aluno_id = req.user.id;
    const feedbacks = await Feedback.getFeedbacksByAlunoId(aluno_id);
    res.json(feedbacks);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar feedbacks do aluno' });
  }
};

/**
 * Lista feedbacks de um treino específico
 */
exports.getFeedbacksDoTreino = async (req, res) => {
  try {
    const { treino_id } = req.params;
    const feedbacks = await Feedback.getFeedbacksByTreinoId(treino_id);
    res.json(feedbacks);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar feedbacks do treino' });
  }
};

/**
 * Atualiza feedback (caso necessário)
 */
exports.updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Feedback.updateFeedback(id, req.body);

    if (!updated) {
      return res.status(404).json({ error: 'Feedback não encontrado' });
    }
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Erro ao atualizar feedback' });
  }
};

/**
 * Deleta feedback
 */
exports.deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Feedback.deleteFeedback(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Feedback não encontrado' });
    }
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Erro ao deletar feedback' });
  }
};

/**
 * (Admin) Lista todos os feedbacks do sistema
 */
exports.getTodosFeedbacks = async (_req, res) => {
  try {
    const feedbacks = await Feedback.getAllFeedbacks();
    res.json(feedbacks);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar feedbacks' });
  }
};
