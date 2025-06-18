exports.up = function (knex) {
  return knex.schema.createTable("mensagens", (table) => {
    table.increments("id").primary();
    table
      .integer("feedback_id")
      .unsigned()
      .references("id")
      .inTable("feedbacks")
      .onDelete("CASCADE")
      .notNullable();
    table
      .enum("sender", ["user", "ai"])
      .notNullable()
      .comment("Indica quem enviou a mensagem");
    table.text("texto").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("mensagens");
};
