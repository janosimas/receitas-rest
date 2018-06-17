import { Model, Relation } from "objection";
export declare class IngredientName extends Model {
    static tableName: string;
    readonly id: number;
    ingredientId: number;
    name: string;
}
export declare class Ingredient extends Model {
    static tableName: string;
    readonly id: number;
    names: Array<IngredientName>;
    static relationMappings: {
        names: {
            relation: Relation;
            modelClass: typeof IngredientName;
            join: {
                from: string;
                to: string;
            };
        };
    };
}
