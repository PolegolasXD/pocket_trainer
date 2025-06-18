exports.up = function (knex) {
  return knex.schema.table("feedbacks", function (table) {
    table.string("origem");
  });
};

exports.down = function (knex) {
  return knex.schema.table("feedbacks", function (table) {
    table.dropColumn("origem");
  });
};
