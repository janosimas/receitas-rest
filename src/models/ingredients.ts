import { Model, Relation } from "objection";

export class IngredientName extends Model {
  static tableName: string = 'ingredient-name';
  readonly id!: number;
  ingredientId!: number;
  name!: string;
}

export class Ingredient extends Model {
  static tableName: string = 'ingredients';
  readonly id!: number;
  names!: Array<IngredientName>;

  static relationMappings = {
    names: {
      relation: Model.HasManyRelation,
      modelClass: IngredientName,
      join: {
        from: 'ingredients.id',
        to: 'ingredient-names.ingredientId'
      }
    }
  }
}
