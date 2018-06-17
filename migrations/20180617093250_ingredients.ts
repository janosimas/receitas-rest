import Knex, { CreateTableBuilder } from "knex";

exports.up = function (knex: Knex): Promise<any> {
  return Promise.all([
    knex.schema.createTable('ingredients', (table: CreateTableBuilder) => {
      table.increments('id').primary().unsigned();
    }),
    knex.schema.createTable('ingredient-names', (table: CreateTableBuilder) => {
      table.increments('id').primary().unsigned();
      table.string('name').notNullable().unique();
      table.integer('ingredientId').references('ingredients.id').notNullable();
    })
  ]);
};

exports.down = function (knex: Knex): Promise<any> {
  return Promise.all([
    knex.schema.dropTableIfExists('ingredient-names'),
    knex.schema.dropTableIfExists('ingredients')
  ]);
};
