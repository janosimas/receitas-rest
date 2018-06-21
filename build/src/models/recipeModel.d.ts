import { Model, Relation } from 'objection';
import { IngredientModel } from './ingredientModel';
export declare class RecipeModel extends Model {
    static tableName: string;
    readonly id: number;
    name: string;
    ingredients: IngredientModel[];
    cookingMethod?: string;
    static relationMappings: {
        ingredients: {
            relation: Relation;
            modelClass: typeof IngredientModel;
            join: {
                from: string;
                to: string;
            };
        };
    };
}
