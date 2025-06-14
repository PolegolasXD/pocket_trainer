exports.up = function (knex) {
  return knex.schema.table('users', function (table) {
    table.string('role').notNullable().defaultTo('aluno');
  });
};

exports.down = function (knex) {
  return knex.schema.table('users', function (table) {
    table.dropColumn('role');
  });
};
