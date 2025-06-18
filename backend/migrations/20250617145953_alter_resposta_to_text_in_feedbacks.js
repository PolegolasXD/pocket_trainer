exports.up = function (knex) {
  return knex.schema.alterTable("feedbacks", function (table) {
    table.text("resposta").alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("feedbacks", function (table) {
    table.string("resposta", 255).alter();
  });
};
