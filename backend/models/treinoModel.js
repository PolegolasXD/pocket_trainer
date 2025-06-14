const db = require('../db');

async function createTreino(data) {
  return await db('treinos').insert(data).returning('*');
}

async function getTreinosByAlunoId(aluno_id) {
  return await db('treinos').where({ aluno_id }).orderBy('created_at', 'desc');
}

async function updateTreino(id, updates) {
  return await db('treinos').where({ id }).update(updates).returning('*');
}

async function deleteTreinoById(id) {
  return await db('treinos').where({ id }).del();
}

async function getAllTreinos() {
  return await db('treinos').select('*').orderBy('created_at', 'desc');
}

async function countTreinos() {
  const result = await db('treinos').count('id as total');
  return result[0].total;
}

async function avgCarga() {
  const result = await db('treinos').avg('carga as media');
  return Number(result[0].media);
}

async function avgRepeticoes() {
  const result = await db('treinos').avg('repeticoes as media');
  return Number(result[0].media);
}

async function avgDuracao() {
  const result = await db('treinos').avg('duracao_min as media');
  return Number(result[0].media);
}

async function getTreinosPorExercicio(nome) {
  return await db('treinos')
    .whereRaw('LOWER(exercicio) = LOWER(?)', [nome])
    .orderBy('created_at', 'asc');
}

async function getEvolucaoPorExercicio(aluno_id, exercicio) {
  return await db('treinos')
    .where({ aluno_id, exercicio })
    .orderBy('data', 'asc')
    .select('data', 'carga');
}

module.exports = {
  createTreino,
  getTreinosByAlunoId,
  updateTreino,
  deleteTreinoById,
  getAllTreinos,
  countTreinos,
  avgCarga,
  avgRepeticoes,
  avgDuracao,
  getTreinosPorExercicio,
  getEvolucaoPorExercicio,
};

