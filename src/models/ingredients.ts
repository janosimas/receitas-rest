import {Model, Relation} from 'objection';

export class Ingredient extends Model {
  static tableName = 'ingredients';
  readonly id!: number;
  name!: string;
}
