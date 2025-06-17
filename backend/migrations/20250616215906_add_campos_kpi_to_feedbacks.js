exports.up = function (knex) {
  return knex.schema.table('feedbacks', function (table) {
    table.integer('carga').nullable();
    table.integer('repeticoes').nullable();
    table.integer('duracao').nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.table('feedbacks', function (table) {
    table.dropColumn('carga');
    table.dropColumn('repeticoes');
    table.dropColumn('duracao');
  });
};
