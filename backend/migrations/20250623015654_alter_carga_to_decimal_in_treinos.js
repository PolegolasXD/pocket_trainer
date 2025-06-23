/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable('treinos', function (table) {
    table.decimal('carga', 10, 2).notNullable().defaultTo(0.00).alter();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable('treinos', function (table) {
    table.integer('carga').notNullable().alter();
  });
};
