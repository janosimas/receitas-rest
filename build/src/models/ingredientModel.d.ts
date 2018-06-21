import { Model } from 'objection';
export declare class IngredientModel extends Model {
    constructor(name: string);
    static tableName: string;
    readonly id?: number;
    name: string;
}
