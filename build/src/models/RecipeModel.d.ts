import { IngredientModel, InterfaceIngredientModel } from './IngredientModel';
export interface InterfaceRecipeModel {
    id: number;
    name: string;
    ingredients: InterfaceIngredientModel[];
}
export declare class RecipeModel {
    id?: number;
    name?: string;
    ingredients?: IngredientModel[];
}
