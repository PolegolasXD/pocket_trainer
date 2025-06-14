const db = require('../db');

async function createFeedback(data) {
  return await db('feedbacks').insert(data).returning('*');
}

async function getFeedbacksByAlunoId(aluno_id) {
  return await db('feedbacks')
    .where({ aluno_id })
    .orderBy('created_at', 'desc');
}

async function getFeedbacksByTreinoId(treino_id) {
  return await db('feedbacks')
    .where({ treino_id })
    .orderBy('created_at', 'desc');
}

async function updateFeedback(id, updates) {
  return await db('feedbacks')
    .where({ id })
    .update(updates)
    .returning('*');
}

async function deleteFeedback(id) {
  return await db('feedbacks').where({ id }).del();
}

async function getAllFeedbacks() {
  return await db('feedbacks').select('*').orderBy('created_at', 'desc');
}

module.exports = {
  createFeedback,
  getFeedbacksByAlunoId,
  getFeedbacksByTreinoId,
  updateFeedback,
  deleteFeedback,
  getAllFeedbacks
};
