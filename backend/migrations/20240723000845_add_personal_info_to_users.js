exports.up = function (knex) {
  return knex.schema.table('users', function (table) {
    table.date('data_nascimento');
    table.float('peso');
    table.float('altura');
    table.string('objetivo');
    table.string('sexo');
  });
};

exports.down = function (knex) {
  return knex.schema.table('users', function (table) {
    table.dropColumn('data_nascimento');
    table.dropColumn('peso');
    table.dropColumn('altura');
    table.dropColumn('objetivo');
    table.dropColumn('sexo');
  });
}; 
