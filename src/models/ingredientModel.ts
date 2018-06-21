import {Model, Relation} from 'objection';

export class IngredientModel extends Model {
  constructor(name: string) {
    super();
    this.id = undefined;
    this.name = name;
  }
  static tableName = 'recipe-ingredients';
  readonly id?: number;
  name!: string;
}
