exports.up = function (knex) {
  return knex.schema.createTable('treinos', table => {
    table.increments('id').primary();
    table.integer('aluno_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.date('data').notNullable();
    table.string('exercicio').notNullable();
    table.integer('repeticoes').notNullable();
    table.integer('carga').notNullable();
    table.integer('duracao_min');
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('treinos');
};
