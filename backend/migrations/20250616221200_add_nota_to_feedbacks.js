exports.up = function (knex) {
  return knex.schema.table('feedbacks', function (table) {
    table.integer('nota').nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.table('feedbacks', function (table) {
    table.dropColumn('nota');
  });
};
