const db = require('../db');

async function createFeedback(data) {

  return db('feedbacks').insert(data).returning('*');
}

async function getFeedbacksByAlunoId(aluno_id) {
  return db('feedbacks')
    .where({ aluno_id })
    .orderBy('created_at', 'desc');
}

async function getFeedbacksByTreinoId(treino_id) {
  return db('feedbacks')
    .where({ treino_id })
    .orderBy('created_at', 'desc');
}

async function updateFeedback(id, updates) {
  return db('feedbacks')
    .where({ id })
    .update(updates)
    .returning('*');
}

async function deleteFeedback(id) {
  return db('feedbacks').where({ id }).del();
}

async function getAllFeedbacks() {
  return db('feedbacks').select('*').orderBy('created_at', 'desc');
}

async function getFeedbacksByOrigem(origem) {
  return db('feedbacks').where({ origem }).select('*').orderBy('created_at', 'desc');
}

module.exports = {
  createFeedback,
  getFeedbacksByAlunoId,
  getFeedbacksByTreinoId,
  updateFeedback,
  deleteFeedback,
  getAllFeedbacks,
  getFeedbacksByOrigem
};
