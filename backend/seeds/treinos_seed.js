const dayjs = require('dayjs');

exports.seed = async function (knex) {
  try {
    console.log('Iniciando o seed de treinos...');

    // Deleta TODOS os treinos existentes para evitar duplicatas
    await knex('treinos').del();
    console.log('Registros de treinos antigos foram deletados.');

    // Insere os novos dados de treino para Junho de 2025
    await knex('treinos').insert([
      {
        aluno_id: 1, // Certifique-se que o usuário com ID 1 existe
        data: dayjs('2025-06-16').format('YYYY-MM-DD'),
        exercicio: 'Supino Reto',
        repeticoes: 12,
        carga: 60,
        duracao_min: 45,
      },
      {
        aluno_id: 1,
        data: dayjs('2025-06-18').format('YYYY-MM-DD'),
        exercicio: 'Agachamento Livre',
        repeticoes: 10,
        carga: 80,
        duracao_min: 50,
      },
      {
        aluno_id: 1,
        data: dayjs('2025-06-21').format('YYYY-MM-DD'),
        exercicio: 'Remada Curvada',
        repeticoes: 12,
        carga: 40,
        duracao_min: 40,
      }
    ]);

    console.log('Seed de treinos concluído com sucesso!');
  } catch (error) {
    console.error('Erro ao executar o seed de treinos:', error);
  }
}; 
