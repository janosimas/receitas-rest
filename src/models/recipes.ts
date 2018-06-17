import { Model, Relation } from "objection";
import { Ingredient } from "./ingredients";

export class Recipe extends Model {
  static tableName: string = 'recipes';
  readonly id!: number;
  ingredients!: Array<Ingredient>;
  cookingMethod?: string;

  static relationMappings = {
    ingredients: {
      relation: Model.ManyToManyRelation,
      modelClass: Ingredient,
      join: {
        from: 'recipes.id',
        through: {
          from: 'recipe-ingredients.recipeId',
          to: 'recipe-ingredients.ingredientId'
        },
        to: 'ingredients.id'
      }
    }
  }
}
