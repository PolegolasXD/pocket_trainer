const db = require('../db');

const Treino = {
  createTreino(data) {
    return db('treinos').insert(data).returning('*');
  },

  getAllTreinos() {
    return db('treinos').select('*').orderBy('data', 'desc');
  },

  getTreinosByAlunoId(aluno_id) {
    return db('treinos').where({ aluno_id }).orderBy('data', 'desc');
  },

  getTreinosPorExercicio(exercicio) {
    return db('treinos').where({ exercicio }).orderBy('data', 'desc');
  },

  getEvolucaoPorExercicio(aluno_id, exercicio) {
    return db('treinos')
      .where({ aluno_id, exercicio })
      .orderBy('data', 'asc')
      .select('data', 'carga');
  },

  updateTreino(id, updates) {
    return db('treinos').where({ id }).update(updates).returning('*');
  },

  deleteTreinoById(id) {
    return db('treinos').where({ id }).del();
  },

  countTreinos() {
    return db('treinos').count('id as total').first();
  },

  avgCarga() {
    return db('treinos').avg('carga as media').first();
  },

  avgRepeticoes() {
    return db('treinos').avg('repeticoes as media').first();
  },

  avgDuracao() {
    return db('treinos').avg('duracao_min as media').first();
  },

  getUniqueExercises() {
    return db('treinos').distinct('exercicio').select('exercicio');
  }
};

module.exports = Treino;

