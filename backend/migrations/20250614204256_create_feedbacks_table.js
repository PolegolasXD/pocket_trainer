exports.up = function (knex) {
  return knex.schema.createTable('feedbacks', function (table) {
    table.increments('id').primary();
    table.integer('aluno_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.string('resposta').notNullable();
    table.json('analise').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('feedbacks');
};
