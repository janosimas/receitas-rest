import Knex, { CreateTableBuilder } from "knex";

exports.up = function (knex: Knex): Promise<any> {
  return Promise.all([
    knex.schema.createTable('ingredients', (table: CreateTableBuilder) => {
      table.increments('id').primary().unsigned();
      table.string('name').unique();
    })
  ]);
};

exports.down = function (knex: Knex): Promise<any> {
  return Promise.all([
    knex.schema.dropTableIfExists('ingredients')
  ]);
};
