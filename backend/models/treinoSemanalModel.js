const db = require('../db');

function getTreinoByAlunoId(aluno_id) {
  return db('treino_semanal').where({ aluno_id });
}

function getExercicioById(id) {
  return db('treino_semanal').where({ id }).first();
}

function addExercicio(exercicio) {
  return db('treino_semanal').insert(exercicio).returning('*');
}

function updateExercicio(id, changes) {
  return db('treino_semanal').where({ id }).update(changes).returning('*');
}

function deleteExercicio(id) {
  return db('treino_semanal').where({ id }).del();
}

module.exports = {
  getTreinoByAlunoId,
  getExercicioById,
  addExercicio,
  updateExercicio,
  deleteExercicio,
}; 
