import {Model, Relation} from 'objection';
import {IngredientModel} from './ingredientModel';

export class RecipeModel extends Model {
  static tableName = 'recipes';
  readonly id!: number;
  name!: string;
  ingredients!: IngredientModel[];
  cookingMethod?: string;

  static relationMappings = {
    ingredients: {
      relation: Model.HasManyRelation,
      modelClass: IngredientModel,
      join: {
        from: 'recipes.id',
        to: 'recipe-ingredients.recipeId',
      }
    }
  };
}
