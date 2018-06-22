import { RecipeModel } from './RecipeModel';
export interface InterfaceIngredientModel {
    id: number;
    name: string;
}
export declare class IngredientModel {
    id?: number;
    name?: string;
    recipe?: RecipeModel;
}
