import { RecipeModel } from './RecipeModel';
export interface InterfaceIngredientModel {
    id: number;
    name: string;
    quantity: number;
    unit: string;
}
export declare class IngredientModel {
    id?: number;
    name: string;
    quantity?: number;
    unit?: string;
    recipe?: RecipeModel;
}
