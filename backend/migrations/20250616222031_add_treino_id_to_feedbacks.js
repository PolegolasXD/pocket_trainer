exports.up = function (knex) {
  return knex.schema.alterTable('feedbacks', function (table) {
    table.integer('treino_id').unsigned().references('id').inTable('treinos').onDelete('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('feedbacks', function (table) {
    table.dropColumn('treino_id');
  });
};
