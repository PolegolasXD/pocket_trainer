exports.up = function (knex) {
  return knex.schema.table('treino_semanal', function (table) {
    table.decimal('peso', 8, 2).defaultTo(0).notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.table('treino_semanal', function (table) {
    table.dropColumn('peso');
  });
}; 
