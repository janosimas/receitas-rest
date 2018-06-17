import Knex, { CreateTableBuilder } from "knex";

exports.up = function (knex: Knex): Promise<any> {
  return Promise.all([
    knex.schema.createTable('recipes', (table: CreateTableBuilder) => {
      table.increments('id').primary().unsigned();
      table.string('name').unique().notNullable();
      table.string('cookingMethod').nullable();
    }),
    knex.schema.createTable('recipe-ingredients', (table: CreateTableBuilder) => {
      table.increments('id').primary().unsigned();
      table.integer('ingredientId').references('ingredients.id').notNullable();
      table.integer('recipeId').references('recipes.id').notNullable();
    })
  ]);
};

exports.down = function (knex: Knex): Promise<any> {
  return Promise.all([
    knex.schema.dropTableIfExists('recipe-ingredients'),
    knex.schema.dropTableIfExists('recipes')
  ]);
};
