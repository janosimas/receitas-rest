import { Model, Relation } from "objection";
import { Ingredient } from "./ingredients";
export declare class Recipe extends Model {
    static tableName: string;
    readonly id: number;
    ingredients: Array<Ingredient>;
    cookingMethod?: string;
    static relationMappings: {
        ingredients: {
            relation: Relation;
            modelClass: typeof Ingredient;
            join: {
                from: string;
                through: {
                    from: string;
                    to: string;
                };
                to: string;
            };
        };
    };
}
