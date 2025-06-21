/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('treino_semanal', function (table) {
    table.increments('id').primary();
    table.integer('aluno_id').unsigned().notNullable();
    table.foreign('aluno_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('dia_da_semana').notNullable(); // ex: 'monday', 'tuesday'
    table.string('exercicio').notNullable();
    table.integer('series').notNullable();
    table.integer('repeticoes').notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('treino_semanal');
};
